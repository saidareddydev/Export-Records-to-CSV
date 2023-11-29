public with sharing class CsvFileController {
@AuraEnabled(cacheable=true)
public static List<sObject> fetchAccountRecords(){
    return [Select Id,Name,Rating,Industry,Website,Phone,Active__c From Account];
}

}