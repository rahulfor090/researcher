function $(id) { return document.getElementById(id); }
function show(idToShow) {
  ["authView", "saveView", "postSaveView"].forEach(id => {
    const el = $(id);
    if (el) el.classList.add("hidden");
  });
  const showEl = $(idToShow);
  if (showEl) showEl.classList.remove("hidden");
}

// Helper to get/set temp user ID in localStorage/cookie
function getTempUserId() {
  let match = document.cookie.match(/(^|;)tempUserId=([^;]*)/);
  if (match) return match[2];
  return localStorage.getItem('tempUserId');
}
function setTempUserId(id) {
  document.cookie = `tempUserId=${id}; path=/;`;
  localStorage.setItem('tempUserId', id);
}
function clearTempUserId() {
  document.cookie = "tempUserId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  localStorage.removeItem('tempUserId');
}

function getMainUserId() {
  let match = document.cookie.match(/(^|;)mainUserId=([^;]*)/);
  if (match) return match[2];
  return localStorage.getItem('mainUserId');
}
function setMainUserId(id) {
  document.cookie = `mainUserId=${id}; path=/;`;
  localStorage.setItem('mainUserId', id);
}

function fullyClearTempUser() {
  clearTempUserId();
  document.cookie = "tempUserId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  localStorage.removeItem('tempUserId');
}

// UI state
function updateAuthViewButtons() {
  const mainUserId = getMainUserId();
  if (mainUserId) {
    if ($("loginBtn")) $("loginBtn").textContent = "Logout";
    if ($("registerBtn")) $("registerBtn").style.display = "none";
  } else {
    if ($("loginBtn")) $("loginBtn").textContent = "Login";
    if ($("registerBtn")) $("registerBtn").style.display = "block";
  }
}
function updateAuthUI(isLoggedIn) {
  if ($("logoutBtn")) $("logoutBtn").style.display = isLoggedIn ? "block" : "none";
}

// Tab helpers
async function getActiveTabId() {
  return new Promise(resolve => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => resolve(tabs[0]?.id));
  });
}
async function getArticleFromTab() {
  const tabId = await getActiveTabId();
  return new Promise(resolve => {
    chrome.tabs.sendMessage(tabId, { type: "GET_ARTICLE_DATA" }, resolve);
  });
}
async function getUserLibraryInfo(userId, isTemp = false) {
  return new Promise(resolve => {
    chrome.runtime.sendMessage({ type: "GET_USER_LIBRARY_INFO", userId, isTemp }, resolve);
  });
}

