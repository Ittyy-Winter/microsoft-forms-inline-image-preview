const IMAGE_FILE_PATTERN = /\.(?:avif|bmp|gif|jpe?g|png|svg|tiff?|webp)(?:[?#].*)?$/i;
const UPLOAD_HOST_PATTERN = /(?:sharepoint\.com|onedrive\.com|1drv\.ms)$/i;
const MANAGED_TARGET_FLAG = "formsInlineImageManaged";
const PREVIEW_CLASS = "forms-inline-image-preview";
const SOURCE_HIDDEN_CLASS = "forms-inline-image-source-hidden";

function looksLikeImageFile(value) {
  return IMAGE_FILE_PATTERN.test(value || "");
}

function isUploadHost(hostname) {
  return UPLOAD_HOST_PATTERN.test(hostname || "");
}

function tryMakeUrl(value) {
  if (!value) {
    return null;
  }

  try {
    return new URL(value, window.location.href);
  } catch {
    return null;
  }
}

function resolveDirectImageUrl(anchor) {
  const rawHref = anchor.getAttribute("href");
  const primaryUrl = tryMakeUrl(rawHref);

  if (primaryUrl && isUploadHost(primaryUrl.hostname) && (looksLikeImageFile(primaryUrl.pathname) || looksLikeImageFile(primaryUrl.href))) {
    return primaryUrl.href;
  }

  if (!primaryUrl) {
    return null;
  }

  for (const value of primaryUrl.searchParams.values()) {
    const nestedUrl = tryMakeUrl(value);

    if (nestedUrl && isUploadHost(nestedUrl.hostname) && (looksLikeImageFile(nestedUrl.pathname) || looksLikeImageFile(nestedUrl.href))) {
      return nestedUrl.href;
    }

    const decodedValue = (() => {
      try {
        return decodeURIComponent(value);
      } catch {
        return value;
      }
    })();
    const decodedUrl = tryMakeUrl(decodedValue);

    if (decodedUrl && isUploadHost(decodedUrl.hostname) && (looksLikeImageFile(decodedUrl.pathname) || looksLikeImageFile(decodedUrl.href))) {
      return decodedUrl.href;
    }
  }

  return null;
}

function isImageUploadLink(anchor) {
  if (!(anchor instanceof HTMLAnchorElement)) {
    return false;
  }

  if (anchor.querySelector("img")) {
    return false;
  }

  const href = anchor.getAttribute("href");
  if (!href) {
    return false;
  }

  const url = tryMakeUrl(href);

  if (!url || !isUploadHost(url.hostname)) {
    return false;
  }

  const linkText = anchor.textContent.trim();
  const ariaLabel = anchor.getAttribute("aria-label") || "";
  const title = anchor.getAttribute("title") || "";
  const hrefLooksLikeImage = Boolean(resolveDirectImageUrl(anchor));
  const labelLooksLikeImage = looksLikeImageFile(linkText) || looksLikeImageFile(ariaLabel) || looksLikeImageFile(title);

  if (!hrefLooksLikeImage && !labelLooksLikeImage) {
    return false;
  }

  return true;
}

function buildPreview(anchor, imageUrl) {
  const image = document.createElement("img");
  image.className = PREVIEW_CLASS;
  image.src = imageUrl;
  image.alt = anchor.textContent.trim() || "Uploaded image";
  image.loading = "lazy";
  image.decoding = "async";
  image.dataset.sourceHref = imageUrl;
  return image;
}

function getPreviewForTarget(target) {
  const next = target.nextElementSibling;
  if (next instanceof HTMLImageElement && next.classList.contains(PREVIEW_CLASS)) {
    return next;
  }

  return null;
}

function getInsertionTarget(anchor) {
  const parent = anchor.parentElement;
  if (!parent) {
    return anchor;
  }

  const parentHasIcon = Boolean(parent.querySelector("svg, img, i"));
  const parentHasMultipleChildren = parent.children.length > 1;

  if (parentHasIcon || parentHasMultipleChildren) {
    return parent;
  }

  return anchor;
}

function enhanceLink(anchor) {
  if (!isImageUploadLink(anchor)) {
    return null;
  }

  const imageUrl = resolveDirectImageUrl(anchor);
  if (!imageUrl) {
    return null;
  }

  const target = getInsertionTarget(anchor);
  let preview = getPreviewForTarget(target);

  if (!preview) {
    preview = buildPreview(anchor, imageUrl);
    target.insertAdjacentElement("afterend", preview);
  }

  if (preview.getAttribute("src") !== imageUrl) {
    preview.src = imageUrl;
  }

  preview.alt = anchor.textContent.trim() || "Uploaded image";
  preview.dataset.sourceHref = imageUrl;
  target.classList.add(SOURCE_HIDDEN_CLASS);
  target.dataset[MANAGED_TARGET_FLAG] = "true";
  return target;
}

function cleanupManagedTargets(activeTargets) {
  const managedTargets = document.querySelectorAll('[data-forms-inline-image-managed="true"]');

  managedTargets.forEach((target) => {
    if (activeTargets.has(target)) {
      return;
    }

    target.classList.remove(SOURCE_HIDDEN_CLASS);
    delete target.dataset[MANAGED_TARGET_FLAG];

    const preview = getPreviewForTarget(target);
    if (preview) {
      preview.remove();
    }
  });

  const previews = document.querySelectorAll(`img.${PREVIEW_CLASS}`);
  previews.forEach((preview) => {
    const previous = preview.previousElementSibling;
    if (!previous || previous.dataset[MANAGED_TARGET_FLAG] !== "true") {
      preview.remove();
    }
  });
}

function scan(root = document) {
  const anchors = root.querySelectorAll("a[href]");
  const activeTargets = new Set();

  anchors.forEach((anchor) => {
    const target = enhanceLink(anchor);
    if (target) {
      activeTargets.add(target);
    }
  });

  cleanupManagedTargets(activeTargets);
}

let scanScheduled = false;

function scheduleScan() {
  if (scanScheduled) {
    return;
  }

  scanScheduled = true;
  window.requestAnimationFrame(() => {
    scanScheduled = false;
    scan();
  });
}

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.type === "childList") {
      if (mutation.addedNodes.length === 0 && mutation.removedNodes.length === 0) {
        continue;
      }

      scheduleScan();
      return;
    }

    if (mutation.type === "attributes" || mutation.type === "characterData") {
      scheduleScan();
      return;
    }
  }
});

function init() {
  scan();

  if (document.body) {
    observer.observe(document.body, {
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true
    });
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}
