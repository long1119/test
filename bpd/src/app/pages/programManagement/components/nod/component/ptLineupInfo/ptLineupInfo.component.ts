import {
    Component,
    OnInit,
    OnChanges,
    Input,
    SimpleChanges
} from '@angular/core';

import 'style-loader!./ptLineupInfo.scss';

import {
    DataManageService
} from '../../../../../service/dataManage.service';
import {
    HttpDataService
} from '../../../../../service/http.service';
import {
    MessageService
} from '../../../../../service/message.service';
import {
    DeleteComfirmService
} from '../../../../../service/deleteDialog.service';

import {
    SelectItem,
    Message
} from 'primeng/primeng';

@Component({
    selector: 'pt-lineup-info',
    templateUrl: './ptLineupInfo.html'
})

export class PtLineupInfo {
    public ptLineupData: any[] = [];
    public arTemplateData: any[] = [];
    @Input() changeAdProjectCode: string;
    @Input() ptLineupInfoEditable: Boolean;
    // 页面弹窗
    public modifyDialog: Boolean = false;
    public deleteDialog: Boolean = false;
    public PTDownloadDisplay: Boolean = false;
    public modifyFlag: string = "";
    public dialogEngine: string;
    public dialogTransimission: string;
    public msgs: Message[];
    public growLife: number = 5000;
    private changePtLineupId: string;
    // 分页信息
    public ptLineupInfoPaginatorPage: number;
    public ptLineupInfoPaginatorTotal: number;
    public ptLineupInfoPaginatorRow: number;
    public localStorageAuthority: Boolean;


    constructor(private dataManageService: DataManageService, private httpservice: HttpDataService, private messageService: MessageService, private deleteService: DeleteComfirmService) {
        // 分页信息初始化
        this.ptLineupInfoPaginatorRow = 5;
        this.ptLineupInfoPaginatorPage = 1;
        // 页面表格数据初始化
        this.ptLineupData = this.dataManageService.addEmptyOnInitTableData(5);
    }

    ngOnInit() {

    }

    ngOnChanges(changes: SimpleChanges) {
        // 页面数据初始化
        if (this.changeAdProjectCode) {
            this.ptLineupInfoPaginatorTotal = this.tableDataOnInit(this.ptLineupInfoPaginatorPage, this.ptLineupInfoPaginatorRow, this.changeAdProjectCode);
        }
        this.localStorageAuthority = this.dataManageService.buttonAuthority("Maintian NOD");
    }

    /**
     * 页面表格数据初始化
     * 
     * @param page 分页页数
     * @param row 分页显示行数
     */
    private tableDataOnInit(page: number, row: number, code: string) {
        let total: number;
        this.httpservice.post('/bpd-proj/bpd/ptLineup/getList', {
            "adProjectCode": code,
            "page": {
                "page": page,
                "rows": row
            }
        })
            .subscribe(data => {
                total = data.total;
                this.ptLineupData = this.dataManageService.addEmptyPaginatorTableData(data, 5);
            })
        return total;
    }

    /**
     * 分页信息
     * 
     * @param {any} $event 
     * @memberof Nod
     */
    ptLineupInfoPaginate($event) {
        this.ptLineupInfoPaginatorPage = $event.page + 1;
        this.ptLineupInfoPaginatorRow = $event.row;
        this.ptLineupInfoPaginatorTotal = this.tableDataOnInit($event.page + 1, $event.row, this.changeAdProjectCode);
    }

    /**
     * 添加 pt 信息 弹框显示
     * 
     * @memberof PtLineupInfo
     */
    addClick() {
        this.dialogTransimission = "";
        this.dialogEngine = "";
        this.modifyFlag = "add";
        this.modifyDialog = true;
    }

    /**
     * 修改 pt 信息 弹框显示
     * 
     * @memberof PtLineupInfo
     */
    editClick(idx, data) {
        this.dialogTransimission = data.transmission;
        this.dialogEngine = data.engine;
        this.changePtLineupId = data.ptLineupId;
        this.modifyFlag = "edit";
        this.modifyDialog = true;
    }

