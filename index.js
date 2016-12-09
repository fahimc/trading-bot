let LatestPricesService = require('./src/module/service/LatestPricesService');
let TwitterScarp = require('./src/module/service/TwitterScrap');
let SentimentAnalysis = require('./src/module/service/SentimentAnalysis');
let emitter = require('./src/module/event/event');


let Trader = {
    init() {
    	this.addListeners();
    	TwitterScarp.init();
    	LatestPricesService.getLatest();
    },
    addListeners(){
    	emitter.on('PRICES_COMPLETE', this.onPrices.bind(this));
    },
    onPrices(){
    	//console.log(LatestPricesService.keyCollection);
    }
}.init();
