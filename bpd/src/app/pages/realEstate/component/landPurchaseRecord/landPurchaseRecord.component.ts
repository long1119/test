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
import 'style-loader!./landPurchaseRecord.scss';
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
    selector: 'land-purchase-record',
    templateUrl: './landPurchaseRecord.html',
})
export class LandPurchaseRecord {

    // 页面数据
    public purchaseData: any[] = [];

    // 页面弹窗展示
    public modifyDialog: Boolean = false;
    public deleteDialog: Boolean = false;
    private modifyFlag: string = "";
    private seletedIdx: number = null;

    // 页面双向绑定数据
    public msgs: Message[];
    public growLife: number = 5000;
    public dialogLandAdress: string = "";
    public dialogEnterprise: string = "";
    public dialogAdress: string = "";
    public dialogAcreage: number = null;
    public dialogConstructure: number = null;
    public dialogLandCertificateNo: number = null;
    public dialogHouseNumber: string = "";
    public dialogManagementEnterprise: string = "";
    public dialogServiceLife: Date = null;
    public dialogCustodyStatus: string = "";

    // 分页信息
    public purchasePaginatorTotal: number = null;
    public purchasePaginatorPage: number = null;
    public purchasePaginatorRow: number = null;
    public localStorageAuthority: Boolean;
    public yearRange: string;

    constructor(private httpService: HttpDataService, private messageService: MessageService, private dataManageService: DataManageService, private deleteService: DeleteComfirmService) {
        this.purchasePaginatorRow = 10;
        this.purchasePaginatorPage = 1;
        // 日期年份设置
        let currentYear = new Date().getFullYear();
        this.yearRange = "" + (Number(currentYear) - 10) + ":" + (Number(currentYear) + 50);
    }

    ngOnInit() {
        this.httpService.post('/bpd-proj/bpd/landPurchaseRecord/getList', {
            // page: {
            //     page: this.purchasePaginatorPage,
            //     rows: this.purchasePaginatorRow
            // }
        })
            .subscribe(data => {
                // this.purchasePaginatorTotal = data.total;
                this.purchaseData = this.dataManageService.addEmptyTableData(data, this.purchasePaginatorRow);
            })
        this.localStorageAuthority = this.dataManageService.buttonAuthority("Maintain Purchase Analysis  Base Data");
    }

    /**
     * 表格数据请求
     * 
     * @private
     * @memberof LandPurchaseRecord
     */
    private tableOnInit() {

    }

    /**
     * 添加弹窗显示
     * 
     * @memberof LandPurchaseRecord
     */
    public addPurchaseClick() {
        this.dialogLandAdress = "";
        this.dialogEnterprise = "";
        this.dialogAdress = "";
        this.dialogAcreage = null;
        this.dialogConstructure = null;
        this.dialogLandCertificateNo = null;
        this.dialogHouseNumber = "";
        this.dialogManagementEnterprise = "";
        this.dialogServiceLife = new Date();
        this.dialogCustodyStatus = "";

        this.modifyFlag = "add";
        this.modifyDialog = true;
    }

    /**
     * 编辑弹窗显示
     * 
     * @memberof LandPurchaseRecord
     */
    public editPurchaseClick(idx, data) {
        this.dialogLandAdress = data.blockAddress;
        this.dialogEnterprise = data.enterprise;
        this.dialogAdress = data.address;
        this.dialogAcreage = Number(data.acreage);
        this.dialogConstructure = Number(data.constructure);
        this.dialogLandCertificateNo = Number(data.landCertificateNo);
        this.dialogHouseNumber = data.houseePropertyNumber;
        this.dialogManagementEnterprise = data.useManagementEnterprise;
        // 转换日期格式
        // let date = [1,2,3];
        let date = data.serviceLife.split("-");
        this.dialogServiceLife = new Date(date[0].toString(), date[1].toString(), date[2].toString());
        this.dialogCustodyStatus = data.warrantCustodyStatus;
        this.seletedIdx = idx;

        this.modifyFlag = "edit";
        this.modifyDialog = true;
    }

