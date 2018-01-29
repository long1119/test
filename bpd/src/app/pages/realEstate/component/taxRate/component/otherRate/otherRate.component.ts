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
import 'style-loader!./otherRate.scss';
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

// import { BaseDataModule } from '../../baseData.module';

@Component({
    selector: 'other-rate',
    templateUrl: './otherRate.html',
})
export class OtherRate {

    // 页面表格数据
    public facilityData: any[] = [];
    public rentalData: any[] = [];

    // 页面弹窗弹出
    public modifyDialog: Boolean = false;
    public deleteDialog: Boolean = false;
    private modifyFlag: string = "";
    private selectedIndex: number = null;
    private selectedRateCode: string = "";
    private selectedRateWeightCode: string = "";

    // 页面数据绑定
    public msgs: Message[];
    public growLife: number = 5000;
    private allData: any = {};
    public dialogFacilityTax: number = null;
    public dialogRentalTax: number = null;
    public dialogLandUsageTax: number = null;
    public dialogDeepTax: number = null;
    public dialogLatTax: number = null;
    public dialogStampRe: number = null;
    public dialogStampEquip: number = null;
    public dialogStampEx: number = null;
    public dialogStampLease: number = null;
    public dialogLandCommission: number = null;
    public dialogPeriod: number = null;
    public dialogPerYear: number = null;
    public dialogOccuredNo: number = null;
    public dialogOccuredPercentage: number = null;
    public localStorageAuthority: Boolean;

    constructor(private httpService: HttpDataService, private messageService: MessageService, private dataManageService: DataManageService) {

    }

    ngOnInit() {
        this.dataOnInit();
        this.localStorageAuthority = this.dataManageService.buttonAuthority("Maintain Tax Rate");
    }

    /**
     * 页面数据初始化
     * 
     * @private
     * @memberof OtherRate
     */
    private dataOnInit() {
        this.httpService.post('/bpd-proj/bpd/rate/getOtherTaxesList', {})
            .subscribe(data => {
                this.allData = data;
                if (data.RealEstateTaxFacility) {
                    if (data.RealEstateTaxFacility.list) {
                        this.facilityData = data.RealEstateTaxFacility.list;
                    }
                    this.dialogFacilityTax = data.RealEstateTaxFacility.rateValue;
                    if (data.RealEstateTaxRental.list) {
                        this.rentalData = data.RealEstateTaxRental.list;
                    }
                    this.dialogRentalTax = data.RealEstateTaxRental.rateValue;
                    this.dialogLandUsageTax = data.LandUsageTax.rateValue;
                    this.dialogDeepTax = data.DeedTax.rateValue;
                    this.dialogLatTax = data.LATTax.rateValue;
                    this.dialogStampRe = data.StampDutyforRE.rateValue;
                    this.dialogStampEquip = data.StampDutyforEquip.rateValue;
                    this.dialogStampEx = data.StampDutyforPCLEx.rateValue;
                    this.dialogStampLease = data.StampDutyforLease.rateValue;
                    this.dialogLandCommission = data.LandTransactionCommission.rateValue;
                    this.dialogPerYear = data.PVFactorPeriod.rateValue;
                    this.dialogPeriod = data.PVFactorPeriod.year;
                }
            })
    }

    /**
     * [inputRegex description]
     * @param {[type]} document [description]
     */
    public inputRegex(document) {
        let reg = /^[0-9]*(.[0-9]{0,2})?$/;
        let regexp = new RegExp(reg);
        if (regexp.test(document) && Number(document) <= 100) {
            return document;
        }
        if (!document) {
            return '';
        }
    }
   
    /**
     * facility 表格添加
     * 
     * @memberof OtherRate
     */
    public addFacilityClick() {
        this.dialogOccuredPercentage = null;
        this.dialogOccuredNo = null;
        this.selectedRateCode = this.allData.RealEstateTaxFacility.rateCode;

        // this.modifyFlag = "facility";
        this.modifyDialog = true;
    }

    /**
     * rental表格数据添加
     * 
     * @memberof OtherRate
     */
    public addRentalClick() {
        this.dialogOccuredPercentage = null;
        this.dialogOccuredNo = null;
        this.selectedRateCode = this.allData.RealEstateTaxRental.rateCode;

        // this.modifyFlag = "rental";
        this.modifyDialog = true;
    }

    /**
     * 表格数据保存
     * 
     * @memberof OtherRate
     */
    public modifyEstateSave() {
        // this.facilityData = this.rentalData = [];
        if (this.selectedRateCode === this.allData.RealEstateTaxFacility.rateCode) {
            this.facilityData.push({
                "rateCode": this.selectedRateCode,
                "year": this.dialogOccuredNo,
                "weightValue": this.dialogOccuredPercentage,
                "temporary": this.dataManageService.getUuId()

            })
        } else if (this.selectedRateCode === this.allData.RealEstateTaxRental.rateCode) {
            console.log(11);
            this.rentalData.push({
                "rateCode": this.selectedRateCode,
                "year": this.dialogOccuredNo,
                "weightValue": this.dialogOccuredPercentage,
                "temporary": this.dataManageService.getUuId()
            })
        }
        
        // this.httpService.post('/bpd-proj/bpd/rate/insertRateWeight', {
        //         "rateCode": this.selectedRateCode,
        //         "year": this.dialogOccuredNo,
        //         "weightValue": this.dialogOccuredPercentage
        //     })
        //     .subscribe(data => {
                // if (data.code == "1") {
                    this.messageService.showSuccess("Operate Success!");
                    this.growLife = 5000;
                // } else {
                    // this.messageService.showError("Operate Failed!");
                // }
                this.msgs = this.messageService.msgs;
                // 刷新页面数据
                // this.dataOnInit();
            // })

        this.modifyDialog = false;
    }

