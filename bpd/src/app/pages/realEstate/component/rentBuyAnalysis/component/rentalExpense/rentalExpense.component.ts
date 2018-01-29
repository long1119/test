
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
import 'style-loader!./rentalExpense.scss';
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
    selector: 'rental-expense',
    templateUrl: './rentalExpense.html',
})
export class RentalExpense {
    // 页面表格数据
    public landAcqusitionData: any[];
    public buildingCostData: any[];
    public otherCostData: any[];
    public longTermExpenseData: any[];
    // 页面弹框数据
    public modifyDialog: Boolean;
    private modifyFlag: string;
    private modifyAreaFlag: string;
    public deleteDialog: Boolean;
    private selectedIndexGroupCode: number;
    private selectedIndexDetailCode: number;
    private selectedIndexWeightCode: number;
    private selectedIndex: number;
    private selectedData: any[];
    // 页面双向绑定数据
    public allData: any;
    public msgs: Message[];
    public growLife: number = 5000;
    public dialogAcqusitionLandCost: number;
    public dialogAcqusitionInitialInvestment: number;
    public dialogAcqusitionPeriod: number;
    public dialogAcqusitionAcreage: number;
    public dialogAcqusitionAnnualDepreciation: number;
    public addAcqusitionFlag: Boolean = false;

    public dialogOtherLandCost: number;
    public dialogOtherInitialInvestment: number;
    public dialogOtherPeriod: number;
    public dialogOtherAnnualDepreciation: number;
    public addOtherFlag: Boolean = false;

    public dialogExpenseLandCost: number;
    public dialogExpenseInitialInvestment: number;
    public dialogExpenseAnnualDepreciation: number;
    public addExpenseFlag: Boolean = false;

    public dialogYearCount: number;
    public dialogOccuredNo: number;
    public dialogOccuredPercentage: number;
    public dialogRentalPrice: number;
    public localStorageAuthority: Boolean = false;

    public inputPercentages: any[] = [{}];
    public addPercentageFlag: Boolean = false;
    private currentYear: number;
    public addDynamicFlag: Boolean;
    public regexFlag: Boolean;

    constructor(private httpService: HttpDataService, private messageService: MessageService, private dataManageService: DataManageService, private deleteService: DeleteComfirmService) {

    }

    ngOnInit() {
        this.dataOnInit();
        this.localStorageAuthority = this.dataManageService.buttonAuthority("Maintain Rent Property Ledger");
    }

    /**
     * 数据初始化
     * 
     * @private
     * @memberof BuildingCostAndOthers
     */
    private dataOnInit() {
        this.httpService.post('/bpd-proj/bpd/indexDetails/getAllList', {
                "indexGroupCode": "0"
            })
            .subscribe(data => {
                this.allData = data;
                if (data.RentalCost) {
                    this.dialogAcqusitionLandCost = data.RentalCost.landCost;
                    this.dialogAcqusitionInitialInvestment = data.RentalCost.initialInvestment;
                    this.dialogAcqusitionPeriod = data.RentalCost.period;
                    this.dialogAcqusitionAcreage = data.RentalCost.acreage;
                    this.dialogAcqusitionAnnualDepreciation = data.RentalCost.annualDepreciation;
                    this.landAcqusitionData = data.RentalCost.list;
                    // if (data.LandAcquisitionCost.list.length != 0) {
                    //     this.addAcqusitionFlag = false;
                    // } else {
                    //     this.addAcqusitionFlag = true;
                    // }

                    this.dialogOtherLandCost = data.OtherInvestment.landCost;
                    this.dialogOtherInitialInvestment = data.OtherInvestment.initialInvestment;
                    this.dialogOtherPeriod = data.OtherInvestment.period;
                    this.dialogOtherAnnualDepreciation = data.OtherInvestment.annualDepreciation;
                    this.otherCostData = data.OtherInvestment.list;
                    if (data.OtherInvestment.list.length != 0) {
                        this.addOtherFlag = true;
                    } else {
                        this.addOtherFlag = false;
                    }

                    this.dialogExpenseLandCost = data.LongtermExpense.landCost;
                    this.dialogExpenseInitialInvestment = data.LongtermExpense.initialInvestment;
                    this.dialogExpenseAnnualDepreciation = data.LongtermExpense.annualDepreciation;
                    this.longTermExpenseData = data.LongtermExpense.list;
                    // if (data.LongtermExpense.list.length != 0) {
                    //     this.addExpenseFlag = false;
                    // } else {
                    //     this.addExpenseFlag = true;
                    // }
                }
            })
    }

