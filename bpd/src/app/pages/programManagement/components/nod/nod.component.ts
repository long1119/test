import {
    Component,
    OnInit
} from '@angular/core';

import {
    SelectItem,
    Message,
} from 'primeng/primeng';

import 'style-loader!./nod.scss';

import {
    DataManageService
} from '../../../service/dataManage.service';
import {
    HttpDataService
} from '../../../service/http.service';
import {
    MessageService
} from '../../../service/message.service';
import {
    RefreshMenuService
} from '../../../service/refreshMenu.service';
// import { window } from 'rxjs/operator/window';

@Component({
    selector: 'nod',
    templateUrl: './nod.html',
    providers: [RefreshMenuService]
})

export class Nod {

    public nodData: any[];
    public changeAdProjectCode: string;
    public changeManagerCode: string;

    // 页面双向绑定数据
    public dialogProgramCode: string;
    public dialogProjectCode: string;
    public dialogModelYear: string;

    // 分页信息
    public nodPaginatorTotal: number;
    public nodPaginatorPage: number;
    public nodPaginatorRow: number;

    private projManager: string;
    private managerFlag: Boolean;

    private approvingData: any[] = [];
    private approvedData: any[] = [];


    constructor(private httpService: HttpDataService, private messageService: MessageService, private dataManageService: DataManageService, private refreshMenuService: RefreshMenuService) {
        // 刷新菜单默认选中项
        let flag = this.dataManageService.getUuId()
        this.refreshMenuService.refreshMenu(flag);
        // 分页信息初始化
        this.nodPaginatorPage = 1;
        this.nodPaginatorRow = 10;
        this.nodPaginatorTotal = 100;
        // 表格数据初始化
        this.nodData = this.dataManageService.addEmptyOnInitTableData(10);
    }

    ngOnInit() {
        // 表格数据获取
        this.tableDataOnInit(this.nodPaginatorPage, this.nodPaginatorRow, this.dialogModelYear, this.dialogProgramCode, this.dialogProjectCode);
        this.projManager = window.localStorage.getItem("user");
    }

    /**
     * 页面表格数据初始化
     * 
     * @param page 分页页数
     * @param row 分页显示行数
     */
    private tableDataOnInit(page: number, row: number, modelYear: string, programCode: string, projectCode: string) {
        let total: number;
        this.httpService.post('/bpd-proj/bpd/vehicleProject/getVList', {
            "modelYear": modelYear,
            "programCode": programCode,
            "projectCode": projectCode,
            "nodeFlag": "1",
            "page": {
                "page": page,
                "rows": row
            }
        })
            .subscribe(data => {
                if (typeof (data) != "string" && data.length != 0) {
                    this.nodPaginatorTotal = data.total;
                    if (data.rows.projectStauts == "1") {
                        data.rows.projectStauts = "Freezed";
                    } else if (data.rows.projectStauts == "2") {
                        data.rows.projectStauts = "Unfreezed"
                    }
                    this.nodData = this.dataManageService.addEmptyPaginatorTableData(data, 10);
                }
            })
    }

    private getApproveLog(nodId: string = "") {
        let ids = nodId + " " + this.changeAdProjectCode;
        this.httpService.get('/bpd-proj/bpd/node/getAllApprove?businessId=' + ids + "&wfType=nod")
            .subscribe(data => {
                for (let i = 0; i < data.length; i++) {
                    if (data[i].isAgree == 1) {
                        data[i].isAgree = "Agree";
                    } else if (data[i].isAgree == 2) {
                        data[i].isAgree = "Return";
                    }
                }
                for (let i = 0; i < data.length; i++) {
                    if (!data[i].userName) {
                        data[i].userName = "-";
                        data[i].taskName = "-";
                        data[i].version = "-";
                        data[i].isAgree = "-";
                        data[i].comments = "-";
                    }
                    if (data[i].isAgree == 1) {
                        data[i].isAgree = "Agree";
                    } else if (data[i].isAgree == 2) {
                        data[i].isAgree = "Return";
                    }
                    if (!data[i].deleteReason && data[i].endTime) {
                        data[i].deleteReason = "Complate";
                    }
                }
                this.approvingData = this.dataManageService.addEmptyTableData(data, 10);
            })
    }

    /**
     * 分页信息
     * 
     * @param {any} $eventwork 
     * @memberof Nod
     */
    nodPaginate($event) {
        this.nodPaginatorPage = $event.page + 1;
        this.nodPaginatorRow = $event.rows;
        this.tableDataOnInit(this.nodPaginatorPage, this.nodPaginatorRow, this.dialogModelYear, this.dialogProgramCode, this.dialogProjectCode);
    }

    /**
     * nod表格列点击事件
     * 
     * @param {any} $event 
     * @memberof Nod
     */
    onNodRowClick($event) {
        this.changeAdProjectCode = $event.data.adProjectCode;
        this.changeManagerCode = $event.data.projManager;
        if ($event.data.projManager === this.projManager) {
            this.managerFlag = true;
        } else {
            this.managerFlag = false;
        }
    }

    nodTabViewChange($event) {
        console.log($event);
    }

    lookUpEnterSearch($event) {
        if ($event.key === "Enter") {
            this.lookUpClick();
        }
    }

    /**
     * 模糊查询
     * 
     * @memberof Nod
     */
    lookUpClick() {
        this.nodPaginate({ page: 0, rows: 10, first: 0 })
    }

    managerRec($event) {
    }

    nodIdRec($event) {
        console.log($event);
        this.getApproveLog($event);
    }
}