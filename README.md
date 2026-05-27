# Forms Inline Image Preview

This is a small Chrome or Edge extension that turns Microsoft Forms upload links for image files into inline previews so they show up cleanly when you review or print a response.

## What it does

- Detects image links that point to SharePoint or OneDrive uploads.
- Replaces the visible file row with an inline image preview.
- Updates previews automatically when switching between responses.
- Makes Forms review pages cleaner and easier to print.

## Files

- `manifest.json`: Extension manifest for Chromium browsers.
- `content.js`: Finds image upload links and injects previews.
- `styles.css`: Preview styling and print-friendly layout.

## Load in Edge or Chrome

1. Open `edge://extensions` or `chrome://extensions`.
2. Turn on **Developer mode**.
3. Choose **Load unpacked**.
4. Select this folder:

   `C:\Users\Ittyy\Desktop\BJC\Powerautomate`

5. Open your Microsoft Forms review page and refresh it.

## Notes

- The image still needs to be accessible with your current Microsoft 365 sign-in. The extension does not bypass permissions.
- The extension currently runs on `forms.office.com` and `forms.cloud.microsoft`.
