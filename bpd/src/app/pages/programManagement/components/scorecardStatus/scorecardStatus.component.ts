import { Component, OnInit } from '@angular/core';
import 'style-loader!./scorecardStatus.scss';
import { SelectItem, TreeNode, MenuItem, ConfirmationService } from 'primeng/primeng';
import { HttpDataService } from '../../../service/http.service';
import { DataManageService } from '../../../service/dataManage.service';
import { MessageService } from '../../../service/message.service';
import { WorkFlowStartService } from '../../../../ebon/components/workflow/workflow-start.service';
// import { window } from 'rxjs/operator/window';

@Component({
  selector: 'scorecard-status',
  templateUrl: './scorecardStatus.html',
  providers: [HttpDataService, MessageService, WorkFlowStartService, ConfirmationService, DataManageService]
})
export class ScorecardStatus implements OnInit{

    public msgs: any;

    public growLife: number = 5000;

    public gridStore: any = [];

    public selectedStore: any = [];

    public statusStore: any = [];

    public statusStoreLen: number;

    public statusStoreRows: any = '12';

    public statusStoreFirst: any = 0;

    public statusStorePage: any = 0;

    public statusSelectedStore: any = [];

    public lookUpDisplay: boolean = false;

    public programCodeSearch: string = null;

    public submitDisplay: boolean = false;

    public addScoreCardTargetDisplay: boolean = false;

    public milestoneValueStore: any = [];

    public milestoneValue: string = null;

    public plandateValue: string = null;

    // public intervalDaysValue: number = null;

    public scoreCardTargetStore: any = [];

    public scoreCardTargetStoreLen: number;

    public scoreCardTargetStoreRows: any = '10';

    public scoreCardTargetStoreFirst: any = 0;

    public scoreCardTargetStorePage: any = 0;

    public editSingleDisplay: boolean = false;

    public unFreezeBtnDisPlay: boolean = true;

    public executiveType: string;

    public executiveTypeStore: SelectItem[] = [];

    private selectedAdProjectCode: string;

    private selectedPqrrMilestone: string;

    public exectiveCommtteeFlag: Boolean = true;

    public userRoot: boolean = true;

    public canSubmit: boolean = false;

    public yearRange: string;

    public setPetMemberDialog: Boolean = false;

    public setPetMemberMessage: Boolean = false;

    public recivedMap: any = {};

    public changeMemberMessage: any[];

    public submitDialog: Boolean = false;

    public approvingData: any[] = [];

    public currentUser: string;

    public createUser: string = "";

    public ProgramSearchTitle: string = "Program Info";


	constructor(private service: HttpDataService, private msgservice: MessageService, private workFlowService: WorkFlowStartService, private confirmationService: ConfirmationService, private dataManageService: DataManageService) {
    this.executiveTypeStore.push({
      label: "Yes",
      value: "1"
    });
    this.executiveTypeStore.push({
      label: "No",
      value: "2"
    })
    this.executiveType = this.executiveTypeStore[0].value;
    // 日期年份设置
    let currentYear = new Date().getFullYear();
    this.yearRange = "" + (Number(currentYear) - 10) + ":" + (Number(currentYear) + 50);
	}
    
    ngOnInit() {
      this.currentUser = window.localStorage.getItem("user");
      if(!JSON.parse(window.localStorage.getItem("authorityData"))["Maintain ScoreCard Status"] || 
        JSON.parse(window.localStorage.getItem("authorityData"))["Maintain ScoreCard Status"] == 'false')
      {
        this.userRoot = false;
      }
      this.service.post("/bpd-proj/bpd/vehicleProject/getVListScoreCard",{
        'programCode': this.programCodeSearch,
        'categoryType': '1'
      })
      .subscribe(data => {
        this.gridStoreAjax(data);
        this.selectedAdProjectCode = data[0].adProjectCode;
      })
    }

    public programGridRowClick(e) {
      this.selectedAdProjectCode = e.data.adProjectCode;
      this.createUser = e.data.projManager;
      let event = e;
      if(e.data.adProjectCode) {
        this.service.post("/bpd-proj/bpd/programScorecard/getVList",{
          "page": {
            "page": 1,
            "rows": 12
          },
          adProjectCode: e.data.adProjectCode
        })
        .subscribe(data1 => {
          this.statusStore = [];
          let data = data1.rows;
          this.statusStoreLen = data1.total;
          for(let i = 0; i < data.length; i++) {
            data[i].id = i + 1;
            data[i].freezedStatusStr = data[i].freezedStatus == 0 ? "UnFreeze" : "Freeze";
          }
          for(let i = 0; i < 12; i++) {
            if(!data[i]) {
              this.statusStore.push({
                'ip': i
              })
            } else {
              this.statusStore.push(data[i])
            }
          }
          if(data.length) {
            this.statusSelectedStore = data[0];
            this.selectedPqrrMilestone = data[0].pqrrMilestone;
// this.statusSelectedStore.freezedStatus == 3 || 
            if(e.data.freezedStatus != 2 || event.data.pqrrMilestoneName !== "CSO" || e.data.status != 1) {
              this.canSubmit = false;
            } else {
              this.canSubmit = true;
            }
            this.getApproveLog();
          } else {
            this.approvingData = [];
            this.selectedPqrrMilestone = null;
          }
        })
      } else {
        this.statusStore = [];
        for(let i=0; i<12; i++) {
          this.statusStore.push({
            ip: i
          })
        }
      }
    }

