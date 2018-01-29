import {
  Component,
  OnInit
} from '@angular/core';
import 'style-loader!./investmentWbs.scss';
import {
  SelectItem
} from 'primeng/primeng';
import {
  Message,
  TreeNode
} from 'primeng/primeng';
import {
  MessageService
} from '../../../service/message.service';
import {
  HttpDataService
} from '../../../service/http.service';
import {
  DataManageService
} from '../../../service/dataManage.service';
import {
  DeleteComfirmService
} from '../../../service/deleteDialog.service';


@Component({
  selector: 'investment-wbs',
  templateUrl: './investmentWbs.html',
})

export class InvestmentWbs {
  tableTitle: string = "All";
  addDialog: Boolean = false;
  addChildrenDialog: Boolean = false;
  addVppsDialog: Boolean = false;
  deleteDialog: Boolean = false;
  confirmDialog: Boolean = false;
  setVppsDialog: Boolean = false;
  addChildrenFlag: Boolean = true;
  deleteVppsDialog: Boolean = false;

  listData: any[] = [];
  baseData: TreeNode[];
  vppsData: any[] = [];
  msgs: Message[];
  growLife: number = 5000;

  private modifyFlag: string = "";

  parentCode: string;
  dialogVppsLevelFull: string = "";
  itemCode: string;
  olderCode: string;
  itemName: string;
  selectedList: string;
  selectedListData: any = {};
  selectedFile: any;
  selectedIndex: number;
  dialogDescription: string;

  public localStorageAuthority: Boolean;
  public flagAuthority: Boolean;

  constructor(private httpService: HttpDataService, private messageService: MessageService, private dataManageService: DataManageService, private deleteService: DeleteComfirmService) {

  }

  ngOnInit() {
    this.httpService.post("/bpd-proj/bpd/regionCategory/getVList", {})
      .subscribe(data => {
        this.listData = data;
      })
    // this.httpService.post("/bpd-proj/bpd/investWbs/getTreeList", {})
    //   .subscribe(data => {
    //     console.log(data);
    //     this.baseData = data.data;
    //   })
    // console.log(this.addChildrenFlag);
    this.localStorageAuthority = this.dataManageService.buttonAuthority("Maintain WBS Code");
  }



  /**
   * 列点击事件
   * 
   * @param {any} event 
   * @memberof InvestmentWbs
   */
  listClick(event) {
    if (event.data.catFlag == 1) {
      this.flagAuthority = false;
    } else {
      this.flagAuthority = true;
    }
    console.log(event);
    this.selectedListData = event.data;
    this.httpService.post("/bpd-proj/bpd/investWbs/getTreeList", {
      "regionCatCode": event.data.regionCategoryCode,
      "catFlag": event.data.catFlag
    })
      .subscribe(data => {
        // console.log(data);
        this.baseData = data.data;

      })
    for (let i = 0; i < this.listData.length; i++) {
      if (event.data.regionCategoryCode == this.listData[i].regionCategoryCode) {
        this.tableTitle = this.listData[i].regionCategoryNameEnglish;
      }
    }
    this.addChildrenFlag = true;
  }

  /**
   * 树表点击事件
   * 
   * @param {any} $event 
   * @memberof InvestmentWbs
   */
  nodeSelect($event) {
    // console.log(this.selectedFile.data.parentId);
    this.parentCode = this.selectedFile.data.parentId;

    // console.log(!this.selectedList,!!this.parentCode,this.parentCode);
    if (this.selectedListData.regionCategoryCode) {
      if (!this.parentCode) {
        this.addChildrenFlag = false;
      } else {
        this.addChildrenFlag = true;
      }
    } else {
      this.addChildrenFlag = true;
    }
  }

  /**
   * 添加模态框显示
   * 
   * @memberof RegionTemplate
   */
  addClick() {
    this.parentCode = "";
    this.itemCode = "";
    this.itemName = "";
    this.dialogDescription = "";
    this.modifyFlag = "add";
    this.addDialog = true;
  }

