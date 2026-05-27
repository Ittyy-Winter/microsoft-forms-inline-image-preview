# Chrome Web Store Submission Kit

Use this package for the Chrome Web Store upload:

- `forms-inline-image-preview-chrome-web-store.zip`

## Store Listing

### Extension Name

Forms Inline Image Preview

### Short Description

Shows Microsoft Forms image upload answers as inline previews for easier review and printing.

### Detailed Description

Forms Inline Image Preview improves the review experience in Microsoft Forms by turning image-upload file links into inline image previews.

What it does:

- Detects image upload answers on Microsoft Forms review pages
- Displays uploaded images directly in the page
- Hides the original file-link row for a cleaner layout
- Updates previews automatically when switching between responses
- Makes printing and on-screen review much easier

This extension only runs on Microsoft Forms pages and does not send form content to any external service.

## Privacy Answers

### Single Purpose

This extension enhances Microsoft Forms review pages by replacing image-upload file links with inline image previews.

### Data Usage Disclosure

- The extension reads page content on Microsoft Forms review pages in order to find image-upload links and display those images inline.
- The extension does not collect, store, transmit, or sell personal data.
- The extension does not use remote code.
- The extension does not send page data to any third-party server.

### Permissions Justification

The extension needs access to Microsoft Forms domains so it can detect uploaded image links and inject inline previews on those pages.

## Suggested Category

Productivity

## Suggested Language

English

## Recommended Screenshots

Take 3 screenshots after loading the extension in Chrome:

1. A Forms response page showing an uploaded image inline
2. A response with multiple pictures visible inline
3. Switching between respondents with previews updating automatically

## Final Pre-Upload Checklist

- Confirm the extension loads correctly in Chrome
- Confirm image filenames are hidden
- Confirm changing respondents updates images without refresh
- Confirm `manifest.json` version is correct
- Upload `forms-inline-image-preview-chrome-web-store.zip`
