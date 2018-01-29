import {
    Component,
    OnInit,
    Input,
    OnChanges,
    SimpleChanges,
    Output,
    EventEmitter
} from '@angular/core';

import {
    SelectItem,
    Message
} from 'primeng/primeng';

import {
    MessageService
} from '../../../../../service/message.service';
import {
    HttpDataService
} from '../../../../../service/http.service';
import {
    DataManageService
} from '../../../../../service/dataManage.service';

import 'style-loader!./devibables.scss';
import { SimpleChange } from '@angular/core/src/change_detection/change_detection_util';

@Component({
    selector: 'devibables',
    templateUrl: './devibables.html'
})

export class Devibables {

    @Input ()
    private changeProjManager: string;
    @Input ()
    private changeTimingId: string;
    @Input ()
    private changeAdProjectCode: string;

    private approvingData: any[];
    
    constructor(private httpService: HttpDataService, 
    private dataManageService: DataManageService,
    private messageService: MessageService) {
        this.approvingData = [];
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.changeTimingId) {
            this.tableOninit()
        }
    }

    private tableOninit () {
        // adProjectCode=' + this.changeAdProjectCode +
        this.httpService.get('/bpd-proj/bpd/masterTimeSheet/getAllApprove?timingId=' + this.changeTimingId)
            .subscribe(data => {
                for (let i = 0; i < data.length; i++) {
                    if (!data[i].userName) {
                        data[i].userName = "-";
                        data[i].taskName = "-";
                        data[i].version = "-";
                        data[i].isAgree = "-";
                        data[i].comments = "-";
                    }
                    if (data[i].isAgree == 1) {
                        data[i].isAgree = "Agree";
                    } else if (data[i].isAgree == 2) {
                        data[i].isAgree = "Return";
                    }
                    if (!data[i].deleteReason && data[i].endTime) {
                        data[i].deleteReason = "Complate";
                    }
                }
                this.approvingData = this.dataManageService.addEmptyTableData(data, 10);
            })
    }
}