  /**
   * 添加确认
   * 
   * @memberof RegionTemplate
   */
  addSave() {
    if (Number(this.itemCode) < 10 && String(this.itemCode).length < 2) {
      this.itemCode = "00" + this.itemCode;
    } else if (Number(this.itemCode) < 100 && String(this.itemCode).length < 3) {
      this.itemCode = "0" + this.itemCode
    }
    let _that = this;
    if (this.modifyFlag == "add") {
      this.httpService.post("/bpd-proj/bpd/investWbs/insertWbs", {
        "wbsCodeLive": this.itemCode.toString(),
        "wbsName": this.itemName,
        "regionCatCode": this.selectedListData.regionCategoryCode,
        "wbsDescription": this.dialogDescription
      })
        .subscribe(data => {
          if ("1" == data.code) { //操作成功
            _that.growLife = 5000;
            _that.messageService.showSuccess('Operation succeeded!');
            _that.baseData.unshift({
              data: {
                "wbsCodeLive": _that.itemCode.toString(),
                "wbsCode": _that.itemCode.toString(),
                "id": _that.itemCode.toString(),
                "wbsName": _that.itemName,
                "regionCatCode": _that.selectedListData.regionCategoryCode,
                "wbsDescription": _that.dialogDescription
              },
              children: []
            })
          } else if (data.code == "5") {
            this.growLife = 999999;
            this.messageService.showInfo('WBS Code Exists!');
          } else { //操作失败
            this.growLife = 5000;
            this.messageService.showError('Operation failed!');
          }
          //获取操作信息
          this.msgs = this.messageService.msgs;
          // this.httpService.post("/bpd-proj/bpd/investWbs/getTreeList", {
          //   "regionCatCode": this.selectedListData.regionCategoryCode
          // })
          //   .subscribe(data => {
          //     this.baseData = data.data;

          //   })
        })
    } else if (this.modifyFlag == "edit") {
      this.httpService.post("/bpd-proj/bpd/investWbs/update", {
        "wbsCode": this.selectedFile.data.wbsCode,
        "orderWbsCode": this.selectedFile.data.wbsCode,
        "wbsCodeLive": this.itemCode.toString(),
        "regionCatCode": this.selectedListData.regionCategoryCode,
        "wbsName": this.itemName,
        "wbsDescription": this.dialogDescription
      })
        .subscribe(data => {
          if ("1" == data.code) { //操作成功
            this.growLife = 5000;
            this.messageService.showSuccess('Operation succeeded!');
            this.selectedFile.data.wbsCodeLive = this.itemCode.toString();
            this.selectedFile.data.wbsName = this.itemName;
            this.selectedFile.data.wbsDescription = this.dialogDescription;
          } else if (data.code == "5") {
            this.growLife = 999999;
            this.messageService.showInfo('WBS Code Exists!');
          } else if (data.code == "3") {
            this.growLife = 999999;
            this.messageService.showInfo("There Is A Buget In This Wbs!");
          } else { //操作失败
            this.growLife = 5000;
            this.messageService.showError('Operation failed!');
          }
          //获取操作信息
          this.msgs = this.messageService.msgs;
          // this.httpService.post("/bpd-proj/bpd/investWbs/getTreeList", {
          //   "regionCatCode": this.selectedListData.regionCategoryCode
          // })
          //   .subscribe(data => {
          //     this.baseData = data.data;

          //   })
        })
    }

    this.addDialog = false;
  }

  /**
   * 添加取消
   * 
   * @memberof RegionTemplate
   */
  addCancle() {

    this.parentCode = "";
    this.itemCode = "";
    this.itemName = "";
    this.addDialog = false;
  }

  /**
   * 添加子页面显示
   * 
   * @memberof InvestmentWbs
   */
  addChildrenClick() {
    this.parentCode = this.selectedFile.data.id;
    this.modifyFlag = "add";
    this.addChildrenDialog = true;
    this.dialogDescription = "";
    this.itemCode = "";
    this.itemName = "";
  }

