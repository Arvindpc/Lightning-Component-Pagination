({
    onInit : function(component,event,helper){
        // Setting column information.To make a column sortable,set sortable as true on component load
        component.set("v.contactColumns",[
            {
                label : 'NAME',
                fieldName : 'URL',
                type : 'url',
                typeAttributes: {
                    label: { 
                        fieldName: 'Name' 
                    },
                    target : '_self'
                },
                sortable : true
            },
            {
                label : 'EMAIL',
                fieldName : 'Email',
                type : 'text',
                sortable : true
            },
            {
                label : 'JOB',
                fieldName : 'Title',
                type : 'text',
                sortable : true
            },
            {
                label : 'DATE OF BIRTH',
                fieldName : 'Birthdate',
                type : 'Date',
                sortable : true
            }
        ]);
        // call helper function to fetch account data from apex
        helper.getContactData(component);
    },
    
    //Method gets called by onsort action,
    handleSort : function(component,event,helper){
        //Returns the field which has to be sorted
        var sortBy = event.getParam("fieldName");
        
        //returns the direction of sorting like asc or desc
        var sortDirection = event.getParam("sortDirection");
        //Set the sortBy and SortDirection attributes
        component.set("v.sortBy",sortBy);
        component.set("v.sortDirection",sortDirection);
        // call sortData helper function
        helper.sortData(component,sortBy,sortDirection);
    },
    filterContactsToDisplay:function(component,event,helper){
        if(component.get("v.searchString") != ""){
            helper.getFilteredContactData(component);
        }
        else{
            helper.getContactData(component);
        }
        
    },
    navigateToFirst: function(component,event,helper){
        var end=parseInt(component.get("v.recordsToShow"))-1;
        var start = 0;
        component.set("v.startIndex",start);
        component.set("v.endIndex",end);
        var temp=[];
        for(var i=start;i<=end;i++){
            temp.push(component.get("v.contactData")[i]);
        }
        component.set("v.tempContactData",temp);
        component.find('prevButton').set('v.disabled',true);
        component.find('firstButton').set('v.disabled',true);
        component.find('nextButton').set('v.disabled',false);
        component.find('lastButton').set('v.disabled',false);
    },
    navigateToLast: function(component,event,helper){
        var end=component.get("v.contactData").length-1;
        var start = component.get("v.contactData").length - (component.get("v.contactData").length % parseInt(component.get("v.recordsToShow")));
        component.set("v.startIndex",start);
        component.set("v.endIndex",end);
        var temp=[];
        for(var i=start;i<=end;i++){
            temp.push(component.get("v.contactData")[i]);
        }
        component.set("v.tempContactData",temp);
        component.find('prevButton').set('v.disabled',false);
        component.find('firstButton').set('v.disabled',false);
        component.find('nextButton').set('v.disabled',true);
        component.find('lastButton').set('v.disabled',true);
        $A.util.removeClass(component.find('firstIcon'), 'iconClass');
    },
    navigateToPrevious: function(component,event,helper){
        component.find('nextButton').set('v.disabled',false);
        component.find('lastButton').set('v.disabled',false);
        var start = component.get("v.startIndex");
        var end = component.get("v.endIndex");
        end=start-1;
        start = start-parseInt(component.get("v.recordsToShow"));
        component.set("v.startIndex",start);
        component.set("v.endIndex",end);
        var temp=[];
        for(var i=start;i<=end;i++){
            temp.push(component.get("v.contactData")[i]);
        }
        component.set("v.tempContactData",temp);
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
        var numberOfRecords = parseInt(component.get("v.recordsToShow"));
        start=end+1;
        if(component.get("v.contactData").length-1 - end >numberOfRecords){
            end=end+numberOfRecords;
        }
        else{
            end=component.get("v.contactData").length-1;
            component.find('nextButton').set('v.disabled',true);
            component.find('lastButton').set('v.disabled',true);
        }
        component.set("v.startIndex",start);
        component.set("v.endIndex",end);
        var temp=[];
        for(var i=start;i<=end;i++){
            temp.push(component.get("v.contactData")[i]);
        }
        component.set("v.tempContactData",temp);
    },
    changeRecordsToShow:function(component,event,helper){
        var start = 0;
        var end = 0;
        var numberOfRecords = parseInt(component.get("v.recordsToShow"));
        if(component.get("v.contactData").length >numberOfRecords){
            end=start+numberOfRecords-1;
            component.find('nextButton').set('v.disabled',false);
            component.find('lastButton').set('v.disabled',false);
            component.find('firstButton').set('v.disabled',true);
            component.find('prevButton').set('v.disabled',true);
        }
        else{
            end=component.get("v.contactData").length-1;
            component.find('nextButton').set('v.disabled',true);
            component.find('lastButton').set('v.disabled',true);
            component.find('firstButton').set('v.disabled',true);
            component.find('prevButton').set('v.disabled',true);
        }
        var temp=[];
        for(var i=start;i<=end;i++){
            temp.push(component.get("v.contactData")[i]);
        }
        component.set("v.tempContactData",temp);
        component.set("v.startIndex",start);
        component.set("v.endIndex",end);
        
    }
})