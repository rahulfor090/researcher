function $(id) { return document.getElementById(id); }
function show(idToShow) {
  ["authView","saveView", "postSaveView"].forEach(id => {
    const el = $(id);
    if (el) el.classList.add("hidden");
  });
  const showEl = $(idToShow);
  if (showEl) showEl.classList.remove("hidden");
}

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

async function refreshAuthState() {
  return new Promise(resolve => {
    chrome.runtime.sendMessage({ type: "GET_AUTH_STATE" }, resolve);
  });
}

// Fetch articles count & plan from backend or local storage
async function getUserLibraryInfo() {
  return new Promise(resolve => {
    chrome.runtime.sendMessage({ type: "GET_USER_LIBRARY_INFO" }, resolve);
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const st = await refreshAuthState();
  if (st?.isLoggedIn) show("saveView"); else show("authView");

  // Login
  $("loginBtn").onclick = async () => {
    const email = $("email").value.trim();
    const password = $("password").value;
    chrome.runtime.sendMessage({ type: "LOGIN", email, password }, (res) => {
      if (res?.ok) {
        show("saveView");
      } else {
        alert(res?.error || "Login failed");
      }
    });
  };

  // Populate preview
  const article = await getArticleFromTab();
  if (article) {
    $("articleTitle").value = article.title || "";
    $("articleAuthors").value = article.authors || "";
    $("articleDoi").value = article.doi || "";
    $("articleUrl").value = article.url || "";
  }

  // Save
  $("saveBtn").onclick = async () => {
    const a = { ...article };
    if (!a) {
      showLimitMessage(true, "❌ No article detected on this page.", false);
      return;
    }

    a.title = $("articleTitle").value.trim();
    a.authors = $("articleAuthors").value.trim();
    a.doi = $("articleDoi").value.trim();
    a.url = $("articleUrl").value.trim();
    a.notes = $("notes").value.trim();

    const info = await getUserLibraryInfo();

    // Only allow save if plan is "pro" or free has <10 articles
    if (info?.plan === "free" && info?.articleCount >= 10) {
      showLimitMessage(
        true,
        "🚫 Article limit reached. Free accounts can save up to 10 articles.",
        true // showUpgrade
      );
      return;
    }
    if (info?.plan !== "pro" && info?.plan !== "free") {
      // fallback: treat as free plan for safety 
      showLimitMessage(
        true,
        "🚫 Article limit reached. Free accounts can save up to 10 articles.",
        true
      );
      return;
    }

    chrome.runtime.sendMessage({ type: "SAVE_ARTICLE", article: a }, (res) => {
      if (res?.ok) {
        show("postSaveView");
      } else {
        if (res?.message && res.message.includes("Article limit reached")) {
          showLimitMessage(true, res.message, true); // show upgrade button
        } else if (res?.message && res.message.includes("same URL or DOI")) {
          showLimitMessage(true, res.message, false); // hide upgrade button
        } else if (res?.message) {
          showLimitMessage(true, res.message, false);
        } else if (res?.error) {
          try {
            const errObj = JSON.parse(res.error);
            if (errObj.message && errObj.message.includes("Article limit reached")) {
              showLimitMessage(true, errObj.message, true);
            } else if (errObj.message) {
              showLimitMessage(true, errObj.message, false);
            } else {
              showLimitMessage(true, "❌ " + res.error, false);
            }
          } catch {
            showLimitMessage(true, "❌ " + res.error, false);
          }
        } else {
          showLimitMessage(true, "❌ Save failed", false);
        }
      }
    });
  };

  // Show/hide limit message & disable save
  function showLimitMessage(show, message = "", showUpgrade = false) {
    const limitDiv = $("limitMessage");
    const saveBtn = $("saveBtn");
    const msgText = $("limitMessageText");

    if (limitDiv) {
      if (show) {
        if (msgText) {
          msgText.innerHTML = message;
          if (showUpgrade) {
            msgText.innerHTML += "<br><button id='upgradeBtn' class='btn btn-upgrade'>Upgrade</button>";
          }
        }
        limitDiv.classList.remove("hidden");
        if (saveBtn) saveBtn.disabled = true;
      } else {
        limitDiv.classList.add("hidden");
        if (saveBtn) saveBtn.disabled = false;
      }
    }
  }

  $("goToLockerBtn").onclick = () => {
    chrome.tabs.create({ url: "http://localhost:5173/" });
    window.close();
  };

  $("closeExtensionBtn").onclick = () => {
    window.close();
  };

  // Logout
  $("logoutBtn").onclick = () => {
    chrome.runtime.sendMessage({ type: "LOGOUT" }, (res) => {
      if (res?.ok) show("authView");
    });
  };

  // Upgrade button in limit message
  document.body.addEventListener("click", function(e) {
    if (e.target && e.target.id === "upgradeBtn") {
      chrome.tabs.create({ url: "http://localhost:5173/upgrade" });
      window.close();
    }
  });

  // Hide limit message on edit
  ["articleTitle", "articleAuthors", "articleDoi", "articleUrl", "notes"].forEach(id => {
    const el = $(id);
    if (el) {
      el.addEventListener('input', () => showLimitMessage(false));
    }
  });

  // On initial load, check and show limit message if already at 10
  const info = await getUserLibraryInfo();
  if (info?.plan === "free" && info?.articleCount >= 10) {
    showLimitMessage(true, "🚫 Article limit reached. Free accounts can save up to 10 articles.", true);
  } else {
    showLimitMessage(false);
  }
});