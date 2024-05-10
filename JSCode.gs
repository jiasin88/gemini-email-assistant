function getMyContext()
{
  var context = "My name is Jia Sin/JS and I am a Google Cloud Technical Account Manager (TAM).\
  You are my virtual assistant.\
  Our key objectives are to always help customers with their queries related to Google Cloud platform health, architectural stability and operational rigour.\
  For each email received, fully analyse the email and help me with the following tasks: \
  1) Understand what is the key ask of this email. \
  2) What are the next steps that we should propose?\
  3) As part of the next steps, any further information that we should research on? If yes, search through public google cloud documentation (https://cloud.google.com) and provide me with the answers. If there is an issue cited in the email, research for more info on why the issue could have happened and ensure that this is communicated in the response\
  4) How should we respond on this email? Provide me with a sample \
  ";
  
  return context;
}



//get all the unread emails in my inbox, addressed to myself or has a mention of my name 
function retrieveEmails()
{
  // Set your search criteria
  //retrieve only unread emails
  var searchQuery = "in:inbox label:unread to:(jiasin@google.com) Jia Sin, JS, jiasin";
  
  // Get matching email threads 
  var threads = GmailApp.search(searchQuery);
  return threads;

}

function analyseEmails()
{

  threads = retrieveEmails();
  Logger.log("Number of Emails processed: " + threads.length);
  //if there are no target emails retrieved, end function
  if(threads.length==0){ return;}
  
  promptContext = getMyContext();
  myEmail = Session.getActiveUser().getEmail();
  Logger.log("Analysis will be sent to: "+myEmail);

  // Process each target email
  for (var i = 0; i < threads.length; i++) {

    var messages = threads[i].getMessages();
    var message = messages[0]; // Assuming one message per thread
    emailBody = message.getPlainBody();
    var response = callGemini(promptContext+emailBody);
  
   let threadIdToReply =threads[i].getId();
   var header = "Subject of Email being analysed: " + message.getSubject() + "\nSent Date of Email:"+ message.getDate() + "\nSender of Email: "+message.getFrom()+"\n\n";
   
   GmailApp.sendEmail(myEmail,message.getSubject(),header+response,{threadId: threadIdToReply});
   
  }
  
  

}


// Helper functions to retrieve the API Key
function getApiKeyFromScriptProperties() {
  return PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
}



function callGemini(prompt) {

 //should i also restrict the number of output tokens?
  const apiKey = getApiKeyFromScriptProperties(); 
  const safetySettings = [
    {
      "category": "HARM_CATEGORY_HARASSMENT",
      "threshold": "BLOCK_LOW_AND_ABOVE"
    },
    {
      "category": "HARM_CATEGORY_HATE_SPEECH",
      "threshold": "BLOCK_LOW_AND_ABOVE"
    },
    {
      "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
      "threshold": "BLOCK_LOW_AND_ABOVE"
    },
    {
      "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
      "threshold": "BLOCK_LOW_AND_ABOVE"
    }
  ];
  const generationConfig = {
    temperature: 1.0,
    topK: 0,
    topP: 1,
    maxOutputTokens: 2000,
  };
  var endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro-latest:generateContent?key="+apiKey;
   const payload = {
    "contents": [{
      "parts":[{
        "text": prompt},
        ]
    }],
    safetySettings,
    generationConfig
  };

  

  //Logger.log(test)
  const response = UrlFetchApp.fetch(endpoint, {
    muteHttpExceptions: true,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    payload: JSON.stringify(payload)
  });

  
  const responseData = JSON.parse(response.getContentText());
  Logger.log(responseData)
  const generatedText = responseData.candidates[0].content.parts[0].text; 
  return generatedText;


}


