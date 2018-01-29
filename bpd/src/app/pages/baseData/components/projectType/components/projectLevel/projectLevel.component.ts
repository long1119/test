import {
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
  Input
} from '@angular/core';
// import {BugetTemplateService} from './BugetTemplate.service';
import 'style-loader!./projectLevel.scss';
import {
  SelectItem,
  Message
} from 'primeng/primeng';
import {
  HttpDataService
} from "../../../../../service/http.service";
import {
  MessageService
} from "../../../../../service/message.service";
import {
  DataManageService
} from "../../../../../service/dataManage.service";
import {
  DeleteComfirmService
} from '../../../../../service/deleteDialog.service';

@Component({
  selector: 'project-level',
  templateUrl: './projectLevel.html',
})

export class ProjectLevel {

  baseData: any = [];

  addDialog: Boolean = false;
  editDialog: Boolean = false;
  deleteDialog: Boolean = false;
  public localStorageAuthority: Boolean;
  dialogLevelName: string;
  dialogLevel: string;
  upLoaded: Boolean = false;
  Uuid: string;
  selectedIndex: string;
  selectedProjectLevel: string;
  projectLevelOption: SelectItem[];


  @Input() projectType: string;
  @Input() projectTypeName: string;
  uploadFlag: boolean = true;
  msgs: Message[];
  growLife: number = 5000;

  constructor(private httpService: HttpDataService, private messageService: MessageService, private dataManageService: DataManageService, private deleteService: DeleteComfirmService) {

  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.localStorageAuthority = this.dataManageService.buttonAuthority("Maintain Project Type");
    //  || this.projectType == "100"
    if (this.projectType == "110") {
      this.localStorageAuthority = false;
      this.uploadFlag = false;
    }
    if (this.projectType == "120") {
      this.uploadFlag = false;
    }
    if (!!this.projectType) {
      this.httpService.post("/bpd-proj/bpd/projectLevel/getList", {
        "projectType": this.projectType
      })
        .subscribe(data => {
          this.baseData = data;
        })
    }
  }

  /**
   * 添加模态框显示
   * 
   * @memberof RegionTemplate
   */
  addClick() {
    if (this.baseData.length != 0) {
      this.dialogLevel = this.baseData[this.baseData.length - 1].serialNo + 1;
    }
    this.dialogLevelName = "";
    // if (this.projectLevelOption.length !== 0) {
    //   this.selectedProjectLevel = this.projectLevelOption[0].value;
    // }
    this.addDialog = true;
  }

  /**
   * 添加确认
   * 
   * @memberof RegionTemplate
   */
  addSave() {

    this.httpService.post("/bpd-proj/bpd/projectLevel/insert", {
      "levelName": this.dialogLevelName,
      "serialNo": this.dialogLevel,
      "projectType": this.projectType
    })
      .subscribe(data => {
        if ("1" == data.code) { //操作成功
          this.growLife = 5000;
          this.messageService.showSuccess('Operation succeeded!');
        } else if (data.code == "2") {
          this.growLife = 999999;
          this.messageService.showInfo("Serial No Exists!");
        } else if (data.code == "3") {
          this.growLife = 999999;
          this.messageService.showInfo("Level Name Exists!");
        } else if (data.code == "4") {
          this.growLife = 999999;
          this.messageService.showInfo("Projec Level Name Exists!")
        }
        //  else if ("0" == data.code) {
        //   this.growLife = 5000;
        //   this.messageService.showError('Replicate Code!');
        // } 
        else { //操作失败
          this.growLife = 5000;
          this.messageService.showError('Operation failed!');
        }
        this.msgs = this.messageService.msgs;
        this.httpService.post("/bpd-proj/bpd/projectLevel/getList", {
          "projectType": this.projectType
        })
          .subscribe(data => {
            this.baseData = data;
          })
      })
    this.dialogLevelName = "";
    this.addDialog = false;
  }

  /**
   * 添加取消
   * 
   * @memberof RegionTemplate
   */
  addCancle() {
    this.dialogLevelName = "";
    this.addDialog = false;
  }

  /**
   * 编辑框弹出
   * 
   * @memberof ProjectLevel
   */
  editClick(idx, data) {
    this.selectedIndex = idx;
    this.dialogLevelName = data.levelName;
    this.dialogLevel = data.serialNo;
    this.editDialog = true;
  }

