import {
    Component,
    OnInit
} from '@angular/core';
import {
    CommonModule,

} from '@angular/common';
import {
    FormsModule
} from '@angular/forms';
// import {BugetTemplateService} from './BugetTemplate.service';
import 'style-loader!./bugetTemplate.scss';
import {
    SelectItem,
    Message
} from 'primeng/primeng';
import {
    HttpDataService
} from '../../../service/http.service';
import {
    MessageService
} from '../../../service/message.service';
import {
    DataManageService
} from '../../../service/dataManage.service';
import {
    DeleteComfirmService
} from '../../../service/deleteDialog.service';

// import { BaseDataModule } from '../../baseData.module';

@Component({
    selector: 'buget-template',
    templateUrl: './bugetTemplate.html',
})
export class BugetTemplate {
    addDialog: Boolean = false;
    deleteDialog: Boolean = false;
    private modifyFlag: string;
    // editDialog :Boolean = false; 

    costomName: string;
    reserseName: string;
    selectedListName: string;
    // selectedListCode: string;
    selectedIndex: number;
    selectedData: any;
    selectedList: string;
    growMessage: Message[];

    baseData: any[] = [];
    fontData: any[] = [];
    regionData: any[] = [];
    userData: any[] = [];
    listData: SelectItem[];
    public dialogRegionName: string;
    public dialogUserName: string;
    public selectedRegionData: any[] = [];
    public selectedUserData: any = {};
    public selectRegionMode: Boolean;

    public nextStepLabel: string;


    public currentStep: string = "";
    public currentStepLabel: string = "Report Person";
    public nextStepFlag: Boolean;
    public previousFlag: Boolean; // 修改时上一步按钮禁用
    public msgs: Message[];
    public growLife: number = 5000;

    public localStorageAuthority: Boolean = true;

    // paginator
    public userPaginatorRow: number;
    public userPaginatorTotal: number;
    public userPaginatorPage: number;
    public userFontFirst: number;

    constructor(private httpService: HttpDataService, private messageService: MessageService, private dataManageService: DataManageService, private deleteComfirmService: DeleteComfirmService) {
        this.currentStep = "region";
        this.fontData = this.dataManageService.addEmptyOnInitTableData(3);
        this.userPaginatorRow = 5;
        this.userPaginatorPage = 1;
        this.userFontFirst = 0;
        this.nextStepLabel = "Next";
    }

    ngOnInit() {
        this.tableOnInit();
        this.localStorageAuthority = this.dataManageService.buttonAuthority("Maintain AR Region");
    }

    userPaginate($event = this.selectedData) {
        // this.userFontFirst = $event.first;
        // this.userPaginatorPage = $event.page + 1;
        // this.userPaginatorRow = $event.rows;
        let event = $event;
        this.httpService.post("/bpd-proj/bpd/user/getVList1", {
            "userName": this.dialogUserName.trim(),
            // "page": {
            //     "page": $event.page + 1,
            //     "rows": $event.rows 
            // }
        })
            .subscribe(data => {
                this.userData = this.dataManageService.addEmptyTableData(data, 5);
                for (let i = 0; i < data.length; i++) {
                    if (data[i].userCode === event.reportPerson) {
                        this.selectedUserData = data[i];
                    }
                }
            })
    }

    onRowClick() {
        if (this.currentStep === "region") {
            if (this.selectedRegionData.length === 0) {
                this.nextStepFlag = false;
            } else {
                this.nextStepFlag = true;
            }
        } else if (this.currentStep !== "region") {
            if (this.selectedUserData.length === 0) {
                this.nextStepFlag = false;
            } else {
                this.nextStepFlag = true;
            }
            if (this.currentStep === "manager") {
                for (let i = 0; i < this.fontData.length; i++) {
                    this.fontData[i].managerName = this.selectedUserData.userName
                }
            } else if (this.currentStep === "commissioner") {
                for (let i = 0; i < this.fontData.length; i++) {
                    this.fontData[i].commissionerName = this.selectedUserData.userName
                }
            }
        }
    }

