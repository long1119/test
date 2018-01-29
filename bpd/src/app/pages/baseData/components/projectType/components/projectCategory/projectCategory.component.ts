import {
  Component,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
// import {BugetTemplateService} from './BugetTemplate.service';
import 'style-loader!./projectCategory.scss';
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
  selector: 'project-category',
  templateUrl: './projectCategory.html',
})
export class ProjectCategory {
  addDialog: Boolean = false;
  editDialog: Boolean = false;
  deleteDialog: Boolean = false;
  selectedProjectLevel: string;
  projectLevelOption: SelectItem;

  dialogLevel: any;
  dialogCategoryName: any;
  @Input() projectType: any;
  @Input() projectTypeName: any;
  msgs: Message[];
  growLife: number = 5000;


  baseData: any[];

  propertyGroup: SelectItem[];

  selectedIndex: number;
  selectedData: any = {};
  public localStorageAuthority: Boolean;


  constructor(private httpService: HttpDataService, private messageService: MessageService, private dataManageService: DataManageService, private deleteService: DeleteComfirmService) {

  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.localStorageAuthority = this.dataManageService.buttonAuthority("Maintain Project Type");
    if (this.projectType == "100" || this.projectType == "110") {
      this.localStorageAuthority = false;
    }
    if (!!this.projectType) {
      this.httpService.post("/bpd-proj/bpd/projectCategory/getList", {
        "projectType": this.projectType
      })
        .subscribe(data => {
          this.baseData = data;
        });
    }
  }

  addClick() {
    this.dialogCategoryName = "";
    this.dialogLevel = "";
    this.httpService.post("/bpd-proj/bpd/projectLevel/getProjectLevelCombobox", {})
      .subscribe(data => {
        this.addDialog = true;
        // console.log(data);
        this.projectLevelOption = data;
        this.selectedProjectLevel = data[0].value;
      })
    // console.log(this.projectLevelOption);
  }


  deleteClick(idx, data) {
    // this.deleteDialog = true;
    this.selectedIndex = idx;
    this.deleteService.confirm(() => {
      let timeStamp = new Date();
      this.httpService.get("/bpd-proj/bpd/projectCategory/delete?" + timeStamp.getTime() + "&categoryId=" + this.baseData[this.selectedIndex].categoryId)
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
          this.httpService.post("/bpd-proj/bpd/projectCategory/getList", {
            "projectType": this.projectType
          })
            .subscribe(data => {
              this.baseData = data;
            });
        });
    })
  }

  addCancle() {
    this.addDialog = false;

    this.dialogCategoryName = "";
    this.dialogLevel = "";
  }

  addSave() {
    this.addDialog = false;
    let groupId: String;

    this.httpService.post("/bpd-proj/bpd/projectCategory/insert", {
      "categoryName": this.dialogCategoryName,
      "serialNo": this.dialogLevel,
      "projectType": this.projectType
    })
      .subscribe(data => {
        if ("1" == data.code) { //操作成功
          this.growLife = 5000;
          this.messageService.showSuccess('Operation succeeded!');
        } else { //操作失败
          this.growLife = 5000;
          this.messageService.showError('Operation failed!');
        }
        this.msgs = this.messageService.msgs;
        this.httpService.post("/bpd-proj/bpd/projectCategory/getList", {
          "projectType": this.projectType
        })
          .subscribe(data => {
            this.baseData = data;
          });
      });
    this.dialogCategoryName = "";
    this.dialogLevel = "";
  }


  deleteYes() {
    this.deleteDialog = false;
    // console.log(this.baseData[this.selectedIndex]);
    let timeStamp = new Date();
    this.httpService.get("/bpd-proj/bpd/projectCategory/delete?" + timeStamp.getTime() + "&categoryId=" + this.baseData[this.selectedIndex].categoryId)
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
        this.httpService.post("/bpd-proj/bpd/projectCategory/getList", {
          "projectType": this.projectType
        })
          .subscribe(data => {
            this.baseData = data;
          });
      });
  }

  deleteNo() {
    this.deleteDialog = false;
  }
}