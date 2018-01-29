import {
  Component
} from '@angular/core';
import 'style-loader!./investmentProperty.scss';
import {
  SelectItem,
  Message
} from 'primeng/primeng';
import {
  InvestmentPropertyService
} from './investmentProperty.service';
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
  selector: 'investment-property',
  templateUrl: './investmentProperty.html',
})
export class InvestmentProperty {

  addDialog: Boolean = false;
  editDialog: Boolean = false;
  deleteDialog: Boolean = false;
  addButtonDisPlay: Boolean = true;
  dialogName: any;
  dialogCode: any;
  dialogPropertyGroup: any;
  selectedItem: number;
  selectGroupName: string;
  investmentData: any[];
  propertyGroup: any[];
  msgs: Message[];
  growLife: number = 5000;
  selectGroupId: string;
  propertyGroupOption: SelectItem[] = [];
  selectedPropertyGroup: string;

  public localStorageAuthority: Boolean;


  constructor(private service: InvestmentPropertyService, private messageService: MessageService, private dataManageService: DataManageService, private deleteService: DeleteComfirmService) {

  }

  /**
   * 页面初始化查询investmentProperty
   */
  ngOnInit() {
    this.localStorageAuthority = this.dataManageService.buttonAuthority("Investment Property");
    this.service.post('/bpd-proj/bpd/investmentPropertyGroup/getList', {})
      .subscribe(data => {
        for (let i = 0; i < data.length; i++) {
          this.propertyGroupOption.push({
            label: data[i].groupPropertyName,
            value: data[i].propertyGroupId
          })
        }
        this.selectedPropertyGroup = data[0].propertyGroupId;
      })
    this.service.post('/bpd-proj/bpd/investmentProperty/getVList', {
    })
      .subscribe(data => {
        this.investmentData = data;
        // for (let i = 0; i < data.length; i++) {
        //   if (data[i].propertyGroupId == groupId) {
        //     this.selectGroupName = data[i].groupPropertyName;
        //   }
        // }
      });
  }

  rejPro(groupId) {
    this.selectGroupId = groupId;
    this.addButtonDisPlay = !groupId;
  }

  rejName($event) {
    console.log($event);
    this.selectGroupName = $event;
  }

  /**
   * 添加页面显示
   */
  addClick() {
    this.dialogName = '';
    this.dialogCode = '';
    this.selectedPropertyGroup = this.propertyGroupOption[0].value;
    this.dialogPropertyGroup = this.selectGroupName;
    this.addDialog = true;
  }

  /**
   * 编辑界面显示
   * 
   * @param {any} idx 
   * @param {any} data 
   * @memberof InvestmentProperty
   */
  editClick(idx, data) {
    this.dialogName = this.investmentData[idx].investmentPropertyName;
    this.dialogCode = this.investmentData[idx].investmentProperty;
    this.dialogPropertyGroup = data.investmentPropertyCode;
    this.selectedPropertyGroup = data.propertyGroupId;
    this.editDialog = true;
  }

  /**
   * 删除界面显示
   * 
   * @param {any} idx 
   * @param {any} data 
   * @memberof InvestmentProperty
   */
  deleteClick(idx, data) {
    // this.deleteDialog = true;
    this.selectedItem = idx;
    this.deleteService.confirm(() => {
      let timeStamp = new Date();
      this.service.get('/bpd-proj/bpd/investmentProperty/delete?' + timeStamp.getTime() + '&investmentPropertyCode=' + this.investmentData[this.selectedItem].investmentPropertyCode)
        .subscribe(data => {
          if ("1" == data.code) { //操作成功
            this.growLife = 5000;
            this.messageService.showSuccess('Operation succeeded!');
          } else if ("2" == data.code) { //投资属性组名称已存在
            this.growLife = 999999;
            this.messageService.showError('investmentPropertyGroup already exist!');
          } else { //操作失败
            this.growLife = 5000;
            this.messageService.showError('Operation failed!');
          }
          //获取操作信息
          this.msgs = this.messageService.msgs;
          this.service.post('/bpd-proj/bpd/investmentProperty/getVList', {
          })
            .subscribe(data => {
              this.investmentData = data;
            });
        });
    })
  }
  /**
   * 删除确认
   * 
   * @memberof InvestmentProperty
   */
  deleteYes() {
    let timeStamp = new Date();
    this.service.get('/bpd-proj/bpd/investmentProperty/delete?' + timeStamp.getTime() + '&investmentPropertyCode=' + this.investmentData[this.selectedItem].investmentPropertyCode)
      .subscribe(data => {
        if ("1" == data.code) { //操作成功
          this.growLife = 5000;
          this.messageService.showSuccess('Operation succeeded!');
        } else if ("2" == data.code) { //投资属性组名称已存在
          this.growLife = 999999;
          this.messageService.showError('investmentPropertyGroup already exist!');
        } else { //操作失败
          this.growLife = 5000;
          this.messageService.showError('Operation failed!');
        }
        //获取操作信息
        this.msgs = this.messageService.msgs;
        this.service.post('/bpd-proj/bpd/investmentProperty/getVList', {
        })
          .subscribe(data => {
            this.investmentData = data;
          });
      });
    this.deleteDialog = false;
  }


