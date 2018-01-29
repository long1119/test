import {
    Component,
    OnInit,
    Output,
    EventEmitter,
    Input,
    OnChanges,
    SimpleChanges
} from '@angular/core';

import {
    HttpDataService
} from '../../service/http.service';
import {
    DataManageService
} from '../../service/dataManage.service';
import { MessageService } from '../../service/message.service';
import { SimpleChange } from '@angular/core/src/change_detection/change_detection_util';

import { Message, ConfirmationService } from 'primeng/primeng';

@Component({
    selector: "score-card-work-flow",
    templateUrl: "./scoreCardWorkFlow.html",
    styleUrls: [
        './scoreCardWorkFlow.scss'
    ]
})

export class ScoreCardWorkFlow {

    @Input()
    private auditForm;
    public scoreCardTargetStore: any[] = [];
    public plandateValue: string;
    public adProjectCode: string;
    public pqrrMilestone: string;
    public readonlyStatus: boolean = false;
    public editSingleDisplay: boolean = false;
    public targetItem: any = {};
    public targetMetrics: string = null;
    public targetGroup: string = null;
    public targetDepartment: string = null;
    public targetMemo: string = "";
    public targetOwner: string = null;
    public targetOwnerCode: string = '';
    public targetTarget: string = 'Green';
    public targetStatus: string = null;
    public proposedTarget: string = null;
    public dataSourceDisplay: boolean = false;
    public targetGridStore: any = [];
    public targetDisplay: boolean = false;
    public msgs: Message[];
    public growLife: number = 5000;
    public statusFlagDialog: boolean = false;
    public bfsStore: any = [];
    public managerSearchDialog: boolean = false;
    public managerDialogDepartment: string;
    public managerDialogUserName: string;
    public managerDataLen: number;
    public managerData: any[] = [];
    public subTargetDisplay: boolean = false;
    public isAdd: boolean = false;
    public subSubjectValue: string = null;
    public subTargetValue: any = null;
    public statusValue: string = null;
    public targetSubItem: any = {};
    public index: number = null;
    public subProposedTarget: string = null;
    public managerDataRows: any = '10';
    public managerDataFirst: any = 0;
    public managerName: string;
    public editFlag: Boolean;
    public setStatusDialog: boolean = false;
    public authorizeRadio: any;
    public changeColorItem: any = {};

