(function () {
  function getCookie(name) {
    const cookies = document.cookie.split(';').map(cookie => cookie.trim());
    const match = cookies.find(cookie => cookie.startsWith(`${name}=`));
    return match ? match.split('=')[1] : null;
  }

  function hasLoggedInBefore(cookieName = 'mainUserId') {
    const mainUserId = getCookie(cookieName) || localStorage.getItem('mainUserId');
    return !!mainUserId;
  }

  function getTempUserId() {
    return getCookie('tempUserId') || localStorage.getItem('tempUserId') || null;
  }

  function setTempUserId(tempUserId) {
    document.cookie = `tempUserId=${tempUserId}; path=/;`;
    localStorage.setItem('tempUserId', tempUserId);
    return tempUserId;
  }

  function clearTempUserId() {
    document.cookie = "tempUserId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    localStorage.removeItem('tempUserId');
  }

  function generateUUIDv4() {
    if (window.crypto && window.crypto.getRandomValues) {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = crypto.getRandomValues(new Uint8Array(1))[0] % 16;
        var v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    } else {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
          v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
  }

  function getMeta(name, prop = "name") {
    return document.querySelector(`meta[${prop}="${name}"]`)?.content || "";
  }

  function getTitle() {
    return (
      getMeta("citation_title") ||
      getMeta("dc.title") ||
      document.querySelector("h1")?.textContent?.trim() ||
      document.title ||
      ""
    );
  }

  function getAuthors() {
    const metaAuthors = Array.from(
      document.querySelectorAll('meta[name="citation_author"], meta[name="dc.creator"]')
    )
      .map(m => cleanAuthorName(m.content))
      .filter(Boolean);

    if (metaAuthors.length) return metaAuthors.join(", ");

    const unwantedString = "Author links open overlay panel";
    const authorSelectors = [
      '.author-list .author-name',
      '[data-author-name]',
      '.author-group',
      '.Authors',
      '.author-block',
    ];

    for (const selector of authorSelectors) {
      const block = document.querySelector(selector);
      if (block) {
        const authors = [];
        block.querySelectorAll('a, span, .author-name').forEach(el => {
          let name = el.textContent.replace(/[, ]+$/, '').trim();
          name = name.replace(/\s+/g, ' ');
          if (
            name &&
            name.length > 2 &&
            !el.querySelector('svg, img') &&
            !el.classList.contains('icon') &&
            !el.classList.contains('email-icon') &&
            name.match(/[a-zA-Z]/) &&
            !name.toLowerCase().includes(unwantedString.toLowerCase())
          ) {
            authors.push(cleanAuthorName(name));
          }
        });
        if (authors.length) return authors.join(", ");
      }
    }

    const wildAuthors = Array.from(
      document.querySelectorAll('.author, .authors, a[title*="Author"]')
    )
      .map(m => cleanAuthorName(m.textContent.trim().replace(/\s+/g, ' ')))
      .filter(Boolean);
    if (wildAuthors.length) return wildAuthors.join(", ");

    const bodyText = document.body.innerText;
    const semicolonMatch = bodyText.match(
      /([A-Z][a-z]+,\s*[A-Z][a-z]+[^;]+(?:;\s*[A-Z][a-z]+,\s*[A-Z][a-z]+[^;]+)+)/
    );
    if (semicolonMatch) {
      const rawAuthors = semicolonMatch[0]
        .split(";")
        .map(a => cleanAuthorName(a))
        .filter(Boolean);

      const cleaned = rawAuthors.filter(a => !/author information|abstract|doi|buy|erratum/i.test(a));
      if (cleaned.length) return cleaned.join(", ");
    }

    return Array.from(
      document.querySelectorAll('.author-list .author-name, [data-author-name]')
    )
      .map(m => cleanAuthorName(m.textContent.trim().replace(/\s+/g, ' ')))
      .filter(Boolean)
      .join(", ");
  }

  function cleanAuthorName(name) {
    if (!name) return "";
    let cleaned = name
      .replace(/#\s*\d+/g, "")
      .replace(/\d+/g, "")
      .replace(/[†*]/g, "")
      .replace(/\s+/g, " ")
      .replace(/[, ]+$/, "")
      .trim();

    const m = cleaned.match(/^([^,]+),\s*(.+)$/);
    if (m) {
      cleaned = `${m[2]} ${m[1]}`.trim();
    }
    return cleaned;
  }

  function getJournal() {
    return (
      getMeta("citation_journal_title") ||
      getMeta("prism.publicationName") ||
      getMeta("dc.source") ||
      ""
    );
  }

  function getDOI() {
    return (
      getMeta("citation_doi") ||
      getMeta("dc.identifier") ||
      (document.body.innerText.match(/\b10\.\d{4,9}\/[-._;()/:A-Z0-9]+/i)?.[0] || "")
    );
  }

  function getAbstract() {
    return (
      getMeta("citation_abstract") ||
      getMeta("description") ||
      getMeta("dc.description") ||
      document.querySelector('.abstract, [itemprop="description"]')?.textContent.trim() ||
      ""
    );
  }

  function getArticleData() {
    const loggedIn = hasLoggedInBefore();
    const mainUserId = loggedIn ? getCookie('mainUserId') || localStorage.getItem('mainUserId') : null;
    const tempUserId = (!loggedIn) ? getTempUserId() : null;
    return {
      title: getTitle(),
      authors: getAuthors(),
      journal: getJournal(),
      doi: getDOI(),
      url: location.href,
      abstract: getAbstract(),
      purchaseDate: new Date().toISOString().slice(0, 10),
      price: null,
      tags: [],
      mainUserId,
      tempUserId
    };
  }

  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg?.type === "GET_ARTICLE_DATA") {
      sendResponse(getArticleData());
    }
    if (msg?.type === "GET_USER_INFO") {
      const loggedIn = hasLoggedInBefore();
      sendResponse({
        loggedIn,
        mainUserId: getCookie('mainUserId') || localStorage.getItem('mainUserId'),
        tempUserId: getTempUserId()
      });
    }
    if (msg?.type === "CREATE_TEMP_USER") {
      let tempUserId = getTempUserId();
      if (!tempUserId) {
        tempUserId = "temp_" + generateUUIDv4();
        setTempUserId(tempUserId);
      }
      sendResponse({ tempUserId });
    }
    if (msg?.type === "CLEAR_TEMP_USER") {
      clearTempUserId();
      sendResponse({ ok: true });
    }
  });
})();