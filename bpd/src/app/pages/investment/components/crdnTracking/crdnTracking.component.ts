import { Component, OnInit } from '@angular/core';
import 'style-loader!./crdnTracking.scss';
import { SelectItem, TreeNode, MenuItem } from 'primeng/primeng';
import { HttpDataService } from '../../../service/http.service';
import { MessageService } from '../../../service/message.service';
import {
  DataManageService
} from '../../../service/dataManage.service';
import {
    RefreshMenuService
} from '../../../service/refreshMenu.service';

@Component({
  selector: 'crdn-tracking',
  templateUrl: './crdnTracking.html',
  providers: [HttpDataService, MessageService, RefreshMenuService, DataManageService]
})
export class CrdnTracking implements OnInit{

    public msgs: any;

    public growLife: number = 5000;

    public gridStore: any = [];

    public gridStoreLen: number;

    public gridStoreRows: any = '10';

    public gridStoreFirst: any = 0;

    public gridStorePage: any = 0;

    public programStore: any = [];

    public programStoreLen: number;

    public programStoreRows: any = '10';

    public programStoreFirst: any = 0;

    public programStorePage: any = 0;

    public programSerchStore: any = [];

    public programSerch: string = "";

    public modelYearSerch: string = "";

    public redZoneSerchStore: any = [{'label':'All','value':''},{'label':'Red','value':'Red'},{'label':'Yellow','value':'Yellow'},{'label':'Green','value':'Green'}];

    public redZoneSerch: string = "";

    public competitiveSerchStore: any = [];

    public competitiveSerch: string = "";

    public display: boolean = false;

    public programDisplay: boolean = false;

    public itemStore: any = [];

    public statusStore: any = [{'label':'Close','value':'Close'},{'label':'Open','value':'Open'}]

    public status: string = 'Close';

    public brandSerchStore: any = [];

    public brandSerch: string = null;

    public platformSerchStore: any = [];

    public platformSerch: string = null;

    public userRoot: boolean = true;

	constructor(private service: HttpDataService, private msgservice: MessageService, private dataManageService: DataManageService, private refreshMenuService: RefreshMenuService) {
        // 刷新菜单默认选中项
        let flag = this.dataManageService.getUuId()
        this.refreshMenuService.refreshMenu(flag);
	}
    
    ngOnInit() {
      if(!JSON.parse(window.localStorage.getItem("authorityData"))["Maintain CR/DN Tracking List"] || 
        JSON.parse(window.localStorage.getItem("authorityData"))["Maintain CR/DN Tracking List"] == 'false')
      {
        this.userRoot = false;
      }
      this.service.post("/bpd-proj/bpd/crdnTarget/getListOfProgramCode",{})
      .subscribe(data => {
        for(let i=0; i<data.length; i++) {
          this.programSerchStore = data;
        }
        this.programSerchStore.unshift({
          'label':'All',
          'value':''
        })
        this.programSerch = this.programSerchStore[0].value;
      })
      this.service.post("/bpd-proj/bpd/competitive/getCompetitives",{
        "competitiveId": "ddd"
      })
      .subscribe(data => {
        for(let i=0; i<data.length; i++) {
          this.competitiveSerchStore.push({
            "label": data[i].competitiveName,
            "value": data[i].competitiveId
          })
        }
        this.competitiveSerchStore.unshift({
          'label':'All',
          'value':''
        })
        this.competitiveSerch = this.competitiveSerchStore[0].value;
      })
      this.service.post("/bpd-proj/bpd/trackingList/getCrdnImports",{
        "page": {
          "page": 1,
          "rows": 10
        },
        "modelYear": this.modelYearSerch,
        "programs": this.programSerch,
        "redZone": this.redZoneSerch,
        "competitive": this.competitiveSerch,
        "crdnNo": this.userRoot ? 1 : 0
      })
      .subscribe(data1 => {
        this.gridStoreAjax(data1);
      })
    }

    ngAfterViewChecked() {
      for(let i=0; i<this.gridStore.length; i++) {
        let j = i+1;
        if(!this.gridStore[i].programId && this.gridStore[i].id) {
          document.getElementById("gridTable").getElementsByTagName("tr")[j].style.background = 'yellow';
        }
      }
    }

