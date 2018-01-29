import {Component,OnInit,Input} from '@angular/core';
import { HttpDataService} from '../../../../service/http.service';
import {MessageService} from "../../../../service/message.service";
import { Message, SelectItem, TreeNode, ConfirmationService } from 'primeng/primeng';
import 'style-loader!./program-information.scss';
import { DomSanitizer } from '@angular/platform-browser';
import { DataManageService } from '../../../../service/dataManage.service';
import { debug } from 'util';
@Component({
    selector:'programInformation',
    templateUrl:'./program-information.html',
    providers:[ConfirmationService]
})
export class programInformationComponent{
    programInformationData:any[];
    showModelYear:boolean = false;
    msgs: Message[];
    public growlLife: number = 5000;
    timeSheetData:any[];
    approveLogData:any[];
    // CR/DN 变量
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
        // public programSerchStore: any = [{'label':'All','value':null}];
        public programSerch: string = null;
        public modelYearSerch: string = null;
        public redZoneSerchStore: any = [{'label':'All','value':null},{'label':'Red','value':'Red'},{'label':'Yellow','value':'Yellow'},{'label':'Green','value':'Green'}];
        public redZoneSerch: string = null;
        public competitiveSerchStore: any = [];
        public competitiveSerch: string = null;
        public display: boolean = false;
        public programDisplay: boolean = false;
        public itemStore: any = [];
        public statusStore: any = [{'label':'Close','value':'Close'},{'label':'Open','value':'Open'}]
        public status: string = 'Close';
        public brandSerchStore: any = [{'label':'All','value':null}];
        public brandSerch: string = null;
        public platformSerchStore: any = [{'label':'All','value':null}];
        public platformSerch: string = null;
        @Input () parentPrograms:any;
      // nod变量
      paginatorPage:number = 1;
      paginatorRow:number = 10;
      totalRecord:number;
      nodTable:any[] = [];
      // issueList 变量
      issueTypeValueStore:any[] = [
        {label: 'Select',value: ''},
        {label: 'Appearance',value: 'Appearance'},
        {label: 'Features',value: 'Features'},
        {label: 'Cost & Quality',value: 'Cost & Quality'},
        {label: 'Technology',value: 'Technology'},
        {label: 'Powertrain',value: 'Powertrain'},
        {label: 'Regulatory/Mandatory/Economy',value: 'Regulatory/Mandatory/Economy'},
        {label: 'incl. Corporate Initiatives',value: 'incl. Corporate Initiatives'},
        {label: 'Accessories',value: 'Accessories'}
      ];
      issueTypeSerch:string = '';
      statusStore1:any[] =  [
        {label:'All',value:null},
        {label:'Red',value:1},
        {label:'Yellow',value:2},
        {label:'Green',value:3},
        {label:'White',value:4}
      ];
      status1:string = '';
      gridStore1:any[] = [];
      totalRecord1:number;
      paginatorPage1:number = 1;
      paginatorRow1:number = 10;
      // modelYear变量
      specialURL:any;
      // document变量
      haveFolder:boolean = true;
      items:any = [];
      selectItem:any;
      fileStore:any = [];
      isManager:any = 3;
      haveSelected:boolean = false;
      normalFolder:boolean = true;
      addChild:boolean = false;
      shareFileNameSearch:string = null;
      writeRead:string = "2";
      shareFileStore:any = [];
      selectedFile:any = [];
      fileNameSearch: string = null;
      uploadUserSearch:string = null;
      addFolderDisplay:boolean = false;
      modifyFolderDisplay:boolean = false;
      folderName:string = null;
      fileUpLoadDialog:boolean = false;
      UuId:string;
      businessId:string = null;
      uploadType:boolean = false;
      uploadNum:string = 'multiple';
      fileGridItem: any;
      shareFileDialog:boolean = false;
      selectUserStore:any = [];
      shareUserCode:any = [];
      budgetFileUpLoadUrlFirstStep:string = "/bpd-proj/bpd/att/batchUpload";
    constructor(private httpService: HttpDataService, private msgService: MessageService,private sanitizer: DomSanitizer, private confirmationService: ConfirmationService,private dataManageService: DataManageService) {
    }
    ngOnInit(){
        this.openModelYear();
    };
    handleChange(e){
      if(e.index == 0){
        this.openModelYear();
      }
      else if(e.index == 2){
        this.openCRDN();      
      }
      else if(e.index == 1){
        this.openNod();
      }
      else if(e.index == 3){
        this.openIssue();
      }
      else{
        this.toDetailBtn();
      }
    }
    // 打开model year
    openModelYear(){
      this.programInformationData = [];
        let timeStamp = new Date().getTime();
        this.httpService.get("/bpd-proj/bpd/masterTimeSheet/getIndexList?"+timeStamp+"&adProjectCode="+this.parentPrograms.adProjectCode)
        .subscribe(data => {
          // this.programInformationData = data;
          // if(this.programInformationData.length){
          //   for(let i=0;i<this.programInformationData.length;i++){
          //     if(Number.isInteger(this.programInformationData[i].version)){
          //       this.programInformationData[i].versionFlag = true;
          //     }
          //     else{
          //       this.programInformationData[i].versionFlag = false;
          //     }
          //   }
          // }
          for(let item of data){
            if(Number.isInteger(item.version)){
              this.programInformationData.push(item);
            }
          }
        })
    }
    // 打开可视化图
    openKSH(val1,val2){
      // let ww = document.body.clientWidth;
      // let hh = document.body.clientHeight;
      // let visualization = document.getElementById('visualization');
      // let view = visualization.getElementsByClassName('ui-dialog')[0];
      // view.id = "view";
      // let checken = document.getElementById('view');
      // checken.style.width = ww + 'px';
      // checken.style.height = hh + 'px';
      let timeStamp = new Date().getTime();
      this.specialURL = this.sanitizer.bypassSecurityTrustResourceUrl("assets/drawTimeSheet/svg.html?" + timeStamp + "&adProjectCode=" + val1 +"&timingId=" + val2);
      this.showModelYear = true;
    }
    // 打开 CR/DN
    openCRDN(){
          this.competitiveSerchStore = [];
          this.httpService.post("/bpd-proj/bpd/competitive/getCompetitives",{})
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
          });
          this.httpService.post("/bpd-proj/bpd/trackingList/getIndexCrdnImports",{
            "page": {
              "page": 1,
              "rows": 10
            },
            "modelYear": this.modelYearSerch,
            "programs": this.parentPrograms.programCode,
            "redZone": this.redZoneSerch,
            "competitive": this.competitiveSerch
          })
          .subscribe(data1 => {
            this.gridStoreAjax(data1);
          })
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
        console.log(e.page)
        this.httpService.post("/bpd-proj/bpd/trackingList/getCrdnImports",{
          "page": {
            "page": Number(e.page) - (-1),
            "rows": e.rows
          },
          "programs": this.parentPrograms.programCode,
          "modelYear": this.modelYearSerch,
          // "programs": this.programSerch,
          "redZone": this.redZoneSerch,
          "competitive": this.competitiveSerch
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

      public lookUpBtnEnterSearch($event) {
        if ($event.key === "Enter") {
          this.lookUpBtn();
        }
      }
  
      public lookUpBtn() {
        let e = {page: 0, first: 0, rows: "10"};
        this.gridPaginate(e);
      }
      // 打开nod
      openNod(){
        this.httpService.post("/bpd-proj/bpd/node/getIndexVList",{
          "adProjectCode":this.parentPrograms.adProjectCode,
          "page": {
            "page": this.paginatorPage,
            "rows": this.paginatorRow
          }
        }).subscribe(data1 => {
          this.nodTable = [];
          for (let i = 0; i < data1.length; i++) {
            data1[i].newDocControlNumber = data1[i].docControlNumber + "-" + data1[i].nameArray;
          }
          this.totalRecord = data1.total;
          let data = data1.rows;
          if(data.length){
            for(let i = 0; i < data.length; i++) {
              data[i].id = i + 1;
          }
          for(let i = 0; i < 10; i++) {
            if(!data[i]) {
                this.nodTable.push({
                    "ip": i+1
                })
            } else {
                this.nodTable.push(data[i])
            }
        }
      }
        })
      }
      // nod分页
      paginate(e){
        this.paginatorPage = e.page + 1;
        this.paginatorRow = e.rows;
        this.openNod();
      }
      // 打开 issueList
      openIssue(){
        this.httpService.post("/bpd-proj/bpd/issue/getVListOfIndex",{
          "page":{"page":this.paginatorPage1,"rows":this.paginatorRow1},
          "programCode": this.parentPrograms.programCode,
          "issueType": this.issueTypeSerch,
          "issueStatus": this.status1
        }).subscribe(data1 => {
          this.gridStore1 = [];
          this.totalRecord1 = data1.total;
          let data = data1.rows
          if(data.length) {
            for(let i = 0; i < data.length; i++) {
              data[i].id = i + 1;
            }
          }
          for(let i = 0; i < 10; i++) {
            if(!data[i]) {
              this.gridStore1.push({
                "ip": i+1
              })
            } else {
              this.gridStore1.push(data[i])
            }
          }
        })
      }
      // issueList分页
      paginate1(e){
        this.paginatorPage1 = e.page + 1;
        this.paginatorRow1 = e.rows;
        this.openIssue();
      }
      // issueList 模糊查询
      checkIssueList(){
        this.openIssue();
      }
      // public lifecyclePlanBtn() {
      //   console.log('预留');
      // }
  
      // public exportBtn() {
      //   window.location.href = "/bpd-proj/bpd/crdnImport/exportExcel?programs="+this.programSerch+"&modelYear="+this.modelYearSerch+"&redZone="+this.redZoneSerch+"&competitive="+this.competitiveSerch;
      // }

      // public editBtn(item) {
      //   this.display = true;
      //   this.itemStore = item;
      //   this.itemStore.crdnStatus = this.itemStore.crdnStatus ? this.itemStore.crdnStatus : 'Close';
      // }
  
      // public saveBtn() {
      //   console.log(this.itemStore)
      //   this.httpService.post("/bpd-proj/bpd/crdnImport/updateCrdnImport",this.itemStore)
      //   .subscribe(data => {
      //     if(data['code'] == 1) {
      //       let e = {page: Number(this.gridStorePage), first: Number(this.gridStoreFirst), rows: this.gridStoreRows};
      //       this.gridPaginate(e);
      //       this.msgService.showSuccess("success");
      //       this.msgs = this.msgService.msgs;
      //       this.display = false;
      //     } else {
      //       this.msgService.showError("Operation Error!");
      //       this.msgs = this.msgService.msgs;
      //     }
      //   })
      // }
  
      // public cancelBtn() {
      //   this.display = false;
      // }
  
      // public toProgramBtn(item) {
      //   this.programDisplay = true;
      //   this.itemStore = item;
      //   this.httpService.post("/bpd-proj/bpd/crdnTarget/getListOfPlatformAndBrand",{
      //     "programId": "more"
      //   })
      //   .subscribe(data => {
      //     console.log(data)
      //     for(let i=0; i<data.brand.length; i++) {
      //       this.brandSerchStore.push({
      //         "label": data.brand[i],
      //         "value": data.brand[i]
      //       })
      //     }
      //     this.brandSerch = this.brandSerchStore[0].value;
      //     for(let i=0; i<data.platform.length; i++) {
      //       this.platformSerchStore.push({
      //         "label": data.platform[i],
      //         "value": data.platform[i]
      //       })
      //     }
      //     this.platformSerch = this.platformSerchStore[0].value;
      //   })
      //   this.httpService.post("/bpd-proj/bpd/crdnTarget/getListOfProgram",{
      //     "page": {
      //       "page": 1,
      //       "rows": 10
      //     },
      //     "brandName": this.brandSerch,
      //     "modelPlatform": this.platformSerch,
      //     "programId": "more"
      //   })
      //   .subscribe(data1 => {
      //     this.programStoreAjax(data1);
      //   })
      // }
  
      // public programStoreAjax(data1) {  // program ajax
      //   this.programStore = [];
      //   this.programStoreLen = data1.total;
      //   let data = data1.rows
      //   for(let i = 0; i < data.length; i++) {
      //     data[i].id = i + 1;
      //   }
      //   for(let i = 0; i < 10; i++) {
      //     if(!data[i]) {
      //       this.programStore.push({
      //         "ip": i+1
      //       })
      //     } else {
      //       this.programStore.push(data[i])
      //     }
      //   }
      // }
  
      // public programPaginate(e) {
      //   console.log(e.page)
      //   this.httpService.post("/bpd-proj/bpd/crdnTarget/getListOfProgram",{
      //     "page": {
      //       "page": Number(e.page) - (-1),
      //       "rows": e.rows
      //     },
      //     "brandName": this.brandSerch,
      //     "modelPlatform": this.platformSerch,
      //     "programId": "more"
      //   })
      //   .subscribe(data1 => {
      //     this.programStore = [];
      //     this.programStoreLen = data1.total;
      //     this.programStoreRows = e.rows;
      //     this.programStoreFirst = Number(e.first);
      //     this.programStorePage = e.page;
      //     let data = data1.rows
      //     for(let i = 0; i < data.length; i++) {
      //       data[i].id = i + 1;
      //     }
      //     for(let i = 0; i < e.rows; i++) {
      //       if(!data[i]) {
      //         this.programStore.push({
      //           "ip": i+1
      //         })
      //       } else {
      //         this.programStore.push(data[i])
      //       }
      //     }
      //   })
      // }
  
      // public programLookUpBtn() {
      //   let e = {page: 0, first: 0, rows: "10"};
      //   this.programPaginate(e);
      // }
  
      // public dbclick(e) {
      //   console.log(e.data.programId)
      //   this.httpService.post("/bpd-proj/bpd/crdnProgram/updateCrdnPrograms",{
      //     "crdnProgramId": this.itemStore.crdnProgramId,
      //     "programId": e.data.programId
      //   })
      //   .subscribe(data => {
      //     if(data['code'] == 1) {
      //       let e = {page: Number(this.gridStorePage), first: Number(this.gridStoreFirst), rows: this.gridStoreRows};
      //       this.gridPaginate(e);
      //       this.msgService.showSuccess("success");
      //       this.msgs = this.msgService.msgs;
      //       this.programDisplay = false;
      //     } else {
      //       this.msgService.showError("Operation Error!");
      //       this.msgs = this.msgService.msgs;
      //     }
      //   })
      // }
      // 打开document
      public toDetailBtn() {
        this.httpService.post("/bpd-proj/bpd/dir/checkDir",{
          projectId: this.parentPrograms.projectStauts,
          dirLevel: "1"
        })
        .subscribe(data => {
          if(data == 1) {
            this.haveFolder = false;
          } else {
            this.haveFolder = true;
          }
          this.selectItem = this.parentPrograms.projectStauts;
          this.createTree();
          this.fileStore = [];
          })
      }
      // create tree
      public createTree() {
        this.httpService.get("/bpd-proj/bpd/dir/getIndexPermDirList?projectId="+this.parentPrograms.projectStauts +"&userCode="+window.localStorage.getItem("user")+"&"+Number(new Date()))
        .subscribe(data => {
          var arr = data ? data : [];
    
          arr.sort(function(a, b) {
              return a.dirId - b.dirId;
          });
          var chd = {},
              o;
          for (var i = arr.length - 1; i >= 0; i--) {
            console.log(arr[i])
              o = arr[i];
              o.value = arr[i].dirId;
              o.label = arr[i].dirEname;
              o.icon = 'fa-clipboard';
              o.itemStore = arr[i];
              o.expanded = true;
              if (o.parentId) {
                  if (!chd[o.parentId]) {
                      chd[o.parentId] = [];
                  }
                  chd[o.parentId].push(o);
                  arr.splice(i, 1);
              }
              if (chd[o.dirId]) {
                  o.children = chd[o.dirId];
                  for (var j = 0; j < o.children.length; j++) {
                      o.children[j].icon = 'fa-file-text-o';
                      o.children[j].label = o.children[j].dirEname;
                      o.children[j].itemStore = o.children[j];
                      o.children[j].expanded = true;
                  }
              }
          }
          
          this.items = arr;
          this.items.push({
            label: 'My Share Folder',
            icon: 'fa-share-square-o'
          })
        })
      }

      public nodeSelect(e) {
        let event: any = {};
        event.item = e.node;
        if(e.node.icon == 'fa-file-text-o') {
          this.haveSelected = true;
          this.normalFolder = true;
        } else {
          this.haveSelected = false;
        }
        this.addChild = true;
        if(e.node.label == "My Share Folder") {
          this.normalFolder = false;
          this.addChild = false;
          this.getShareFileGrid();
          this.shareFileNameSearch = null;
        } else {
          this.getFileGrid();
          this.normalFolder = true;
        }
        this.isManager = e.node.permFlag;
        this.writeRead = e.node.readWitePerm;
      }
      public getShareFileGrid() {
        this.httpService.post('/bpd-proj/bpd/attShareUser/getVList', {
            userCode: window.localStorage.getItem("user"),
            fileFullName: this.shareFileNameSearch,
            sourceType: "doc"
        })
        .subscribe(data => {
            this.shareFileStore = [];
            if(data.length < 10) {
                for(let i = 0; i < 10; i++) {
                    if(!data[i]) {
                        this.shareFileStore.push({
                            "ip": i+1
                        })
                    } else {
                        data[i].id = i + 1;
                        this.shareFileStore.push(data[i])
                    }
                }
            } else {
                for(let i = 0; i < data.length; i++) {
                    data[i].id = i + 1;
                    this.shareFileStore.push(data[i]);
                }
            }
        })
      }
      public getFileGrid() {
        this.httpService.post('/bpd-proj/bpd/att/getVList', {
            dirId: this.selectedFile.itemStore.dirId,
            fileFullName: this.fileNameSearch,
            uploadUserName: this.uploadUserSearch,
            sourceType: "doc"
        })
        .subscribe(data => {
            this.fileStore = [];
            if(data.length < 10) {
                for(let i = 0; i < 10; i++) {
                    if(!data[i]) {
                        this.fileStore.push({
                            "ip": i+1
                        })
                    } else {
                        data[i].id = i + 1;
                        this.fileStore.push(data[i])
                    }
                }
            } else {
                for(let i = 0; i < data.length; i++) {
                    data[i].id = i + 1;
                    this.fileStore.push(data[i]);
                }
            }
        })
      }
      public addFolderBtn() {
        this.addFolderDisplay = true;
        this.folderName = null;
      }
      public modifyNameBtn() {
        this.modifyFolderDisplay = true;
        this.folderName = this.selectedFile.itemStore.dirEname;
      }
      public delFolderBtn() {
        this.confirmationService.confirm({
          message: 'Do you want to delete this record?',
          header: 'Delete Confirmation',
          icon: 'fa fa-trash',
          accept: () => {
            this.httpService.get("/bpd-proj/bpd/dir/delete?dirId="+this.selectedFile.itemStore.dirId+"&"+Number(new Date()))
            .subscribe(data => {
              if(data['code'] == 1) {
                this.msgService.showSuccess("success");
                this.growlLife = 5000;
                this.msgs = this.msgService.msgs;
                this.modifyFolderDisplay = false;
                this.haveSelected = false;
                this.normalFolder = true;
                this.addChild = false;
                this.createTree();
              } else if(data['code'] == 2){
                this.msgService.showInfo("dir Exists!");
                this.growlLife = 300000;
                this.msgs = this.msgService.msgs;
              } else {
                this.msgService.showError("Operation Error!");
                this.growlLife = 5000;
                this.msgs = this.msgService.msgs;
              }
            })
          }
        });
      }
      public addMainFolderBtn() {
        this.httpService.get("/bpd-proj/bpd/dir/createProjDir?projCode="+this.selectItem.programCode+"&projectId="+this.selectItem.programId+"&"+Number(new Date()))
        .subscribe(data => {
          if(data['code'] == '1') {
            this.toDetailBtn();
            this.msgService.showSuccess("Operate Success!");
            this.growlLife = 5000;
            this.msgs = this.msgService.msgs;
          } else if(data['code'] == '2') {
            this.msgService.showInfo("Folder Exists!");
            this.growlLife = 300000;
            this.msgs = this.msgService.msgs;
          } else {
            this.msgService.showError("Operate Failed!");
            this.growlLife = 5000;
            this.msgs = this.msgService.msgs;
          }
        })
      }
      public uploadBtn() {
        this.fileUpLoadDialog = true;
        this.UuId = this.dataManageService.getUuId();
        this.businessId = this.selectItem.programId;
        this.uploadType = true;
        this.uploadNum = 'multiple';
      }
      public fileLookUpEnterSearch($event) {
        if ($event.key === "Enter") {
          this.fileLookUpBtn();
        }
      }
      public fileLookUpBtn() {
        this.getFileGrid();
      }
      public fileClickBtn(item) {
        if(item.allowDownLoad == '1') {
          this.httpService.get("/bpd-proj/bpd/att/downloadFiles?attIds=" + item.attId)
          .subscribe(data => {
            if(data['code'] == 0) {
              this.msgService.showInfo("Can not find file!");
              this.growlLife = 300000;
              this.msgs = this.msgService.msgs; 
            } else {
              let token = window.sessionStorage.getItem("access_token");
              let url: string = "/bpd-proj/bpd/att/downloadFiles?attIds=" + item.attId + '&_=' + Number(new Date());
              if (token) {
                let realToken = token.substr(1, token.length - 2)
                url = url + "&accessToken=" + realToken;
              }
              window.location.href = url;
            }
          })
        } else {
          console.log(item);
        }
      }
      public shareBtn(item) {
        this.fileGridItem = item;
        this.shareFileDialog = true;
        this.httpService.get("/bpd-proj/bpd/attShareUser/getShareUsers?attId="+item.attId+"&"+Number(new Date()))
        .subscribe(data => {
          this.selectUserStore = [];
          if(data) {
            this.shareUserCode = data.userCodes.split(",");
            let userNameArr: any = data.userNames.split(",");
            let userCodeArr: any = data.userCodes.split(",");
            for(let i=0; i<userCodeArr.length; i++) {
              this.selectUserStore.push({
                userName: userNameArr[i],
                userCode: userCodeArr[i]
              })
            }
          } else {
            this.shareUserCode = [];
          }
        })
      }
      public cancelShareBtn(item) {
        this.httpService.get("/bpd-proj/bpd/attShareUser/cancelShare?attId="+item.attId+"&"+Number(new Date()))
        .subscribe(data => {
          if(data['code'] == 1) {
            this.msgService.showSuccess("success");
            this.growlLife = 5000;
            this.msgs = this.msgService.msgs;
            this.getFileGrid();
          } else {
            this.msgService.showError("Operation Error!");
            this.growlLife = 5000;
            this.msgs = this.msgService.msgs;
          }
        })
      }
      public editBtn(item) {
        this.fileUpLoadDialog = true;
        this.UuId = this.dataManageService.getUuId();
        this.businessId = this.selectItem.programId;
        this.fileGridItem = item;
        this.uploadType = false;
        this.uploadNum = null;
      }
      public shareFileEnterSearch($event) {
        if ($event.key === "Enter") {
          this.shareFileBtn();
        }
      }
      public shareFileBtn() {
        let userCodeArr = [];
        for(let i=0; i<this.selectUserStore.length; i++) {
          userCodeArr.push(this.selectUserStore[i].userCode)
        }
        this.httpService.post("/bpd-proj/bpd/attShareUser/batchAddBeforDelete",{
          attId: this.fileGridItem.attId,
          userCodes: userCodeArr.join(","),
          createUser: this.fileGridItem.createUser
        })
        .subscribe(data => {
          if(data['code'] == 1) {
            this.msgService.showSuccess("success");
            this.growlLife = 5000;
            this.msgs = this.msgService.msgs;
            this.shareFileDialog = false;
          } else if(data['code'] == 2){
            this.msgService.showInfo("Can not share!");
            this.growlLife = 300000;
            this.msgs = this.msgService.msgs;
          } else {
            this.msgService.showError("Operation Error!");
            this.growlLife = 5000;
            this.msgs = this.msgService.msgs;
          }
        })
      }
      public shareFileLookUpBtn() {
        this.getShareFileGrid();
      }
      public shareFileClickBtn(item) {
        this.httpService.get("/bpd-proj/bpd/att/downloadFiles?attIds=" + item.attId)
        .subscribe(data => {
          if(data['code'] == 0) {
            this.msgService.showInfo("Can not find file!");
            this.growlLife = 300000;
            this.msgs = this.msgService.msgs; 
          } else {
            let token = window.sessionStorage.getItem("access_token");
            let url: string = "/bpd-proj/bpd/att/downloadFiles?attIds=" + item.attId + '&_=' + Number(new Date());
            if (token) {
              let realToken = token.substr(1, token.length - 2)
              url = url + "&accessToken=" + realToken;
            }
            window.location.href = url;
          }
        }) 
      }
      public onFolderFileUpload(e) {
        var url: string = null;
        if(this.uploadType) {
          url = '/bpd-proj/bpd/att/addAtt?' + Number(new Date()) + '&attId=' + this.UuId + '&dirId='+ this.selectedFile.itemStore.dirId;
        } else {
          url = '/bpd-proj/bpd/att/update?' + Number(new Date()) + '&attId=' + this.fileGridItem.attId + '&uuid=' + this.UuId + '&dirId=' + this.selectedFile.itemStore.dirId;
        }
        this.httpService.get(url)
        .subscribe(data => {
          if (data.code == 1) {
              this.msgService.showSuccess("Operate Success!");
              this.growlLife = 5000;
          } else {
              this.msgService.showError("Operate Failed!");
              this.growlLife = 5000;
          }
          this.msgs = this.msgService.msgs;
          this.getFileGrid();
        })
        this.fileUpLoadDialog = false;
      }
      public checkFolderName() {
        // if(this.folderName.indexOf("/") != 0) {
        //   this.folderName = "111";
        // }
      }
      public addFolderSaveBtn() {
        let num: number = this.selectedFile.itemStore.dirPath.split("/").length + 1;
        this.httpService.post("/bpd-proj/bpd/dir/insert",{
          dirEname: this.folderName,
          parentDirId: this.selectedFile.itemStore.dirId,
          dirPath: this.selectedFile.itemStore.dirPath + '/' + this.folderName,
          projectId: this.selectedFile.itemStore.projectId,
          dirLevel: num
        })
        .subscribe(data => {
          if(data['code'] == 1) {
            this.msgService.showSuccess("success");
            this.growlLife = 5000;
            this.msgs = this.msgService.msgs;
            this.addFolderDisplay = false;
            this.haveSelected = false;
            this.normalFolder = true;
            this.addChild = false;
            this.createTree();
          } else if(data['code'] == 2){
            this.msgService.showInfo("dir Exists!");
            this.growlLife = 300000;
            this.msgs = this.msgService.msgs;
          } else {
            this.msgService.showError("Operation Error!");
            this.growlLife = 5000;
            this.msgs = this.msgService.msgs;
          }
        })
      }
      public modifyFolderSaveBtn() {
        let modifyDirPath = this.selectedFile.itemStore.dirPath.split("/");
        modifyDirPath.pop(-1);
        this.httpService.post("/bpd-proj/bpd/dir/update",{
          dirId: this.selectedFile.itemStore.dirId,
          dirEname: this.folderName,
          dirPath: modifyDirPath.concat([this.folderName]).join("/"),
          parentDirId: this.selectedFile.itemStore.parentDirId
        })
        .subscribe(data => {
          if(data['code'] == 1) {
            this.msgService.showSuccess("success");
            this.growlLife = 5000;
            this.msgs = this.msgService.msgs;
            this.modifyFolderDisplay = false;
            this.haveSelected = false;
            this.normalFolder = true;
            this.addChild = false;
            this.createTree();
          } else if(data['code'] == 2){
            this.msgService.showInfo("dir Exists!");
            this.growlLife = 300000;
            this.msgs = this.msgService.msgs;
          } else {
            this.msgService.showError("Operation Error!");
            this.growlLife = 5000;
            this.msgs = this.msgService.msgs;
          }
        })
      }
}