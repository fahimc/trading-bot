var ftse = require('ftse');
var db = require('diskdb');
let emitter = require('../event/event');
let math = require('mathjs');

class LatestPricesService {
    getLatest() {
        this.MAX_NUMBER_OF_ITEMS = 200;
        this.TRIGGER_FOR_CHANGE = 0.02;
        this.keyCollection = [];
        this.date = new Date().toISOString();
        ftse('100', -1, null, this.onData.bind(this));
    }
    onData(items) {
        this.saveItems(items);
        this.checkAllStocks();
        emitter.emit('PRICES_COMPLETE');
    }
    saveItems(items) {
        items.forEach(this.saveItem.bind(this));
    }
    saveItem(item) {
        item.date = this.date;
        let key = item.name.replace(/ +?/g, '').replace(/[^\w\s]/gi, '');
        this.keyCollection.push(key);
        db.connect('./src/db/', [key]);
        db[key].save(item);
    }
    checkAllStocks() {
        for (var a = 0; a < this.keyCollection.length; a++) {
            this.analyse(a);
        }
    }
    analyse(index) {
        let collection = db[this.keyCollection[index]].find();
        collection.sort(this.sortByDate);
        let latestItems = collection.slice(0, this.MAX_NUMBER_OF_ITEMS);
        let startPrice = latestItems[0].price.replace(',','');
        let endPrice = latestItems[latestItems.length - 1].price.replace(',','');
        let change = Number(endPrice) - Number(startPrice);
        let decimalPercentage = math.abs(change) / startPrice;
        let percentage = math.round(decimalPercentage, 2);
        if (percentage >= this.TRIGGER_FOR_CHANGE) {
            console.log('BUY', change, latestItems[0].name, 'was £'+ startPrice, 'and now £' + endPrice, 'that is a ' ,percentage * 100 + '% decrease');
        }
    }
    sortByDate(a, b) {
        a = new Date(a.date);
        b = new Date(b.date);
        return a > b ? -1 : a < b ? 1 : 0;
    }
}

module.exports = new LatestPricesService();
