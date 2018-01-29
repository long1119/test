import {
    Component,
    OnInit,
    Input,
    OnChanges,
    SimpleChanges
} from '@angular/core';

import {
    SelectItem,
    Message,
    TreeNode
} from 'primeng/primeng';

import 'style-loader!./setTimeOutLog.scss';

import {
    HttpDataService
} from '../../../../../service/http.service';
import {
    MessageService
} from '../../../../../service/message.service';
import {
    DataManageService
} from '../../../../../service/dataManage.service';

@Component({
    selector: 'set-time-out-log',
    templateUrl: './setTimeOutLog.html'
})

export class SetTimeOutLog {
    public setTimeOutLogData: any[] = [];
    @Input() changeTriggerName: string = "";
    // 分页信息
    public setTimeOutLogTotal: number;
    public setTimeOutRows: number = 10;
    public setTimeOutPage: number = 1;
    public setTimeOutFirst: number = 0;
    public dialogJobMainInfo: any = null;
    public jobMainInfoOption: SelectItem[] = [];
    constructor(private httpService: HttpDataService, private messageService: MessageService, private dataManageService: DataManageService) {
        this.jobMainInfoOption.push({
            label: "All",
            value: null
        });
        this.jobMainInfoOption.push({
            label: "Success",
            value: "1"
        });
        this.jobMainInfoOption.push({
            label: "Failed",
            value: "0"
        });
    }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.changeTriggerName) {
            this.setTimeOutPaginateChange({ page: 0, rows: 10, first: 0 });
        }
    }

    public setTimeOutPaginateChange($event) {
        this.setTimeOutRows = $event.rows;
        this.setTimeOutPage = $event.page + 1;
        this.setTimeOutFirst = $event.first;
        this.httpService.post('/bpd-proj/bpd/quartzLog/getList', {
            page: {
                page: this.setTimeOutPage,
                rows: this.setTimeOutRows
            },
            jobName: this.changeTriggerName,
            jobMainInfo: this.dialogJobMainInfo
        })
            .subscribe(data => {
                for (let i = 0; i < data.rows.length; i++) {
                    if (data.rows[i].jobMainInfo == 1) {
                        data.rows[i].jobMainInfo = "Success";
                    } else {
                        data.rows[i].jobMainInfo = "Fialed";
                    }
                }
                this.setTimeOutLogTotal = data.total;
                this.setTimeOutLogData = this.dataManageService.addEmptyPaginatorTableData(data, 10);
            })
    }

    lookClick() {
        this.setTimeOutPaginateChange({ page: 1, rows: 10, first: 0 });
    }
}