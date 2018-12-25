function TEST__F_CreateProfile() {
//  var __email = ""+Math.random().toString(36).substring(2, 6)+"ains@ains.kz  ";
  var __email = "nn.tverd@ains.kz  ";
  var __name = "nikolay tverdokhlebov";
  var __phone = "asdf2314"
  var __letter = "adsfkljh"
  var __resumeurl = "ains.kz"
  try{
    var id = F_CreateProfile(__email, __name, __phone, __letter, __resumeurl);
    Logger.log( 'creation is succeeded');
    Logger.log( 'file id is ' + id );
  }
  catch(e){
    Logger.log( 'creation is failed');
    Logger.log( 'reson is ' + e );
     
  }
   __email = ""+Math.random().toString(36).substring(2, 6);
  try{
    var id = F_CreateProfile(__email, __name, __phone, __letter, __resumeurl);
    Logger.log( 'creation is stupid');
  }
  catch(e){
    Logger.log( 'creation is canceled by wrong email');
    Logger.log( 'reson is ' + e );
     
  }
}

function TEST_APPLY_TO_VAC(){
  var fileid = '1BfDyqoEgSaOeTa35iGZwGMIPcmlguzbA5Mzjje8BP4o';
  fileid = '1YcV0-HWl08aeJhaRCguC1lhOhWL4sUU4fAwBZrYMVbQ';
  var vacname = "Должность №" + Math.random().toString(36).substring(2, 6)
  var vac_code = Math.random().toString(36).substring(2, 6)
  APPLY_TO_VAC(fileid, vacname, 'hh', vac_code);
  FGetAllVac(fileid);
}

function TEST_FChangeStatus(  ){
  var __fileid = '1YcV0-HWl08aeJhaRCguC1lhOhWL4sUU4fAwBZrYMVbQ', 
      __vacid = 'qnl4', 
      __newstatus = VAC_STATUSES[2];
  FChangeStatus( __fileid, __vacid, __newstatus )
  var loyal_folder = DriveApp.getFolderById(ID_PROFILE_FOLDER_LOYAL);
  loyal_folder.addFile(DriveApp.getFileById(__fileid));

}

function TEST_LinkRewrite(){
  var email = EMAILS.invitationread[0] + EMAILS.decline + EMAILS.sing;
  
  email = email.replace( '{#name}', 1 );
  email = email.replace( '{#id1}', 2 );
  email = email.replace( '{#id2}', 3 ); 
  
  Logger.log( email )
}
