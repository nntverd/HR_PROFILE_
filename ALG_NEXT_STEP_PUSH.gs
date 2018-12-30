function FPushNextStageInResponses(){
//  ID_PROFILE_FOLDER_LOYAL
  var loyal_folder = DriveApp.getFolderById(ID_PROFILE_FOLDER_LOYAL);
  var files = loyal_folder.getFiles();
  while(files.hasNext()){
    var file = files.next();
    var sheet = FOpenSheet( file.getId(), 'vac' );
    var data = sheet.getDataRange().getValues();
    for(var i=1;i<data.length;i++){
      var x = JSON.parse(( data[i][0] ))
      var status = x.statuses.current;
      var reminder_counter = x.statuses.remcount;
      Logger.log( status );
      Logger.log( VAC_STATUSES_JSON.newstat );
      
      switch( status ){
        case (VAC_STATUSES_JSON.newstat.value):{
          FWelcomeToVac( file.getId(), x.vacid, x.vacname );
          continue;
        }
        case VAC_STATUSES_JSON.asked2why.value:{
          FNotify2WhySended( file.getId(), x.vacid, x.vacname );
          continue;
        }
        case VAC_STATUSES_JSON.remind2why.value:{
          if( reminder_counter > 3 ){
            FChangeStatus( file.getId(), x.vacid, VAC_STATUSES_JSON.declinedByCompany.value );
            continue;
          }
          FRemind2Why( file.getId(), x.vacid, x.vacname );
          FAddCounter( file.getId(), x.vacid )
//          x.statuses.remcount = reminder_counter; 
          continue;
        }
        case VAC_STATUSES_JSON.answered2why.value:{
          FResetCounter( file.getId(), x.vacid )
          FNotify2WhyAnswered( file.getId(), x.vacid, x.vacname );
          continue;
        }
        case VAC_STATUSES_JSON.asked4test.value:{
          if( !F_IFTESTFINISHED( file.getId() ) ){
            FInvite4Test( file.getId(), x.vacid, x.vacname );
            continue;
          }
          else{
            FChangeStatus( file.getId(), x.vacid, VAC_STATUSES_JSON.answeredtest.value );
          }
        }
        case VAC_STATUSES_JSON.remind4test.value:{
          if( !F_IFTESTFINISHED( file.getId() ) ){
            if( reminder_counter > 3 ){
              FChangeStatus( file.getId(), x.vacid, VAC_STATUSES_JSON.declinedByCompany.value );
              continue;
            }
            FAddCounter( file.getId(), x.vacid )
            FRemind4Test( file.getId(), x.vacid, x.vacname );
            continue;
          }
          else{
            FChangeStatus( file.getId(), x.vacid, VAC_STATUSES_JSON.answeredtest.value );
            continue;
          }
        }
        case VAC_STATUSES_JSON.answeredtest.value:{
          FResetCounter( file.getId(), x.vacid )
          FNotifyTestAnswered( file.getId(), x.vacid, x.vacname );
          continue;
        }
        case VAC_STATUSES_JSON.invited.value:{
          FNotifyWeHaveInvited( file.getId(), x.vacid, x.vacname );
          continue;
        }
        case VAC_STATUSES_JSON.remindinvited.value:{
          
          if( reminder_counter > 3 ){
            FChangeStatus( file.getId(), x.vacid, VAC_STATUSES_JSON.declinedByCompany.value );
            continue;
          }
          FAddCounter( file.getId(), x.vacid )
          FRemindInvate( file.getId(), x.vacid, x.vacname );
          continue;
          
          
          continue;
        }
        case VAC_STATUSES_JSON.invitationread.value:{
          FResetCounter( file.getId(), x.vacid )
          FConfirmThatInvintationRead( file.getId(), x.vacid, x.vacname );
          continue;
        }
        case VAC_STATUSES_JSON.meetinghappened.value:{
          FNotifyThatMeetingHappened( file.getId(), x.vacid, x.vacname );
          continue;
        }
        case VAC_STATUSES_JSON.hired.value:{
          FNotifyThatHired( file.getId(), x.vacid, x.vacname );
          FChangeStatus( file.getId(), x.vacid, VAC_STATUSES_JSON.finish.value );
          continue;
        }  
        case VAC_STATUSES_JSON.declinedByCompany.value:{
          FNotifyThatDeclinedByCompany( file.getId(), x.vacid, x.vacname );
          FChangeStatus( file.getId(), x.vacid, VAC_STATUSES_JSON.finish.value );
          continue;
        }
        case VAC_STATUSES_JSON.declinedByEmployee.value:{
          FNotifyThatDeclinedByEmployee( file.getId(), x.vacid, x.vacname );
          FChangeStatus( file.getId(), x.vacid, VAC_STATUSES_JSON.finish.value );
          continue;
        }
      }
      
    }
//    sheet.getRange(1,1,data.length,1).setValues(data); 
  }
}
//          
//  "new":                { "value": "new",                "index": 0  },
//  "asked2why":          { "value": "asked2why",          "index": 1  },
//  "remind2why":         { "value": "remind2why",         "index": 2  },
//  "answered2why":       { "value": "answered2why",       "index": 3  },
//  "asked4test":         { "value": "asked4test",         "index": 4  },
//  "remind4test":        { "value": "remind4test",        "index": 5  },
//  "answeredtest":       { "value": "answeredtest",       "index": 6  },
//  "invited":            { "value": "invited",            "index": 7  },
//  "remindinvited":      { "value": "remindinvited",      "index": 8  },
//  "invitationread":     { "value": "invitationread",     "index": 9  },
//  "meetinghappened":    { "value": "meetinghappened",    "index": 10 },
//  "hired":              { "value": "hired",              "index": 11 },
//  "declinedByCompany":  { "value": "declinedByCompany",  "index": 12 },
//  "declinedByEmployee": { "value": "declinedByEmployee", "index": 13 }

