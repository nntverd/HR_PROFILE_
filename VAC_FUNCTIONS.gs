function APPLY_TO_VAC(__fileid, __vacname, __source, __sourceid){
  Logger.log( 'APPLY_TO_VAC - START' )
//  var pswrd = Math.random().toString(36).substring(2, 6);
  var sheet = FOpenSheet( __fileid, 'vac' );
  var data = sheet.getDataRange().getValues();
  
  for( var i=1;i<data.length; i++ ){
    var vac = JSON.parse( data[i][0] );
    if( vac.sourceinfo.source == __source && vac.sourceinfo.source_id == __sourceid ) {
      throw "You have already applied to this vac"
    }
    
  }
  
  var payload = {
    "vacid": Math.random().toString(36).substring(2, 6),
    "sourceinfo":{
      "source": __source,
      "source_id": __sourceid
    },
    "vacname": __vacname,
    "statuses": {
      "current": VAC_STATUSES[0],
      "history":[
        {
          "date": new Date(),
          "status": VAC_STATUSES[0]
        }
      ]
    }
  }
  data.push( [JSON.stringify(payload)] );
//  data.push( [(payload)] );
//  Logger,log( payload.vacname );
  sheet.getRange(1,1,data.length).setValues( data );
  var loyal_folder = DriveApp.getFolderById(ID_PROFILE_FOLDER_LOYAL);
  loyal_folder.addFile(DriveApp.getFileById(__fileid));
  Logger.log( 'APPLY_TO_VAC - FINISH' )
}

function FGetAllVac(__fileid){
  var sheet = FOpenSheet( __fileid, 'vac' );
  var data = sheet.getDataRange().getValues();
  data[0].pop();
  for(var i=1;i<data.length;i++){
     
    var x = JSON.parse(( data[i][0] ))
    Logger.log( x.vacname );
    
  }
}

function FChangeStatus( __fileid, __vacid, __newstatus ){
  Logger.log( 'FChangeStatus( __fileid, __vacid, __newstatus )' )
  Logger.log( __fileid )
  Logger.log( __vacid )
  Logger.log( __newstatus );
  var sheet = FOpenSheet( __fileid, 'vac' );
  var data = sheet.getDataRange().getValues();
//  data[0].pop();
  for(var i=1;i<data.length;i++){
    var x = JSON.parse(( data[i][0] ))
    if( x.vacid == __vacid ){
      Logger.log( x.vacname )
      x.statuses.current =  __newstatus;
      var hist = x.statuses.history;
      var newstatjson = {
          "date": new Date(),
          "status": __newstatus
      };
      hist.push( newstatjson );
      x.statuses.history = hist;
      
      data[i][0] = JSON.stringify( x );
    }
    
  }
  Logger.log( data )
  sheet.getDataRange().setValues(data); 
}