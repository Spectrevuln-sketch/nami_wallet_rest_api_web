const evtToPage = chrome.runtime.id;
var url = chrome.runtime.getURL('popup.html')

if (typeof init === 'undefined') {
    const init = (file, node) => {


        var body = document.getElementsByTagName(node)[0]
        const injectElement = document.createElement('script');
        injectElement.setAttribute('type', 'text/javascript')
        injectElement.setAttribute('src', file)
        body.appendChild(injectElement);

        var evt = document.createEvent("CustomEvent");
        evt.initEvent("nami_support", true, true, url);
        evt.eventName = "nami_support";
        document.dispatchEvent(evt);

    }
    // initial Send Js To Web
    init(chrome.runtime.getURL('webPageSender.js'), 'body')
    init(chrome.runtime.getURL('Loader.js'), 'body')
    // init(chrome.runtime.getURL('wasm.js'), 'body')
    init(chrome.runtime.getURL('regenerator-runtime/runtime.js.js'), 'body')
    init(chrome.runtime.getURL('eventFunction.js'), 'body')


}


export const SentToWallet = (data) => {
    console.log(data)
}