    /**
     * 数据添加修改确认
     * 
     * @memberof LandPurchaseRecord
     */
    public modifyPurchaseSave() {
        let date = "" + this.dialogServiceLife.getFullYear() + "-" + (Number(this.dialogServiceLife.getMonth()) + 1) + "-" + this.dialogServiceLife.getDate();
        if (this.modifyFlag == "add") {
            this.httpService.post('/bpd-proj/bpd/landPurchaseRecord/insert', {
                "blockAddress": this.dialogLandAdress,
                "enterprise": this.dialogEnterprise,
                "address": this.dialogAdress,
                "acreage": this.dialogAcreage,
                "constructure": this.dialogConstructure,
                "landCertificateNo": this.dialogLandCertificateNo,
                "houseePropertyNumber": this.dialogHouseNumber,
                "useManagementEnterprise": this.dialogManagementEnterprise,
                "serviceLife": date,
                "warrantCustodyStatus": this.dialogCustodyStatus
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
                    this.httpService.post('/bpd-proj/bpd/landPurchaseRecord/getList', {
                        // page: {
                        //     page: this.purchasePaginatorPage,
                        //     rows: this.purchasePaginatorRow
                        // }
                    })
                        .subscribe(data => {
                            // this.purchasePaginatorTotal = data.total;
                            this.purchaseData = this.dataManageService.addEmptyTableData(data, this.purchasePaginatorRow);
                        })
                })
        } else if (this.modifyFlag == "edit") {
            this.httpService.post('/bpd-proj/bpd/landPurchaseRecord/update', {
                "blockAddress": this.dialogLandAdress,
                "enterprise": this.dialogEnterprise,
                "address": this.dialogAdress,
                "acreage": this.dialogAcreage,
                "constructure": this.dialogConstructure,
                "landCertificateNo": this.dialogLandCertificateNo,
                "houseePropertyNumber": this.dialogHouseNumber,
                "useManagementEnterprise": this.dialogManagementEnterprise,
                "serviceLife": date,
                "warrantCustodyStatus": this.dialogCustodyStatus,
                "purchaseRecordId": this.purchaseData[this.seletedIdx].purchaseRecordId
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
                    this.httpService.post('/bpd-proj/bpd/landPurchaseRecord/getList', {
                        // page: {
                        //     page: this.purchasePaginatorPage,
                        //     rows: this.purchasePaginatorRow
                        // }
                    })
                        .subscribe(data => {
                            // this.purchasePaginatorTotal = data.total;
                            this.purchaseData = this.dataManageService.addEmptyTableData(data, this.purchasePaginatorRow);
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
    public modifyPurchaseCancel() {
        this.modifyDialog = false;
    }

    /**
     * 删除弹窗展示
     * 
     * @memberof LandPurchaseRecord
     */
    public deletePurchaseClick(idx, data) {
        this.seletedIdx = idx;
        // this.deleteDialog = true;
        this.deleteService.confirm(() => {
            this.httpService.get('/bpd-proj/bpd/landPurchaseRecord/delete?' + Number(new Date()) + '&purchaseRecordId=' + this.purchaseData[this.seletedIdx].purchaseRecordId)
                .subscribe(data => {
                    if (data.code == "1") {
                        this.messageService.showSuccess("Operate Success!");
                        this.growLife = 5000;
                    } else {
                        this.messageService.showError("Operate Failed!");
                        this.growLife = 5000;
                    }
                    this.msgs = this.messageService.msgs;
                    this.httpService.post('/bpd-proj/bpd/landPurchaseRecord/getList', {
                        // page: {
                        //     page: this.purchasePaginatorPage,
                        //     rows: this.purchasePaginatorRow
                        // }
                    })
                        .subscribe(data => {
                            // this.purchasePaginatorTotal = data.total;
                            this.purchaseData = this.dataManageService.addEmptyTableData(data, this.purchasePaginatorRow);
                        })
                })
        })
    }

    /**
     * 删除确认
     * 
     * @memberof LandPurchaseRecord
     */
    public deletePurchaseYes() {
        this.httpService.get('/bpd-proj/bpd/landPurchaseRecord/delete?' + Number(new Date()) + '&purchaseRecordId=' + this.purchaseData[this.seletedIdx].purchaseRecordId)
            .subscribe(data => {
                if (data.code == "1") {
                    this.messageService.showSuccess("Operate Success!");
                    this.growLife = 5000;
                } else {
                    this.messageService.showError("Operate Failed!");
                    this.growLife = 5000;
                }
                this.msgs = this.messageService.msgs;
                this.httpService.post('/bpd-proj/bpd/landPurchaseRecord/getList', {
                    // page: {
                    //     page: this.purchasePaginatorPage,
                    //     rows: this.purchasePaginatorRow
                    // }
                })
                    .subscribe(data => {
                        // this.purchasePaginatorTotal = data.total;
                        this.purchaseData = this.dataManageService.addEmptyTableData(data, this.purchasePaginatorRow);
                    })
            })
        this.deleteDialog = false;
    }

    /**
     * 删除取消
     * 
     * @memberof LandPurchaseRecord
     */
    public deletePurchaseNo() {
        this.deleteDialog = false;
    }

    public exportPurchaseClick() {
        let token = window.sessionStorage.getItem("access_token");
        let url: string = "/bpd-proj/bpd/landPurchaseRecord/export" + '?_=' + Number(new Date());
        if (token) {
            let realToken = token.substr(1, token.length - 2)
            url = url + "&accessToken=" + realToken;
        }
        window.location.href = url;
    }
}