    /**
     * [inputRegex description]
     * @param {[type]} document [description]
     */
    public inputRegex(document, flag: Boolean = true) {
        let reg = /^[0-9]*(.[0-9]{0,2})?$/;
        let regexp = new RegExp(reg);
        if (flag) {
            if (regexp.test(document) && Number(document) <= 100) {
                return document;
            }
        } else {
            if (regexp.test(document)) {
                return document;
            }
        }
        
        if (!document) {
            return 0;
        }
    }

    // 页面数据如动态计算
    calculationCost() {
        this.dialogAcqusitionInitialInvestment = Math.round(this.dialogAcqusitionLandCost * this.dialogAcqusitionAcreage * 100) / 100;
        this.dialogAcqusitionAnnualDepreciation = Math.round(this.dialogAcqusitionLandCost * this.dialogAcqusitionAcreage / this.dialogAcqusitionPeriod * 100) / 100;

        this.dialogOtherInitialInvestment = Math.round(this.dialogOtherLandCost * (1 + this.allData.StampDutyforEquip.rateValue / 100) * 100) / 100;
        this.dialogOtherAnnualDepreciation = Math.round(this.dialogOtherLandCost * (1 + this.allData.StampDutyforEquip.rateValue / 100) / this.dialogOtherPeriod * 100) / 100;

        this.dialogExpenseInitialInvestment = Math.round(this.dialogExpenseLandCost * (1 + this.allData.StampDutyforPCLEx.rateValue / 100) * 100) / 100;
        this.dialogExpenseAnnualDepreciation = Math.round(this.dialogExpenseLandCost * (1 + this.allData.StampDutyforPCLEx.rateValue / 100) * 100) / 100;
    }

    /**
     * 权重数据修改
     * 
     * @memberof BuildingCostAndOthers
     */
    saveBuildingCostAndOthersClick() {
        let newData: any = {};
        newData.RentalCost = {};
        newData.OtherInvestment = {};
        newData.LongtermExpense = {};
        newData.groupCodeVo = {};
        newData.RentalCost.landCost = this.dialogAcqusitionLandCost;
        newData.RentalCost.initialInvestment = this.dialogAcqusitionInitialInvestment;
        newData.RentalCost.period = this.dialogAcqusitionPeriod;
        newData.RentalCost.acreage = this.dialogAcqusitionAcreage;
        newData.RentalCost.annualDepreciation = this.dialogAcqusitionAnnualDepreciation;
        newData.RentalCost.indexDetailsCode = this.allData.RentalCost.indexDetailsCode;
        newData.RentalCost.list = this.landAcqusitionData;

        newData.OtherInvestment.landCost = this.dialogOtherLandCost;
        newData.OtherInvestment.period = this.dialogOtherPeriod;
        newData.OtherInvestment.initialInvestment = this.dialogOtherInitialInvestment;
        newData.OtherInvestment.annualDepreciation = this.dialogOtherAnnualDepreciation;
        newData.OtherInvestment.indexDetailsCode = this.allData.OtherInvestment.indexDetailsCode;
        newData.OtherInvestment.list = this.otherCostData;

        newData.LongtermExpense.landCost = this.dialogExpenseLandCost;
        newData.LongtermExpense.initialInvestment = this.dialogExpenseInitialInvestment;
        newData.LongtermExpense.annualDepreciation = this.dialogExpenseAnnualDepreciation;
        newData.LongtermExpense.indexDetailsCode = this.allData.LongtermExpense.indexDetailsCode;
        newData.LongtermExpense.list = this.longTermExpenseData;

        newData.groupCodeVo.indexGroupCode = "0";

        let percentMessage: any[] = [];
        let sum: number = 0;
        for (let i = 0; i < this.otherCostData.length; i++) {
            sum += Number(this.otherCostData[i].weightValue);
        }
        if (sum != 100) {
            percentMessage.push("Land Acqusition Cost");
        }
        sum = 0;
        if (percentMessage.length != 0) {
            this.messageService.showInfo("The Percentage Of The " + percentMessage.join(",") + " Must Equal 100!");
            this.growLife = 300000;
            this.msgs = this.messageService.msgs;
            return;
        }
        // 添加数据请求发送
        this.httpService.post('/bpd-proj/bpd/indexDetails/updateIndexDetails', newData)
            .subscribe(data => {
                if (data.code == "1") {
                    this.messageService.showSuccess("Operation Success!");
                    this.growLife = 5000;
                } else if (data.code == "7") {
                    this.messageService.showInfo("You Should Set All Weight First!");
                    this.growLife = 300000;
                } else {
                    this.messageService.showError("Operation Failed!");
                    this.growLife = 5000;
                }
                this.msgs = this.messageService.msgs;
                this.dataOnInit();
            })
    }

