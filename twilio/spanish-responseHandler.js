var texts = require('../twilio/spanish-texts.js');
var Queries = require('../database/schedulequeries');
var smsQueries = require('../database/smsqueries');

function getResponse(message, ids){
  const {stakeholder_id, student_id} = ids;
  let availability = [];
  let days = [];
  if(message.toLowerCase().includes('lunes') || message.toLowerCase().includes('martes') || message.toLowerCase().includes('miercoles') || message.toLowerCase().includes('jueves') || message.toLowerCase().includes('viernes')) {
    //continue on to update array of blackout dates
    if (message.toLowerCase().includes('lunes')) {
      days.push('Monday');
    }
    if (message.toLowerCase().includes('martes')) {
      days.push('Tuesday');
    }
    if (message.toLowerCase().includes('miercoles')) {
      days.push('Wednesday');
    }
    if (message.toLowerCase().includes('jueves')) {
      days.push('Thursday');
    }
    if (message.toLowerCase().includes('viernes')) {
      days.push('Friday');
    }
    for (var i = 0; i < days.length; i++) {
      availability.push({
        stakeholder_id: stakeholder_id,
        date: days[i],
        timeframe: 'morning'
      });
      // availability.push({
      //   stakeholder_id: stakeholder_id,
      //   date: days[i],
      //   timeframe: 'afternoon'
      // });
    }
    availability.forEach(period=>{
      Queries.insertOneDayPeriod(period)
        .then(message=>console.log(message));
    });
    return {boiler_plate: 'timeOfDayMessage',
            text_method: texts.timeOfDayMessage};
  }else if(message.toLowerCase().includes('manana') || message.toLowerCase().includes('tarde') || message.toLowerCase().includes('ya sea') || message.toLowerCase().includes('ambos')){
    if (message.toLowerCase().includes('manana')) {
      //schedule.morningOrAfternoon('morning');
    }
    if (message.toLowerCase().includes('tarde')) {
    //  schedule.morningOrAfternoon('afternoon');
    }
    return {boiler_plate: 'preDoodleMessage',
            text_method: texts.preDoodleMessage};
  }else if(message.includes('1') || message.includes('2') || message.includes('3') || message.includes('4')){
    if(message.includes('1') || message.includes('2') || message.includes('3')){
      //insert confirmed date in table
      return {boiler_plate: 'confirmationMessage',
              text_method: texts.confirmationMessage};
    }else if (message.includes('4')){
      return {boiler_plate: 'refindDate',
              text_method: texts.refindDate};
    }
  }else{
    return {boiler_plate: 'errorMessage',
            text_method: texts.errorMessage};
  }
}


module.exports = {
  getResponse
};
