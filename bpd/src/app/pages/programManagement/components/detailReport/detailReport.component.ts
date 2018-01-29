import {
    Component,
    OnInit
} from '@angular/core';

import {
    SelectItem,
    Message,
} from 'primeng/primeng';

import 'style-loader!./detailReport.scss';

import {
    DataManageService
} from '../../../service/dataManage.service';
import {
    HttpDataService
} from '../../../service/http.service';
import {
    MessageService
} from '../../../service/message.service';

@Component({
    selector: 'detail-report',
    templateUrl: './detailReport.html'
})

export class DetailReport {

    baseData: any[];
    selected: string;

    dialogProjectCode: string;
    changeProjectCode: string;
    toggleLabel: string = "Undone";

    searchDialog: Boolean = false;

    public ProgramSearchTitle: string = "Program Info";

    constructor(private httpService: HttpDataService, private messageService: MessageService, private dataManageService: DataManageService) {

    }

    ngOnInit() {
        this.httpService.post('/bpd-proj/bpd/vehicleProject/getVListScoreCard', {})
            .subscribe(data => {
                this.baseData = data;
            })
    }

    onRowClick($event) {
        this.changeProjectCode = $event.data.adProjectCode;
    }

    searchClick() {
        this.searchDialog = true;
    }

    searchSave() {
        if (this.toggleLabel === "Complated") {
            this.httpService.post('/bpd-proj/bpd/vehicleProject/getVListScoreCard', {
                "programCode": this.dialogProjectCode
            })
                .subscribe(data => {
                    this.baseData = data;
                })
            this.toggleLabel = "Undone";
            this.ProgramSearchTitle = "Program Info";
        } else if (this.toggleLabel === "Undone") {
            this.httpService.post('/bpd-proj/bpd/vehicleProject/getVListScoreCard', {
                flag: "1",
                "programCode": this.dialogProjectCode
            })
                .subscribe(data => {
                    this.baseData = data;
                })
            this.toggleLabel = "Complated";
            this.ProgramSearchTitle = "Program Archived";
        }
        this.searchDialog = false;
        this.dialogProjectCode = "";
    }

    searchCancle() {
        this.searchDialog = false;
        this.dialogProjectCode = "";
    }

    toggleDataClick() {
        if (this.toggleLabel === "Complated") {
            this.httpService.post('/bpd-proj/bpd/vehicleProject/getVListScoreCard', {})
                .subscribe(data => {
                    this.baseData = data;
                })
            this.toggleLabel = "Undone";
            this.ProgramSearchTitle = "Program Info";
        } else if (this.toggleLabel === "Undone") {
            this.httpService.post('/bpd-proj/bpd/vehicleProject/getVListScoreCard', {
                flag: "1"
            })
                .subscribe(data => {
                    this.baseData = data;
                })
            this.toggleLabel = "Complated";
            this.ProgramSearchTitle = "Program Archived";
        }
    }

}