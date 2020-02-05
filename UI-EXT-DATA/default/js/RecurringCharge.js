function onExpand(usageRecord, filter, moment, utilityService){
    var proratedRecurringChargeMessage = "TEXT_NO_PRORATION";

    if (usageRecord.proratedonsubscription == 1 || usageRecord.proratedonunsubscription == 1 || usageRecord.proratedinstantly == 1) {
      if (usageRecord.displayamount >= 0) {
       proratedRecurringChargeMessage = "TEXT_PRORATED_RECURRING_CHARGE_MESSAGE";
      }
      else {
        proratedRecurringChargeMessage = "TEXT_PRORATED_RECURRING_CHARGE_CREDIT_MESSAGE";
      }
    }
     else {
      if (usageRecord.displayamount < 0) {
       proratedRecurringChargeMessage = "TEXT_RECURRING_CHARGE_CREDIT";
      }
    }
    var  processedMessage = processMessage(filter('translate')(proratedRecurringChargeMessage), usageRecord, moment, utilityService);

    return processedMessage;
  }

function processMessage(proratedRecurringChargeMessage, usageRecord, moment, utilityService) {

  // utilityService has currencyFormatter method to format currency values as per LocaleCurrency.json object.
  //  currencyFormatter method accepts 3values (valueTobeFormated, currencyCode, isSymbolShouldBeAppend).  isSymbolShouldBeAppend defaults to true.  Explicitly give false if not required.
  
  var str = proratedRecurringChargeMessage.replace("[ProratedIntervalStart]", todateFormatObject(usageRecord.proratedintervalstart, utilityService, moment));
  str = str.replace("[ProratedIntervalEnd]", todateFormatObject(usageRecord.proratedintervalend, utilityService, moment));

  str = str.replace("[ProratedDays]", usageRecord.prorateddays);
  str = str.replace("[ProratedDays]", usageRecord.prorateddays);
  str = str.replace("[ProratedDailyRate]", usageRecord.prorateddailyrate);
  str = str.replace("[ProratedDailyRate]", usageRecord.prorateddailyrate);

  str = str.replace("[Amount]", utilityService.currencyFormatter(usageRecord.displayamountasstring, usageRecord.currency));
  str = str.replace("[RCAmount]", utilityService.currencyFormatter(usageRecord.rcamount, usageRecord.currency));

  str = str.replace(new RegExp('&amp;lt;', 'g'), "<");
  str = str.replace(new RegExp('&amp;gt;', 'g'), ">");
  return str;
}

function todateFormatObject(date, utilityService, moment) {
  
  // Here getDateFormatterByLang method returns an LocaleDateFormatter Object as per login Language.
  //Use ['dateFormat'] or ['dateAndTimeFormat'] to get the required Format. If anything else is required add in LocaleDateFormatter.json and access it here
  //utilityService.dateFormat is default if above object not loaded. Its value is "MM/DD/YYYY".

  var dateFormat = utilityService.getDateFormatterByLang()['dateFormat'];
  dateFormat = utilityService.isObject(dateFormat) ? dateFormat : utilityService.dateFormat;

  return moment(date).format(dateFormat);
}