    /**
     * 添加Acqusition
     * 
     * @memberof BuildingCostAndOthers
     */
    addAcqusitionClick() {
        this.modifyFlag = "add";
        if (this.landAcqusitionData.length != 0) {
            this.dialogOccuredNo = Number(this.landAcqusitionData[this.landAcqusitionData.length - 1].year) + 1;
        } else {
            this.dialogOccuredNo = Number(new Date().getFullYear());
        }
        // this.setEmptyPercentage();
        this.dialogRentalPrice = null;
        this.dialogOccuredPercentage = null;
        this.dialogYearCount = 1;
        this.selectedData = this.allData.RentalCost.list;
        this.selectedIndexDetailCode = this.allData.RentalCost.indexDetailsCode;
        this.selectedIndexGroupCode = this.allData.RentalCost.indexGroupCode;
        this.modifyAreaFlag = "Acqusition";
        this.modifyDialog = true;
        this.addDynamicFlag = false;
        this.regexFlag = false;
        this.addPercentageFlag = false;
    }

    /**
     * 添加Other
     * 
     * @memberof BuildingCostAndOthers
     */
    addOtherClick() {
        this.modifyFlag = "add";
        if (this.otherCostData.length != 0) {
            this.dialogOccuredNo = Number(this.otherCostData[this.otherCostData.length - 1].year) + 1;
        } else {
            this.dialogOccuredNo = Number(new Date().getFullYear());
        }
        // this.setEmptyPercentage();
        this.dialogOccuredPercentage = null;
        this.dialogYearCount = 1;
        this.selectedData = this.allData.OtherInvestment.list;
        this.selectedIndexDetailCode = this.allData.OtherInvestment.indexDetailsCode;
        this.selectedIndexGroupCode = this.allData.OtherInvestment.indexGroupCode;
        this.modifyAreaFlag = "Other";
        this.modifyDialog = true;
        this.addDynamicFlag = true;
        this.regexFlag = true;
        this.addPercentageFlag = false;
    }

    /**
     * 添加Expense
     * 
     * @memberof BuildingCostAndOthers
     */
    addExpenseClick() {
        this.modifyFlag = "add";
        if (this.longTermExpenseData.length != 0) {
            this.dialogOccuredNo = Number(this.longTermExpenseData[this.longTermExpenseData.length - 1].year) + 1;
        } else {
            this.dialogOccuredNo = Number(new Date().getFullYear());
        }
        // this.setEmptyPercentage();
        this.dialogOccuredPercentage = null;
        this.dialogYearCount = 1;
        this.selectedData = this.allData.LongtermExpense.list;
        this.selectedIndexDetailCode = this.allData.LongtermExpense.indexDetailsCode;
        this.selectedIndexGroupCode = this.allData.LongtermExpense.indexGroupCode;
        this.modifyAreaFlag = "Expense";
        this.modifyDialog = true;
        this.addDynamicFlag = false;
        this.regexFlag = false;
        this.addPercentageFlag = false;
    }

