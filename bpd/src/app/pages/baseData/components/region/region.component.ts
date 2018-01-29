import {
  Component,
  OnInit
} from '@angular/core';
// import {BugetTemplateService} from './BugetTemplate.service';
import 'style-loader!./region.scss';
import {
  SelectItem,
  Message
} from 'primeng/primeng';
import {
  Router
} from "@angular/router";
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
// import { BaseDataModule } from '../../baseData.module';

@Component({
  selector: 'region',
  templateUrl: './region.html',
})
export class Region {
  addDialog: Boolean = false;
  deleteDialog: Boolean = false;
  editDialog: Boolean = false;
  regionCode: Boolean = true;
  deleteIdentificationDialog: Boolean = false;
  regionParameter: Boolean = false;
  regionTemplate: Boolean = false;
  regionDefineColumn: Boolean = false;
  changeCode: string;
  changeCategoryCode: string;
  changeName: string;
  changeCategoryName: string;
  changeCatFlag: string;
  msgs: Message[];
  growLife: number = 5000;
  selectedRegionCategory: any;
  regionVendors: any[] = [];

  baseData: any[];
  editRegionGroupCode: string;
  // selectedIndex: number;

  //页面数据
  dialogGroup: SelectItem[] = [];
  dialogGroupData: string;
  dialogGroupCode: string;
  dialogTypeCode: string;
  dialogTypeNameChinese: string;
  dialogTypeNameEnglish: string;
  dialogStyle: SelectItem[] = [];
  dialogStyleData: string;
  dialogRegionGroup: string;
  dialogRegionType: string;
  public localStorageAuthority: Boolean;
  constructor(private router: Router, private httpService: HttpDataService, private messageService: MessageService, private dataManageService: DataManageService, private deleteService: DeleteComfirmService) {
    this.dialogStyle.push({
      label: "no",
      value: 0
    });
    this.dialogStyle.push({
      label: "yes",
      value: 1
    });
    this.dialogStyleData = this.dialogStyle[0].value;
  }
  /**
   * 页面数据初始化
   * 
   * @memberof Region
   */
  ngOnInit() {
    this.tableOnInit();
    this.httpService.post('/bpd-proj/bpd/regionGroup/getRegionGroupCombobox', {})
      .subscribe(data => {
        this.dialogGroup = data || [];
      })
    this.localStorageAuthority = this.dataManageService.buttonAuthority("Maintain Region");
  }

  private tableOnInit() {
    this.httpService.post('/bpd-proj/bpd/regionCategory/getVList', {
      "regionGroupName": this.dialogRegionGroup,
      "regionCategoryNameEnglish": this.dialogRegionType
    })
      .subscribe(data => {
        this.regionVendors = [];
        for (let i = 0; i < data.length; i++) {
          if (data[i].catFlag == 0) {
            data[i].catFlag = "no";
          } else if (data[i].catFlag == 1) {
            data[i].catFlag = "yes";
            this.regionVendors.push(data[i].regionCategoryCode);
          }
        }
        if (data.length != 0) {
          this.selectedRegionCategory = data[0];
          this.changeCategoryCode = data[0].regionCategoryCode;
          this.changeCode = data[0].regionGroupCode;
          this.changeName = data[0].regionGroupName;
          this.changeCategoryName = data[0].regionCategoryName;
        }
        this.baseData = data;
      })
  }

  /**
   * 行点击事件
   * 
   * @param {any} event 
   * @memberof Region
   */
  onRowClick($event) {
    // console.log($event.data.regionCategoryCode);
    this.changeCategoryCode = $event.data.regionCategoryCode;
    this.changeCode = $event.data.regionGroupCode;
    this.changeName = $event.data.regionGroupName;
    this.changeCategoryName = $event.data.regionCategoryName;
    this.changeCatFlag = $event.data.catFlag;
  }

  /**
   * 显示添加弹窗
   * 
   * @memberof Region
   */
  addClick(idx, data) {
    this.dialogGroupData = "";
    this.httpService.post('/bpd-proj/bpd/regionGroup/getRegionGroupCombobox', {})
      .subscribe(data => {
        this.dialogGroup = data;
        if (data.length != 0) {
          this.dialogGroupData = data[0].value;
        }
      })

    // this.dialogGroupData = this.dialogGroup[0].value || "";
    this.addDialog = true;
    this.dialogTypeCode = "";
    this.dialogTypeNameEnglish = "";
    this.dialogTypeNameChinese = "";
  }


