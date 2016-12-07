let LatestPricesService = require('./src/module/service/LatestPricesService');
let emitter = require('./src/module/event/event');


let Trader = {
    init() {
    	this.addListeners();
    	LatestPricesService.getLatest();
    },
    addListeners(){
    	emitter.on('PRICES_COMPLETE', this.onPrices.bind(this));
    },
    onPrices(){
    	//console.log(LatestPricesService.keyCollection);
    }
}.init();
