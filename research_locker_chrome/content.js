// content.js
(function () {
  const meta = (name) => document.querySelector(`meta[name="${name}"]`)?.content || "";

  const articleData = {
    title: meta("citation_title") || document.title || "",
    authors: Array.from(document.querySelectorAll('meta[name="citation_author"], .author-list .author-name, [data-author-name]'))
      .map(m => m.content || m.textContent.trim()).join(", "),
    journal: meta("citation_journal_title") || "",
    doi: meta("citation_doi") || (document.body.innerText.match(/\b10\.\d{4,9}\/[-._;()/:A-Z0-9]+/i)?.[0] || ""),
    url: location.href,
    abstract: meta("citation_abstract") || meta("description") || "",
    purchaseDate: new Date().toISOString().slice(0,10),
    price: null,
    tags: []
  };

  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg?.type === "GET_ARTICLE_DATA") sendResponse(articleData);
  });

  // Listen for save requests coming from the web app (dashboard)
  // The web app posts a message with the article payload; we forward it to the extension background
  window.addEventListener("message", (event) => {
    try {
      const data = event?.data || {};
      if (data?.source !== "research-locker-web") return;
      if (data?.type !== "SAVE_ARTICLE") return;
      const article = data.article || {};
      chrome.runtime.sendMessage({ type: "SAVE_ARTICLE", article }, (res) => {
        // Notify the page about the result so the UI can react
        window.postMessage({
          source: "research-locker-ext",
          type: "SAVE_RESULT",
          ok: !!res?.ok,
          error: res?.error || null,
          article: res?.article || null
        }, "*");
      });
    } catch (_) {
      // no-op
    }
  });
})();
