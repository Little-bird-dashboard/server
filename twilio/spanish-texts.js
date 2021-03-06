require('dotenv').config({path: '../.env'});
//var client = require('twilio')('ACc71efe287963381a331670fd48bbbf3d', 'dcefdcfe799de453bcaf65bbc4641adb');

var client = require('twilio')(process.env.accountSid, process.env.authToken);
var moment = require('moment');


function startingMessage(cell, deadline, school_name){
  const date = moment(deadline, 'ddd MMM DD YYYY hh:mm:ss [GMT]ZZ').format('MM-DD-YYYY');
  return client.messages.create({
      body: `Hola es 'Little Bird' de ${school_name}! Ya toca la revisión del
IEP (Programa educativo individualizado) de su estudiante. Que dias
durante la semana del ${date} está usted disponible para
una junta de una hora? Por ejemplo, responda, 'Lunes, Martes y
Miércoles.'`,
      to: cell,  // Text this number
      from: '+18042982615' // From a valid Twilio number
  });
}

function timeOfDayMessage(cell, sped_info){
  return client.messages.create({
      body: `Genial! Que horario es mejor para usted? En la mañana o la
tarde?`,
      to: cell,  // Text this number
      from: '+18042982615' // From a valid Twilio number
  });
}

function preDoodleMessage(cell, sped_info){
  return client.messages.create({
      body: `Que bueno! En seguida le mandaremos horarios
potenciales.`,
      to: cell,  // Text this number
      from: '+18042982615' // From a valid Twilio number
  });
}

function confirmationInitiationMessage(cell){
  return client.messages.create({
    body: `Hola es 'Little Bird' nuevamente! Cual de estos tres horarios es
mejor para la revisión del IEP de tu nino?
    Por favor responda con uno de los siguiente numeros:
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
    body: `Gracias por confirmar! ${sped_info.first_name} ${sped_info.last_name} está lista para la junta.`,
    to: cell,  // Text this numbery
    from: '+18042982615' // From a valid Twilio number
  });
}

function refindDate(cell, sped_info){
  return client.messages.create({
    body: `Está bien. Yo buscaré otros horarios y le mandaré las opciones en seguida.`,
    to: cell,  // Text this numbery
    from: '+18042982615' // From a valid Twilio number
  });
}

function errorMessage(cell, sped_info){
  return client.messages.create({
    body: `Disculpe, no entendí lo que me quizo decir. Por favor intente
nuevamente o contacte a ${sped_info.first_name} ${sped_info.last_name} al ${sped_info.cell}`,
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
