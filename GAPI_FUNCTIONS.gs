function GAPI_LOGIN(__login, __pwd) {
  var files = DriveApp.getFolderById(ID_PROFILE_FOLDER_ALL).getFiles();
  var file = 0;
  while(files.hasNext()){
    var _file = files.next();
//    Logger.log( _file );
    if( _file.getId() == __login ){
      file = _file.getId();
      break;
    }
    if( _file.getName() == __login ){
      file = _file.getId();
      break;
    }
  }
  if( file == 0 ){
    return([0, "Нет пользователя с таким логином"])
  }
  Logger.log( file );
  var pwd = SpreadsheetApp.openById(file).getSheetByName('bio').getRange(ADDR_RESUME_PASWRD[1], ADDR_RESUME_PASWRD[2]).getValue();
  if( pwd != __pwd ) return ([0, "Неверный пароль"])
  
  return ([1, file]);
}


function GAPI_GET_BIO( __fileid ){
  var sheet = FOpenSheet( __fileid, 'bio' );
  var data = sheet.getDataRange().getValues();
//  var payload = {
//    'fname': data[ADDR_RESUME_F_NAME[1]-1][ADDR_RESUME_F_NAME[2]-1],
//    'sname': data[ADDR_RESUME_S_NAME[1]-1][ADDR_RESUME_S_NAME[2]-1],
//    'email': JSON.parse(data[ADDR_RESUME_EMAIL[1]-1][ADDR_RESUME_EMAIL[2]-1]).current,
//    'phone': JSON.parse(data[ADDR_RESUME_PHONE[1]-1][ADDR_RESUME_PHONE[2]-1]).current,
//    'letter': data[ADDR_RESUME_LETTER[1]-1][ADDR_RESUME_LETTER[2]-1],
//    'resume': data[ADDR_RESUME_RESUME[1]-1][ADDR_RESUME_RESUME[2]-1],
//  }
    var payload = {
    'fname': FGetFixParamBin(data, ADDR_RESUME_F_NAME),
    'sname': FGetFixParamBin(data, ADDR_RESUME_S_NAME),
    'email': FGetCurrentParamBin( data, ADDR_RESUME_EMAIL ),
    'phone': FGetCurrentParamBin( data, ADDR_RESUME_PHONE ),
    'letter': FGetFixParamBin(data, ADDR_RESUME_LETTER),
    'resume': FGetFixParamBin(data, ADDR_RESUME_RESUME)
  }
  return JSON.stringify(payload);
}
 
function GAPI_UPD_FNAME( __fileid, __fname ){
  var sheet = FOpenSheet( __fileid, 'bio' );
  FInsertFixParam(sheet, __fname, ADDR_RESUME_F_NAME);
  return GAPI_GET_BIO( __fileid );
}
function GAPI_UPD_SNAME( __fileid, __sname ){
  var sheet = FOpenSheet( __fileid, 'bio' );
  FInsertFixParam(sheet, __sname, ADDR_RESUME_S_NAME);
  return GAPI_GET_BIO( __fileid );
}
function GAPI_UPD_EMAIL( __fileid, __email ){
  var sheet = FOpenSheet( __fileid, 'bio' );
  FAddHistoryParam(sheet, __email, ADDR_RESUME_EMAIL);
  return GAPI_GET_BIO( __fileid );
}
function GAPI_UPD_PHONE( __fileid, __phone ){
  var sheet = FOpenSheet( __fileid, 'bio' );
  FAddHistoryParam(sheet, __phone, ADDR_RESUME_PHONE);
  return GAPI_GET_BIO( __fileid );
}

function GAPI_VAC_DATA(__fileid){
  var sheet = FOpenSheet( __fileid, 'vac' );
  if(sheet.getLastRow()<1) throw "Нет Вакансий";
  var data = sheet.getDataRange().getValues();
  return JSON.stringify(data);
}

function GAPI_2WHY_ANSWER( fileid, vacid, text1, text2 ){
  Logger.log(fileid); 
  Logger.log(vacid); 
  Logger.log(text1); 
  Logger.log(text2); 
  var sheet = FOpenSheet( fileid, 'vac' );
  if(sheet.getLastRow()<1) throw "Нет Вакансий";
  var data = sheet.getDataRange().getValues();
  for(var i=1; i<data.length; i++){
    var x = JSON.parse(data[i][0]);
  Logger.log(x.vacid); 
  Logger.log(vacid); 
    
    if( x.vacid == vacid){
      x["answer2why"] = {
        "whyWe": text1,
        "whyThey": text2
      } 
      Logger.log(x)
      data[i][0] = JSON.stringify(x);
    }
  }
//  Logger.log( data )
  sheet.getDataRange().setValues(data);
  FChangeStatus( fileid, vacid, VAC_STATUSES_JSON.answered2why.value );
}

