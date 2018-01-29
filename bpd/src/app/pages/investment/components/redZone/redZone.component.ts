import { Component, OnInit } from '@angular/core';
import 'style-loader!./redZone.scss';
import { SelectItem, TreeNode, MenuItem, ConfirmationService } from 'primeng/primeng';
import { HttpDataService } from '../../../service/http.service';
import { MessageService } from '../../../service/message.service';
// import { window } from 'rxjs/operator/window';

import * as $ from 'jquery';

@Component({
  selector: 'red-zone',
  templateUrl: './redZone.html',
  providers: [HttpDataService, MessageService, ConfirmationService]
})
export class RedZone implements OnInit{

    public msgs: any;

    public gridStore: any = [];

    public gridStoreLen: number;

    public gridStoreRows: any = '10';

    public gridStoreFirst: any = 0;

    public targetStore: any = [];

    public targetStoreLen: number;

    public targetStoreRows: any = '10';

    public targetStoreFirst: any = 0;

    public targetStorePage: any = 0;

    public targetSelectedStore: any = [];

    public targetSonStore: any = [];

    public targetSonStoreLen: number;

    public targetSonStoreRows: any = '10';

    public targetSonStoreFirst: any = 0;

    public targetSonStorePage: any = 0;

    public showTargetSon: boolean = false;

    public programDisplay: boolean = false;

    public programStore: any = [];

    public programStoreLen: number;

    public programStoreRows: any = '10';

    public programStoreFirst: any = 0;

    public programStorePage: any = 0;

    public programSerchStore: any = [];

    public programSerch: string = null;

    public programSelectedStore: any = [];

    public selectSonTarget: any = [];

    public userDisplay: boolean = false;

    public departmentSearch: string = null;

    public userNameSearch: string = null;

    public userStore: any = [];

    public userStoreLen: number;

    public userStoreRows: any = '10';

    public userStoreFirst: any = 0;

    public userStorePage: any = 0;

    public addTargetDisplay: boolean = false;

    public addTargetSubject: string = 'RedZone Target 2017';

    public addTargetYearStore: any = [];

    public addTargetYear: string = '2017';

    public editTargetSonDisplay: boolean = false;

    public groupStore: any = [{"label":"Compact","value":"Compact"},{"label":"Mid&Luxury","value":"Mid&Luxury"},{"label":"Local","value":"Local"},{"label":"GEM","value":"GEM"}];

    public groupValue: string = "Compact";

    public targetValue: string = null;

    public mdTargetValue: string = null;

    public projectsNameValue: string = null;

    public programsValue: string = null;

    public selectProgramStore: any = [];

    public programsTargetValue: string = null;

    public normalJump: boolean = true;

    public normal: boolean = true;

    public brandSerchStore: any = [{'label':'All','value':null}];

    public brandSerch: string = null;

    public programCodeSearch: string = "";

    public platformSerchStore: any = [{'label':'All','value':null}];

    public platformSerch: string = null;

    public userRoot: boolean = true;

    public projectCodeSearch: string = "";

    public growLife: number = 5000;


	constructor(private service: HttpDataService, private confirmationService: ConfirmationService, private msgservice: MessageService) {

	}
    
    ngOnInit() {
      for(let i = new Date().getFullYear()-10; i < new Date().getFullYear()+11; i++) {
        this.addTargetYearStore.push({
          value: i,
          label: i
        })
      }
      if(!JSON.parse(window.localStorage.getItem("authorityData"))["Set Redzone Target"] || 
        JSON.parse(window.localStorage.getItem("authorityData"))["Set Redzone Target"] == 'false')
      {
        this.userRoot = false;
      }
      this.service.post("/bpd-proj/bpd/crdnTarget/getSubjects",{
        "page": {
          "page": 1,
          "rows": 10
        }
      })
      .subscribe(data1 => {
        this.targetStoreAjax(data1);
      })
    }

    public targetStoreAjax(data1) {  // target ajax
      this.targetStore = [];
      this.targetStoreLen = data1.total;
      let data = data1.rows
      for(let i = 0; i < data.length; i++) {
        data[i].id = i + 1;
      }
      for(let i = 0; i < 10; i++) {
        if(!data[i]) {
          this.targetStore.push({
            "ip": i+1
          })
        } else {
          this.targetStore.push(data[i])
        }
      }
      if(data.length) {
        this.targetSelectedStore = data[0];
        this.showTargetSon = true;
        this.service.post("/bpd-proj/bpd/crdnTarget/getCrdnTargets",{
          "page": {
            "page": 1,
            "rows": 10
          },
          "subject": this.targetSelectedStore.subject,
          "crdnTargetYear": this.targetSelectedStore.crdnTargetYear,
          "lastUpdateDate": this.targetSelectedStore.lastUpdateDate,
          "lastUpdateUser": this.targetSelectedStore.lastUpdateUser,
        })
        .subscribe(data1 => {
          this.targetSonStoreAjax(data1);
        })
      }
    }

    public targetPaginate(e) {
      this.service.post("/bpd-proj/bpd/crdnTarget/getSubjects",{
        "page": {
          "page": Number(e.page) - (-1),
          "rows": e.rows
        }
      })
      .subscribe(data1 => {
        this.targetStore = [];
        this.targetStoreLen = data1.total;
        this.targetStoreRows = e.rows;
        this.targetStoreFirst = Number(e.first);
        this.targetStorePage = e.page;
        let data = data1.rows
        for(let i = 0; i < data.length; i++) {
          data[i].id = i + 1;
        }
        for(let i = 0; i < e.rows; i++) {
          if(!data[i]) {
            this.targetStore.push({
              "ip": i+1
            })
          } else {
            this.targetStore.push(data[i])
          }
        }
        if(data.length) {
          this.targetSelectedStore = data[0];
          this.showTargetSon = true;
          this.service.post("/bpd-proj/bpd/crdnTarget/getCrdnTargets",{
            "page": {
              "page": 1,
              "rows": 10
            },
            "subject": this.targetSelectedStore.subject,
            "crdnTargetYear": this.targetSelectedStore.crdnTargetYear,
            "lastUpdateDate": this.targetSelectedStore.lastUpdateDate,
            "lastUpdateUser": this.targetSelectedStore.lastUpdateUser,
          })
          .subscribe(data1 => {
            this.targetSonStoreAjax(data1);
          })
        } else {
          this.showTargetSon = false;
        }
      })
    }

