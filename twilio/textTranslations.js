function getTranslation(sped_info, language, message_name){
  var translator =
  {timeOfDayMessage:
    {en:`Great! Do mornings or afternoons tend to work better for you?`,
    es:`Genial! Que horario es mejor para usted? En la mañana o la tarde?`},
  preDoodleMessage:
    {en: `Awesome! We will be in touch soon with potential times.`,
    es: `Que bueno! En seguida le mandaremos horarios potenciales.`},
  confirmationInitiationMessage:
    {en: `Hey it's Little Bird again! Which of these three times is best for your child's IEP review?
    Please type one of the following numbers:
    1. Monday, September 4th at 9 AM
    2. Tuesday, September 5th at 8 AM
    3. Tuesday, September 5th at 11 AM
    4. None of these times work for me`,
    es: `Hola es 'Little Bird' nuevamente! Cual de estos tres horarios es
    mejor para la revisión del IEP de tu nino?
    Por favor responda con uno de los siguiente numeros:
    1. Monday, September 4th at 9 AM
    2. Tuesday, September 5th at 8 AM
    3. Tuesday, September 5th at 11 AM
    4. None of these times work for me`},
  confirmationMessage:
    {en: `Thanks for confirming! ${sped_info.first_name} ${sped_info.last_name} is looking forward to seeing you.`,
    es: `Gracias por confirmar! ${sped_info.first_name} ${sped_info.last_name} está lista para la junta.`},
  refindDate:
    {en: `I will look for other times and respond with a few more options soon.`,
    es: `Está bien. Yo buscaré otros horarios y le mandaré las opciones en seguida.`},
  errorMessage:
    {en: `I did not understand that. Please retry or contact ${sped_info.first_name} ${sped_info.last_name} at ${sped_info.cell}`,
    es: `Disculpe, no entendí lo que me quizo decir. Por favor intente
    nuevamente o contacte a ${sped_info.first_name} ${sped_info.last_name} al ${sped_info.cell}`}
  };
  return translator[message_name][language];
}


module.exports=
{getTranslation};
