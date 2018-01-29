import {
    Component,
    OnInit
} from '@angular/core';

import {
    SelectItem,
    Message
} from 'primeng/primeng';

import 'style-loader!./setTimeOut.scss';

import {
    HttpDataService
} from '../../../service/http.service';
import {
    MessageService
} from '../../../service/message.service';
import {
    DataManageService
} from '../../../service/dataManage.service';

@Component({
    selector: 'set-time-out',
    templateUrl: './setTimeOut.html'
})

export class SetTimeOut {
    public setTimeOutData: any[] = [];
    public selectedSetTimeOutData: any[] = [];
    public msgs: Message[];
    public growLife: number = 5000;
    public editDialog: boolean = false;
    public dialogDescription: string = "";
    public dialogCronExporession: string = "";
    public selectedData: any = {};
    public messageFlag: boolean;
    public changeTriggerName: string;
    public editFlag: boolean;
    public hourOption: SelectItem[] = [];
    public minuteOption: SelectItem[] = [];
    public selectedHour: string = "";
    public selectedMinute: string = "";

    constructor(private httpService: HttpDataService, private messageService: MessageService, private dataManageService: DataManageService) {
        this.setTimeOutData = this.dataManageService.addEmptyOnInitTableData(10);
        for (let i = 0; i < 24; i++) {
            this.hourOption.push({
                label: "" + i,
                value: i
            })
        }
        for (let i = 0; i < 59; i++) {
            this.minuteOption.push({
                label: "" + i,
                value: i
            })
        }
    }

    ngOnInit() {
        this.tableOnInit();
    }

    private tableOnInit() {
        this.httpService.post('/bpd-proj/bpd/quartzJob/getVList', {})
            .subscribe(data => {
                for (let i = 0, a = data; i < a.length; i++) {
                    let arr = a[i].cronExpression.split(" ");
                    a[i].cronExpression = arr[2] + ":" + arr[1];
                }
                this.setTimeOutData = this.dataManageService.addEmptyTableData(data, 10);
            })
    }

    private setTimeOutLogRowClick($event) {
        this.changeTriggerName = $event.data.jobName;
    }

    public pauseBtn(item, flag) {
        let url = '/bpd-proj/bpd/quartzJob/updateStatus'
        let data: any = {
            triggerState: "WAITING",
            triggerName: item.triggerName
        };
        if (flag) {
            data.triggerState = "PAUSE";
        }
        this.httpService.post(url, data)
            .subscribe(data => {
                if (data.code === "1") {
                    this.messageService.showSuccess("");
                    this.growLife = 5000;
                    this.tableOnInit();
                } else {
                    this.messageService.showError("");
                    this.growLife = 5000;
                }
                this.msgs = this.messageService.msgs;
            })
    }

    public noticeBtn(item) {
        let url = '/bpd-proj/' + item.url;
        this.httpService.get(url)
            .subscribe(data => {
                if (data.code === "1") {
                    this.messageService.showSuccess("");
                    this.growLife = 5000;
                    this.tableOnInit();
                } else if (data.code === "2") {
                    this.messageService.showInfo(data.businessData);
                    this.growLife = 300000;
                } else {
                    this.messageService.showError("");
                    this.growLife = 5000;
                }
                this.msgs = this.messageService.msgs;
            })
    }

    public editBtn(item, flag) {
        this.editFlag = flag;
        this.dialogCronExporession = item.cronExpression;
        this.dialogDescription = item.description;
        this.selectedData = item;
        this.editDialog = true;
        let time = item.cronExpression.split(":");
        this.selectedHour = time[0];
        this.selectedMinute = time[1];
    }

    public editSave() {
        if (this.editFlag) {
            let cronExporessionUrl: string = '/bpd-proj/bpd/quartzJob/updateCron';
            if (Number(this.selectedHour) < 10) {
                this.selectedHour = "0" + this.selectedHour;
            }
            if (Number(this.selectedMinute) < 10) {
                this.selectedMinute = "0" + this.selectedMinute;
            }
            let cronExporessionData: any = {
                cronExpression: "0 " + this.selectedMinute + " " + this.selectedHour + " * * ?",
                triggerName: this.selectedData.triggerName
            }
            this.httpService.post(cronExporessionUrl, cronExporessionData)
                .subscribe(data => {
                    if (data.code === "1") {
                        this.messageService.showSuccess("");
                        this.tableOnInit();
                        this.growLife = 5000;
                    } else {
                        this.messageService.showInfo("Please Wait For A Moment!");
                        this.growLife = 5000;
                    }
                    this.msgs = this.messageService.msgs;
                })
        } else {
            let descriptionUrl: string = '/bpd-proj/bpd/quartzJob/updateDesc';
            let descriptionData: any = {
                description: this.dialogDescription,
                jobName: this.selectedData.jobName
            }
            this.httpService.post(descriptionUrl, descriptionData)
                .subscribe(data => {
                    if (data.code === "1") {
                        this.messageService.showSuccess("");
                        this.tableOnInit();
                        this.growLife = 5000;
                    } else {
                        this.messageService.showError("");
                        this.growLife = 5000;
                    }
                    this.msgs = this.messageService.msgs;
                })
        }
        this.editDialog = false;
    }

    public editCancle() {
        this.editDialog = false;
    }
}