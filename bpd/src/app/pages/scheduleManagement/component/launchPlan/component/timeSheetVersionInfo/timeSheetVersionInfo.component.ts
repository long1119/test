import {
    Component,
    OnInit,
    Input,
    OnChanges,
    SimpleChanges
} from '@angular/core';

import 'style-loader!./timeSheetVersionInfo.scss';

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
} from '../../../../../service/dataManage.service'
import {
    DeleteComfirmService
} from '../../../../../service/deleteDialog.service';

// 可视化
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'time-sheet-version-info',
    templateUrl: './timeSheetVersionInfo.html'
})

export class TimeSheetVersionInfo {

    //页面表格数据
    public versionData: any[];

    @Input() changeAdProjectCode: string;
    public specialURL: any = "";    //new add

    // 页面弹框显示
    public viewAbleDialog: Boolean;
    public fileUpLoadDialog: Boolean;
    public deleteDialog: Boolean;
    public localStorageAuthority: Boolean;
    public selectedTimingId: string;
    public selectedData: any;
    public UuId: string;
    public msgs: Message[];
    public growLife: number = 5000;
    // public showMessageFlag: Boolean;

    constructor(private httpService: HttpDataService, private messageService: MessageService, private dataManageService: DataManageService, private sanitizer: DomSanitizer, private deleteService: DeleteComfirmService) {

    }

    ngOnInit() {
        this.localStorageAuthority = this.dataManageService.buttonAuthority("Maintain Launch Plan ");
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.changeAdProjectCode) {
            this.httpService.get('/bpd-proj/bpd/masterTimeSheet/getList1?' + Number(new Date()) + '&adProjectCode=' + this.changeAdProjectCode + "&sourceType=launchPlan")
                .subscribe(data => {
                    this.versionData = data;
                })
        }
    }

    public showViewable(data) {
        // 初始化iframeURL
        this.specialURL = this.sanitizer.bypassSecurityTrustResourceUrl("assets/drawTimeSheet/svg.html?adProjectCode=" + this.changeAdProjectCode +
            "&timingId=" + data.timingId);
        this.viewAbleDialog = true;
    }

    public editClick(idx, data) {
        this.fileUpLoadDialog = true;
        this.UuId = this.dataManageService.getUuId();
        this.selectedTimingId = data.timingId;
        this.selectedData = data;
    }

    public deleteClick(idx, data) {
        // this.deleteDialog = true;
        this.selectedData = data;
        this.deleteService.confirm(() => {
            this.httpService.get('/bpd-proj/bpd/att/delete?' + Number(new Date()) + '&attIds=' + this.selectedData.attId)
                .subscribe(data => {
                    if (true) {
                        if (data.code == "1") {
                            this.messageService.showSuccess("Operate Success!");
                            this.growLife = 5000;
                            this.fileUpLoadDialog = false;
                        } else {
                            this.messageService.showError("Operate Failed!");
                            this.growLife = 5000;
                        }
                        this.msgs = this.messageService.msgs;
                    }
                    this.httpService.get('/bpd-proj/bpd/masterTimeSheet/getList1?' + Number(new Date()) + '&adProjectCode=' + this.changeAdProjectCode + "&sourceType=launchPlan")
                        .subscribe(data => {
                            this.versionData = data;
                        })
                })
        })
    }

    public deleteYes(showMessageFlag) {
        this.httpService.get('/bpd-proj/bpd/att/delete?' + Number(new Date()) + '&attIds=' + this.selectedData.attId)
            .subscribe(data => {
                if (showMessageFlag) {
                    if (data.code == "1") {
                        this.messageService.showSuccess("Operate Success!");
                        this.growLife = 5000;
                        this.fileUpLoadDialog = false;
                    } else {
                        this.messageService.showError("Operate Failed!");
                        this.growLife = 5000;
                    }
                    this.msgs = this.messageService.msgs;
                }
                this.httpService.get('/bpd-proj/bpd/masterTimeSheet/getList1?' + Number(new Date()) + '&adProjectCode=' + this.changeAdProjectCode + "&sourceType=launchPlan")
                    .subscribe(data => {
                        this.versionData = data;
                    })
            })
        this.deleteDialog = false;
    }

    public deleteNo() {
        this.deleteDialog = false;
    }

    public onBasicBeforeUpload($event) {
        if (this.selectedData.fileName) {
            this.deleteYes(false);
        }
    }

    public onBasicSelect($event) {

    }

    public onBasicUpload($event) {
        this.httpService.get('/bpd-proj/bpd/masterTimeSheetDate/addAtt?' + Number(new Date()) + "&attId=" + this.UuId + "&type=launchPlan")
            .subscribe(data => {
                if (data.code == "1") {
                    this.messageService.showSuccess("Operate Success!");
                    this.growLife = 5000;
                    this.fileUpLoadDialog = false;
                } else {
                    this.messageService.showError("Operate Failed!");
                    this.growLife = 5000;
                }
                this.msgs = this.messageService.msgs;
                this.httpService.get('/bpd-proj/bpd/masterTimeSheet/getList1?' + Number(new Date()) + '&adProjectCode=' + this.changeAdProjectCode + "&sourceType=launchPlan")
                    .subscribe(data => {
                        this.versionData = data;
                    })
            })
    }

    downloadClick(idx, data) {
        let token = window.sessionStorage.getItem("access_token");
        let url: string = "/bpd-proj/bpd/att/downloadFiles?attIds=" + data.attId + '&_=' + Number(new Date());
        if (token) {
            let realToken = token.substr(1, token.length - 2)
            url = url + "&accessToken=" + realToken;
        }
        window.location.href = url;
    }
}
