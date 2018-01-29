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

import "style-loader!./projectTypeProgram.scss";

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
    selector: "project-type-program",
    templateUrl: "./projectTypeProgram.html"
})

export class ProjectTypeProgram {

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
    public errMessage: any;
    public errDialog: boolean = false;
    constructor(private dataManageService: DataManageService, private messageService: MessageService, private httpService: HttpDataService, private deleteService: DeleteComfirmService) {
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
                } else {
                    this.arTemplateData = [];
                }
            })
    }

    public addClick(idx, data) {
        this.addDialog = true;
        this.modifyFlag = "add";
        this.uuId = this.dataManageService.getUuId();
    }

    public editClick(idx, data) {
        this.addDialog = true;
        this.selectedIndex = idx;
        this.modifyFlag = "edit";
        this.uuId = this.dataManageService.getUuId();
    }

    public onBasicBeforeUpload($event) {
        if (this.modifyFlag == "edit") {
            this.deleteYes(false);
        }

    }

    public onBasicSelect(event) {

    }

    public onBasicUpload($event) {
        this.httpService.get('/bpd-proj/bpd/projectType/addAttProgram?' + Number(new Date()) + '&attId=' + this.uuId + '&type=projectTypeProgram')
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