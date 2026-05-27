<p align="center">
  <img src="icons/icon-128.png" alt="Logo" width="96" height="96" />
</p>

<h1 align="center">Forms Inline Image Preview</h1>

<p align="center">
  A lightweight browser extension that renders Microsoft Forms image uploads as
  <br />
  inline previews — making responses cleaner to review and easier to print.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Manifest%20Version-3-blue" alt="Manifest V3" />
  <img src="https://img.shields.io/badge/Chrome-✓-4285F4?logo=googlechrome&logoColor=white" alt="Chrome" />
  <img src="https://img.shields.io/badge/Edge-✓-0078D7?logo=microsoftedge&logoColor=white" alt="Edge" />
</p>

---

## The Problem

Microsoft Forms stores image upload answers as plain file links hosted on SharePoint or OneDrive. When reviewing responses, those links appear as raw URLs or generic file rows — making it tedious to visually scan submissions. Printing them is even worse.

## The Solution

This extension automatically detects those image links and replaces them with the actual image inline, right inside the Forms review page. No downloads, no extra tabs — just see the photos where they belong.

## Features

- **Inline Previews** — Replaces upload links with the actual image directly in the response view.
- **Live Updates** — Previews refresh automatically when you switch between responses.
- **Print Friendly** — Images scale to full width on paper with no awkward clipping.
- **Lightweight** — A single content script and stylesheet. No background processes, no external dependencies.
- **Permission Aware** — Respects your Microsoft 365 sign-in. If you can see the file, so can the preview.

## Supported Domains

| Domain | |
|---|---|
| `forms.office.com` | Classic Forms |
| `forms.cloud.microsoft` | New Forms experience |

Image links must point to **SharePoint** or **OneDrive** hosts (e.g. `*.sharepoint.com`, `onedrive.com`, `1drv.ms`).

## Supported Image Formats

AVIF, BMP, GIF, JPEG, JPG, PNG, SVG, TIFF, WebP

## Project Structure

```
.
├── manifest.json    Extension manifest (MV3)
├── content.js       Core logic — link detection and preview injection
├── styles.css       Preview styling and print layout
└── icons/           Extension icons (16, 32, 48, 128)
```

## Installation

### Load Unpacked

1. Open your browser's extensions page:
   - **Chrome:** `chrome://extensions`
   - **Edge:** `edge://extensions`
2. Enable **Developer mode** (toggle in the top-right).
3. Click **Load unpacked** and select this project folder.
4. Open a Microsoft Forms review page and refresh.

### Alternative: Pack for Distribution

In the extensions page, click **Pack extension** and point it to this folder. The generated `.crx` / `.pem` files can be sideloaded via policy or distributed privately.

## How It Works

1. A `MutationObserver` watches the Forms DOM for response content changes.
2. When new links appear, the script checks if they point to an image on a known upload host.
3. URLs are parsed recursively — including nested query parameters and percent-encoded redirects — to resolve the direct image source.
4. A `<img>` element is injected next to the file row, and the original link row is hidden with CSS.

## Privacy

This extension runs entirely in your browser. It does **not**:

- Collect, store, or transmit any data.
- Communicate with any external service.
- Read or modify cookies, local storage, or authentication tokens.
- Require any permissions beyond host access to Forms pages.

See [PRIVACY_POLICY.md](PRIVACY_POLICY.md) for full details.

## License

Internal use. Not licensed for redistribution.
