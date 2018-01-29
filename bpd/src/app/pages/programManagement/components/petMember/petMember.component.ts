import {
    Component,
    OnInit
  } from '@angular/core';
  // import {BugetTemplateService} from './BugetTemplate.service';
  import 'style-loader!./petMember.scss';
  import {
    SelectItem
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
    RefreshMenuService
} from '../../../service/refreshMenu.service';
  // import { BaseDataModule } from '../../baseData.module';
  
  @Component({
    selector: 'pet-member',
    templateUrl: './petMember.html',
    providers: [RefreshMenuService]
  })
  export class PetMember {
    baseData: any[];
    selected: string;

    dialogProjectCode: string;
    changeProjectCode: string;
    changeProjectType: string;

    searchDialog: Boolean = false;
    public localStorageAuthority: Boolean;

    constructor(private httpService: HttpDataService, private messageService: MessageService, private dataManageService: DataManageService, private refreshMenuService: RefreshMenuService) {
        // 刷新菜单默认选中项
        let flag = this.dataManageService.getUuId()
        this.refreshMenuService.refreshMenu(flag);
    }
    ngOnInit() {
        this.httpService.post('/bpd-proj/bpd/program/getVListInitializationPet', {})
            .subscribe(data => {
                this.baseData = data;
            })
        this.localStorageAuthority = this.dataManageService.buttonAuthority("Maintain PET Members");
    }

    onRowClick($event) {
        // console.log($event.data);
        this.changeProjectCode = $event.data.programId;
        this.changeProjectType = $event.data.projectType;
        // console.log(this.changeProjectCode);
    }

    searchClick() {
        this.searchDialog = true;
    }

    searchEnterSearch($event) {
      if ($event.key === "Enter") {
        this.searchSave();
      }
    }

    searchSave() {
        this.httpService.post('/bpd-proj/bpd/program/getVListInitializationPet', {
                "programCode": this.dialogProjectCode
            })
            .subscribe(data => {
                this.baseData = data;
            })
        this.searchDialog = false;
        this.dialogProjectCode = "";
    }

    searchCancle() {
        this.searchDialog = false;
        this.dialogProjectCode = "";
    }
  }
