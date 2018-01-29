import {
    Component,
    OnInit,
    Input,
    OnChanges,
    SimpleChanges
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

import 'style-loader!./approveLog.scss';

@Component({
    selector: 'approve-log',
    templateUrl: './approveLog.html'
})

export class ApproveLog {
    @Input ()
    private changeProjManager: string;
    @Input()
    private changeTimingId: string;

    private approvedData: any[];

    constructor(private httpService: HttpDataService, 
    private dataManageService: DataManageService,
    private messageService: MessageService) {
        this.approvedData = [];
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.changeTimingId) {
            this.tableOnInit();
        }
    }

    private tableOnInit() {
        this.httpService.get('/bpd-proj/bpd/masterTimeSheet/getRecordOfApproval?timingId=' + this.changeTimingId)
            .subscribe(data => {
                for (let i = 0; i < data.length; i++) {
                    if (data[i].isAgree == 1) {
                        data[i].isAgree = "Agree";
                    } else if (data[i].isAgree == 2) {
                        data[i].isAgree = "Define";
                    }
                }
                this.approvedData = this.dataManageService.addEmptyTableData(data, 10);
            })
    }
}