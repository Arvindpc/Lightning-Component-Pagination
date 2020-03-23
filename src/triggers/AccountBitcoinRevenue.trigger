trigger AccountBitcoinRevenue on Account (before update) {
    system.debug('inside tribber '+CheckRecursion.inQueueableContext);
    if(!CheckRecursion.inQueueableContext&& trigger.isBefore && trigger.isUpdate){
     
    list<Account> accountsToUpdate = new list<Account>();
    for(Id accountID: trigger.newMap.keySet()){
        if(trigger.oldMap.get(accountID).AnnualRevenue != trigger.newMap.get(accountID).AnnualRevenue){
            accountsToUpdate.add(trigger.newMap.get(accountID));
        }        
    }
        if(accountsToUpdate != null){
            ID jobID = System.enqueueJob(new AccountTriggerHandler(accountsToUpdate));
        }
    }
    
}