function FWelcomeToVac(__fileid, __vacid, __vacname){
  Logger.log( 'FWelcomeToVac(__fileid, __vacid)' )
  var bio_sheet = FOpenSheet( __fileid, 'bio' );
  var emailadd = FGetCurrentParam( bio_sheet, ADDR_RESUME_EMAIL );
  // send welcome email
  var email = FPrepareEmail(__fileid, __vacid, bio_sheet, EMAILS.welcome[0], '', false)
  var subject = "ТОО ИНСТИТУТ АВТОМАТИЗАЦИИ - Спасибо за отклик на вакансию " + __vacname;
  FSendEmailToUser(emailadd, subject, email)
  FSendEmailToHr( emailadd, subject, email)
  Logger.log( "emails were sended" )
  // change status to asked2why
  FChangeStatus( __fileid, __vacid, VAC_STATUSES_JSON.asked2why.value );
  Logger.log( "Status changed" )
}
function FNotify2WhySended(__fileid, __vacid, __vacname){
  // send email 
  var link_base = "https://script.google.com/macros/s/AKfycbxDUonJnZcJGRQTP1t-JUHvoZZYy5Veri4rP6eTKcX9yw6EcRI/exec"
  var bio_sheet = FOpenSheet( __fileid, 'bio' );
  var emailadd = FGetCurrentParam( bio_sheet, ADDR_RESUME_EMAIL );
  Logger.log( 'FNotify2WhySended(__fileid, __vacid)' )
  // send email
  var email = FPrepareEmail(__fileid, __vacid, bio_sheet, EMAILS.ask2why[0], link_base + "?test=2why&id1="+ __fileid +"&id2=" + __vacid, false );
  email = email.replace( '{#name}', name );
  var subject = "ТОО ИНСТИТУТ АВТОМАТИЗАЦИИ - Ответьте всего на два вопроса! Вакансия " + __vacname;
  FSendEmailToUser(emailadd, subject, email)
  FSendEmailToHr( emailadd, subject, email)
  // change status to remind
  FChangeStatus( __fileid, __vacid, VAC_STATUSES_JSON.remind2why.value );
}
function FRemind2Why(__fileid, __vacid, __vacname){
  // send email
  var link_base = "https://script.google.com/macros/s/AKfycbxDUonJnZcJGRQTP1t-JUHvoZZYy5Veri4rP6eTKcX9yw6EcRI/exec"
  var bio_sheet = FOpenSheet( __fileid, 'bio' );
  var emailadd = FGetCurrentParam( bio_sheet, ADDR_RESUME_EMAIL );
  Logger.log( 'FRemind2Why(__fileid, __vacid)' )
  var email = FPrepareEmail(__fileid, __vacid, bio_sheet, EMAILS.ask2why[0], link_base + "?test=2why&id1="+ __fileid +"&id2=" + __vacid, false );
//  var email = EMAILS.welcome[0] + EMAILS.decline + EMAILS.sing;
  email = email.replace( '{#name}', name );
  var subject = "ТОО ИНСТИТУТ АВТОМАТИЗАЦИИ - Вакансия " + __vacname + " | Напоминание";
  FSendEmailToUser(emailadd, subject, email)
  FSendEmailToHr( emailadd, subject, email)
  Logger.log( "emails were sended" )
}
function FNotify2WhyAnswered(__fileid, __vacid, __vacname){
  // status changed by api
  // send notification that we see results
  var bio_sheet = FOpenSheet( __fileid, 'bio' );
  var emailadd = FGetCurrentParam( bio_sheet, ADDR_RESUME_EMAIL );
  Logger.log( 'FNotify2WhyAnswered(__fileid, __vacid)' )
  // send welcome email
  var email = FPrepareEmail(__fileid, __vacid, bio_sheet, EMAILS.answer2why[0], '', false );
  var subject = "ТОО ИНСТИТУТ АВТОМАТИЗАЦИИ - Вакансия " + __vacname + " | Мы получили Ваши ответы";
  FSendEmailToUser(emailadd, subject, email)
  FSendEmailToHr( emailadd, subject, email)
  Logger.log( "emails were sended" )
  // change status to asked2why
  FChangeStatus( __fileid, __vacid, VAC_STATUSES_JSON.asked4test.value );
  Logger.log( "Status changed" )
  // change status to asked4test
}

