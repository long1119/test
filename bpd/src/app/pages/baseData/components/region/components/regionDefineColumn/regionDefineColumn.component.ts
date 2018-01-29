import {
    Component,
    OnInit,
    OnChanges,
    SimpleChanges,
    Input
} from  "@angular/core";
import {
    Message
} from 'primeng/primeng';

import 'style-loader!./regionDefineColumn.scss';

import {
    DataManageService
} from '../../../../../service/dataManage.service';
import {
    MessageService
} from '../../../../../service/message.service';
import {
    HttpDataService
} from '../../../../../service/http.service';
import { SimpleChange } from "@angular/core/src/change_detection/change_detection_util";

@Component({
    templateUrl: './regionDefineColumn.html',
    selector: 'region-define-column'
})

export class RegionDefineColumn {
    @Input()
    private changeCategoryCode: string;

    public baseData: any[] = [];
    public localStorageAuthority: Boolean; 
    
    private selectedIndex: number;
    public editDialog: Boolean;
    public reserseName: string;
    public costomName: string;
    public growMessage: Message[];
    public growLife: number = 5000;

    constructor(private httpService: HttpDataService, private messageService: MessageService, private dataManageService: DataManageService) {

    }

    ngOnChanges(changes: SimpleChange) {
        this.httpService.post("/bpd-proj/bpd/budgetTemplate/getVlist", {
            "regionCategoryCode": this.changeCategoryCode
        })
            .subscribe(data => {
                if (data.length != 0) {
                    this.baseData = data;
                }
            })
        this.localStorageAuthority = this.dataManageService.buttonAuthority("Maintain Region");
    }

    /**
     * 编辑模态框弹出
     * 
     * @memberof BugetTemplate
     */

    editClick(idx, data) {
        this.selectedIndex = idx;
        this.editDialog = true;
        this.costomName = data.defineFieldName;
        this.reserseName = data.reservedFieldName;
    }

    /**
     * 编辑确认
     * 
     * @memberof BugetTemplate
     */
    editSave() {
        this.httpService.post("/bpd-proj/bpd/budgetTemplate/update", {
                "regionCategoryCode": this.changeCategoryCode,
                "reservedFieldName": this.reserseName,
                "defineFieldName": this.costomName,
                "budgetTemplateId": this.baseData[this.selectedIndex].budgetTemplateId
            })
            .subscribe(data => {
                if (data.code == 1) {
                    this.messageService.showSuccess("Operation Success!");
                    this.growLife = 5000;
                } else {
                    this.messageService.showError("Operation failed!");
                    this.growLife = 5000;
                }
                this.growMessage = this.messageService.msgs;
                this.httpService.post("/bpd-proj/bpd/budgetTemplate/getVlist", {
                        "regionCategoryCode": this.changeCategoryCode
                    })
                    .subscribe(data => {
                        this.baseData = this.dataManageService.addEmptyTableData(data, 10);
                    })
            })
        this.editDialog = false;
        this.costomName = "";
        this.reserseName = "";
    }

    /**
     * 编辑取消
     * 
     * @memberof BugetTemplate
     */
    editCancle() {
        this.editDialog = false;
        this.costomName = "";
        this.reserseName = "";
    }
}