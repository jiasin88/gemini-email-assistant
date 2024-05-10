# gemini-email-assistant
Building a Gemini-powered Email Assistant with Google Apps Script

Link: https://medium.com/google-cloud/beyond-inbox-zero-building-a-gemini-powered-email-assistant-with-google-apps-script-3f187ee8e27b

Deployment Steps 
1) Get your API Key from Google AI Studio: https://makersuite.google.com/
2) Create a new Apps Script Project: https://script.google.com/intro
3) Go to Project Settings and insert your API key under Script Properties (Property: GEMINI_API_KEY, Value=<Your_API_KEY>)
4) Copy the code from JSCode.gs in this repository, Go to Editor and copy-paste the code into your Code.gs file
5) Make the necessary changes to
   - _context_ variable (Line 3)
   - _searchQuery_ variable (Line 26)
   - _endpoint_ variable (Line 110, if you are using another model instead of Gemini 1.0 Pro)
     
   **Please ensure that _searchQuery_ variable is fine-tuned accordingly to retrieve your target emails. A overly broad search query could result in Gemini scanning majority of your emails
   
6) Save the project, ensure that function selected for running is **analyseEmails** before clicking on Run. Run the script once to test if it retrieves and analyses the right emails
7) Go to Trigger, Add a Trigger, Select **analyseEmails** under "Choose which function to run", leave the rest as default and Save.
