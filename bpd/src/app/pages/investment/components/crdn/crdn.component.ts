import { Component, OnInit } from '@angular/core';
import 'style-loader!./crdn.scss';
import { SelectItem, TreeNode, MenuItem, ConfirmationService } from 'primeng/primeng';
import { HttpDataService } from '../../../service/http.service';
import { MessageService } from '../../../service/message.service';

@Component({
  selector: 'crdn',
  templateUrl: './crdn.html',
  providers: [HttpDataService, MessageService, ConfirmationService]
})
export class Crdn implements OnInit{

    public msgs: any;

    public growLife: number = 5000;

    public localStore: any = [];

    public localStoreLen: number;

    public localStoreRows: any = '15';

    public localStoreFirst: any = 0;

    public globalStore: any = [];

    public globalStoreLen: number;

    public globalStoreRows: any = '15';

    public globalStoreFirst: any = 0;

    public addDialog: boolean = false;

    public messageDialog: boolean = false;

    public messageData: any = [];

    public uploadURL: string = '/bpd-proj/bpd/crdnImport/importCrdns';

    public globalSelectedStore: any = [];

    public toLocalDetailDialog: boolean = false;

    public localProgramSerchStore: any = [{'label':'All','value':null}];

    public localProgramSerch: string = null;

    public localModelYearSerch: string = null;

    public localCRDNStore: any = [{'label':'All','value':null},{'label':'CR','value':2},{'label':'DN','value':1}];

    public localCRDN: string = null;

    public localCRDNNo: string = null;

    public localDetailSelectedStore: any = [];

    public localDetailStore: any = [];

    public localDetailStoreLen: number;

    public localDetailStoreRows: any = '10';

    public localDetailStoreFirst: any = 0;

    public localSelectData: any;

    // public programSerchStore: any = [{'label':'All','value':null}]

    // public programSerch: string = null;

    public modelYearSerch: string = null;

    public userRoot: boolean = true;


	constructor(private service: HttpDataService, private confirmationService: ConfirmationService, private msgservice: MessageService) {
	}
    
    ngOnInit() {
      if(!JSON.parse(window.localStorage.getItem("authorityData"))["Maintain CR/DN"] || 
        JSON.parse(window.localStorage.getItem("authorityData"))["Maintain CR/DN"] == 'false')
      {
        this.userRoot = false;
      }
      this.service.post("/bpd-proj/bpd/crdnInfo/getCrdnInfos",{
        "page": {
          "page": 1,
          "rows": 15
        },
        "description": 'Local'
      })
      .subscribe(data1 => {
        this.localStoreAjax(data1);
      })
    }

    public localStoreAjax(data1) {  // local ajax
      this.localStore = [];
      this.localStoreLen = data1.total;
      let data = data1.rows
      for(let i = 0; i < data.length; i++) {
        data[i].id = i + 1;
      }
      for(let i = 0; i < 15; i++) {
        if(!data[i]) {
          this.localStore.push({
            "ip": i+1
          })
        } else {
          this.localStore.push(data[i])
        }
      }
    }

    public globalStoreAjax(data1) {  // global ajax
      this.globalStore = [];
      this.globalStoreLen = data1.total;
      let data = data1.rows
      for(let i = 0; i < data.length; i++) {
        data[i].id = i + 1;
      }
      for(let i = 0; i < 15; i++) {
        if(!data[i]) {
          this.globalStore.push({
            "ip": i+1
          })
        } else {
          this.globalStore.push(data[i])
        }
      }
    }

    public handleChange(e) {
      if(e.index == 0) {
        this.service.post("/bpd-proj/bpd/crdnInfo/getCrdnInfos",{
          "page": {
            "page": 1,
            "rows": 15
          },
          "description": 'Local'
        })
        .subscribe(data1 => {
          this.localStoreAjax(data1);
        })
      } else if(e.index == 1) {
        this.service.post("/bpd-proj/bpd/crdnInfo/getCrdnInfos",{
          "page": {
            "page": 1,
            "rows": 15
          },
          "description": 'Global'
        })
        .subscribe(data1 => {
          this.globalStoreAjax(data1);
        })
      }
    }

    public localPaginate(e) {
      this.service.post("/bpd-proj/bpd/crdnInfo/getCrdnInfos",{
        "page": {
          "page": e.page + 1,
          "rows": e.rows
        },
        "description": 'Local'
      })
      .subscribe(data1 => {
        this.localStore = [];
        this.localStoreLen = data1.total;
        this.localStoreRows = e.rows;
        this.localStoreFirst = e.first;
        let data = data1.rows
        for(let i = 0; i < data.length; i++) {
          data[i].id = i + 1;
        }
        for(let i = 0; i < e.rows; i++) {
          if(!data[i]) {
            this.localStore.push({
              "ip": i+1
            })
          } else {
            this.localStore.push(data[i])
          }
        }
      })
    }