    /**
     * 修改 pt 信息 确认
     * 
     * @memberof PtLineupInfo
     */
    addSave() {
        if (this.modifyFlag == "add") {
            this.httpservice.post('/bpd-proj/bpd/ptLineup/insert', {
                "engine": this.dialogEngine,
                "transmission": this.dialogTransimission,
                "adProjectCode": this.changeAdProjectCode
            })
                .subscribe(data => {
                    if (data.code == "1") {
                        this.messageService.showSuccess("Operation Success!");
                        this.growLife = 5000;
                    } else {
                        this.messageService.showError("Operate Failed!");
                        this.growLife = 5000;
                    }
                    this.msgs = this.messageService.msgs;
                    this.ptLineupInfoPaginatorTotal = this.tableDataOnInit(this.ptLineupInfoPaginatorPage, this.ptLineupInfoPaginatorRow, this.changeAdProjectCode);
                })
        } else if (this.modifyFlag == "edit") {
            this.httpservice.post('/bpd-proj/bpd/ptLineup/update', {
                "engine": this.dialogEngine,
                "transmission": this.dialogTransimission,
                "adProjectCode": this.changeAdProjectCode,
                "ptLineupId": this.changePtLineupId
            })
                .subscribe(data => {
                    if (data.code == "1") {
                        this.messageService.showSuccess("Operation Success!");
                        this.growLife = 5000;
                    } else {
                        this.messageService.showError("Operate Failed!");
                        this.growLife = 5000;
                    }
                    this.msgs = this.messageService.msgs;
                    this.ptLineupInfoPaginatorTotal = this.tableDataOnInit(this.ptLineupInfoPaginatorPage, this.ptLineupInfoPaginatorRow, this.changeAdProjectCode);
                })
        }
        this.modifyDialog = false;
    }

    /**
     * 编辑 pt 信息 取消
     * 
     * @memberof PtLineupInfo
     */
    addCancel() {
        this.modifyDialog = false;
    }

    /**
     * 删除弹窗展示
     * 
     * @param {any} idx 
     * @param {any} data 
     * @memberof PtLineupInfo
     */
    deleteClick(idx, data) {
        this.changePtLineupId = data.ptLineupId;
        // this.deleteDialog = true;
        this.deleteService.confirm(() => {
            this.httpservice.get('/bpd-proj/bpd/ptLineup/delete?' + Number(new Date()) + '&ptLineupId=' + this.changePtLineupId)
                .subscribe(data => {
                    if (data.code == "1") {
                        this.messageService.showSuccess("Operation Success!");
                        this.growLife = 5000;
                    } else {
                        this.messageService.showError("Operate Failed!");
                        this.growLife = 5000;
                    }
                    this.msgs = this.messageService.msgs;
                    this.ptLineupInfoPaginatorTotal = this.tableDataOnInit(this.ptLineupInfoPaginatorPage, this.ptLineupInfoPaginatorRow, this.changeAdProjectCode);
                })
        })
    }

    /**
     * 删除确认
     * 
     * @memberof PtLineupInfo
     */
    deleteYes() {
        this.httpservice.get('/bpd-proj/bpd/ptLineup/delete?' + Number(new Date()) + '&ptLineupId=' + this.changePtLineupId)
            .subscribe(data => {
                if (data.code == "1") {
                    this.messageService.showSuccess("Operation Success!");
                    this.growLife = 5000;
                } else {
                    this.messageService.showError("Operate Failed!");
                    this.growLife = 5000;
                }
                this.msgs = this.messageService.msgs;
                this.ptLineupInfoPaginatorTotal = this.tableDataOnInit(this.ptLineupInfoPaginatorPage, this.ptLineupInfoPaginatorRow, this.changeAdProjectCode);
            })
        this.deleteDialog = false;
    }

    /**
     * 删除取消
     * 
     * @memberof PtLineupInfo
     */
    deleteNo() {
        this.deleteDialog = false;
    }

    public PTDownloadBtn() {
        this.PTDownloadDisplay = true;
        this.httpservice.post('/bpd-proj/bpd/att/getVList', {
            bussinessId: "100"
        })
            .subscribe(data => {
                if (data.length != 0) {
                    this.arTemplateData = data;
                } else {
                    this.arTemplateData = [];
                }
            })
    }

    public downloadTemplateDblClick(idx, data) {
        let token = window.sessionStorage.getItem("access_token");
        let url: string = '/bpd-proj/bpd/att/downloadFiles?attIds=' + data.attId + "&_=" + Number(new Date());
        if (token) {
            let realToken = token.substr(1, token.length - 2)
            url = url + "&accessToken=" + realToken;
        }
        window.location.href = url;
        this.PTDownloadDisplay = false;
    }
}