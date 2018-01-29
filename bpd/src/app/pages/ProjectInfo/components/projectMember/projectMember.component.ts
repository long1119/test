import {
    Component,
    OnInit
} from '@angular/core';
import {
    CommonModule
} from '@angular/common';
import {
    FormsModule
} from '@angular/forms';
import 'style-loader!./projectMember.scss';
import {
    SelectItem,
    Message
} from 'primeng/primeng';
import {
    HttpDataService
} from '../../../service/http.service';
import {
    MessageService
} from '../../../service/message.service';
import {
    RefreshMenuService
} from '../../../service/refreshMenu.service';
import { DataManageService } from '../../../service/dataManage.service';


@Component({
    selector: 'project-member',
    templateUrl: './projectMember.html',
    providers: [RefreshMenuService]
})
export class ProjectMember {
    baseData: any[];
    selected: string;

    dialogProjectCode: string;
    changeProjectCode: string;
    changeProjectType: string;

    searchDialog: Boolean = false;

    constructor(private httpService: HttpDataService, private messageService: MessageService, private dataManageService: DataManageService, private refreshMenuService: RefreshMenuService) {
        // 刷新菜单默认选中项
        let flag = this.dataManageService.getUuId()
        this.refreshMenuService.refreshMenu(flag);
    }
    ngOnInit() {
        this.httpService.post('/bpd-proj/bpd/allProjInfo/getVList1', {})
            .subscribe(data => {
                this.baseData = data;
            })
    }

    onRowClick($event) {
        console.log($event);
        this.changeProjectType = $event.data.projectType;
        this.changeProjectCode = $event.data.programId;
    }

    searchClick() {
        this.dialogProjectCode = "";
        this.searchDialog = true;
    }

    searchSave() {
        this.httpService.post('/bpd-proj/bpd/allProjInfo/getVList1', {
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