  /**
   * 删除取消
   * 
   * @memberof InvestmentProperty
   */
  deleteNo() {
    this.deleteDialog = false;
  }

  addCancle() {
    this.addDialog = false;
    this.dialogName = '';
    this.dialogCode = '';
  }

  /**
   *投资属性保存
   */
  addSave() {
    this.addDialog = false;
    this.service.post('/bpd-proj/bpd/investmentProperty/insert', {
      'investmentProperty': this.dialogCode,
      'investmentPropertyName': this.dialogName,
      'propertyGroupId': this.selectedPropertyGroup,
    })
      .subscribe(data => {
        if ("1" == data.code) { //操作成功
          this.growLife = 5000;
          this.messageService.showSuccess('Operation succeeded!');
        } else if ("2" == data.code) { //投资属性组名称已存在
          this.growLife = 999999;
          this.messageService.showInfo('investmentPropertyGroup Code already exist!');
        } else if ("3" == data.code) { //投资属性组名称已存在
          this.growLife = 999999;
          this.messageService.showInfo('investmentPropertyGroup Name already exist!');
        } else { //操作失败
          this.growLife = 5000;
          this.messageService.showError('Operation failed!');
        }
        //获取操作信息
        this.msgs = this.messageService.msgs;
        this.service.post('/bpd-proj/bpd/investmentProperty/getVList', {
        })
          .subscribe(data => {
            this.investmentData = data;
          });
      });


    this.dialogName = '';
    this.dialogCode = '';
    this.selectedPropertyGroup = '';
  }

  editSave() {
    this.editDialog = false;

    this.service.post("/bpd-proj/bpd/investmentProperty/update", {
      "investmentProperty": this.dialogCode,
      "investmentPropertyName": this.dialogName,
      "propertyGroupId": this.selectedPropertyGroup,
      'investmentPropertyCode': this.dialogPropertyGroup
    })
      .subscribe(data => {
        if ("1" == data.code) { //操作成功
          this.growLife = 5000;
          this.messageService.showSuccess('Operation succeeded!');
        } else if ("2" == data.code) { //投资属性组名称已存在
          this.growLife = 999999;
          this.messageService.showError(data.msgs);
        } else if ("3" == data.code) { //投资属性组名称已存在
          this.growLife = 999999;
          this.messageService.showError('investmentPropertyGroup Name already exist!');
        } else { //操作失败
          this.growLife = 5000;
          this.messageService.showError('Operation failed!');
        }
        //获取操作信息
        this.msgs = this.messageService.msgs;
        this.service.post('/bpd-proj/bpd/investmentProperty/getVList', {
          'propertyGroupId': this.selectGroupId,
        })
          .subscribe(data => {
            this.investmentData = data;
          });
      });

    this.dialogName = "";
    this.dialogCode = "";
    this.selectedPropertyGroup = "";
  }

  editCancle() {
    this.editDialog = false;
    this.dialogName = "";
    this.dialogCode = "";
    this.selectedPropertyGroup = "";
  }
};