  /**
   * 添加确认保存
   * 
   * @memberof Region
   */
  addSave() {
    this.httpService.post('/bpd-proj/bpd/regionCategory/insert', {
      "regionCategoryName": this.dialogTypeNameEnglish + " " + this.dialogTypeNameChinese,
      "regionCategoryNameEnglish": this.dialogTypeNameEnglish,
      "regionCategoryNameChinese": this.dialogTypeNameChinese,
      // "regionCategoryCode": this.dialogTypeCode,
      "regionGroupCode": this.dialogGroupData,
      "catFlag": this.dialogStyleData
    })
      .subscribe(data => {
        if ("1" == data.code) { //操作成功
          this.growLife = 5000;
          this.messageService.showSuccess('Operation succeeded!');
        } else if ("2" == data.code) {
          this.growLife = 999999;
          this.messageService.showInfo("Region Category Name Exists!");
        } else if ("3" == data.code) {
          this.growLife = 999999;
          this.messageService.showInfo("Region Category Code Exists!");
        } else { //操作失败
          this.growLife = 5000;
          this.messageService.showError('Operation failed!');
        }
        this.msgs = this.messageService.msgs;
        this.tableOnInit();
      })

    this.addDialog = false;

    this.dialogTypeCode = "";
    this.dialogTypeNameEnglish = "";
    this.dialogTypeNameChinese = "";
  }

  /**
   * 添加取消
   * 
   * @memberof Region
   */
  addCancle() {

    this.addDialog = false;

    this.dialogTypeCode = "";
    this.dialogTypeNameEnglish = "";
    this.dialogTypeNameChinese = "";
  }

  /**
   * 修改弹窗显示
   * 
   * @memberof Region
   */
  editClick(idx, data) {
    // console.log(data);
    // console.log(!this.baseData);
    if (this.baseData != []) {
      this.dialogGroupData = this.baseData[idx].regionGroupCode;
      this.dialogTypeCode = this.baseData[idx].regionCategoryCode;
    }

    this.httpService.post('/bpd-proj/bpd/regionGroup/getRegionGroupCombobox', {})
      .subscribe(data => {
        this.dialogGroup = data;
      })
    let catFlag: number;
    for (let i = 0; i < this.dialogStyle.length; i++) {
      if (this.dialogStyle[i].label == data.catFlag) {
        catFlag = this.dialogStyle[i].value;
      }
    }
    this.dialogStyleData = catFlag || this.dialogStyle[0].value;
    this.dialogGroupData = data.regionGroupCode || this.dialogGroup[0].value;
    this.dialogTypeCode = data.regionCategoryCode;
    this.dialogTypeNameEnglish = data.regionCategoryNameEnglish;
    this.dialogTypeNameChinese = data.regionCategoryNameChinese;
    this.editDialog = true;
  }

  /**
   * 更改确认
   * 
   * @memberof Region
   */
  editSave() {

    this.httpService.post('/bpd-proj/bpd/regionCategory/update', {
      "regionCategoryName": this.dialogTypeNameEnglish + " " + this.dialogTypeNameChinese,
      "regionCategoryNameEnglish": this.dialogTypeNameEnglish,
      "regionCategoryNameChinese": this.dialogTypeNameChinese,
      "regionCategoryCode": this.dialogTypeCode,
      "regionGroupCode": this.dialogGroupData,
      "catFlag": this.dialogStyleData
    })
      .subscribe(data => {
        if ("1" == data.code) { //操作成功
          this.growLife = 5000;
          this.messageService.showSuccess('Operation succeeded!');
        } else if ("2" == data.code) {
          this.growLife = 999999;
          this.messageService.showInfo("Region Category Name Exists!");
        } else if ("3" == data.code) {
          this.growLife = 999999;
          this.messageService.showInfo("Region Category Code Exists!");
        } else if ("4" == data.code) {
          this.growLife = 999999;
          this.messageService.showInfo("The Region Category Is Used By Buget That You Can Not Edit It!")
        } else { //操作失败
          this.growLife = 5000;
          this.messageService.showError('Operation failed!');
        }
        this.msgs = this.messageService.msgs;
        this.tableOnInit();
      })
    this.editDialog = false;

    this.dialogTypeCode = "";
    this.dialogTypeNameEnglish = "";
    this.dialogTypeNameChinese = "";
  }

  /**
   * 更改取消
   * 
   * @memberof Region
   */
  editCancle() {
    this.editDialog = false;

    this.dialogTypeCode = "";
    this.dialogTypeNameEnglish = "";
    this.dialogTypeNameChinese = "";
  }

