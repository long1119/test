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
import 'style-loader!./rentalRecord.scss';
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

// import { BaseDataModule } from '../../baseData.module';

@Component({
    selector: 'rental-record',
    templateUrl: './rentalRecord.html',
})
export class RentalRecord {

    // 页面数据
    public rentalRecordData: any[] = [];
    public rentalRecordCopyData: any[] = [];
    public selectedRentalRecordData: any[] = [];
    public yearRentalData: any[] = [];

    // 页面弹窗展示
    public modifyDialog: Boolean = false;
    public deleteDialog: Boolean = false;
    public copyRentalDialog: Boolean = false;
    public modifyYearRentalDialog: Boolean = false;
    private modifyFlag: string = "";
    private modifyYearRentalFlag: string = "";

    // 页面双向绑定数据
    public msgs: Message[];
    public growLife: number = 5000;
    public dialogProjectName: string = "";
    public dialogContractNo: string = "";
    public selectCommencementDate: Date;
    public dialogRentalAdress: string = "";
    public dialogContractPeriod: string = "";
    public dialogContractCycleStart: Date = new Date();
    public dialogContractCycleEnd: Date = new Date();
    public selectSearchDate: Date = new Date();
    public yearSearchOption: SelectItem[] = [];
    public selectedYearSearch: string;
    public propertyTypeOption: SelectItem[] = [];
    public selectedPropertyType: string = "";
    public dialogSupplier: string = "";
    public dialogIntention: string = "";
    public dialogLeaseStrategy: string = "";
    public dialogContractCode: string = "";
    public dialogTotalRental: number = null;
    public dialogRentalYear: number = null;
    public dialogRentalAcreage: number = null;
    public dialogRentalPrice: number = null;
    public dialogBlockAdress: string = "";
    private selectedRentalIndex: number = null;
    private selectedIndex: number = null;

    // 分页信息
    public rentalPaginatorTotal: number = null;
    public rentalPaginatorRow: number = null;
    public rentalPaginatorPage: number = null;

    public authorityData: Boolean;
    public yearRange: string;

    constructor(private httpService: HttpDataService, private messageService: MessageService, private dataManageService: DataManageService, private deleteService: DeleteComfirmService) {
        this.rentalPaginatorPage = 1;
        this.rentalPaginatorRow = 10;

        this.propertyTypeOption.push({
            label: 'Residential Property',
            value: 'Residential Property'
        });
        this.propertyTypeOption.push({
            label: 'Commercial Property',
            value: 'Commercial Property'
        });
        this.propertyTypeOption.push({
            label: 'Industrial Property',
            value: 'Industrial Property'
        });
        this.propertyTypeOption.push({
            label: 'Other',
            value: 'Other'
        });
        // 日期年份设置
        let currentYear = new Date().getFullYear();
        this.yearRange = "" + (Number(currentYear) - 10) + ":" + (Number(currentYear) + 50);
        for (let i = 0; i < 15; i++) {
            this.yearSearchOption.push({
                label: (currentYear - 5 + i) + '年',
                value: currentYear - 5 + i
            })
        }
        this.yearSearchOption.unshift({
            label: 'Select',
            value: null
        })
    }

    ngOnInit() {
        this.tableOnInit();
        this.authorityData = this.dataManageService.buttonAuthority("View  Rent Property Ledger");
    }

    dateSelectCalendar() {
        this.selectedYearSearch = this.yearSearchOption[0].value;
    }

    dataSelectDropdown() {
        this.selectSearchDate = null;
    }

    /**
     * 分页
     * 
     * @param {any} $event 
     * @memberof RentalRecord
     */
    public rentalPaginate($event) {
        this.rentalPaginatorRow = $event.rows;
        this.rentalPaginatorPage = $event.page + 1;
        this.httpService.post('/bpd-proj/bpd/leaseRecord/getList', {
            // page: {
            //     page: $event.page + 1,
            //     rows: $event.rows
            // }
            blockAddress: this.dialogBlockAdress
        })
            .subscribe(data => {
                // this.rentalPaginatorTotal = data.total;
                this.rentalRecordData = this.dataManageService.addEmptyTableData(data, this.rentalPaginatorRow);
            })
    }