    public gridStoreAjax(data1) {  // grid ajax
      this.gridStore = [];
      this.gridStoreLen = data1.total;
      let data = data1.rows
      for(let i = 0; i < data.length; i++) {
        data[i].id = i + 1;
        if(data[i].finalDn) {
          data[i].crdn = 'DN';
        } else {
          data[i].crdn = 'CR';
        }
      }
      for(let i = 0; i < 10; i++) {
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
      this.service.post("/bpd-proj/bpd/trackingList/getCrdnImports",{
        "page": {
          "page": Number(e.page) - (-1),
          "rows": e.rows
        },
        "modelYear": this.modelYearSerch,
        "programs": this.programSerch,
        "redZone": this.redZoneSerch,
        "competitive": this.competitiveSerch,
        "crdnNo": this.userRoot ? 1 : 0
      })
      .subscribe(data1 => {
        this.gridStore = [];
        this.gridStoreLen = data1.total;
        this.gridStoreRows = e.rows;
        this.gridStoreFirst = Number(e.first);
        this.gridStorePage = e.page;
        let data = data1.rows
        for(let i = 0; i < data.length; i++) {
          data[i].id = i + 1;
          if(data[i].finalDn) {
            data[i].crdn = 'DN';
          } else {
            data[i].crdn = 'CR';
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
      let e = {page: 0, first: 0, rows: "15"};
      this.gridPaginate(e);
    }

    public lifecyclePlanBtn() {
      console.log('预留');
    }

    public exportBtn() {
      let token = window.sessionStorage.getItem("access_token");
      let url: string = "/bpd-proj/bpd/crdnImport/exportExcel?programs="+this.programSerch+"&modelYear="+this.modelYearSerch+"&redZone="+this.redZoneSerch+"&competitive="+this.competitiveSerch+"&crdnNo=1" + '&_=' + Number(new Date());
      if (token) {
        let realToken = token.substr(1, token.length - 2)
        url = url + "&accessToken=" + realToken;
      }
      window.location.href = url;
    }

    public competitiveNullSerchStore: any = [];

    public crdnTrackingModel: string = null;
    public crdnStatusModel: string = null;
    public competitiveValue: string = null;
    public editBtn(item) {
      this.display = true;
      this.itemStore = item;
      this.crdnStatusModel = item.crdnStatus;
      this.crdnTrackingModel = item.crdnTracking;
      this.service.post("/bpd-proj/bpd/competitive/getCompetitives",{})
      .subscribe(data => {
        this.competitiveNullSerchStore = [];
        for(let i=0; i<data.length; i++) {
          this.competitiveNullSerchStore.push({
            "label": data[i].competitiveName,
            "value": data[i].competitiveId
          })
        }
        this.competitiveValue = item.competitiveId;
      })
    }

    public saveBtn() {
      this.service.post("/bpd-proj/bpd/crdnImport/updateCrdnImport",{
        competitive: this.competitiveValue,
        crdnImportId: this.itemStore.crdnImportId,
        changeFrom: this.itemStore.changeFrom,
        changeTo: this.itemStore.changeTo,
        crdnTracking: this.crdnTrackingModel,
        crdnStatus: this.crdnStatusModel
      })
      .subscribe(data => {
        if(data['code'] == 1) {
          let e = {page: Number(this.gridStorePage), first: Number(this.gridStoreFirst), rows: this.gridStoreRows};
          this.gridPaginate(e);
          this.msgservice.showSuccess("Success");
          this.growLife = 5000;
          this.msgs = this.msgservice.msgs;
          this.service.post("/bpd-proj/bpd/competitive/getCompetitives",{
            "competitiveId": "ddd"
          })
          .subscribe(data => {
            this.competitiveSerchStore = [{'label':'All','value':null}];
            for(let i=0; i<data.length; i++) {
              this.competitiveSerchStore.push({
                "label": data[i].competitiveName,
                "value": data[i].competitiveId
              })
            }
            this.competitiveSerch = this.competitiveSerchStore[0].value;
            this.display = false;
          })
        } else {
          this.msgservice.showError("Operation Error!");
          this.growLife = 5000;
          this.msgs = this.msgservice.msgs;
        }
      })
    }

    public cancelBtn() {
      this.display = false;
    }

    public toProgramBtn(item) {
      this.programDisplay = true;
      this.itemStore = item;
      this.service.post("/bpd-proj/bpd/crdnTarget/getListOfPlatformAndBrand",{
        "programId": "more"
      })
      .subscribe(data => {
        console.log(data)
        for(let i=0; i<data.brand.length; i++) {
          this.brandSerchStore.push({
            "label": data.brand[i],
            "value": data.brand[i]
          })
        }
        this.brandSerchStore.unshift({
          'label':'All',
          'value':null
        })
        this.brandSerch = this.brandSerchStore[0].value;
        for(let i=0; i<data.platform.length; i++) {
          this.platformSerchStore.push({
            "label": data.platform[i],
            "value": data.platform[i]
          })
        }
        this.platformSerchStore.unshift({
          'label':'All',
          'value':null
        })
        this.platformSerch = this.platformSerchStore[0].value;
      })
      this.service.post("/bpd-proj/bpd/crdnTarget/getListOfProgram",{
        "page": {
          "page": 1,
          "rows": 10
        },
        "brandName": this.brandSerch,
        "modelPlatform": this.platformSerch,
        "programId": "more"
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
    }

    public programPaginate(e) {
      console.log(e.page)
      this.service.post("/bpd-proj/bpd/crdnTarget/getListOfProgram",{
        "page": {
          "page": Number(e.page) - (-1),
          "rows": e.rows
        },
        "brandName": this.brandSerch,
        "modelPlatform": this.platformSerch,
        "programId": "more"
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
      console.log(e.data.programId)
      this.service.post("/bpd-proj/bpd/crdnProgram/updateCrdnPrograms",{
        "crdnProgramId": this.itemStore.crdnProgramId,
        "programId": e.data.programId
      })
      .subscribe(data => {
        if(data['code'] == 1) {
          let e = {page: Number(this.gridStorePage), first: Number(this.gridStoreFirst), rows: this.gridStoreRows};
          this.gridPaginate(e);
          this.msgservice.showSuccess("Success");
          this.growLife = 5000;
          this.msgs = this.msgservice.msgs;
          this.programDisplay = false;
          this.service.post("/bpd-proj/bpd/crdnImport/updateCrdnImport",{
            crdnImportId: this.itemStore.crdnImportId,
            isProgram: 1
          })
          .subscribe(data => {
            console.log('sucess')
          })
        } else {
          this.msgservice.showError("Operation Error!");
          this.growLife = 5000;
          this.msgs = this.msgservice.msgs;
        }
      })
    }

};