  /**
   * 删除弹窗
   * 
   * @memberof Region
   */
  deleteClick(idx, data) {
    // this.deleteDialog = true;
    this.editRegionGroupCode = data.regionCategoryCode;
    this.deleteService.confirm(() => {
      let timeStamp = new Date();
      this.httpService.get('/bpd-proj/bpd/regionCategory/delete?' + timeStamp.getTime() + '&regionCategoryCode=' + this.editRegionGroupCode)
        .subscribe(data => {
          if ("1" == data.code) { //操作成功
            this.growLife = 5000;
            this.messageService.showSuccess('Operation succeeded!');
          } else if (data.code == "2") {
            this.growLife = 999999;
            this.messageService.showInfo("The Category Has Buget!");
          } else if (data.code == "3") {
            this.growLife = 999999;
            this.messageService.showInfo("The Category Has A Region!");
          } else if (data.code == "4") {
            this.growLife = 999999;
            this.messageService.showInfo("The Category Has WBS!");
          } else if (data.code == "5") {
            this.growLife = 999999;
            this.messageService.showInfo("The Category Has AR!");
          } else if (data.code == "9") {
            this.growLife = 999999;
            this.deleteIdentificationDialog = true;
          } else { //操作失败
            this.growLife = 5000;
            this.messageService.showError('Operation failed!');
          }
          this.msgs = this.messageService.msgs;
          this.tableOnInit();
        })
    })
  }

  /**
   * 删除确认
   * 
   * @memberof Region
   */
  deleteYes() {
    let timeStamp = new Date();
    this.httpService.get('/bpd-proj/bpd/regionCategory/delete?' + timeStamp.getTime() + '&regionCategoryCode=' + this.editRegionGroupCode)
      .subscribe(data => {
        if ("1" == data.code) { //操作成功
          this.growLife = 5000;
          this.messageService.showSuccess('Operation succeeded!');
        } else if (data.code == "2") {
          this.growLife = 999999;
          this.messageService.showInfo("The Category Has Buget!");
        } else if (data.code == "3") {
          this.growLife = 999999;
          this.messageService.showInfo("The Category Has A Region!");
        } else if (data.code == "4") {
          this.growLife = 999999;
          this.messageService.showInfo("The Category Has WBS!");
        } else if (data.code == "5") {
          this.growLife = 999999;
          this.messageService.showInfo("The Category Has AR!");
        } else if (data.code == "9") {
          this.growLife = 999999;
          // this.deleteIdentificationDialog = true;
          this.deleteService.confirm(() => {
            this.httpService.get('/bpd-proj/bpd/regionCategory/trueDelete' + Number(new Date()) + '&regionCatgoryCode=' + this.editRegionGroupCode)
              .subscribe(data => {
                if (data.code == "1") {
                  this.growLife = 5000;
                  this.messageService.showSuccess("Operate Success!");
                } else {
                  this.growLife = 5000;
                  this.messageService.showError("Operate Failed!");
                }
                this.msgs = this.messageService.msgs;
              })
          })
        } else { //操作失败
          this.growLife = 5000;
          this.messageService.showError('Operation failed!');
        }
        this.msgs = this.messageService.msgs;
        this.tableOnInit();
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

  /**
   * 显示code界面
   * 
   * @memberof Region
   */
  codeClick() {
    this.regionCode = true;
    this.regionParameter = false;
    this.regionTemplate = false;
    this.regionDefineColumn = false;
  }
  /**
   * 显示parameter界面
   * 
   * @memberof Region
   */
  parameterClick() {
    this.regionCode = false;
    this.regionParameter = true;
    this.regionTemplate = false;
  }
  /**
   * 显示template界面
   * 
   * @memberof Region
   */
  templateClick() {
    this.regionCode = false;
    this.regionParameter = false;
    this.regionTemplate = true;
  }

  changeTab($event) {
    switch ($event.index) {
      case 0:
        this.regionCode = true;
        this.regionParameter = false;
        this.regionTemplate = false;
        this.regionDefineColumn = false;
        break;
      case 1:
        this.regionCode = false;
        this.regionParameter = true;
        this.regionTemplate = false;
        this.regionDefineColumn = false;
        break;
      case 2:
        this.regionCode = false;
        this.regionParameter = false;
        this.regionDefineColumn = false;
        this.regionTemplate = true;
        break;
      case 3:
        this.regionCode = false;
        this.regionParameter = false;
        this.regionTemplate = false;
        this.regionDefineColumn = true;
        break;
    }
  }

  deleteIdentificationYes() {
    this.httpService.get('/bpd-proj/bpd/regionCategory/trueDelete' + Number(new Date()) + '&regionCatgoryCode=' + this.editRegionGroupCode)
      .subscribe(data => {
        if (data.code == "1") {
          this.growLife = 5000;
          this.messageService.showSuccess("Operate Success!");
        } else {
          this.growLife = 5000;
          this.messageService.showError("Operate Failed!");
        }
        this.msgs = this.messageService.msgs;
      })
    this.deleteIdentificationDialog = false;
  }

  deleteIdentificationNo() {
    this.deleteIdentificationDialog = false;
  }

  regionGroupEnterSearch($event) {
    if ($event.key === "Enter") {
      this.searchClick();
    }
  }

  searchClick() {
    this.tableOnInit();
  }
};