import {
  Component,
  OnInit
} from '@angular/core';
// import {BugetTemplateService} from './BugetTemplate.service';
import 'style-loader!./plant.scss';
import {
  Message,
  SelectItem,
  TreeNode,
  ContextMenu
} from 'primeng/primeng';
import {
  plantService
} from './plant.service';
import {
  MessageService
} from '../../../service/message.service';
import {
  DataManageService
} from '../../../service/dataManage.service';
import {
  DeleteComfirmService
} from '../../../service/deleteDialog.service';


@Component({
  selector: 'plant',
  templateUrl: './plant.html',
})
export class Plant {
  msgs: Message[] = [];
  growLife: number = 5000;
  addDialog: Boolean = false;
  editDialog: Boolean = false;
  deleteDialog: Boolean = false;
  selectedIndex: number;
  dialogCode: any;
  dialogDescription: any;
  dialogComment: any;
  dialogBase: string;
  dialogCompany: string;
  baseData: any = [];
  capitalExpense: SelectItem[];
  pageLink: number = 1;
  public localStorageAuthority: Boolean;
  public plantOption: SelectItem[] = [];
  public testData: any = {};


  constructor(private service: plantService, private msgService: MessageService, private dataManageService: DataManageService, private deleteService: DeleteComfirmService) {
    this.capitalExpense = [];
    this.capitalExpense.push({
      label: "Capital",
      value: {
        id: 1,
        name: "Capital"
      }
    });
    this.capitalExpense.push({
      label: "Expense",
      value: {
        id: 1,
        name: "Expense"
      }
    });

    interface dialogData {

    }

  }

  ngOnInit() {
    // console.log(this.baseData.length);
    // const lengthAtFirst = this.baseData.length;
    // console.log(lengthAtFirst);
    // if (lengthAtFirst < 10) {
    //   for (let i = 0; i < 10 - lengthAtFirst; i++) {
    //     this.baseData.push({"plantCode":""});
    //     console.log(lengthAtFirst);
    //   }
    // }
    // console.log(this.baseData)
    this.service.post("/bpd-proj/bpd/plant/getList", {})
      .subscribe(data => {
        this.baseData = data;
      });
    this.localStorageAuthority = this.dataManageService.buttonAuthority("Maintain Plant");
    // this.service.post('/bpd-proj/bpd/proPlant/getCombobox', {})
    //   .subscribe(data => {
    //     if (data.length !== 0) {
    //       this.plantOption = data;
    //       this.dialogDescription = data[0].value;
    //     } else {
    //       this.plantOption = [];
    //     }
    //   })

  }

  /**
   * platCode校验
   * 
   * @memberof PlantCode
   */
  codeBlur() {
    let reg = new RegExp("^[a-zA-Z]{1}$");
    if (!reg.test(this.dialogCode)) {
      this.dialogCode = "";
    }
  }

  /**
   * 导出事件
   * 
   * @memberof PlantCode
   */
  exportClick() {
    let token = window.sessionStorage.getItem("access_token");
    let url: string = '/bpd-proj/bpd/plant/exportExcel?_=' + Number(new Date());
    if (token) {
      let realToken = token.substr(1, token.length - 2)
      url = url + "&accessToken=" + realToken;
    }
    window.location.href = url;
  }

  addClick() {
    this.addDialog = true;
    this.dialogDescription = "";
    this.dialogBase = "";
    this.dialogCompany = "";
  }

  /**
   * 制造地修改
   * @param idx
   * @param data
   */
  editClick(idx, data) {
    // this.service.get("/bpd-proj/bpd/plant/getById?" + Number(new Date()) + "&plantCode=" + data.plantCode)
    //   .subscribe(data => {
    this.dialogCode = data.plantCode;
    this.dialogBase = data.base;
    this.dialogCompany = data.company;
    this.dialogDescription = data.plantDescription;
    this.dialogComment = data.plantComment;
    // });

    this.editDialog = true;


  }

  /**
   * 制造地删除
   * @param idx
   * @param data
   */
  deleteClick(idx, data) {
    this.selectedIndex = idx;
    // this.deleteDialog = true;
    this.deleteService.confirm(() => {
      let timeStamp = new Date();
      //发送删除请求
      this.service.get("/bpd-proj/bpd/plant/delete?" + timeStamp.getTime() + "&plantCode=" + this.baseData[this.selectedIndex].plantDescription)
        .subscribe(data => {
          if ("1" == data.code) { //操作成功
            this.growLife = 5000;
            this.msgService.showSuccess('Operation Succeeded!');
          } else if (data.code == "0") { //操作失败
            this.growLife = 5000;
            this.msgService.showError('Operation Failed!');
          } else {
            this.growLife = 999999;
            this.msgService.showInfo(data.msg);
          }
          //获取操作信息
          this.msgs = this.msgService.msgs;
          //刷新下list列表
          this.service.post("/bpd-proj/bpd/plant/getList", {})
            .subscribe(data => {
              this.baseData = data;
            });
        });
    })
  }