    public globalPaginate(e) {
      this.service.post("/bpd-proj/bpd/crdnInfo/getCrdnInfos",{
        "page": {
          "page": e.page + 1,
          "rows": e.rows
        },
        "description": 'Global'
      })
      .subscribe(data1 => {
        this.globalStore = [];
        this.globalStoreLen = data1.total;
        this.globalStoreRows = e.rows;
        this.globalStoreFirst = e.first;
        let data = data1.rows
        for(let i = 0; i < data.length; i++) {
          data[i].id = i + 1;
        }
        for(let i = 0; i < e.rows; i++) {
          if(!data[i]) {
            this.globalStore.push({
              "ip": i+1
            })
          } else {
            this.globalStore.push(data[i])
          }
        }
      })
    }

    public lookUpBtn() {
      let e = {page: 0, first: 0, rows: "15"};
      this.globalPaginate(e);
    }

    public localToDetailBtn(item) {
      console.log(item)
      this.localSelectData = item;
      this.toLocalDetailDialog = true;
      if(item.description == 'Local CR/DN') {
        this.service.post("/bpd-proj/bpd/crdnTarget/getListOfProgramCode",{
          "isGlobalCrdn": 0,
          "crdnInfoId":item.crdnInfoId
        })
        .subscribe(data => {
          // for(let i=0; i<data.length; i++) {
          //   this.localProgramSerchStore = data;
          // }
          this.localProgramSerchStore = data;
          this.localProgramSerchStore.unshift({
            'label':'All',
            'value':null
          })
          this.localProgramSerch = this.localProgramSerchStore[0].value;

        })
      } else {
        this.service.post("/bpd-proj/bpd/crdnTarget/getListOfProgramCode",{
          "isGlobalCrdn": 1,
          "crdnInfoId":item.crdnInfoId
        })
        .subscribe(data => {
          // for(let i=0; i<data.length; i++) {
          //   this.localProgramSerchStore = data;
          // }
          this.localProgramSerchStore = data;
          this.localProgramSerchStore.unshift({
            'label':'All',
            'value':null
          })
          this.localProgramSerch = this.localProgramSerchStore[0].value;
        })
      }
      
      this.service.post("/bpd-proj/bpd/crdnImport/getCrdnImports",{
        "page": {
          "page": 1,
          "rows": 10
        },
        "crdnInfoId": item.crdnInfoId,
        "programs": this.localProgramSerch,
        "modelYear": this.localModelYearSerch,
        "finalDn": this.localCRDN,
        "crdnNo": this.localCRDNNo

      })
      .subscribe(data1 => {
        this.localDetailStore = [];
        this.localDetailStoreLen = data1.total;
        let data = data1.rows
        for(let i = 0; i < data.length; i++) {
          data[i].id = i + 1;
          this.localDetailStore.push(data[i])
        }
      })
    }

    public localDetailPaginate(e) {
      this.service.post("/bpd-proj/bpd/crdnImport/getCrdnImports",{
        "page": {
          "page": e.page + 1,
          "rows": e.rows
        },
        "crdnInfoId": this.localSelectData.crdnInfoId,
        "programs": this.localProgramSerch,
        "modelYear": this.localModelYearSerch,
        "finalDn": this.localCRDN,
        "crdnNo": this.localCRDNNo

      })
      .subscribe(data1 => {
        this.localDetailStore = [];
        this.localDetailStoreLen = data1.total;
        this.localDetailStoreRows = e.rows;
        this.localDetailStoreFirst = e.first;
        let data = data1.rows
        for(let i = 0; i < data.length; i++) {
          data[i].id = i + 1;
          this.localDetailStore.push(data[i])
        }
      })
    }

    public localLookUpEnterSearch($event) {
      if ($event.key === "Enter") {
        this.localLookUpBtn();
      }
    }

    public localLookUpBtn() {
      let e = {page: 0, first: 0, rows: "10"};
      this.localDetailPaginate(e);
    }

