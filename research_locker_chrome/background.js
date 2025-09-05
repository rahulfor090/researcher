// background.js
const API_BASE = "http://localhost:5000/v1"; // change in prod

async function getToken() {
  const { token } = await chrome.storage.local.get("token");
  return token || null;
}
async function setToken(token) {
  await chrome.storage.local.set({ token });
}
async function clearToken() {
  await chrome.storage.local.remove("token");
}

async function apiFetch(path, opts = {}) {
  const token = await getToken();
  const headers = Object.assign(
    { "Content-Type": "application/json" },
    opts.headers || {},
    token ? { "Authorization": "Bearer " + token } : {}
  );
  const res = await fetch(`${API_BASE}${path}`, { ...opts, headers });
  if (res.status === 401) throw new Error("UNAUTHORIZED");
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(t || `HTTP ${res.status}`);
  }
  return res.json();
}

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  (async () => {
    try {
      switch (msg?.type) {
        case "LOGIN": {
          const data = await apiFetch("/auth/login", {
            method: "POST",
            body: JSON.stringify({ email: msg.email, password: msg.password })
          });
          await setToken(data.token);
          sendResponse({ ok: true, user: data.user });
          break;
        }
        case "GOOGLE_LOGIN": {
          // Open a new tab with the Google OAuth endpoint
          chrome.tabs.create({ url: `${API_BASE}/auth/google` }, (tab) => {
            // Listen for changes in the tab URL to detect successful authentication
            const tabId = tab.id;
            const listener = async (tabId, changeInfo) => {
              // Check if the URL contains token and user parameters
              if (changeInfo.url && changeInfo.url.includes('token=')) {
                try {
                  const url = new URL(changeInfo.url);
                  const token = url.searchParams.get('token');
                  if (token) {
                    await setToken(token);
                    // Close the tab after successful authentication
                    chrome.tabs.remove(tabId);
                    // Remove the listener
                    chrome.tabs.onUpdated.removeListener(listener);
                  }
                } catch (error) {
                  console.error('Error processing Google auth callback:', error);
                }
              }
            };
            
            // Add the listener for this specific tab
            chrome.tabs.onUpdated.addListener((updatedTabId, changeInfo) => {
              if (updatedTabId === tabId) {
                listener(tabId, changeInfo);
              }
            });
          });
          
          sendResponse({ ok: true });
          break;
        }
        case "LOGOUT": {
          await clearToken();
          sendResponse({ ok: true });
          break;
        }
        case "GET_AUTH_STATE": {
          const token = await getToken();
          sendResponse({ ok: true, isLoggedIn: !!token });
          break;
        }
        case "SAVE_ARTICLE": {
          const saved = await apiFetch("/articles", {
            method: "POST",
            body: JSON.stringify(msg.article)
          });
          sendResponse({ ok: true, article: saved });
          break;
        }
        default:
          sendResponse({ ok: false, error: "Unknown message" });
      }
    } catch (e) {
      if (e.message === "UNAUTHORIZED") {
        await clearToken();
        sendResponse({ ok: false, error: "Unauthorized. Please log in again." });
      } else {
        sendResponse({ ok: false, error: e.message });
      }
    }
  })();
  return true; // async
});
