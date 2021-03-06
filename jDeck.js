deckx = false;
arena = false;
var deck = {
    addCards: function(elemone, elemtwo, elemthree, lang) {
        var self = this;
        $(elemone).each(function(i, el) {
            if (lang) {
                var values = getCardName($(elemtwo, this).text(), 'name', lang);
            } else {
                var values = $(elemtwo, this).text();
            }
            if (values) {
                quantity = $(elemthree, this).text().trim().match(/(\d+)(?!.*\d)/g, '$1');
                self.list.push(values);
                if (quantity) {
                    for (var j = 1; j < quantity[quantity.length - 1]; j++) {
                        self.list.push(values);
                    }
                }
            }
        });
    },
    download: function() {
        this.list = [];
        update();
        var dl = $('<a>', {
            style: 'display: none',
            download: this.name.trim() + '.txt',
            href: window.URL.createObjectURL(new Blob([this.list.join("\r\n")], {
                type: "octet/stream"
            }))
        });
        dl[0].click();
        window.URL.revokeObjectURL(dl[0].href);
    },
    copy: function(pref) {
        this.list = [];
        if (pref.hdtrack) {
            this.list.unshift("url:" + window.location.href);
            this.list.unshift("arena:" + arena);
            this.list.unshift("name:" + deck.name.trim());
            this.list.unshift("trackerimport");
        } else {
            alert('Copied Deck to clipboard.');
        }
        update();
        copydeck = $("<textarea>").val(this.list.join("\r\n"));
        $('body').append(copydeck);
        copydeck.select();
        document.execCommand('copy');
        if (pref.hdtrack) {
            copydeck.hide();
            setTimeout(function() {
                copydeck.show();
                copydeck.val(' ');
                copydeck.select();
                document.execCommand('copy');
                copydeck.remove();
            }, 1000);
        } else {
            copydeck.remove();
        }
    }
};

function getCardName(reference, type, lang) {
    for (var z = 0; z < Object.keys(cards_data[lang]).length; z++) {
        for (var i = 0; i < cards_data[lang][Object.keys(cards_data[lang])[z]].length; i++) {
            if (cards_data[lang][Object.keys(cards_data[lang])[z]][i][type].replace(/[\s\`\"\'\’\xA0]/g, "") == reference.replace(/[\s\`\"\'\’\xA0]/g, "")) {
                if (type == 'id') {
                    return cards_data['enUS'][Object.keys(cards_data[lang])[z]][i].name;
                }
                return getCardName(cards_data[lang][Object.keys(cards_data[lang])[z]][i].id, 'id', 'enUS');
            }
        }
    }
};
chrome.runtime.onMessage.addListener(function getFunctions(req, send, resp) {
    if (req.functions) {
        chrome.runtime.onMessage.removeListener(getFunctions);
        eval(req.functions);
        Object.keys(siteFunctions).forEach(function(site) {
            if (window.location.href.indexOf(site) >= 0) {
                deckx = true;
                siteFunctions[site]();
            }
        });
        if (deckx) {
            chrome.storage.sync.get({
                copy: false,
                download: false,
                hdtrack: true
            }, function(pref) {
                if (pref.download) {
                    deck.download();
                }
                if (pref.copy || pref.hdtrack) {
                    deck.copy(pref);
                }
            });
        } else {
            alert('Site not supported or deck not found.');
        }
    }
});