({
	fetchStageNameVal: function(component) {
       var action = component.get("c.getStageNameOptions");
       action.setParams({
           "fieldId": "StageName"
       });
       var options = [];
       action.setCallback(this, function(response) {
           if (response.getState() == "SUCCESS") {
               var allValues = response.getReturnValue();
               if (allValues != undefined && allValues.length > 0) {
                   options.push({
                       class: "optionClass",
                       label: "--- None ---",
                       value: ""
                   });
               }
               for (var i = 0; i < allValues.length; i++) {
                   options.push({
                       class: "optionClass",
                       label: allValues[i],
                       value: allValues[i]
                   });
               }
               component.find("stagename").set("v.options", options);
           }
       });
       $A.enqueueAction(action);
   },
   getAccounts : function(component) {
   var action=component.get("c.getAllAccount");
        action.setCallback(this,function(e){
            if(e.getState()=='SUCCESS'){
                var result=e.getReturnValue();
                if(result.length>0){
                    for(var key in result){
                          result[key].isSelected = false;  
                    }
                    component.set("v.accountList",result);
                }
            }
            var temp = [];
            var indexVal = 0;
            while(indexVal<result.length && indexVal <=4){
                temp[indexVal] = result[indexVal];
                if(indexVal==4 || indexVal==result.length-1)
                    break;
                indexVal++;
            }
            component.set("v.endIndex",indexVal);
            component.set("v.tempAccountList",temp);
            component.find('prevButton').set('v.disabled',true);
            component.find('firstButton').set('v.disabled',true);
            if(indexVal==result.length-1){
                
                        component.find('nextButton').set('v.disabled',true);
                        component.find('lastButton').set('v.disabled',true);
             }
        });
        $A.enqueueAction(action);
   },
    createOpportunityhelper: function(component){
        var action=component.get("c.createAccountOpportunities");
        action.setParams({  accountIdName : component.get("v.selectedAccount"),
                          amount : component.get("v.opportunityAmount"),
                          stageName : component.get("v.selectedStage"),
                          closeDate : component.get("v.closeDate")});
        action.setCallback(this,function(e){
            if(e.getState()=='SUCCESS' && e.getReturnValue()==""){
                $A.get('e.force:refreshView').fire();
            	var toastEvent = $A.get("e.force:showToast");
        		toastEvent.setParams({
            	title : 'Success!!',
            	message:'Opportunity has been created for selected accounts',
            	messageTemplate: 'Mode is pester ,duration is 5sec and Message is overrriden',
            	duration:' 5000',
            	key: 'info_alt',
            	type: 'success',
            	mode: 'pester'
        });
        toastEvent.fire();
        }
            else{
                $A.get('e.force:refreshView').fire();
            	var toastEvent = $A.get("e.force:showToast");
        		toastEvent.setParams({
            	title : 'Failure!!',
            	message: e.getReturnValue(),
            	key: 'info_alt',
                    duration:'7000ms',
            	type: 'error',
        });
        toastEvent.fire();
            }
        });
        $A.enqueueAction(action);
   },
    showErrorToast : function(component, event) {
        
    }
})