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
import 'style-loader!./landInformation.scss';
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
    selector: 'land-information',
    templateUrl: './landInformation.html',
})
export class LandInformation {

    // 页面表格数据
    public landInformationData: any[] = [];

    // 控制页面弹窗展示
    public modifyDialog: Boolean = false;
    public deleteDialog: Boolean = false;
    private modifyFlag: string = "";
    private selectedIndex: number = null;

    // 页面数据绑定
    public msgs: Message[];
    public growLife: number = 5000;
    public dialogLocation: string = "";
    public dialogLandPrice: number = null;
    public dialogRentalPrice: number = null;
    public dialogVacancyRates: string = "";
    public dialogVolume: number = null;
    public dialogPriceTrend: string = "";
    public dialogDemandSupply: string = "";
    public dialogPotentialAssets: string = "";
    public dialogType: string = "";

    // 分页信息
    public informationPaginatorTotal: number = null;
    public informationPaginatorPage: number = null;
    public informationPaginatorRow: number = null;
    public localStorageAuthority: Boolean;

    constructor(private httpService: HttpDataService, private messageService: MessageService, private dataManageService: DataManageService, private deleteService: DeleteComfirmService) {
        this.informationPaginatorPage = 1;
        this.informationPaginatorRow = 10;
    }

    ngOnInit() {
        this.httpService.post('/bpd-proj/bpd/landInformation/getList', {
            // page: {
            //     page: this.informationPaginatorPage,
            //     rows: this.informationPaginatorRow
            // }
        })
            .subscribe(data => {
                // this.informationPaginatorTotal = data.total;
                this.landInformationData = this.dataManageService.addEmptyTableData(data, this.informationPaginatorRow);
            })
        this.localStorageAuthority = this.dataManageService.buttonAuthority("Maintain Land Info");
    }

    /**
     * 分页信息
     * 
     * @param {any} $event 
     * @memberof LandInformation
     */
    public informationPaginate($event) {
        this.informationPaginatorPage = $event.page + 1;
        this.informationPaginatorRow = $event.rows;
        this.httpService.post('/bpd-proj/bpd/landInformation/getList', {
            // page: {
            //     page: $event.page + 1
            //     rows: $event.rows
            // }
        })
            .subscribe(data => {
                // this.informationPaginatorTotal = data.total;
                this.landInformationData = this.dataManageService.addEmptyTableData(data, this.informationPaginatorRow);
            })
    }

    /**
     * 表格数据请求
     * 
     * @private
     * @memberof LandLandInformationRecord
     */
    private tableOnInit() {

    }

    /**
     * 添加弹窗显示
     * 
     * @memberof LandLandInformationRecord
     */
    public addLandInformationClick() {
        this.dialogLocation = "";
        this.dialogLandPrice = null;
        this.dialogRentalPrice = null;
        this.dialogVacancyRates = "";
        this.dialogVolume = null;
        this.dialogPriceTrend = "";
        this.dialogDemandSupply = "";
        this.dialogPotentialAssets = "";
        this.dialogType = "";

        this.modifyFlag = "add";
        this.modifyDialog = true;
    }

    /**
     * 编辑弹窗显示
     * 
     * @memberof LandLandInformationRecord
     */
    public editLandInformationClick(idx, data) {
        this.dialogLocation = data.region;
        this.dialogLandPrice = Number(data.landPrice);
        this.dialogRentalPrice = Number(data.rentalPrice);
        this.dialogVacancyRates = data.vacancyRate;
        this.dialogVolume = Number(data.volume);
        this.dialogPriceTrend = data.priceTrend;
        this.dialogDemandSupply = data.supplyAndDemandChange;
        this.dialogPotentialAssets = data.potentialResources;
        this.dialogType = data.type;
        this.selectedIndex = idx;

        this.modifyFlag = "edit";
        this.modifyDialog = true;
    }

