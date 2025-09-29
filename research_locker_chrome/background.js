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

// Improved error handling: Always return just the message string, not a JSON blob
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
    let errMsg = `HTTP ${res.status}`;
    try {
      const data = await res.json();
      errMsg = data.message || JSON.stringify(data) || errMsg;
    } catch {
      // fallback to text if not JSON
      const t = await res.text().catch(() => "");
      if (t) errMsg = t;
    }
    throw new Error(errMsg);
  }
  return res.json();
}

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  (async () => {
    try {
      switch (msg?.type) {
        case "LOGIN": {
          try {
            const data = await apiFetch("/auth/login", {
              method: "POST",
              body: JSON.stringify({ email: msg.email, password: msg.password })
            });
            await setToken(data.token);
            sendResponse({ ok: true, user: data.user, userId: data.user.id });
          } catch (e) {
            sendResponse({ ok: false, error: e.message });
          }
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
          try {
            // If isTemp, save to temp endpoint
            const path = msg.isTemp ? "/temp-articles" : "/articles";
            const payload = Object.assign({}, msg.article, {
              userId: msg.userId
            });
            const saved = await apiFetch(path, {
              method: "POST",
              body: JSON.stringify(payload)
            });
            sendResponse({ ok: true, article: saved });
          } catch (e) {
            sendResponse({ ok: false, error: e.message, message: e.message });
          }
          break;
        }
        case "GET_USER_LIBRARY_INFO": {
          try {
            let info;
            if (msg.isTemp) {
              // Get info for temp user
              info = await apiFetch(`/temp-users/${msg.userId}/library-info`);
              sendResponse({
                plan: "temp",
                articleCount: info.articleCount
              });
            } else {
              // Get info for main user
              info = await apiFetch("/users/me/library-info");
              sendResponse({
                plan: info.plan,
                articleCount: info.articleCount
              });
            }
          } catch (e) {
            // Defensive: treat missing temp user as zero articles
            sendResponse({
              plan: msg.isTemp ? "temp" : "free",
              articleCount: 0,
              error: e.message
            });
          }
          break;
        }
        case "MIGRATE_TEMP_ARTICLES": {
          try {
            // Backend should handle moving articles from temp to main user
            const res = await apiFetch("/temp-articles/migrate", {
              method: "POST",
              body: JSON.stringify({
                tempUserId: msg.tempUserId,
                mainUserId: msg.mainUserId
              })
            });
            sendResponse({ ok: true, migrated: res.migratedCount });
          } catch (e) {
            sendResponse({ ok: false, error: e.message });
          }
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