function F_CreateProfile(__email, __name, __phone, __letter, __resumeurl) {
  var email = (""+__email).trim();
  if( email.split('@').length <= 1 ) throw ('there is no email');
  var ALL_PROFILE_FOLDER = DriveApp.getFolderById(ID_PROFILE_FOLDER_ALL);
  var profiles = ALL_PROFILE_FOLDER.getFiles();
  while( profiles.hasNext() ){
    var profile = profiles.next();
    if( profile.getName() == email ) return profile.getId();
  }
  
  var temp = DriveApp.getFileById(ID_PROFILE_TEMPLATE);
  var newprofile = temp.makeCopy(email, ALL_PROFILE_FOLDER);
  newprofile.setDescription( __email + " - " + __name + " - " + __phone ) ;
  
  var bio_sheet = FOpenSheet( newprofile.getId(), 'bio' );
  var names = __name.split(' ');
  var fname = __name;
  var sname = '';
  if( names.length > 1 ){
    fname = names[0];
    sname = names[1]
  }
  var pswrd = Math.random().toString(36).substring(2, 6);
  FInsertFixParam(bio_sheet, pswrd, ADDR_RESUME_PASWRD);
  FInsertFixParam(bio_sheet, fname, ADDR_RESUME_F_NAME);
  FInsertFixParam(bio_sheet, sname, ADDR_RESUME_S_NAME);
  FAddHistoryParam(bio_sheet, email, ADDR_RESUME_EMAIL)
  FAddHistoryParam(bio_sheet, __phone, ADDR_RESUME_PHONE)
  FAddHistoryParam(bio_sheet, __letter, ADDR_RESUME_LETTER)
  FAddHistoryParam(bio_sheet, __resumeurl, ADDR_RESUME_RESUME)
  
  
  return newprofile.getId();
}

function FInsertFixParam(__sheet, __value, __addr_resume){
  __sheet.getRange(__addr_resume[1], __addr_resume[2]).setValue(__value);
}
function FGetFixParam(__sheet, __addr_resume){
  
  return __sheet.getRange(__addr_resume[1], __addr_resume[2]).getValue();
}
function FGetFixParamBin(__data, __addr_resume){
  return __data[__addr_resume[1]-1][__addr_resume[2]-1];
//  __sheet.getRange(__addr_resume[1], __addr_resume[2]).getValue();
}

//function FInsertSecondName(__sheet, __sname, __addr_resume_sname){
//  __sheet.getRange(__addr_resume_sname[1], __addr_resume_sname[2]).setValue(__sname);
//}
//function FGetSecondName(__sheet, __addr_resume_sname){
//  __sheet.getRange(__addr_resume_sname[1], __addr_resume_sname[2]).getValue();
//}

function FAddHistoryParam(__sheet, __value, __addr_resume){
  var params = {};
  try{
    params = FGetHistoryParam_json( __sheet, __addr_resume ); 
  }
  catch(e){
    params = {
      "current":'',
      "history": []
      
    }
  }
  var history = params.history;
  history.push( {"date": new Date(), "value": __value} );
  if( params['current'] == __value ) return;
  params['current'] = __value;
  params['history'] = history;
  __sheet.getRange(__addr_resume[1], __addr_resume[2]).setValue(JSON.stringify(params)); 
}

function FGetHistoryParam_str( __sheet, __addr_resume ){
  var emails_str = __sheet.getRange(__addr_resume[1], __addr_resume[2]).getValue();
  return emails_str;
}
function FGetHistoryParam_str_Bin( __data, __addr_resume ){
  var emails_str = __data[__addr_resume[1]-1][ __addr_resume[2]-1];
  return emails_str;
}

function FGetHistoryParam_json( __sheet, __addr_resume){
  var emails_str = __sheet.getRange(__addr_resume[1], __addr_resume[2]).getValue();
  return JSON.parse(emails_str);
}
function FGetHistoryParam_json_Bin( __data, __addr_resume){
  var emails_str = __data[__addr_resume[1]-1][ __addr_resume[2]-1];
  return JSON.parse(emails_str);
}

function FGetCurrentParam( __sheet, __addr_resume ){
  var emails_str = __sheet.getRange(__addr_resume[1], __addr_resume[2]).getValue();
  return JSON.parse(emails_str).current;
}
function FGetCurrentParamBin( __data, __addr_resume ){
  var emails_str = __data[__addr_resume[1]-1][ __addr_resume[2]-1];
  return JSON.parse(emails_str).current;
}