    public gridStoreAjax(data) {  // grid ajax
      if(data.length < 15) {
        let _length = 15 - data.length;
        for(let i=0; i<data.length; i++) {
          data[i].id = i+1;
        }
        for(let i=0; i<_length; i++) {
          data.push({
            ip: i
          })
        }
        this.gridStore = data;
      } else {
        for(let i=0; i<data.length; i++) {
          data[i].id = i+1;
        }
        this.gridStore = data;
      }
      if(data.length) {
        this.selectedStore = data[0];

        let e:any = {
          data: data[0]
        };
        this.programGridRowClick(e);
      }
    }

    public statusPaginate(e) {
      this.service.post("/bpd-proj/bpd/programScorecard/getVList",{
        "page": {
          "page": e.page + 1,
          "rows": e.rows
        },
        adProjectCode: this.selectedStore.adProjectCode
      })
      .subscribe(data1 => {
        let data = data1.rows;
        this.statusStoreLen = data1.total;
        this.statusStoreRows = e.rows;
        this.statusStoreFirst = e.first;
        this.statusStore = [];
        for(let i = 0; i < data.length; i++) {
            data[i].id = i + 1;
            data[i].freezedStatusStr = data[i].freezedStatus == 0 ? "UnFreeze" : "Freeze";
        }
        for(let i = 0; i < e.rows; i++) {
          if(!data[i]) {
            this.statusStore.push({
              "ip": i+1
            })
          } else {
            this.statusStore.push(data[i])
          }
        }
        if(data.length) {
          this.statusSelectedStore = data[0];
          this.selectedPqrrMilestone = data[0].pqrrMilestone;
// this.statusSelectedStore.freezedStatus == 3 || 
          if(data[0].freezedStatus != 2 || data[0].pqrrMilestoneName !== "CSO" || data[0].status != 1) {
            this.canSubmit = false;
          } else {
            this.canSubmit = true;
          }
        }
      })
    }

    public lookUpBtn() {    // 模糊查询按钮
        this.lookUpDisplay = true;
        this.programCodeSearch = null;
    }

    public normalProgram: boolean = true;

    public lookUpSaveBtn() {    // 模糊查询确认按钮
      if(this.normalProgram) {
        this.service.post("/bpd-proj/bpd/vehicleProject/getVListScoreCard",{
          'programCode': this.programCodeSearch,
          'categoryType': '1'
        })
        .subscribe(data => {
          this.gridStoreAjax(data);
        })
      } else {
        this.service.post("/bpd-proj/bpd/vehicleProject/getVListScoreCard",{
          'programCode': this.programCodeSearch,
          'categoryType': '1',
          'flag': '1'
        })
        .subscribe(data => {
          this.gridStoreAjax(data);
        })
      }
      this.lookUpDisplay = false;
    }

    public changeProgram() {
      if(this.normalProgram) {
        this.service.post("/bpd-proj/bpd/vehicleProject/getVListScoreCard",{
          'programCode': this.programCodeSearch,
          'categoryType': '1',
          'flag': '1'
        })
        .subscribe(data => {
          this.gridStoreAjax(data);
          this.normalProgram = false;
          this.ProgramSearchTitle = "Program Archived";
        })
      } else {
        this.service.post("/bpd-proj/bpd/vehicleProject/getVListScoreCard",{
          'programCode': this.programCodeSearch,
          'categoryType': '1'
        })
        .subscribe(data => {
          this.gridStoreAjax(data);
          this.normalProgram = true;
          this.ProgramSearchTitle = "Program Info";
        })
      }
    }

    public lookUpCancelBtn() {   //  模糊查询取消按钮
        this.lookUpDisplay = false;
    }

    //  submit button

    public processTypeStore: any = [{label:'Direct Approval',value:'Direct approval'},{label:'Workflow Approval',value:'Process approval'}];

    public processType: string = 'Direct approval';

    public decription: string = null;

    public submitBtn() {
      this.processType === "Direct approval";
      this.submitDisplay = true;
      this.decription = null;
    }