  addCancle() {
    this.addDialog = false;
    this.dialogCode = "";
    this.dialogComment = "";

  }

  /**
   * 制造地添加
   */
  addSave() {
    this.addDialog = false;
    //发送添加请求
    this.service.post("/bpd-proj/bpd/plant/insert", {
      "plantCode": this.dialogCode,
      "plantDescription": this.dialogDescription,
      "plantComment": this.dialogComment,
      "base": this.dialogBase,
      "company": this.dialogCompany
    })
      .subscribe(data => {

        if ("1" == data.code) { //操作成功
          this.growLife = 5000;
          this.msgService.showSuccess('Operation Succeeded!');
        } else if ("2" == data.code) { //制造地编码已经存在
          this.growLife = 999999;
          this.msgService.showInfo('Plant Already Exist!');
        } else { //操作失败
          this.growLife = 5000;
          this.msgService.showError('Operation Failed!');
        }
        //获取操作信息
        this.msgs = this.msgService.msgs;
        //刷新下list列表
        this.service.post("/bpd-proj/bpd/plant/getList", {})
          .subscribe(data => {
            this.baseData = data;
          });
      });

    this.dialogComment = "";
    this.dialogCode = "";
  }

  /**
   * 制造地修改
   */
  editSave() {
    this.editDialog = false;
    //发送修改请求
    this.service.post("/bpd-proj/bpd/plant/update", {
      "plantCode": this.dialogCode,
      "plantDescription": this.dialogDescription,
      // "plantComment": this.dialogComment,
      // "base": this.dialogBase,
      // "company": this.dialogCompany
    })
      .subscribe(data => {
        if ("1" == data.code) { //操作成功
          this.growLife = 5000;
          this.msgService.showSuccess('Operation Succeeded!');
        } else { //操作失败
          this.growLife = 5000;
          this.msgService.showError('Operation Failed!');
        }
        //获取操作信息
        this.msgs = this.msgService.msgs;
        //刷新下list列表
        this.service.post("/bpd-proj/bpd/plant/getList", {})
          .subscribe(data => {
            this.baseData = data;
          });
      });

    this.dialogComment = "";
    this.dialogCode = "";
  }

  editCancle() {
    this.editDialog = false;
    this.dialogComment = "";
    this.dialogCode = "";
  }

  deleteYes() {
    let timeStamp = new Date();
    //发送删除请求
    this.service.get("/bpd-proj/bpd/plant/delete?" + timeStamp.getTime() + "&plantCode=" + this.baseData[this.selectedIndex].plantDescription)
      .subscribe(data => {
        if ("1" == data.code) { //操作成功
          this.growLife = 5000;
          this.msgService.showSuccess('Operation Succeeded!');
        } else if (data.code == "0") { //操作失败
          this.growLife = 5000;
          this.msgService.showError('Operation Failed!');
        } else {
          this.growLife = 999999;
          this.msgService.showInfo(data.msg);
        }
        //获取操作信息
        this.msgs = this.msgService.msgs;
        //刷新下list列表
        this.service.post("/bpd-proj/bpd/plant/getList", {})
          .subscribe(data => {
            this.baseData = data;
          });
      });
    this.deleteDialog = false;
  }

  deleteNo() {
    this.deleteDialog = false;
  }

  testClick() {
    //   user test
    //   this.service.get('/bpd-proj/bpd/initUser/getTest?' + Number(new Date()))
    //     .subscribe(data => {
    //       console.log(data);
    //       this.testData = data;
    //     })
    this.service.get('/bpd-proj/bpd/plant/testMail')
      .subscribe(data => {
        alert(data);
        alert(JSON.stringify(data));
      })
  }
  
  checkEnglish($event) {
        let reg = /[^a-zA-Z0-9]/;
        let regexp = new RegExp(reg);
        if (!regexp.test($event)) {
            return $event;
        } else {
            this.msgService.showInfo("Please Inser Number Or Letter!")
            this.growLife = 3000000;
            this.msgs = this.msgService.msgs;
            return null;
        }
    }
};