function FInvite4Test(__fileid, __vacid, __vacname){
  // send email
  var link_base = "https://script.google.com/macros/s/AKfycbxDUonJnZcJGRQTP1t-JUHvoZZYy5Veri4rP6eTKcX9yw6EcRI/exec"
  var bio_sheet = FOpenSheet( __fileid, 'bio' );
  var emailadd = FGetCurrentParam( bio_sheet, ADDR_RESUME_EMAIL );
  Logger.log( 'FInvite4Test(__fileid, __vacid)' )
  // send email
  var email = FPrepareEmail(__fileid, __vacid, bio_sheet, EMAILS.ask4test[0], '', false );
  var subject = "ТОО ИНСТИТУТ АВТОМАТИЗАЦИИ - Анкета кандидата! Вакансия " + __vacname;
  FSendEmailToUser(emailadd, subject, email)
  FSendEmailToHr( emailadd, subject, email)
  // change status to remind
  FChangeStatus( __fileid, __vacid, VAC_STATUSES_JSON.remind4test.value );
}
function FRemind4Test(__fileid, __vacid, __vacname){
//  send email
  var link_base = "https://script.google.com/macros/s/AKfycbxDUonJnZcJGRQTP1t-JUHvoZZYy5Veri4rP6eTKcX9yw6EcRI/exec"
  var bio_sheet = FOpenSheet( __fileid, 'bio' );
  var emailadd = FGetCurrentParam( bio_sheet, ADDR_RESUME_EMAIL );
  Logger.log( 'FRemind2Why(__fileid, __vacid)' )
  var email = FPrepareEmail(__fileid, __vacid, bio_sheet, EMAILS.remind4test[0], link_base + "?test=personaltest&id1="+ __fileid +"&id2=" + __vacid, false );
//  email = email.replace( '{#name}', name );
  var subject = "ТОО ИНСТИТУТ АВТОМАТИЗАЦИИ - Вакансия " + __vacname + " | Напоминание";
  FSendEmailToUser(emailadd, subject, email)
  FSendEmailToHr( emailadd, subject, email)
  Logger.log( "emails were sended" )
}
function FNotifyTestAnswered(__fileid, __vacid, __vacname){
  // status changed by api
  Logger.log( 'FNotify2WhyAnswered(__fileid, __vacid)' )
  var bio_sheet = FOpenSheet( __fileid, 'bio' );
  var emailadd = FGetCurrentParam( bio_sheet, ADDR_RESUME_EMAIL );
  // send notification that we see results
  var email = FPrepareEmail(__fileid, __vacid, bio_sheet, EMAILS.answered4test[0], '', false );
  var subject = "ТОО ИНСТИТУТ АВТОМАТИЗАЦИИ - Вакансия " + __vacname + " | Анкета заполнена";
  FSendEmailToUser(emailadd, subject, email)
  FSendEmailToHr( emailadd, subject, email)
  Logger.log( "emails were sended" )
  // change status to invited  
  FChangeStatus( __fileid, __vacid, VAC_STATUSES_JSON.invited.value );
  Logger.log( "Status changed" )
  
  
}

