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
import 'style-loader!./incomeRate.scss';
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

// import { BaseDataModule } from '../../baseData.module';

@Component({
    selector: 'income-rate',
    templateUrl: './incomeRate.html',
})
export class IncomeRate {

    // 页面表格数据
    public incomeRateData: any[] = [];

    // 页面弹窗显示
    public modifyDialog: Boolean = false;
    public deleteDialog: Boolean = false;
    private modifyFlag: string = "";
    private selectedIndex: number = null;

    // 页面绑定数据
    public msgs: Message[];
    public growLife: number = 5000;
    public dialogYear: string = "";
    public dialogIncomeRate: string = "";
    public dialogDescription: string = "";

    // 分页信息
    public incomePaginatorTotal: number = null;
    public incomePaginatorRow: number = null;
    public incomePaginatorPage: number = null;
    public localStorageAuthority: Boolean;

    constructor(private httpService: HttpDataService, private messageService: MessageService, private dataManageService: DataManageService, private deleteService: DeleteComfirmService) {
        this.incomePaginatorPage = 1;
        this.incomePaginatorRow = 10;
    }

    ngOnInit() {
        this.httpService.post('/bpd-proj/bpd/incomeRate/getIncomeTaxList', {
            // "page": {
            //     page: this.incomePaginatorPage,
            //     rows: this.incomePaginatorRow
            // }
        })
            .subscribe(data => {
                this.incomeRateData = this.dataManageService.addEmptyTableData(data, this.incomePaginatorRow);
            })
        this.localStorageAuthority = this.dataManageService.buttonAuthority("Maintain Tax Rate");
    }

    /**
     * 表格初始化
     * 
     * @memberof IncomeRate
     */
    tableOnInit() {

    }

    /**
     * 表格分页
     * 
     * @param {any} $event 
     * @memberof IncomeRate
     */
    incomePaginate($event) {
        this.incomePaginatorPage = $event.page + 1;
        this.incomePaginatorRow = $event.rows;
        this.httpService.post('/bpd-proj/bpd/incomeRate/getIncomeTaxList', {
            // "page": {
            //     page: $event.page + 1,
            //     rows: $event.rows
            // }
        })
            .subscribe(data => {
                this.incomeRateData = this.dataManageService.addEmptyTableData(data, this.incomePaginatorRow);
            })
    }

    /**
     * 添加弹框显示
     * 
     * @memberof IncomeRate
     */
    addIncomeClick() {
        this.dialogDescription = "";
        this.dialogYear = String((new Date()).getFullYear());
        this.dialogIncomeRate = "";
        this.modifyFlag = "add";
        this.modifyDialog = true;
    }

    alreadyExistThisYear() {
        if (this.incomeRateData) {
            for (let i = 0; i < this.incomeRateData.length; i++) {
                if (this.incomeRateData[i].year == (new Date()).getFullYear()) {
                    return true;
                }
            }
            return false;
        }
        return true;
    }

    /**
     * 修改弹框显示
     * 
     * @memberof IncomeRate
     */
    editIncomeClick(idx, data) {
        this.dialogDescription = data.description;
        this.dialogYear = data.year;
        this.dialogIncomeRate = data.incomeRateValue;
        this.selectedIndex = idx;
        this.modifyFlag = "edit";
        this.modifyDialog = true;
    }

