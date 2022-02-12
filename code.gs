function doGet(e) {
    var tmp = HtmlService.createTemplateFromFile("index");
    return tmp.evaluate().setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

function openSheet(name){
  return SpreadsheetApp
    .openById(SPREADSHEET_ID)
    .getSheetByName(name);
}

function flatten(arrayOfArrays){
  return [].concat.apply([], arrayOfArrays);
}


function getIP(){
  return test = UrlFetchApp.fetch("https://api.ipify.org/");
}

function userClicked(result){
    var fields = [
      "Name",           //--0
      "round_result",   //--1 
      "prop", "opp",
      "content_1prop",    "style_1prop",      "strategy_1prop",     "poi_1prop",    "total_1prop",
      "content_2prop",    "style_2prop",      "strategy_2prop",     "poi_2prop",    "total_2prop",
      "content_3prop",    "style_3prop",      "strategy_3prop",     "poi_3prop",    "total_3prop",
      "content_replyprop","style_replyprop",  "strategy_replyprop",                 "total_replyprop",
      "total_prop",
      
      "content_1opp",    "style_1opp",      "strategy_1opp",     "poi_1opp",      "total_1opp",
      "content_2opp",    "style_2opp",      "strategy_2opp",     "poi_2opp",      "total_2opp",
      "content_3opp",    "style_3opp",      "strategy_3opp",     "poi_3opp",      "total_3opp",
      "content_replyopp","style_replyopp",  "strategy_replyopp",                  "total_replyopp",
      "total_opp"];
    
    var judgeEmail = Session.getActiveUser().getEmail();

    openSheet("Test").appendRow([new Date(), getIP(), judgeEmail].concat(flatten(result)));
    var mailBody = HtmlService.createTemplateFromFile("email-template").getRawContent();

    for(var i = 0; i < fields.length;i++){
      if(i == 1) mailBody = mailBody.replace("{{"+fields[i]+"}}",getRoundResult(result[23],result[43]));
      else mailBody = mailBody.replace("{{"+fields[i]+"}}",result[i])
    }

    try{
      MailApp.sendEmail({
      to      : judgeEmail,
      subject : `NSDC 2022 Form Ballot Received -- Round ${result[1]} from ${result[0]}`,
      htmlBody: mailBody
    });
      openSheet("ReceiptStatus").appendRow([judgeEmail, result[1],result[0],"success"]);

    } catch(err){
      Logger.log(err);
      openSheet("ReceiptStatus").appendRow([judgeEmail, result[1],result[0],err]);
    }

  }

function getRoundResult(total_prop, total_opp){
  var roundResult = (total_prop > total_opp ? "➕Prop Wins" : "➖Opp Wins") + ` by ${Math.abs(total_prop-total_opp)} margin(s)`
  Logger.log(roundResult);
  return roundResult

}

/*
   0     judge
   1     rounds
   2     prop
   3     opp
   4     content_1prop
   5     style_1prop
   6     strategy_1prop
   7     poi_1prop
   8     total_1prop
   9     content_2prop
   10     style_2prop
   11     strategy_2prop
   12     poi_2prop
   13     total_2prop
   14     content_3prop
   15     style_3prop
   16     strategy_3prop
   17     poi_3prop
   18     total_3prop
   19     content_replyprop
   20     style_replyprop
   21     strategy_replyprop
   22     total_replyprop
   23     total_prop
   24     content_1opp
   25     style_1opp
   26     strategy_1opp
   27     poi_1opp
   28     total_1opp
   29     content_2opp
   30     style_2opp
   31     strategy_2opp
   32     poi_2opp
   33     total_2opp
   34     content_3opp
   35     style_3opp
   36     strategy_3opp
   37     poi_3opp
   38     total_3opp
   39     content_replyopp
   40     style_replyopp
   41     strategy_replyopp
   42     total_replyopp
   43     total_opp
    */
