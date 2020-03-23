# Lightning-Component-Pagination
Table pagination, map iterations, select checked accounts, lightning data table, LDT URL, validations,Parsing JSON response

## TASK 1
We would like to build a convertor tool from bitcoin to USD.
To get the recent bitcoin to USD value we’re going to use an external data source.
We would like to make A GET REST API call to https://bitpay.com/api/rates/
Should return the recent value of one bitcoin in USD in the following format:
{"code":"BTC","name":"Bitcoin","rate":1},{"code":"BCH","name":"Bitcoin Cash","rate":6.347769},{"code":"USD","name":"US Dollar","rate":9331.22}
The value we’re looking for is: 9331.22.
### Approach
- Task is to get the value of one bitcoin in USD by making a REST API call to https://bitpay.com/api/rates/.  
- The task is implemented with the help of an APEX class which makes an API request to the end point URL. 
- The response from the endpoint is a JSON string of the format :
  - {"code":"BTC","name":"Bitcoin","rate":1},{"code":"BCH","name":"Bitcoin Cash","rate":29.94},{"code":"USD","name":"US Dollar","rate":7700.03}
- The response from the external system is parsed using a json parser. Firstly, the value of US dollar is identified with code value USD. After that, the parser is made to identify the rate value within that object, which gives the value of USD for one bitcoin.
- The value of USD is not fixed always. It varies with time.
- Changes are made to Test class provided because REST API callouts to actual endpoint is not allowed in Test class. So, a mock callout is implemented in the test class which specifies the response that is sent in the respond method.

### Metadata created:
- APEX Classes
  - BitcoinToUSDConvertor
  - BitcoinToUSDConvertorTest.


