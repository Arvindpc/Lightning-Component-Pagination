//Developer : Aravinda Chamaraja
//This class is used as a controller for BitcoinToUSDConvertor component
public class BitcoinToUSDConvertor {
    public Decimal ValueOfOneBitcoinInUSD;
    public BitcoinToUSDConvertor(){
		getTheValueOfOneBitcoinInUSD();
	}
    //Method to get the value of one bitcoin in USD 
	private Decimal getTheValueOfOneBitcoinInUSD(){
        //Make a REST API call to the end point 
        String endPoint = 'https://bitpay.com/api/rates/';
    	Http http = new Http();
    	HttpRequest req = new HttpRequest();
    	req.setEndPoint(endPoint);
    	req.setMethod('GET');
    	HttpResponse response = http.send(req);
        //Parse the response
        JSONParser parser = JSON.createParser(response.getBody());
        while (parser.nextToken() != null) {
           // The value of USD will be present in code=USD
           if ((parser.getCurrentToken() == JSONToken.VALUE_STRING) && (parser.getText() == 'USD')) {
                // Get the value.
                parser.nextToken();
                // In the current USD value, parse untill the rate token is reached.
                while(parser.getCurrentToken() != JSONToken.FIELD_NAME || parser.getText() != 'rate'){
                	parser.nextToken();
                }
                // One the rate key is reached, next token will be rate value.
                parser.nextToken();
               	ValueOfOneBitcoinInUSD = parser.getDecimalValue();
                break;
            }
        }
        return ValueOfOneBitcoinInUSD;
    }
    @AuraEnabled //get Currency code and value picklist values
    public static Map<String, String> getCurrencyValues(){
        Map<String, String> options = new Map<String, String>();
        String currencyCode = '';
        String currencyValue = '';
        Double conversionValue = 0.0;
        String endPoint = 'https://bitpay.com/api/rates/';
    	Http http = new Http();
    	HttpRequest req = new HttpRequest();
    	req.setEndPoint(endPoint);
    	req.setMethod('GET');
    	HttpResponse response = http.send(req);
        JSONParser parser = JSON.createParser(response.getBody());
        while (parser.nextToken() != null) {
           if ((parser.getCurrentToken() == JSONToken.FIELD_NAME) && (parser.getText() == 'code') || (parser.getText() == 'name')) { 
               if(parser.getText() == 'code'){
                 	parser.nextToken();
                	currencyCode = parser.getText();
               }else{
                     parser.nextToken();
                     currencyValue = parser.getText();
               }
               if(currencyCode != null && currencyValue != null && currencyCode != 'BTC'){
                        options.put(currencyCode,currencyValue);
               }  
            }    
                
        
    }
    system.debug(options);
    return options;
    }
    @AuraEnabled //get Currency code and Rate values
    public static Map<String, Double> getCurrencyRateValues(){
        Map<String, Double> options = new Map<String, Double>();
        String currencyCode = '';
        Double conversionRate = 0.0;
        String endPoint = 'https://bitpay.com/api/rates/';
    	Http http = new Http();
    	HttpRequest req = new HttpRequest();
    	req.setEndPoint(endPoint);
    	req.setMethod('GET');
    	HttpResponse response = http.send(req);
        JSONParser parser = JSON.createParser(response.getBody());
        while (parser.nextToken() != null) {
           if ((parser.getCurrentToken() == JSONToken.FIELD_NAME) && (parser.getText() == 'code') || (parser.getText() == 'rate')) { 
               if(parser.getText() == 'code'){
                 	parser.nextToken();
                	currencyCode = parser.getText();
               }else{
                     parser.nextToken();
                     conversionRate = parser.getDoubleValue();
               }
               if(currencyCode != null && conversionRate != null && currencyCode != 'BTC'){
                        options.put(currencyCode,conversionRate);
               }  
            }    
                
        
    }
    system.debug(options);
    return options;
    }
}