    public localDelBtn(item) {
      this.confirmationService.confirm({
        message: 'Do You Want To Delete This Record?',
        header: 'Delete Confirmation',
        icon: 'fa fa-trash',
        accept: () => {
          this.service.post("/bpd-proj/bpd/crdnInfo/deleteCrdnInfo",{
            "crdnInfoId" : item.crdnInfoId
          })
          .subscribe(data => {
            if(data['code'] == 1) {
              let e = {page: 0, first: 0, rows: "15"};
              this.localPaginate(e);
              this.msgservice.showSuccess("Success");
              this.growLife = 5000;
              this.msgs = this.msgservice.msgs;
            } else {
              this.msgservice.showInfo(data['businessData']);
              this.growLife = 300000;
              this.msgs = this.msgservice.msgs;
            }
          })
        }
      });
    }

    public globalDelBtn(item) {
      this.confirmationService.confirm({
        message: 'Do You Want To Delete This Record?',
        header: 'Delete Confirmation',
        icon: 'fa fa-trash',
        accept: () => {
          this.service.post("/bpd-proj/bpd/crdnInfo/deleteCrdnInfo",{
            "crdnInfoId" : item.crdnInfoId
          })
          .subscribe(data => {
            if(data['code'] == 1) {
              let e = {page: 0, first: 0, rows: "15"};
              this.globalPaginate(e);
              this.msgservice.showSuccess("Success");
              this.growLife = 5000;
              this.msgs = this.msgservice.msgs;
            } else {
              this.msgservice.showInfo(data['businessData']);
              this.growLife = 300000;
              this.msgs = this.msgservice.msgs;
            }
          })
        }
      });
    } 

    public globalDelsBtn() {
      this.confirmationService.confirm({
        message: 'Do You Want To Delete This Record?',
        header: 'Delete Confirmation',
        icon: 'fa fa-trash',
        accept: () => {
          let arr: any = [];
          for(let i=0; i<this.globalSelectedStore.length; i++) {
            arr.push(this.globalSelectedStore[i].crdnInfoId)
          }
          this.service.post("/bpd-proj/bpd/crdnImport/deleteCrdnImports",arr)
          .subscribe(data => {
            if(data['code'] == 1) {
              let e = {page: 0, first: 0, rows: "15"};
              this.globalPaginate(e);
              this.msgservice.showSuccess("Success");
              this.growLife = 5000;
              this.msgs = this.msgservice.msgs;
            } else {
              this.msgservice.showInfo(data['businessData']);
              this.growLife = 3000000;
              this.msgs = this.msgservice.msgs;
            }
          })
        }
      });
    }   

    public localImportBtn() {
      this.uploadURL = '/bpd-proj/bpd/crdnImport/importCrdns';
      this.addDialog = true;
    }

    public InportDisabled: boolean = false;

    public event: any = {};
    onBasicUpload($event) {
      this.event = $event;

      if(!this.msgservice.checkoutFileType($event,"xlsx-xls")) {
        this.msgservice.showInfo("Unvaliable File Type!");
        this.growLife = 300000;
        this.msgs = this.msgservice.msgs;
        return;
      }

      let response = eval('(' + $event.xhr.response + ')');
      if(response.list.length !== 0 && !response.message) {
        if(response.same) {
          this.InportDisabled = false;
        } else {
          this.InportDisabled = true;
        }
        this.messageData = response.list;
        this.messageDialog = true;
        this.addDialog = false;
      }
      if(response.message) {
        this.msgservice.showInfo(response.message);
        this.growLife = 300000;
        this.msgs = this.msgservice.msgs;
      }
      if(response.list.length == 0 && !response.message) {
        this.msgservice.showSuccess("Success");
        this.growLife = 5000;
        this.msgs = this.msgservice.msgs;
        this.addDialog = false;
        let e = {page: 0, first: 0, rows: "15"};
        this.localPaginate(e);
        this.globalPaginate(e);
      }
    }

    public departmentDialog: boolean = false;

    public departmentData: any = [];

    public selectedData: any;

    public setDeptsBtn() {
      if(this.localDetailSelectedStore.length) {
        this.departmentDialog = true;
        this.service.post("/bpd-proj/bpd/dept/getList",{
          "page": {
            "page": 1,
            "rows": 10
          }
        })
        .subscribe(data => {
          this.departmentData = data;
        })
      }
    }

    public setLocalDeptBtn(item) {
      this.localDetailSelectedStore = [];
      this.selectedData = item;
      this.departmentDialog = true;
      this.service.post("/bpd-proj/bpd/dept/getList",{
        "page": {
          "page": 1,
          "rows": 10
        }
      })
      .subscribe(data => {
        this.departmentData = data;
      })
    }