    /**
     * 表格数据请求
     * 
     * @private
     * @memberof LandPurchaseRecord
     */
    private tableOnInit(flag = false) {
        let data = {
            createTime: null,
        };
        let date: string = "";
        if (this.selectSearchDate) {
            date = this.dataManageService.getStrDate(this.selectSearchDate);
        } else {
            date = this.selectedYearSearch;
        }
        if (flag) {
            data = {
                createTime: date
            }
        }
        this.httpService.post('/bpd-proj/bpd/leaseRecord/getList', data)
            .subscribe(data => {
                // this.rentalPaginatorTotal = data.total;
                //this.rentalRecordCopyData = 
                this.rentalRecordData = this.dataManageService.addEmptyTableData(data, this.rentalPaginatorRow);
            })
    }

    public dataSearchClick() {
        this.tableOnInit(true);
    }

    /**
     * 添加弹窗显示
     * 
     * @memberof LandPurchaseRecord
     */
    public addRentalRecordClick() {
        this.dialogProjectName = "";
        this.dialogContractNo = "";
        this.selectCommencementDate = new Date();
        this.dialogRentalAdress = "";
        this.dialogContractPeriod = "";
        this.dialogContractCode = "";
        this.selectedPropertyType = this.propertyTypeOption[0].value;
        // this.dialogIntention = "";
        // this.dialogLeaseStrategy = "";
        this.dialogContractCycleStart = new Date();
        this.dialogContractCycleEnd = new Date();
        this.dialogSupplier = "";
        this.yearRentalData = [];
        this.dialogTotalRental = null;

        this.modifyFlag = "add";
        this.modifyDialog = true;
    }

    /**
     * 编辑弹窗显示
     * 
     * @memberof LandPurchaseRecord
     */
    public editRentalRecordClick(idx, data) {
        this.dialogProjectName = data.blockAddress;
        this.dialogContractNo = data.contractCode;
        // 日期处理为日期格式
        let date = data.commencementDate.split('-');
        this.selectCommencementDate = new Date(date[0].toString(), date[1].toString(), date[2].toString());
        this.dialogRentalAdress = data.rentalAddress;
        this.dialogContractPeriod = data.contractPeriod;
        this.dialogContractCode = data.contractCode;
        // this.dialogContractCycle = data.contractCycle;
        let contractCycle: any[] = data.contractCycle.split("-");
        if (data.contractCycle) {
            this.dialogContractCycleStart = this.dataManageService.getDateDate(contractCycle[0], '.');
            this.dialogContractCycleEnd = this.dataManageService.getDateDate(contractCycle[1], '.');
        }
        this.selectedPropertyType = data.propertyType;
        // this.dialogIntention = "";
        // this.dialogLeaseStrategy = "";
        this.dialogSupplier = data.supplier;
        this.dialogTotalRental = data.totalRental;
        this.yearRentalData = data.list
        this.selectedIndex = idx;

        if (data.list.length != 0) {
            this.dialogTotalRental = 0;
            for (let i = 0; i < data.list.length; i++) {
                this.dialogTotalRental += data.list[i].rental;
            }
        } else {
            this.dialogTotalRental = 0;
        }
        this.modifyFlag = "edit";
        this.modifyDialog = true;
    }

    /**
     * 数据添加修改确认
     * 
     * @memberof LandPurchaseRecord
     */
    public modifyRentalRecordSave() {
        // 处理日期格式为字符串
        let date = "" + this.selectCommencementDate.getFullYear() + "-" + Number(this.selectCommencementDate.getMonth() + 1) + "-" + this.selectCommencementDate.getDate();
        let contractCycle: string;
        contractCycle = this.dataManageService.getStrDate(this.dialogContractCycleStart, ".", "month") + "-" + this.dataManageService.getStrDate(this.dialogContractCycleEnd, ".", "month");
        if (this.modifyFlag == "add") {
            this.httpService.post('/bpd-proj/bpd/leaseRecord/insert', {
                "blockAddress": this.dialogProjectName,
                "contractPeriod": this.dialogContractPeriod,
                "contractCode": this.dialogContractNo,
                "commencementDate": date,
                "rentalAddress": this.dialogRentalAdress,
                "contractCycle": contractCycle,
                "supplier": this.dialogSupplier,
                "propertyType": this.selectedPropertyType,
                "totalRental": this.dialogTotalRental,
                "list": this.yearRentalData
            })
                .subscribe(data => {
                    if (data.code == "1") {
                        this.messageService.showSuccess("Operate Success!");
                        this.growLife = 5000;
                        this.tableOnInit();
                    } else {
                        this.messageService.showError("Operate Failed!");
                        this.growLife = 5000;
                    }
                    this.msgs = this.messageService.msgs;
                })
        } else if (this.modifyFlag == "edit") {
            this.httpService.post('/bpd-proj/bpd/leaseRecord/update', {
                "blockAddress": this.dialogProjectName,
                "contractPeriod": this.dialogContractPeriod,
                "contractCode": this.dialogContractNo,
                "commencementDate": date,
                "rentalAdress": this.dialogRentalAdress,
                "contractCycle": contractCycle,
                "supplier": this.dialogSupplier,
                "propertyType": this.selectedPropertyType,
                "totalRental": this.dialogTotalRental,
                "list": this.yearRentalData,
                "leaseRecordId": this.rentalRecordData[this.selectedIndex].leaseRecordId
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
                    this.httpService.post('/bpd-proj/bpd/leaseRecord/getList', {
                        // page: {
                        //     page: this.rentalPaginatorPage,
                        //     rows: this.rentalPaginatorRow
                        // }
                    })
                        .subscribe(data => {
                            // this.rentalPaginatorTotal = data.total;
                            this.rentalRecordData = this.dataManageService.addEmptyTableData(data, this.rentalPaginatorRow);
                        })
                })
        }
        this.modifyDialog = false;
    }


