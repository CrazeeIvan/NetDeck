/*

-- jDeck v.0.1 --
jQuery plugin for properly parsing Hearthstone decklists.

Functions
exDeck.addCards('.card-main', '.card-names', '.card-count')
-- Add cards to the deck objects from the .card-names elements within the .card-main element, using .card-count for the number of cards.
exDeck.download("decklist")
-- Download a file with the list of cards.
exDeck.addCardsExcception
-- Manual push cards to the list for sites that have weird formatting.

*/

var Deck = Class.create({
	init: function() {
		this.list = [];
	},
	addCards: function (elemone, elemtwo, elemthree) {
		var self = this;
		$(elemone).each(function(i, el) {
			var values = $(elemtwo, this).text();
			if ($(elemthree, this).text().indexOf('2') >= 0){
				self.list.push(values);
			}
			self.list.push(values);
		});
    },
	addCardsException: function (cardname) {
		var self = this;
		self.list.push(cardname);
	},
	download: function (fileName) {
		var self = this;
		var data = self.list.join("\r\n");
		var a = document.createElement("a");
		document.body.appendChild(a);
		a.style = "display: none";
		var blob = new Blob([data], {type: "octet/stream"}),
			url = window.URL.createObjectURL(blob);
		a.href = url;
		a.download = fileName;
		a.click();
		window.URL.revokeObjectURL(url);
	}
});

if ((window.location.href).indexOf('hearthhead.com/deck=') >= 0){
	var deck = new Deck();
	deck.addCards('[class^="collapsed-card"] > .base', '.name', '.count');
	var download = function(){
		deck.download($('.text h1').text() + '.txt');
	};
} else if ((window.location.href).indexOf('hearthstonetopdeck.com/deck.php?') >= 0){
	var deck = new Deck();
	$('.cardname').each(function(i, el) {
	var values = $(this).text().split(' ');
	var count = parseInt(values.shift(), 10);
	for (var i = 0; i < count; i++) {
		deck.addCardsException(values.join(' '));
	}
	});
		var download = function(){
		deck.download($('#deckname').text() + '.txt');
	};
} else if ((window.location.href).indexOf('gosugamers.net/decks/') >= 0){
	var deck = new Deck();
	deck.addCards('[class^="card-link"]', '[class^="name card-quality"]', '.count');
	var download = function(){
		deck.download($('h2 [class^="class-color"]').text() + '.txt');
	};
} else if ((window.location.href).indexOf('hearthstoneplayers.com/') >= 0){
	var deck = new Deck();
	deck.addCards('.card', '.card-title', '.card-count');
	var download = function(){
		deck.download($('#post-title').text() + '.txt');
	};
} else if ((window.location.href).indexOf('hearthpwn.com/decks/') >= 0){
	var deck = new Deck();
	deck.addCards('.even, .odd', 'b', '.col-name');
	var download = function(){
		deck.download($('.t-deck-title').text().replace(/ Deck Views:.*/, "") + '.txt');
	};
} else if ((window.location.href).indexOf('hearthstats.net/decks/') >= 0){
	var deck = new Deck();
	deck.addCards('[class^="card cardWrapper"]', '.name', '.qty');
	var download = function(){
		deck.download($('.page-title').text().replace(/ Deck Views:.*/, "") + '.txt');
	};
}