  /**
   * 添加子节点确认
   * 
   * @memberof InvestmentWbs
   */
  addChildrenSave() {
    if (Number(this.itemCode) < 10 && String(this.itemCode).length < 2) {
      this.itemCode = "00" + this.itemCode;
    } else if (Number(this.itemCode) < 100 && String(this.itemCode).length < 3) {
      this.itemCode = "0" + this.itemCode
    }
    let _that = this;
    if (this.modifyFlag == "add") {
      this.httpService.post("/bpd-proj/bpd/investWbs/insertWbs", {
        "wbsCodeLive": this.itemCode.toString(),
        "wbsName": this.itemName,
        "regionCatCode": this.selectedListData.regionCategoryCode,
        "parentWbsCode": this.parentCode.toString(),
        "wbsDescription": this.dialogDescription,
      })
        .subscribe(data => {
          if ("1" == data.code) { //操作成功
            // this.httpService.post("/bpd-proj/bpd/investWbs/getTreeList", {
            //   "regionCatCode": this.selectedListData.regionCategoryCode
            // })
            //   .subscribe(data => {
            //     // console.log(data);
            //     this.baseData = data.data;

            //   })
            _that.growLife = 5000;
            _that.messageService.showSuccess('Operation succeeded!');
            for (let i = 0; i < _that.baseData.length; i++) {
              if (_that.baseData[i].data.id === _that.selectedFile.data.id) {
                _that.baseData[i].children.unshift({
                  data: {
                    "wbsCodeLive": _that.itemCode.toString(),
                    "orderWbsCode": _that.selectedFile.data.id + _that.itemCode.toString(),
                    "id": _that.selectedFile.data.id + _that.itemCode.toString(),
                    "wbsName": _that.itemName,
                    "wbsDescription": _that.dialogDescription,
                    "parentId": _that.selectedFile.data.id
                  },
                  children: []
                })
              }
            }

          } else if (data.code == "3") {
            this.growLife = 999999;
            this.messageService.showInfo('WBS Code Exists!');
          } else { //操作失败
            this.growLife = 5000;
            this.messageService.showError('Operation failed!');
          }
          //获取操作信息
          this.msgs = this.messageService.msgs;
        })
    } else if (this.modifyFlag == "edit") {
      this.httpService.post("/bpd-proj/bpd/investWbs/update", {
        "wbsCode": this.selectedFile.data.id,
        "orderWbsCode": this.selectedFile.data.id,
        "id": this.selectedFile.data.id,
        "wbsCodeLive": this.itemCode.toString(),
        "wbsName": this.itemName,
        "regionCatCode": this.selectedListData.regionCategoryCode,
        "parentWbsCode": this.parentCode.toString(),
        "wbsDescription": this.dialogDescription
      })
        .subscribe(data => {
          if ("1" == data.code) { //操作成功
            this.growLife = 5000;
            this.messageService.showSuccess('Operation succeeded!');
            this.selectedFile.data.orderWbsCode = this.selectedFile.data.id = this.selectedFile.data.wbsCode = this.selectedFile.data.parentId + this.itemCode.toString();
            this.selectedFile.data.wbsCodeLive = this.itemCode.toString();
            this.selectedFile.data.wbsName = this.itemName;
            this.selectedFile.data.wbsDescription = this.dialogDescription;
            // this.httpService.post("/bpd-proj/bpd/investWbs/getTreeList", {
            //   "regionCatCode": this.selectedListData.regionCategoryCode
            // })
            //   .subscribe(data => {
            //     // console.log(data);
            //     this.baseData = data.data;

            //   })
          } else if (data.code == "5") {
            this.growLife = 999999;
            this.messageService.showInfo('WBS Code Exists!');
          } else { //操作失败
            this.growLife = 5000;
            this.messageService.showError('Operation failed!');
          }
          //获取操作信息
          this.msgs = this.messageService.msgs;
        })
    }
    this.addChildrenDialog = false;
  }

  /**
   * 添加子页面取消
   * 
   * @memberof InvestmentWbs
   */
  addChildrenCancel() {

    this.addChildrenDialog = false;
    this.parentCode = "";
    this.itemCode = "";
    this.itemName = "";
  }