    public MDIndex: number = 0;
    public YearIndex: number = 0;
    public targetSonStoreAjax(data1) {  // targetSon ajax
      this.showTargetSon = true;
      // this.targetSonStore = [];
      this.targetSonStoreLen = data1.total;
      let data = data1.rows
      for(let i = 0; i < data.length; i++) {
        data[i].id = i + 1;
        data[i].groupTargetStr = data[i].groupTarget + '%';
        data[i].mdTargetStr = data[i].mdTarget + '%';
        data[i].projectsTargetStr = data[i].projectsTarget + '%';
        data[i].projectsStr = data[i].projectsName + "(" + data[i].projects + ")";
        // this.targetSonStore.push(data[i]);
      }
      this.MDIndex = Math.floor(data.length/2);

      this.targetSonStore = data.sort(this.compare('crdnTargetGroup'));
      this.step1GroupArr = [];
      for(let i=0; i<this.targetSonStore.length; i++) {
        this.step1GroupArr.push(this.targetSonStore[i].crdnTargetGroup)
      }
    }

    public targetSonPaginate(e) {
      this.service.post("/bpd-proj/bpd/crdnTarget/getCrdnTargets",{
        "page": {
          "page": e.page + 1,
          "rows": e.rows
        },
        "subject": this.targetSelectedStore.subject,
        "crdnTargetYear": this.targetSelectedStore.crdnTargetYear,
        "lastUpdateDate": this.targetSelectedStore.lastUpdateDate,
        "lastUpdateUser": this.targetSelectedStore.lastUpdateUse
      })
      .subscribe(data1 => {
        this.showTargetSon = true;
        // this.targetSonStore = [];
        this.targetSonStoreLen = data1.total;
        this.targetSonStoreRows = e.rows;
        this.targetSonStoreFirst = e.first;
        let data = data1.rows
        for(let i = 0; i < data.length; i++) {
          data[i].id = i + 1;
          data[i].groupTargetStr = data[i].groupTarget + '%';
          data[i].mdTargetStr = data[i].mdTarget + '%';
          data[i].projectsTargetStr = data[i].projectsTarget + '%';
          data[i].projectsStr = data[i].projectsName + "(" + data[i].projects + ")";
          // this.targetSonStore.push(data[i]);
        }
        this.MDIndex = Math.floor(data.length/2);

        this.targetSonStore = data.sort(this.compare('crdnTargetGroup'));
        this.step1GroupArr = [];
        for(let i=0; i<this.targetSonStore.length; i++) {
          this.step1GroupArr.push(this.targetSonStore[i].crdnTargetGroup)
        }
      })
    }

    public targetGridRowClick(e) {
      this.targetSelectedStore = e.data;
      if(e.data.id) {
        this.service.post("/bpd-proj/bpd/crdnTarget/getCrdnTargets",{
          "page": {
            "page": 1,
            "rows": 10
          },
          "subject": this.targetSelectedStore.subject,
          "crdnTargetYear": this.targetSelectedStore.crdnTargetYear,
          "lastUpdateDate": this.targetSelectedStore.lastUpdateDate,
          "lastUpdateUser": this.targetSelectedStore.lastUpdateUser,
        })
        .subscribe(data1 => {
          this.targetSonStoreAjax(data1);
        })
      } else {
        this.targetSelectedStore = [];
        this.targetSonStore = [];
        this.showTargetSon = false;
      }
    }

    public vldArr: any = [];

    public targetToProjectBtn(item) {
      this.selectSonTarget = item;
      this.normalJump = true;
      let e = {page: 0, first: 0, rows: "10"};
      this.programPaginate(e)
    }

    public programStoreAjax(data1) {  // program ajax
      this.programStore = [];
      this.programStoreLen = data1.total;
      let data = data1.rows
      for(let i = 0; i < data.length; i++) {
        data[i].id = i + 1;
      }
      for(let i = 0; i < 10; i++) {
        if(!data[i]) {
          this.programStore.push({
            "ip": i+1
          })
        } else {
          this.programStore.push(data[i])
        }
      }
    }

    public programPaginate(e) {
      this.service.post("/bpd-proj/bpd/crdnTarget/getListOfPlatformAndBrand",{
        "programId": "more"
      })
      .subscribe(data => {
        this.brandSerchStore = [{'label':'All','value':null}];
        for(let i=0; i<data.brand.length; i++) {
          this.brandSerchStore.push({
            "label": data.brand[i],
            "value": data.brand[i]
          })
        }
        // this.brandSerch = this.brandSerchStore[0].value;
        this.platformSerchStore = [{'label':'All','value':null}];
        for(let i=0; i<data.platform.length; i++) {
          this.platformSerchStore.push({
            "label": data.platform[i],
            "value": data.platform[i]
          })
        }
        // this.platformSerch = this.platformSerchStore[0].value;
      })
      let ids: any = [];
      for(let i=0; i<this.targetSonStore.length; i++) {
        ids = ids.concat(this.targetSonStore[i].projects.split(","))
      }
      for(let i=0; i<this.selectProgramStore.length; i++) {
        if(ids.indexOf(this.selectProgramStore[i].programCode) == -1) {
          ids.push(this.selectProgramStore[i].programCode);
          var vld = this.selectProgramStore[i].vld;
        }
      }
      this.service.post("/bpd-proj/bpd/crdnTarget/getTargetProgram",{
        "page": {
          "page": Number(e.page) - (-1),
          "rows": e.rows
        },
        "brandName": this.brandSerch,
        "modelPlatform": this.platformSerch,
        "programCode": this.projectCodeSearch,
        "ids": ids
        // "vld": vld
      })
      .subscribe(data1 => {
        this.programStore = [];
        this.programStoreLen = data1.total;
        this.programStoreRows = e.rows;
        this.programStoreFirst = Number(e.first);
        this.programStorePage = e.page;
        let data = data1.rows
        for(let i = 0; i < data.length; i++) {
          data[i].id = i + 1;
        }
        for(let i = 0; i < e.rows; i++) {
          if(!data[i]) {
            this.programStore.push({
              "ip": i+1
            })
          } else {
            this.programStore.push(data[i])
          }
        }
        this.programDisplay = true;
      })
    }