    constructor(private httpService: HttpDataService, private messageService: MessageService, private dataManageSeravice: DataManageService, private confirmationService: ConfirmationService) {
        this.managerName = window.localStorage.getItem("user");
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.auditForm) {
            if (this.auditForm.createUserCode === this.managerName) {
                this.editFlag = true;
            }
            this.adProjectCode = this.auditForm.businessId.split(",")[0];
            this.pqrrMilestone = this.auditForm.businessId.split(",")[1];
            this.tableOnInit();
        }
    }

    private tableOnInit() {
        this.httpService.post("/bpd-proj/bpd/programScorecardStatus/getVList", {
            adProjectCode: this.auditForm.businessId.split(",")[0],
            pqrrMilestone: this.auditForm.businessId.split(",")[1]
        })
            .subscribe(data => {
                if (data.length < 10) {
                    let _length = 10 - data.length;
                    for (let i = 0; i < data.length; i++) {
                        data[i].id = i + 1;
                    }
                    for (let i = 0; i < _length; i++) {
                        data.push({
                            ip: i
                        })
                    }
                    this.scoreCardTargetStore = data;
                } else {
                    for (let i = 0; i < data.length; i++) {
                        data[i].id = i + 1;
                    }
                    this.scoreCardTargetStore = data;
                }
                if (data.length) {
                    this.plandateValue = data[0].planDate;
                }
            })
    }

    public targetEditBtn(item) {
        if (item.scorecardType && item.bfs) {
            this.readonlyStatus = false;
        } else {
            this.readonlyStatus = true;
        }
        this.targetItem = item;
        this.editSingleDisplay = true;
        this.targetMetrics = item.indexName;
        this.targetGroup = item.metricGroup;
        this.targetDepartment = item.deptName;
        this.targetMemo = item.statusDesc;
        this.targetOwner = item.ownerName;
        this.targetOwnerCode = item.ownerCode;
        this.targetTarget = item.targetVolume;
        this.targetStatus = item.statusVolume;
        this.proposedTarget = item.proposedTarget;
        if (item.dataSource == "FeedBack") {
            this.dataSourceDisplay = true;
        } else {
            this.dataSourceDisplay = false;
        }
        // if (this.statusSelectedStore.freezedStatus == '0') {
        this.targetDisplay = true;
        // } else {
        // this.targetDisplay = false;
        // }
        this.httpService.post("/bpd-proj/bpd/programScorecardSubstatus/getVList", {
            "indexId": item.indexId,
            "adProjectCode": item.adProjectCode,
            "pqrrMilestone": item.pqrrMilestone
        })
            .subscribe(data => {
                if (data.length) {
                    this.targetGridStore = data;
                } else {
                    this.targetGridStore = [];
                }
            })
    }

    public targerSaveBtn() {
        if (this.targetItem.dataType == '3') {
            this.targetTarget = this.DateToString(this.targetTarget);
            this.targetStatus = this.DateToString(this.targetStatus);
        }
        let params: any = {
            indexId: this.targetItem.indexId,
            adProjectCode: this.targetItem.adProjectCode,
            pqrrMilestone: this.targetItem.pqrrMilestone,
            owner: this.targetOwnerCode,
            targetVolume: this.targetGridStore.length ? null : this.targetTarget,
            statusVolume: this.targetGridStore.length ? null : this.targetStatus,
            statusDesc: this.targetMemo,
            parms1: "parms1"
        };
        this.httpService.post("/bpd-proj/bpd/programScorecardStatus/update", params)
            .subscribe(data => {
                if (data['code'] == 1) {
                    this.messageService.showSuccess("Success");
                    this.growLife = 5000;
                    this.msgs = this.messageService.msgs;
                    this.editSingleDisplay = false;
                    this.httpService.post("/bpd-proj/bpd/programScorecardStatus/getVList", {
                        adProjectCode: this.adProjectCode,
                        pqrrMilestone: this.pqrrMilestone
                    })
                        .subscribe(data => {
                            this.scoreCardTargetStore = [];
                            if (data.length < 10) {
                                let _length = 10 - data.length;
                                for (let i = 0; i < data.length; i++) {
                                    data[i].id = i + 1;
                                }
                                for (let i = 0; i < _length; i++) {
                                    data.push({
                                        ip: i
                                    })
                                }
                                this.scoreCardTargetStore = data;
                            } else {
                                for (let i = 0; i < data.length; i++) {
                                    data[i].id = i + 1;
                                }
                                this.scoreCardTargetStore = data;
                            }
                        })
                } else if (data['code'] == 2) {
                    this.messageService.showInfo(data['businessData']);
                    this.growLife = 300000;
                    this.msgs = this.messageService.msgs;
                } else {
                    this.messageService.showError(data['businessData']);
                    this.growLife = 5000;
                    this.msgs = this.messageService.msgs;
                }
            })

    }

    public targetCancelBtn() {
        this.editSingleDisplay = false;
    }

    public clickStatus() {
        if (this.targetItem.scorecardType && this.targetItem.bfs) {
            this.httpService.post("/bpd-proj/bpd/programScorecardStatus/getVListOfBfs", {
                programCode: this.targetItem.programCode,
                bfs: this.targetItem.bfs
            })
                .subscribe(data => {
                    this.bfsStore = [];
                    for (let i = 0; i < data.length; i++) {
                        data[i].id = i + 1;
                    }
                    if (data.length < 10) {
                        for (let i = 0; i < 10; i++) {
                            if (!data[i]) {
                                this.bfsStore.push({
                                    "ip": i + 1
                                })
                            } else {
                                this.bfsStore.push(data[i])
                            }
                        }
                    } else {
                        for (let i = 0; i < data.length; i++) {
                            this.bfsStore.push(data[i])
                        }
                    }
                    this.statusFlagDialog = true;
                })
        }
    }

    public addTargetDataBtn() {
        this.subTargetDisplay = true;
        this.isAdd = false;
        this.subSubjectValue = null;
        this.subTargetValue = null;
        this.statusValue = null;
    }

    public targetGridEditBtn(item, i) {
        this.targetSubItem = item;
        this.index = i;
        this.subTargetDisplay = true;
        this.isAdd = true;
        this.subSubjectValue = item.subjectName;
        this.subTargetValue = item.subtargetVolume;
        this.statusValue = item.substatusVolume ? item.substatusVolume : null;
        this.subProposedTarget = item.proposedVolume ? item.proposedVolume : null;
    }

    public targetGridDelBtn(item, i) {
        this.confirmationService.confirm({
            message: 'Do You Want To Delete This Record?',
            header: 'Delete Confirmation',
            icon: 'fa fa-trash',
            accept: () => {
                this.httpService.post("/bpd-proj/bpd/programScorecardSubstatus/delete", {
                    subjectName: item.subjectName,
                    indexId: this.targetItem.indexId,
                    adProjectCode: this.targetItem.adProjectCode,
                    pqrrMilestone: this.targetItem.pqrrMilestone
                })
                    .subscribe(data => {
                        if (data['code'] == 1) {
                            this.messageService.showSuccess("Success");
                            this.growLife = 5000;
                            this.msgs = this.messageService.msgs;
                            // this.targetDisable = true;
                            this.subTargetDisplay = false;
                            this.targetGridAjax();
                        } else if (data['code'] == 2) {
                            this.messageService.showInfo(data['businessData']);
                            this.growLife = 300000;
                            this.msgs = this.messageService.msgs;
                        } else {
                            this.messageService.showError(data['businessData']);
                            this.growLife = 5000;
                            this.msgs = this.messageService.msgs;
                        }
                    })
            }
        });
    }

    public subTargetsaveBtn() {
        this.httpService.post("/bpd-proj/bpd/programScorecardSubstatus/add", {
            subjectName: this.subSubjectValue,
            subtargetVolume: this.subTargetValue,
            indexId: this.targetItem.indexId,
            adProjectCode: this.targetItem.adProjectCode,
            pqrrMilestone: this.targetItem.pqrrMilestone,
            substatusVolume: this.statusValue
        })
            .subscribe(data => {
                if (data['code'] == 1) {
                    this.messageService.showSuccess("Success");
                    this.growLife = 5000;
                    this.msgs = this.messageService.msgs;
                    // this.targetDisable = true;
                    this.subTargetDisplay = false;
                    this.targetGridAjax();
                } else if (data['code'] == 2) {
                    this.messageService.showInfo(data['businessData']);
                    this.growLife = 300000;
                    this.msgs = this.messageService.msgs;
                } else {
                    this.messageService.showError(data['businessData']);
                    this.growLife = 5000;
                    this.msgs = this.messageService.msgs;
                }
            })
    }

    public subTargetsaveChangeBtn() {
        this.httpService.post("/bpd-proj/bpd/programScorecardSubstatus/update", {
            subjectName: this.subSubjectValue,
            subtargetVolume: this.subTargetValue,
            indexId: this.targetItem.indexId,
            adProjectCode: this.targetItem.adProjectCode,
            pqrrMilestone: this.targetItem.pqrrMilestone,
            substatusVolume: this.statusValue,
            proposedVolume: this.subProposedTarget,
            parms1: "parms1"
        })
            .subscribe(data => {
                if (data['code'] == 1) {
                    this.messageService.showSuccess("Success");
                    this.growLife = 5000;
                    this.msgs = this.messageService.msgs;
                    // this.targetDisable = true;
                    this.subTargetDisplay = false;
                    this.targetGridAjax();
                } else if (data['code'] == 2) {
                    this.messageService.showInfo(data['businessData']);
                    this.growLife = 300000;
                    this.msgs = this.messageService.msgs;
                } else {
                    this.messageService.showError(data['businessData']);
                    this.growLife = 5000;
                    this.msgs = this.messageService.msgs;
                }
            })
    }

    public subTargetCancelBtn() {
        this.subTargetDisplay = false;
    }

    public targetGridAjax() {
        this.httpService.post("/bpd-proj/bpd/programScorecardSubstatus/getVList", {
            "indexId": this.targetItem.indexId,
            "adProjectCode": this.targetItem.adProjectCode,
            "pqrrMilestone": this.targetItem.pqrrMilestone
        })
            .subscribe(data => {
                if (data.length) {
                    this.targetGridStore = data;
                    // this.targetDisable = true;
                } else {
                    this.targetGridStore = [];
                    // this.targetDisable = false;
                }
            })
    }

    public managerPaginate(e) {
        this.httpService.post("/bpd-proj/bpd/user/getVPetUser", {
            "page": {
                "page": e.page + 1,
                "rows": e.rows
            },
            "departmentName": this.managerDialogDepartment,
            "userName": this.managerDialogUserName,
            "userCode": this.adProjectCode,
            "roleCodes": this.targetItem.roleCode
        })
            .subscribe(data1 => {
                let data = data1.rows;
                this.managerDataLen = data1.total;
                this.managerDataRows = e.rows;
                this.managerDataFirst = e.first;
                this.managerData = [];
                for (let i = 0; i < data.length; i++) {
                    data[i].id = i + 1;
                }
                for (let i = 0; i < e.rows; i++) {
                    if (!data[i]) {
                        this.managerData.push({
                            "ip": i + 1
                        })
                    } else {
                        this.managerData.push(data[i])
                    }
                }
            })
    }

    public lookClickEnterSearch($event) {
        if ($event.key === "Enter") {
            this.managerLookClick();
        }
    }

    public managerLookClick() {
        let e = { page: 0, first: 0, rows: "10" };
        this.managerPaginate(e);
    }

    public managerDbclick(e) {
        this.targetOwnerCode = e.data.userCode;
        this.targetOwner = e.data.userName;
        this.managerSearchDialog = false;
        this.managerDialogDepartment = null;
        this.managerDialogUserName = null;
    }


    public getUser() {
        this.managerSearchDialog = true;
        this.managerDialogDepartment = null;
        this.managerDialogUserName = null;
        this.httpService.post("/bpd-proj/bpd/user/getVPetUser", {
            "page": {
                "page": 1,
                "rows": 10
            },
            "departmentName": this.managerDialogDepartment,
            "userName": this.managerDialogUserName,
            "userCode": this.adProjectCode,
            "roleCodes": this.targetItem.roleCode
        })
            .subscribe(data1 => {
                let data = data1.rows;
                this.managerDataLen = data1.total;
                this.managerData = [];
                for (let i = 0; i < data.length; i++) {
                    data[i].id = i + 1;
                }
                for (let i = 0; i < 10; i++) {
                    if (!data[i]) {
                        this.managerData.push({
                            'ip': i
                        })
                    } else {
                        this.managerData.push(data[i])
                    }
                }
            })
    }

    public DateToString(val) {
        let valStr = '';
        if (!val) {
            return valStr;
        }
        if (val.toString().length > 19) {
            let year = val.getFullYear();
            let month = val.getMonth() + 1;
            if (month < 10) {
                month = "0" + month;
            }
            let day = val.getDate();
            valStr = year + '-' + month + '-' + day;
        } else {
            valStr = val;
        }
        return valStr;
    }

    public changeColor(item) {
      if(item.dataType == "1" || item.dataType == "3") {
        this.changeColorItem = item;
        this.setStatusDialog = true;
        this.authorizeRadio = item.colorStatus;
      } else {
        this.messageService.showInfo("Data Type Is Not Text!");
        this.growLife = 300000;
        this.msgs = this.messageService.msgs;
      }
    }

    public setStatusSaveBtn() {
      this.httpService.post("/bpd-proj/bpd/programScorecardStatus/update",{
        indexId: this.changeColorItem.indexId,
        adProjectCode: this.changeColorItem.adProjectCode,
        pqrrMilestone: this.changeColorItem.pqrrMilestone,
        colorStatus: this.authorizeRadio,
        parms1: "parms1"
      })
      .subscribe(data => {
        if(data['code'] == 1) {
          this.messageService.showSuccess("Success");
          this.growLife = 5000;
          this.msgs = this.messageService.msgs;
          this.setStatusDialog = false;
          this.httpService.post("/bpd-proj/bpd/programScorecardStatus/getVList",{
            adProjectCode: this.adProjectCode,
            pqrrMilestone: this.pqrrMilestone
          })
          .subscribe(data => {
            if(data.length < 10) {
              let _length = 10 - data.length;
              for(let i=0; i<data.length; i++) {
                data[i].id = i+1;
              }
              for(let i=0; i<_length; i++) {
                data.push({
                  ip: i
                })
              }
              this.scoreCardTargetStore = data;
            } else {
              for(let i=0; i<data.length; i++) {
                data[i].id = i+1;
              }
              this.scoreCardTargetStore = data;
            }
          })
        } else if(data['code'] == 2){
          this.messageService.showInfo(data['businessData']);
          this.growLife = 300000;
          this.msgs = this.messageService.msgs;
        } else {
          this.messageService.showError(data['businessData']);
          this.growLife = 5000;
          this.msgs = this.messageService.msgs;
        }
      })
    }
}