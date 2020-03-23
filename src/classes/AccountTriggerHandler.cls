public class AccountTriggerHandler implements Queueable,Database.AllowsCallouts {
    public List<Account> accList ; 
    public AccountTriggerHandler(List<Account> accs){
        this.accList = accs ;  
    }
    public void execute(QueueableContext context) {
        decimal ValueOfOneBitcoinInUSD = 0.0;
        String endPoint = 'https://bitpay.com/api/rates/';
        Http http = new Http();
        HttpRequest req = new HttpRequest();
        req.setEndPoint(endPoint);
        req.setMethod('GET');
        HttpResponse response = http.send(req);
        JSONParser parser = JSON.createParser(response.getBody());
        while (parser.nextToken() != null) {
            if ((parser.getCurrentToken() == JSONToken.VALUE_STRING) && 
                (parser.getText() == 'USD')) {
                    // Get the value.
                    parser.nextToken();
                    while(parser.getCurrentToken() != JSONToken.FIELD_NAME || 
                          parser.getText() != 'rate'){
                              system.debug(parser.getText());
                              parser.nextToken();
                          }
                    parser.nextToken();
                    //parser.nextToken();
                    ValueOfOneBitcoinInUSD = parser.getDecimalValue();
                    system.debug(ValueOfOneBitcoinInUSD);
                    break;
                }
        }
        List<Account> accountsToUpdate = new List<Account>();
        for(Account acc: accList){
            acc.Annual_Revenue_in_Bitcoin__c = acc.AnnualRevenue/ValueOfOneBitcoinInUSD;
            accountsToUpdate.add(acc);
        }
        if(accountsToUpdate != null){
            CheckRecursion.inQueueableContext = true;
            try{
                update accountsToUpdate;
            }catch(Exception ex){
                system.debug('exception>>>>> '+ex.getMessage());
            }
        }
    }
    
}