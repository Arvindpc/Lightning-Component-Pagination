//Developer : Aravinda Chamaraja
@isTest 
private class BitcoinToUSDConvertorTest {
    //Test class cannot do callout to actual API. So, a mock callout is implemented in test class.
    private class RestMock implements HttpCalloutMock {

        public HTTPResponse respond(HTTPRequest req) {
            String fullJson = '[{"code":"BTC","name":"Bitcoin","rate":1},{"code":"BCH","name":"Bitcoin Cash","rate":27.66},{"code":"USD","name":"US Dollar","rate":8663.53},{"code":"EUR","name":"Eurozone Euro","rate":7884.06}]';

            HTTPResponse res = new HTTPResponse();
            res.setHeader('Content-Type', 'text/json');
            res.setBody(fullJson);
            res.setStatusCode(200);
            return res;
        }
    }
	static testMethod void constructorGetsTheValueOfOneValueOfOneBitcoinInUSDFromTheApiTest(){
        Test.setMock(HttpCalloutMock.class, new RestMock());
		Test.startTest();
		BitcoinToUSDConvertor class_instance = new BitcoinToUSDConvertor();
		Test.stopTest();
        // Value of one bitcoin in USD should be the one which is present in mock callout json string.
		System.assertEquals(8663.53, class_instance.ValueOfOneBitcoinInUSD);
	}
}