    public submitSaveBtn() {
      if (this.processType === "Direct approval") {
      this.service.post('/bpd-proj/bpd/programScorecard/updateStatus', {
        "adProjectCode": this.selectedAdProjectCode,
        "status": 2,
        "description": this.decription,
        "pqrrMilestone": this.statusSelectedStore.pqrrMilestone
      })
        .subscribe(data => {
          if (data.code === "1") {
            this.msgservice.showSuccess("Operate Success!");
            this.growLife = 5000;
            let e = {
              page: this.statusStorePage, 
              first: this.statusStoreFirst, 
              rows: this.statusStoreRows,
              pageCount: Math.ceil(this.statusStoreLen/this.statusStoreRows)
            }
            this.statusPaginate(e);
          } else {
            this.msgservice.showInfo(data['businessData']);
            this.growLife = 300000;
          }
          this.msgs = this.msgservice.msgs;
        })
      } else if (this.processType === "Process approval") {
      this.service.post('/bpd-proj/bpd/programScorecard/updateStatus', {
        "adProjectCode": this.selectedAdProjectCode,
        "description": this.decription,
        "pqrrMilestone": this.statusSelectedStore.pqrrMilestone
      })
        .subscribe(data => {
          if (data.code === "1") {
            this.msgservice.showSuccess("Operate Success!");
            this.growLife = 5000;
            let e = {
              page: this.statusStorePage, 
              first: this.statusStoreFirst, 
              rows: this.statusStoreRows,
              pageCount: Math.ceil(this.statusStoreLen/this.statusStoreRows)
            }
            this.statusPaginate(e);
            this.service.get('/bpd-proj/bpd/programScorecard/getPetAndUserIsExit?' + Number(new Date()) + '&adProjectCode=' + this.selectedAdProjectCode)
            .subscribe(data => {
                let showDialogFlag: Boolean = true;
                let flow: Boolean = false;
                let setData: any = {};
                let newData: any[] = [];
                if (data["0"]) {
                    this.setPetMemberDialog = true;
                    this.setPetMemberMessage = data["0"].substr(0, data["0"].length - 1);
                    flow = true;
                } else if (data[1]) {
                    for (let key in data[1]) {
                        if (data[1][key].length !== 1) {
                            showDialogFlag = false;
                            flow = true;
                            setData[key] = data[1][key];
                        } else if (data[1][key].length > 1) {
                            flow = true;
                            newData.push({
                                role: key,
                                user: data[1][key][0]
                            })
                        } else {
                            this.recivedMap[key] = data[1][key][0].userCode;
                        }
                    }
                }
                if (!flow) {
                  this.workFlowService.start("scorecard", this.selectedAdProjectCode + ",10219", [{name: "flag", value: this.executiveType},{ name: "obj", value: JSON.stringify(this.recivedMap)}], () => {
                    this.gridStoreAjax(this.gridStore);
                  });
                } 
                if (!showDialogFlag) {
                    this.changeMemberMessage = setData;
                }
            })
        this.submitDialog = false;
          } else {
            this.msgservice.showInfo(data['businessData']);
            this.growLife = 300000;
          }
          this.msgs = this.msgservice.msgs;
        })
      }
      this.submitDisplay = false;
    }

    /**
     * 接收流程数据
     * 
     * @param {any} $evenet 
     * @memberof TimeSheet
     */
    mapRecive($event) {
        for (let key in this.recivedMap) {
            $event[key] = this.recivedMap[key];
        }
        // console.log(JSON.stringify($event));
        // 发起流程
         [{ name: "obj", value: JSON.stringify($event) }]
        this.workFlowService.start("scorecard", this.selectedAdProjectCode + ",10219", [{name: "flag", value: this.executiveType},{ name: "obj", value: JSON.stringify($event)}], () => {
          this.gridStoreAjax(this.gridStore);
        });
    }

    public submitCancelBtn() {
      this.submitDisplay = false;
    }

    public unFreezeBtn() {
      this.service.post("/bpd-proj/bpd/programScorecard/update",{
        freezedStatus: 3,
        adProjectCode: this.statusSelectedStore.adProjectCode,
        pqrrMilestone: this.statusSelectedStore.pqrrMilestone
      })
      .subscribe(data => {
        if(data['code'] == 1) {
          this.msgservice.showSuccess("Success");
          this.growLife = 5000;
          this.msgs = this.msgservice.msgs;
          let e = {
              page: this.statusStorePage, 
              first: this.statusStoreFirst, 
              rows: this.statusStoreRows,
              pageCount: Math.ceil(this.statusStoreLen/this.statusStoreRows)
          }
          this.statusPaginate(e);
        } else {
          this.msgservice.showInfo(data['businessData']);
          this.growLife = 300000;
          this.msgs = this.msgservice.msgs;
        }
      })
    }

    public notifyBtn(item) {
      this.service.post("/bpd-proj/bpd/programScorecard/update",{
        freezedStatus: 1,
        adProjectCode: item.adProjectCode,
        pqrrMilestone: item.pqrrMilestone
      })
      .subscribe(data => {
        if(data['code'] == 1) {
          this.msgservice.showSuccess("Success");
          this.growLife = 5000;
          this.msgs = this.msgservice.msgs;
          let e = {
              page: this.statusStorePage, 
              first: this.statusStoreFirst, 
              rows: this.statusStoreRows,
              pageCount: Math.ceil(this.statusStoreLen/this.statusStoreRows)
          }
          this.statusPaginate(e);
        } else {
          this.msgservice.showInfo(data['businessData']);
          this.growLife = 300000;
          this.msgs = this.msgservice.msgs;
        }
      })
    }