function GAPI_TESTGETNEXTQUEST( fileid, quesid, queslist ){
  try{
    var next_Q = ANKETA_GETNEXTQUES(fileid, quesid, queslist);
    if( next_Q == 7 ){
      ANKETA_FINALIZE(fileid, quesid, queslist);
      Logger.log( "GAPI_TESTGETNEXTQUEST( fileid, quesid, queslist ) + throw All questions Are answered;" ) 
      throw "All questions Are answered";
    }
    return JSON.stringify(next_Q );  
  }
  catch( e ){
    throw e;
  }
  
}

function GAPI_TESTWRITENEXTANSWER( _fileid_, quesid, queslist, Q_ID, ANS_ID, ANS ){
  
  try{
    var next_Q = ANKETA_WRITE_NEW_ANSW(_fileid_, quesid, queslist, Q_ID, ANS_ID, ANS);
    if( next_Q == 7 ){
      ANKETA_FINALIZE(_fileid_, quesid, queslist);
      throw "All questions Are answered";
    }
    return GAPI_TESTGETNEXTQUEST( _fileid_, quesid, queslist );

  }
  catch(e){
    throw e; 
  }
}

function GAPI_OPENPROFILEBYEMAIL( __email ){
  var fileid = FGetFileIdByEmail(__email);
  if(fileid == 0){
    throw "There is no such profile " + __email;
  }
  var ret = FGetAdminDataBuId(fileid);
  return JSON.stringify(ret);
}
function FGetAdminDataBuId(__fileid){
  var biosheet = FOpenSheet( __fileid, 'bio' );
  var vacsheet = FOpenSheet( __fileid, 'vac' );
  var biodata = biosheet.getDataRange().getValues();
  var vacdata = vacsheet.getDataRange().getValues();
  
  var ret = {
    "bio": biodata,
    "vac": vacdata,
    "fileid":__fileid
  }
  return ret;
}
function FGetFileIdByEmail(__email){
   var loyal_folder = DriveApp.getFolderById(ID_PROFILE_FOLDER_LOYAL);
  var files = loyal_folder.getFiles();
  var file_exist = 0;
  var openedfile = '';
  while( files.hasNext() ){
    var file = files.next();
    if( file.getName() == __email ){
      file_exist = 1;
      openedfile = file;
      return file.getId();
    }
  }
  return 0;
}

function GAPI_F_ADMIN_DECLINE_BY_COMPANY(__fileid, __vacid){
  
  FChangeStatus( __fileid, __vacid, VAC_STATUSES_JSON.declinedByCompany.value );
  var ret = FGetAdminDataBuId(__fileid);
  return JSON.stringify(ret); 
}

function GAPI_F_ADMIN_MEETINGHAPENED( __fileid, __vacid, review ){
  FChangeStatus( __fileid, __vacid, VAC_STATUSES_JSON.meetinghappened.value );
  var biosheet = FOpenSheet( __fileid, 'bio' );

  FAddHistoryParam(biosheet, review, ADDR_RESUME_REVIEW)
  var ret = FGetAdminDataBuId(__fileid);
  return JSON.stringify(ret);
}
function GAPI_F_ADMIN_HIRE(__fileid, __vacid){
  FChangeStatus( __fileid, __vacid, VAC_STATUSES_JSON.hired.value );
  var ret = FGetAdminDataBuId(__fileid);
  return JSON.stringify(ret);
}

function GAPI_RECOVERY( __email ){
  var files = DriveApp.getFolderById(ID_PROFILE_FOLDER_ALL).getFiles();
  var file = 0;
  while(files.hasNext()){
    var _file = files.next();
//    Logger.log( _file );
    if( _file.getId() == __email ){
      file = _file.getId();
      break;
    }
    if( _file.getName() == __email ){
      file = _file.getId();
      break;
    }
  }
  if( file == 0 ){
    return([0, "Нет пользователя с таким логином"])
  }
  Logger.log( file );
  
  var newpassword = Math.random().toString(36).substring(2, 6);
  SpreadsheetApp.openById(file).getSheetByName('bio').getRange(ADDR_RESUME_PASWRD[1], ADDR_RESUME_PASWRD[2]).setValue(newpassword);
  
  var emailadd__ = SpreadsheetApp.openById(file).getSheetByName('bio').getRange(ADDR_RESUME_EMAIL[1], ADDR_RESUME_EMAIL[2]).getValue();
  var fname = SpreadsheetApp.openById(file).getSheetByName('bio').getRange(ADDR_RESUME_EMAIL[1], ADDR_RESUME_EMAIL[2]).getValue();
//  var emailadd = SpreadsheetApp.openById(file).getSheetByName('bio').getRange(ADDR_RESUME_EMAIL[1], ADDR_RESUME_EMAIL[2]).getValue();
  var emailadd = JSON.parse( emailadd__ ).current;
  var email = "Здравствуйте, " + fname + "\n";
  var email = "Новый пароль " + newpassword + "\n";
  email += EMAILS.sing;
  
  FSendEmailToUser(emailadd, "Восстановление пароля | ТОО ИНСТИТУТ АВТОМАТИЗАЦИИ", email);
  
  return ([1, "Новый пароль отправлен Вам на почту. Проверьте все входящие папки, включая спам"]);
}