  /**
   * 修改弹窗展示
   * 
   * @memberof InvestmentWbs
   */
  editClick(idx, data) {
    this.modifyFlag = "edit";
    var that = this;
    setTimeout(function () {
      (function () {
        if (!that.parentCode) {
          // that.olderCode = that.selectedFile.data.wbsCode;
          that.itemCode = that.selectedFile.data.wbsCodeLive;
          that.itemName = that.selectedFile.data.wbsName;
          that.dialogDescription = that.selectedFile.data.wbsDescription;
          that.addDialog = true;
        } else {
          that.parentCode = that.selectedFile.data.parentId;
          that.dialogDescription = that.selectedFile.data.wbsDescription;
          that.itemCode = that.selectedFile.data.wbsCodeLive;
          that.itemName = that.selectedFile.data.wbsName;
          that.addChildrenDialog = true;
        };
      })();
    }, 0);
    // if (!this.parentCode) {
    //   this.olderCode = this.selectedFile.data.wbsCode;
    //   this.itemCode = this.selectedFile.data.wbsCode;
    //   this.itemName = this.selectedFile.data.wbsName;
    //   this.addDialog = true;
    // } else {
    //   this.olderCode = this.selectedFile.data.wbsCode;
    //   this.parentCode = this.selectedFile.data.parentCode;
    //   this.itemCode = this.selectedFile.data.wbsCode;
    //   this.itemName = this.selectedFile.data.wbsName;
    //   this.addChildrenDialog = true;
    // };
  }


  /**
   * 删除模态框弹出
   * 
   * @memberof RegionTemplate
   */
  deleteClick(idx, data) {
    this.selectedIndex = idx;
    let _that = this;
    // this.deleteDialog = true;
    this.deleteService.confirm(() => {
      this.httpService.get("/bpd-proj/bpd/investWbs/delete?" + Number(new Date()) + "&wbsCode=" + this.selectedFile.data.id + "&regionCatCode=" + this.selectedFile.data.regionCatCode)
        .subscribe(data => {
          if ("1" == data.code) { //操作成功
            this.growLife = 5000;
            this.messageService.showSuccess('Operation succeeded!');
            // this.httpService.post("/bpd-proj/bpd/investWbs/getTreeList", {
            //   "regionCatCode": this.selectedListData.regionCategoryCode
            // })
            //   .subscribe(data => {
            //     this.baseData = data.data;

            //   })
            this.deleteLike();
          } else if ("2" == data.code) {
            this.growLife = 999999;
            this.messageService.showInfo('The Module Exists!')
          } else if (data.code == "3") {
            this.growLife = 999999;
            this.messageService.showInfo('The Buget Exists!');
          } else if (data.code == "4") {
            _that.deleteService.confirm(() => {
              _that.httpService.get("/bpd-proj/bpd/investWbs/trueDelete?" + Number(new Date()) + "&wbsCode=" + _that.selectedFile.data.wbsCode + "&regionCatCode=" + _that.selectedFile.data.regionCatCode)
                .subscribe(data => {
                  if (data.code == "1") {
                    _that.growLife = 5000;
                    _that.messageService.showSuccess("Operation Success!");
                    // _that.httpService.post("/bpd-proj/bpd/investWbs/getTreeList", {
                    //   "regionCatCode": _that.selectedListData.regionCategoryCode
                    // })
                    //   .subscribe(data => {
                    //     _that.baseData = data.data;

                    //   })
                    _that.deleteLike();
                  } else {
                    _that.growLife = 5000;
                    _that.messageService.showError("Operation Failed!");
                  }
                  _that.msgs = _that.messageService.msgs;
                })
            })
          } else { //操作失败
            this.growLife = 5000;
            this.messageService.showError('Operation failed!');
          }
          //获取操作信息
          this.msgs = this.messageService.msgs;
        })
    })
  }