    public programLookUpBtn() {
      let e = {page: 0, first: 0, rows: "10"};
      this.programPaginate(e);
    }

    public programDbclick(event) {
      console.log(this.vldArr)
      if(this.vldArr.length) {
        if(this.vldArr.indexOf(event.data.vld) == -1) {
          this.growLife = 300000;
          this.msgservice.showInfo("VLD Unvilable");
          this.msgs = this.msgservice.msgs;
          return;
        }
      }
      this.vldArr.push(event.data.vld);
      this.selectProgramStore.push({
        programCode: event.data.programCode,
        vld: event.data.vld
      })
      let projects: any = [];
      for(let i=0; i<this.selectProgramStore.length; i++) {
        projects.push(this.selectProgramStore[i].programCode)
      }
      if(this.normalJump) {
        this.service.post("/bpd-proj/bpd/crdnTarget/updateCrdnTarget",{
          "projects": projects.join(","),
          "vld": this.selectProgramStore[this.selectProgramStore.length-1].userCode,
          "crdnTargetId": this.selectSonTarget.crdnTargetId,
          "subject": this.targetSelectedStore.subject,
          "crdnTargetYear": this.targetSelectedStore.crdnTargetYear,
          "lastUpdateDate": new Date().getFullYear() + '-' + (new Date().getMonth() - (-1)) + '-' + new Date().getDate()
        })
        .subscribe(data => {
          if(data['code'] == 1) {
            let e = {page: Number(this.targetSonStorePage), first: Number(this.targetSonStoreFirst), rows: this.targetSonStoreRows};
            this.targetSonPaginate(e);
            this.growLife = 5000;
            this.msgservice.showSuccess("Success");
            this.msgs = this.msgservice.msgs;
            this.programDisplay = false;
          } else {
            this.growLife = 300000;
            this.msgservice.showError("Operation Error!");
            this.msgs = this.msgservice.msgs;
          }
        })
      } else {
        this.programsValue = event.data.programCode;
        this.programDisplay = false;
      }
    }

    public delProgram(items) {
      this.confirmationService.confirm({
        message: 'Do You Want To Delete This Record?',
        header: 'Delete Confirmation',
        icon: 'fa fa-trash',
        accept: () => {
          this.selectProgramStore.splice(this.selectProgramStore.indexOf(items),1);
          this.vldArr.splice(this.selectProgramStore.indexOf(items.vld),1)
        }
      });
    }

    public targetToVldBtn(item) {
      console.log(item)
      this.selectSonTarget = item;
      let observable = this.service.post("/bpd-proj/bpd/crdnTarget/getVUsers", {
          "page": {
            "page": 1,
            "rows": 10
          },
            "departmentName": this.departmentSearch,
            "userName": this.userNameSearch,
            "programCodes": item.projects.split(",")
        })
        .subscribe(data1 => {
          this.userStoreAjax(data1);
          this.userDisplay = true;
      });
    }

    public userStoreAjax(data1) {  // user ajax
      this.userStore = [];
      this.userStoreLen = data1.total;
      let data = data1.rows
      for(let i = 0; i < data.length; i++) {
        data[i].id = i + 1;
      }
      for(let i = 0; i < 10; i++) {
        if(!data[i]) {
          this.userStore.push({
            "ip": i+1
          })
        } else {
          this.userStore.push(data[i])
        }
      }
    }

    public userPaginate(e) {
      console.log(e.page)
      this.service.post("/bpd-proj/bpd/crdnTarget/getVUsers",{
        "page": {
          "page": Number(e.page) - (-1),
          "rows": e.rows
        },
        "departmentName": this.departmentSearch,
        "userName": this.userNameSearch,
        "programCodes": this.selectSonTarget.projects.split(",")
      })
      .subscribe(data1 => {
        this.userStore = [];
        this.userStoreLen = data1.total;
        this.userStoreRows = e.rows;
        this.userStoreFirst = Number(e.first);
        this.userStorePage = e.page;
        let data = data1.rows
        for(let i = 0; i < data.length; i++) {
          data[i].id = i + 1;
        }
        for(let i = 0; i < e.rows; i++) {
          if(!data[i]) {
            this.userStore.push({
              "ip": i+1
            })
          } else {
            this.userStore.push(data[i])
          }
        }
      })
    }

    public userEnterSearch($event) {
      if ($event.key === "Enter") {
        this.userLookUpBtn();
      }
    }
    
    public userLookUpBtn() {
      let e = {page: 0, first: 0, rows: "10"};
      this.userPaginate(e);
    }

    public userDbclick(e) {
      console.log(e.data)
      this.service.post("/bpd-proj/bpd/crdnTarget/updateCrdnTarget",{
        "vld": e.data.userCode,
        "crdnTargetId": this.selectSonTarget.crdnTargetId,
        "subject": this.addTargetSubject,
        "crdnTargetYear": this.addTargetYear,
        "lastUpdateDate": new Date().getFullYear() + '-' + (new Date().getMonth() - (-1)) + '-' + new Date().getDate()
      })
      .subscribe(data => {
        console.log(data)
        if(data['code'] == 1) {
          let e = {page: Number(this.targetSonStorePage), first: Number(this.targetSonStoreFirst), rows: this.targetSonStoreRows};
          this.targetSonPaginate(e);
          this.growLife = 5000;
          this.msgservice.showSuccess("Success");
          this.msgs = this.msgservice.msgs;
          this.userDisplay = false;
        } else {
          this.growLife = 300000;
          this.msgservice.showError("Operation Error!");
          this.msgs = this.msgservice.msgs;
        }
      })
    }

