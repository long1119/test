import {
  Component,
  OnInit,
  OnChanges,
  Input,
  SimpleChanges,
  AfterContentInit
} from '@angular/core';
import 'style-loader!./regionGroup.scss';
import {
  Message
} from 'primeng/primeng';
import {
  RegionGroupService
} from './regionGroup.service';
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
  selector: 'region-group',
  templateUrl: './regionGroup.html',
})
export class RegionGroup {
  addDialog: Boolean = false;
  editDialog: Boolean = false;
  deleteDialog: Boolean = false;
  // requireAdded: Boolean = false;
  selectedItem: any;
  selectedIndex: number;

  dialogRegionGroup: string = "";
  dialogInput = "dialog-input";
  maxlength: number = 30;
  //提示message信息
  msgs: Message[] = [];
  growLife: number = 5000;
  regionData: any[];
  public localStorageAuthority: Boolean;

  /**
   * 构造
   * @param service
   * @param msgService
   */
  constructor(private service: RegionGroupService, private msgService: MessageService, private dataManageService: DataManageService, private deleteService: DeleteComfirmService) { };
  /**
   * 页面初始化
   * 
   * @memberof RegionGroup
   */
  ngOnInit() {
    //获取区域group数据
    this.service.post("/bpd-proj/bpd/regionGroup/getList", {})
      .subscribe(data => {
        this.regionData = data;
      });
    this.localStorageAuthority = this.dataManageService.buttonAuthority("Maintain Region");
  };
  /**
   * 动态数据
   * 
   * @memberof RegionGroup
   */
  ngOnChanges(changes: SimpleChanges) {
    console.log(changes["sad"]);
  }

  ngAfterContentInit() {
    // console.log(this.dialogRegionGroup);
  }
  /**
   * 添加模态框弹出
   * @memberof RegionGroup
   */
  addClick() {
    // this.tables.push({id: 11,regionGroup: ""});
    this.addDialog = true;
    this.dialogRegionGroup = "";
  }
  /**
   * 编辑模态框弹出
   * 
   * @param {any} idx 
   * @memberof RegionGroup
   */
  editClick(idx, data) {
    this.selectedIndex = idx;
    this.dialogRegionGroup = data.regionGroupName;
    this.editDialog = true;
    this.selectedItem = idx;
  }
  /**
   * 删除模态框弹出
   * 
   * @param {any} idx 
   * @memberof RegionGroup
   */
  deleteClick(idx) {
    this.selectedIndex = idx;
    // this.deleteDialog = true;
    this.deleteService.confirm(() => {
      let timeStamp = new Date();
      this.service.get("/bpd-proj/bpd/regionGroup/delete?" + timeStamp.getTime() + "&regionGroupCode=" + this.regionData[this.selectedIndex].regionGroupCode)
        .subscribe(data => {
          if ("1" == data.code) { //操作成功
            this.growLife = 5000;
            this.msgService.showSuccess('Operation succeeded!');
          } else if ("0" == data.code) {
            this.growLife = 999999;
            this.msgService.showInfo('Region Group Name Is Used!');
          } else { //操作失败
            this.growLife = 5000;
            this.msgService.showError('Operation failed!');
          }
          //获取操作信息
          this.msgs = this.msgService.msgs;
          //刷新页面数据
          this.service.post("/bpd-proj/bpd/regionGroup/getList", {})
            .subscribe(data => {
              this.regionData = data;
            });
        });
    })
  }
  /**
   * 修改确认
   * 
   * @param {any} idx 
   * @param {any} data 
   * @memberof RegionGroup
   */
  editSave() {
    // this.dialogRegionGroup = this.regionData[this.selectedIndex].regionGroupName;
    // console.log(this.dialogRegionGroup);
    // console.log(this.regionData[this.selectedIndex].regionGroupCode)
    this.editDialog = false;
    this.service.post("/bpd-proj/bpd/regionGroup/update", {
      "regionGroupName": this.dialogRegionGroup,
      "regionGroupCode": this.regionData[this.selectedIndex].regionGroupCode
    })
      .subscribe(data => {
        if ("1" == data.code) { //操作成功
          this.growLife = 5000;
          this.msgService.showSuccess('Operation succeeded!');
        } else if ("2" == data.code) { //编码已经存在
          this.growLife = 999999;
          this.msgService.showInfo('regionGroupName already exist!');
        } else { //操作失败
          this.growLife = 5000;
          this.msgService.showError('Operation failed!');
        }
        //获取操作信息
        this.msgs = this.msgService.msgs;
        this.service.post("/bpd-proj/bpd/regionGroup/getList", {})
          .subscribe(data => {
            this.regionData = data;
          });
      });
  }

  /**
   * 编辑取消
   * 
   * @param {any} idx 
   * @param {any} data 
   * @memberof RegionGroup
   */
  editCancle(idx, data) {
    this.dialogRegionGroup = "";
    this.editDialog = false;
  }
  /**
   * 添加确认
   * 
   * @param {any} idx 
   * @memberof RegionGroup
   */
  addSave(idx) {
    this.addDialog = false;
    this.service.post("/bpd-proj/bpd/regionGroup/insert", {
      "regionGroupName": this.dialogRegionGroup
    })
      .subscribe(data => {
        if ("1" == data.code) { //操作成功
          this.growLife = 5000;
          this.msgService.showSuccess('Operation succeeded!');
        } else if ("2" == data.code) { //编码已经存在
          this.growLife = 999999;
          this.msgService.showInfo('regionGroupName already exist!');
        } else { //操作失败
          this.growLife = 5000;
          this.msgService.showError('Operation failed!');
        }
        //获取操作信息
        this.msgs = this.msgService.msgs;
        this.service.post("/bpd-proj/bpd/regionGroup/getList", {})
          .subscribe(data => {
            this.regionData = data;
            console.log(this.regionData);
          });
      });
    this.dialogRegionGroup = "";
    // this.requireAdded = true;
  }

  /**
   * 添加页面取消按钮
   */
  addCancle() {
    this.addDialog = false;
    this.dialogRegionGroup = "";
    // this.requireAdded = true;
  }
  /**
   * 删除确认
   * 
   * @memberof RegionGroup
   */
  deleteYes() {
    let timeStamp = new Date();
    this.service.get("/bpd-proj/bpd/regionGroup/delete?" + timeStamp.getTime() + "&regionGroupCode=" + this.regionData[this.selectedIndex].regionGroupCode)
      .subscribe(data => {
        if ("1" == data.code) { //操作成功
          this.growLife = 5000;
          this.msgService.showSuccess('Operation succeeded!');
        } else if ("0" == data.code) {
          this.growLife = 999999;
          this.msgService.showInfo('Region Group Name Is Used!');
        } else { //操作失败
          this.growLife = 5000;
          this.msgService.showError('Operation failed!');
        }
        //获取操作信息
        this.msgs = this.msgService.msgs;
        //刷新页面数据
        this.service.post("/bpd-proj/bpd/regionGroup/getList", {})
          .subscribe(data => {
            this.regionData = data;
          });
      });
    this.deleteDialog = false;
  }

  /**
   * 删除取消 
   * 
   * @memberof RegionGroup
   */
  deleteNo() {
    this.deleteDialog = false;
  }

};