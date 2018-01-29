import { Component, OnInit } from '@angular/core';
import 'style-loader!./scoreCard.scss';
import { SelectItem, TreeNode, MenuItem, ConfirmationService } from 'primeng/primeng';
import { HttpDataService } from '../../../service/http.service';
import { MessageService } from '../../../service/message.service';
import {
  DataManageService
} from '../../../service/dataManage.service';
import {
    RefreshMenuService
} from '../../../service/refreshMenu.service';
@Component({
  selector: 'score-card',
  templateUrl: './scoreCard.html',
  providers: [HttpDataService, MessageService, DataManageService, RefreshMenuService, ConfirmationService]
})
export class ScoreCard implements OnInit{

    public msgs: any;

    public growLife: number = 5000;

    public gridStore: any = [];

    public gridStoreLen: number;

    public gridStoreRows: any = '15';

    public gridStoreFirst: any = 0;

    public gridStorePage: any = 0;

    public selectedStoreItem: any = {};

    public addScoreCardTargetDisplay: boolean = false;

    public subjectValue: string = null;

    public typeValueStore: any = [
      {"label":"第一次董事会","value":1},
      {"label":"第二次董事会","value":2},
      {"label":"第三次董事会","value":3}
    ];

    public typeValue: any = 1;

    public yearValue: any = null;

    public scoreCardTargetStore: any = [];

    public scoreCardTargetStoreLen: number;

    public scoreCardTargetStoreRows: any = '10';

    public scoreCardTargetStoreFirst: any = 0;

    public scoreCardTargetStorePage: any = 0;

    public editSingleDisplay: boolean = false;

    public managerSearchDialog: boolean = false;

    public managerDialogDepartment: string = null;

    public managerDialogUserName: string = null;

    public managerData: any = [];

    public managerDataRows: any = '10';

    public managerDataFirst: any = 0;

    public managerDataLen: number;

    public unFreezeBtnStatus: boolean = false;

    public userRoot: boolean = true;

    public yearRange: string;

    public AssignStatus: boolean = false;

	constructor(private service: HttpDataService, private confirmationService: ConfirmationService, private msgservice: MessageService, private dataManageService: DataManageService, private refreshMenuService: RefreshMenuService) {
        // 刷新菜单默认选中项
        let flag = this.dataManageService.getUuId()
        this.refreshMenuService.refreshMenu(flag);
        // 日期年份设置
        let currentYear = new Date().getFullYear();
        this.yearRange = "" + (Number(currentYear) - 10) + ":" + (Number(currentYear) + 50);
	}
    
    ngOnInit() {
      if(!JSON.parse(window.localStorage.getItem("authorityData"))["Maintain ScoreCard"] || 
        JSON.parse(window.localStorage.getItem("authorityData"))["Maintain ScoreCard"] == 'false')
      {
        this.userRoot = false;
      }
      this.service.post("/bpd-proj/bpd/boardScorecard/getList",{
        "page": {
          "page": 1,
          "rows": 15
        }
      })
      .subscribe(data1 => {
        this.gridStoreAjax(data1);
      })
    }

    public gridStoreAjax(data1) {  // grid ajax
      this.gridStore = [];
      this.gridStoreLen = data1.total;
      let data = data1.rows;
      if(data.length) {
        for(let i = 0; i < data.length; i++) {
          data[i].id = i + 1;
          data[i].freezedStatusStr = data[i].freezedStatus == 0 ? "No notified" : "Notified";
          if(data[i].boardTime == 1) {
            data[i].boardType = "第一次董事会"
          } else if(data[i].boardTime == 2) {
            data[i].boardType = "第二次董事会"
          } else {
            data[i].boardType = "第三次董事会"
          }
        }
      }
      for(let i = 0; i < 15; i++) {
        if(!data[i]) {
          this.gridStore.push({
            "ip": i+1
          })
        } else {
          this.gridStore.push(data[i])
        }
      }
    }

