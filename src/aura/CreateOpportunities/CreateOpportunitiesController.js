({
    doInit: function(component, event, helper) {
        helper.fetchStageNameVal(component);
        helper.getAccounts(component);
    },
    getSelectedAccount : function(component, event,helper) { 
        var selectedId=event.target.getAttribute('id');
        var selectedName=event.target.getAttribute('name');
        if(document.getElementById(selectedId).checked){
            var accountIdMap = component.get('v.selectedAccount');
            accountIdMap[selectedId] = selectedName;
            component.set("v.selectedAccount",accountIdMap);
            var accList = component.get("v.accountList");
            var start = component.get('v.startIndex');
            var end = component.get('v.endIndex');
            for(var i=start;i<=end;i++){
            	
                if(accList[i].Id == selectedId){
                    accList[i].isSelected = true;
                }
        	}
            
        }
        else{
            var accountMap = component.get("v.selectedAccount");
            delete accountMap[selectedId];
            component.set("v.selectedAccount",accountMap);
            var accList = component.get("v.accountList");
            var start = component.get('v.startIndex');
            var end = component.get('v.endIndex');
            for(var i=start;i<=end;i++){
            	
                if(accList[i].Id == selectedId){
                    accList[i].isSelected = false;
                }
        	}
        }
        
    },
    createOpportunity: function(component, event,helper){
        var amountVal = component.find("oppAmountInput").get("v.value");
        var stageVal = component.find("stagename").get("v.value");
        var dateVal = component.find("closeDate").get("v.value");
        var allValid = true;
        if(amountVal==null || amountVal==""){
            component.find("oppAmountInput").set("v.errors", [{message:"Amount is required"}]);
            allValid = false;
        }
        if(stageVal==""){
            component.find("stagename").set("v.errors", [{message:"Stage is required"}]);
            allValid = false;
        }
        if(dateVal==null){
            component.find("closeDate").set("v.errors", [{message:"Close Date is required"}]);
            allValid = false;
        }
        if(!Reflect.ownKeys(component.get('v.selectedAccount')).length){
            allValid = false;
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                title : 'Error Message',
                message:'Please select the Account',
                messageTemplate: 'Mode is pester ,duration is 3sec and Message is overrriden',
                duration:' 3000',
                key: 'info_alt',
                type: 'error',
                mode: 'pester'
            });
            toastEvent.fire();
        }
        if(allValid){
            component.find("oppAmountInput").set("v.errors",null);
            component.find("stagename").set("v.errors",null);
            component.find("closeDate").set("v.errors",null);
            helper.createOpportunityhelper(component);      
        }
    },
    checkValidInput:function(component,event,helper){
        var oppValue = component.find("oppAmountInput");
        var value = oppValue.get("v.value");
        if (isNaN(value)) {
            oppValue.set("v.errors", [{message:"Input not a number: " + value}]);
            component.find('submitButton').set('v.disabled',true);
        } else {
            oppValue.set("v.errors", null);
            component.find('submitButton').set('v.disabled',false);
        }
    },
    
    checkValidSelect:function(component,event,helper){
        var stage = component.find("stagename");
        var value = stage.get("v.value");
        if(value != ""){
            stage.set("v.errors", null);
        }
    },
    
    navigateToFirst: function(component,event,helper){
        var end=4;
        var start = 0;
        component.set("v.startIndex",start);
        component.set("v.endIndex",end);
        var temp=[];
        for(var i=start;i<=end;i++){
            temp.push(component.get("v.accountList")[i]);
        }
        component.set("v.tempAccountList",temp);
        component.find('prevButton').set('v.disabled',true);
        component.find('firstButton').set('v.disabled',true);
        component.find('nextButton').set('v.disabled',false);
        component.find('lastButton').set('v.disabled',false);
    },
    navigateToLast: function(component,event,helper){
        var end=component.get("v.accountList").length-1;
        var start = component.get("v.accountList").length - (component.get("v.accountList").length % 5);
        component.set("v.startIndex",start);
        component.set("v.endIndex",end);
        var temp=[];
        for(var i=start;i<=end;i++){
            temp.push(component.get("v.accountList")[i]);
        }
        component.set("v.tempAccountList",temp);
        component.find('prevButton').set('v.disabled',false);
        component.find('firstButton').set('v.disabled',false);
        component.find('nextButton').set('v.disabled',true);
        component.find('lastButton').set('v.disabled',true);
    },
    navigateToPrevious: function(component,event,helper){
        component.find('nextButton').set('v.disabled',false);
        component.find('lastButton').set('v.disabled',false);
        var start = component.get("v.startIndex");
        var end = component.get("v.endIndex");
        end=start-1;
        start = start-5;
        component.set("v.startIndex",start);
        component.set("v.endIndex",end);
        var temp=[];
        for(var i=start;i<=end;i++){
            temp.push(component.get("v.accountList")[i]);
        }
        component.set("v.tempAccountList",temp);
        var accountMap = component.get("v.selectedAccount");
        if(start == 0){
            component.find('prevButton').set('v.disabled',true);
            component.find('firstButton').set('v.disabled',true);
        }   
    },
    navigateToNext: function(component,event,helper){
        component.find('prevButton').set('v.disabled',false);
        component.find('firstButton').set('v.disabled',false);        
        var start = component.get("v.startIndex");
        var end = component.get("v.endIndex");
        start=end+1;
        if(component.get("v.accountList").length-1 - end >5){
            end=end+5;
        }
        else{
            end=component.get("v.accountList").length-1;
            component.find('nextButton').set('v.disabled',true);
            component.find('lastButton').set('v.disabled',true);
        }
        component.set("v.startIndex",start);
        component.set("v.endIndex",end);
        var temp=[];
        for(var i=start;i<=end;i++){
            temp.push(component.get("v.accountList")[i]);
        }
        component.set("v.tempAccountList",temp);
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
        component.set("v.spinner", true); 
    },
     
    hideSpinner : function(component,event,helper){
        component.set("v.spinner", false);
    }
})