    /**
     * 数据添加修改确认
     * 
     * @memberof LandLandInformationRecord
     */
    public modifyLandInformationSave() {
        if (this.modifyFlag == "add") {
            this.httpService.post('/bpd-proj/bpd/landInformation/insert', {
                "region": this.dialogLocation,
                "landPrice": this.dialogLandPrice,
                "rentalPrice": this.dialogRentalPrice,
                "vacancyRate": this.dialogVacancyRates,
                "volume": this.dialogVolume,
                "priceTrend": this.dialogPriceTrend,
                "supplyAndDemandChange": this.dialogDemandSupply,
                "potentialResources": this.dialogPotentialAssets,
                "type": this.dialogType
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
                    this.httpService.post('/bpd-proj/bpd/landInformation/getList', {
                        // page: {
                        //     page: this.informationPaginatorPage,
                        //     rows: this.informationPaginatorRow
                        // }
                    })
                        .subscribe(data => {
                            // this.informationPaginatorTotal = data.total;
                            this.landInformationData = this.dataManageService.addEmptyTableData(data, this.informationPaginatorRow);
                        })
                })
        } else if (this.modifyFlag == "edit") {
            this.httpService.post('/bpd-proj/bpd/landInformation/update', {
                "region": this.dialogLocation,
                "landPrice": this.dialogLandPrice,
                "rentalPrice": this.dialogRentalPrice,
                "vacancyRate": this.dialogVacancyRates,
                "volume": this.dialogVolume,
                "priceTrend": this.dialogPriceTrend,
                "supplyAndDemandChange": this.dialogDemandSupply,
                "potentialResources": this.dialogPotentialAssets,
                "type": this.dialogType,
                "informationId": this.landInformationData[this.selectedIndex].informationId
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
                    this.httpService.post('/bpd-proj/bpd/landInformation/getList', {
                        // page: {
                        //     page: this.informationPaginatorPage,
                        //     rows: this.informationPaginatorRow
                        // }
                    })
                        .subscribe(data => {
                            // this.informationPaginatorTotal = data.total;
                            this.landInformationData = this.dataManageService.addEmptyTableData(data, this.informationPaginatorRow);
                        })
                })
        }

        this.modifyDialog = false;
    }


    /**
     * 数据添加取消
     * 
     * @memberof LandLandInformationRecord
     */
    public modifyLandInformationCancel() {
        this.modifyDialog = false;
    }

    /**
     * 删除弹窗展示
     * 
     * @memberof LandLandInformationRecord
     */
    public deleteLandInformationClick(idx, data) {
        this.selectedIndex = idx;
        // this.deleteDialog = true;
        this.deleteService.confirm(() => {
            this.httpService.get('/bpd-proj/bpd/landInformation/delete?' + Number(new Date()) + '&informationId=' + this.landInformationData[this.selectedIndex].informationId)
                .subscribe(data => {
                    if (data.code == "1") {
                        this.messageService.showSuccess("Operate Success!");
                        this.growLife = 5000;
                    } else {
                        this.messageService.showError("Operate Failed!");
                        this.growLife = 5000;
                    }
                    this.msgs = this.messageService.msgs;
                    this.httpService.post('/bpd-proj/bpd/landInformation/getList', {
                        // page: {
                        //     page: this.informationPaginatorPage,
                        //     rows: this.informationPaginatorRow
                        // }
                    })
                        .subscribe(data => {
                            // this.informationPaginatorTotal = data.total;
                            this.landInformationData = this.dataManageService.addEmptyTableData(data, this.informationPaginatorRow);
                        })
                })
        })
    }

    /**
     * 删除确认
     * 
     * @memberof LandLandInformationRecord
     */
    public deleteLandInformationYes() {
        this.httpService.get('/bpd-proj/bpd/landInformation/delete?' + Number(new Date()) + '&informationId=' + this.landInformationData[this.selectedIndex].informationId)
            .subscribe(data => {
                if (data.code == "1") {
                    this.messageService.showSuccess("Operate Success!");
                    this.growLife = 5000;
                } else {
                    this.messageService.showError("Operate Failed!");
                    this.growLife = 5000;
                }
                this.msgs = this.messageService.msgs;
                this.httpService.post('/bpd-proj/bpd/landInformation/getList', {
                    // page: {
                    //     page: this.informationPaginatorPage,
                    //     rows: this.informationPaginatorRow
                    // }
                })
                    .subscribe(data => {
                        // this.informationPaginatorTotal = data.total;
                        this.landInformationData = this.dataManageService.addEmptyTableData(data, this.informationPaginatorRow);
                    })
            })
        this.deleteDialog = false;
    }

    /**
     * 删除取消
     * 
     * @memberof LandLandInformationRecord
     */
    public deleteLandInformationNo() {
        this.deleteDialog = false;
    }

    public exportLandInformationClick() {
        let token = window.sessionStorage.getItem("access_token");
        let url: string = "/bpd-proj/bpd/landInformation/export" + '?_=' + Number(new Date());
        if (token) {
            let realToken = token.substr(1, token.length - 2)
            url = url + "&accessToken=" + realToken;
        }
        window.location.href = url;
    }
}