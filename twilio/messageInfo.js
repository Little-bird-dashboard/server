const Queries = require('../database/smsqueries');

/*FOR INCOMING RESPONSES FROM LITTLE BIRD*/
function storeMessageInfo_incoming(message) {
  return getInfo(message.From)
      .then(prepareMessage.bind(null, message))
      .catch('something went wrong');
}

function prepareMessage(message,data){
  message_info= {
    communication_type_id: 1,
    raw_body: message.Body,
    timestamp: Date.now(),
    student_id: data.student_id,
    stakeholder_id: data.stakeholder_id,
    MessageSid: message.MessageSid,
    AccountSid: message.AccountSid,
    message_status: message.SmsStatus,
    communication_recipient_contact: message.To,
    communication_sender_contact: message.From
  };
  return message_info;
}

/*FOR OUTGOING RESPONSES FROM LITTLE BIRD*/
function storeMessageInfo_outgoing(message) {
  return getInfo(message.to)
      .then(prepareOutgoingMessage.bind(null, message))
      .catch('something went wrong');
}

function prepareOutgoingMessage(message,data){
  let message_info= {
    communication_type_id: 4,
    raw_body: message.body,
    timestamp: Date.now(),
    student_id: data.student_id,
    stakeholder_id: 7,
    MessageSid: message.sid,
    AccountSid: message.accountSid,
    message_status: message.status,
    communication_recipient_contact: message.to,
    communication_sender_contact: message.from
  };
  return message_info;
}

 /*OVERLAPPING FUNCTIONS*/


 function getInfo(cell){
   return Queries.findStudentandStakeholder(cell);
 }


  module.exports={
   storeMessageInfo_incoming,
   storeMessageInfo_outgoing
  };
