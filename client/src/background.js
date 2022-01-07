import { exports, async } from 'regenerator-runtime'
async function ConnectNami() {

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        let alias = message.name
        switch (alias) {
            case 'fetch': {
                return [
                    chrome.webNavigation.onCompleted.addListener(function (details) {
                        if (details.frameId === 0) {
                            chrome.tabs.executeScript(details.tabId, { "file": "webPageSender.js" });
                        }
                    })
                ]
            }
        }
    })
}
ConnectNami()

