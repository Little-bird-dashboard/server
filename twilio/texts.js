require('dotenv').config({path: '../.env'});
//var client = require('twilio')('ACc71efe287963381a331670fd48bbbf3d', 'dcefdcfe799de453bcaf65bbc4641adb');

var client = require('twilio')(process.env.accountSid, process.env.authToken);


function startingMessage(cell){
  return client.messages.create({
      body: `Hey it's Little Bird from Hogwarts Elementary! Your child's IEP review is coming up. What days during the week of September 4th would you be available to meet for an hour? For example, type 'Monday, Tuesday and Wednesday'`,
      to: cell,  // Text this number
      from: '+18042982615' // From a valid Twilio number
  })
}

function timeOfDayMessage(cell){
  client.messages.create({
      body: `Great! Do mornings or afternoons tend to work better for you?`,
      to: cell,  // Text this number
      from: '+18042982615' // From a valid Twilio number
  })
  .then((message) => console.log(message.sid));
}

function preDoodleMessage(cell){
  client.messages.create({
      body: `Awesome! We will be in touch soon with potential times.`,
      to: cell,  // Text this number
      from: '+18042982615' // From a valid Twilio number
  })
  .then((message) => console.log(message.sid));
}

function confirmationMessage(cell){
  client.messages.create({
    body: `Hey it's Little Bird again! Which of these three times is best for Jane's IEP review?
    Please type one of the following numbers:
    1. Monday, September 4th at 3 PM
    2. Tuesday, September 5th at 8 AM
    3. Tuesday, September 5th at 11 AM
    4. None of these times work for me`,
    to: cell,  // Text this numbery
    from: '+18042982615' // From a valid Twilio number
    })
}

module.exports={
  startingMessage,
  timeOfDayMessage,
  preDoodleMessage,
  confirmationMessage
};
//startingMessage();
//timeOfDayMessage();
// confirmationMessage();
// thankYouMessage();

//SM9cbf925a76c34244bab4fd8a86b2fedf
