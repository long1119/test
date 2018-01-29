import {
  Component,
  Input,
  OnChanges,
  SimpleChanges
  // Output,
  // EventEmitter
} from '@angular/core';
import 'style-loader!./regionCode.scss';
import {
  SelectItem,
  Message
} from 'primeng/primeng';
import {
  HttpDataService
} from '../../../../../service/http.service';
import {
  MessageService
} from '../../../../../service/message.service';
import {
  DataManageService
} from '../../../../../service/dataManage.service';
import {
  DeleteComfirmService
} from '../../../../../service/deleteDialog.service';
// import { BaseDataModule } from '../../baseData.module';

@Component({
  selector: 'region-code',
  templateUrl: './regionCode.html',
  styleUrls: ['./regionCode.scss']
})

export class RegionCode {
  addDialog: Boolean = false;
  editDialog: Boolean = false;
  deleteDialog: Boolean = false;
  selectAddDialog: Boolean = false;
  msgs: Message[] = [];
  growLife: number = 5000;

  @Input() changeCode: string;
  @Input() changeCategoryCode: string;
  @Input() changeName: string;
  @Input() changeCategoryName: string;
  @Input() changeCatFlag: string;
  @Input() regionVendors: any[];

  dialogCode: any;
  dialogGroup: any;
  dialogDesctiption: any;
  dialogConstCenter: any;
  dialogCompanyCode: any;
  dialogType: any;

  selectedRegionGroup: string;
  selectedRegionType: string;


  baseData: any[];
  baseRechooseData: any[];
  selectedBaseRechooseData: any;

  selectedIndex: number;
  selectedPropertyGroup: string;
  selectedData: any = {};
  public localStorageAuthority: Boolean;
  // private allRegionCatArr: any[] = [];


  constructor(private httpService: HttpDataService, private messageService: MessageService, private dataManageService: DataManageService, private deleteService: DeleteComfirmService) { }

