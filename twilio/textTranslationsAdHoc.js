function getTranslation(iep_deadline, school_name, language, message_name){
  var translator =
  {startingMessage:
    {en: `Hey it's Little Bird from ${school_name}! Your child's IEP review is coming up. What days during the week of ${iep_deadline} would you be available to meet for an hour? For example, type 'Monday, Tuesday and Wednesday'`,
     es: `Hola es 'Little Bird' de ${school_name}! Ya toca la revisión del
    IEP (Programa educativo individualizado) de su estudiante. Que dias
    durante la semana del ${iep_deadline} usted disponible para
    una junta de una hora? Por ejemplo, responda, 'Lunes, Martes y
    Miércoles.'`},
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
  };
  return translator[message_name][language];
}


module.exports=
{getTranslation};