    public selectionChange(event) {
      this.addTargetSubject = "RedZone Target " + event.value;
      this.service.post("/bpd-proj/bpd/crdnTarget/getCrdnTargets",{
        "page": {
          "page": 0,
          "rows": 10
        },
        "subject": this.addTargetSubject,
        "crdnTargetYear": this.addTargetYear
        // "lastUpdateDate": this.targetSelectedStore.lastUpdateDate,
        // "lastUpdateUser": this.targetSelectedStore.lastUpdateUse
      })
      .subscribe(data1 => {
        this.showTargetSon = true;
        // this.targetSonStore = [];
        this.targetSonStoreLen = data1.total;
        let data = data1.rows
        for(let i = 0; i < data.length; i++) {
          data[i].id = i + 1;
          data[i].groupTargetStr = data[i].groupTarget + '%';
          data[i].mdTargetStr = data[i].mdTarget + '%';
          data[i].projectsTargetStr = data[i].projectsTarget + '%';
          data[i].projectsStr = data[i].projectsName + "(" + data[i].projects + ")";
          // this.targetSonStore.push(data[i]);
        }
        this.MDIndex = Math.floor(data.length/2);

        this.targetSonStore = data.sort(this.compare('crdnTargetGroup'));
        this.step1GroupArr = [];
        for(let i=0; i<this.targetSonStore.length; i++) {
          this.step1GroupArr.push(this.targetSonStore[i].crdnTargetGroup)
        }
      })
    }

    public addTarget: boolean = true;
    public targetAddBtn() {
      this.addTarget = true;
      this.addTargetDisplay = true;
      this.addTargetSubject = "RedZone Target " + new Date().getFullYear();
      this.addTargetYear = new Date().getFullYear().toString();
      let event = {
        value: new Date().getFullYear()
      }
      this.selectionChange(event);
    }

    public targetEditBtn(item) {
      this.addTarget = false;
      this.addTargetDisplay = true;
      this.addTargetSubject = item.subject;
      this.addTargetYear = item.crdnTargetYear;
    }

    public targetDelBtn(item) {
      this.confirmationService.confirm({
        message: 'Do You Want To Delete This Record?',
        header: 'Delete Confirmation',
        icon: 'fa fa-trash',
        accept: () => {
          this.service.post("/bpd-proj/bpd/crdnTarget/deleteCrdnTargetByTitle",{
            "subject": item.subject,
            "lastUpdateUser": item.lastUpdateUser,
            "lastUpdateDate": item.lastUpdateDate,
            "crdnTargetYear": item.crdnTargetYear
          })
          .subscribe(data => {
            if(data['code'] == 1) {
              let e = {page: Number(this.targetStorePage), first: Number(this.targetStoreFirst), rows: this.targetStoreRows};
              this.targetPaginate(e);
              this.growLife = 5000;
              this.msgservice.showSuccess("Success");
              this.msgs = this.msgservice.msgs;
            } else {
              this.growLife = 300000;
              this.msgservice.showError("Operation Error!");
              this.msgs = this.msgservice.msgs;
            }
          })
        }
      });
    }

    public addTargetSonBtn() {
      this.editTargetSonDisplay = true;
      this.normal = false;
      this.groupValue = "Compact";
      this.targetValue = null;
      this.mdTargetValue = null;
      this.programsValue = null;
      this.selectProgramStore = [];
      this.programsTargetValue = null;
      this.projectsNameValue = null;
      this.vldArr = [];
      this.bindData();
    }

    public getTargetSonValueBtn() {
      let params: any = {
        "crdnTargetGroup": this.groupValue,
        "groupTarget": this.targetValue,
        "mdTarget": this.mdTargetValue,
        "projects": this.programsValue,
        "projectsTarget": this.programsTargetValue,
        "subject": this.addTargetSubject,
        "crdnTargetYear": this.addTargetYear,
        "projectsName": this.projectsNameValue,
        "vld": this.selectProgramStore[this.selectProgramStore.length-1].vld,
        "lastUpdateDate": new Date().getFullYear() + '-' + (new Date().getMonth() - (-1)) + '-' + new Date().getDate()
      };
      console.log(params)
      this.service.post("/bpd-proj/bpd/crdnTarget/addCrdnTarget",params)
      .subscribe(data => {
        if(data['code'] == 1) {
          this.service.post("/bpd-proj/bpd/crdnTarget/getCrdnTargets",{
            "page": {
              "page": 0,
              "rows": 10
            },
            "subject": this.addTargetSubject,
            "crdnTargetYear": this.addTargetYear
          })
          .subscribe(data1 => {
            this.showTargetSon = true;
            // this.targetSonStore = [];
            this.targetSonStoreLen = data1.total;
            let data = data1.rows
            for(let i = 0; i < data.length; i++) {
              data[i].id = i + 1;
              data[i].groupTargetStr = data[i].groupTarget + '%';
              data[i].mdTargetStr = data[i].mdTarget + '%';
              data[i].projectsTargetStr = data[i].projectsTarget + '%';
              data[i].projectsStr = data[i].projectsName + "(" + data[i].projects + ")";
              // this.targetSonStore.push(data[i]);
            }
            this.MDIndex = Math.floor(data.length/2);

            this.targetSonStore = data.sort(this.compare('crdnTargetGroup'));
            this.step1GroupArr = [];
            for(let i=0; i<this.targetSonStore.length; i++) {
              this.step1GroupArr.push(this.targetSonStore[i].crdnTargetGroup)
            }
          })
          this.growLife = 5000;
          this.msgservice.showSuccess("Success");
          this.msgs = this.msgservice.msgs;
          this.editTargetSonDisplay = false;
        } else {
          this.growLife = 300000;
          this.msgservice.showInfo(data["businessData"]);
          this.msgs = this.msgservice.msgs;
        }
      })
    }

    // public saveTargetBtn() {
    //   this.addTargetDisplay = false;
    // }

    // public cancelTargetBtn() {
    //   this.addTargetDisplay = false;
    // }

    public onHideFun() {
      let e = {
        page: 0, 
        first: 0, 
        rows: "10", 
        pageCount: 1
      }
      this.targetPaginate(e);
    }

    public targetSonEditBtn(item) {
      console.log(item,111)
      this.selectSonTarget = item;
      this.editTargetSonDisplay = true;
      this.normal = true;
      this.groupValue = item.crdnTargetGroup;
      this.targetValue = item.groupTarget;
      this.mdTargetValue = item.mdTarget;
      this.programsValue = item.projects;
      this.programsTargetValue = item.projectsTarget;
      this.projectsNameValue = item.projectsName;
      this.selectProgramStore = [];
      if(item.projects) {
        for(let i=0; i<item.projects.split(",").length; i++) {
          this.selectProgramStore.push({
            programCode: item.projects.split(",")[i],
            vld: item.vld
          })
        }
        this.vldArr = [item.userCode];
      }
    }