    /**
     * 数据添加取消
     * 
     * @memberof LandPurchaseRecord
     */
    public modifyRentalRecordCancel() {
        this.modifyDialog = false;
    }

    /**
     * 删除弹窗展示
     * 
     * @memberof LandPurchaseRecord
     */
    public deleteRentalRecordClick(idx, data) {
        this.selectedIndex = idx;
        // this.deleteDialog = true;
        this.deleteService.confirm(() => {
            this.httpService.get('/bpd-proj/bpd/leaseRecord/delete?' + Number(new Date()) + '&leaseRecordId=' + this.rentalRecordData[this.selectedIndex].leaseRecordId)
                .subscribe(data => {
                    if (data.code == "1") {
                        this.messageService.showSuccess("Operate Success!");
                        this.growLife = 5000;
                    } else {
                        this.messageService.showError("Operate Failed!");
                        this.growLife = 5000;
                    }
                    this.msgs = this.messageService.msgs;
                    this.httpService.post('/bpd-proj/bpd/leaseRecord/getList', {
                        // page: {
                        //     page: this.rentalPaginatorPage,
                        //     rows: this.rentalPaginatorRow
                        // }
                    })
                        .subscribe(data => {
                            // this.rentalPaginatorTotal = data.total;
                            this.rentalRecordData = this.dataManageService.addEmptyTableData(data, this.rentalPaginatorRow);
                        })
                })
        })
    }

    /**
     * 删除确认
     * 
     * @memberof LandPurchaseRecord
     */
    public deleteRentalRecordYes() {
        this.httpService.get('/bpd-proj/bpd/leaseRecord/delete?' + Number(new Date()) + '&leaseRecordId=' + this.rentalRecordData[this.selectedIndex].leaseRecordId)
            .subscribe(data => {
                if (data.code == "1") {
                    this.messageService.showSuccess("Operate Success!");
                    this.growLife = 5000;
                } else {
                    this.messageService.showError("Operate Failed!");
                    this.growLife = 5000;
                }
                this.msgs = this.messageService.msgs;
                this.httpService.post('/bpd-proj/bpd/leaseRecord/getList', {
                    // page: {
                    //     page: this.rentalPaginatorPage,
                    //     rows: this.rentalPaginatorRow
                    // }
                })
                    .subscribe(data => {
                        // this.rentalPaginatorTotal = data.total;
                        this.rentalRecordData = this.dataManageService.addEmptyTableData(data, this.rentalPaginatorRow);
                    })
            })
        this.deleteDialog = false;
    }

    /**
     * 删除取消
     * 
     * @memberof LandPurchaseRecord
     */
    public deleteRentalRecordNo() {
        this.deleteDialog = false;
    }

    /**
     * 添加表格数据
     * 
     * @memberof RentalRecord
     */
    public addYearRentalClick() {
        this.dialogRentalYear = null;
        this.dialogRentalAcreage = null;
        this.dialogRentalPrice = null;
        this.modifyYearRentalFlag = "add";
        this.modifyYearRentalDialog = true;
    }