  /**
   * 编辑确认
   * 
   * @memberof ProjectLevel
   */
  editSave() {
    this.httpService.post("/bpd-proj/bpd/projectLevel/update", {
      "levelName": this.dialogLevelName,
      "serialNo": this.dialogLevel,
      "projectType": this.projectType,
      "projectLevelId": this.baseData[this.selectedIndex].projectLevelId
    })
      .subscribe(data => {
        if ("1" == data.code) { //操作成功
          this.growLife = 5000;
          this.messageService.showSuccess('Operation succeeded!');
        } else if (data.code == "2") {
          this.growLife = 999999;
          this.messageService.showInfo("Serial No Exists!");
        } else if (data.code == "3") {
          this.growLife = 999999;
          this.messageService.showInfo("Level Name Exists!");
        } else if (data.code == "4") {
          this.growLife = 999999;
          this.messageService.showInfo("Projec Level Name Exists!")
        } else { //操作失败
          this.growLife = 5000;
          this.messageService.showError('Operation failed!');
        }
        this.msgs = this.messageService.msgs;
        this.httpService.post("/bpd-proj/bpd/projectLevel/getList", {
          "projectType": this.projectType
        })
          .subscribe(data => {
            this.baseData = data;
          })
      })
    this.dialogLevelName = "";
    this.editDialog = false;
  }

  /**
   * 编辑取消
   * 
   * @memberof ProjectLevel
   */
  editCancle() {

    this.dialogLevelName = "";
    this.editDialog = false;
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
      let timeStamp = new Date();
      this.httpService.get("/bpd-proj/bpd/projectLevel/delete?" + timeStamp.getTime() + "&projectLevelId=" + this.baseData[this.selectedIndex].projectLevelId)
        .subscribe(data => {
          if ("1" == data.code) { //操作成功
            this.growLife = 5000;
            this.messageService.showSuccess('Operation succeeded!');
          } else if (data.code == "2") {
            this.growLife = 30000;
            this.messageService.showInfo(data.msg);
          } else { //操作失败
            this.growLife = 5000;
            this.messageService.showError('Operation failed!');
          }
          this.msgs = this.messageService.msgs;
          this.httpService.post("/bpd-proj/bpd/projectLevel/getList", {
            "projectType": this.projectType
          })
            .subscribe(data => {
              this.baseData = data;
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
    let timeStamp = new Date();
    this.httpService.get("/bpd-proj/bpd/projectLevel/delete?" + timeStamp.getTime() + "&projectLevelId=" + this.baseData[this.selectedIndex].projectLevelId)
      .subscribe(data => {
        if ("1" == data.code) { //操作成功
          this.growLife = 5000;
          this.messageService.showSuccess('Operation succeeded!');
        } else if (data.code == "2") {
          this.growLife = 30000;
          this.messageService.showInfo(data.msg);
        } else { //操作失败
          this.growLife = 5000;
          this.messageService.showError('Operation failed!');
        }
        this.msgs = this.messageService.msgs;
        this.httpService.post("/bpd-proj/bpd/projectLevel/getList", {
          "projectType": this.projectType
        })
          .subscribe(data => {
            this.baseData = data;
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

  upLoadClick(idx, data) {
    this.Uuid = this.dataManageService.getUuId();
    this.upLoaded = true;
    this.selectedIndex = idx;
  }

  onBasicBeforeUpload($event) {
  }

  //TODO:
  onBasicUpload($event) {
    this.httpService.get('/bpd-proj/bpd/projectLevel/addAtt?' + Number(new Date()) + '&attId=' + this.Uuid + '&type=projectLevel')
      .subscribe(data => {
        if (data.code == 1) {
          this.growLife = 5000;
          this.messageService.showSuccess("Operate Success!");
          this.httpService.post("/bpd-proj/bpd/projectLevel/getList", {
            "projectType": this.projectType
          })
            .subscribe(data => {
              this.baseData = data;
            })
        } else {
          this.growLife = 5000;
          this.messageService.showError("Operate Failed!");
        }
        this.msgs = this.messageService.msgs;
      })
    this.upLoaded = false;
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
}