    public targetSonDelBtn(item) {
      this.confirmationService.confirm({
        message: 'Do You Want To Delete This Record?',
        header: 'Delete Confirmation',
        icon: 'fa fa-trash',
        accept: () => {
          this.service.get("/bpd-proj/bpd/crdnTarget/deleteCrdnTargetById?crdnTargetId="+item.crdnTargetId+"&"+Number(new Date()))
          .subscribe(data => {
            if(data['code'] == 1) {
              let e = {page: Number(this.targetSonStorePage), first: Number(this.targetSonStoreFirst), rows: this.targetSonStoreRows};
              this.targetSonPaginate(e);
              this.addTargetSubject = "RedZone Target " + new Date().getFullYear();
              this.addTargetYear = new Date().getFullYear().toString();
              this.growLife = 5000;
              this.msgservice.showSuccess("Success");
              this.msgs = this.msgservice.msgs;
            } else {
              this.growLife = 300000;
              this.msgservice.showError("Operation Error!");
              this.msgs = this.msgservice.msgs;
            }
          })
        }
      });
    }

    public saveTargetSonEditBtn() {
      let projects: any = [];
      for(let i=0; i<this.selectProgramStore.length; i++) {
        projects.push(this.selectProgramStore[i].programCode)
      }
      let params: any = {
        "crdnTargetGroup": this.groupValue,
        "groupTarget": this.targetValue,
        "mdTarget": this.mdTargetValue,
        "projectsName": this.projectsNameValue,
        "projects": projects.join(","),
        "vld": this.selectProgramStore[this.selectProgramStore.length-1].userCode,
        "projectsTarget": this.programsTargetValue,
        "crdnTargetId": this.selectSonTarget.crdnTargetId,
        "subject": this.addTargetSubject,
        "crdnTargetYear": this.addTargetYear,
        "lastUpdateDate": new Date().getFullYear() + '-' + (new Date().getMonth() - (-1)) + '-' + new Date().getDate()
      };
      this.service.post("/bpd-proj/bpd/crdnTarget/updateCrdnTarget",params)
      .subscribe(data => {
        if(data['code'] == 1) {
          this.service.post("/bpd-proj/bpd/crdnTarget/getCrdnTargets",{
            "page": {
              "page": 0,
              "rows": 10
            },
            "subject": this.addTargetSubject,
            "crdnTargetYear": this.addTargetYear
          })
          .subscribe(data1 => {
            this.showTargetSon = true;
            // this.targetSonStore = [];
            this.targetSonStoreLen = data1.total;
            let data = data1.rows
            for(let i = 0; i < data.length; i++) {
              data[i].id = i + 1;
              data[i].groupTargetStr = data[i].groupTarget + '%';
              data[i].mdTargetStr = data[i].mdTarget + '%';
              data[i].projectsTargetStr = data[i].projectsTarget + '%';
              data[i].projectsStr = data[i].projectsName + "(" + data[i].projects + ")";
              // this.targetSonStore.push(data[i]);
            }
            this.MDIndex = Math.floor(data.length/2);

            this.targetSonStore = data.sort(this.compare('crdnTargetGroup'));
            this.step1GroupArr = [];
            for(let i=0; i<this.targetSonStore.length; i++) {
              this.step1GroupArr.push(this.targetSonStore[i].crdnTargetGroup)
            }
          })
          this.growLife = 5000;
          this.msgservice.showSuccess("Success");
          this.msgs = this.msgservice.msgs;
          this.editTargetSonDisplay = false;
        } else {
          this.growLife = 300000;
          this.msgservice.showError("Operation Error!");
          this.msgs = this.msgservice.msgs;
        }
      })
    }

    public cancelTargetSonEditBtn() {
      this.editTargetSonDisplay = false;
    }

    public selectPrograms() {
      this.programSelectedStore = [];
      this.projectCodeSearch = "";
      this.brandSerch = null;
      this.platformSerch = null;
      this.targetToProjectBtn(this.selectSonTarget);
      this.normalJump = false;
    }

    public handleChange(e) {
      if(e.index == 0) {
        // this.service.post("/bpd-proj/bpd/crdnInfo/getCrdnInfos",{
        //   "page": {
        //     "page": 1,
        //     "rows": 10
        //   },
        //   "description": 'Local'
        // })
        // .subscribe(data1 => {
        //   this.localStoreAjax(data1);
        // })
      } else if(e.index == 1) {
        this.redZoneLookUpBtn();
      }
    }

    public redZoneYearSerchStore: any = [
      {'label':new Date().getFullYear()-1,'value':new Date().getFullYear()-1},
      {'label':new Date().getFullYear(),'value':new Date().getFullYear()},
      {'label':new Date().getFullYear()+1,'value':new Date().getFullYear()+1}
    ];

    public redZoneYearSerch: string = '2018';

    public redZoneNextYearSerch: string = '2019';

    public redZoneSeasonSerchStore: any = [
      {'label':'Q1','value':'1'},
      {'label':'Q2','value':'2'},
      {'label':'Q3','value':'3'},
      {'label':'Q4','value':'4'}
    ];

    public redZoneSeasonSerch: any = Math.ceil((new Date().getMonth()-(-1))/3);

    public redZoneStatusStore: any = [];

    public redZoneTargetStore: any = [];

    public redZoneJDTargetStore: any = [];

    public mainPipData: any;

    public leftPipData: any = {};

    public middlePipData: any = {};

    public rightPipData: any = {};

    public chartOption: any;

    public leftPipOptions: any;

    public middlePipOptions: any;

    public rightPipOptions: any;

    public reload: boolean = false;

    public leftTotal: number = 0;

    public middleTotal: number = 0;

    public rightTotal: number = 0;

    public nowJD: number = Math.ceil((new Date().getMonth()-(-1))/3);