    // 表格加载
    tableOnInit() {
        this.httpService.post('/bpd-proj/bpd/arRegionUser/getVList', {})
            .subscribe(data => {
                this.baseData = this.dataManageService.addEmptyTableData(data, 10);
            })
    }

    /**
     * 保存模态框弹出
     * 
     * @memberof BugetTemplate
     */
    addClick() {
        this.dialogRegionName = "";
        this.dialogUserName = "";
        this.selectRegionMode = true;
        this.nextStepFlag = false;
        this.fontData = [];
        this.selectedRegionData = [];
        this.selectedUserData = [];
        this.currentStep = "region";
        this.modifyFlag = "add";
        this.selectedData = [];
        this.httpService.post("/bpd-proj/bpd/region/getVList", {
            "arRegionFlag": "1"
        })
            .subscribe(data => {
                this.addDialog = true;
                this.regionData = data;
            });
        this.nextStepLabel = "Next";
    };

    editClick(idx, data) {
        this.dialogRegionName = "";
        this.dialogUserName = "";
        this.previousFlag = false;
        this.selectedData = data;
        this.selectRegionMode = false;
        this.selectedIndex = idx;
        this.nextStepFlag = false;
        this.fontData = [];
        this.fontData.push({
            regionName: data.regionName,
            regionCode: data.regionCode,
            commissionerName: data.reportPersonName,
            commissionerCode: data.reportPerson,
            managerName: data.regionManagerName,
            managerCode: data.regionManager
        })
        this.currentStep = "commissioner";
        this.modifyFlag = "edit";
        this.httpService.post("/bpd-proj/bpd/region/getVList", {
            "arRegionFlag": "1"
        })
            .subscribe(data => {
                this.addDialog = true;
                this.regionData = data;
            })
        this.userPaginate(data);
        this.nextStepFlag = true;
        this.nextStepLabel = "Next";
    }

    /**
     * 添加确认
     * 
     * @memberof BugetTemplate
     */

    addSave() {
        this.addDialog = false;
    }

    addCancle() {
        this.addDialog = false;
    }

    previousStep() {
        this.nextStepFlag = true;
        this.nextStepLabel = "Next";
        if (this.currentStep === "manager") {
            this.currentStepLabel = "Report Person";
            this.currentStep = "commissioner";
            for (let i = 0; i < this.userData.length; i++) {
                if (this.userData[i].userCode === this.fontData[0].commissionerCode) {
                    this.selectedUserData = this.userData[i];
                }
            }
            if (this.modifyFlag === "edit") {
                this.previousFlag = false;
            }
        } else if (this.currentStep === "commissioner") {
            this.currentStep = "region";
        } else {
            this.currentStepLabel = "Manager";
        }
    }

