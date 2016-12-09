let emitter = require('../event/event');
let scrap = require('scrap');

class TwitterScarp {
    init() {
        this.twitterUserNames = [];
        this.itemCollection = [];
        this.index = 0;
        this.addListeners();
        // this.getTwitterAccounts();
    }
    getTwitterAccounts() {
        scrap('https://www.blueclaw.co.uk/blog/2012/10/04/full-list-of-ftse-100-companies-on-twitter-21-are-still-absent/', this.onScrapAccounts.bind(this));
    }
    getTwitterResults() {
        scrap('https://twitter.com/search?f=tweets&vertical=default&q=' + this.itemCollection[this.index].name + '&src=typd', this.onScrap.bind(this));
    }
    onScrap(err, $) {
        let tweets = [];
        let elements = $('.tweet-text');
        for (let a = 0; a < elements.length; a++) {
            tweets.push($(elements[a]).text());
        }
        this.itemCollection[this.index].tweets = tweets;
        this.next();
    }
    next() {
        this.index++;
        if (this.itemCollection[this.index]) {
            this.getTwitterResults();
        } else {
            emitter.emit('CHANGE_SENTIMENT', this.itemCollection);
        }
    }
    onScrapAccounts(err, $) {
        let elements = $('table td:nth-child(3)');
        let elementNames = $('table td:nth-child(2)');
        for (let a = 1; a < elements.length; a++) {
            this.twitterUserNames.push({
                name: $(elementNames[a]).text(),
                username: $(elements[a]).text()
            });
        }
    }
    addListeners() {
        emitter.on('GET_TWEETS', this.onChange.bind(this));
    }
    onChange(collection) {
        this.itemCollection = collection;
        this.index = 0;
        console.log(this.getTwitterResults(collection[0].name));
    }
    findUsername(name) {
        for (var a = 0; a < this.twitterUserNames.length; a++) {
            console.log(this.twitterUserNames[a].name, name);
            if (this.twitterUserNames[a].name.toLowerCase() === name.toLowerCase()) {
                return this.twitterUserNames[a].username;
            }
        }
    }
}

module.exports = new TwitterScarp();
