chrome.pageAction.onClicked.addListener(function (tab) {
	chrome.tabs.executeScript(tab.id, {"code": "download();"});
});

chrome.runtime.onInstalled.addListener(function (details) {
    if ((details.reason === "install")||(details.reason === "update")) {
        chrome.tabs.create({
       		'url': chrome.extension.getURL('http://n4ru.it/netdek/updates.html')
   		});

    }
});

chrome.extension.onMessage.addListener(function(req, sender, resp) {
			chrome.pageAction.show(sender.tab.id);
});