    nextStep($event) {
        this.previousFlag = true
        this.nextStepFlag = false;
        if (this.currentStep === "region") {
            this.fontData = [];
            for (let i = 0; i < this.selectedRegionData.length; i++) {
                this.fontData.push({
                    regionName: this.selectedRegionData[i].regionName,
                    regionCode: this.selectedRegionData[i].regionCode,
                    commissionerName: this.selectedUserData.userName,
                    commissionerCode: this.selectedUserData.userCode,
                    managerName: null
                })
            }
            // 获取人物表格数据
            this.currentStepLabel = "Report Person";
            this.currentStep = "commissioner";
            this.userPaginate();
        } else if (this.currentStep === "commissioner") {
            this.currentStepLabel = "Manager";
            for (let i = 0; i < this.fontData.length; i++) {
                this.fontData[i].commissionerName = this.selectedUserData.userName;
                this.fontData[i].commissionerCode = this.selectedUserData.userCode;
            }
            if (this.modifyFlag === "add") {
                this.selectedUserData = {};
            } else if (this.modifyFlag === "edit") {
                for (let i = 0; i < this.userData.length; i++) {
                    if (this.userData[i].userCode === this.selectedData.regionManager) {
                        this.selectedUserData = this.userData[i];
                    }
                }
            }
            this.nextStepFlag = true;
            this.currentStep = "manager";
            this.nextStepLabel = "Confirm";
        } else if (this.currentStep === "manager") {
            let arr: any[] = [];
            for (let i = 0; i < this.fontData.length; i++) {
                arr.push({
                    "regionCode": this.fontData[i].regionCode,
                    "regionManager": this.selectedUserData.userCode,
                    "reportPerson": this.fontData[i].commissionerCode,
                })
            }
            if (this.modifyFlag === "add") {
                this.httpService.post('/bpd-proj/bpd/arRegionUser/insert', arr)
                    .subscribe(data => {
                        if (data.code === "1") {
                            this.messageService.showSuccess("Operate Success!");
                            this.growLife = 5000;
                            this.tableOnInit();
                        } else if (data.code === "2") {
                            this.messageService.showInfo(data.msgs);
                            this.growLife = 999999;
                        } else {
                            this.messageService.showError("Operate Failed!");
                            this.growLife = 5000;
                        }
                        this.msgs = this.messageService.msgs;
                    })
            } else if (this.modifyFlag === "edit") {
                let data = {
                    "regionCode": this.fontData[0].regionCode,
                    "regionManager": this.selectedUserData.userCode,
                    "reportPerson": this.fontData[0].commissionerCode,
                    "regionUserId": this.selectedData.regionUserId
                }
                this.httpService.post('/bpd-proj/bpd/arRegionUser/update', data)
                    .subscribe(data => {
                        if (data.code === "1") {
                            this.messageService.showSuccess("Operate Success!");
                            this.growLife = 5000;
                            this.tableOnInit();
                        } else if (data.code === "2") {
                            this.messageService.showInfo(data.msgs);
                            this.growLife = 999999;
                        } else {
                            this.messageService.showError("Operate Failed!");
                            this.growLife = 5000;
                        }
                        this.msgs = this.messageService.msgs;
                    })
            }

            this.addDialog = false;
        }
    }

    deleteClick(idx, data) {
        this.selectedIndex = idx;
        // this.deleteDialog = true;
        this.deleteComfirmService.confirm(() => {
            this.httpService.get('/bpd-proj/bpd/arRegionUser/delete?regionUserId=' + this.baseData[this.selectedIndex].regionUserId)
                .subscribe(data => {
                    if (data.code === "1") {
                        this.messageService.showSuccess("Operate Success!");
                        this.growLife = 5000;
                        this.tableOnInit();
                    } else {
                        this.messageService.showError("Operate Failed!");
                        this.growLife = 5000;
                    }
                    this.msgs = this.messageService.msgs;
                })
        })
    }

    deleteYes() {
        this.httpService.get('/bpd-proj/bpd/arRegionUser/delete?regionUserId=' + this.baseData[this.selectedIndex].regionUserId)
            .subscribe(data => {
                if (data.code === "1") {
                    this.messageService.showSuccess("Operate Success!");
                    this.growLife = 5000;
                    this.tableOnInit();
                } else {
                    this.messageService.showError("Operate Failed!");
                    this.growLife = 5000;
                }
                this.msgs = this.messageService.msgs;
            })
        this.deleteDialog = false;
    }

    deleteNo() {
        this.deleteDialog = false;
    }

    regionNameEnterSearch($event) {
        if ($event.key === "Enter") {
            this.regionNameLookClick();
        }
    }

    regionNameLookClick() {
        this.httpService.post("/bpd-proj/bpd/region/getVList", {
            "regionName": this.dialogRegionName.trim(),
            "arRegionFlag": "1"
        })
            .subscribe(data => {
                this.regionData = data;
            });
    }

    userNameEnterSearch($event) {
        if ($event.key === "Enter") {
            this.regionNameLookClick();
        }
    }

    userNameLookClick() {
        let page = { page: 0, rows: 5, first: 0 };
        this.userPaginate(page);
    }

    clearManager() {
        for (let i = 0; i < this.fontData.length; i++) {
            this.fontData[i].managerCode = "";
            this.fontData[i].managerName = "";
            this.selectedUserData = {
                userCode: ""
            };
        }
    }
};