    /**
     * 修改数据回显
     * 
     * @private
     * @param {any} data 
     * @memberof BuildingCostAndOthers
     */
    private dataReview(index, data, dynamicFlag: Boolean = true) {
        // if (!dynamicFlag) {
        //     let stepData: any = [];
        //     for (let key in this.allData) {
        //         if (this.allData[key].indexDetailsCode == data.indexDetailsCode) {
        //             stepData = this.selectedData = this.allData[key].list;
        //         }
        //     }
        //     let reviewCount: number = 1;
        //     this.inputPercentages = [];
        //     for (let i = 1; i <= stepData.length; i++) {
        //         if (i >= 2 && !stepData[i] && stepData[i - 1].weightValue !== stepData[i - 2].weightValue) {
        //             this.inputPercentages.push({
        //             occuredNo: this.getCurrentYear(),
        //             occuredPercentage: stepData[i - 1].weightValue,
        //             yearCount: reviewCount
        //         });
        //         } else if (i < stepData.length && stepData[i - 1].weightValue === stepData[i].weightValue && !!stepData[i].weightValue) {
        //             reviewCount++;
        //         } else {
        //             if (this.inputPercentages.length === 0) {
        //                 this.inputPercentages.push({
        //                     occuredNo: this.getCurrentYear(),
        //                     occuredPercentage: stepData[i - 1].weightValue,
        //                     yearCount: reviewCount
        //                 });
        //             } else {
        //                 this.inputPercentages.push({
        //                     occuredNo: this.inputPercentages[this.inputPercentages.length - 1].occuredNo + this.inputPercentages[this.inputPercentages.length - 1].yearCount,
        //                     occuredPercentage: stepData[i - 1].weightValue,
        //                     yearCount: reviewCount
        //                 });
        //             }
        //         reviewCount = 1;
        //         }
        //     }
        // } else {
        //     this.inputPercentages[0].occuredNo = data.year;
        //     this.inputPercentages[0].yearCount = 1;
        //     this.inputPercentages[0].occuredPercentage = data.weightValue;
        // }
        this.selectedIndex = index;
        this.dialogOccuredNo = data.year;
        this.dialogOccuredPercentage = data.weightValue;
        if (data.rentalPrice) {
            this.dialogRentalPrice = data.rentalPrice;
        } else {
            this.dialogRentalPrice = null;
        }
        this.selectedIndexDetailCode = data.indexDetailsCode;
        this.selectedIndexGroupCode = data.indexGroupCode;
        this.selectedIndexWeightCode = data.indexWeightCode;
        this.modifyFlag = "edit";
        this.modifyDialog = true;
    }

    /**
     * 修改Acqusition
     * 
     * @param {any} idx 
     * @param {any} data 
     * @memberof BuildingCostAndOthers
     */
    editAcqusitionClick(idx, data) {
        this.addDynamicFlag = false;
        if (data.weightValue) {
            this.addPercentageFlag = true;
        }
        this.dataReview(idx, data);
        this.modifyAreaFlag = "Acqusition";
        this.regexFlag = false;
    }

    /**
     * 修改Other
     * 
     * @param {any} idx 
     * @param {any} data 
     * @memberof BuildingCostAndOthers
     */
    editOtherClick(idx, data) {
        this.dataReview(idx, data);
        this.addDynamicFlag = true;
        this.modifyAreaFlag = "Other";
        if (data.weightValue) {
            this.addPercentageFlag = true;
        }
        this.regexFlag = true;
    }