// UI limit message
function showLimitMessage(show, message = "", showUpgrade = false, showLogin = false, showRegister = false) {
  const limitDiv = $("limitMessage");
  const saveBtn = $("saveBtn");
  const msgText = $("limitMessageText");
  const loginLimitBtn = $("loginLimitBtn");
  const registerLimitBtn = $("registerLimitBtn");
  const upgradeBtn = $("upgradeBtn");
  if (limitDiv) {
    if (show) {
      if (msgText) msgText.innerHTML = message;
      limitDiv.classList.remove("hidden");
      if (saveBtn) saveBtn.disabled = true;
      if (loginLimitBtn) loginLimitBtn.style.display = showLogin ? "block" : "none";
      if (registerLimitBtn) registerLimitBtn.style.display = showRegister ? "block" : "none";
      if (upgradeBtn) upgradeBtn.style.display = showUpgrade ? "block" : "none";
    } else {
      limitDiv.classList.add("hidden");
      if (saveBtn) saveBtn.disabled = false;
      if (loginLimitBtn) loginLimitBtn.style.display = "none";
      if (registerLimitBtn) registerLimitBtn.style.display = "none";
      if (upgradeBtn) upgradeBtn.style.display = "none";
    }
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  show("saveView");
  updateAuthViewButtons();
  showLimitMessage(false, "", false, false, false);

  let mainUserId = getMainUserId();
  let tempUserId = getTempUserId();
  let isLoggedIn = !!mainUserId;

  updateAuthUI(isLoggedIn);

  const article = await getArticleFromTab();
  if (article) {
    $("articleTitle").value = article.title || "";
    $("articleAuthors").value = article.authors || "";
    $("articleDoi").value = article.doi || "";
    $("articleUrl").value = article.url || "";
  }

  $("saveBtn").onclick = async () => {
    const a = { ...article };
    if (!a) {
      showLimitMessage(true, "❌ No article detected on this page.", false, false, false);
      return;
    }
    a.title = $("articleTitle").value.trim();
    a.authors = $("articleAuthors").value.trim();
    a.doi = $("articleDoi").value.trim();
    a.url = $("articleUrl").value.trim();

    let mainUserId = getMainUserId();
    let tempUserId = getTempUserId();
    let isLoggedIn = !!mainUserId;
    let userId = isLoggedIn ? mainUserId : tempUserId;
    let isTemp = !isLoggedIn;

    // If tempUserId is needed, create via content script and set in storage
    if (!isLoggedIn && !tempUserId) {
      const tabId = await getActiveTabId();
      tempUserId = await new Promise(resolve => {
        chrome.tabs.sendMessage(tabId, { type: "CREATE_TEMP_USER" }, res => resolve(res?.tempUserId));
      });
      setTempUserId(tempUserId);
      userId = tempUserId;
      isTemp = true;
    }

    let info = null;
    try {
      info = await getUserLibraryInfo(userId, isTemp);
    } catch (e) {
      info = null;
    }

    // Defensive: Always log info for debugging
    console.log("[DEBUG] Temp/Main user info:", info);

    if (isTemp) {
      // If temp user has already saved an article, block and only show Login
      if (info && typeof info.articleCount === "number" && info.articleCount >= 1) {
        // Only show login button, not register, in this scenario!
        showLimitMessage(
          true,
          "🚫 Temp user can only save one article. Please log in to save more.",
          false,
          true,   // showLogin
          false   // NO register
        );
        // Hide the register button in auth view too
        if ($("registerBtn")) $("registerBtn").style.display = "none";
        // When loginLimitBtn is clicked, show the login form only
        $("loginLimitBtn").onclick = () => {
          show("authView");
          if ($("registerBtn")) $("registerBtn").style.display = "none";
          if ($("loginBtn")) $("loginBtn").style.display = "block";
        };
        return;
      } else {
        showLimitMessage(false, "", false, false, false);
        if ($("registerBtn")) $("registerBtn").style.display = "block";
      }
    } else if (info) {
      if (info?.plan === "free" && typeof info.articleCount === "number" && info.articleCount >= 10) {
        showLimitMessage(
          true,
          "🚫 Article limit reached. Free accounts can save up to 10 articles.",
          true, false, false
        );
        return;
      }
      if (info?.plan !== "pro" && info?.plan !== "free") {
        showLimitMessage(
          true,
          "🚫 Article limit reached. Free accounts can save up to 10 articles.",
          true, false, false
        );
        return;
      }
    }

    chrome.runtime.sendMessage({
      type: "SAVE_ARTICLE",
      article: a,
      userId,
      isTemp
    }, (res) => {
      if (res?.ok) {
        show("postSaveView");
        if ($("postSaveSuccessMsg")) 
          $("postSaveSuccessMsg").textContent = "Successfully saved! Go to your Locker to view.";
      } else {
        showLimitMessage(false, "", false, false, false);
        if (res?.message && res.message.includes("Article limit reached")) {
          showLimitMessage(true, res.message, true, false, false);
        } else if (res?.message && res.message.includes("same URL or DOI")) {
          showLimitMessage(true, res.message, false, false, false);
        } else if (res?.message) {
          showLimitMessage(true, res.message, false, false, false);
        } else if (res?.error) {
          try {
            const errObj = JSON.parse(res.error);
            if (errObj.message && errObj.message.includes("Article limit reached")) {
              showLimitMessage(true, errObj.message, true, false, false);
            } else if (errObj.message) {
              showLimitMessage(true, errObj.message, false, false, false);
            } else {
              showLimitMessage(true, "❌ " + res.error, false, false, false);
            }
          } catch {
            showLimitMessage(true, "❌ " + res.error, false, false, false);
          }
        } else {
          showLimitMessage(true, "❌ Save failed", false, false, false);
        }
      }
    });
  };

  $("goToLockerBtn").onclick = () => {
    chrome.tabs.create({ url: "http://localhost:5173/dashboard" });
    window.close();
  };

  $("closeExtensionBtn").onclick = () => {
    window.close();
  };

  // Login/Logout (toggle)
  $("loginBtn").onclick = async () => {
    const isLoggedIn = !!getMainUserId();
    if (isLoggedIn) {
      // Logout
      chrome.runtime.sendMessage({ type: "LOGOUT" }, (res) => {
        if (res?.ok) {
          fullyClearTempUser();
          setMainUserId("");
          updateAuthUI(false);
          updateAuthViewButtons();
          show("authView");
        }
      });
    } else {
      // Login
      const email = $("email").value.trim();
      const password = $("password").value;
      chrome.runtime.sendMessage({ type: "LOGIN", email, password }, (res) => {
        if (res?.ok) {
          const tempUserId = getTempUserId();
          if (tempUserId) {
            chrome.runtime.sendMessage({
              type: "MIGRATE_TEMP_ARTICLES",
              tempUserId,
              mainUserId: res.userId
            }, (migrateRes) => {
              if (migrateRes?.ok) {
                showLimitMessage(false, "", false, false, false);
                show("saveView");
              } else {
                alert("Migration error: " + (migrateRes?.error || "Unknown error"));
              }
            });
            fullyClearTempUser();
          }
          setMainUserId(res.userId);
          updateAuthUI(true);
          updateAuthViewButtons();
          show("postSaveView");
          if ($("postSaveSuccessMsg")) 
            $("postSaveSuccessMsg").textContent = "Login successful! Go to your Locker to view.";
        } else {
          alert(res?.error || "Login failed");
        }
      });
    }
  };

  $("registerBtn").onclick = () => {
    window.open("http://localhost:5173/", "_blank");
  };

  // Hide register on login-required state and only show login
  $("loginLimitBtn").onclick = () => {
    show("authView");
    if ($("registerBtn")) $("registerBtn").style.display = "none";
    if ($("loginBtn")) $("loginBtn").style.display = "block";
  };

  // Even in other cases, open register
  $("registerLimitBtn").onclick = () => {
    window.open("http://localhost:5173/", "_blank");
  };

  $("logoutBtn").onclick = () => {
    chrome.runtime.sendMessage({ type: "LOGOUT" }, (res) => {
      if (res?.ok) {
        fullyClearTempUser();
        setMainUserId("");
        updateAuthUI(false);
        updateAuthViewButtons();
        show("authView");
      }
    });
  };

  $("upgradeBtn").onclick = () => {
    chrome.tabs.create({ url: "http://localhost:5173/upgrade" });
    window.close();
  };

  ["articleTitle", "articleAuthors", "articleDoi", "articleUrl", "notes"].forEach(id => {
    const el = $(id);
    if (el) {
      el.addEventListener('input', () => showLimitMessage(false, "", false, false, false));
    }
  });

  // Initial limit check: only if a user exists
  mainUserId = getMainUserId();
  tempUserId = getTempUserId();
  isLoggedIn = !!mainUserId;

  if (mainUserId) {
    let info = null;
    try {
      info = await getUserLibraryInfo(mainUserId, false);
    } catch (e) { info = null; }
    if (info?.plan === "free" && typeof info.articleCount === "number" && info.articleCount >= 10) {
      showLimitMessage(true, "🚫 Article limit reached. Free accounts can save up to 10 articles.", true, false, false);
    } else {
      showLimitMessage(false, "", false, false, false);
    }
  } else if (tempUserId) {
    let info = null;
    try {
      info = await getUserLibraryInfo(tempUserId, true);
    } catch (e) { info = null; }
    if (info && typeof info.articleCount === "number" && info.articleCount >= 1) {
      showLimitMessage(true, "🚫 Temp user can only save one article. Please log in to save more.", false, true, false);
      if ($("registerBtn")) $("registerBtn").style.display = "none";
    } else {
      showLimitMessage(false, "", false, false, false);
      if ($("registerBtn")) $("registerBtn").style.display = "block";
    }
  } else {
    showLimitMessage(false, "", false, false, false);
    if ($("registerBtn")) $("registerBtn").style.display = "block";
  }
});

// Optional: clear temp user on popup close for a clean state
window.addEventListener("unload", function() {
  clearTempUserId();
});