// import {BugetTemplateService} from './BugetTemplate.service';
import 'style-loader!./echangeRate.scss';
// import { SelectItem } from 'primeng/primeng';
import {
  Component,
  OnInit
} from '@angular/core';
import {
  Message,
  SelectItem
} from 'primeng/primeng'
// import {  } from 'primeng/primeng'
import {
  HttpDataService
} from '../../../service/http.service';
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
  selector: 'echange-rate',
  templateUrl: './echangeRate.html',
})
export class EchangeRate {
  growMessage: Message[];
  baseData: any[];
  messageData: any[];

  selectedIdx: number;

  addDialog: Boolean = false;
  messageDialog: Boolean = false;
  deleteDialog: Boolean = false;
  importFlag: Boolean = false;
  changedCode: string;
  echangeTotalRecords: number;
  paginatorPage: number;
  paginatorRow: number;
  uploadUuId: string;
  msgs: Message[];
  growLife: number = 5000;

  yearRange: string;
  yearSerchStore: SelectItem[] = [];
  monthSerchStore: SelectItem[] = [];
  monthSerch: any;
  yearSerch: any;
  fileUploadFlag: Boolean = true;

  public localStorageAuthority: Boolean;

  constructor(private httpService: HttpDataService, private messageService: MessageService, private dataManageService: DataManageService, private deleteService: DeleteComfirmService) {
    this.paginatorRow = 10;
    this.paginatorPage = 1;
    // 日期年份设置
    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth();
    this.yearRange = "" + (Number(currentYear) - 10) + ":" + (Number(currentYear) + 50);
    for (let i = 0; i < 15; i++) {
      this.yearSerchStore.push({
        label: (currentYear - 5 + i) + '年',
        value: currentYear - 5 + i
      })
    }
    // this.yearSerchStore.unshift({
    //   label: 'Select',
    //   value: null
    // })
    this.yearSerch = currentYear;
    for (let i = 1; i < 13; i++) {
      let j = i < 10 ? "0" + i : i;
      this.monthSerchStore.push({
        label: i + '月',
        value: j
      })
    }
    this.monthSerch = Number(currentMonth) + 1;
    // this.monthSerchStore.unshift({
    //   label: 'Sel',
    //   value: null
    // })
  }

  ngOnInit() {
    this.httpService.post("/bpd-proj/bpd/exchangeRateInfo/getList", {
      "page": {
        "page": this.paginatorPage,
        "rows": this.paginatorRow
      }
    })
      .subscribe(data => {
        this.echangeTotalRecords = data.total;
        if (!data.rows.length) {
          data.rows = [{}];
        }
        let length = data.rows.length;

        while (length > 10) {
          length -= 10;
        }
        if (length > 0 && length < 10) {
          for (let i = 0; i < 10 - length; i++) {
            data.rows.push({
              id: i
            });
          }
        }
        this.baseData = data.rows;
      })
    this.localStorageAuthority = this.dataManageService.buttonAuthority("Maintain FX Forecast");
  }

  /**
   * 分页切换事件
   * 
   * @param {any} event 
   * @memberof EchangeRate
   */
  paginate($event) {
    this.paginatorPage = $event.page + 1;
    this.paginatorRow = $event.rows;
    this.httpService.post("/bpd-proj/bpd/exchangeRateInfo/getList", {
      "page": {
        "page": $event.page + 1,
        "rows": $event.rows
      }
    })
      .subscribe(data => {
        this.echangeTotalRecords = data.total;
        if (!data.rows.length) {
          data.rows = [{}];
        }
        let length = data.rows.length;

        while (length > 10) {
          length -= 10;
        }
        if (length > 0 && length < 10) {
          for (let i = 0; i < 10 - length; i++) {
            data.rows.push({
              id: i
            });
          }
        }
        this.baseData = data.rows;
      })

  }

  /**
   * 分页信息接收
   * 
   * @param {any} $event 
   * @memberof EchangeRate
   */
  paginatorPageRec($event) {
    this.paginatorPage = $event;
  }
  paginatorRowRec($event) {
    this.paginatorRow = $event;
  }

  /**
   * 上传前文件格式校验
   * 
   * @param {any} $event 
   * @memberof EchangeRate
   */
  onBasicSelect($event) {
    // let fileType: any = $event.files.name;
    // fileType = fileType.split("."); 
    // console.log(111);
    // console.log(fileType);
    this.monthSerch = this.monthSerch.length === 1 ? "0" + this.monthSerch : this.monthSerch;
  }