    public gridPaginate(e) {
      console.log(e.page)
      this.service.post("/bpd-proj/bpd/boardScorecard/getList",{
        "page": {
          "page": Number(e.page) - (-1),
          "rows": e.rows
        }
      })
      .subscribe(data1 => {
        this.gridStore = [];
        this.gridStoreLen = data1.total;
        this.gridStoreRows = e.rows;
        this.gridStoreFirst = Number(e.first);
        this.gridStorePage = e.page;
        let data = data1.rows
        if(data.length) {
          for(let i = 0; i < data.length; i++) {
            data[i].id = i + 1;
            data[i].freezedStatusStr = data[i].freezedStatus == 0 ? "No notified" : "Notified";
            if(data[i].boardTime == 1) {
              data[i].boardType = "第一次董事会"
            } else if(data[i].boardTime == 2) {
              data[i].boardType = "第二次董事会"
            } else {
              data[i].boardType = "第三次董事会"
            }
          }
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

    public AssignBtn(item) {
      this.service.post("/bpd-proj/bpd/boardScorecard/addToProgramScorecard",{
        boardYear: item.boardYear,
        boardTime: item.boardTime,
        subjectName: item.subjectName
      })
      .subscribe(data => {
        if(data['code'] == 1) {
          this.service.post("/bpd-proj/bpd/boardScorecard/updateFreezed",{
            boardTime: item.boardTime,
            boardYear: item.boardYear,
            freezedStatus: 1
          })
          .subscribe(data => {
            if(data['code'] == 1) {
              this.msgservice.showSuccess("Success");
              this.growLife = 5000;
              this.msgs = this.msgservice.msgs;
              let e = {
                page: 0, 
                first: 0, 
                rows: "15", 
                pageCount: Math.ceil(this.gridStoreLen/this.gridStoreRows)
              }
              this.gridPaginate(e);
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

    // View Btn
    public scoreCardTasksDialog: boolean = false;
    public scoreCardTasksStore: any = [];
    public scoreCardTasksDataRows: any = '10';
    public scoreCardTasksDataFirst: any = 0;
    public scoreCardTasksDataLen: number;
    
    public scoreCardTasksPaginate(e) {
      this.service.post("/bpd-proj/bpd/programScorecard/getVList1",{
        "page": {
          "page": e.page + 1,
          "rows": e.rows
        },
        pqrrMilestoneName: this.selectedStoreItem.subjectName
      })
      .subscribe(data1 => {
        let data = data1.rows;
        this.scoreCardTasksDataLen = data1.total;
        this.scoreCardTasksDataRows = e.rows;
        this.scoreCardTasksDataFirst = e.first;
        this.scoreCardTasksStore = [];
        for(let i = 0; i < data.length; i++) {
            data[i].id = i + 1;
            data[i].freezedStatusStr = data[i].freezedStatus == 2 ? "Notified" : "Feedbacked";
        }
        for(let i = 0; i < e.rows; i++) {
          if(!data[i]) {
            this.scoreCardTasksStore.push({
              "ip": i+1
            })
          } else {
            this.scoreCardTasksStore.push(data[i])
          }
        }
      })
    }

    public viewBtn(item) {
      this.selectedStoreItem = item;
      let e = {page: 0, first: 0, rows: "10"};
      this.scoreCardTasksPaginate(e);
      this.scoreCardTasksDialog = true;
    }

    // viewstep2Btn 
    public viewStep2Item: any = {};
    public viewstep2Btn(item) {
      this.viewStep2Item = item;
      this.service.post("/bpd-proj/bpd/programScorecardStatus/getVList",{
        adProjectCode: item.adProjectCode,
        pqrrMilestone: item.pqrrMilestone
      })
      .subscribe(data => {
        if(data.length < 10) {
          let _length = 10-data.length;
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

    // viewStep3Btn 
    public viewStep3Item: any = {};
    public targetGridStore: any = [];
    public viewStep3Btn(item) {
      this.viewStep3Item = item;
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
        this.editSingleDisplay = true;
      })
    }

    public DateToString(val) {
      console.log(val)
      let valStr = '';
      if(!val) {
         return valStr; 
      }
      if(val.toString().length > 19){
          let year = val.getFullYear();
          let month = val.getMonth() + 1;
          let day = val.getDate();
          valStr = year + '-' + month + '-' + day;
      } else {
          valStr = val;
      }
      return valStr;
  }

    public isAdd: boolean = true;
    public subTargetDisplay: boolean = false;
    public addBtn() {
        this.isAdd = true;
        this.subTargetDisplay = true;
        this.meetingTime = "";
        this.typeValue = 1;
    }

    public meetingTime: any = "";
    public editBtn(item) {
      this.isAdd = false;
      this.typeValue = item.boardTime;
      this.subTargetDisplay = true;
    }

    public subTargetsaveBtn() {
      let subjectName: string = null;
      if(this.typeValue == 1) {
        subjectName = this.DateToString(this.meetingTime).split("-")[0]+"第一次董事会";
      } else if(this.typeValue == 2) {
        subjectName = this.DateToString(this.meetingTime).split("-")[0]+"第二次董事会";
      } else {
        subjectName = this.DateToString(this.meetingTime).split("-")[0]+"第三次董事会";
      }
      this.service.post("/bpd-proj/bpd/boardScorecard/insert",{
        boardTime: this.typeValue,
        boardYear: this.DateToString(this.meetingTime),
        subjectName: subjectName
      })
      .subscribe(data => {
        if(data['code'] == 1) {
          this.msgservice.showSuccess("Success");
          this.growLife = 5000;
          this.msgs = this.msgservice.msgs;
          let e = {
            page: 0, 
            first: 0, 
            rows: "15", 
            pageCount: Math.ceil(this.gridStoreLen/this.gridStoreRows)
          }
          this.gridPaginate(e);
          this.subTargetDisplay = false;
        } else if(data['code'] == 2){
          this.msgservice.showInfo(data['businessData']);
          this.growLife = 300000;
          this.msgs = this.msgservice.msgs;
        } else {
          this.msgservice.showError(data['businessData']);
          this.growLife = 300000;
          this.msgs = this.msgservice.msgs;
        }
      })
    }

    public subTargetsaveChangeBtn() {
      let subjectName: string = null;
      if(this.typeValue == 1) {
        subjectName = this.DateToString(this.meetingTime).split("-")[0]+"第一次董事会";
      } else if(this.typeValue == 2) {
        subjectName = this.DateToString(this.meetingTime).split("-")[0]+"第二次董事会";
      } else {
        subjectName = this.DateToString(this.meetingTime).split("-")[0]+"第三次董事会";
      }
      this.service.post("/bpd-proj/bpd/boardScorecard/update",{
        boardTime: this.typeValue,
        boardYear: this.DateToString(this.meetingTime),
        subjectName: subjectName
      })
      .subscribe(data => {
        if(data['code'] == 1) {
          this.msgservice.showSuccess("Success");
          this.growLife = 5000;
          this.msgs = this.msgservice.msgs;
          let e = {
            page: 0, 
            first: 0, 
            rows: "15", 
            pageCount: Math.ceil(this.gridStoreLen/this.gridStoreRows)
          }
          this.gridPaginate(e);
          this.subTargetDisplay = false;
        } else if(data['code'] == 2){
          this.msgservice.showInfo(data['businessData']);
          this.growLife = 300000;
          this.msgs = this.msgservice.msgs;
        } else {
          this.msgservice.showError(data['businessData']);
          this.growLife = 300000;
          this.msgs = this.msgservice.msgs;
        }
      })
    }

    public delBtn(item) {
      this.confirmationService.confirm({
        message: 'Do You Want To Delete This Record?',
        header: 'Delete Confirmation',
        icon: 'fa fa-trash',
        accept: () => {
          this.service.post("/bpd-proj/bpd/boardScorecard/delete",{
            subjectName: item.subjectName
          })
          .subscribe(data => {
            if(data['code'] == 1) {
              this.msgservice.showSuccess("Success");
              this.growLife = 5000;
              this.msgs = this.msgservice.msgs;
              let e = {
                page: 0, 
                first: 0, 
                rows: "15", 
                pageCount: Math.ceil(this.gridStoreLen/this.gridStoreRows)
              }
              this.gridPaginate(e);
            } else if(data['code'] == 2){
              this.msgservice.showInfo(data['businessData']);
              this.growLife = 300000;
              this.msgs = this.msgservice.msgs;
            } else {
              this.msgservice.showError(data['businessData']);
              this.growLife = 300000;
              this.msgs = this.msgservice.msgs;
            }
          })
        }
      });
    }
};