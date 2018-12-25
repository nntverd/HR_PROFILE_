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