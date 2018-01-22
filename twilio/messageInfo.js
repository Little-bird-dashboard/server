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
      private_key: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCjKp2eqYCyhlNF\nlgwIjKJs6w6MsMmyJoChLvS0RkggGKu0DR87K9uSauca+iRcZDwjz+CtqjMnpL/0\nu0d6wOZgB1FuADy6UnPjsWzebYCbFMtEGpJIoexpb3mh8zhFySK2I4pdomKxMy5h\n0dA1Fed236G7V1pI2I7vv+GUjaVJdD+EcghqLJtjy9ORTRShRt3B2UxlrlwTv2tN\ntnYSWee33pFLmQ58eTMwxiMsef0OnmqllfGjHhjFFPYlDK+dYIR4kVXDiHUPEV0v\nOK8K2anop6GZ7WW0+3JyfYS9FLN4mDOlQY2oxTV7o6CxbBaWE62epTn774Ztd2qt\ncDpxh59jAgMBAAECggEAQwwV7MaWHcXYnfWESFcRv1PvjJxwpQXxQUp8Pz/KD3ZT\nyA7EUJo7BbVr9cfn/RcrJ0QafQI9NwMZ5cS3IJf3kmovadYrHh0Xhe64X8X7XL50\nsC2DAtmWvdSS1JuO+g4md1WvW76Ic2wmmQeQWOABVvWaDdNdRCXIxnfAiDyUONQl\nB/BPgCRg6iR68N8LsdX5U7qmy5di8kzXa7es1/6A/cywTi+HzbJFFZuJv7T9wrx6\nRwTPAmQhtJ2AE6ALK+Oaq+OTUE8RDbjddU/HRhZ2l0lzdGVE3atKnk8LEm6k5SWu\nMJytk+Kf+4E6EXwsAnpZ1c5BxDnAKHYhLq9FIqgIcQKBgQDjDuQ2ZBbbM5WzUoGv\nxo6dw47OGkLE1UGnVdkoKkH1pcd3PT2sng/rZsZMlDTRszxqi2n9zfqB3pS/Svi+\n8fiV9q4cVkGMOSVdbe3qn+8VYdSdJdRJQGQ+0nB9P/X+8XzUUjf42swg9wnFbrzM\nG6P2EEJltFFe9chy4PGt30sXNQKBgQC39uGwVGqmQCsgZ09LrHwt4KHPx2DhvLJW\nR/2erH8PBgBhkmYMW+kSyLg5p+QnpvRKQTtGrTPTMz3pdhdfrshk/x50f8DXVjyB\nNTKxMpEGqNsXLpn21xxSnnUDXjpMYXAsXmYEXPZTGuZ/uo4BWdiRDg1uJC78Yjwj\nKHPKNax3NwKBgBWq4CBIoN2+KHT6VKHfgtCPTttgKir6Zs9/I7/veGfmsAgy8eW9\nF6vRHO9F3Vx9jDBmqXCs7VDjWrJ+hwpBsQUuiyLtIEgvU998lA2lwXz63v04FPAA\nkxBjqJRrPCBeDxl71xeKWZxztpz+mkmoAZeDqbJm6LT1I3HDAY0kF9hZAoGAci3E\n/hAm8XC6U65LRQiVOlRFmhSBSRo5BdxAyY7+fXCYI/cdZ2ZUTthNn1tY/FNfJAdA\npykxFVCkiJZHA5gTwLunR19TbVOU0g0WnWxpHt0GvmiqHs58QbsfnSuKu4VufdtJ\nLkQUjpgPoA9FvAjrpXw3UbkbgIHoGVouI78UgBkCgYEAkAiF8uowaY3sd2Epm1eN\niaQdnHo8eX09QEG21oJIWUr7GMi4wRYuzgNTkGFO+n4eMApwBrecmPHinrZtlRMf\n+n15DlNirjGN4gLN3XdNRA9u+nDqf6AqTggiPrip/FB5253OyZKdoU0EtD51hoqv\njBeYqeZF6LjW+46FrIGk6so=\n-----END PRIVATE KEY-----\n'
      ,client_email: 'little-bird-service-account@littlebird-584b3.iam.gserviceaccount.com'
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