function FNotifyWeHaveInvited(__fileid, __vacid, __vacname){
  // send email
//  https://script.google.com/macros/s/AKfycbxDUonJnZcJGRQTP1t-JUHvoZZYy5Veri4rP6eTKcX9yw6EcRI/exec?invate=confirminvated&id1=1YcV0-HWl08aeJhaRCguC1lhOhWL4sUU4fAwBZrYMVbQ&id2=qnl4
  var link_base = "https://script.google.com/macros/s/AKfycbxDUonJnZcJGRQTP1t-JUHvoZZYy5Veri4rP6eTKcX9yw6EcRI/exec"
  Logger.log( 'FNotifyWeHaveInvited(__fileid, __vacid)' )
  var bio_sheet = FOpenSheet( __fileid, 'bio' );
  var emailadd = FGetCurrentParam( bio_sheet, ADDR_RESUME_EMAIL );
  // send email
  var email = FPrepareEmail(__fileid, __vacid, bio_sheet, EMAILS.invited[0], link_base + "?invate=confirminvated&id1="+ __fileid +"&id2=" + __vacid, false );
  var subject = "ТОО ИНСТИТУТ АВТОМАТИЗАЦИИ - Приглашение на собеседование! Вакансия " + __vacname;
  FSendEmailToUser(emailadd, subject, email)
  FSendEmailToHr( emailadd, subject, email)
  // change status to remind
  FChangeStatus( __fileid, __vacid, VAC_STATUSES_JSON.remindinvited.value );
}
function FRemindInvate(__fileid, __vacid, __vacname){
  // send email
  var link_base = "https://script.google.com/macros/s/AKfycbxDUonJnZcJGRQTP1t-JUHvoZZYy5Veri4rP6eTKcX9yw6EcRI/exec"
  var bio_sheet = FOpenSheet( __fileid, 'bio' );
  var emailadd = FGetCurrentParam( bio_sheet, ADDR_RESUME_EMAIL );
  Logger.log( 'FRemindInvate(__fileid, __vacid)' )
  // send email
  var email = FPrepareEmail(__fileid, __vacid, bio_sheet, EMAILS.remindinvated[0], link_base + "?invate=confirminvated&id1="+ __fileid +"&id2=" + __vacid, false );
  var subject = "ТОО ИНСТИТУТ АВТОМАТИЗАЦИИ - Приглашение на собеседование. Напоминание!  Вакансия " + __vacname;
  FSendEmailToUser(emailadd, subject, email)
  FSendEmailToHr( emailadd, subject, email)
}
function FConfirmThatInvintationRead(__fileid, __vacid, __vacname){
  var link_base = "https://script.google.com/macros/s/AKfycbxDUonJnZcJGRQTP1t-JUHvoZZYy5Veri4rP6eTKcX9yw6EcRI/exec"
  var bio_sheet = FOpenSheet( __fileid, 'bio' );
  var emailadd = FGetCurrentParam( bio_sheet, ADDR_RESUME_EMAIL );
  Logger.log( 'FConfirmThatInvintationRead(__fileid, __vacid)' )
  // send email
  var email = FPrepareEmail(__fileid, __vacid, bio_sheet, EMAILS.invitationread[0], '', false );
  var subject = "ТОО ИНСТИТУТ АВТОМАТИЗАЦИИ - Мы ждем Вашего звонка!  Вакансия " + __vacname;
  FSendEmailToUser(emailadd, subject, email)
  FSendEmailToHr( emailadd, subject, email)
  // send notification
}
function FNotifyThatMeetingHappened(__fileid, __vacid, __vacname){
  // status changed by MANAGER
  var link_base = "https://script.google.com/macros/s/AKfycbxDUonJnZcJGRQTP1t-JUHvoZZYy5Veri4rP6eTKcX9yw6EcRI/exec"
  var bio_sheet = FOpenSheet( __fileid, 'bio' );
  var emailadd = FGetCurrentParam( bio_sheet, ADDR_RESUME_EMAIL );
  Logger.log( 'FConfirmThatInvintationRead(__fileid, __vacid)' )
  // send email
  var email = FPrepareEmail(__fileid, __vacid, bio_sheet, EMAILS.meetinghappened[0], '', false );
  var subject = "ТОО ИНСТИТУТ АВТОМАТИЗАЦИИ - В системе заполнен отчет о вашем визите на собеседование! Вакансия " + __vacname;
  FSendEmailToUser(emailadd, subject, email)
  FSendEmailToHr( emailadd, subject, email)
  // send notification
}