function FOpenSheet( __fileid, __sheetname ){
  var ss = SpreadsheetApp.openById(__fileid);
  var sheets = ss.getSheets();
  for( var i in sheets ){
    if( sheets[i].getName() == __sheetname ) return sheets[i];
  }
  return ss.insertSheet( __sheetname );
  
}

function ANKETA_INITTEST(_fileid_, quesid, queslist){
  var sheet = FOpenSheet( quesid, queslist );
  var lr = sheet.getLastRow();
  var lc = sheet.getLastColumn();
  var data = sheet.getDataRange().getValues();
  var userExistsInList = false;
  for( var i=3;i<lr;i++ ){
    if ( data[i][0] == _fileid_ ) userExistsInList = true; return;
  }
  var biosheet = FOpenSheet( _fileid_, 'bio' );
  var fname = FGetFixParam(biosheet, ADDR_RESUME_F_NAME);
  var sname = FGetFixParam(biosheet, ADDR_RESUME_S_NAME);
  var fullname = sname + " " + fname;
  var email = FGetCurrentParam( biosheet, ADDR_RESUME_EMAIL );
  var phone = FGetCurrentParam( biosheet, ADDR_RESUME_PHONE );
  sheet.appendRow( [_fileid_, email, fullname, phone]  );
  
}
function ANKETA_GETNEXTQUES(_fileid_, quesid, queslist){
  Logger.log( 'ANKETA_GETNEXTQUES(_fileid_, quesid, queslist)' )
  var sheet = FOpenSheet( quesid, queslist );
  var lr = sheet.getLastRow();
  var lc = sheet.getLastColumn();
  var data = sheet.getDataRange().getValues();
  var ExistingUserRow = 0;
  for( var i=3;i<lr;i++ ){
    if ( data[i][0] == _fileid_ ) ExistingUserRow = i; break;
  }
  if( ExistingUserRow == 0 ) throw "User with this id is not exist in anketa database!";
  var LA = data[ExistingUserRow][4];
  if( LA == "Q36" ) return 7;
  var iQ = 0;
  for( var i = 1; i< lc; i++ ){
    Logger.log( 'LA1 = ' + LA );
    Logger.log( 'data [0][i] = ' + LA );

    if( data [0][i] == LA )  iQ = i+1;
  }
  Logger.log( 'iQ1 = ' + iQ );
  if( iQ == 0 ) iQ = 5;
  Logger.log( 'LA2 = ' + LA );
  Logger.log( 'iQ2 = ' + iQ );
  
  
  return [data[2][iQ], data[1][iQ], data[0][iQ]];
//  sheet.;
}
function ANKETA_WRITE_NEW_ANSW(_fileid_, quesid, queslist, Q_ID, ANS_ID, ANS){
  var sheet = FOpenSheet( quesid, queslist );
  var lr = sheet.getLastRow();
  var lc = sheet.getLastColumn();
  var data = sheet.getDataRange().getValues();
  var ExistingUserRow = 0;
  for( var i=3;i<lr;i++ ){
    if ( data[i][0] == _fileid_ ) ExistingUserRow = i; break;
  }
  if( ExistingUserRow == 0 ) throw "User with this id is not exist in anketa database!";
  var LA = data[ExistingUserRow][4];
  if( LA == "Q36" ) return 7;
  var iQ = 0;
  for( var i = 5; i< lc; i++ ){
    if( data [0][i] == Q_ID )  iQ = i;
  }
  if( iQ == 0 ) throw "Question id is not found";
  
  data[ExistingUserRow][iQ] = ANS;
  data[ExistingUserRow][4] = Q_ID;
  var iA = 0;
  for( var i=41; i<lc;i++ ){
     if( data [2][i] == ANS_ID )  iA = i;
  }
  if( iA == 0 ) throw "Answer code problem";
  var last_answer = data[ExistingUserRow][iA];
  if( last_answer=='' ) last_answer = 0;
  last_answer += ANS;
  data[ExistingUserRow][iA] = last_answer;
  sheet.getDataRange().setValues(data);
//  sheet.;
}
function ANKETA_FINALIZE(_fileid_, quesid, queslist){
  Logger.log( "ANKETA_FINALIZE - 1" )
  var sheet = FOpenSheet( quesid, queslist );
  var lr = sheet.getLastRow();
  var lc = sheet.getLastColumn();
  var data = sheet.getDataRange().getValues();
  var ExistingUserRow = 0;
  Logger.log( "ANKETA_FINALIZE - 2" )
  for( var i=3;i<lr;i++ ){
    Logger.log( "data[i][0] == _fileid_ ==== " + data[i][0] +"  " + _fileid_ )
    if ( data[i][0] == _fileid_ ) ExistingUserRow = i; break;
  }
  if( ExistingUserRow == 0 ) throw "User with this id is not exist in anketa database!";
  var LA = data[ExistingUserRow][4];
  if( LA != "Q36" ) return 0;
  // change status in profile save results to bio
  var res = FANKETAGETRES( _fileid_, quesid, queslist )[0];
  Logger.log( "ANKETA_FINALIZE - 2.1" )
  Logger.log( res )
  
  var results = {
    "testanswered": true,
    "score":{
      "Невинный":res[0],
      "Сирота":res[1],
      "Странник":res[2],
      "Жертва":res[3],
      "Воин":res[4],
      "Волшебник":res[5]
    }
  };
  Logger.log( "ANKETA_FINALIZE - 3" )
  FSaveAnketaResultsToBio( _fileid_, results )
  Logger.log( "ANKETA_FINALIZE - 4" )
  // send results to profile !done above
  // show thanks message
}

