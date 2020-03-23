({
    getContactData : function(component){
        //Load the Account data from apex
        var action = component.get("c.getContacts");
        action.setParams({
            accountId : component.get("v.recordId")
        });
        action.setCallback(this,function(response){
            var state = response.getState();
            if(state == "SUCCESS"){
                var contactList = response.getReturnValue();
                if(contactList.length != 0){
                    contactList.forEach(function(item) {
                        item['URL'] = '/lightning/r/Case/' + item['Id'] + '/view';
                    });
                    component.set("v.contactData",contactList);
                    component.set("v.totalRecords",contactList.length);
                    var temp = [];
                    var indexVal = 0;
                    while(indexVal<contactList.length && indexVal <=component.get("v.recordsToShow")-1){
                        temp[indexVal] = contactList[indexVal];
                        if(indexVal==component.get("v.recordsToShow")-1||indexVal==contactList.length-1)
                            break;
                        indexVal++;
                    }
                    component.set("v.endIndex",indexVal);
                    component.set("v.startIndex",0);
                    component.set("v.tempContactData",temp);
                    component.find('prevButton').set('v.disabled',true);
                    component.find('firstButton').set('v.disabled',true);
                    if(indexVal==contactList.length-1){
                        component.find('nextButton').set('v.disabled',true);
                        component.find('lastButton').set('v.disabled',true);
                    }
                    else{
                        component.find('nextButton').set('v.disabled',false);
                        component.find('lastButton').set('v.disabled',false);
                    }
                    var cmpTarget = component.find('contactTable');
                    $A.util.removeClass(cmpTarget, 'dataTableClass');
                    var cmpTarget2 = component.find('noContacts');
                    $A.util.addClass(cmpTarget2, 'noContactClass');
                    var cmpTarget2 = component.find('noSearchContacts');
                    $A.util.addClass(cmpTarget2, 'noContactClass');
                    component.set("v.contactRecordNotEmpty",true);
                }
                else{
                    var cmpTarget = component.find('contactTable');
                    $A.util.addClass(cmpTarget, 'dataTableClass');
                    var cmpTarget2 = component.find('noContacts');
                    $A.util.removeClass(cmpTarget2, 'noContactClass');
                    component.set('v.contactRecordNotEmpty',false);
                    component.find('nextButton').set('v.disabled',true);
                    component.find('lastButton').set('v.disabled',true);
                    component.find('firstButton').set('v.disabled',true);
                    component.find('prevButton').set('v.disabled',true);
                }
            }
        });
        $A.enqueueAction(action);
    },
    sortData : function(component,fieldName,sortDirection){
        var data = component.get("v.tempContactData");
        //function to return the value stored in the field
        var key = function(a) { return a[fieldName]; }
        var reverse = sortDirection == 'asc' ? 1: -1;
        data.sort(function(a,b){ 
            var a = key(a) ? key(a).toLowerCase() : '';//To handle null values , uppercase records during sorting
            var b = key(b) ? key(b).toLowerCase() : '';
            return reverse * ((a>b) - (b>a));
        });    
        //set sorted data to accountData attribute
        component.set("v.tempContactData",data);
    },
    getFilteredContactData:function(component){
        var action = component.get("c.getFilteredContacts");
        action.setParams({
            searchString : component.get("v.searchString"),
            accountId : component.get("v.recordId")
        });
        action.setCallback(this,function(response){
            var state = response.getState();
            if(state == "SUCCESS"){
                var contactList = response.getReturnValue();
                if(contactList.length != 0){
                    contactList.forEach(function(item) {
                        item['URL'] = '/lightning/r/Case/' + item['Id'] + '/view';
                    });
                    component.set("v.contactData",contactList);
                    component.set("v.totalRecords",contactList.length);
                    var temp = [];
                    var indexVal = 0;
                    while(indexVal<contactList.length && indexVal <=component.get("v.recordsToShow")-1){
                        temp[indexVal] = contactList[indexVal];
                        if(indexVal==component.get("v.recordsToShow")-1||indexVal==contactList.length-1)
                            break;
                        indexVal++;
                    }
                    component.set("v.endIndex",indexVal);
                    component.set("v.startIndex",0);
                    component.set("v.tempContactData",temp);
                    component.find('prevButton').set('v.disabled',true);
                    component.find('firstButton').set('v.disabled',true);
                    if(indexVal==contactList.length-1){
                        component.find('nextButton').set('v.disabled',true);
                        component.find('lastButton').set('v.disabled',true);
                    }
                    else{
                        component.find('nextButton').set('v.disabled',false);
                        component.find('lastButton').set('v.disabled',false);
                    }
                }else{
                    var cmpTarget = component.find('contactTable');
                    $A.util.addClass(cmpTarget, 'dataTableClass');
                    var cmpTarget2 = component.find('noSearchContacts');
                    $A.util.removeClass(cmpTarget2, 'noContactClass');
                    component.set('v.contactRecordNotEmpty',false);
                    component.find('nextButton').set('v.disabled',true);
                    component.find('lastButton').set('v.disabled',true);
                    component.find('firstButton').set('v.disabled',true);
                    component.find('prevButton').set('v.disabled',true);
                }
            }
        });
        $A.enqueueAction(action);   
    }
})