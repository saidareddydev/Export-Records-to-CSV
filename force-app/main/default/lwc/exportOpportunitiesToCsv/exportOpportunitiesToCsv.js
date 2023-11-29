import { LightningElement, api, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getRelatedListRecords } from 'lightning/uiRelatedListApi';

export default class ExportOpportunitiesToCsv extends LightningElement {
    @api recordId;

    error;
    records;
    @wire(getRelatedListRecords, {
        parentRecordId: '$recordId',
        relatedListId: 'Opportunities',
        fields: ['Opportunity.Id', 'Opportunity.Name', 'Opportunity.StageName', 'Opportunity.CloseDate', 'Opportunity.OwnerId', 'Opportunity.Owner.Name', 'Opportunity.AccountId', 'Opportunity.Account.Name', 'Opportunity.Account.OwnerId', 'Opportunity.Account.Owner.Name'],
        sortBy: ['Opportunity.Name'],
        pageSize: 1999
    })
    listInfo({ error, data }) {
        if (data) {
            this.records = data.records;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.records = undefined;
        }
    }

    exportToCSV() {
        console.log(JSON.stringify(this.error));
        console.log(JSON.stringify(this.records));

        if(this.error){
            // Show error toast
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'An Error has occured!',
                    message: this.error.body.message,
                    variant: 'error',
                })
            );
            return;
        }

        if(this.records.length === 0){
            // Show message that no opportunities exist
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Data Not Found!',
                    message: 'There are no opportunities to export related to this account record.',
                    variant: 'warning',
                })
            );
            return;
        }
        // Prepare CSV content
        let csvContent = 'Opportunity Id,Opportunity Name,Stage Name,Close Date,Opportunity Owner Id,Opportunity Owner Name, Account Id,Account Name, Account Owner Id,Account Owner Name\n';
        this.records.forEach(record => {

            let opp_id = record.fields.Id.value;
            let opp_name = record.fields.Name.value;
            let stage_name = record.fields.StageName.value === null ? "" : record.fields.StageName.value;
            let close_date = record.fields.CloseDate.value === null ? "" : record.fields.CloseDate.value;
            let opp_owner_id = record.fields.OwnerId.value === null ? "" : record.fields.OwnerId.value;
            let opp_owner_name = record.fields.Owner.value.fields.Name.value === null ? "" : record.fields.Owner.value.fields.Name.value;
            let acc_id = record.fields.AccountId.value === null ? "" : record.fields.AccountId.value;
            let acc_name = record.fields.Account.value.fields.Name.value === null ? "" : record.fields.Account.value.fields.Name.value;
            let acc_owner_id = record.fields.Account.value.fields.OwnerId.value === null ? "" : record.fields.Account.value.fields.OwnerId.value;
            let acc_owner_name = record.fields.Account.value.fields.Owner.value.fields.Name.value === null ? "" : record.fields.Account.value.fields.Owner.value.fields.Name.value;
            
            csvContent += `"${opp_id}","${opp_name}","${stage_name}","${close_date}","${opp_owner_id}","${opp_owner_name}","${acc_id}","${acc_name}","${acc_owner_id}","${acc_owner_name}"\n`;
        });

        console.log('csvContent::', csvContent);

        // Create Blob and download CSV file

        // Creating anchor element to download
        let downloadElement = document.createElement('a');

        // This  encodeURI encodes special characters, except: , / ? : @ & = + $ # (Use encodeURIComponent() to encode these characters).
        downloadElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvContent);
        downloadElement.target = '_self';
        // CSV File Name
        downloadElement.download = 'Opportunities.csv';
        // below statement is required if you are using firefox browser
        document.body.appendChild(downloadElement);
        // click() Javascript function to download CSV file
        downloadElement.click();

        // Show success toast
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'CSV exported successfully',
                variant: 'success',
            })
        );
    }
}