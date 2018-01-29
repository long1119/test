import { Component, OnInit } from '@angular/core';
import 'style-loader!./issueManagement.scss';
import { SelectItem, ConfirmationService } from 'primeng/primeng';
import { HttpDataService } from '../../../service/http.service';
import { MessageService } from '../../../service/message.service';

@Component({
  selector: 'issue-management',
  templateUrl: './issueManagement.html',
  providers: [HttpDataService, MessageService, ConfirmationService]
})
export class IssueManagement implements OnInit{

	  public gridStore: any = [];

    public gridStoreLen: number;

    public gridStoreRows: any = '15';

    public gridStoreFirst: any = 0;

    public gridStorePage: any = 0;

    public msgs: any;

    public growLife: number = 5000;

    public programCodeSerch: string = "";

    public IssueSerch: string = "";

    public issueTypeSerch: string = "";

    public statusStore: any = [
      {label:'All',value:null},
      {label:'Red',value:1},
      {label:'Yellow',value:2},
      {label:'Green',value:3},
      {label:'White',value:4}
    ];

    public issueTypeValueStore:any = [
      {label: 'Select',value: ''},
      {label: 'Appearance',value: 'Appearance'},
      {label: 'Features',value: 'Features'},
      {label: 'Cost & Quality',value: 'Cost & Quality'},
      {label: 'Technology',value: 'Technology'},
      {label: 'Powertrain',value: 'Powertrain'},
      {label: 'Regulatory/Mandatory/Economy',value: 'Regulatory/Mandatory/Economy'},
      {label: 'incl. Corporate Initiatives',value: 'incl. Corporate Initiatives'},
      {label: 'Accessories',value: 'Accessories'},
      {label: 'Other',value: 'Other'}
    ]

    public status: string = "";

    public display: boolean = false;

    public checkValue: boolean = false;

    public statusValueStore: any = [
      {label:'Red',value:1},
      {label:'Yellow',value:2},
      {label:'Green',value:3},
      {label:'White',value:4}
    ];

    public statusValue: any = null;

    public add: boolean = true;

    public programValue: string = null;

    public programValueId: string = null;

    public issueValue: string = null;

    public issueTypeValue: string = null;

    public issueDate: any = null;

    public actionValue: string = null;

    public ownerValue: string = null;

    public ownerCodeValue: string = null;

    public closeDate: any = null;

    public forumValue: string = null;

    public userRoot: boolean = true;

    public closeRoot: boolean = true;

    public yearRange: string;

    public minIssueDate:any = new Date();

    public minCloseDate:any = new Date();

	constructor(private service: HttpDataService, private confirmationService: ConfirmationService, private msgservice: MessageService) {
        // 日期年份设置
        let currentYear = new Date().getFullYear();
        this.yearRange = "" + (Number(currentYear) - 10) + ":" + (Number(currentYear) + 50);
	}
    