    public freezeBtn(item) {
      this.service.post("/bpd-proj/bpd/programScorecard/update",{
        freezedStatus: 2,
        adProjectCode: item.adProjectCode,
        pqrrMilestone: item.pqrrMilestone
      })
      .subscribe(data => {
        if(data['code'] == 1) {
          this.msgservice.showSuccess("Success");
          this.growLife = 5000;
          this.msgs = this.msgservice.msgs;
          let e = {
              page: this.statusStorePage, 
              first: this.statusStoreFirst, 
              rows: this.statusStoreRows,
              pageCount: Math.ceil(this.statusStoreLen/this.statusStoreRows)
          }
          this.statusPaginate(e);
        } else {
          this.msgservice.showInfo(data['businessData']);
          this.growLife = 300000;
          this.msgs = this.msgservice.msgs;
        }
      })
    }

    public statusGridRowClick(e) {
      this.selectedPqrrMilestone = e.data.pqrrMilestone;
      this.getApproveLog();
      // e.data.freezedStatus == 3 || 
      if(e.data.freezedStatus != 2 || e.data.pqrrMilestoneName !== "CSO" || e.data.status != 1) {
        this.canSubmit = false;
      } else {
        this.canSubmit = true;
      }
    }

    public delBtn(item) {
      this.confirmationService.confirm({
        message: 'Do You Want To Delete This Record?',
        header: 'Delete Confirmation',
        icon: 'fa fa-trash',
        accept: () => {
          this.service.post("/bpd-proj/bpd/programScorecard/delete",{
            adProjectCode: item.adProjectCode,
            pqrrMilestone: item.pqrrMilestone
          })
          .subscribe(data => {
            if(data['code'] == 1) {
              this.msgservice.showSuccess("Success");
              this.growLife = 5000;
              this.msgs = this.msgservice.msgs;
              let e = {
                  page: this.statusStorePage, 
                  first: this.statusStoreFirst, 
                  rows: this.statusStoreRows,
                  pageCount: Math.ceil(this.statusStoreLen/this.statusStoreRows)
              }
              this.statusPaginate(e);
            } else {
              this.msgservice.showInfo(data['businessData']);
              this.growLife = 300000;
              this.msgs = this.msgservice.msgs;
            }
          })
        }
      });
    }

    // add edit
    public milestoneValueChange(e) {
      this.service.post("/bpd-proj/bpd/programScorecardStatus/getVList",{
        adProjectCode: this.selectedStore.adProjectCode,
        pqrrMilestone: e.value
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
        if(data.length) {
          this.plandateValue = data[0].planDate;
        }
      })
    }

    public missionBtn() {
      this.scorecardSave = true;
      this.milestoneValue = null;
      this.plandateValue = null;
      // this.intervalDaysValue = null;
      this.milestoneValueStore = [];
      this.service.post("/bpd-proj/bpd/programScorecardStatus/getVList",{
        adProjectCode: this.selectedStore.adProjectCode,
        pqrrMilestone: this.statusSelectedStore.pqrrMilestone
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
        if(data.length) {
          this.plandateValue = data[0].planDate;
        }
        this.addScoreCardTargetDisplay = true;
      })
    } 

    public editBtn(item) {
      this.isChange = false;
      this.scorecardSave = false;
      this.plandateValue = item.planDate;
      // this.intervalDaysValue = item.emailDate;
      this.service.post("/bpd-proj/bpd/programScorecardStatus/getVList",{
        adProjectCode: this.selectedStore.adProjectCode,
        pqrrMilestone: item.pqrrMilestone
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
        this.addScoreCardTargetDisplay = true;
      })
    }

    public isChange: boolean = false;

    public changeBtn(item) {
      this.isChange = true;
      this.scorecardSave = false;
      this.plandateValue = item.planDate;
      // this.intervalDaysValue = item.emailDate;
      this.service.post("/bpd-proj/bpd/programScorecardStatus/getVList",{
        adProjectCode: this.selectedStore.adProjectCode,
        pqrrMilestone: item.pqrrMilestone
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
        this.addScoreCardTargetDisplay = true;
      })
    }

    public scorecardSave: boolean = true;

    public scoreCardSaveBtn() {
      this.service.post("/bpd-proj/bpd/programScorecard/update",{
        adProjectCode: this.selectedStore.adProjectCode,
        pqrrMilestone: this.statusSelectedStore.pqrrMilestone
        // emailDate: this.intervalDaysValue
      })
      .subscribe(data => {
        if(data['code'] == 1) {
          this.msgservice.showSuccess("Success");
          this.growLife = 5000;
          this.msgs = this.msgservice.msgs;
          let e = {
              page: this.statusStorePage, 
              first: this.statusStoreFirst, 
              rows: this.statusStoreRows,
              pageCount: Math.ceil(this.statusStoreLen/this.statusStoreRows)
          }
          this.statusPaginate(e);
          this.addScoreCardTargetDisplay = false;
        } else {
          this.msgservice.showInfo(data['businessData']);
          this.growLife = 300000;
          this.msgs = this.msgservice.msgs;
        }
      })
    }