  ngOnInit() {
    // this.httpService.post("/bpd-proj/bpd/region/getVList", {})
    //   .subscribe(data => {
    //     console.log(data);
    //     this.baseData = data;
    //   });
    this.localStorageAuthority = this.dataManageService.buttonAuthority("Maintain Region");
  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log(this.changeCode);
    if (this.changeCategoryCode) {
      this.httpService.post("/bpd-proj/bpd/region/getVList", {
        "regionCategoryCode": this.changeCategoryCode
      })
        .subscribe(data => {
          this.baseData = data;
        });
    }

  }
  /**
   * 添加界面显示
   * 
   * @memberof RegionCode
   */
  addClick() {
    this.selectedBaseRechooseData = null;
    if (this.changeCatFlag === "yes") {
      if (this.regionVendors.length != 0) {
        let arr: any[] = [];
        for (let i = 0; i < this.baseData.length; i++) {
          if (this.baseData[i].regionCodes) {
            arr.push(this.baseData[i].regionCodes);
          }
        }
        if (this.baseData.length == 0) {
          arr = null;
        }
        this.httpService.post('/bpd-proj/bpd/region/getVList', {
          regionCodeArr: arr,
          regionGroupName: "PD",
          // flag: "1"
        })
          .subscribe(data => {
            this.baseRechooseData = data;
            this.selectAddDialog = true;
          })
      }
      // let arr: any[] = [];
      // for (let i = 0; i < this.baseData.length; i++) {
      //   arr.push(this.baseData[i].regionCode);
      // }
      // if (arr.length === 0) arr = null;

    } else {
      this.addDialog = true;
      this.dialogCode = "";
      this.dialogDesctiption = "";
      this.dialogType = this.changeCategoryName;
      this.dialogGroup = this.changeName;
    }


  }
  /**
   * 编辑页面显示
   * 
   * @param {any} idx 
   * @param {any} data 
   * @memberof RegionCode
   */
  editClick(idx, data) {
    // this.selectedIndex = idx;
    this.dialogCode = data.regionCode;
    this.dialogType = data.regionCategoryName;
    this.dialogGroup = this.changeCode;
    this.dialogDesctiption = data.regionName;
    this.dialogGroup = data.regionGroupName;
    this.dialogConstCenter = data.costCenter;
    this.dialogCompanyCode = data.companyCode;

    this.editDialog = true;
  }
  /**
   * 删除界面显示
   * 
   * @param {any} idx 
   * @param {any} data 
   * @memberof RegionCode
   */
  deleteClick(idx, data) {
    this.selectedIndex = idx;
    // this.deleteDialog = true;
    this.deleteService.confirm(() => {
      let timeStamp = new Date();
      this.httpService.get("/bpd-proj/bpd/region/delete?" + timeStamp.getTime() + "&regionCode=" + this.baseData[this.selectedIndex].regionCode + "&regionCatCode=" + this.changeCategoryCode)
        .subscribe(data => {
          if ("1" == data.code) { //操作成功
            this.growLife = 5000;
            this.messageService.showSuccess('Operation succeeded!');
          } else if (data.code == "2") {
            this.growLife = 999999;
            this.messageService.showInfo("This Region Is Used By Budget!")
          } else { //操作失败
            this.growLife = 5000;
            this.messageService.showError('Operation failed!');
          }
          //获取操作信息
          this.msgs = this.messageService.msgs;
          this.httpService.post("/bpd-proj/bpd/region/getVList", {
            "regionCategoryCode": this.changeCategoryCode
          })
            .subscribe(data => {
              this.baseData = data;
            });
        });
    })

  }
  /**
   * 取消添加
   * 
   * @memberof RegionCode
   */
  addCancle() {
    this.addDialog = false;
    // this.selectedRegionType = this.regionTypeOption[0].value;
    // this.selectedRegionGroup = this.regionGroupOption[0].value;
    this.dialogCode = "";
    this.dialogGroup = "";
    this.dialogDesctiption = "";
    this.dialogConstCenter = "";
    this.dialogCompanyCode = "";
  }
  /**
   * 添加确认
   * 
   * @memberof RegionCode
   */
  addSave($event) {
    console.log($event);
    let sendData: any = {};
    if (this.changeCatFlag === "yes") {
      sendData = {
        "regionCode": "v-" + $event.data.regionCode,
        "regionCategoryCode": this.changeCategoryCode,
        "costCenter": $event.data.costCenter,
        "regionGroupCode": this.changeCode,
        "regionName": $event.data.regionName,
        "companyCode": $event.data.companyCode
      };
    } else {
      sendData = {
        "regionCode": this.dialogCode,
        "regionCategoryCode": this.changeCategoryCode,
        "costCenter": this.dialogConstCenter,
        "regionGroupCode": this.changeCode,
        "regionName": this.dialogDesctiption,
        "companyCode": this.dialogCompanyCode
      };
    }
    this.httpService.post("/bpd-proj/bpd/region/insert", sendData)
      .subscribe(data => {
        if ("1" == data.code) { //操作成功
          this.growLife = 5000;
          this.messageService.showSuccess('Operation succeeded!');
          if (this.changeCatFlag === "yes") {
            for (let i = 0; i < this.baseRechooseData.length; i++) {
              if ($event.data === this.baseRechooseData[i]) {
                this.baseRechooseData.splice(i, 1);
              }
            }
          }
        } else if (data.code == "2") {
          this.growLife = 999999;
          this.messageService.showInfo('Region Code Exists!');
        } else { //操作失败
          this.growLife = 5000;
          this.messageService.showError('Operation failed!');
        }
        //获取操作信息
        this.msgs = this.messageService.msgs;
        this.httpService.post("/bpd-proj/bpd/region/getVList", {
          "regionCategoryCode": this.changeCategoryCode
        })
          .subscribe(data => {
            this.baseData = data;
          })
      })

    this.addDialog = false;

    this.dialogCode = "";
    this.dialogGroup = "";
    this.dialogDesctiption = "";
    this.dialogConstCenter = "";
    this.dialogCompanyCode = "";
  }
  /**
   * 编辑确认
   * 
   * @memberof RegionCode
   */
  editSave(idx, data) {
    // this.editDialog = false;
    // let groupId: String;

    this.httpService.post("/bpd-proj/bpd/region/update", {
      "regionCode": this.dialogCode,
      "regionCategoryCode": this.selectedRegionType,
      "costCenter": this.dialogConstCenter,
      "regionGroupCode": this.selectedRegionGroup,
      "regionName": this.dialogDesctiption,
      "companyCode": this.dialogCompanyCode
    })
      .subscribe(data => {
        if ("1" == data.code) { //操作成功
          this.growLife = 5000;
          this.messageService.showSuccess('Operation succeeded!');
        } else if ("2" == data.code) {
          this.growLife = 999999;
          this.messageService.showInfo("Region Code Exist!")
        } else { //操作失败
          this.growLife = 5000;
          this.messageService.showError('Operation failed!');
        }
        this.msgs = this.messageService.msgs;
        this.httpService.post("/bpd-proj/bpd/region/getVList", {
          "regionCategoryCode": this.changeCategoryCode
        })
          .subscribe(data => {
            this.baseData = data;
          });
      });


    this.editDialog = false;
    this.dialogCode = "";
    this.dialogGroup = "";
    this.dialogDesctiption = "";
    this.dialogConstCenter = "";
    this.dialogCompanyCode = "";
  }
  /**
   * 取消编辑
   * 
   * @memberof RegionCode
   */
  editCancle() {
    this.editDialog = false;
    this.dialogCode = "";
    this.dialogGroup = "";
    this.dialogDesctiption = "";
    this.dialogConstCenter = "";
    this.dialogCompanyCode = "";
  }
  /**
   * 删除确认
   * 
   * @memberof RegionCode
   */
  deleteYes() {
    this.deleteDialog = false;
    let timeStamp = new Date();
    this.httpService.get("/bpd-proj/bpd/region/delete?" + timeStamp.getTime() + "&regionCode=" + this.baseData[this.selectedIndex].regionCode + "&regionCatCode=" + this.changeCategoryCode)
      .subscribe(data => {
        if ("1" == data.code) { //操作成功
          this.growLife = 5000;
          this.messageService.showSuccess('Operation succeeded!');
        } else if (data.code == "2") {
          this.growLife = 999999;
          this.messageService.showInfo("This Region Is Used By Budget!")
        } else { //操作失败
          this.growLife = 5000;
          this.messageService.showError('Operation failed!');
        }
        //获取操作信息
        this.msgs = this.messageService.msgs;
        this.httpService.post("/bpd-proj/bpd/region/getVList", {
          "regionCategoryCode": this.changeCategoryCode
        })
          .subscribe(data => {
            this.baseData = data;
          });
      });
  }
  /**
   * 删除确认
   * 
   * @memberof RegionCode
   */
  deleteNo() {
    this.deleteDialog = false;
  }

  checkEnglish($event) {
        let reg = /[^a-zA-Z0-9]/;
        let regexp = new RegExp(reg);
        if (!regexp.test($event)) {
            return $event;
        } else {
            this.messageService.showInfo("Please Inser Number Or Letter!")
            this.growLife = 3000000;
            this.msgs = this.messageService.msgs;
            return null;
        }
    }
};