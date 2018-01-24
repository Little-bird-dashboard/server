require('dotenv').config({path: '../.env'});
//var client = require('twilio')('ACc71efe287963381a331670fd48bbbf3d', 'dcefdcfe799de453bcaf65bbc4641adb');
var moment = require('moment');


var client = require('twilio')(process.env.accountSid, process.env.authToken);


function startingMessage(cell, deadline, school_name){
  const date = moment(deadline, 'ddd MMM DD YYYY hh:mm:ss [GMT]ZZ').format('MM-DD-YYYY');
  return client.messages.create({
      body: `Hey it's Little Bird from ${school_name}! Your child's IEP review is coming up. What days during the week of ${date} would you be available to meet for an hour? For example, type 'Monday, Tuesday and Wednesday'`,
      to: cell,  // Text this number
      from: '+18042982615' // From a valid Twilio number
  });
}

function timeOfDayMessage(cell, sped_info){
  return client.messages.create({
      body: `Great! Do mornings or afternoons tend to work better for you?`,
      to: cell,  // Text this number
      from: '+18042982615' // From a valid Twilio number
  });
}

function preDoodleMessage(cell, sped_info){
  return client.messages.create({
      body: `Awesome! We will be in touch soon with potential times.`,
      to: cell,  // Text this number
      from: '+18042982615' // From a valid Twilio number
  });
}

function confirmationInitiationMessage(cell){
  return client.messages.create({
    body: `Hey it's Little Bird again! Which of these three times is best for your child's IEP review?
    Please type one of the following numbers:
    1. Monday, September 4th at 9 AM
    2. Tuesday, September 5th at 8 AM
    3. Tuesday, September 5th at 11 AM
    4. None of these times work for me`,
    to: cell,  // Text this numbery
    from: '+18042982615' // From a valid Twilio number
  });
}

function confirmationMessage(cell, sped_info){
  return client.messages.create({
    body: `Thanks for confirming! ${sped_info.first_name} ${sped_info.last_name} is looking forward to seeing you.`,
    to: cell,  // Text this numbery
    from: '+18042982615' // From a valid Twilio number
  });
}

function refindDate(cell, sped_info){
  return client.messages.create({
    body: `I will look for other times and respond with a few more options soon.`,
    to: cell,  // Text this numbery
    from: '+18042982615' // From a valid Twilio number
  });
}

function errorMessage(cell, sped_info){
  return client.messages.create({
    body: `I did not understand that. Please retry or contact ${sped_info.first_name} ${sped_info.last_name} at ${sped_info.cell}`,
    to: cell,  // Text this numbery
    from: '+18042982615' // From a valid Twilio number
  });
}

module.exports={
  startingMessage,
  timeOfDayMessage,
  preDoodleMessage,
  confirmationInitiationMessage,
  confirmationMessage,
  refindDate,
  errorMessage
};