  deleteLike() {
    if (this.selectedFile.data.parentId) {
      for (let i = 0; i < this.baseData.length; i++) {
        if (this.baseData[i].data.id === this.selectedFile.data.parentId) {
          for (let j = 0; j < this.baseData[i].children.length; j++) {
            if (this.baseData[i].children[j].data.id === this.selectedFile.data.id) {
              this.baseData[i].children.splice(j, 1);
            }
          }
        }
      }
    } else {
      for (let i = 0; i < this.baseData.length; i++) {
        if (this.baseData[i].data.id === this.selectedFile.data.id) {
          this.baseData.splice(i, 1);
        }
      }
    }
  }

  disableClick(idx, data) {
    this.selectedFile = data;
    this.deleteDialog = true;
  }

  /**
   * 删除确认
   * 
   * @memberof RegionTemplate
   */
  deleteYes() {
    let _that = this;
    this.httpService.post('/bpd-proj/bpd/investWbs/update', {
      "wbsCode": this.selectedFile.data.id,
      "orderWbsCode": this.selectedFile.data.id,
      "id": this.selectedFile.data.id,
      "wbsCodeLive": this.selectedFile.data.wbsCodeLive,
      "wbsName": this.selectedFile.data.wbsName,
      "regionCatCode": this.selectedListData.regionCategoryCode,
      "parentWbsCode": this.selectedFile.data.parentWbsCode,
      "wbsDescription": this.selectedFile.data.wbsDescription,
      "disable": "1"
    })
      .subscribe(data => {
        if (data.code == "1") {
          _that.growLife = 5000;
          _that.messageService.showSuccess("Operation Success!");
          // _that.httpService.post("/bpd-proj/bpd/investWbs/getTreeList", {
          //   "regionCatCode": _that.selectedListData.regionCategoryCode
          // })
          //   .subscribe(data => {
          //     _that.baseData = data.data;

          //   })
          _that.selectedFile.data.disable = "1";
        } else {
          _that.growLife = 5000;
          _that.messageService.showError("Operation Failed!");
        }
        _that.msgs = _that.messageService.msgs;
      })

    this.deleteDialog = false;
  }

  /**
   * 删除取消
   * 
   * @memberof RegionTemplate
   */
  deleteNo() {
    this.deleteDialog = false;
  }

  /**
   * 覆盖确认
   * 
   * @memberof InvestmentWbs
   */
  confirmSave() {
    this.httpService.get("/bpd-proj/bpd/investWbs/trueDelete?" + Number(new Date()) + "&wbsCode=" + this.selectedFile.data.wbsCode + "&regionCatCode=" + this.selectedFile.data.regionCatCode)
      .subscribe(data => {
        if (data.code == "1") {
          this.growLife = 5000;
          this.messageService.showSuccess("Operation Success!");
          this.httpService.post("/bpd-proj/bpd/investWbs/getTreeList", {
            "regionCatCode": this.selectedListData.regionCategoryCode
          })
            .subscribe(data => {
              this.baseData = data.data;

            })
        } else {
          this.growLife = 5000;
          this.messageService.showError("Operation Failed!");
        }
        this.msgs = this.messageService.msgs;
      })
    this.confirmDialog = false;
  }

  /**
   * 覆盖取消
   * 
   * @memberof InvestmentWbs
   */
  confirmCancel() {
    this.confirmDialog = false;
  }

  // export 

  public exportBtn() {
    let token = window.sessionStorage.getItem("access_token");
    let url: string = '/bpd-proj/bpd/investWbs/exportExcel?regionCatCode=' + this.selectedListData.regionCategoryCode + "&regionCatName=" + this.selectedListData.regionCategoryNameEnglish + "&_=" + Number(new Date());
    if (token) {
      let realToken = token.substr(1, token.length - 2)
      url = url + "&accessToken=" + realToken;
    }
    window.location.href = url;
  }

  setVppsClick(idx, data) {
    this.httpService.post('/bpd-proj/bpd/investwbsVpps/getList', {
      "wbsCode": data.data.id
    })
      .subscribe(data => {
        this.vppsData = data
        this.setVppsDialog = true;
      })
  }

  addVppsClick() {
    this.addVppsDialog = true;
    this.dialogVppsLevelFull = "";
    this.modifyFlag = "add";
  }