    public scoreCardSaveChangeBtn() {
      this.service.post("/bpd-proj/bpd/programScorecard/update",{
        adProjectCode: this.selectedStore.adProjectCode,
        pqrrMilestone: this.statusSelectedStore.pqrrMilestone
        // emailDate: this.intervalDaysValue
      })
      .subscribe(data => {
        if(data['code'] == 1) {
          this.msgservice.showSuccess("Success");
          this.growLife = 5000;
          this.msgs = this.msgservice.msgs;
          let e = {
              page: this.statusStorePage, 
              first: this.statusStoreFirst, 
              rows: this.statusStoreRows,
              pageCount: Math.ceil(this.statusStoreLen/this.statusStoreRows)
          }
          this.statusPaginate(e);
          this.addScoreCardTargetDisplay = false;
        } else {
          this.msgservice.showInfo(data['businessData']);
          this.growLife = 300000;
          this.msgs = this.msgservice.msgs;
        }
      })
    }

    public scoreCardCancelBtn() {
      this.addScoreCardTargetDisplay = false;
    }

    public targetOwnerCode: string = '';
    public targetDisplay: boolean = false;
    public dataSourceDisplay: boolean = false;
    public targetMemo: string = "";

    public targetEditBtn(item) {
      if(item.scorecardType && item.bfs) {
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
      if(item.dataSource == "FeedBack") {
        this.dataSourceDisplay = true;
      } else {
        this.dataSourceDisplay = false;
      }
      if(this.statusSelectedStore.freezedStatus == '0') {
        this.targetDisplay = true;
      } else {
        this.targetDisplay = false;
      }
      this.service.post("/bpd-proj/bpd/programScorecardSubstatus/getVList",{
        "indexId": item.indexId,
        "adProjectCode": item.adProjectCode,
        "pqrrMilestone": item.pqrrMilestone
      })
      .subscribe(data => {
        if(data.length) {
          this.targetGridStore = data;
        } else {
          this.targetGridStore = [];
        }
      })
    }

    //  user

    public managerSearchDialog: boolean = false;

    public managerDialogDepartment: string = null;

    public managerDialogUserName: string = null;

    public managerData: any = [];

    public managerDataRows: any = '10';

    public managerDataFirst: any = 0;

    public managerDataLen: number;

    public getUser() {
    this.managerSearchDialog = true;
    this.managerDialogDepartment = null;
    this.managerDialogUserName = null;
    this.service.post("/bpd-proj/bpd/user/getVPetUser", {
      "page": {
        "page": 1,
        "rows": 10
      },
      "departmentName" : this.managerDialogDepartment,
      "userName": this.managerDialogUserName,
      "userCode": this.selectedStore.adProjectCode,
      "roleCodes": this.targetItem.roleCode
    })
    .subscribe(data1 => {
      let data = data1.rows;
      this.managerDataLen = data1.total;
      this.managerData = [];
      for(let i = 0; i < data.length; i++) {
        data[i].id = i + 1;
      }
      for(let i = 0; i < 10; i++) {
        if(!data[i]) {
          this.managerData.push({
            'ip': i
          })
        } else {
          this.managerData.push(data[i])
        }
      }
    })
  }

  public managerPaginate(e) {
    this.service.post("/bpd-proj/bpd/user/getVPetUser",{
      "page": {
        "page": e.page + 1,
        "rows": e.rows
      },
      "departmentName" : this.managerDialogDepartment,
      "userName": this.managerDialogUserName,
      "userCode": this.selectedStore.adProjectCode,
      "roleCodes": this.targetItem.roleCode
    })
    .subscribe(data1 => {
      let data = data1.rows;
      this.managerDataLen = data1.total;
      this.managerDataRows = e.rows;
      this.managerDataFirst = e.first;
      this.managerData = [];
      for(let i = 0; i < data.length; i++) {
          data[i].id = i + 1;
      }
      for(let i = 0; i < e.rows; i++) {
        if(!data[i]) {
          this.managerData.push({
            "ip": i+1
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
    let e = {page: 0, first: 0, rows: "10"};
      this.managerPaginate(e);
  }

  public managerDbclick(e) {
    this.targetOwnerCode = e.data.userCode;
    this.targetOwner = e.data.userName;
    this.managerSearchDialog = false;
    this.managerDialogDepartment = null;
    this.managerDialogUserName = null;
  }

  //  Modify ScoreCard Target

  public targetMetrics: string = null;

  public targetGroup: string = null;

  public targetStatus: string = null;

  public proposedTarget: string = null;

  public targetOwner: string = null;

  public targetTargetStore: any = [
    {label:'Green',value:'Green'},
    {label:'Yellow',value:'Yellow'},
    {label:'Red',value:'Red'}
  ];

  public targetTarget: string = 'Green';

  public targetDepartment: string = null;

  public targetGridStore: any = [];

  public targetDisable: boolean = false;

  public subTargetDisplay: boolean = false;

  public subSubjectValue: string = null;

  public subTargetValue: any = null;

  public statusValue: string = null;

  public isAdd: boolean = false;

  public index: number = null;

  public addTargetDataBtn() {
    this.subTargetDisplay = true;
    this.isAdd = false;
    this.subSubjectValue = null;
    this.subTargetValue = null;
    this.statusValue = null;
  }

  public subTargetsaveBtn() {
    this.service.post("/bpd-proj/bpd/programScorecardSubstatus/add",{
      subjectName: this.subSubjectValue,
      subtargetVolume: this.subTargetValue,
      indexId: this.targetItem.indexId,
      adProjectCode: this.targetItem.adProjectCode,
      pqrrMilestone: this.targetItem.pqrrMilestone,
      substatusVolume: this.statusValue
    })
    .subscribe(data => {
      if(data['code'] == 1) {
        this.msgservice.showSuccess("Success");
        this.growLife = 5000;
        this.msgs = this.msgservice.msgs;
        this.targetDisable = true;
        this.subTargetDisplay = false;
        this.targetGridAjax();
      } else if(data['code'] == 2){
        this.msgservice.showInfo(data['businessData']);
        this.growLife = 300000;
        this.msgs = this.msgservice.msgs;
      } else {
        this.msgservice.showError(data['businessData']);
        this.growLife = 5000;
        this.msgs = this.msgservice.msgs;
      }
    })
  }

  public subTargetsaveChangeBtn() {
    this.service.post("/bpd-proj/bpd/programScorecardSubstatus/update",{
      subjectName: this.subSubjectValue,
      subtargetVolume: this.subTargetValue,
      indexId: this.targetItem.indexId,
      adProjectCode: this.targetItem.adProjectCode,
      pqrrMilestone: this.targetItem.pqrrMilestone,
      substatusVolume: this.statusValue,
      proposedVolume: this.subProposedTarget
    })
    .subscribe(data => {
      if(data['code'] == 1) {
        this.msgservice.showSuccess("Success");
        this.growLife = 5000;
        this.msgs = this.msgservice.msgs;
        this.targetDisable = true;
        this.subTargetDisplay = false;
        this.targetGridAjax();
      } else if(data['code'] == 2){
        this.msgservice.showInfo(data['businessData']);
        this.growLife = 300000;
        this.msgs = this.msgservice.msgs;
      } else {
        this.msgservice.showError(data['businessData']);
        this.growLife = 5000;
        this.msgs = this.msgservice.msgs;
      }
    })
  }

  public subTargetCancelBtn() {
    this.subTargetDisplay = false;
  }

  public targetItem: any = {};

  public targetSubItem: any = {};

  public readonlyStatus: boolean = false;

  public statusFlagDialog: boolean = false;

  public targetGridEditBtn(item,i) {
    this.targetSubItem = item;
    this.index = i;
    this.subTargetDisplay = true;
    this.isAdd = true;
    this.subSubjectValue = item.subjectName;
    this.subTargetValue = item.subtargetVolume;
    this.statusValue = item.substatusVolume ? item.substatusVolume : null;
    this.subProposedTarget = item.proposedVolume ? item.proposedVolume : null;
  }

  public targetGridDelBtn(item,i) {
    this.confirmationService.confirm({
      message: 'Do You Want To Delete This Record?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        this.service.post("/bpd-proj/bpd/programScorecardSubstatus/delete",{
          subjectName: item.subjectName,
          indexId: this.targetItem.indexId,
          adProjectCode: this.targetItem.adProjectCode,
          pqrrMilestone: this.targetItem.pqrrMilestone
        })
        .subscribe(data => {
          if(data['code'] == 1) {
            this.msgservice.showSuccess("Success");
            this.growLife = 5000;
            this.msgs = this.msgservice.msgs;
            this.targetDisable = true;
            this.subTargetDisplay = false;
            this.targetGridAjax();
          } else if(data['code'] == 2){
            this.msgservice.showInfo(data['businessData']);
            this.growLife = 300000;
            this.msgs = this.msgservice.msgs;
          } else {
            this.msgservice.showError(data['businessData']);
            this.growLife = 5000;
            this.msgs = this.msgservice.msgs;
          }
        })
      }
    });
  }

  public bfsStore: any = [];
  public clickStatus() {
    if(this.targetItem.scorecardType && this.targetItem.bfs) {
      this.service.post("/bpd-proj/bpd/programScorecardStatus/getVListOfBfs",{
        programCode: this.targetItem.programCode,
        bfs: this.targetItem.bfs
      })
      .subscribe(data => {
        this.bfsStore = [];
        for(let i = 0; i < data.length; i++) {
            data[i].id = i + 1;
        }
        if(data.length < 10) {
           for(let i = 0; i < 10; i++) {
                if(!data[i]) {
                    this.bfsStore.push({
                        "ip": i+1
                    })
                } else {
                    this.bfsStore.push(data[i])
                }
            } 
        } else {
            for(let i=0; i<data.length; i++) {
                this.bfsStore.push(data[i])
            }
        }
        this.statusFlagDialog = true;
      })
    }
  }

  public BFSProgramCode: string = "";
  public BFSLookClick() {
    this.service.post("/bpd-proj/bpd/programScorecardStatus/getVListOfBfs",{
        programCode: this.BFSProgramCode,
        bfs: this.targetItem.bfs
      })
      .subscribe(data => {
        this.bfsStore = [];
        for(let i = 0; i < data.length; i++) {
            data[i].id = i + 1;
        }
        if(data.length < 10) {
           for(let i = 0; i < 10; i++) {
                if(!data[i]) {
                    this.bfsStore.push({
                        "ip": i+1
                    })
                } else {
                    this.bfsStore.push(data[i])
                }
            } 
        } else {
            for(let i=0; i<data.length; i++) {
                this.bfsStore.push(data[i])
            }
        }
      })
  }

  public BFSEnterSearch($event) {
    if ($event.key === "Enter") {
      this.BFSLookClick();
    }
  }

  public bfsDbclick(e) {
    this.targetStatus = e.data.statusVolume;
    this.statusFlagDialog = false;
  }

  public targerSaveBtn() {
      if(this.targetItem.dataType == '3') {
        this.targetTarget = this.DateToString(this.targetTarget);
        this.targetStatus = this.DateToString(this.targetStatus);
      }
      let params: any = {
        indexId: this.targetItem.indexId,
        adProjectCode: this.targetItem.adProjectCode,
        pqrrMilestone: this.targetItem.pqrrMilestone, 
        owner: this.targetOwnerCode,
        targetVolume: this.targetGridStore.length ? "" : (typeof(this.targetTarget) == "number" || "string" ? this.targetTarget : ""),
        statusVolume: this.targetGridStore.length ? "" : (typeof(this.targetStatus) == "number" || "string" ? this.targetStatus : ""),
        statusDesc: this.targetMemo
      };
      this.service.post("/bpd-proj/bpd/programScorecardStatus/update",params)
      .subscribe(data => {
        if(data['code'] == 1) {
          this.msgservice.showSuccess("Success");
          this.growLife = 5000;
          this.msgs = this.msgservice.msgs;
          this.editSingleDisplay = false;
          this.service.post("/bpd-proj/bpd/programScorecardStatus/getVList",{
            adProjectCode: this.selectedStore.adProjectCode,
            pqrrMilestone: this.statusSelectedStore.pqrrMilestone
          })
          .subscribe(data => {
            this.scoreCardTargetStore = [];
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
          this.msgservice.showInfo(data['businessData']);
          this.growLife = 300000;
          this.msgs = this.msgservice.msgs;
        } else {
          this.msgservice.showError(data['businessData']);
          this.growLife = 5000;
          this.msgs = this.msgservice.msgs;
        }
      })

  }

  public targetCancelBtn() {
    this.editSingleDisplay = false;
  }

  public targetGridAjax() {
    this.service.post("/bpd-proj/bpd/programScorecardSubstatus/getVList",{
      "indexId": this.targetItem.indexId,
      "adProjectCode": this.targetItem.adProjectCode,
      "pqrrMilestone": this.targetItem.pqrrMilestone
    })
    .subscribe(data => {
      if(data.length) {
        this.targetGridStore = data;
        this.targetDisable = true;
      } else {
        this.targetGridStore = [];
        this.targetDisable = false;
        this.targetTarget = "";
        this.targetStatus = "";
      }
    })
  }

  public processTypeChange($event) {
    this.exectiveCommtteeFlag = $event.value === "Direct approval";
  }

  public DateToString(val) {
      let valStr = '';
      if(!val) {
         return valStr; 
      }
      if(val.toString().length > 19){
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

  public setProposedTargetDisplay:boolean = false;
  public setProposedPPRDate: any;
  public setProposedProposedTarget: string = null;
  public setProposedDescription: string = null;
  public isSonTarget: boolean = false;

  public setProposedTarget() {
    this.setProposedTargetDisplay = true;
    this.isSonTarget = false;
    this.setProposedPPRDate = this.statusSelectedStore.pprDate;
    this.setProposedProposedTarget = this.targetItem.proposedTarget;
    this.setProposedDescription = this.statusSelectedStore.description;
  }

  public setProposedsaveBtn() {
    this.service.post("/bpd-proj/bpd/programScorecard/update",{
      adProjectCode: this.statusSelectedStore.adProjectCode,
      pprDate: this.DateToString(this.setProposedPPRDate),
      pqrrMilestone: this.targetItem.pqrrMilestone
    })
    .subscribe(data => {
      if(data['code'] == 1) {
        this.service.post("/bpd-proj/bpd/scorecardChangelog/add",{
          adProjectCode: this.statusSelectedStore.adProjectCode,
          elementId: this.targetItem.pqrrMilestone,
          indexId: this.targetItem.indexId,
          changeFrom: this.targetItem.proposedTarget,
          changeTo: this.setProposedProposedTarget,
          description: this.setProposedDescription,
          subjectName: this.isSonTarget ? this.targetSubItem.subjectName : this.targetItem.indexName
        })
        .subscribe(data => {
          if(data['code'] == 1) {
            this.service.post("/bpd-proj/bpd/programScorecardStatus/update",{
              indexId: this.targetItem.indexId,
              adProjectCode: this.statusSelectedStore.adProjectCode,
              pqrrMilestone: this.targetItem.pqrrMilestone,
              proposedTarget: this.setProposedProposedTarget
            })
            .subscribe(data => {
              if(data['code'] == 1) {
                this.msgservice.showSuccess("Success");
                this.growLife = 5000;
                this.msgs = this.msgservice.msgs;
                this.setProposedTargetDisplay = false;
                if(this.isSonTarget) {
                  this.subProposedTarget = this.setProposedProposedTarget;
                } else {
                  this.proposedTarget = this.setProposedProposedTarget;
                }
              } else {
                this.msgservice.showInfo(data['businessData']);
                this.growLife = 300000;
                this.msgs = this.msgservice.msgs;
              }
            })
          } else {
            this.msgservice.showInfo(data['businessData']);
            this.growLife = 300000;
            this.msgs = this.msgservice.msgs;
          }
        })
      } else {
        this.msgservice.showInfo(data['businessData']);
        this.growLife = 300000;
        this.msgs = this.msgservice.msgs;
      }
    })
  }

  // 设置子目标期望
  public subProposedTarget: string = null;
  public setSubProposedTarget() {
    this.setProposedTargetDisplay = true;
    this.isSonTarget = true;
    this.setProposedPPRDate = this.statusSelectedStore.pprDate;
    this.setProposedProposedTarget = this.targetSubItem.proposedVolume;
    this.setProposedDescription = null;
  }

  // changeLog
  public changeLogDialog: boolean = false;
  public changeLogStore: any = [];
  public changeLogDataRows: any = '10';
  public changeLogDataFirst: any = 0;
  public changeLogDataLen: number;
  
  public changeLogPaginate(e) {
    this.service.post("/bpd-proj/bpd/scorecardChangelog/getList",{
      adProjectCode: this.statusSelectedStore.adProjectCode,
      "page": {
        "page": e.page + 1,
        "rows": e.rows
      }
    })
    .subscribe(data1 => {
      let data = data1.rows;
      this.changeLogDataLen = data1.total;
      this.changeLogDataRows = e.rows;
      this.changeLogDataFirst = e.first;
      this.changeLogStore = [];
      for(let i = 0; i < data.length; i++) {
          data[i].id = i + 1;
      }
      for(let i = 0; i < e.rows; i++) {
        if(!data[i]) {
          this.changeLogStore.push({
            "ip": i+1
          })
        } else {
          this.changeLogStore.push(data[i])
        }
      }
    })
  }

  public changeLogBtn() {
    let e = {page: 0, first: 0, rows: "10"};
    this.changeLogPaginate(e);
    this.changeLogDialog = true;
  }

  private getApproveLog(nodId: string = "") {
        let ids = this.selectedAdProjectCode + "," + this.selectedPqrrMilestone;
        this.service.get('/bpd-proj/bpd/node/getAllApprove?businessId=' + ids + "&wfType=scorecard")
            .subscribe(data => {
                for (let i = 0; i < data.length; i++) {
                    if (data[i].isAgree == 1) {
                        data[i].isAgree = "Agree";
                    } else if (data[i].isAgree == 2) {
                        data[i].isAgree = "Return";
                    }
                }
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
                this.approvingData = this.dataManageService.addEmptyTableData(data, 13);
            })
    }

    public setStatusDialog: boolean = false;
    public authorizeRadio: any;
    public changeColorItem: any = {};

    public changeColor(item) {
      if(item.dataType == "1" || item.dataType == "3") {
        this.changeColorItem = item;
        this.setStatusDialog = true;
        this.authorizeRadio = item.colorStatus;
      } else {
        this.msgservice.showInfo("Data Type Is Not Text!");
        this.growLife = 300000;
        this.msgs = this.msgservice.msgs;
      }
    }

    public setStatusSaveBtn() {
      this.service.post("/bpd-proj/bpd/programScorecardStatus/update",{
        indexId: this.changeColorItem.indexId,
        adProjectCode: this.changeColorItem.adProjectCode,
        pqrrMilestone: this.changeColorItem.pqrrMilestone,
        colorStatus: this.authorizeRadio
      })
      .subscribe(data => {
        if(data['code'] == 1) {
          this.msgservice.showSuccess("Success");
          this.growLife = 5000;
          this.msgs = this.msgservice.msgs;
          this.setStatusDialog = false;
          this.service.post("/bpd-proj/bpd/programScorecardStatus/getVList",{
            adProjectCode: this.selectedStore.adProjectCode,
            pqrrMilestone: this.statusSelectedStore.pqrrMilestone
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
          this.msgservice.showInfo(data['businessData']);
          this.growLife = 300000;
          this.msgs = this.msgservice.msgs;
        } else {
          this.msgservice.showError(data['businessData']);
          this.growLife = 5000;
          this.msgs = this.msgservice.msgs;
        }
      })
    }
};