    public dbclick(e) {
      let crdnImportId = "";
      if(this.localDetailSelectedStore.length) {
        let arr = [];
        for(let i=0; i<this.localDetailSelectedStore.length; i++) {
          arr.push(this.localDetailSelectedStore[i].crdnImportId)
        }
        crdnImportId = arr.join(",");
      } else {
        crdnImportId = this.selectedData.crdnImportId;
      }
      this.departmentDialog = false;
      this.service.post("/bpd-proj/bpd/crdnImport/updateCrdnImport",{
        "deptId": e.data.deptName,
        "crdnImportId": crdnImportId
      })
      .subscribe(data => {
        if(data['code'] == 1) {
          this.localDetailSelectedStore = [];
          let e = {page: 0, first: 0, rows: "10"};
          this.localDetailPaginate(e);
          this.msgservice.showSuccess("Success");
          this.growLife = 5000;
          this.msgs = this.msgservice.msgs;
        } else {
          this.msgservice.showInfo(data['businessData']);
          this.growLife = 300000;
          this.msgs = this.msgservice.msgs;
        }
      })
    }

    public localDetailDelBtn(item) {
      this.confirmationService.confirm({
        message: 'Do You Want To Delete This Record?',
        header: 'Delete Confirmation',
        icon: 'fa fa-trash',
        accept: () => {
          this.service.post("/bpd-proj/bpd/crdnImport/deleteCrdnImports",[
            item.crdnImportId
          ])
          .subscribe(data => {
            if(data['code'] == 1) {
              let e = {page: 0, first: 0, rows: "10"};
              this.localDetailPaginate(e);
              this.msgservice.showSuccess("Success");
              this.growLife = 5000;
              this.msgs = this.msgservice.msgs;
            } else {
              this.msgservice.showInfo(data['businessData']);
              this.growLife = 300000;
              this.msgs = this.msgservice.msgs;
            }
          })
        }
      });
    }

    public localDetailDelsBtn() {
      this.confirmationService.confirm({
        message: 'Do You Want To Delete This Record?',
        header: 'Delete Confirmation',
        icon: 'fa fa-trash',
        accept: () => {
          let arr: any = [];
          for(let i=0; i<this.localDetailSelectedStore.length; i++) {
            arr.push(this.localDetailSelectedStore[i].crdnImportId)
          }
          this.service.post("/bpd-proj/bpd/crdnImport/deleteCrdnImports",arr)
          .subscribe(data => {
            if(data['code'] == 1) {
              let e = {page: 0, first: 0, rows: "10"};
              this.localDetailPaginate(e);
              this.msgservice.showSuccess("Success");
              this.growLife = 5000;
              this.msgs = this.msgservice.msgs;
            } else {
              this.msgservice.showInfo(data['businessData']);
              this.growLife = 300000;
              this.msgs = this.msgservice.msgs;
            }
          })
        }
      });
    }
    
    // new add 2018/1/4
    importTxt(){
      let attIds = "61EAAC0EF42456CBE0531B18CB0A20B2";
      let timeStamp = Date.now();
      let token = window.sessionStorage.getItem("access_token");
      let url: string = "/bpd-proj/bpd/crdnImport/downloadLocal?" + Number(new Date());
      if (token) {
          let realToken = token.substr(1, token.length - 2)
          url = url + "&accessToken=" + realToken;
      }
      window.location.href = url;
    }
    importTxt1(){
      let attIds = "61EAB5DBE98B7E7EE0531B18CB0A8293";
      let timeStamp = Date.now();
      let token = window.sessionStorage.getItem("access_token");
      let url: string = "/bpd-proj/bpd/crdnImport/downloadGlobal?" + Number(new Date());
      if (token) {
          let realToken = token.substr(1, token.length - 2)
          url = url + "&accessToken=" + realToken;
      }
      window.location.href = url;
    }

    public sureImport() {
      this.uploadURL = '/bpd-proj/bpd/crdnImport/importCrdns?flag=1';
      var xhr = new XMLHttpRequest(), formData = new FormData();
      this.event.files[0].filename = this.event.files[0].name;
      formData.append('file', this.event.files[0]);
      xhr.open('POST', this.uploadURL, true);
      var accessToken = sessionStorage.getItem("access_token");
      if (accessToken) {
        xhr.setRequestHeader("accessToken", accessToken.substr(1, accessToken.length - 2));
      }
      let _this = this;
      xhr.onload = function (oEvent) {
        _this.msgservice.showSuccess("Success");
        _this.growLife = 5000;
        _this.msgs = _this.msgservice.msgs;
        _this.addDialog = false;
        _this.messageDialog = false;
        let e = {page: 0, first: 0, rows: "15"};
        _this.localPaginate(e);
        _this.globalPaginate(e);
        };
      xhr.send(formData);
    }
};