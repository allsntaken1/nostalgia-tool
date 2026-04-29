# RepeatChannel Quick Add Chrome Extension

MVP Chrome Manifest V3 extension for right-click image saves into the existing RepeatChannel archive.

## Load locally

1. Open Chrome and go to `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select this folder: `chrome-extension/repeatchannel-quick-add`.
5. Right-click any image and choose **Save to RepeatChannel Archive**.

## First setup

Open the extension popup and set:

- API endpoint: `https://repeatchannel.com/api/extension-save`
- Admin passcode: the same admin passcode used by RepeatChannel

The extension stores those values in Chrome local extension storage.

## MVP notes

- Saves use the existing RepeatChannel archive schema.
- Source is labeled `Chrome Extension`.
- Extra tags include `Chrome Extension` and `Extension Save`.
- Duplicate checks happen server-side against image URL, thumbnail URL, and source URL.

## Extension points

- Batch save from Google Images result pages.
- AI auto-tagging before save.
- Stronger duplicate image matching.
- Server-side image download/storage instead of hotlinking.
- Bookmarklet fallback.
