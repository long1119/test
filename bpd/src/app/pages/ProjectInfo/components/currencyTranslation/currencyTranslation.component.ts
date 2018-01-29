import {
    Component,
    OnInit
} from '@angular/core';

import "style-loader!./currencyTranslation.scss";

import {
    HttpDataService
} from '../../../service/http.service';
import {
    MessageService
} from '../../../service/message.service';

@Component({
    templateUrl: './currencyTranslation.html',
    selector: 'currency-translation',
})

export class CurrencyTemplate {
    baseData: any[];
    selected: string;

    rateChangeFlag: Boolean = true;
    paymentRateFlag: Boolean = false;

    dialogProjectCode: string;
    dialogProjectName: string;
    changeProjectId: string;
    changeSop: string;
    changeFrocastInfo: string;

    searchDialog: Boolean = false;

    constructor(private httpService: HttpDataService, private messageService: MessageService) {

    }
    ngOnInit() {
        this.httpService.post('/bpd-proj/bpd/allProjInfo/getVList', {
            averageFlag: "1"
        })
            .subscribe(data => {
                this.baseData = data;
                // console.log(data);
            })
    }

    rateChangeClick() {
        this.paymentRateFlag = false;
        this.rateChangeFlag = true;
    }

    paymentRateClick() {
        this.paymentRateFlag = true;
        this.rateChangeFlag = false;
    }

    changeTab($event) {
        console.log($event);
        switch ($event.index) {
            case 0: 
                this.paymentRateFlag = false;
                this.rateChangeFlag = true;
                break;
            case 1: 
                this.paymentRateFlag = true;
                this.rateChangeFlag = false;
                break;
        }
    }

    onRowClick($event) {
        // console.log($event.data.projectCode);
        this.changeProjectId = $event.data.adProjectCode;
        this.changeSop = $event.data.sop;
        this.changeFrocastInfo = $event.data.forcastInfo;
        // console.log(this.changeProjectCode);
    }

    searchClick() {
        this.searchDialog = true;
    }

    searchSave() {
        this.httpService.post('/bpd-proj/bpd/allProjInfo/getVList', {
                "projectCode": this.dialogProjectCode,
                "projectName": this.dialogProjectName,
                averageFlag: "1"
            })
            .subscribe(data => {
                this.baseData = data;
            })
        this.searchDialog = false;
        this.dialogProjectCode = "";
        this.dialogProjectName = "";
    }

    searchCancle() {
        this.searchDialog = false;
        this.dialogProjectCode = "";
        this.dialogProjectName = "";
    }

}