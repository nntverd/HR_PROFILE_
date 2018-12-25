//***************************************************************
// Сервисная функция для HTML
// Включает в указанной точке содержимое файла из проекта
// include('filename'); <?!= include( 'style' ); ?>
//***************************************************************
function include(filename) {
  return HtmlService.createTemplateFromFile(filename).getRawContent();
}
//***************************************************************
// Сервисная функция для HTML
// Запускает index file передавая определенные параметры
//***************************************************************
var ProjectTitle = "ИНСТИТУТ АВТОМАТИЗАЦИИ | АККАУНТ"
var _fileid_ = 0;
var _vacid_ = 0;
var questions = [];
var quesid = '1tNZxT80IGHuCtE9KWF9zwBbnsBh6yo0zIdzxHKzurnI';
var queslist = 'personaltest';
function doGet(e){
  var params = e.parameter;
  if( params.test == "2why" ){
    // https://script.google.com/macros/s/AKfycbyAyuVM5kP8p1p4LDltopdfTbH0qPZ2F9fG0BWNfHQ/dev?test=2why&id1=1&id2=2
    _fileid_ = params.id1;
    _vacid_ = params.id2;
    ProjectTitle = "ИНСТИТУТ АВТОМАТИЗАЦИИ | Два вопроса"
    var htmlTemplate = HtmlService.createTemplateFromFile('html_whys');
    var htmlOutput = htmlTemplate.evaluate().setTitle(ProjectTitle).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);                             
    return htmlOutput; 
  }
  if( params.test == "personaltest" ){
    // https://script.google.com/macros/s/AKfycbyAyuVM5kP8p1p4LDltopdfTbH0qPZ2F9fG0BWNfHQ/dev?test=2why&id1=1&id2=2
    _fileid_ = params.id1;
    _vacid_ = params.id2;
    
    ANKETA_INITTEST(_fileid_, quesid, queslist);
    ProjectTitle = "ИНСТИТУТ АВТОМАТИЗАЦИИ | Анкетирование кандидата"
    var htmlTemplate = HtmlService.createTemplateFromFile('html_personaltest');
    var htmlOutput = htmlTemplate.evaluate().setTitle(ProjectTitle).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);                             
    return htmlOutput; 
  }
  if( params.invate == "confirminvated" ){
    // https://script.google.com/macros/s/AKfycbyAyuVM5kP8p1p4LDltopdfTbH0qPZ2F9fG0BWNfHQ/dev?invate=confirminvated&id1=1YcV0-HWl08aeJhaRCguC1lhOhWL4sUU4fAwBZrYMVbQ&id2=qnl4
    
    _fileid_ = params.id1;
    _vacid_ = params.id2;
    FChangeStatus( _fileid_, _vacid_, VAC_STATUSES_JSON.invitationread.value );
    ProjectTitle = "ИНСТИТУТ АВТОМАТИЗАЦИИ | Подтверждение прочтения"
    var htmlTemplate = HtmlService.createTemplateFromFile('html_confirminvate');
    var htmlOutput = htmlTemplate.evaluate().setTitle(ProjectTitle).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);                             
    return htmlOutput; 
  }
  if( params.decline == "employee" ){
    // https://script.google.com/macros/s/AKfycbyAyuVM5kP8p1p4LDltopdfTbH0qPZ2F9fG0BWNfHQ/dev?decline=employee&id1=1YcV0-HWl08aeJhaRCguC1lhOhWL4sUU4fAwBZrYMVbQ&id2=qnl4
    
    _fileid_ = params.id1;
    _vacid_ = params.id2;
    FChangeStatus( _fileid_, _vacid_, VAC_STATUSES_JSON.declinedByEmployee.value );
    ProjectTitle = "ИНСТИТУТ АВТОМАТИЗАЦИИ | Жаль, что Вы приняли такое решение"
    var htmlTemplate = HtmlService.createTemplateFromFile('html_declinedByEmployee');
    var htmlOutput = htmlTemplate.evaluate().setTitle(ProjectTitle).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);                             
    return htmlOutput; 
  }
//  
  var htmlTemplate = HtmlService.createTemplateFromFile('index');
  var htmlOutput = htmlTemplate.evaluate().setTitle(ProjectTitle).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);                             
  return htmlOutput; 
}