    /**
     * 修改表格数据
     * 
     * @memberof RentalRecord
     */
    public editYearRentalClick(idx, data) {
        this.dialogRentalPrice = data.price;
        this.dialogRentalAcreage = data.acreage;
        this.dialogRentalYear = data.year;
        this.modifyYearRentalFlag = "edit";
        this.selectedRentalIndex = idx;
        this.modifyYearRentalDialog = true;
    }

    /**
     * 更改表格数据确认
     * 
     * @memberof RentalRecord
     */
    public modifyYearRentalSave() {
        let yearRental: any = {};
        yearRental.price = this.dialogRentalPrice;
        yearRental.acreage = this.dialogRentalAcreage;
        yearRental.year = this.dialogRentalYear;
        yearRental.rental = Math.round(this.dialogRentalPrice * this.dialogRentalAcreage * 36500) / 100;
        if (this.modifyYearRentalFlag == "add") {
            this.yearRentalData.push(yearRental);
        } else if (this.modifyYearRentalFlag == "edit") {
            this.yearRentalData[this.selectedRentalIndex].year = this.dialogRentalYear;
            this.yearRentalData[this.selectedRentalIndex].acreage = this.dialogRentalAcreage;
            this.yearRentalData[this.selectedRentalIndex].price = this.dialogRentalPrice;
            this.yearRentalData[this.selectedRentalIndex].rental = yearRental.rental;
            this.yearRentalData[this.selectedRentalIndex].leaseRecordId = this.rentalRecordData[this.selectedRentalIndex].leaseRecordId;
        }
        if (this.yearRentalData.length != 0) {
            this.dialogTotalRental = 0;
            for (let i = 0; i < this.yearRentalData.length; i++) {
                this.dialogTotalRental += this.yearRentalData[i].rental;
            }
        } else {
            this.dialogTotalRental = 0;
        }
        this.modifyYearRentalDialog = false;
    }

    /**
     * 更改表格数据取消
     * 
     * @memberof RentalRecord
     */
    public modifyYearRentalCancel() {
        this.modifyYearRentalDialog = false;
    }

    public deleteYearRentalClick(idx, data) {
        this.yearRentalData.splice(idx, 1);
        if (this.yearRentalData.length != 0) {
            this.dialogTotalRental = 0;
            for (let i = 0; i < this.yearRentalData.length; i++) {
                this.dialogTotalRental += this.yearRentalData[i].rental;
            }
        } else {
            this.dialogTotalRental = 0;
        }
    }

    public exportRentalRecordClick() {
        let date: string = "";
        if (this.selectSearchDate) {
            date = this.dataManageService.getStrDate(this.selectSearchDate);
        } else {
            date = this.selectedYearSearch;
        }
        let token = window.sessionStorage.getItem("access_token");
        let url: string = "/bpd-proj/bpd/leaseRecord/export?createTime=" + date + "&_=" + Number(new Date());
        if (token) {
            let realToken = token.substr(1, token.length - 2)
            url = url + "&accessToken=" + realToken;
        }
        window.location.href = url;
    }

    public copyRentalRecordClick() {
        // this.dialogBlockAdress = "";
        // this.projectNameSearch();
        this.selectedRentalRecordData = [];
        this.copyRentalDialog = true;
    }

    public regionNameEnterSearch($event) {
        if ($event.code === "Enter") {
            this.projectNameSearch();
        }
    }

    public projectNameSearch() {
        let data = {
            blockAdress: this.dialogBlockAdress
        }
        this.httpService.post('/bpd-proj/bpd/leaseRecord/getList', data)
            .subscribe(data => {
                // this.rentalPaginatorTotal = data.total;
                this.rentalRecordCopyData = this.dataManageService.addEmptyTableData(data, this.rentalPaginatorRow);
            })
    }

    public copyRentalSave() {
        let ids: any = [];
        for (let i = 0, a = this.selectedRentalRecordData; i < a.length; i++) {
            ids.push(a[i].leaseRecordId)
        }
        ids.join(',');
        this.httpService.get('/bpd-proj/bpd/leaseRecord/copy?' + Number(new Date()) + '&leaseRecordIds=' + ids)
            .subscribe(data => {
                if (data.code == "1") {
                    this.messageService.showSuccess("Operate Success!");
                    this.growLife = 5000;
                    this.tableOnInit();
                } else {
                    this.messageService.showError("Operate Failed!");
                    this.growLife = 5000;
                }
                this.msgs = this.messageService.msgs;
            })
        this.copyRentalDialog = false;
    }

    public copyRentalCancel() {
        this.copyRentalDialog = false;
    }
}