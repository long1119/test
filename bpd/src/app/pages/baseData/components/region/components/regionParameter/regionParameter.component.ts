import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
// import {BugetTemplateService} from './BugetTemplate.service';
import 'style-loader!./regionParameter.scss';
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

@Component({
  selector: 'region-parameter',
  templateUrl: './regionParameter.html',
})
export class RegionParameter {
  baseChoosedData: any[];
  baseData: any[] = [];
  selectedParameter: any;

  searchDialog: Boolean;
  deleteDialog: Boolean;

  @Input() changeCode: string;
  @Input() projectTypeName: string;
  @Input() changeCategoryCode: string;

  selectedIndex: number;
  parameterGroupOption: SelectItem[];
  selectedParameterGroup: string;
  dialogDescription: string;
  public localStorageAuthority: Boolean;
  msgs: Message[];
  growLife: number = 5000;

  constructor(private httpService: HttpDataService, private messageService: MessageService, private dataManageService: DataManageService, private deleteService: DeleteComfirmService) {

  }

  ngOnInit() {

    this.localStorageAuthority = this.dataManageService.buttonAuthority("Maintain Region");
    // this.httpService.post('/bpd-proj/bpd/investAssumeCat/getInvestAssumeCatCombobox', {})
    //   .subscribe(data => {
    //     this.parameterGroupOption = data;
    //   })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.changeCategoryCode) {
      this.httpService.post("/bpd-proj/bpd/regionCatAssumeIndex/getVList", {
        "regionCatCode": this.changeCategoryCode
      })
        .subscribe(data => {
          this.baseChoosedData = data;
        })
    }
  }

  /**
   * 回车搜索
   * 
   * @private
   * @param {any} $event 
   * @memberof RegionParameter
   */
  private parameterNameEnterSearch($event) {
    if ($event.key === "Enter") {
      this.lookClick();
    }
  }

  /**
   * 搜索方法
   * 
   * @memberof ProjectParameter
   */
  lookClick() {
    if (this.parameterGroupOption) {
      this.selectedParameterGroup = this.selectedParameterGroup || this.parameterGroupOption[0].value;
    }
    this.httpService.post('/bpd-proj/bpd/investAssumeIndex/getVList', {
      "investAssumeCatId": this.selectedParameterGroup,
      "investAssumeIndexName": this.dialogDescription
    })
      .subscribe(data => {
        this.baseData = data;
      })
  }

  /**
   * 搜索框弹出事件
   * 
   * @memberof ProjectParameter
   */
  searchClick() {
    this.httpService.post('/bpd-proj/bpd/investAssumeIndex/getVListByRegion', {
      "regionCatCode": this.changeCategoryCode
    })
      .subscribe(data => {
        if (data.length != 0) {
          this.baseData = data;
        }
        this.searchDialog = true;
      })
    this.httpService.post('/bpd-proj/bpd/investAssumeCat/getInvestAssumeCatCombobox', {})
      .subscribe(data => {
        data.unshift({
          label: "All",
          value: null
        })
        this.parameterGroupOption = data;
        this.selectedParameterGroup = data[0].value;
      })
    this.selectedParameter = [];
    this.dialogDescription = "";
    // console.log(this.baseChoosedData);
    // this.baseChoosedData = this.selectedParameter;
    // console.log(this.selectedParameter);
  }

  /**
   * 搜索取消
   * 
   * @memberof ProjectParameter
   */
  searchCancle() {
    this.searchDialog = false;
  }

  /**
   * 搜索确认
   * 
   * @memberof ProjectParameter
   */
  searchSave() {
    this.searchDialog = false;
    let selectedRegionCatCode: any = [];
    for (let i = 0; i < this.selectedParameter.length; i++) {
      selectedRegionCatCode.push(this.selectedParameter[i].investAssumeIndexId);
    }
    selectedRegionCatCode = selectedRegionCatCode.join(",");
    let timeStamp = new Date();
    this.httpService.get('/bpd-proj/bpd/regionCatAssumeIndex/batchAdd?' + timeStamp.getTime() + '&regionCatCode=' + this.changeCategoryCode + '&regionCatAssIndexs=' + selectedRegionCatCode)
      .subscribe(data => {
        if (data.code == "1") {
          this.growLife = 5000;
          this.messageService.showSuccess("Operate Success!");
          this.httpService.post("/bpd-proj/bpd/regionCatAssumeIndex/getVList", {
            "regionCatCode": this.changeCategoryCode
          })
            .subscribe(data => {
              this.baseChoosedData = data;
            })
        } else {
          this.growLife = 5000;
          this.messageService.showError("Operate Failed");
        }
        this.msgs = this.messageService.msgs;
      })
  }

  deleteClick(idx, data) {
    this.selectedIndex = idx;
    // this.deleteDialog = true;
    this.deleteService.confirm(() => {
      this.httpService.get('/bpd-proj/bpd/regionCatAssumeIndex/deleteById?' + Number(new Date()) + '&regionCatAssumeId=' + this.baseChoosedData[this.selectedIndex].regionCatAssumeId)
        .subscribe(data => {
          if (data.code == "1") {
            this.growLife = 5000;
            this.messageService.showSuccess("Operate Success!");
            this.httpService.post("/bpd-proj/bpd/regionCatAssumeIndex/getVList", {
              "regionCatCode": this.changeCategoryCode
            })
              .subscribe(data => {
                this.baseChoosedData = data;
              })
          } else {
            this.growLife = 5000;
            this.messageService.showError("Operate Failed");
          }
          this.msgs = this.messageService.msgs;
        })
    })
  }

  deleteYes() {
    this.httpService.get('/bpd-proj/bpd/regionCatAssumeIndex/deleteById?' + Number(new Date()) + '&regionCatAssumeId=' + this.baseChoosedData[this.selectedIndex].regionCatAssumeId)
      .subscribe(data => {
        if (data.code == "1") {
          this.growLife = 5000;
          this.messageService.showSuccess("Operate Success!");
          this.httpService.post("/bpd-proj/bpd/regionCatAssumeIndex/getVList", {
            "regionCatCode": this.changeCategoryCode
          })
            .subscribe(data => {
              this.baseChoosedData = data;
            })
        } else {
          this.growLife = 5000;
          this.messageService.showError("Operate Failed");
        }
        this.msgs = this.messageService.msgs;
      })
    this.deleteDialog = false;
  }
  deleteNo() {
    this.deleteDialog = false;
  }
}