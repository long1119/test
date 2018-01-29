import { Component, OnInit } from '@angular/core';
import 'style-loader!./projectScorecard.scss';
import { SelectItem, TreeNode, MenuItem } from 'primeng/primeng';
import { HttpDataService } from '../../../service/http.service';
import { MessageService } from '../../../service/message.service';

@Component({
  selector: 'project-scorecard',
  templateUrl: './projectScorecard.html',
  providers: [HttpDataService, MessageService]
})
export class ProjectScorecard implements OnInit{

    public msgs: any;

    public lookUpDisplay: boolean = false;

    public gridStore: any = [];

    public gridStoreLen: number;

    public gridStoreRows: any = '15';

    public gridStoreFirst: any = 0;

    public gridStorePage: any = 0;

    public programStore: any = [];

    public programStoreLen: number;

    public programStoreRows: any = '10';

    public programStoreFirst: any = 0;

    public programStorePage: any = 0;

    public programSelectedStore: any = [];

    public programCodeSearch: string = null;

    public userRoot: boolean = true;

    public yearRange: string;

    public ProgramSearchTitle: string = "Program Info";


	constructor(private service: HttpDataService, private msgservice: MessageService) {
        // 日期年份设置
        let currentYear = new Date().getFullYear();
        this.yearRange = "" + (Number(currentYear) - 10) + ":" + (Number(currentYear) + 50);
	}
    
    ngOnInit() {
      if(!JSON.parse(window.localStorage.getItem("authorityData"))["Maintain Project Scorecard"] || 
        JSON.parse(window.localStorage.getItem("authorityData"))["Maintain Project Scorecard"] == 'false')
      {
        this.userRoot = false;
      }
      this.service.post("/bpd-proj/bpd/vehicleProject/getVListScoreCard",{
        'programCode': this.programCodeSearch,
        'categoryType': '2'
      })
      .subscribe(data => {
        this.programStoreAjax(data);
      })
    }

    public programGridRowClick(e) {
      if(e.data.id) {
        this.service.post("/bpd-proj/bpd/programScorecard/getVList",{
          "page": {
            "page": 1,
            "rows": 15
          },
          adProjectCode: e.data.adProjectCode,
          scorecardType: '2'
        })
        .subscribe(data1 => {
          this.gridStore = [];
          let data = data1.rows;
          this.gridStoreLen = data1.total;
          for(let i = 0; i < data.length; i++) {
            data[i].id = i + 1;
          }
          for(let i = 0; i < 15; i++) {
            if(!data[i]) {
              this.gridStore.push({
                'ip': i
              })
            } else {
              this.gridStore.push(data[i])
            }
          }
        })
      } else {
        this.gridStore = [];
        for(let i = 0; i < 15; i++) {
            this.gridStore.push({
              'ip': i
          })
        }
      }
    }