function FNotifyThatHired(__fileid, __vacid, __vacname){
  // status changed by MANAGER
  // send notification
  var bio_sheet = FOpenSheet( __fileid, 'bio' );
  var emailadd = FGetCurrentParam( bio_sheet, ADDR_RESUME_EMAIL );
  Logger.log( 'FNotifyThatDeclinedByCompany(__fileid, __vacid)' )
  // send email
  var email = FPrepareEmail(__fileid, __vacid, bio_sheet, EMAILS.hired[0], '', false );
  var subject = "ТОО ИНСТИТУТ АВТОМАТИЗАЦИИ - Мы благодарим Вас за уделенное нам время! Вакансия " + __vacname;
  FSendEmailToUser(emailadd, subject, email)
  FSendEmailToHr( emailadd, subject, email)
}
function FNotifyThatDeclinedByCompany(__fileid, __vacid, __vacname){
  // status changed by MANAGER
  // send notification
  var bio_sheet = FOpenSheet( __fileid, 'bio' );
  var emailadd = FGetCurrentParam( bio_sheet, ADDR_RESUME_EMAIL );
  Logger.log( 'FNotifyThatDeclinedByCompany(__fileid, __vacid)' )
  // send email
  var email = FPrepareEmail(__fileid, __vacid, bio_sheet, EMAILS.declinedByCompany[0], '', true );
  var subject = "ТОО ИНСТИТУТ АВТОМАТИЗАЦИИ - Мы благодарим Вас за уделенное нам время! Вакансия " + __vacname;
  FSendEmailToUser(emailadd, subject, email)
  FSendEmailToHr( emailadd, subject, email)
}
function FNotifyThatDeclinedByEmployee(__fileid, __vacid, __vacname){
  // status changed by Employee
  // send notification
  var bio_sheet = FOpenSheet( __fileid, 'bio' );
  var emailadd = FGetCurrentParam( bio_sheet, ADDR_RESUME_EMAIL );
  Logger.log( 'FNotifyThatDeclinedByEmployee(__fileid, __vacid)' )
  // send email
  var email = FPrepareEmail(__fileid, __vacid, bio_sheet, EMAILS.declinedByEmployee[0], '', true );
  var subject = "ТОО ИНСТИТУТ АВТОМАТИЗАЦИИ - Вы закрыли свое обращение! Спасибо за отклик";
  FSendEmailToUser(emailadd, subject, email)
  FSendEmailToHr( emailadd, subject, email)
}


