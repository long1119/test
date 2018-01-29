import {
    Component,
    OnInit
} from '@angular/core';
import 'style-loader!./previousEsitmation.scss';
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
    DataManageService
} from '../../../service/dataManage.service';
import {
    DeleteComfirmService
} from '../../../service/deleteDialog.service';

@Component({
    selector: 'previous-esitmation',
    templateUrl: './previousEsitmation.html'
})

export class PreviousEsimation {
    baseData: any[];
    selected: string;

    dialogProjectCode: string;
    dialogProjectName: string;
    changeProjectCode: string;

    searchDialog: Boolean = false;
    public localStorageAuthority: Boolean;



    constructor(private httpService: HttpDataService, private messageService: MessageService, private dataManageService: DataManageService, private deleteService: DeleteComfirmService) {

    }

    ngOnInit() {
        this.httpService.post('/bpd-proj/bpd/allProjInfo/getVList', {
            "estimationFlag": "1"
        })
            .subscribe(data => {
                this.baseData = data;
            })
        this.localStorageAuthority = this.dataManageService.buttonAuthority("Maintain Advance Estimation");
    }

    onRowClick($event) {
        this.changeProjectCode = $event.data.projectCode;

    }

    searchClick() {
        this.searchDialog = true;
    }

    projecatCodeEnterSearch($event) {
        if ($event.key === "Enter") {
           this.searchSave();
        }
    }

    searchSave() {
        this.httpService.post('/bpd-proj/bpd/allProjInfo/getVList', {
                "projectCode": this.dialogProjectCode,
                "projectName": this.dialogProjectName,
                "estimationFlag": "1"
            })
            .subscribe(data => {
                this.baseData = data;
            })
        this.searchDialog = false;
        this.dialogProjectCode = "";
        this.dialogProjectName = "";
    }

    searchCancle() {
        this.searchDialog = false;
        this.dialogProjectCode = "";
        this.dialogProjectName = "";
    }

}