    public programStoreAjax(data) {  // grid ajax
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
        this.programStore = data;
      } else {
        for(let i=0; i<data.length; i++) {
          data[i].id = i+1;
        }
        this.programStore = data;
      }
      if(data[0].id) {
        this.programSelectedStore = data[0];
        this.service.post("/bpd-proj/bpd/programScorecard/getVList",{
          "page": {
            "page": 1,
            "rows": 15
          },
          adProjectCode: this.programSelectedStore.adProjectCode,
          scorecardType: '2'
        })
        .subscribe(data1 => {
          this.gridStore = [];
          let data = data1.rows;
          this.gridStoreLen = data1.total;
          for(let i = 0; i < data.length; i++) {
            data[i].id = i + 1;
          }
          for(let i = 0; i < 15; i++) {
            if(!data[i]) {
              this.gridStore.push({
                'ip': i
              })
            } else {
              this.gridStore.push(data[i])
            }
          }
        })
      } else {
        for(let i = 0; i < 15; i++) {
            this.gridStore.push({
              'ip': i
          })
        }
      }
    }

    public gridPaginate(e) {
      this.service.post("/bpd-proj/bpd/programScorecard/getVList",{
        "page": {
          "page": e.page + 1,
          "rows": e.rows
        },
        adProjectCode: this.programSelectedStore.adProjectCode,
        scorecardType: '2'
      })
      .subscribe(data1 => {
        let data = data1.rows;
        this.gridStoreLen = data1.total;
        this.gridStoreRows = e.rows;
        this.gridStoreFirst = e.first;
        this.gridStore = [];
        for(let i = 0; i < data.length; i++) {
            data[i].id = i + 1;
        }
        for(let i = 0; i < e.rows; i++) {
          if(!data[i]) {
            this.gridStore.push({
              "ip": i+1
            })
          } else {
            this.gridStore.push(data[i])
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
          'categoryType': '2'
        })
        .subscribe(data => {
          this.programStoreAjax(data);
        })
      } else {
        this.service.post("/bpd-proj/bpd/vehicleProject/getVListScoreCard",{
          'programCode': this.programCodeSearch,
          'categoryType': '2',
          'flag': '1'
        })
        .subscribe(data => {
          this.programStoreAjax(data);
        })
      }
      this.lookUpDisplay = false;
    }

    public changeProgram() {
      if(this.normalProgram) {
        this.service.post("/bpd-proj/bpd/vehicleProject/getVListScoreCard",{
          'programCode': this.programCodeSearch,
          'categoryType': '2',
          'flag': '1'
        })
        .subscribe(data => {
          this.programStoreAjax(data);
          this.normalProgram = false;
          this.ProgramSearchTitle = "Program Archived";
        })
      } else {
        this.service.post("/bpd-proj/bpd/vehicleProject/getVListScoreCard",{
          'programCode': this.programCodeSearch,
          'categoryType': '2'
        })
        .subscribe(data => {
          this.programStoreAjax(data);
          this.normalProgram = true;
          this.ProgramSearchTitle = "Program Info";
        })
      }
    }

    public lookUpCancelBtn() {   //  模糊查询取消按钮
        this.lookUpDisplay = false;
    }

    //  冻结解冻

    public unFreezeBtn(item) {
      this.service.post("/bpd-proj/bpd/programScorecard/update",{
        freezedStatus: 1,
        adProjectCode: item.adProjectCode,
        pqrrMilestone: item.pqrrMilestone
      })
      .subscribe(data => {
        if(data['code'] == 1) {
          this.msgservice.showSuccess("Success");
          this.msgs = this.msgservice.msgs;
          let e = {
            page: 0, 
            first: 0, 
            rows: "15", 
            pageCount: Math.ceil(this.gridStoreLen/15)
          }
          this.gridPaginate(e);
        } else {
          this.msgservice.showInfo(data['businessData']);
          this.msgs = this.msgservice.msgs;
        }
      })
    }

    public freezeBtn(item) {
      this.service.post("/bpd-proj/bpd/programScorecard/update",{
        freezedStatus: 0,
        adProjectCode: item.adProjectCode,
        pqrrMilestone: item.pqrrMilestone
      })
      .subscribe(data => {
        if(data['code'] == 1) {
          this.msgservice.showSuccess("Success");
          this.msgs = this.msgservice.msgs;
          let e = {
            page: 0, 
            first: 0, 
            rows: "15", 
            pageCount: Math.ceil(this.gridStoreLen/15)
          }
          this.gridPaginate(e);
        } else {
          this.msgservice.showInfo(data['businessData']);
          this.msgs = this.msgservice.msgs;
        }
      })
    }


    //   详情

    public statusDisplay: boolean = false;

    public preStatusStore: any = [];

    public preStatus: string = null;

    public curStatusStore: any = [];

    public curStatus: string = null;

    public statusStore: any = [{id:'-'},{id:'-'},{id:'-'},{id:'-'},{id:'-'},{id:'-'},{id:'-'},{id:'-'},{id:'-'},{id:'-'}];

    public title1: string = null;

    public title2: string = null;

    public authorizeRadio: any;

    public setStatusDialog: boolean = false;

    public changeStatusItem: any = {};

    public statusFuck: boolean = false;

    public changeStatus(item,status) {
      if(item.freezedStatus == 2) {
        this.msgservice.showInfo("This Metrics Is Freezed!");
        this.msgs = this.msgservice.msgs;
        return;
      }
      if(item.dataType == 2 || item.dataType == 4) {
        this.msgservice.showInfo("This Metrics Is Type Of Number!");
        this.msgs = this.msgservice.msgs;
        return;
      }
      this.statusFuck = status;
      this.setStatusDialog = true;
      this.authorizeRadio = status ? item.statusOfMilestone1 : item.statusOfMilestone2;
      this.changeStatusItem = item;
    }

    public setSuggestionDisplay: boolean = false;
    public suggestion: string = "";

    public setMemo(item) {
      if(item.freezedStatus == 2) {
        this.msgservice.showInfo("This Metrics Is Freezed!");
        this.msgs = this.msgservice.msgs;
        return;
      }
      this.changeStatusItem = item;
      this.setSuggestionDisplay = true;
      this.suggestion = item.statusDesc ? item.statusDesc : "";
    }

    public setSuggestionSaveBtn() {
      this.service.post("/bpd-proj/bpd/programScorecardStatus/update",{
        pqrrMilestone: this.curStatus,
        adProjectCode: this.programSelectedStore.adProjectCode,
        indexId: this.changeStatusItem.indexId,
        statusDesc: this.suggestion,
      })
      .subscribe(data => {
        if(data['code'] == 1) {
          this.msgservice.showSuccess("Success");
          this.msgs = this.msgservice.msgs;
          this.setSuggestionDisplay = false;
          this.refreshBtn();
        } else {
          this.msgservice.showError(data['businessData']);
          this.msgs = this.msgservice.msgs;
        }
      })
    }

    public setStatusSaveBtn() {
      this.service.post("/bpd-proj/bpd/programScorecardStatus/update",{
        adProjectCode: this.programSelectedStore.adProjectCode,
        indexId: this.changeStatusItem.indexId,
        pqrrMilestone: this.curStatus,
        colorStatus: this.authorizeRadio
      })
      .subscribe(data => {
        if(data['code'] == 1) {
          this.msgservice.showSuccess("Success");
          this.msgs = this.msgservice.msgs;
          this.setStatusDialog = false;
          this.refreshBtn();
        } else {
          this.msgservice.showError(data['businessData']);
          this.msgs = this.msgservice.msgs;
        }
      })
    }

    public toDetailBtn(item) {
      console.log(item)
      this.statusDisplay = true;
      this.statusStore = [{id:'-'},{id:'-'},{id:'-'},{id:'-'},{id:'-'},{id:'-'},{id:'-'},{id:'-'},{id:'-'},{id:'-'}];
      this.service.get("/bpd-proj/bpd/programScorecard/getList1?adProjectCode="+this.programSelectedStore.adProjectCode+"&type=0")
      .subscribe(data => {
        this.preStatusStore = [];
        this.curStatusStore = [];
        if(data.length) {
          this.preStatusStore = data;
          this.curStatusStore = data;
          this.preStatus = this.preStatusStore[0].value;
          this.curStatus = this.curStatusStore[0].value;
          this.title1 = this.preStatusStore[0].label;
          this.title2 = this.curStatusStore[0].label;
        }
      })
    }

    public preStatusChange(e) {
      this.title1 = e.originalEvent.target.innerText;
    }

    public curStatusChange(e) {
      this.title2 = e.originalEvent.target.innerText;
    }

    public title: string = "Committed final Target";
    public refreshBtn() {
      if(this.preStatus == "10065") {
        this.title = "DSI Target";
      } else if(this.preStatus == "10068") {
        this.title = "VPI Target";
      } else {
        this.title = "CSO Target";
      }
      this.service.post("/bpd-proj/bpd/programScorecardStatus/getVProgramScorecardStatus",{
        valueOfMilestone1: this.preStatus,
        valueOfMilestone2: this.curStatus,
        adProjectCode: this.programSelectedStore.adProjectCode
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
          this.statusStore = data;
        } else {
          for(let i=0; i<data.length; i++) {
            data[i].id = i+1;
          }
          this.statusStore = data;
        }
      })
    }

    public exportBtn() {
      let token = window.sessionStorage.getItem("access_token");
      let url: string = "/bpd-proj/bpd/programScorecardStatus/exportExcel" + '?valueOfMilestone1=' + this.preStatus + '&valueOfMilestone2=' + this.curStatus + '&adProjectCode=' + this.programSelectedStore.adProjectCode + '&' + Number(new Date());
      if (token) {
          let realToken = token.substr(1, token.length - 2)
          url = url + "&accessToken=" + realToken;
      }
      window.location.href = url;
    }

    public addIssueBtn() {
      this.addIssueDisplay = true;
      this.issueValue = null;
      this.issueValue = null;
      this.issueDate = null;
      this.actionValue = null;
      this.ownerValue = null;
      this.ownerCodeValue = null;
      this.closeDate = null;
      this.forumValue = null;
    }

    //  Add Issue

    public addIssueDisplay: boolean = false;

    public issueValue: string = null;

    public issueDate: any = null;

    public actionValue: string = null;

    public ownerValue: string = null;

    public ownerCodeValue: string = null;

    public closeDate: any = null;

    public forumValue: string = null;

    public addIssueSaveBtn() {
      let params:any  = {
        issueValue: this.issueValue,
        issueDate: this.dateFormat(this.issueDate),
        actionValue: this.actionValue,
        ownerCodeValue: this.ownerCodeValue,
        closeDate: this.dateFormat(this.closeDate),
        forumValue: this.forumValue
      }
      this.service.post("/",params)
      .subscribe(data => {
        if(data['code'] == 1) {
          this.msgservice.showSuccess("Success");
          this.msgs = this.msgservice.msgs;
          this.addIssueDisplay = false;
        } else if(data['code'] == 2){
          this.msgservice.showInfo(data['businessData']);
          this.msgs = this.msgservice.msgs;
        } else {
          this.msgservice.showError(data['businessData']);
          this.msgs = this.msgservice.msgs;
        }
      })
    }

    public addIssueCancelBtn() {
      this.addIssueDisplay = false;
    }

    public dateFormat(value:any): any {
      if(value) {
        if(value.toString().length > 10) {
        let valueStr = '';
        let year = value.getFullYear();
        let month = value.getMonth() + 1;
        let day = value.getDate();
        valueStr = year + '-' + month + '-' + day;
        return valueStr;
        } else {
          return value;
        }
      } else {
        return null;
      }
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
    this.managerDialogDepartment = null;
    this.managerDialogUserName = null;
    this.managerSearchDialog = true;
    this.service.post("/bpd-proj/bpd/user/getVList", {
      "page": {
        "page": 1,
        "rows": 10
      },
      "departmentName" : this.managerDialogDepartment,
      "userName": this.managerDialogUserName
    })
    .subscribe(data1 => {
      let data = data1.rows;
      this.managerDataLen = data1.total;
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
    this.service.post("/bpd-proj/bpd/user/getVList",{
      "page": {
        "page": e.page + 1,
        "rows": e.rows
      },
      "departmentName" : this.managerDialogDepartment,
      "userName": this.managerDialogUserName
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
      this.lookClick();
    }
  }

  public lookClick() {
    let e = {page: 0, first: 0, rows: "10"};
      this.managerPaginate(e);
  }

  public managerDbclick(e) {
    this.ownerCodeValue = e.data.userCode;
    this.ownerValue = e.data.userName;
    this.managerSearchDialog = false;
    this.managerDialogDepartment = null;
    this.managerDialogUserName = null;
  }

};