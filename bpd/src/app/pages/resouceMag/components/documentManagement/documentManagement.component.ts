import { Component, OnInit } from '@angular/core';
import 'style-loader!./documentManagement.scss';
import { SelectItem, TreeNode, ConfirmationService } from 'primeng/primeng';
import { HttpDataService } from '../../../service/http.service';
import { MessageService } from '../../../service/message.service';
import { DataManageService } from '../../../service/dataManage.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'document-management',
  templateUrl: './documentManagement.html',
  providers: [HttpDataService, MessageService, ConfirmationService, DataManageService]
})
export class DocumentManagement implements OnInit{

	  public gridStore: any = [];

    public gridStoreLen: number;

    public gridStoreRows: any = '15';

    public gridStoreFirst: any = 0;

    public gridStorePage: any = 0;

    public msgs: any;

    public growLife: number = 5000;

    public programCodeSearch: string = null;

    public dialogTitle: string = null;

    public loginUser: string = window.localStorage.getItem("user"); 

	constructor(
    private service: HttpDataService, 
    private msgservice: MessageService,
    private confirmationService: ConfirmationService,
    private dataManageService: DataManageService,
    private sanitizer: DomSanitizer
    ) {

	}
    
    ngOnInit() {
    	this.service.post("/bpd-proj/bpd/program/getVList",{
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
          data[i].projManagerStr = data[i].projManager ? data[i].projManager.split("@@@")[0] : null;
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
      this.service.post("/bpd-proj/bpd/program/getVList",{
        "page": {
          "page": Number(e.page) - (-1),
          "rows": e.rows
        },
        programCode: this.programCodeSearch
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
            data[i].projManagerStr = data[i].projManager ? data[i].projManager.split("@@@")[0] : null;
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

  //  toDetail

  public dialog: boolean = false;

  public selectItem: any;

  public haveFolder: boolean = true;

  public toDetailBtn(item) {
    this.service.post("/bpd-proj/bpd/dir/checkDir",{
      projectId: item.programId,
      dirLevel: "1"
    })
    .subscribe(data => {
      if(data == 1) {
        this.haveFolder = false;
      } else {
        this.haveFolder = true;
      }
      this.isManager = 3;
      this.selectItem = item;
      this.dialogTitle = item.programCode;
      this.createTree(item,false);
      this.fileStore = [];
      this.dialog = true;
      this.haveSelected = false;
      })
  }

  // Switch Project

  public selectInvestmentDialog: boolean = false;

  public switchProjprogramCodeSerch: string = null;

  public switchProj() {
    this.switchProjprogramCodeSerch = null;
    this.selectInvestmentDialog = true;
  }

  public dbclick(e) {
    this.toDetailBtn(e.data);
    this.selectInvestmentDialog = false;
    this.haveSelected = false;
    this.addChild = false;
  }

  // 授权

  public documentAuthorize: boolean = false;

  public authorizeStore: any = [];

  public setAuthorizeDialog: boolean = false;

  public selectedFolders: any = [];

  public selectedRoles: any = [];

  public roleStore: any = [];

  public folderListStore: any = [];

  public getAuthorizeList() {
    this.service.post("/bpd-proj/bpd/dirRole/getVList",{
      projectId: this.selectItem.programId
    })
    .subscribe(data => {
      this.authorizeStore = [];
      if(data.length < 10) {
          for(let i = 0; i < 10; i++) {
              if(!data[i]) {
                  this.authorizeStore.push({
                      "ip": i+1
                  })
              } else {
                  data[i].id = i + 1;
                  this.authorizeStore.push(data[i])
              }
          }
      } else {
          for(let i = 0; i < data.length; i++) {
              data[i].id = i + 1;
              this.authorizeStore.push(data[i]);
          }
      }
    })
  }

  public authorizeBtn() {
    this.getAuthorizeList();
    this.documentAuthorize = true;
  }

  public addAuthorizeBtn() {
    this.service.get("/bpd-proj/bpd/petMember/getPetRoleCombobox?programId="+this.selectItem.programId)
    .subscribe(data => {
      this.roleStore = [];
      for(let i=0; i<data.length; i++) {
        this.roleStore.push({
          roleCode: data[i].value,
          roleName: data[i].label
        })
      }
    })
    this.service.post("/bpd-proj/bpd/dir/getVList",{
      projectId: this.selectItem.programId,
      dirLevel: 1
    })
    .subscribe(data => {
      this.selectedFolders = [];
      this.selectedRoles = [];
      this.folderListStore = data;
      this.setAuthorizeDialog = true;
    })
  }

  public setAuthorizeSaveBtn() {
    this.service.post("/bpd-proj/bpd/dirRole/addDirRole",{
      projectId: this.selectItem.programId,
      dirIds: this.selectedFolders.join(","),
      roleCodes: this.selectedRoles.join(","),
      writeFlag: 1
    })
    .subscribe(data => {
      if(data['code'] == 1) {
        this.msgservice.showSuccess("Success");
        this.growLife = 5000;
        this.msgs = this.msgservice.msgs;
        this.setAuthorizeDialog = false;
        this.getAuthorizeList();
        this.createTree(this.selectItem,true);
      } else {
        this.msgservice.showError("Operation Error!");
        this.growLife = 5000;
        this.msgs = this.msgservice.msgs;
      }
    })
  }

  public setAuthorizeCancelBtn() {
    this.setAuthorizeDialog = false;
  }

  public delAuthorizeBtn(item) {
    this.confirmationService.confirm({
      message: 'Do You Want To Delete This Record?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        this.service.get("/bpd-proj/bpd/dirRole/deleteDirRole?dirRoleId="+item.dirRoleId+"&"+Number(new Date()))
        .subscribe(data => {
          if(data['code'] == 1) {
            this.msgservice.showSuccess("Success");
            this.growLife = 5000;
            this.msgs = this.msgservice.msgs;
            this.getAuthorizeList();
            this.createTree(this.selectItem,true);
          } else if(data['code'] == 2){
            this.msgservice.showInfo("Can Not Delete!");
            this.growLife = 300000;
            this.msgs = this.msgservice.msgs;
          } else {
            this.msgservice.showError("Operation Error!");
            this.growLife = 5000;
            this.msgs = this.msgservice.msgs;
          }
        })
      }
    });
  }

  // 文件列表

  public shareFileNameSearch: string = null;

  public shareFileStore:any = [];

  public shareFileEnterSearch($event) {
    if ($event.key === "Enter") {
      this.shareFileBtn();
    }
  }
  
  public shareFileLookUpBtn() {
    this.getShareFileGrid(this.selectedFile);
  }

  public fileLookUpEnterSearch($event) {
    if ($event.key === "Enter") {
      this.fileLookUpBtn();
    }
  }
  
  public fileLookUpBtn() {
    this.getFileGrid();
  }

  public fileStore:any = [];

  public uploadUserSearch: string = null;

  public fileNameSearch: string = null;

  public fileUpLoadDialog: boolean = false;  

  public budgetFileUpLoadList: any[] = [];

  public budgetFileUpLoadUrlFirstStep: string = "/bpd-proj/bpd/att/batchUpload";
  
  public UuId: string;

  public businessId: string = null;

  public uploadType: boolean = false;

  public fileGridItem: any;

  public uploadNum: string = 'multiple';


  // add file
  public uploadBtn() {
    this.fileUpLoadDialog = true;
    this.UuId = this.dataManageService.getUuId();
    this.businessId = this.selectItem.programId;
    this.uploadType = true;
    this.uploadNum = 'multiple';
  }

  // update file
  public editBtn(item) {
    this.fileUpLoadDialog = true;
    this.UuId = this.dataManageService.getUuId();
    this.businessId = this.selectItem.programId;
    this.fileGridItem = item;
    this.uploadType = false;
    this.uploadNum = null;
  }

  // share file
  public shareFileDialog: boolean = false;

  public shareUserCode: any = [];

  public shareBtn(item) {
    this.fileGridItem = item;
    this.shareFileDialog = true;
    this.service.get("/bpd-proj/bpd/attShareUser/getShareUsers?attId="+item.attId+"&"+Number(new Date()))
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

  // cancel Share file
  public cancelShareBtn() {
    this.confirmationService.confirm({
      message: 'Do you want to delete these record?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
          this.service.get("/bpd-proj/bpd/attShareUser/cancelShare?attId="+this.fileGridItem.attId+"&"+Number(new Date()))
          .subscribe(data => {
            if(data['code'] == 1) {
              this.msgservice.showSuccess("Success");
              this.growLife = 5000;
              this.msgs = this.msgservice.msgs;
              this.shareFileDialog = false;
              this.getFileGrid();
            } else {
              this.msgservice.showError("Operation Error!");
              this.growLife = 5000;
              this.msgs = this.msgservice.msgs;
            }
          })
      }
    });
  }

  // share file download
  public shareFileClickBtn(item) {
    this.service.get("/bpd-proj/bpd/att/downloadFiles?attIds=" + item.attId)
    .subscribe(data => {
      if(data['code'] == 0) {
        this.msgservice.showInfo("Can not find file!");
        this.growLife = 300000;
        this.msgs = this.msgservice.msgs; 
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

  // download file
  public fileClickBtn(item) {
    if(item.allowDownLoad == '1') {
      this.service.get("/bpd-proj/bpd/att/downloadFiles?attIds=" + item.attId)
      .subscribe(data => {
        if(data['code'] == 0) {
          this.msgservice.showInfo("Can not find file!");
          this.growLife = 300000;
          this.msgs = this.msgservice.msgs; 
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

  // delete file
  public delBtn(item) {
    this.confirmationService.confirm({
      message: 'Do You Want To Delete This Record?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        this.service.get("/bpd-proj/bpd/att/deleteDocFile?attId="+item.attId+"&"+Number(new Date()))
        .subscribe(data => {
          if(data['code'] == "1") {
            this.msgservice.showSuccess("Success");
            this.growLife = 5000;
            this.msgs = this.msgservice.msgs;
            this.getFileGrid();
          } else if(data['code'] == "2"){
            this.msgservice.showInfo("Please Cancel Share File!");
            this.growLife = 300000;
            this.msgs = this.msgservice.msgs;
          } else {
            this.msgservice.showError("Operation Error!");
            this.growLife = 5000;
            this.msgs = this.msgservice.msgs;
          }
        })
      }
    });
  }
  
  // get file grid

  public getFileGrid() {
    this.service.post('/bpd-proj/bpd/att/getVList', {
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

  // get share file grid

  public shareFileType: string = "";
  public getShareFileGrid(selectedFile) {
    if(selectedFile.label == "My Share Folder") {
      this.shareFileType = "1"  //  我分享的文件
      this.service.get("/bpd-proj/bpd/attShareUser/getMyShare?projectId="+this.selectItem.programId+"&createUser="+window.localStorage.getItem("user"))
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
    } else {
      this.shareFileType = "0"  //  分享给我的文件
      this.service.post('/bpd-proj/bpd/attShareUser/getVList', {
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
  }

  public onFolderFileUpload(e) {
    var url: string = null;
    if(this.uploadType) {
      url = '/bpd-proj/bpd/att/addAtt?' + Number(new Date()) + '&attId=' + this.UuId + '&dirId='+ this.selectedFile.itemStore.dirId;
    } else {
      url = '/bpd-proj/bpd/att/update?' + Number(new Date()) + '&attId=' + this.fileGridItem.attId + '&uuid=' + this.UuId + '&dirId=' + this.selectedFile.itemStore.dirId;
    }
    this.service.get(url)
    .subscribe(data => {
      if (data.code == 1) {
          this.msgservice.showSuccess("Operate Success!");
          this.growLife = 5000;
      } else {
          this.msgservice.showError("Operate Failed!");
          this.growLife = 5000;
      }
      this.msgs = this.msgservice.msgs;
      this.getFileGrid();
    })
    this.fileUpLoadDialog = false;
  }

  // add main folder

  public addMainFolderBtn() {
    this.service.get("/bpd-proj/bpd/dir/createProjDir?projCode="+this.selectItem.programCode+"&projectId="+this.selectItem.programId+"&"+Number(new Date()))
    .subscribe(data => {
      if(data['code'] == '1') {
        this.toDetailBtn(this.selectItem);
        this.msgservice.showSuccess("Operate Success!");
        this.growLife = 5000;
        this.msgs = this.msgservice.msgs;
      } else if(data['code'] == '2') {
        this.msgservice.showInfo("Folder Exists!");
        this.growLife = 300000;
        this.msgs = this.msgservice.msgs;
      } else {
        this.msgservice.showError("Operate Failed!");
        this.growLife = 5000;
        this.msgs = this.msgservice.msgs;
      }
    })
  }

  // tree

  public items: any = [];

  public selectedFile: any = [];

  public haveSelected: boolean = false;

  public normalFolder: boolean = true;

  public addChild: boolean = true;

  public isManager: any = 3;

  public writeRead: string = "2";

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
      this.localJump = false;
      this.normalFolder = false;
      this.addChild = false;
      this.getShareFileGrid(this.selectedFile);
      this.shareFileNameSearch = null;
    } else if(e.node.label == "Share Me Folder") {
      this.localJump = false;
      this.normalFolder = false;
      this.addChild = false;
      this.getShareFileGrid(this.selectedFile);
      this.shareFileNameSearch = null;
    } else if(e.node.label == "Program Master Timing") {
      this.localJump = true;
      this.getMasterData();
      this.normalFolder = true;
    } else if(e.node.label == "Scorecard") {
      this.localJump = true;
      this.getScorecardData();
      this.normalFolder = true;
    } else {
      this.localJump = false;
      this.getFileGrid();
      this.normalFolder = true;
    }
    this.isManager = e.node.permFlag;
    this.writeRead = e.node.readWitePerm;
  }

  public previewDialog: boolean = false;
  public specialURL: any = "";
  public localJumpItem: any = {};
  public localJumpBtn(item) {
    this.localJumpItem = item;
    if(item.sourceType == "masterData") {
      let timeStamp = new Date().getTime();
      this.specialURL = this.sanitizer.bypassSecurityTrustResourceUrl("assets/drawTimeSheet/svg.html?" + timeStamp + "&adProjectCode=" + item.filePath.split(",")[1] + "&timingId=" + item.filePath.split(",")[0]);
      this.previewDialog = true;
    }
    if(item.sourceType == "Scorecard") {
      this.statusDisplay = true;
      this.statusStore = [{id:'-'},{id:'-'},{id:'-'},{id:'-'},{id:'-'},{id:'-'},{id:'-'},{id:'-'},{id:'-'},{id:'-'}];
      this.service.get("/bpd-proj/bpd/programScorecard/getList1?adProjectCode="+item.adProjectCode)
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
  }

  //  scorecard 

    public statusDisplay: boolean = false;

    public preStatusStore: any = [];

    public preStatus: string = null;

    public curStatusStore: any = [];

    public curStatus: string = null;

    public statusStore: any = [{id:'-'},{id:'-'},{id:'-'},{id:'-'},{id:'-'},{id:'-'},{id:'-'},{id:'-'},{id:'-'},{id:'-'}];

    public title1: string = null;

    public title2: string = null;

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
      this.service.post("/bpd-proj/bpd/programScorecardStatus/getVProgramScorecardStatusDocument",{
        valueOfMilestone1: this.preStatus,
        valueOfMilestone2: this.curStatus,
        adProjectCode: this.localJumpItem.adProjectCode
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
      let url: string = "/bpd-proj/bpd/programScorecardStatus/exportExcel" + '?valueOfMilestone1=' + this.preStatus + '&valueOfMilestone2=' + this.curStatus + '&adProjectCode=' + this.localJumpItem.adProjectCode + '&' + Number(new Date());
      if (token) {
          let realToken = token.substr(1, token.length - 2)
          url = url + "&accessToken=" + realToken;
      }
      window.location.href = url;
    }

  //  scorecard

  public localJump: boolean = false;
  public getMasterData() {
    this.service.post('/bpd-proj/bpd/att/getVList', {
        dirId: this.selectedFile.itemStore.dirId,
        fileFullName: this.fileNameSearch,
        uploadUserName: this.uploadUserSearch,
        sourceType: "masterData"
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

  public getScorecardData() {
    this.service.post('/bpd-proj/bpd/att/getVList', {
        dirId: this.selectedFile.itemStore.dirId,
        fileFullName: this.fileNameSearch,
        uploadUserName: this.uploadUserSearch,
        sourceType: "Scorecard"
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

  public addFolderDisplay: boolean = false;

  public folderName: string = null;

  public addFolderBtn() {
    this.addFolderDisplay = true;
    this.folderName = null;
    console.log(this.selectedFile)
  }

  public addFolderSaveBtn() {
    let num: number = this.selectedFile.itemStore.dirPath.split("/").length + 1;
    this.service.post("/bpd-proj/bpd/dir/insert",{
      dirEname: this.folderName,
      parentDirId: this.selectedFile.itemStore.dirId,
      dirPath: this.selectedFile.itemStore.dirPath + '/' + this.folderName,
      projectId: this.selectedFile.itemStore.projectId,
      dirLevel: num
    })
    .subscribe(data => {
      if(data['code'] == 1) {
        this.msgservice.showSuccess("Success");
        this.growLife = 5000;
        this.msgs = this.msgservice.msgs;
        this.addFolderDisplay = false;
        this.haveSelected = false;
        this.normalFolder = true;
        this.addChild = false;
        this.createTree(this.selectItem,true);
      } else if(data['code'] == 2){
        this.msgservice.showInfo("Dir Name Exists!");
        this.growLife = 300000;
        this.msgs = this.msgservice.msgs;
      } else {
        this.msgservice.showError("Operation Error!");
        this.growLife = 5000;
        this.msgs = this.msgservice.msgs;
      }
    })
  }

  public addFolderCancelBtn() {
    this.addFolderDisplay = false;
  }

  public modifyFolderDisplay: boolean = false;

  public modifyNameBtn() {
    this.modifyFolderDisplay = true;
    this.folderName = this.selectedFile.itemStore.dirEname;
  }

  public modifyFolderSaveBtn() {
    let modifyDirPath = this.selectedFile.itemStore.dirPath.split("/");
    modifyDirPath.pop(-1);
    this.service.post("/bpd-proj/bpd/dir/update",{
      dirId: this.selectedFile.itemStore.dirId,
      dirEname: this.folderName,
      dirPath: modifyDirPath.concat([this.folderName]).join("/"),
      parentDirId: this.selectedFile.itemStore.parentDirId
    })
    .subscribe(data => {
      if(data['code'] == 1) {
        this.msgservice.showSuccess("Success");
        this.growLife = 5000;
        this.msgs = this.msgservice.msgs;
        this.modifyFolderDisplay = false;
        this.haveSelected = false;
        this.normalFolder = true;
        this.addChild = false;
        this.createTree(this.selectItem,true);
      } else if(data['code'] == 2){
        this.msgservice.showInfo("Dir Name Exists!");
        this.growLife = 300000;
        this.msgs = this.msgservice.msgs;
      } else {
        this.msgservice.showError("Operation Error!");
        this.growLife = 5000;
        this.msgs = this.msgservice.msgs;
      }
    })
  }

  public modifyFolderCancelBtn() {
    this.modifyFolderDisplay = false;
  }

  public delFolderBtn() {
    this.confirmationService.confirm({
      message: 'Do You Want To Delete This Record?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        this.service.get("/bpd-proj/bpd/dir/delete?dirId="+this.selectedFile.itemStore.dirId+"&"+Number(new Date()))
        .subscribe(data => {
          if(data['code'] == 1) {
            this.msgservice.showSuccess("Success");
            this.growLife = 5000;
            this.msgs = this.msgservice.msgs;
            this.modifyFolderDisplay = false;
            this.haveSelected = false;
            this.normalFolder = true;
            this.addChild = false;
            this.createTree(this.selectItem,true);
          } else if(data['code'] == 2){
            this.msgservice.showInfo("Dir Name Exists!");
            this.growLife = 300000;
            this.msgs = this.msgservice.msgs;
          } else {
            this.msgservice.showError("Operation Error!");
            this.growLife = 5000;
            this.msgs = this.msgservice.msgs;
          }
        })
      }
    });
  }

  // create tree 
  public createTree(item,expanded) {
    this.service.get("/bpd-proj/bpd/dir/getPermDirList?projectId="+item.programId +"&userCode="+window.localStorage.getItem("user")+"&"+Number(new Date()))
    .subscribe(data => {
      var arr = data ? data : [];
      this.fileStore = [];
      this.shareFileStore = [];
      this.items = this.dataManageService.getTree(arr,expanded);
      this.items.push({
        label: 'Share Me Folder',
        icon: 'fa-download'
      },{
        label: 'My Share Folder',
        icon: 'fa-share-square-o'
      })
    })
  }

  // check folderName
  
  public checkFolderName() {
    // if(this.folderName.indexOf("/") != 0) {
    //   this.folderName = "111";
    // }
  }

  // share file 

  public searchDialog: boolean = false;

  public dialogDepartment: string = null;

  public dialogUserName: string = null;

  public managerData: any = [];

  public managerDataRows: any = '10';

  public managerDataFirst: any = 0;

  public managerDataLen: number;

  public shareFileBtn() {
    let userCodeArr = [];
    for(let i=0; i<this.selectUserStore.length; i++) {
      userCodeArr.push(this.selectUserStore[i].userCode)
    }
    this.service.post("/bpd-proj/bpd/attShareUser/batchAddBeforDelete",{
      attId: this.fileGridItem.attId,
      userCodes: userCodeArr.join(","),
      createUser: this.fileGridItem.createUser
    })
    .subscribe(data => {
      if(data['code'] == 1) {
        this.msgservice.showSuccess("Success");
        this.growLife = 5000;
        this.msgs = this.msgservice.msgs;
        this.shareFileDialog = false;
      } else if(data['code'] == 2){
        this.msgservice.showInfo("Can Not Share!");
        this.growLife = 300000;
        this.msgs = this.msgservice.msgs;
      } else {
        this.msgservice.showError("Operation Error!");
        this.growLife = 5000;
        this.msgs = this.msgservice.msgs;
      }
    })
  }

  public getUser() {
    this.managerSelectedStore = [];
    this.service.post("/bpd-proj/bpd/user/getVList", {
      "page": {
        "page": 1,
        "rows": 10
      },
      "departmentName" : this.dialogDepartment,
      "userName": this.dialogUserName,
      "userCodes": this.shareUserCode
    })
    .subscribe(data1 => {
      this.managerData = [];
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
      this.searchDialog = true;
    })
  }

  public managerPaginate(e) {
    this.service.post("/bpd-proj/bpd/user/getVList",{
      "page": {
        "page": e.page + 1,
        "rows": e.rows
      },
      "departmentName" : this.dialogDepartment,
      "userName": this.dialogUserName,
      "userCodes": this.shareUserCode
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
      this.managerlookClick();
    }
  }
  
  public managerlookClick() {
    let e = {page: 0, first: 0, rows: "10"};
        this.managerPaginate(e);
  }

  public managerSelectedStore: any = [];

  public managerSaveBtn() {
    for(let i=0; i<this.managerSelectedStore.length; i++) {
      this.selectUserStore.push({
        userName: this.managerSelectedStore[i].userName,
        userCode: this.managerSelectedStore[i].userCode
      })
    }
    this.searchDialog = false;
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
};