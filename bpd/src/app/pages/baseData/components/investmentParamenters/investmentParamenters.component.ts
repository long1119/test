import {
  Component
} from '@angular/core';
import {
  HttpDataService
} from '../../../service/http.service';
import {
  MessageService
} from '../../../service/message.service'
import {
  DataManageService
} from '../../../service/dataManage.service';
import {
  DeleteComfirmService
} from '../../../service/deleteDialog.service';
import 'style-loader!./investmentParamenters.scss';
import {
  SelectItem,
  Message
} from 'primeng/primeng';



@Component({
  selector: 'investment-paramenters',
  templateUrl: './investmentParamenters.html',
})
export class InvestmentParamenters {
  baseData: any[];
  addDialog: Boolean = false;
  deleteDialog: Boolean = false;
  editDialog: Boolean = false;
  regionCode: Boolean = true;
  regionParameter: Boolean = false;
  regionTemplate: Boolean = false;
  selectedData: any[];

  changedCatId: string;
  changedCatName: string;
  msgs: Message[];
  growLife: number = 5000;

  // changedCatId: string;

  selectedIndex: number;

  //页面数据
  dialogDescription: string;
  dialogParameterGroup: string;

  public localStorageAuthority: Boolean;


  constructor(private httpService: HttpDataService, private messageService: MessageService, private dataManageService: DataManageService, private deleteService: DeleteComfirmService) {

  }

  ngOnInit() {
    this.httpService.post("/bpd-proj/bpd/investAssumeCat/getList", {})
      .subscribe(data => {
        this.baseData = data;
        this.selectedData = data[0];
        this.changedCatId = data[0].investAssumeCatId;
        this.changedCatName = data[0].investAssumeCatName;
      })
    this.localStorageAuthority = this.dataManageService.buttonAuthority("Maintain Investment Parameter");
  }

  /**
   * table行点击事件
   * 
   * @param {any} $event 
   * @memberof InvestmentParamenters
   */
  onRowClick($event) {
    // console.log($event.data);
    this.changedCatId = $event.data.investAssumeCatId;
    this.changedCatName = $event.data.investAssumeCatName;
  }

  /**
   * 显示添加弹窗
   * 
   * @memberof Region
   */
  addClick() {
    this.addDialog = true;

    this.dialogDescription = "";
    this.dialogParameterGroup = "";
  }

  /**
   * 添加确认保存
   * 
   * @memberof Region
   */
  addSave() {

    this.httpService.post("/bpd-proj/bpd/investAssumeCat/insert", {
      "investAssumeCatName": this.dialogParameterGroup,
      "description": this.dialogDescription
    })
      .subscribe(data => {
        if ("1" == data.code) { //操作成功
          this.growLife = 5000;
          this.messageService.showSuccess('Operation succeeded!');
        } else if ("2" == data.code) {
          this.growLife = 999999;
          this.messageService.showInfo('You Can Not Delete A Data Who Have Children!')
        } else { //操作失败
          this.growLife = 5000;
          this.messageService.showError('Operation failed!');
        }
        //获取操作信息
        this.msgs = this.messageService.msgs;
        this.httpService.post("/bpd-proj/bpd/investAssumeCat/getList", {})
          .subscribe(data => {
            this.baseData = data
          })
      })
    this.addDialog = false;

    this.dialogDescription = "";
    this.dialogParameterGroup = "";
  }

  /**
   * 添加取消
   * 
   * @memberof Region
   */
  addCancle() {
    this.addDialog = false;

    this.dialogDescription = "";
    this.dialogParameterGroup = "";
  }

  /**
   * 修改弹窗显示
   * 
   * @memberof Region
   */
  editClick(idx, data) {
    this.editDialog = true;
    this.selectedIndex = idx;
    this.dialogDescription = data.description;
    this.dialogParameterGroup = data.investAssumeCatName;
  }

  /**
   * 更改确认
   * 
   * @memberof Region
   */
  editSave() {

    this.httpService.post("/bpd-proj/bpd/investAssumeCat/update", {
      "investAssumeCatName": this.dialogParameterGroup,
      "description": this.dialogDescription,
      "investAssumeCatId": this.baseData[this.selectedIndex].investAssumeCatId
    })
      .subscribe(data => {
        if ("1" == data.code) { //操作成功
          this.growLife = 5000;
          this.messageService.showSuccess('Operation succeeded!');
        } else if ("2" == data.code) {
          this.growLife = 999999;
          this.messageService.showInfo('You Can Not Edit A Data Who Have Children!')
        } else { //操作失败
          this.growLife = 5000;
          this.messageService.showError('Operation failed!');
        }
        //获取操作信息
        this.msgs = this.messageService.msgs;
        this.httpService.post("/bpd-proj/bpd/investAssumeCat/getList", {})
          .subscribe(data => {
            this.baseData = data
          })
      })

    this.editDialog = false;

    this.dialogDescription = "";
    this.dialogParameterGroup = "";
  }

  /**
   * 更改取消
   * 
   * @memberof Region
   */
  editCancle() {
    this.editDialog = false;

    this.dialogDescription = "";
    this.dialogParameterGroup = "";
  }

  /**
   * 删除弹窗
   * 
   * @memberof Region
   */
  deleteClick(idx, data) {

    this.selectedIndex = idx;
    // this.deleteDialog = true;
    this.deleteService.confirm(() => {
      let timeStemp = new Date();
      this.httpService.get("/bpd-proj/bpd/investAssumeCat/delete?" + timeStemp.getTime() + "&investAssumeCatId=" + this.baseData[this.selectedIndex].investAssumeCatId)
        .subscribe(data => {
          if ("1" == data.code) { //操作成功
            this.growLife = 5000;
            this.messageService.showSuccess('Operation succeeded!');
          } else if ("2" == data.code) {
            this.growLife = 999999;
            this.messageService.showInfo('You Can Not Delete A Data Who Have Children!')
          } else { //操作失败
            this.growLife = 5000;
            this.messageService.showError('Operation failed!');
          }
          //获取操作信息
          this.msgs = this.messageService.msgs;
          this.httpService.post("/bpd-proj/bpd/investAssumeCat/getList", {})
            .subscribe(data => {
              this.baseData = data
            })
        })
    })

  }

  /**
   * 删除确认
   * 
   * @memberof Region
   */
  deleteYes() {
    let timeStemp = new Date();
    this.httpService.get("/bpd-proj/bpd/investAssumeCat/delete?" + timeStemp.getTime() + "&investAssumeCatId=" + this.baseData[this.selectedIndex].investAssumeCatId)
      .subscribe(data => {
        if ("1" == data.code) { //操作成功
          this.growLife = 5000;
          this.messageService.showSuccess('Operation succeeded!');
        } else if ("2" == data.code) {
          this.growLife = 999999;
          this.messageService.showInfo('You Can Not Delete A Data Who Have Children!')
        } else { //操作失败
          this.growLife = 5000;
          this.messageService.showError('Operation failed!');
        }
        //获取操作信息
        this.msgs = this.messageService.msgs;
        this.httpService.post("/bpd-proj/bpd/investAssumeCat/getList", {})
          .subscribe(data => {
            this.baseData = data
          })
      })
    this.deleteDialog = false;
  }

  /**
   * 删除取消
   * 
   * @memberof Region
   */
  deleteNo() {
    this.deleteDialog = false;
  }
};