    public redZoneLookUpBtn() {
      this.reload = false;

      this.redZoneNextYearSerch = (Number(this.redZoneYearSerch) + 1).toString();
      this.service.post("/bpd-proj/bpd/redZone/getByJD",{
        "crdnTargetYear": this.redZoneYearSerch,
        "jD": this.redZoneSeasonSerch
      })
      .subscribe(data1 => {
        let data = data1.redZones;
        if(data.length) {
          this.redZoneStatusStore = data;
        } else {
          this.redZoneStatusStore = [];
        }

        this.leftTotal = data1.dn1.allGreen + data1.dn1.allRed + data1.dn1.allYellow;
        this.middleTotal = data1.dn2.allGreen + data1.dn2.allRed + data1.dn2.allYellow;
        this.rightTotal = data1.dn3.allGreen + data1.dn3.allRed + data1.dn3.allYellow;

        this.leftPipData = {red:data1.dn1.allRed,yellow:data1.dn1.allYellow,green:data1.dn1.allGreen};
        this.middlePipData = {red:data1.dn2.allRed,yellow:data1.dn2.allYellow,green:data1.dn2.allGreen};
        this.rightPipData = {red:data1.dn3.allRed,yellow:data1.dn3.allYellow,green:data1.dn3.allGreen};
        
        this.service.post("/bpd-proj/bpd/redZone/getByYear",{
          "crdnTargetYear": this.redZoneYearSerch
        })
        .subscribe(data => {
          let redTotal: number = 0;
          let yellowTotal: number = 0;
          let greenTotal: number = 0;
          for(let i=0; i<data.length; i++) {
            redTotal += data[i].red;
            yellowTotal += data[i].yellow;
            greenTotal += data[i].green;
          }
          let mainTotal: number = redTotal + yellowTotal + greenTotal;
          // this.drawMainPie(redTotal,yellowTotal,greenTotal,mainTotal);
          if(data.length) {
            for(let i = 0; i < data.length; i++) {
              data[i].id = i;
              data[i].groupTargetStr = data[i].groupTarget + '%';
              data[i].groupActualStr = data[i].groupActual + '%';
              data[i].nextYearGroupTargetStr = data[i].nextYearGroupTarget + '%';
              data[i].mdTargetStr = data[i].mdTarget + '%';
              data[i].mdActualStr = data[i].mdActual + '%';
              data[i].nextYearMdTargetStr = data[i].nextYearMdTarget + '%';
              data[i].projectsActualStr = data[i].projectsActual + '%';
              data[i].nextYearProjectsTargetStr = data[i].nextYearProjectsTarget + '%';
              data[i].projectsStr = data[i].projectsName + "(" + data[i].projects + ")";
              data[i].projectsTargetStr = data[i].projectsTarget + '%';
              if(10 < (data[i].groupActual - data[i].groupTarget)) {
                data[i].totalColor = "#fb4444";
              } else if(data[i].groupTarget >= data[i].groupActual) {
                data[i].totalColor = "#0dc30d";
              } else {
                data[i].totalColor = "#f3f32f";
              }
              if(10 < (data[i].mdActual - data[i].mdTarget)) {
                data[i].mdColor = "#fb4444";
              } else if(data[i].mdTarget >= data[i].mdActual) {
                data[i].mdColor = "#0dc30d";
              } else {
                data[i].mdColor = "#f3f32f";
              }
              if(10 < (data[i].projectsActual - data[i].projectsTarget)) {
                data[i].color = "#fb4444";
              } else if(data[i].projectsTarget >= data[i].projectsActual) {
                data[i].color = "#0dc30d";
              } else {
                data[i].color = "#f3f32f";
              }
            }
            this.redZoneTargetStore = data.sort(this.compare('crdnTargetGroup'));
            this.groupYearArr = [];
            for(let i=0; i<this.redZoneTargetStore.length; i++) {
              this.groupYearArr.push(this.redZoneTargetStore[i].crdnTargetGroup)
            }
          } else {
            this.redZoneTargetStore = [];
          }
          this.YearIndex = Math.floor(data.length/2);

          let redZoneChart: any = {
            redZoneYearSerch: this.redZoneYearSerch,
            mainTotal: mainTotal,
            yellowTotal: yellowTotal,
            redTotal: redTotal,
            greenTotal: greenTotal
          }

          window.localStorage.setItem("redZoneChart",JSON.stringify(redZoneChart));

          let redZoneLeftChart: any = {
            redZoneYearSerch: this.redZoneYearSerch,
            mainTotal: this.leftTotal,
            yellowTotal: data1.dn1.allYellow,
            redTotal: data1.dn1.allRed,
            greenTotal: data1.dn1.allGreen,
            title: data1.dn1["year"] + " Q" + data1.dn1["jd"]
          }

          window.localStorage.setItem("redZoneLeftChart",JSON.stringify(redZoneLeftChart));

          let redZoneMiddleChart: any = {
            redZoneYearSerch: this.redZoneYearSerch,
            mainTotal: this.middleTotal,
            yellowTotal: data1.dn2.allYellow,
            redTotal: data1.dn2.allRed,
            greenTotal: data1.dn2.allGreen,
            title: data1.dn2["year"] + " Q" + data1.dn2["jd"]
          }

          window.localStorage.setItem("redZoneMiddleChart",JSON.stringify(redZoneMiddleChart));

          let redZoneRightChart: any = {
            redZoneYearSerch: this.redZoneYearSerch,
            mainTotal: this.rightTotal,
            yellowTotal: data1.dn3.allYellow,
            redTotal: data1.dn3.allRed,
            greenTotal: data1.dn3.allGreen,
            title: data1.dn3["year"] + " Q" + data1.dn3["jd"]
          }

          window.localStorage.setItem("redZoneRightChart",JSON.stringify(redZoneRightChart));

          this.reload = true;
        })
        this.service.post("/bpd-proj/bpd/redZone/getByYear",{
          "crdnTargetYear": this.redZoneYearSerch,
          "jD": this.redZoneSeasonSerch
        })
        .subscribe(data => {
          if(data.length) {
            for(let i = 0; i < data.length; i++) {
              data[i].id = i;
              data[i].groupTargetStr = data[i].groupTarget + '%';
              data[i].groupActualStr = data[i].groupActual + '%';
              data[i].nextYearGroupTargetStr = data[i].nextYearGroupTarget + '%';
              data[i].mdTargetStr = data[i].mdTarget + '%';
              data[i].mdActualStr = data[i].mdActual + '%';
              data[i].nextYearMdTargetStr = data[i].nextYearMdTarget + '%';
              data[i].projectsActualStr = data[i].projectsActual + '%';
              data[i].nextYearProjectsTargetStr = data[i].nextYearProjectsTarget + '%';
              data[i].projectsStr = data[i].projectsName + "(" + data[i].projects + ")";
              data[i].projectsTargetStr = data[i].projectsTarget + '%';
              if(10 < (data[i].groupActual - data[i].groupTarget)) {
                data[i].totalColor = "#fb4444";
              } else if(data[i].groupTarget >= data[i].groupActual) {
                data[i].totalColor = "#0dc30d";
              } else {
                data[i].totalColor = "#f3f32f";
              }
              if(10 < (data[i].mdActual - data[i].mdTarget)) {
                data[i].mdColor = "#fb4444";
              } else if(data[i].mdTarget >= data[i].mdActual) {
                data[i].mdColor = "#0dc30d";
              } else {
                data[i].mdColor = "#f3f32f";
              }
              if(10 < (data[i].projectsActual - data[i].projectsTarget)) {
                data[i].color = "#fb4444";
              } else if(data[i].projectsTarget >= data[i].projectsActual) {
                data[i].color = "#0dc30d";
              } else {
                data[i].color = "#f3f32f";
              }
            }
            this.redZoneJDTargetStore = data.sort(this.compare('crdnTargetGroup'));
            this.groupArr = [];
            for(let i=0; i<this.redZoneJDTargetStore.length; i++) {
              this.groupArr.push(this.redZoneJDTargetStore[i].crdnTargetGroup)
            }
          } else {
            this.redZoneJDTargetStore = [];
          }
        })
      })
    }

