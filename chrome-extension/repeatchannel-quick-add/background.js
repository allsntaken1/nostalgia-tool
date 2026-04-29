const MENU_ID = 'save-to-repeatchannel';

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: MENU_ID,
    title: 'Save to RepeatChannel Archive',
    contexts: ['image'],
  });
});

async function getImageContext(tabId, srcUrl) {
  if (!tabId || !srcUrl) return {};

  try {
    const [result] = await chrome.scripting.executeScript({
      target: { tabId },
      args: [srcUrl],
      func: (imageUrl) => {
        const images = Array.from(document.images);
        const image = images.find((img) => img.currentSrc === imageUrl || img.src === imageUrl);

        return {
          pageTitle: document.title || '',
          altText: image?.alt || image?.getAttribute('aria-label') || '',
        };
      },
    });

    return result?.result || {};
  } catch {
    return {};
  }
}

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== MENU_ID || !info.srcUrl) return;

  const context = await getImageContext(tab?.id, info.srcUrl);
  await chrome.storage.local.set({
    pendingRepeatChannelImage: {
      imageUrl: info.srcUrl,
      sourceUrl: info.pageUrl || tab?.url || '',
      pageTitle: context.pageTitle || tab?.title || '',
      altText: context.altText || '',
      capturedAt: new Date().toISOString(),
    },
  });

  await chrome.windows.create({
    url: chrome.runtime.getURL('quick-add.html'),
    type: 'popup',
    width: 440,
    height: 720,
    focused: true,
  });
});
