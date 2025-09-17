(function () {
  // Helper to get meta content by name or property
  function getMeta(name, prop = "name") {
    return document.querySelector(`meta[${prop}="${name}"]`)?.content || "";
  }

  // Helper to robustly extract title
  function getTitle() {
    return (
      getMeta("citation_title") ||
      getMeta("dc.title") ||
      document.querySelector("h1")?.textContent.trim() ||
      document.title ||
      ""
    );
  }

  // Robust author extraction logic
  function getAuthors() {
    // Try meta tags first
    const metaAuthors = Array.from(
      document.querySelectorAll('meta[name="citation_author"], meta[name="dc.creator"]')
    )
      .map(m => cleanAuthorName(m.content))
      .filter(Boolean);

    if (metaAuthors.length) return metaAuthors.join(", ");

    // Set unwanted string
    const unwantedString = "Author links open overlay panel";

    // Try common selectors for author names
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
          name = name.replace(/\s+/g, ' '); // normalize whitespace
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

    // Fallback: grab from anywhere on page (may be noisy)
    const wildAuthors = Array.from(
      document.querySelectorAll('.author, .authors, a[title*="Author"]')
    )
      .map(m => cleanAuthorName(m.textContent.trim().replace(/\s+/g, ' ')))
      .filter(Boolean);
    if (wildAuthors.length) return wildAuthors.join(", ");

    // NEW fallback: detect semicolon-separated plain text authors
    const bodyText = document.body.innerText;
    const semicolonMatch = bodyText.match(
      /([A-Z][a-z]+,\s*[A-Z][a-z]+[^;]+(?:;\s*[A-Z][a-z]+,\s*[A-Z][a-z]+[^;]+)+)/
    );
    if (semicolonMatch) {
      const rawAuthors = semicolonMatch[0]
        .split(";")
        .map(a => cleanAuthorName(a))
        .filter(Boolean);

      // stop if something looks like "Author Information" sneaks in
      const cleaned = rawAuthors.filter(a => !/author information|abstract|doi|buy|erratum/i.test(a));
      if (cleaned.length) return cleaned.join(", ");
    }

    // Final fallback
    return Array.from(
      document.querySelectorAll('.author-list .author-name, [data-author-name]')
    )
      .map(m => cleanAuthorName(m.textContent.trim().replace(/\s+/g, ' ')))
      .filter(Boolean)
      .join(", ");
  }

  // Clean unwanted numbers/hashtags/symbols from author names
  function cleanAuthorName(name) {
    if (!name) return "";
    let cleaned = name
      .replace(/#\s*\d+/g, "")         // remove things like "# 1"
      .replace(/\d+/g, "")             // remove all standalone numbers
      .replace(/[†*]/g, "")            // remove symbols like † and *
      .replace(/\s+/g, " ")            // normalize spaces
      .replace(/[, ]+$/, "")           // trim trailing commas/spaces
      .trim();

    // If format is "Lastname, Firstname" → flip to "Firstname Lastname"
    const m = cleaned.match(/^([^,]+),\s*(.+)$/);
    if (m) {
      cleaned = `${m[2]} ${m[1]}`.trim();
    }

    return cleaned;
  }

  // Robust journal extraction
  function getJournal() {
    return (
      getMeta("citation_journal_title") ||
      getMeta("prism.publicationName") ||
      getMeta("dc.source") ||
      ""
    );
  }

  // Robust DOI extraction
  function getDOI() {
    return (
      getMeta("citation_doi") ||
      getMeta("dc.identifier") ||
      (document.body.innerText.match(/\b10\.\d{4,9}\/[-._;()/:A-Z0-9]+/i)?.[0] || "")
    );
  }

  // Robust abstract extraction
  function getAbstract() {
    return (
      getMeta("citation_abstract") ||
      getMeta("description") ||
      getMeta("dc.description") ||
      document.querySelector('.abstract, [itemprop="description"]')?.textContent.trim() ||
      ""
    );
  }

  const articleData = {
    title: getTitle(),
    authors: getAuthors(),
    journal: getJournal(),
    doi: getDOI(),
    url: location.href,
    abstract: getAbstract(),
    purchaseDate: new Date().toISOString().slice(0, 10),
    price: null,
    tags: []
  };

  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg?.type === "GET_ARTICLE_DATA") sendResponse(articleData);
  });
})();
