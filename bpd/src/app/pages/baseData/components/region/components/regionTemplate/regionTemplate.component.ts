import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
// import {BugetTemplateService} from './BugetTemplate.service';
import 'style-loader!./regionTemplate.scss';
import { SelectItem } from 'primeng/primeng';
import {
  RegionService
} from '../../region.service';
import {
  HttpDataService
} from '../../../../../service/http.service';
import {
  DataManageService
} from '../../../../../service/dataManage.service';
import {
  DeleteComfirmService
} from '../../../../../service/deleteDialog.service';
import { MessageService } from '../../../../../service/message.service';

// import { BaseDataModule } from '../../baseData.module';

@Component({
  selector: 'region-template',
  templateUrl: './regionTemplate.html',
  providers: [DataManageService, HttpDataService, MessageService]
})
export class RegionTemplate {

  constructor(
    private dataManageService: DataManageService,
    private service: HttpDataService,
    private msgservice: MessageService,
    private deleteService: DeleteComfirmService
  ) {

  }

  ngOnChanges(changes: SimpleChanges) {
    this.service.post('/bpd-proj/bpd/att/getVList', {
      "bussinessId": this.changeCategoryCode + "cat"
    })
      .subscribe(data => {
        this.tables = data;
      })
  }

  ngOnInit() {
    this.localStorageAuthority = this.dataManageService.buttonAuthority("Maintain Region");
  }

  @Input() changeCategoryCode: string;

  @Input() selectedRegionCategory: any;

  public tables: any[] = [];

  public deleteDialog: boolean = false;

  public msgs: any;

  public growLife: number = 5000;

  public addDialog: boolean = false;

  public messageDialog: boolean = false;

  public messageData: any = [];

  public uploadURL: string = '';

  public attId: string = null;

  private selectedIndex: number;

  public localStorageAuthority: Boolean;

  public errMessage: any;

  public errDialog: Boolean = false;

  /**
   * 添加模态框显示
   * 
   * @memberof RegionTemplate
   */
  addClick() {
    this.attId = this.dataManageService.getUuId();
    this.uploadURL = '/bpd-proj/bpd/att/upload?bussinessId=' + this.changeCategoryCode + 'cat&attId=' + this.attId;
    this.addDialog = true;
  }

  onBasicUpload($event) {
    if (this.allowUpload) {
      this.service.get('/bpd-proj/bpd/budgetTemplate/addAtt?' + Number(new Date()) + '&attId=' + this.attId + '&type=Template')
        .subscribe(data => {
          if (data.code == "1") {
            this.growLife = 5000;
            this.msgservice.showSuccess("Operate Success!");
          } else {
            this.growLife = 5000;
            this.msgservice.showError("Operate Failed!");
          }
          this.msgs = this.msgservice.msgs;
          this.service.post('/bpd-proj/bpd/att/getVList', {
            "bussinessId": this.changeCategoryCode + "cat"
          })
            .subscribe(data => {
              this.tables = data;
            })
        })
    } else {
      this.growLife = 999999;
      this.msgservice.showInfo("please upload right template");
      this.msgs = this.msgservice.msgs;
    }
    this.addDialog = false;
  }


  onBasicBeforeUpload($event) {
    // this.service.post
  }

  public allowUpload: boolean = false;
  public budgetUploadURL: string = "/bpd-proj/bpd/budgetTemplate/uploadBudgetTemplate";
  onBasicSelect(event) {
    if (this.selectedRegionCategory.catFlag == "no") {
      this.budgetUploadURL = "/bpd-proj/bpd/budgetTemplate/uploadBudgetTemplate";
    } else {
      this.budgetUploadURL = "/bpd-proj/bpd/budgetTemplate/uploadMouldTemplate";
    }
    var xhr = new XMLHttpRequest(), formData = new FormData();
    event.files[0].filename = event.files[0].name;
    formData.append('file', event.files[0]);
    if (this.budgetUploadURL.indexOf("?") === -1) {
      this.budgetUploadURL = this.budgetUploadURL + "?_=" + Number(new Date());
    } else {
      this.budgetUploadURL = this.budgetUploadURL + "&_=" + Number(new Date());
    }
    xhr.open('POST', this.budgetUploadURL, true);
    var accessToken = sessionStorage.getItem("access_token");
    if (accessToken) {
      xhr.setRequestHeader("accessToken", accessToken.substr(1, accessToken.length - 2));
    }
    let _this = this;
    xhr.onload = function (oEvent) {
      let errList = JSON.parse(xhr.response).list;
      if (errList.length == 0) {
        _this.allowUpload = true;
      } else {
        _this.allowUpload = false;
        _this.errMessage = errList;
        _this.errDialog = true;
      }
    };
    xhr.send(formData);
  }

  /**
   * 添加确认
   * 
   * @memberof RegionTemplate
   */
  addSave() {

    this.addDialog = false;
  }

  /**
   * 添加取消
   * 
   * @memberof RegionTemplate
   */
  addCancle() {

    this.addDialog = false;
  }


  downloadClick(idx, data) {
    let token = window.sessionStorage.getItem("access_token");
    let url: string = '/bpd-proj/bpd/att/downloadFiles?attIds=' + data.attId + "&_=" + Number(new Date());
    if (token) {
      let realToken = token.substr(1, token.length - 2)
      url = url + "&accessToken=" + realToken;
    }
    window.location.href = url;
  }

  /**
   * 删除模态框弹出
   * 
   * @memberof RegionTemplate
   */
  deleteClick(idx, data) {
    this.selectedIndex = idx;
    // this.deleteDialog = true;
    this.deleteService.confirm(() => {
      this.service.get('/bpd-proj/bpd/att/delete?' + Number(new Date()) + '&attIds=' + this.tables[this.selectedIndex].attId)
        .subscribe(data => {
          if (data.code == "1") {
            this.growLife = 5000;
            this.msgservice.showSuccess("Operate Success!");
          } else {
            this.growLife = 5000;
            this.msgservice.showError("Operate Failed!");
          }
          this.msgs = this.msgservice.msgs;
          this.service.post('/bpd-proj/bpd/att/getVList', {
            "bussinessId": this.changeCategoryCode + "cat"
          })
            .subscribe(data => {
              this.tables = data;
            })
        })
    })
  }

  /**
   * 删除确认
   * 
   * @memberof RegionTemplate
   */
  deleteYes() {
    this.service.get('/bpd-proj/bpd/att/delete?' + Number(new Date()) + '&attIds=' + this.tables[this.selectedIndex].attId)
      .subscribe(data => {
        if (data.code == "1") {
          this.growLife = 5000;
          this.msgservice.showSuccess("Operate Success!");
        } else {
          this.growLife = 5000;
          this.msgservice.showError("Operate Failed!");
        }
        this.msgs = this.msgservice.msgs;
        this.service.post('/bpd-proj/bpd/att/getVList', {
          "bussinessId": this.changeCategoryCode + "cat"
        })
          .subscribe(data => {
            this.tables = data;
          })
      })
    this.deleteDialog = false;
  }

  /**
   * 删除取消
   * 
   * @memberof RegionTemplate
   */
  deleteNo() {
    this.deleteDialog = false;
  }
};