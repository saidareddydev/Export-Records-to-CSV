import { LightningElement,wire } from 'lwc';
import fetchRecords from "@salesforce/apex/CsvFileController.fetchAccountRecords";
export default class CsvFileComponentPage extends LightningElement {

    accountdata = [];
    columns = [
        { label: 'Account Name', fieldName: 'Name', type: "text" },
        { label: 'Account Rating', fieldName: 'Rating', type: "text" },
        { label: 'Account Industry', fieldName: 'Industry', type: "text"},
        { label: 'Account Website', fieldName: 'Website', type: 'url' },
        { label: 'Account Phone', fieldName: 'Phone', type: 'phone' },
        { label: 'Account IsActive?', fieldName: 'Active__c', type: 'Boolean' },
        
    ];
    @wire(fetchRecords) outputFunction({data,error}){
        if(data){
            this.accountdata = data;
              }else if(error){
            console.log(error);
        }

    }
    get checkRecord(){
        return this.accountdata.length > 0 ? false : true;
    }

    
    clickHandler(){
        // if Records are Selected on Data Table
        let selectedRows = [];
        let doweloadRecords = [];
        selectedRows = this.template
                    .querySelector("lightning-datatable")
                    .getSelectedRows();

    
        

        // if Records are Selected or Not , In Case Records are Not Selected Download all Records

        if(selectedRows.length > 0){
            doweloadRecords = [...selectedRows];
        }else
        {
            doweloadRecords = [...accountdata];
        }

        // Convery Array Into CSV
        let csvfile = this.convertArrayToCsv(doweloadRecords);
        this.createLinkForDowenload(csvfile);

        
    }
    convertArrayToCsv(doweloadRecords){
        let csvHeader = Object.keys(doweloadRecords[0]).toString();
        let csvBody = doweloadRecords.map((CurrntItem)=>
        Object.values(CurrntItem).toString());

        let csvfile = csvHeader + "\n" + csvBody.join("\n");
        return csvfile;
            }
    
    createLinkForDowenload(csvfile){
        const downlink = document.createElement("a");
        downlink.href = "data:text/csv;charset=utf-8," + encodeURI(csvfile);
        downlink.target = "_blank";
        downlink.download = "Account_Data.csv";             
        downlink.click();   
    }
       
}

    
