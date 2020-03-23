({
	getCurrencyPicklist: function(component, event) {
        var action = component.get("c.getCurrencyValues");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var result = response.getReturnValue();
                var currencyMap = [];
                for(var key in result){
                    //console.log(result[key].value);
                    currencyMap.push({key: key, value: result[key]});
                }
                component.set("v.currencyCodeNameMap", currencyMap);
				
            }
        });
        $A.enqueueAction(action);
    },
    getCurrencyRateValues: function(component, event) {
        var action = component.get("c.getCurrencyRateValues");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var result = response.getReturnValue();
                var currencyMap = [];
                for(var key in result){
                    currencyMap.push({key: key, value: result[key]});
                }
                component.set("v.currencyCodeRateMap", currencyMap);
                
            }
            var mapObject = component.get("v.currencyCodeRateMap");
        	component.set("v.selectedCurrency","USD");
        	//alert(selectedCurr);
        	for(var key in mapObject){
            	if(mapObject[key].key == "USD"){
                	component.set("v.bitCoinInput",1);
                	var bitcoinVal = component.get("v.bitCoinInput");
                	component.set("v.otherCurrInput",mapObject[key].value*bitcoinVal);
            	}
            }
        });
        $A.enqueueAction(action);
    }
    
})