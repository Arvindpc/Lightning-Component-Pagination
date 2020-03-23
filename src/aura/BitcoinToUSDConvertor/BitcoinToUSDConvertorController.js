({
	doInit: function(component, event, helper) {        
        helper.getCurrencyPicklist(component, event);
        helper.getCurrencyRateValues(component,event);
     
    },
    handleCurrencyOnChange: function(component, event, helper) {
        var nameMapObject = component.get("v.currencyCodeNameMap");
        var bitcoinVal = component.find("bitcoinInput");
        var value = bitcoinVal.get("v.value");
        var selectedCurr = component.get("v.selectedCurrency");
        for(var key in nameMapObject){
            if(nameMapObject[key].key == selectedCurr){
                component.set("v.convertionFieldLabel", nameMapObject[key].value+" Amount");
            }
        }
        var rateMapObject = component.get("v.currencyCodeRateMap");
        for(var key in rateMapObject){
            if(rateMapObject[key].key == selectedCurr){
                component.set("v.otherCurrInput",rateMapObject[key].value*value);
            }
    	}
    },
    bitcoinToOtherCurrency:function(component,event,helper){
        var bitcoinVal = component.find("bitcoinInput");
        var selectedCurr = component.get("v.selectedCurrency");
        var value = bitcoinVal.get("v.value");
        // Is input numeric?
        if (isNaN(value)) {
            // Set error
            bitcoinVal.set("v.errors", [{message:"Input not a number: " + value}]);
        } else {
            // Clear error
            bitcoinVal.set("v.errors", null);
        }
        var mapObject = component.get("v.currencyCodeRateMap");
        for(var key in mapObject){
            if(mapObject[key].key == selectedCurr){
                component.set("v.otherCurrInput",mapObject[key].value*value);
            }
    	}
        
    },
    otherCurrencyToBitcoin:function(component,event,helper){
        var otherCurrVal = component.find("otherCurrencyInput");
        var selectedCurr = component.get("v.selectedCurrency");
        var value = otherCurrVal.get("v.value");

        // Is input numeric?
        if (isNaN(value)) {
            // Set error
            otherCurrVal.set("v.errors", [{message:"Input not a number: " + value}]);
        } else {
            // Clear error
            otherCurrVal.set("v.errors", null);
        }
        var mapObject = component.get("v.currencyCodeRateMap");
        for(var key in mapObject){
            if(mapObject[key].key == selectedCurr){
                component.set("v.bitCoinInput",value/mapObject[key].value);
            }
    	}
    },
    handleError:function(component,event,helper){
        var comp = event.getSource();
        $A.util.addClass(comp, "error");   
    },

    handleClearError:function(cmp,event,helper){
        var comp = event.getSource();
        $A.util.removeClass(comp, "error");   
    },
    showSpinner: function(component, event, helper) {
        // make Spinner attribute true for displaying loading spinner 
        component.set("v.spinner", true); 
    },
     
    // function automatic called by aura:doneWaiting event 
    hideSpinner : function(component,event,helper){
        // make Spinner attribute to false for hiding loading spinner    
        component.set("v.spinner", false);
    }
})