    public step1GroupArr = [];
    public groupArr: any = [];
    public groupYearArr: any = [];

    public compare(property){
      return function(a,b){
        var value1 = a[property].charCodeAt();
        var value2 = b[property].charCodeAt();
        return value1 - value2;
      }
    }

    public drawMainPie(redTotal,yellowTotal,greenTotal,mainTotal) {
      // 指定图表的配置项和数据
      this.chartOption = {
          title: {
              show: true,
              text: this.redZoneYearSerch + ' Red/Yellow/Green Zone Status',
              textStyle: {
                  fontSize: 14,
                  fontWeight: 'bold',
                  fontFamily: 'Microsoft YaHei'
              },
              left: 'center'
          },
          legend: {
              orient: 'vertical',
              right: '20px',
              top: '50%',
              data:['Red','Yellow','Green']
          },
          series: [
              {
                  // name:'访问来源',
                  type:'pie',
                  // selectedMode: 'single',
                  radius: [0, '70%'],

                  label: {
                      normal: {
                          position: 'inner',
                          fontSize: 10,
                          fontWeight: 100,
                          color: '#000'
                      }
                  },

                  data:[
                      {value:redTotal, name:'Red',label:{
                          normal: {
                              show: redTotal == 0 ? false : true,
                              formatter: [
                                  '{a|Red}',
                                  '{b|'+Math.round(redTotal/mainTotal*100)+'%}'
                              ].join('\n'),
                              rich: {
                                  a: {
                                      color: '#000',
                                      lineHeight: 10
                                  },
                                  b: {
                                      color: '#000',
                                      height: 20
                                  }
                              }
                          }
                      }},
                      {value:yellowTotal, name:'Yellow',label:{
                          normal: {
                              show: yellowTotal == 0 ? false : true,
                              formatter: [
                                  '{a|Yellow}',
                                  '{b|'+Math.round(yellowTotal/mainTotal*100)+'%}'
                              ].join('\n'),
                              rich: {
                                  a: {
                                      color: '#000',
                                      lineHeight: 10
                                  },
                                  b: {
                                      color: '#000',
                                      height: 20
                                  }
                              }
                          }
                      }},
                      {value:greenTotal, name:'Green',label:{
                          normal: {
                              show: greenTotal == 0 ? false : true,
                              formatter: [
                                  '{a|Green}',
                                  '{b|'+Math.round(greenTotal/mainTotal*100)+'%}'
                              ].join('\n'),
                              rich: {
                                  a: {
                                      color: '#000',
                                      lineHeight: 10
                                  },
                                  b: {
                                      color: '#000',
                                      height: 20
                                  }
                              }
                          }
                      }}
                  ]
              }
          ],
          color:['red','yellow','green']
      };
    }

    public drawLeftSonPie(redTotal,yellowTotal,greenTotal,mainTotal,title) {
      // 指定图表的配置项和数据
      this.leftPipOptions = {
          title: {
              show: true,
              text: title,
              textStyle: {
                  fontSize: 12,
                  fontWeight: 'bold',
                  fontFamily: 'Microsoft YaHei'
              },
              left: 'center'
          },
          series: [
              {
                  // name:'访问来源',
                  type:'pie',
                  // selectedMode: 'single',
                  radius: [0, '55%'],
                  center: ['50%', '45%'],
                  label: {
                      normal: {
                          position: 'inner',
                          fontSize: 8,
                          fontWeight: 100,
                          color: '#000'
                      }
                  },

                  data:[
                      {value:redTotal, name:'Red',label:{
                          normal: {
                              show: redTotal == 0 ? false : true,
                              formatter: [
                                  '{a|Red}',
                                  '{b|'+Math.round(redTotal/mainTotal*100)+'%}'
                              ].join('\n'),
                              rich: {
                                  a: {
                                      color: '#000',
                                      lineHeight: 10
                                  },
                                  b: {
                                      color: '#000',
                                      height: 20
                                  }
                              }
                          }
                      }},
                      {value:yellowTotal, name:'Yellow',label:{
                          normal: {
                              show: yellowTotal == 0 ? false : true,
                              formatter: [
                                  '{a|Yellow}',
                                  '{b|'+Math.round(yellowTotal/mainTotal*100)+'%}'
                              ].join('\n'),
                              rich: {
                                  a: {
                                      color: '#000',
                                      lineHeight: 10
                                  },
                                  b: {
                                      color: '#000',
                                      height: 20
                                  }
                              }
                          }
                      }},
                      {value:greenTotal, name:'Green',label:{
                          normal: {
                              show: greenTotal == 0 ? false : true,
                              formatter: [
                                  '{a|Green}',
                                  '{b|'+Math.round(greenTotal/mainTotal*100)+'%}'
                              ].join('\n'),
                              rich: {
                                  a: {
                                      color: '#000',
                                      lineHeight: 10
                                  },
                                  b: {
                                      color: '#000',
                                      height: 20
                                  }
                              }
                          }
                      }}
                  ]
              }
          ],
          color:['red','yellow','green']
      };
    }

