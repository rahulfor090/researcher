function $(id) { return document.getElementById(id); }
function show(idToShow) {
  ["authView","saveView", "postSaveView"].forEach(id => $(id).classList.add("hidden"));
  $(idToShow).classList.remove("hidden");
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

  // Google Login
  $('googleLoginBtn').onclick = async () => {
    chrome.runtime.sendMessage({ type: 'GOOGLE_LOGIN' }, (res) => {
      if (res?.error) {
        alert(res.error || 'Google login failed');
      }
      // The actual login will be handled by the background script opening a new tab
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
    const a = { ...article }; // Create a copy to modify
    if (!a) return alert("No article detected on this page.");

    a.title = $("articleTitle").value.trim();
    a.authors = $("articleAuthors").value.trim();
    a.doi = $("articleDoi").value.trim();
    a.url = $("articleUrl").value.trim();
    a.notes = $("notes").value.trim();

    chrome.runtime.sendMessage({ type: "SAVE_ARTICLE", article: a }, (res) => {
      if (res?.ok) {
        show("postSaveView");
      } else {
        alert("❌ " + (res?.error || "Save failed"));
      }
    });
  };

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
});
