const Queries = require('../database/smsqueries');
var handleResponse = require('./responseHandler.js');
var handleSpanishResponse = require('./spanish-responseHandler.js');
var translator = require('../twilio/textTranslations.js');

const Translate = require('@google-cloud/translate');
const projectId = 'littlebird-584b3';

/*FOR INCOMING RESPONSES FROM LITTLE BIRD*/
function storeMessageInfo_incoming(message) {
  return getInfo(message.From)
      .then(prepareMessage.bind(null, message))
      .catch('something went wrong');
}

function prepareMessage(message,data){
  let message_body = '';
  let language = 1;
  if(data.language_id==2){
    const translate = new Translate({
      projectId: projectId,
      // private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      // client_email: process.env.GOOGLE_CLIENT_EMAIL
    });

    const text = message.Body;
    const target = 'en';

    return translate
      .translate(text,target)
      .then(results => {
        const translation = results[0];
        message_body = `${translation}`;
        language = 2;

        let message_info= {
          communication_type_id: 1,
          raw_body: message_body,
          timestamp: Date.now(),
          student_id: data.student_id,
          stakeholder_id: data.stakeholder_id,
          MessageSid: message.MessageSid,
          AccountSid: message.AccountSid,
          message_status: message.SmsStatus,
          communication_recipient_contact: message.To,
          communication_sender_contact: message.From,
          language_id: language
        };
        return {incoming_formatted: message_info,
                raw_response: message.Body,
                language_id: language};
      })
      .catch(err => {
        console.log('Error', err);
      });
  }
  else{
    message_body = message.Body;

    let message_info= {
      communication_type_id: 1,
      raw_body: message_body,
      timestamp: Date.now(),
      student_id: data.student_id,
      stakeholder_id: data.stakeholder_id,
      MessageSid: message.MessageSid,
      AccountSid: message.AccountSid,
      message_status: message.SmsStatus,
      communication_recipient_contact: message.To,
      communication_sender_contact: message.From,
      language_id: language
    };
    return {incoming_formatted: message_info,
            raw_response: message.Body,
            language_id: language};
  }

}

/*FOR OUTGOING RESPONSES FROM LITTLE BIRD*/
function storeMessageInfo_outgoing(message) {
  return getInfo(message.message.to)
      .then(prepareOutgoingMessage.bind(null, message))
      .catch('something went wrong');
}

function prepareOutgoingMessage(message_object,data){
  return Queries.getSpedInfoByStudentID(data.student_id)
    .then(sped_info => {
      let message = message_object.message;
      let message_body = '';
      let language = 1;
      if(data.language_id==2){
        let boiler = message_object.boiler;
        message_body = translator.getTranslation(sped_info,'en',boiler);
        language = 2;
      }
      else{
        message_body = message.body;
      }
      let message_info= {
        communication_type_id: 4,
        raw_body: message_body,
        timestamp: Date.now(),
        student_id: data.student_id,
        stakeholder_id: 7,
        MessageSid: message.sid,
        AccountSid: message.accountSid,
        message_status: message.status,
        communication_recipient_contact: message.to,
        communication_sender_contact: message.from,
        language_id: language
      };
      return {outgoing_formatted: message_info,
              raw_response: message.body,
              language_id: language};
    });
}

 /*OVERLAPPING FUNCTIONS*/


 function getInfo(cell){
   return Queries.findStudentandStakeholder(cell);
 }

function callHandler(ids, incoming_message){
  return Queries.getSpedInfoByStudentID(ids.student_id)
    .then((sped_info) => {
      if(ids.language_id !== 1){
        let logic_response = handleSpanishResponse.getResponse(incoming_message.Body, ids);
          return logic_response.text_method(incoming_message.From, sped_info)
            .then(message => {
              return {message: message,
                      boiler: logic_response.boiler_plate};
            });
      }else{
        return handleResponse.getResponse(incoming_message.Body, ids)(incoming_message.From, sped_info);
      }
  });
}
  module.exports={
   storeMessageInfo_incoming,
   storeMessageInfo_outgoing,
   callHandler
  };