## TASK 2
We would like to build a Lightning component where a user can use our bitcoin converter. The user can convert Bitcoin to a selected currency or from that selected currency to Bitcoin.
The component would look like this:
![image](https://user-images.githubusercontent.com/20809248/77335283-d9932600-6d1d-11ea-86e7-39de20f3ebce.png)

We would then let the user see a dropdown with all the available currencies, the default currency would be USD. The dropdown values would be the names of the currencies rather than the currency code.
The currency options would be all the currencies the API call returned. (No need to show the option of converting bitcoin to bitcoin of course)
Then, the component would have 2 input fields, one for “US Dollar Amount” and one for “Bitcoin Amount”. When the amount is changed by a user in one of the fields, our component will automatically calculate the value in the other field and will update the other field.
The label of the “US Dollar Amount” input field needs to change as the user selects a different currency. The user should only enter numbers and shouldn’t be able to enter and characters into the input fields.

### Approach
- When the component loads, fetch the available currency values into the currency picklist except the bitcoin currency itself. Default currency will be USD.
- Two input fields, one for bitcoin currency and the other for converted currency value.
- The name of the converted currency field dynamically changes when the currency is changed in picklist.
- When the user enters input in bitcoin field, the input will be converted depending on the selected currency rate and displayed in the converted currency field.
- Similarly, the input in the converted currency field will be converted into bitcoin value.
- Both the fields are validated for non-numeric entries.

### Metadata created:
- APEX Classes
  - BitcoinToUSDConvertor
- Lightning Component
  - BitcoinToUSDConvertor

## TASK 3
We would like to build a Lightning component that allows the user to create many opportunities for the existing accounts.
The component would show all the existing accounts and allow the user to select for which accounts to create an opportunity.
The account table would use pagination as there may be a lot of accounts in the system.
The page would look like this:
![image](https://user-images.githubusercontent.com/20809248/77335952-c896e480-6d1e-11ea-8db3-90fd86e8fab6.png)
- Each page contains 5 accounts.
- The amount, Closed date and stage are required and will be the same for all new opportunities
- The new opportunities names would be “New auto opportunity create for “ + Account name.
- If no accounts are selected show error message
- Pagination buttons should be disabled if there is no next/previous page.
- On creation show success message
- Make sure if some of the opportunities cannot be created but others can to create the ones you can and show error message for each opportunity that couldn’t be created due to any DML errors.
- The stage input should have all the available stages for opportunity

### Approach
- A lightning component is created with all the necessary elements to take input values to create an opportunity.
- One input field is created to enter the opportunity amount Value. This is a required field and validation is done to enter only numeric values.
- A picklist field with all the stage names available for an opportunity.
- A date field to enter the close date which is required as well to create an opportunity.
- A table with all the accounts in the system with a checkbox to select the account for which an opportunity needs to be created. If the user fails to select an account, then a toast error message is displayed to the user.
- All the above mentioned fields are required to create an opportunity. When the Create opportunity button is clicked after entering all the required values, an opportunity is created for the selected account. 
- After successful creation of opportunity a toast success message is displayed to the user.
- Whenever the opportunity DML operation fails, that exception is handled from apex class to aura component. For example, if the close date field is missing(failed to use close date while creating opportunity object) while inserting an opportunity, the following error message will be displayed to the user.
- After submitting the opportunity record, the form is cleared.

### Metadata created:
- APEX Classes
  - CreateOpportunitiesController
- Lightning Component
  - CreateOpportunities


## TASK 4 Queueable Apex
We would like to add a trigger code to calculate the Accounts annual revenue in bitcoin. Each account has a default “Annual Revenue” field. We would need to add a new “Annual Revenue in Bitcoin” field. Bitcoins should have 8 decimal places. When someone updates the account “Annual Revenue” we would need to do a callout to https://bitpay.com/api/rates/ Get the value of each bitcoin in USD and update the bitcoin field for the account.

### Approach
- The approach here is to use a queueable apex class as a trigger handler. The advantage of using queueable apex class are:
  - An id will be assigned to the job which can be used to track the job.
  - Non primitive data types can be passed to the queueable apex class.
  - One job can be chained to another job by starting a second job from the running job.
- When the Annual Revenue field is updated on the account, before trigger will be executed, which in turn calls the queueable apex class.
- This queueable class makes the REST API call out and gets the bitcoin value in USD.
- Then, the Annual Revenue in Bitcoin is updated.

### Metadata created:
- Trigger
  - AccountBitcoinRevenue
- APEX Classes
  - AccountTriggerHandler
- Custom Field
  - Annual_Revenue_in_Bitcoin__c on Account


## TASK 5
One of the common components we create is a simple and easy to use table which allows the user to search, filter and paginate the list. For example, if there are a lot of contacts under each account, users might want and easy way to be able to view all the contacts under and account, be able to sort the table by any column and paginate the table so that the user doesn’t have to scroll too much.
The component would look like this:
![image](https://user-images.githubusercontent.com/20809248/77336614-b0739500-6d1f-11ea-822e-e92b6faff9cc.png)


### Approach
- Contacts for an account are displayed in a lightning data table. This table can be sorted on all the columns. If no contacts are there on an account, No contacts to display message is shown.
- The table has 4 buttons for pagination purpose. First, previous, next and last buttons will be enabled/disabled depending on the contacts to show. If no contacts to show buttons will be disabled and vice versa.
- When the table is sorted on a column, corresponding arrow mark is shown on the column.
- User selects the number of contacts to display in the table using the Show picklist field. By default the value will be 5. If there are less than 5 contacts or no contacts, all the pagination buttons will be disabled. 
- When the page size changes, the current page will be changed to page 1. 	This does not apply when the sort happens.
- A textbox is provided on top of the table to search for contacts in the table. The text entered will be used in SOSL query with ALL FIELDS search criteria. Change the page to page 1 even now. If no contacts are fetched by SOSL, then instead of table, No contacts matching the search criteria is shown.
- Upon clicking the contact name, a new tab will be opened in the service console app to view the contact details.

### Metadata created:
- APEX Classes
  - DisplayContactTableInAccount
- Lightning Component
  - ContactTableInAccountRecord.


