public class CreateOpportunitiesController {
    @AuraEnabled
    public static List <String> getStageNameOptions(string fieldId) {
        List<String> allOpts = new list <String>(); 
        Schema.sObjectType objType = Opportunity.getSObjectType();
        Schema.DescribeSObjectResult objDescribe = objType.getDescribe();
        map<String, Schema.SObjectField> fieldMap = objDescribe.fields.getMap();
        list<Schema.PicklistEntry> values = fieldMap.get(fieldId).getDescribe().getPickListValues(); 
        for (Schema.PicklistEntry a: values) {
            allOpts.add(a.getValue());
        }
        allOpts.sort();
        return allOpts;
    }
    @AuraEnabled
    public static List<Account> getAllAccount(){
        return [SELECT Id,Name,Phone FROM Account];
    }
    @AuraEnabled
    public static String createAccountOpportunities(Map<Id,String> accountIdName,Double amount,String stageName,Date closeDate){
        system.debug('size '+amount);
        List<Opportunity> opportunityToCreate = new List<Opportunity>();
        for(Id id : accountIdName.keyset()){
            Opportunity opp = new Opportunity(Name='New auto opportunity create for '+accountIdName.get(id),
                                              AccountId=id,
                                              Amount=amount,
                                             StageName=stageName
                                             );
            
            system.debug('amount '+amount);
            system.debug(' '+stageName+' '+closeDate);
            opportunityToCreate.add(opp);
        }
        String errorMessage = '';
        if(opportunityToCreate != null){
                Database.SaveResult[] srList = Database.insert(opportunityToCreate, false);
                for (Database.SaveResult sr : srList) {
                    if (!sr.isSuccess()) {
                        for(Database.Error objErr : sr.getErrors()) {
                            errorMessage+='opportunity cannot be inserted \n';
                            errorMessage+='\n['+objErr.getMessage()+']';
                        }
                    }
                }
            }
      system.debug('error message '+errorMessage);
    return errorMessage;  
    }
        
    }