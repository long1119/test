import {
    Component,
    Input,
    OnChanges,
    SimpleChanges,
    OnInit
} from '@angular/core';
import {
    Message
} from 'primeng/primeng';

import "style-loader!./arTemplateUpload.scss";

import {
    DataManageService
} from '../../../../../service/dataManage.service';
import {
    MessageService
} from '../../../../../service/message.service';
import {
    HttpDataService
} from '../../../../../service/http.service';
import {
    DeleteComfirmService
} from '../../../../../service/deleteDialog.service';

@Component({
    selector: "ar-template-upload",
    templateUrl: "./arTemplateUpload.html"
})

export class ArTemplateUpload {

    @Input()
    private projectType: string;
    @Input()
    private projectTypeName: string;

    public addDialog: Boolean;
    private modifyFlag: string;
    private selectedIndex: number;
    public deleteDialog: Boolean;
    public arTemplateData: any[] = [];
    public uuId: string;
    public msgs: Message[];
    public growLife: number = 5000;
    public localStorageAuthority;
    public allowUpload: boolean = false;
    public checkUrl: string;
    public errMessage: any;
    public errDialog: boolean = false;
    constructor(private dataManageService: DataManageService, private messageService: MessageService, private httpService: HttpDataService, private deleteService: DeleteComfirmService) {
        this.checkUrl = "/bpd-proj/bpd/projectType/uploadArBudgetTemplate"
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.projectType) {
            this.tableOnInit();
        }
        this.localStorageAuthority = this.dataManageService.buttonAuthority("Maintain Project Type");
    }

    private tableOnInit() {
        this.httpService.post('/bpd-proj/bpd/att/getVList', {
            bussinessId: this.projectType
        })
            .subscribe(data => {
                if (data.length != 0) {
                    this.arTemplateData = this.dataManageService.addEmptyTableData(data, 5);
                }
            })
    }

    public addClick(idx, data) {
        this.addDialog = true;
        // if (this.arTemplateData.length != 0) {
        //     this.selectedIndex = 0;
        //     this.modifyFlag = "edit";
        // } else {
            this.modifyFlag = "add";
        // }
        this.uuId = this.dataManageService.getUuId();
    }

    public editClick(idx, data) {
        this.addDialog = true;

        this.uuId = this.dataManageService.getUuId();
    }

    public onBasicBeforeUpload($event) {
        if (this.modifyFlag == "edit") {
            this.deleteYes(false);
        }

    }

    public onBasicSelect(event) {
        var xhr = new XMLHttpRequest(), formData = new FormData();
        event.files[0].filename = event.files[0].name;
        formData.append('file', event.files[0]);
        if (this.checkUrl.indexOf("?") === -1) {
            this.checkUrl = this.checkUrl + "?_=" + Number(new Date());
        } else {
            this.checkUrl = this.checkUrl + "&_=" + Number(new Date());
        }
        xhr.open('POST', this.checkUrl, true);
        var accessToken = sessionStorage.getItem("access_token");
        if (accessToken) {
            xhr.setRequestHeader("accessToken", accessToken.substr(1, accessToken.length - 2));
        }
        let _this = this;
        xhr.onload = function (oEvent) {
            let errList = JSON.parse(xhr.response).list;
            if (errList.length == 0) {
                _this.allowUpload = true;
            } else {
                _this.allowUpload = false;
                _this.errMessage = errList;
                _this.errDialog = true;
            }
        };
        xhr.send(formData);
    }

    public onBasicUpload($event) {
        console.log(this.uuId);
        if (this.allowUpload) {
            this.httpService.get('/bpd-proj/bpd/budgetTemplate/addAtt?' + Number(new Date()) + '&attId=' + this.uuId + '&type=Template')
                .subscribe(data => {
                    if (data.code == "1") {
                        this.growLife = 5000;
                        this.messageService.showSuccess("Operate Success!");
                    } else {
                        this.growLife = 5000;
                        this.messageService.showError("Operate Failed!");
                    }
                    this.msgs = this.messageService.msgs;
                    this.tableOnInit();
                })
        } else {
            this.messageService.showInfo("please upload right template");
            this.msgs = this.messageService.msgs;
        }
        this.addDialog = false;

    }

    downloadClick(idx, data) {
        let token = window.sessionStorage.getItem("access_token");
        let url: string = '/bpd-proj/bpd/att/downloadFiles?attIds=' + data.attId + "&_=" + Number(new Date());
        if (token) {
            let realToken = token.substr(1, token.length - 2)
            url = url + "&accessToken=" + realToken;
        }
        window.location.href = url;
    }

    public deleteClick(idx, data) {
        this.selectedIndex = idx;
        // this.deleteDialog = true;
        this.deleteService.confirm(() => {
            let flag = true;
            this.httpService.get('/bpd-proj/bpd/att/delete?' + Number(new Date()) + '&attIds=' + this.arTemplateData[this.selectedIndex].attId)
                .subscribe(data => {
                    if (flag) {
                        if (data.code == "1") {
                            this.growLife = 5000;
                            this.messageService.showSuccess("Operation Success!");
                            this.tableOnInit();
                        } else if (data.code == "2") {
                            this.growLife = 30000;
                            this.messageService.showInfo(data.msg);
                        } else {
                            this.growLife = 5000;
                            this.messageService.showError("Operation Failed!")
                        }
                        this.msgs = this.messageService.msgs;
                    }
                })
        })
    }

    public deleteYes(deleteFlag: Boolean = true) {
        let flag = deleteFlag;
        this.httpService.get('/bpd-proj/bpd/att/delete?' + Number(new Date()) + '&attIds=' + this.arTemplateData[this.selectedIndex].attId)
            .subscribe(data => {
                if (flag) {
                    if (data.code == "1") {
                        this.growLife = 5000;
                        this.messageService.showSuccess("Operation Success!");
                        this.tableOnInit();
                    } else if (data.code == "2") {
                        this.growLife = 30000;
                        this.messageService.showInfo(data.msg);
                    } else {
                        this.growLife = 5000;
                        this.messageService.showError("Operation Failed!")
                    }
                    this.msgs = this.messageService.msgs;
                }
            })
        this.deleteDialog = false;
    }

    public deleteNo() {
        this.deleteDialog = false;
    }

}