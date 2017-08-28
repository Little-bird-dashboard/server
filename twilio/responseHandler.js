var texts = require('../twilio/texts.js');
var Queries = require('../database/schedulequeries');

function getResponse(message, ids){
  console.log(message);
  console.log(ids);
  const {stakeholder_id, student_id} = ids;
    console.log('should be getting response');
  let availability = [];
  let days = [];
  console.log('checking out message');
  console.log(message.toLowerCase());
  console.log(message.toLowerCase().includes('monday'));
  if(message.toLowerCase().includes('monday') || message.toLowerCase().includes('tuesday') || message.toLowerCase().includes('wednesday') || message.toLowerCase().includes('thursday') || message.toLowerCase().includes('friday')) {
    //continue on to update array of blackout dates
    console.log('hereee');
    if (message.toLowerCase().includes('monday')) {
      days.push('Monday')
    }
    if (message.toLowerCase().includes('tuesday')) {
      days.push('Tuesday')
    }
    if (message.toLowerCase().includes('wednesday')) {
      days.push('Wednesday')
    }
    if (message.toLowerCase().includes('thursday')) {
      days.push('Thursday')
    }
    if (message.toLowerCase().includes('friday')) {
      days.push('Friday')
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
      console.log('hi');
      Queries.insertOneDayPeriod(period)
        .then(message=>console.log(message));
    });
    console.log('here');
    return texts.timeOfDayMessage;
  }else if(message.toLowerCase().includes('morning') || message.toLowerCase().includes('afternoon') || message.toLowerCase().includes('either') || message.toLowerCase().includes('both')){
    if (message.toLowerCase().includes('morning')) {
      //schedule.morningOrAfternoon('morning');
    }
    if (message.toLowerCase().includes('afternoon')) {
    //  schedule.morningOrAfternoon('afternoon');
    }
    return texts.preDoodleMessage;
  }else if(message.includes('1') || message.includes('2') || message.includes('3') || message.includes('4')){
    if(message.includes('1') || message.includes('2') || message.includes('3')){
      //insert confirmed date in table
      return texts.confirmationMessage;
    }else if (message.includes('4')){
      return texts.refindDate;
    }
  }else{
    return texts.errorMessage;
  }
}


module.exports = {
  getResponse
};
