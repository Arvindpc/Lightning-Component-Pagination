public class DisplayContactTableInAccount {
    @AuraEnabled
    public static List<Contact> getContacts(Id accountId ){
		return [SELECT ID,Name,Email,Title,Birthdate,AccountId FROM Contact where AccountId =: accountId];
    }
    @AuraEnabled
    public static List<Contact> getFilteredContacts(String searchString,Id accountId){
        system.debug('inside seach method');
        searchString = '*'+searchString+'*';
        List<List<SObject>> contactRecords =  [FIND :searchString IN ALL FIELDS RETURNING Contact(Id, Name,Email,Title,Birthdate,AccountId 
                                                                                    Where AccountId =: accountId)];
        return (List<Contact>)contactRecords.get(0);
    }
}