var texts = require('../twilio/texts.js');
var Queries = require('../database/schedulequeries');

function getResponse(message, ids){
  const {stakeholder_id, student_id} = ids;
  let availability = [];
  let days = [];
  let morning_availability = {
    stakeholder_id: stakeholder_id,
    date: '',
    timeframe: 'morning'
  };
  console.log(morning_availability);
  let afternoon_availability = {
    stakeholder_id: stakeholder_id,
    date: '',
    timeframe: 'afternoon'
  };
  if(message.toLowerCase().includes('monday') || message.toLowerCase().includes('tuesday') || message.toLowerCase().includes('wednesday') || message.toLowerCase().includes('thursday') || message.toLowerCase().includes('friday')) {
    //continue on to update array of blackout dates
    if (message.toLowerCase().includes('monday')) {
      days.push('monday')
    }
    if (message.toLowerCase().includes('tuesday')) {
      days.push('tuesday')
    }
    if (message.toLowerCase().includes('wednesday')) {
      days.push('wednesday')
    }
    if (message.toLowerCase().includes('thursday')) {
      days.push('thursday')
    }
    if (message.toLowerCase().includes('friday')) {
      days.push('friday')
    }
    for (var i = 0; i < days.length; i++) {
      availability.push({
        stakeholder_id: stakeholder_id,
        date: days[i],
        timeframe: 'morning'
      });
      availability.push({
        stakeholder_id: stakeholder_id,
        date: days[i],
        timeframe: 'afternoon'
      });
    }
    availability.forEach(period=>{
      console.log('here');
      Queries.insertOneDayPeriod(period);
    })

    // const unique_days = [...new Set(availability.map(item => item.date))];
    // const unique_days = [...new Set(availability.map(item => item.date))];
    // console.log(unique_days);
    // new_days = `'${unique_days.join("', '")}'`;
    // console.log(new_days);
    //if response looks like day, ask for time of day
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
