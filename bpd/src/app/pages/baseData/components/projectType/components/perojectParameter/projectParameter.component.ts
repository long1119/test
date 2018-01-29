import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
// import {BugetTemplateService} from './BugetTemplate.service';
import 'style-loader!./projectParameter.scss';
import {
  SelectItem
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

@Component({
  selector: 'project-parameter',
  templateUrl: './projectParameter.html',
})
export class ProjectParameter {
  baseChoosedData: any[];
  baseData: any[]
  selectedParameter: any;

  searchDialog: Boolean;

  @Input() projectType: string;
  @Input() projectTypeName: string;

  parameterGroupOption: SelectItem[];
  selectedParameterGroup: string;
  dialogDescription: string;

  // 分页信息
  projectParameterTotal: number;
  projectParameterRow: number;
  projectParameterPage: number;
  projectParameterSearchTotal: number;
  projectParameterSearchRow: number;
  projectParameterSearchPage: number;
  public localStorageAuthority: Boolean;

  constructor(private httpService: HttpDataService, private messageService: MessageService, private dataManageService: DataManageService) {
    this.projectParameterRow = 10;
    this.projectParameterPage = 1;
    this.projectParameterSearchPage = 10;
    this.projectParameterSearchRow = 1;
  }

  ngOnInit() {
    this.httpService.post('/bpd-proj/bpd/investAssumeCat/getInvestAssumeCatCombobox', {})
      .subscribe(data => {
        data.unshift({
          label: "all",
          value: null
        })
        this.parameterGroupOption = data;
      })
  }

  ngOnChanges(changes: SimpleChanges) {
    this.localStorageAuthority = this.dataManageService.buttonAuthority("Maintain Project Type");
    // this.projectType == "110" || 
    if (this.projectType == "100") {
      this.localStorageAuthority = false;
    }
    if (!!this.projectType) {
      this.httpService.post("/bpd-proj/bpd/typeIndex/getVList", {
          "projectType": this.projectType,
          "page": {
            "page": this.projectParameterPage,
            "rows": this.projectParameterRow
          }
        })
        .subscribe(data => {
          this.projectParameterTotal = data.total;
          this.baseChoosedData = this.dataManageService.addEmptyPaginatorTableData(data, this.projectParameterRow);
        })
    }
  }

  /**
   * 表格分页
   * 
   * @memberof ProjectParameter
   */
  projectParameterPaginate($event) {
    this.projectParameterRow = $event.rows;
    this.projectParameterPage = $event.page + 1;
    this.httpService.post("/bpd-proj/bpd/typeIndex/getVList", {
        "projectType": this.projectType,
        "page": {
          "page": $event.page + 1,
          "rows": $event.rows
        }
      })
      .subscribe(data => {
        this.projectParameterTotal = data.total;
        this.baseChoosedData = this.dataManageService.addEmptyPaginatorTableData(data, this.projectParameterRow);
      })
  }

  /**
   * 回车搜索
   * 
   * @private
   * @param {any} $event 
   * @memberof ProjectParameter
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
    this.selectedParameterGroup = this.selectedParameterGroup || this.parameterGroupOption[0].value;
    this.httpService.post('/bpd-proj/bpd/investAssumeIndex/getVList', {
        "investAssumeCatId": this.selectedParameterGroup,
        "investAssumeIndexName": this.dialogDescription.trim()
      })
      .subscribe(data => {
        if (!data.length) {
          data = [{}];
        }
        let length = data.length;
        while (length > 10) {
          length -= 10;
        }
        if (length > 0 && length < 10) {
          for (let i = 0; i < 10 - length; i++) {
            data.push({});
          }
        }
        this.baseData = data;
      })
  }

  /**
   * 搜索框弹出事件
   * 
   * @memberof ProjectParameter
   */
  searchClick() {
    if (this.parameterGroupOption.length != 0) {
      this.selectedParameterGroup = this.parameterGroupOption[0].value;
    }
    this.dialogDescription = "";
    this.httpService.post("/bpd-proj/bpd/typeIndex/getVList1", {
        "projectType": this.projectType,
      })
      .subscribe(data => {
        let selectedData = data
        this.httpService.post('/bpd-proj/bpd/investAssumeIndex/getVList', {})
          .subscribe(data => {
            this.searchDialog = true;
            let selectedParameterList: any[] = [];
            for (let i = 0; i < selectedData.length; i++) {
              for (let j = 0; j < data.length; j++) {
                if (selectedData[i].investAssumeIndexId == data[j].investAssumeIndexId)   {
                    selectedParameterList.push(data[j]);
                }
              }
            }
            this.selectedParameter = selectedParameterList;
            this.baseData = data;
          })
        })
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
    let selectedProjectType: any = [];
    console.log(this.selectedParameter);
    for (let i = 0; i < this.selectedParameter.length; i++) {
      selectedProjectType.push(this.selectedParameter[i].investAssumeIndexId);
    }
    selectedProjectType = selectedProjectType.join(",");
    let timeStamp = new Date();
    this.httpService.get('/bpd-proj/bpd/typeIndex/updateTypeIndexs?' + timeStamp.getTime() + '&projectType=' + this.projectType + "&investAssumeIndexIds=" + selectedProjectType)
      .subscribe(data => {
        this.httpService.post("/bpd-proj/bpd/typeIndex/getVList", {
            "projectType": this.projectType,
            "page": {
              "page": this.projectParameterPage,
              "rows": this.projectParameterRow
            }
          })
          .subscribe(data => {
            this.projectParameterTotal = data.total;
            this.baseChoosedData = this.dataManageService.addEmptyPaginatorTableData(data, this.projectParameterRow);
          })
      })
  }
}