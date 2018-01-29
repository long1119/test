import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter
} from '@angular/core';
// import {BugetTemplateService} from './BugetTemplate.service';
import 'style-loader!./ArSubProject.scss';
import {
  SelectItem,
  Message
} from 'primeng/primeng';
import {
  Router
} from "@angular/router";
import {
  MessageService
} from '../../../../service/message.service';
import {
  HttpDataService
} from '../../../../service/http.service';
import {
    DataManageService
} from '../../../../service/dataManage.service';
import {
    DeleteComfirmService
} from '../../../../service/deleteDialog.service';

@Component({
  selector: 'ar-sub-project',
  templateUrl: './ArSubProject.html',
})
export class ArSubProject {
  public addDialog: Boolean = false;
  public editDialog: Boolean = false;
  public deleteDialog: Boolean = false;
  public searchDialog: Boolean = false;
  public requireFlag: Boolean = true;
  public searchFlag: string;

  selectedIndex: number;

  public dialogRegionData: any;
  public dialogRegion: string;
  public dialogRegionType: string;
  public dialogAdSubCode: string;
  public dialogAdSubName: string;
  public dialogTextarea: string;
  public baseDataLen: number;
  public paginatorPage: number;
  public paginatorRow: number;
  public selectedData: any;
  public localStorageAuthority: Boolean;
  public selectedRegionData: any[] = [];
  public regionData: any[] = [];

  msgs: Message[];
  public growLife: number = 5000;
  private flag: Boolean = true;

  public baseData: any[] = [];

  @Input() changeCode: string;
  @Input() changeRegionIds: string;
  @Output() refreshFlagOut = new EventEmitter();
  @Input() refreshSubProject: Boolean;
  public adProjCode: string;

  constructor(private httpService: HttpDataService, private messageService: MessageService, private dataManageService: DataManageService, private deleteService: DeleteComfirmService) {
    this.paginatorPage = 1;
    this.paginatorRow = 10;
  }

  ngOnInit() {
        this.localStorageAuthority = this.dataManageService.buttonAuthority("Maintain AR.Project");
        this.httpService.post('/bpd-proj/bpd/arRegionUser/getVList',{})
            .subscribe(data => {
                this.baseData = data;
            })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.changeCode) {
      this.httpService.post('/bpd-proj/bpd/arProjectRegion/getVList',{
        "adProjectCode": this.changeCode
      })
        .subscribe(data => {
          this.regionData = this.dataManageService.addEmptyTableData(data, 10);
      })
    }
  }

  private tableRefresh() {
    this.selectedRegionData = [];
    console.log(this.changeRegionIds);
    if (this.changeRegionIds) {
      let regionIdsArr: any[] = [];
      regionIdsArr = this.changeRegionIds.split(",");
      for (let i = 0, _a = regionIdsArr; i < _a.length; i++) {
        for (let j = 0, _b = this.baseData; j < _b.length; j++) {
          if (_a[i] != "" && _a[i] === _b[j].regionUserId) {
            console.log(_b[j].regionUserId);
            this.selectedRegionData.push(_b[j]);
          }
        }
      }
    }
  }

  /**
   * 添加点击
   * 
   * @memberof ArSubProject
   */
  addClick() {
    this.tableRefresh();
    this.addDialog = true;
  }

  /**
   * 添加确认
   * 
   * @memberof ArSubProject
   */
  addSave() {
    let data: any[] = [];
    let ids:string = "";
    for (let i = 0, _a = this.selectedRegionData; i < _a.length; i++) {
      data.push({
        regionUserId: _a[i].regionUserId,
        adProjectCode: this.changeCode
      })
      ids += (_a[i].regionUserId + ",");
    }
    if (data.length === 0) {
      data.push({
        adProjectCode: this.changeCode
      })
    }
    this.httpService.post('/bpd-proj/bpd/arProjectRegion/insert', data)
      .subscribe(data => {
        if (data.code === "1") {
          this.flag = !this.flag
          this.refreshFlagOut.emit(ids);
          this.messageService.showSuccess("Operate Success!");
          this.growLife = 5000;
        } else if (data.code === "2") {
          this.messageService.showInfo(data.msgs);
          this.growLife = 300000;
        } else {
          this.messageService.showError("Operate Failed!");
          this.growLife = 5000;
        }
        this.msgs = this.messageService.msgs;
      })
    this.addDialog = false;
  }

  /**
   * 添加取消
   * 
   * @memberof ArSubProject
   */
  addCancle() {
    this.addDialog = false;
  }

}