    /**
     * 表格数据添加取消
     * 
     * @memberof OtherRate
     */
    public modifyEstateCancel() {
        this.modifyDialog = false;
    }

    /**
     * facility 删除弹框
     * 
     * @param {any} idx 
     * @param {any} data 
     * @memberof OtherRate
     */
    public deleteFacilityClick(idx, data) {
        this.selectedIndex = idx;
        this.selectedRateWeightCode = data.rateWeightCode;
        this.modifyFlag = "facility";
        this.deleteDialog = true;
    }

    /**
     * rental 删除弹框
     * 
     * @param {any} idx 
     * @param {any} data 
     * @memberof OtherRate
     */
    public deleteRentalClick(idx, data) {
        this.selectedIndex = idx;
        this.selectedRateWeightCode = data.rateWeightCode;
        this.modifyFlag = "rental";
        this.deleteDialog = true;
    }

    /**
     * 表格数据删除确认
     * 
     * @memberof OtherRate
     */
    public deleteEstateYes() {
        if (this.modifyFlag === "facility") {
            this.facilityData.splice(this.selectedIndex, 1);
        } else if (this.modifyFlag === "rental") {
            this.rentalData.splice(this.selectedIndex, 1);
        }
        // this.httpService.get('/bpd-proj/bpd/rate/deleteRateWeight?' + Number(new Date()) + '&rateWeightCode=' + this.selectedRateWeightCode)
            // .subscribe(data => {
                // if (data.code == "1") {
                    this.messageService.showSuccess("Operate Success!");
                    this.growLife = 5000;
                // } else {
                    // this.messageService.showError("Operate Failed!");
                // }
                // this.msgs = this.messageService.msgs;
                // 刷新页面数据
                // this.dataOnInit();
            // })
        this.deleteDialog = false;
    }

    /**
     * 表格数据删除取消
     * 
     * @memberof OtherRate
     */
    public deleteEstateNo() {
        this.deleteDialog = false;
    }

    /**
     * 保存所有输入框数据
     * 
     * @memberof OtherRate
     */
    public saveOtherRateClick() {
        let saveData: any = {};
        saveData[this.allData.RealEstateTaxFacility.rateName] = {
            rateName: this.allData.RealEstateTaxFacility.rateName,
            rateValue: this.dialogFacilityTax,
            rateCode: this.allData.RealEstateTaxFacility.rateCode,
            list: this.facilityData
        }
        saveData[this.allData.RealEstateTaxRental.rateName] = {
            rateName: this.allData.RealEstateTaxRental.rateName,
            rateValue: this.dialogRentalTax,
            rateCode: this.allData.RealEstateTaxRental.rateCode,
            list: this.rentalData
        }
        saveData[this.allData.LandUsageTax.rateName] = {
            rateName: this.allData.LandUsageTax.rateName,
            rateValue: this.dialogLandUsageTax,
            rateCode: this.allData.LandUsageTax.rateCode
        }
        saveData[this.allData.DeedTax.rateName] = {
            rateName: this.allData.DeedTax.rateName,
            rateValue: this.dialogDeepTax,
            rateCode: this.allData.DeedTax.rateCode
        }
        saveData[this.allData.LATTax.rateName] = {
            rateName: this.allData.LATTax.rateName,
            rateValue: this.dialogLatTax,
            rateCode: this.allData.LATTax.rateCode
        }
        saveData[this.allData.StampDutyforRE.rateName] = {
            rateName: this.allData.StampDutyforRE.rateName,
            rateValue: this.dialogStampRe,
            rateCode: this.allData.StampDutyforRE.rateCode
        }
        saveData[this.allData.StampDutyforEquip.rateName] = {
            rateName: this.allData.StampDutyforEquip.rateName,
            rateValue: this.dialogStampEquip,
            rateCode: this.allData.StampDutyforEquip.rateCode
        }
        saveData[this.allData.StampDutyforPCLEx.rateName] = {
            rateName: this.allData.StampDutyforPCLEx.rateName,
            rateValue: this.dialogStampEx,
            rateCode: this.allData.StampDutyforPCLEx.rateCode
        }
        saveData[this.allData.StampDutyforLease.rateName] = {
            rateName: this.allData.StampDutyforLease.rateName,
            rateValue: this.dialogStampLease,
            rateCode: this.allData.StampDutyforLease.rateCode
        }
        saveData[this.allData.LandTransactionCommission.rateName] = {
            rateName: this.allData.LandTransactionCommission.rateName,
            rateValue: this.dialogLandCommission,
            rateCode: this.allData.LandTransactionCommission.rateCode
        }
        saveData[this.allData.PVFactorPeriod.rateName] = {
            rateName: this.allData.PVFactorPeriod.rateName,
            rateValue: this.dialogPeriod,
            year: this.dialogPerYear,
            rateCode: this.allData.PVFactorPeriod.rateCode
        }
        this.httpService.post('/bpd-proj/bpd/rate/updateOtherTaxe', saveData)
            .subscribe(data => {
                if (data.code == "1") {
                    this.messageService.showSuccess("Operate Success!");
                    this.growLife = 5000;
                } else {
                    this.messageService.showError("Operate Failed!");
                    this.growLife = 5000;
                }
                this.msgs = this.messageService.msgs;
                // 刷新页面数据
                this.dataOnInit();
            })
    }
}