    ngOnInit() {
      if(!JSON.parse(window.localStorage.getItem("authorityData"))["Maintain Veh.roject Issue"] || 
        JSON.parse(window.localStorage.getItem("authorityData"))["Maintain Veh.roject Issue"] == 'false')
      {
        this.userRoot = false;
      }
      if(!JSON.parse(window.localStorage.getItem("authorityData"))["Close Problem"] || 
        JSON.parse(window.localStorage.getItem("authorityData"))["Close Problem"] == 'false')
      {
        this.closeRoot = false;
      }
    	this.service.post("/bpd-proj/bpd/issue/getVList",{
        "page": {
          "page": 1,
          "rows": 15
        },
        programCode: this.programCodeSerch,
        issueType: this.issueTypeSerch,
        issueItem: this.IssueSerch,
        issueStatus: this.status
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
          data[i].issueItemBrief = (data[i].issueItem && data[i].issueItem.length>5)  ? data[i].issueItem.substr(0,5)+"..." : data[i].issueItem;
          data[i].issueActionBrief = (data[i].issueAction && data[i].issueAction.length>5)  ? data[i].issueAction.substr(0,5)+"..." : data[i].issueAction;
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
      this.service.post("/bpd-proj/bpd/issue/getVList",{
        "page": {
          "page": Number(e.page) - (-1),
          "rows": e.rows
        },
        programCode: this.programCodeSerch,
        issueType: this.issueTypeSerch,
        issueItem: this.IssueSerch,
        issueStatus: this.status
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
            data[i].issueItemBrief = (data[i].issueItem && data[i].issueItem.length>5)  ? data[i].issueItem.substr(0,5)+"..." : data[i].issueItem;
          data[i].issueActionBrief = (data[i].issueAction && data[i].issueAction.length>5)  ? data[i].issueAction.substr(0,5)+"..." : data[i].issueAction;
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

    public lookUpEnterSearch($event) {
      if ($event.key === "Enter") {
        this.lookUpBtn();
      }
    }
    
    public lookUpBtn() {
      let e = {
        page: 0, 
        first: 0, 
        rows: "15", 
        pageCount: 1
      }
      this.gridPaginate(e);
    }

    public checkbox(e) {
      this.checkValue = e.target.checked;
    }

    // add edit del

    public addBtn() {
      this.display = true;
      this.add = true;
      this.statusValue = 1;
      this.programValue = null;
      this.issueValue = null;
      this.issueTypeValue = null;
      this.issueDate = null;
      this.actionValue = null;
      this.ownerValue = null;
      this.closeDate = null;
      this.forumValue = null;
      this.selectUserStore = [];
    }

    public selectItem: any;

    public editBtn(item) {
      this.selectItem = item;
      this.display = true;
      this.add = false;
      this.statusValue = item.issueStatus;
      this.programValue = item.programCode;
      this.programValueId = item.programId;
      this.issueValue = item.issueItem;
      this.issueTypeValue = item.issueType;
      this.issueDate = item.issueDate;
      this.actionValue = item.issueAction;
      this.ownerValue = null;
      this.closeDate = item.issueClosedDate;
      this.forumValue = item.issueTrackingForum;
      if(item.owner && item.ownerName) {
        this.selectUserStore = [];
        let codeArr: any = item.owner.split(",");
          let nameArr: any = item.ownerName.split(",");
          for(let i=0; i<codeArr.length; i++) {
            this.selectUserStore.push({
              "userName": nameArr[i],
              "userCode": codeArr[i] 
            })
          }
      } else {
        this.selectUserStore = [];
      }
    }

    public delBtn(item) {
      this.confirmationService.confirm({
        message: 'Do You Want To Delete This Record?',
        header: 'Delete Confirmation',
        icon: 'fa fa-trash',
        accept: () => {
           this.service.get("/bpd-proj/bpd/issue/delete?issueId="+item.issueId+"&"+Number(new Date()))
          .subscribe(data => {
            if(data['code'] == 1) {
              this.msgservice.showSuccess("Success");
              this.growLife = 5000;
              this.msgs = this.msgservice.msgs;
              let e = {
                page: this.gridStorePage, 
                first: this.gridStoreFirst, 
                rows: this.gridStoreRows,
                pageCount: Math.ceil(this.gridStoreLen/this.gridStoreRows)
              }
              this.gridPaginate(e);
            } else {
              this.msgservice.showInfo(data['msg']);
              this.growLife = 5000;
              this.msgs = this.msgservice.msgs;
            }
          })
        }
      });
    }

    public saveBtn() {
      if(this.closeDate.getTime() < this.issueDate.getTime()) {
        this.msgservice.showInfo("Close Date Must be greater than Issue Date!");
        this.growLife = 300000;
        this.msgs = this.msgservice.msgs;
        return;
      }
      let ownerCode:any = [];
      for(let i=0; i<this.selectUserStore.length; i++) {
        ownerCode.push(this.selectUserStore[i].userCode)
      }
      let params: any = {
        issueStatus: this.statusValue,
        programId: this.programValueId,
        issueItem: this.issueValue,
        issueType: this.issueTypeValue,
        issueDate: this.dateFormat(this.issueDate),
        issueAction: this.actionValue,
        owner: ownerCode.join(","),
        issueClosedDate: this.dateFormat(this.closeDate),
        issueTrackingForum: this.forumValue
      }
      this.service.post("/bpd-proj/bpd/issue/insert",params)
      .subscribe(data => {
        if(data['code'] == 1) {
          this.msgservice.showSuccess("Success");
          this.growLife = 5000;
          this.msgs = this.msgservice.msgs;
          let e = {
            page: this.gridStorePage, 
            first: this.gridStoreFirst, 
            rows: this.gridStoreRows,
            pageCount: Math.ceil(this.gridStoreLen/this.gridStoreRows)
          }
          this.gridPaginate(e);
          this.display = false;
        } else {
          this.msgservice.showInfo(data['msg']);
          this.growLife = 5000;
          this.msgs = this.msgservice.msgs;
        }
      })
    }

    public saveChangeBtn() {
      if(new Date(this.dateFormat(this.closeDate)).getTime() < new Date(this.dateFormat(this.issueDate)).getTime()) {
        this.msgservice.showInfo("Close Date Must be greater than Issue Date!");
        this.growLife = 300000;
        this.msgs = this.msgservice.msgs;
        return;
      }
      let ownerCode:any = [];
      for(let i=0; i<this.selectUserStore.length; i++) {
        ownerCode.push(this.selectUserStore[i].userCode)
      }
      let params: any = {
        issueId: this.selectItem.issueId,
        issueStatus: this.statusValue,
        programId: this.programValueId,
        issueItem: this.issueValue,
        issueType: this.issueTypeValue,
        issueDate: this.dateFormat(this.issueDate),
        issueAction: this.actionValue,
        owner: ownerCode.join(","),
        issueClosedDate: this.dateFormat(this.closeDate),
        issueTrackingForum: this.forumValue
      }
      console.log(params)
      this.service.post("/bpd-proj/bpd/issue/update",params)
      .subscribe(data => {
        if(data['code'] == 1) {
          this.msgservice.showSuccess("Success");
          this.growLife = 5000;
          this.msgs = this.msgservice.msgs;
          let e = {
            page: this.gridStorePage, 
            first: this.gridStoreFirst, 
            rows: this.gridStoreRows,
            pageCount: Math.ceil(this.gridStoreLen/this.gridStoreRows)
          }
          this.gridPaginate(e);
          this.display = false;
        } else {
          this.msgservice.showInfo(data['businessData']);
          this.growLife = 5000;
          this.msgs = this.msgservice.msgs;
        }
      })
    }

    public cancelBtn() {
      this.display = false;
    }

    public exportBtn() {
      let token = window.sessionStorage.getItem("access_token");
      let url: string = '/bpd-proj/bpd/issue/exportExcel?programCode='+
      this.programCodeSerch+'&issueType='+
      this.issueTypeSerch+'&issueStatus='+this.status+'&issueItem='+this.IssueSerch + '&_=' + Number(new Date());
      if (token) {
        let realToken = token.substr(1, token.length - 2)
        url = url + "&accessToken=" + realToken;
      }
      window.location.href = url;
    }

     //  user

    public managerSearchDialog: boolean = false;

    public managerDialogDepartment: string = null;

    public managerDialogUserName: string = null;

    public managerDialogEmployeeCode: string = "";

    public managerData: any = [];

    public managerDataRows: any = '10';

    public managerDataFirst: any = 0;

    public managerDataLen: number;

    public getUser() {
    let userCodesArr = [];
    for(let i=0; i<this.selectUserStore.length; i++) {
      userCodesArr.push(this.selectUserStore[i].userCode)
    }
    this.managerDialogDepartment = null;
    this.managerDialogUserName = null;
    this.managerDialogEmployeeCode = "";
    this.managerSearchDialog = true;
    this.managerData = [];
    this.service.post("/bpd-proj/bpd/user/getVList", {
      "page": {
        "page": 1,
        "rows": 10
      },
      "departmentName" : this.managerDialogDepartment,
      "userName": this.managerDialogUserName,
      "userCodes": userCodesArr,
      "employeeCode": this.managerDialogEmployeeCode
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
    let userCodesArr = [];
    for(let i=0; i<this.selectUserStore.length; i++) {
      userCodesArr.push(this.selectUserStore[i].userCode)
    }
    this.service.post("/bpd-proj/bpd/user/getVList",{
      "page": {
        "page": e.page + 1,
        "rows": e.rows
      },
      "departmentName" : this.managerDialogDepartment,
      "userName": this.managerDialogUserName,
      "employeeCode": this.managerDialogEmployeeCode,
      "userCodes": userCodesArr
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

  public managerEnterSearch($event) {
    if ($event.key === "Enter") {
      this.managerLookClick();
    }
  }
  
  public managerLookClick() {
    let e = {page: 0, first: 0, rows: "10"};
      this.managerPaginate(e);
  }

  public managerDbclick(e) {
    this.selectUserStore.push({
      userName: e.data.userName,
      userCode: e.data.userCode
    })
    this.managerSearchDialog = false;
    this.managerDialogDepartment = null;
    this.managerDialogUserName = null;
    this.managerDialogEmployeeCode = "";
  }

  public selectUserStore: any = [];

  public delUser(items) {
    this.confirmationService.confirm({
      message: 'Do You Want To Delete This Record?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
          let arr: any = [];
          for(let i=0; i<this.selectUserStore.length; i++) {
            arr.push(this.selectUserStore[i].userCode)
          }
          this.selectUserStore.splice(arr.indexOf(items.userCode),1);
      }
    });
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

  // program Select
  public programStore: any = [];

  public programStoreLen: number;

  public programStoreRows: any = '10';

  public programStoreFirst: any = 0;

  public programStorePage: any = 0;

  public programSerchStore: any = [{'label':'All','value':null}];

  public programSerch: string = null;

  public programProgramCodeSearch: string = "";

  public programDisplay: boolean = false;

  public brandSerchStore: any = [{'label':'All','value':null}];

  public brandSerch: string = null;

  public platformSerchStore: any = [{'label':'All','value':null}];

  public platformSerch: string = null;

  public getProgram() {
    this.programProgramCodeSearch = "";
    this.service.get("/bpd-proj/bpd/vehicleProject/getProgramBrandCombobox?"+Number(new Date()))
    .subscribe(data => {
      this.brandSerchStore = data;
      this.brandSerchStore.unshift({
        'label':'All',
        'value':null
      })
    })
    this.service.get("/bpd-proj/bpd/vehicleProject/getProgramPlantFormCombobox?"+Number(new Date()))
    .subscribe(data => {
      this.platformSerchStore = data;
      this.platformSerchStore.unshift({
        'label':'All',
        'value':null
      })
    })
    this.service.post("/bpd-proj/bpd/vehicleProject/getVList",{
      "page": {
        "page": 1,
        "rows": 10
      }
    })
    .subscribe(data1 => {
      this.programStoreAjax(data1);
    })
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
      this.programDisplay = true;
    }

    public programPaginate(e) {
      console.log(e.page)
      this.service.post("/bpd-proj/bpd/vehicleProject/getVList",{
        "page": {
          "page": Number(e.page) - (-1),
          "rows": e.rows
        },
        "brandName": this.brandSerch,
        "modelPlatform": this.platformSerch,
        "programCode": this.programProgramCodeSearch
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
      })
    }

    public programLookUpBtn() {
      let e = {page: 0, first: 0, rows: "10"};
      this.programPaginate(e);
    }

    public dbclick(e) {
      this.programValue = e.data.programCode;
      this.programValueId = e.data.programId
      this.programDisplay = false;
    }


    // Issue Close

    public closeDisplay: boolean = false;

    public closeItem: any = {};

    public closeCloseDate: any = null;

    public closeForumValue: string = null;

    public closeStatusValue: string = null;

    public closeBtn(item) {
      console.log(item)
      this.closeDisplay = true;
      this.closeItem = item;
      this.closeCloseDate = null;
      this.closeForumValue = null;
      this.closeStatusValue = item.issueStatus
    }

    public closeSaveBtn() {
      let params = {
        issueId: this.closeItem.issueId,
        finishiDate: this.dateFormat(this.closeCloseDate),
        issueTrackingForum: this.closeForumValue,
        issueStatus: this.closeStatusValue
      }
      console.log(params)
      this.service.post("/bpd-proj/bpd/issue/update",params)
      .subscribe(data => {
        if(data['code'] == 1) {
          this.msgservice.showSuccess("Success");
          this.growLife = 5000;
          this.msgs = this.msgservice.msgs;
          let e = {
            page: this.gridStorePage, 
            first: this.gridStoreFirst, 
            rows: this.gridStoreRows,
            pageCount: Math.ceil(this.gridStoreLen/this.gridStoreRows)
          }
          this.gridPaginate(e);
          this.closeDisplay = false;
        } else if(data['code'] == 2){
          this.msgservice.showInfo("Close Date Must be greater than Issue Date!");
          this.growLife = 300000;
          this.msgs = this.msgservice.msgs;
        }  else if(data['code'] == 3){
          this.msgservice.showInfo("Finish Date Must be greater than Close Date!");
          this.growLife = 300000;
          this.msgs = this.msgservice.msgs;
        } else {
          this.msgservice.showInfo(data['businessData']);
          this.growLife = 5000;
          this.msgs = this.msgservice.msgs;
        }
      })
    }

    public closeCancelBtn() {
      this.closeDisplay = false;
    }

    //   查看文字详情
  public mouseover(e,html) {
    var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    var messageDetail = document.getElementById("messageDetail");
    messageDetail.innerHTML = html;
    if(html.length > 200) {
      messageDetail.style.width = "400px"
    } else {
      messageDetail.style.width = "200px"
    }
    messageDetail.style.zIndex = "9999999";
    messageDetail.style.top = (e.pageY -scrollTop) + "px";
    messageDetail.style.left = (e.pageX - (-20)) + "px";
  }

  public mouseup() {
    var messageDetail = document.getElementById("messageDetail");
    messageDetail.style.zIndex = "-999";
  }

};