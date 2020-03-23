//Developer : Aravinda Chamaraja
@isTest
public class AccountTriggerHandlerTest {
    // The data in the test setup method will be used by the test methods.
    @TestSetup
	static void testDataSetup(){
		//Insert one test account
		Account accountRecord = new Account(Name='Test Account');
		insert accountRecord;
		
		//insert 3 contacts for the test account
        List<Contact> contactRecordList = new List<Contact>();
        for(integer i=0;i<3;i++){
            contactRecordList.add(new Contact(Lastname='Test'+i,AccountId=accountRecord.Id));
        }
		insert contactRecordList;
	}
	
	@isTest
	static void testAccountTotalContactShareUpdate(){
        //update the total value in the test account
        Account testAccount = [select id,Name,Total__c from Account where Name='Test Account'];
        testAccount.Total__c = 100;
		
        Test.StartTest();
		update testAccount;
        Test.StopTest();
		
		//Loop through the test account contacts and assert the sum of share of all the contacts is equal to account total
        Decimal sumOfShares = 0;
        for(Contact con : [Select Id,AccountId,Share__c from Contact where AccountId=:testAccount.Id]){
            sumOfShares += con.Share__c;
        }
        system.assertEquals(100, sumOfShares);
    }
    @isTest
	static void testAccountTotalContactShareWhenSetToNull(){
        //update the total value in the test account
        Account testAccount = [select id,Name,Total__c from Account where Name='Test Account'];
        testAccount.Total__c = 100;
		update testAccount;
		
		testAccount.Total__c = null;
		Test.StartTest();
		update testAccount;
        Test.StopTest();
		
		//Loop through the test account contacts and assert the share of all the contacts is equal null
        for(Contact con : [Select Id,AccountId,Share__c from Contact where AccountId=:testAccount.Id]){
            system.assertEquals(null, con.Share__c);
        }
        
    }
}