  editVppsClick(idx, data) {
    this.addVppsDialog = true;
    this.selectedIndex = idx;
    this.dialogVppsLevelFull = data.vppsLevelFull;
    this.modifyFlag = "edit";
  }

  addVppsSave() {
    if (this.modifyFlag === "add") {
      this.httpService.post('/bpd-proj/bpd/investwbsVpps/insert', {
        wbsCode: this.selectedFile.data.id,
        vppsLevelFull: this.dialogVppsLevelFull
      })
        .subscribe(data => {
          if (data.code == "1") {
            this.growLife = 5000;
            this.messageService.showSuccess("Operation Success!");
            this.httpService.post('/bpd-proj/bpd/investwbsVpps/getList', {
              "wbsCode": this.selectedFile.data.id
            })
              .subscribe(data => {
                this.vppsData = data
              })
          } else if (data.code == "2") {
            this.growLife = 5000;
            this.messageService.showInfo("VppsLevelFull Exists!");
          } else {
            this.growLife = 5000;
            this.messageService.showError("Operation Failed!");
          }
          this.msgs = this.messageService.msgs;
        })
    } else if (this.modifyFlag === "edit") {
      this.httpService.post('/bpd-proj/bpd/investwbsVpps/update', {
        wbsCode: this.selectedFile.data.id,
        vppsLevelFull: this.dialogVppsLevelFull,
        wbsVppsId: this.vppsData[this.selectedIndex].wbsVppsId
      })
        .subscribe(data => {
          if (data.code == "1") {
            this.growLife = 5000;
            this.messageService.showSuccess("Operation Success!");
            this.httpService.post('/bpd-proj/bpd/investwbsVpps/getList', {
              "wbsCode": this.selectedFile.data.id
            })
              .subscribe(data => {
                this.vppsData = data
              })
          } else if (data.code == "2") {
            this.growLife = 5000;
            this.messageService.showInfo("VppsLevelFull Exists!");
          } else {
            this.growLife = 5000;
            this.messageService.showError("Operation Failed!");
          }
          this.msgs = this.messageService.msgs;
        })
    }
    this.addVppsDialog = false;
  }

  addVppsCancel() {
    this.addVppsDialog = false;
  }

  deleteVppsClick(idx, data) {
    this.deleteVppsDialog = true;
    this.selectedIndex = idx;
  }

  deleteVppsYes() {
    this.httpService.get('/bpd-proj/bpd/investwbsVpps/deleteById?wbsVppsId=' + this.vppsData[this.selectedIndex].wbsVppsId)
      .subscribe(data => {
        if (data.code == "1") {
          this.growLife = 5000;
          this.messageService.showSuccess("Operation Success!");
          this.httpService.post('/bpd-proj/bpd/investwbsVpps/getList', {
            "wbsCode": this.selectedFile.data.id
          })
            .subscribe(data => {
              this.vppsData = data
            })
        } else {
          this.growLife = 5000;
          this.messageService.showError("Operation Failed!");
        }
        this.msgs = this.messageService.msgs;
      })
    this.deleteVppsDialog = false;
  }

  deleteVppsNo() {
    this.deleteVppsDialog = false;
  }

  exportVppsClick() {
    let token = window.sessionStorage.getItem("access_token");
    let url: string = '/bpd-proj/bpd/investwbsVpps/exportExcel?regionCatCode=' + this.selectedListData.regionCategoryCode + '&_=' + Number(new Date());
    if (token) {
      let realToken = token.substr(1, token.length - 2)
      url = url + "&accessToken=" + realToken;
    }
    window.location.href = url;
  }


  public nodeCollapse(e) {
    
  }

  public nodeExpand(e) {
    // if (e.node.parent) {
      setTimeout(() => {
        this.setColor(e);
      }, 10)
    // }
  }

  public setColor(e) {
    // .getElementsByTagName("li")[0]
    for (let i = 0; i < e.node.children.length; i++) {
      if (e.node.children[i].data.disable == '1') {
        e.originalEvent.target.parentNode.parentNode.nextElementSibling.getElementsByTagName("tbody")[i].style.backgroundColor = "#e6e6e6";
      }
    }
  }
};