    /**
     * 修改Expense
     * 
     * @param {any} idx 
     * @param {any} data 
     * @memberof BuildingCostAndOthers
     */
    editExpenseClick(idx, data) {
        this.dataReview(idx, data);
        this.addDynamicFlag = false;
        this.modifyAreaFlag = "Expense";
        if (data.weightValue) {
            this.addPercentageFlag = true;
        }
        this.regexFlag = true;
    }

    /**
     * 数据更改确认
     * 
     * @memberof BuildingCostAndOthers
     */
    modifyEstateSave() {
        // let allYear: any = [];
        // if (Number(this.dialogYearCount) > 0) {
        //     let OccuredNo: number = this.dialogOccuredNo;
        //     for (let i = 0; i < this.dialogYearCount; i++) {
        //         allYear.push(OccuredNo++);
        //     }
        // }
        // allYear = allYear.join(",");
        // let allPercent: number = 0;
        // if (this.modifyFlag == "add") {
        //     for (let i = 0; i < this.selectedData.length; i++) {
        //         allPercent += this.selectedData[i].weightValue;
        //     }
        //     allPercent += this.dialogOccuredPercentage * this.dialogYearCount;
        // } else if (this.modifyFlag == "edit") {
        //     for (let i = 0; i < this.selectedData.length; i++) {
        //         allPercent += this.selectedData[i].weightValue;
        //     }
        //     allPercent = allPercent + this.dialogOccuredPercentage - this.selectedData[this.selectedIndex].weightValue;
        // }
        // if (allPercent > 100) {
        //     this.messageService.showError('The Sum Of The Percent Must Less Than 100!');
        //     this.msgs = this.messageService.msgs;
        //     return;
        // }
        // let allYear: any = [];
        // let allPercent: any = [];
        let data: any[] = [];
        // if  (this.inputPercentages.length !== 1) {
        //     for (let i  =  0; i < this.inputPercentages.length; i++) {
        //         for (let j =  0; j < this.inputPercentages[i].yearCount; j++) {
        //             allPercent.push(this.inputPercentages[i].occuredPercentage);
        //             allYear.push(Number(this.inputPercentages[i].occuredNo) + j);
        //         }
        //     }
        //     console.log(allYear);
        //     data = {
        //         "indexDetailsCode": this.selectedIndexDetailCode,
        //         "indexGroupCode": this.selectedIndexGroupCode,
        //         "years": allYear.join(","),
        //         "value": allPercent.join(","),
        //         "indexWeightCode": this.selectedIndexWeightCode
        //     };
        // } else {
        //     data = {
        //         "indexDetailsCode": this.selectedIndexDetailCode,
        //         "indexGroupCode": this.selectedIndexGroupCode,
        //         "year": this.inputPercentages[0].occuredNo,
        //         "weightValue": this.inputPercentages[0].occuredPercentage,
        //         "indexWeightCode": this.selectedIndexWeightCode
        //     };
        // }
        this.dialogYearCount = this.dialogYearCount ? this.dialogYearCount : 1;
        for (let i = 0; i < this.dialogYearCount; i++) {
            data.push({
                "indexDetailsCode": this.selectedIndexDetailCode,
                "indexGroupCode": this.selectedIndexGroupCode,
                "year": Number(this.dialogOccuredNo) + i,
                "rentalPrice": this.dialogRentalPrice,
                "weightValue": this.dialogOccuredPercentage || 0,
                "indexWeightCode": this.selectedIndexWeightCode || this.dataManageService.getUuId()
            }) 
        }
        if (this.modifyFlag == "add") {
            if (this.modifyAreaFlag == "Acqusition") {
                this.landAcqusitionData = this.landAcqusitionData.concat(data);
            } else if (this.modifyAreaFlag == "Other") {
                this.otherCostData = this.otherCostData.concat(data);
            } else if (this.modifyAreaFlag == "Expense") {
                this.longTermExpenseData = this.longTermExpenseData.concat(data);
            } 
            // // 添加
            // this.httpService.post('/bpd-proj/bpd/indexDetails/insertDetailsWeight', data)
            //     .subscribe(data => {
            //         if (data.code == "1") {
                        this.messageService.showSuccess("Operation Success!");
                        this.growLife = 5000;
            //         } else {
            //             this.messageService.showError("Operation Failed!");
            //         }
                    this.msgs = this.messageService.msgs;
            //         this.dataOnInit();
            //     })
        } else if (this.modifyFlag == "edit") {
            if (this.modifyAreaFlag == "Acqusition") {
                this.landAcqusitionData[this.selectedIndex] = data[0];
            } else if (this.modifyAreaFlag == "Other") {
                this.otherCostData[this.selectedIndex] = data[0];
            } else if (this.modifyAreaFlag == "Expense") {
                this.longTermExpenseData[this.selectedIndex] = data[0];
            }
            // 修改
            // if (this.selectedIndexDetailCode ==  this.allData.OtherInvestment.indexDetailsCode) {
            //     this.httpService.post('/bpd-proj/bpd/indexDetails/updateDetailsWeight', data)
            //         .subscribe(data => {
            //             if (data.code == "1") {
                            this.messageService.showSuccess("Operation Success!");
                            this.growLife = 5000;
            //             } else {
            //                 this.messageService.showError("Operation Failed!");
            //             }
                        this.msgs = this.messageService.msgs;
            //             this.dataOnInit();
            //         })
            // } else {
            //     this.httpService.post('/bpd-proj/bpd/indexDetails/update', data)
            //     .subscribe(data => {
            //         if (data.code == "1") {
            //             this.messageService.showSuccess("Operation Success!");
            //         } else {
            //             this.messageService.showError("Operation Failed!");
            //         }
            //         this.msgs = this.messageService.msgs;
            //         this.dataOnInit();
            //     })
            // }
        }
        this.modifyDialog = false;
    }