function FSaveAnketaResultsToBio( _fileid_, __results ){
  Logger.log(  "FSaveAnketaResultsToBio - 1" );
  var sheet =  FOpenSheet( _fileid_, 'bio' );
  Logger.log(  "FSaveAnketaResultsToBio - 2" );
  var __addr_resume = ADDR_RESUME_ANKETA;
  Logger.log(  "FSaveAnketaResultsToBio - 3" );
  Logger.log(  __results );
  
  var result = JSON.stringify(__results );
  Logger.log(  "FSaveAnketaResultsToBio - 3.1" );
  sheet.getRange( __addr_resume[1], __addr_resume[2] ).setValue( result );
  Logger.log(  "FSaveAnketaResultsToBio - 4" );
}
function FLoadAnketaResultsFromBio( _fileid_ ){
  var sheet =  FOpenSheet( _fileid_, 'bio' );
  var __addr_resume = ADDR_RESUME_ANKETA;
  var result = sheet.getRange( __addr_resume[1], __addr_resume[2] ).getValue( );
  Logger.log( result );
  return JSON.parse( result );
}
function FANKETAGETRES( _fileid_, quesid, queslist ){
  Logger.log( "FANKETAFETRES - 1" )
  var sheet = FOpenSheet( quesid, queslist );
  var lr = sheet.getLastRow();
  var lc = sheet.getLastColumn();
  var data = sheet.getDataRange().getValues();
  var ExistingUserRow = 0;
  Logger.log( "FANKETAFETRES - 2" )
  for( var i=3;i<lr;i++ ){
    Logger.log( "data[i][0] == _fileid_ ==== " + data[i][0] +"  " + _fileid_ )
    if ( data[i][0] == _fileid_ ) ExistingUserRow = i; break;
  }
  if( ExistingUserRow == 0 ) throw "User with this id is not exist in anketa database!";
  var iA1 = 0;
  var iA2 = 0;
  for( var i=41; i<lc;i++ ){
    if( data [2][i] == 'A1' )  iA1 = i;
    if( data [2][i] == 'A6' )  iA2 = i;
  }
  Logger.log( iA1 + " % " + iA2 )
  if( iA1 == 0 ) throw "Answer index problem 1";
  if( iA2 == 0 ) throw "Answer index problem 2";
  if( iA1 > iA2 ) throw "Answer index problem 3";
  
  return sheet.getRange(ExistingUserRow+1, iA1+1, 1, iA2-iA1+1 ).getValues();
}
/*
function FInsertFixParam(__sheet, __value, __addr_resume){
  __sheet.getRange(__addr_resume[1], __addr_resume[2]).setValue(__value);
}
function FGetFixParam(__sheet, __addr_resume){
  
  return __sheet.getRange(__addr_resume[1], __addr_resume[2]).getValue();
}
*/