    public drawMiddleSonPie(redTotal,yellowTotal,greenTotal,mainTotal,title) {
      // 指定图表的配置项和数据
      this.middlePipOptions = {
          title: {
              show: true,
              text: title,
              textStyle: {
                  fontSize: 12,
                  fontWeight: 'bold',
                  fontFamily: 'Microsoft YaHei'
              },
              left: 'center'
          },
          series: [
              {
                  // name:'访问来源',
                  type:'pie',
                  // selectedMode: 'single',
                  radius: [0, '55%'],
                  center: ['50%', '45%'],
                  label: {
                      normal: {
                          position: 'inner',
                          fontSize: 8,
                          fontWeight: 100,
                          color: '#000'
                      }
                  },

                  data:[
                      {value:redTotal, name:'Red',label:{
                          normal: {
                              show: redTotal == 0 ? false : true,
                              formatter: [
                                  '{a|Red}',
                                  '{b|'+Math.round(redTotal/mainTotal*100)+'%}'
                              ].join('\n'),
                              rich: {
                                  a: {
                                      color: '#000',
                                      lineHeight: 10
                                  },
                                  b: {
                                      color: '#000',
                                      height: 20
                                  }
                              }
                          }
                      }},
                      {value:yellowTotal, name:'Yellow',label:{
                          normal: {
                              show: yellowTotal == 0 ? false : true,
                              formatter: [
                                  '{a|Yellow}',
                                  '{b|'+Math.round(yellowTotal/mainTotal*100)+'%}'
                              ].join('\n'),
                              rich: {
                                  a: {
                                      color: '#000',
                                      lineHeight: 10
                                  },
                                  b: {
                                      color: '#000',
                                      height: 20
                                  }
                              }
                          }
                      }},
                      {value:greenTotal, name:'Green',label:{
                          normal: {
                              show: greenTotal == 0 ? false : true,
                              formatter: [
                                  '{a|Green}',
                                  '{b|'+Math.round(greenTotal/mainTotal*100)+'%}'
                              ].join('\n'),
                              rich: {
                                  a: {
                                      color: '#000',
                                      lineHeight: 10
                                  },
                                  b: {
                                      color: '#000',
                                      height: 20
                                  }
                              }
                          }
                      }}
                  ]
              }
          ],
          color:['red','yellow','green']
      };
    }

    public drawRightSonPie(redTotal,yellowTotal,greenTotal,mainTotal,title) {
      // 指定图表的配置项和数据
      this.rightPipOptions = {
          title: {
              show: true,
              text: title,
              textStyle: {
                  fontSize: 12,
                  fontWeight: 'bold',
                  fontFamily: 'Microsoft YaHei'
              },
              left: 'center'
          },
          series: [
              {
                  type:'pie',
                  radius: [0, '55%'],
                  center: ['50%', '45%'],
                  label: {
                      normal: {
                          position: 'inner',
                          fontSize: 8,
                          fontWeight: 100,
                          color: '#000'
                      }
                  },

                  data:[
                      {value:redTotal, name:'Red',label:{
                          normal: {
                              show: redTotal == 0 ? false : true,
                              formatter: [
                                  '{a|Red}',
                                  '{b|'+Math.round(redTotal/mainTotal*100)+'%}'
                              ].join('\n'),
                              rich: {
                                  a: {
                                      color: '#000',
                                      lineHeight: 10
                                  },
                                  b: {
                                      color: '#000',
                                      height: 20
                                  }
                              }
                          }
                      }},
                      {value:yellowTotal, name:'Yellow',label:{
                          normal: {
                              show: yellowTotal == 0 ? false : true,
                              formatter: [
                                  '{a|Yellow}',
                                  '{b|'+Math.round(yellowTotal/mainTotal*100)+'%}'
                              ].join('\n'),
                              rich: {
                                  a: {
                                      color: '#000',
                                      lineHeight: 10
                                  },
                                  b: {
                                      color: '#000',
                                      height: 20
                                  }
                              }
                          }
                      }},
                      {value:greenTotal, name:'Green',label:{
                          normal: {
                              show: greenTotal == 0 ? false : true,
                              formatter: [
                                  '{a|Green}',
                                  '{b|'+Math.round(greenTotal/mainTotal*100)+'%}'
                              ].join('\n'),
                              rich: {
                                  a: {
                                      color: '#000',
                                      lineHeight: 10
                                  },
                                  b: {
                                      color: '#000',
                                      height: 20
                                  }
                              }
                          }
                      }}
                  ]
              }
          ],
          color:['red','yellow','green']
      };
    }
    // add 2018/1/3
    bindData(){
      this.service.post("/bpd-proj/bpd/crdnTarget/getTwoTarget",{
        "subject":this.addTargetSubject,
        "crdnTargetGroup": this.groupValue
      }).subscribe(data => {
        if(data.length) {
          this.targetValue = data[0].groupTarget;
          this.mdTargetValue = data[0].mdTarget;
        } else {
          this.targetValue = "";
          this.mdTargetValue = this.mdTargetValue;
        }
      })
    }

    exportOne(){
      let timeStamp = + new Date();
      let token = window.sessionStorage.getItem("access_token");
      let url: string = "/bpd-proj/bpd/redZone/exportExcel?" + timeStamp + "&crdnTargetYear=" + this.redZoneYearSerch + "&_=" + Number(new Date());
      if (token) {
          let realToken = token.substr(1, token.length - 2)
          url = url + "&accessToken=" + realToken;
      }
      window.location.href = url;
    }

    exportTwo(){
      let timeStamp = Date.now();
      let token = window.sessionStorage.getItem("access_token");
      let url: string = "/bpd-proj/bpd/redZone/exportExcel?" + timeStamp + "&crdnTargetYear=" + this.redZoneYearSerch + "&jD=" + this.redZoneSeasonSerch + "&_=" + Number(new Date());
      if (token) {
          let realToken = token.substr(1, token.length - 2)
          url = url + "&accessToken=" + realToken;
      }
      window.location.href = url;
    }
};