    /**
     * 更改信息确认
     * 
     * @memberof IncomeRate
     */
    modifyIncomeSave() {
        if (this.modifyFlag == "add") {
            this.httpService.post('/bpd-proj/bpd/incomeRate/insertIncomeTaxRate', {
                "year": this.dialogYear,
                "incomeRateValue": this.dialogIncomeRate,
                "description": this.dialogDescription
            })
                .subscribe(data => {
                    if (data.code == "1") {
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
                    this.httpService.post('/bpd-proj/bpd/incomeRate/getIncomeTaxList', {
                        // "page": {
                        //     page: this.incomePaginatorPage,
                        //     rows: this.incomePaginatorRow
                        // }
                    })
                        .subscribe(data => {
                            this.incomeRateData = this.dataManageService.addEmptyTableData(data, this.incomePaginatorRow);
                        })
                })
        } else if (this.modifyFlag == "edit") {
            this.httpService.post('/bpd-proj/bpd/incomeRate/updateIncomeTaxRate', {
                "year": this.dialogYear,
                "incomeRateValue": this.dialogIncomeRate,
                "description": this.dialogDescription,
                "incomeRateCode": this.incomeRateData[this.selectedIndex].incomeRateCode
            })
                .subscribe(data => {
                    if (data.code == "1") {
                        this.messageService.showSuccess("Operate Success!");
                        this.growLife = 5000;
                    } else {
                        this.messageService.showError("Operate Failed!");
                        this.growLife = 5000;
                    }
                    this.msgs = this.messageService.msgs;
                    this.httpService.post('/bpd-proj/bpd/incomeRate/getIncomeTaxList', {
                        // "page": {
                        //     page: this.incomePaginatorPage,
                        //     rows: this.incomePaginatorRow
                        // }
                    })
                        .subscribe(data => {
                            this.incomeRateData = this.dataManageService.addEmptyTableData(data, this.incomePaginatorRow);
                        })
                })
        }

        this.modifyDialog = false;
    }

    /**
     * 更改信息取消
     * 
     * @memberof IncomeRate
     */
    modifyIncomeCancel() {
        this.modifyDialog = false;
    }

    /**
     * 删除弹框显示
     * 
     * @param {any} idx 
     * @param {any} data 
     * @memberof IncomeRate
     */
    deleteIncomeClick(idx, data) {
        this.selectedIndex = idx;
        // this.deleteDialog = true;
        this.deleteService.confirm(() => {
            this.httpService.get('/bpd-proj/bpd/incomeRate/deletIncomeTaxRate?' + Number(new Date()) + "&incomeRateCode=" + this.incomeRateData[this.selectedIndex].incomeRateCode)
                .subscribe(data => {
                    if (data.code == "1") {
                        this.messageService.showSuccess("Operate Success!");
                        this.growLife = 5000;
                    } else {
                        this.messageService.showError("Operate Failed!");
                        this.growLife = 5000;
                    }
                    this.msgs = this.messageService.msgs;
                    this.httpService.post('/bpd-proj/bpd/incomeRate/getIncomeTaxList', {
                        // "page": {
                        //     page: this.incomePaginatorPage,
                        //     rows: this.incomePaginatorRow
                        // }
                    })
                        .subscribe(data => {
                            this.incomeRateData = this.dataManageService.addEmptyTableData(data, this.incomePaginatorRow);
                        })
                })
        })
    }

    /**
     * 删除确认
     * 
     * @memberof IncomeRate
     */
    deleteIncomeYes() {
        this.httpService.get('/bpd-proj/bpd/incomeRate/deletIncomeTaxRate?' + Number(new Date()) + "&incomeRateCode=" + this.incomeRateData[this.selectedIndex].incomeRateCode)
            .subscribe(data => {
                if (data.code == "1") {
                    this.messageService.showSuccess("Operate Success!");
                    this.growLife = 5000;
                } else {
                    this.messageService.showError("Operate Failed!");
                    this.growLife = 5000;
                }
                this.msgs = this.messageService.msgs;
                this.httpService.post('/bpd-proj/bpd/incomeRate/getIncomeTaxList', {
                    // "page": {
                    //     page: this.incomePaginatorPage,
                    //     rows: this.incomePaginatorRow
                    // }
                })
                    .subscribe(data => {
                        this.incomeRateData = this.dataManageService.addEmptyTableData(data, this.incomePaginatorRow);
                    })
            })
        this.deleteDialog = false;
    }

    /**
     * 删除取消
     * 
     * @memberof IncomeRate
     */
    deleteIncomeNo() {
        this.deleteDialog = false;
    }
}