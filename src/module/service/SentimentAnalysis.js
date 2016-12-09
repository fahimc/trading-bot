let emitter = require('../event/event');
let sentiment = require('sentiment');

class SentimentAnalysis {
    constructor() {
        this.WORD_LIST = {
            'sack': -2,
            'down': -1,
            'slump': -1,
            'falls': -1
        };
        this.addListeners();
    }
    addListeners() {
        emitter.on('CHANGE_SENTIMENT', this.onAnalyse.bind(this));
    }
    onAnalyse(collection) {
        //console.log('onAnalyse', collection);
        this.checkCollection(collection);
    }
    checkCollection(collection) {

        for (var a = 0; a < collection.length; a++) {
            let item = collection[a];
            console.log(item.name);
            let positiveCount = 0;
            let negativeCount = 0;
            for (var a = 0; a < item.tweets.length; a++) {
                let result = sentiment(item.tweets[a], this.WORD_LIST);
                console.log(item.tweets[a], result.score);
                if (result.score > 0) {
                    positiveCount++;
                } else if (result.score < 0) {
                    negativeCount++;
                }
            }
            console.log(positiveCount, negativeCount, 'is ' + (negativeCount / item.tweets.length) * 100 + '% negative', item.startPrice, item.endPrice);
        }
    }
}

module.exports = new SentimentAnalysis();