// ***********************************************************************
function FSendEmailToUser(__email, __subject, __message){
  GmailApp.sendEmail(__email, __subject, __message, {"from": "hr@ains.kz"})
}
function FSendEmailToHr( __email, __subject, __message){
  var message = "Кандидату отправлено письмо\n\n" + __email + "\n\n с Заголовком\n-----------------------------\n\n" + __subject + "\n\n с текстом\n-----------------------------\n\n" + __message;
  GmailApp.sendEmail("hr@ains.kz", "Отправка письма кандидату", message)
}
function FAddCounter( __fileid, __vacid ){
  Logger.log( 'FAddCounter( __fileid, __vacid )' )
  Logger.log( __fileid )
  Logger.log( __vacid )
//  Logger.log( __newstatus );
  var sheet = FOpenSheet( __fileid, 'vac' );
  var data = sheet.getDataRange().getValues();
//  data[0].pop();
  for(var i=1;i<data.length;i++){
    var x = JSON.parse(( data[i][0] ))
    if( x.vacid == __vacid ){
      Logger.log( x.vacname )
//      x.statuses.current =  __newstatus;
      var reminder_counter = x.statuses.remcount;
      if( reminder_counter == 'undefined' ) reminder_counter = 0;
      reminder_counter++;
      x.statuses.remcount = reminder_counter;
      data[i][0] = JSON.stringify( x );
    }
    
  }
  Logger.log( data )
  sheet.getDataRange().setValues(data); 
}
function FResetCounter( __fileid, __vacid ){
    Logger.log( 'FAddCounter( __fileid, __vacid )' )
  Logger.log( __fileid )
  Logger.log( __vacid )
//  Logger.log( __newstatus );
  var sheet = FOpenSheet( __fileid, 'vac' );
  var data = sheet.getDataRange().getValues();
//  data[0].pop();
  for(var i=1;i<data.length;i++){
    var x = JSON.parse(( data[i][0] ))
    if( x.vacid == __vacid ){
      Logger.log( x.vacname )
//      x.statuses.current =  __newstatus;
      var reminder_counter = 0;
      x.statuses.remcount = reminder_counter;
      data[i][0] = JSON.stringify( x );
    }
    
  }
  Logger.log( data )
  sheet.getDataRange().setValues(data); 
}

function F_IFTESTFINISHED( __fileid ){
  var data = FLoadAnketaResultsFromBio( __fileid );
  var anketa_results = (data);
  
  Logger.log( "F_IFTESTFINISHED( __fileid ) " + anketa_results );
  if( anketa_results['testanswered'] ){
    
    return 1;
  }
  return 0;
}

function FPrepareEmail(__fileid, __vacid, bio_sheet, __body, __link, __skipdecline){
  var emailadd = FGetCurrentParam( bio_sheet, ADDR_RESUME_EMAIL );
  var name = FGetFixParam(bio_sheet, ADDR_RESUME_F_NAME );
  if( name == 'undefined' ) name = "";
  else                      name = ", " + name;
  var email = __body + __link;
  if( !__skipdecline ) {
    email += EMAILS.decline
  }
  email += EMAILS.sing;
  email = email.replace( '{#name}', name );
  email = email.replace( '{#id1}', __fileid );
  email = email.replace( '{#id2}', __vacid );
  return email;
}