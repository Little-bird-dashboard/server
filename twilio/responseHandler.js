var texts = require('../twilio/texts.js');

function getResponse(message){
  if(message.toLowerCase().includes('monday') || message.toLowerCase().includes('tuesday') || message.toLowerCase().includes('wednesday') || message.toLowerCase().includes('thursday') || message.toLowerCase().includes('friday')) {

    //continue on to update array of blackout dates
    if (message.toLowerCase().includes('monday')) {
        //schedule.blackoutDates('monday');
    }
    if (message.toLowerCase().includes('tuesday')) {
        //schedule.blackoutDates('tuesday');
    }
    if (message.toLowerCase().includes('wednesday')) {
      //  schedule.blackoutDates('wednesday');
    }
    if (message.toLowerCase().includes('thursday')) {
      //  schedule.blackoutDates('thursday');
    }
    if (message.toLowerCase().includes('friday')) {
      //  schedule.blackoutDates('friday');
    }
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