    /**
     * 更改数据取消
     * 
     * @memberof BuildingCostAndOthers
     */
    modifyEstateCancel() {
        this.modifyDialog = false;
    }

    /**
     * 删除Acqusition
     * 
     * @param {any} idx 
     * @param {any} data 
     * @memberof BuildingCostAndOthers
     */
    deleteAcqusitionClick(idx, data) {
        this.selectedIndexWeightCode = data.indexWeightCode;
        // this.modifyAreaFlag = "Acqusition";
        this.selectedData = data;
        // this.deleteDialog = true;
        this.deleteService.confirm(() => {
            let index = null;
            index = this.getIndex(this.landAcqusitionData);
            if (index != null) {
                this.landAcqusitionData.splice(index, 1);
            }
        })
    }

    /**
     * 删除Other
     * 
     * @param {any} idx 
     * @param {any} data 
     * @memberof BuildingCostAndOthers
     */
    deleteOtherClick(idx, data) {
        this.selectedIndexWeightCode = data.indexWeightCode;
        // this.modifyAreaFlag = "Other";
        this.selectedData = data;
        // this.deleteDialog = true;
        this.deleteService.confirm(() => {
            let index = null;
            index = this.getIndex(this.otherCostData);
            if (index != null) {
                this.otherCostData.splice(index, 1);
            }
        })
    }

    /**
     * 删除Expense
     * 
     * @param {any} idx 
     * @param {any} data 
     * @memberof BuildingCostAndOthers
     */
    deleteExpenseClick(idx, data) {
        this.selectedIndexWeightCode = data.indexWeightCode;
        // this.modifyAreaFlag = "Expense";
        this.selectedData = data;
        // this.deleteDialog = true;
        this.deleteService.confirm(() => {
            let index = null;
            index = this.getIndex(this.longTermExpenseData);
            if (index != null) {
                this.longTermExpenseData.splice(index, 1);
            }
        })
    }