  dateChange() {
    this.checkDate();
  }

  checkDate() {

    this.monthSerch = this.monthSerch.length === 1 ? "0" + this.monthSerch : this.monthSerch;
    this.httpService.get('/bpd-proj/bpd/exchangeRateInfo/isExistVDate?vDate=' + this.yearSerch + "-" + this.monthSerch)
      .subscribe(data => {
        this.fileUploadFlag = data;
      })
  }

  /**
   * 上传文件前事件
   * 
   * @param {any} $event 
   * @memberof EchangeRate
   */
  onBasicBeforeUpload($event) {

  }

  /**
   * 上传完成
   * 
   * @param {any} $event 
   * @memberof EchangeRate
   */
  onBasicUpload($event) {
    let response = eval('(' + $event.xhr.response + ')');
    console.log(response.list.length);
    if (response.list.length !== 0) {
      this.messageData = response.list;
      this.messageDialog = true;
      this.addDialog = false;
    } else {
      this.messageService.showSuccess("Operation Success!");
      this.growMessage = this.messageService.msgs;
      this.growLife = 5000;
      this.addDialog = false;
      this.httpService.post("/bpd-proj/bpd/exchangeRateInfo/getList", {
        "page": {
          "page": this.paginatorPage,
          "rows": this.paginatorRow
        }
      })
        .subscribe(data => {
          this.echangeTotalRecords = data.total;
          if (!data.rows.length) {
            data.rows = [{}];
          }
          let length = data.rows.length;

          while (length > 10) {
            length -= 10;
          }
          if (length > 0 && length < 10) {
            for (let i = 0; i < 10 - length; i++) {
              data.rows.push({
                id: i
              });
            }
          }
          this.baseData = data.rows;
        })
    }
    // console.log(response.list[0].colIndex,response.list[0].errorInfo,response.list[0].operateFlag,response.list[0].rowIndex);
    // console.log(unescape(response.list[0].errorInfo))
  }

  addClick() {
    this.addDialog = true;
    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth();
    currentMonth = Number(currentMonth) + 1;
    this.monthSerch = currentMonth < 10 ? "0" + currentMonth : currentMonth;
    this.yearSerch = currentYear;
    this.checkDate();
  }

  messageDetermine() {
    this.messageDialog = false;
    this.httpService.post("/bpd-proj/bpd/exchangeRateInfo/getList", {
      "page": {
        "page": this.paginatorPage,
        "rows": this.paginatorRow
      }
    })
      .subscribe(data => {
        this.echangeTotalRecords = data.total;
        this.baseData = this.dataManageService.addEmptyPaginatorTableData(data, 10);
      })
  }
  messageVeto() {
    this.messageDialog = false;
    this.httpService.post("/bpd-proj/bpd/exchangeRateInfo/getList", {
      "page": {
        "page": this.paginatorPage,
        "rows": this.paginatorRow
      }
    })
      .subscribe(data => {
        this.echangeTotalRecords = data.total;
        this.baseData = this.dataManageService.addEmptyPaginatorTableData(data, 10);
      })
  }

  deleteClick(idx, data) {
    this.selectedIdx = idx;
    // this.deleteDialog = true;
    this.deleteService.confirm(() => {
      this.deleteYes();
    })
  }

  deleteYes() {
    this.deleteDialog = false;
    this.httpService.get("/bpd-proj/bpd/exchangeRateInfo/delete?exchangeRateId=" + this.baseData[this.selectedIdx].exchangeRateId)
      .subscribe(data => {
        if (data.code === "1") {
          this.messageService.showSuccess("Opearate Success!");
          this.httpService.post('/bpd-proj/bpd/exchangeRateInfo/getList', {
            "page": {
              "page": this.paginatorPage,
              "rows": this.paginatorRow
            }
          })
            .subscribe(data => {
              this.baseData = this.dataManageService.addEmptyPaginatorTableData(data, 10);
            })
        } else {
          this.messageService.showError("Operate Failed!");
        }
        this.msgs = this.messageService.msgs;
      })
  }

  deleteNo() {
    this.deleteDialog = false;
  }

  forcastInfoClick(idx, data) {
    this.changedCode = data.exchangeRateId;
    this.importFlag = !this.importFlag;
  }

  rejFlag($event) {
    this.importFlag = $event;
  }
};