    /**
     * 删除确认
     * 
     * @param {any} idx 
     * @param {any} data 
     * @memberof BuildingCostAndOthers
     */
    deleteEstateYes(idx, data) {
        if (this.modifyAreaFlag == "Acqusition") {
            this.landAcqusitionData.splice(this.selectedIndex, 1);
        } else if (this.modifyAreaFlag == "Other") {
            this.otherCostData.splice(this.selectedIndex, 1);
        } else if (this.modifyAreaFlag == "Expense") {
            this.longTermExpenseData.splice(this.selectedIndex, 1);
        }
        // this.httpService.get('/bpd-proj/bpd/indexDetails/deleteDetailsWeight?' + Number(new Date()) + '&indexWeightCode=' + this.selectedIndexWeightCode)
        //     .subscribe(data => {
        //         if (data.code == "1") {
                    this.messageService.showSuccess("Operation Success!");
                    this.growLife = 5000;
        //         } else {
        //             this.messageService.showError("Operation Failed!");
        //         }
                this.msgs = this.messageService.msgs;
        //         this.dataOnInit();
        //     })
        this.deleteDialog = false;
    }

    /**
     * 删除取消
     * 
     * @param {any} idx 
     * @param {any} data 
     * @memberof BuildingCostAndOthers
     */
    deleteEstateNo(idx, data) {
        this.deleteDialog = false;
    }

    private setEmptyPercentage() {
        this.inputPercentages = [];
        this.inputPercentages.push({
            occuredNo: this.getCurrentYear(),
            occuredPercentage: null,
            yearCount: 1
        })
    }

    private getCurrentYear(): number {
        return Number(new Date().getFullYear());
    }

    public dynamicInput(dynamic ,$event) {
        // console.log(111);
        this.setInput(dynamic);
        return this.inputRegex($event);
    }

    public setInput(dynamicFlag: Boolean = true, changeYear: Boolean = false) {
        if (dynamicFlag) {
            let holdingTime: any;
            let sum: number = 0;
            let nextYearCount: number;
            clearTimeout(holdingTime);
            // 删除多余行
            for (let i = 0; i < this.inputPercentages.length; i++) {
                let flag: Boolean = false;
                if (!!this.inputPercentages[i].occuredPercentage) {
                    sum += this.inputPercentages[i].occuredPercentage * this.inputPercentages[i].yearCount;
                }
                if (i > 1) {
                    if (this.inputPercentages[i].occuredPercentage == null && this.inputPercentages[i - 1].occuredPercentage == null) {
                        this.inputPercentages.splice(i, 1);
                    }
                }
            }
            // 校验和是否为100
            if (sum === 100) {
                this.addPercentageFlag = true;
            } else {
                this.addPercentageFlag = false;
            }
            // 增加新行
            holdingTime = setTimeout(() => {
                if (sum < 100 && (this.inputPercentages[this.inputPercentages.length - 1].occuredPercentage == 0 || !!this.inputPercentages[this.inputPercentages.length - 1].occuredPercentage)  && !!this.inputPercentages[this.inputPercentages.length - 1].occuredNo) {
                    console.log(sum);
                    this.inputPercentages.push({
                        occuredNo: this.inputPercentages[this.inputPercentages.length - 1].occuredNo + this.inputPercentages[this.inputPercentages.length - 1].yearCount,
                        occuredPercentage: null,
                        yearCount: 1
                    })
                }
                if (sum >= 100 && !this.inputPercentages[this.inputPercentages.length - 1].occuredPercentage) {
                    this.inputPercentages.splice(this.inputPercentages.length - 1, 1);
                }
            }, 1000);
            // 更改年份
            if (true) {
                this.inputPercentages[0].occuredNo = this.getCurrentYear();
                for (let i = 1; i < this.inputPercentages.length; i++) {
                    this.inputPercentages[i].occuredNo = this.inputPercentages[i - 1].occuredNo + this.inputPercentages[i - 1].yearCount;
                }
            }
        } else {
            this.addPercentageFlag = true;
        }
    }

    private getIndex(data: any[] = []): number {
        for (let i = 0; i < data.length; i++) {
            if (data[i] === this.selectedData) {
                return i;
            }
        }
        return null;
    }
}