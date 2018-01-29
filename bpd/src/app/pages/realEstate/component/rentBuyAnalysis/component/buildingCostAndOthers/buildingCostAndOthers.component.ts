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
import 'style-loader!./buildingCostAndOthers.scss';
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
    selector: 'building-cost-and-others',
    templateUrl: './buildingCostAndOthers.html',
})
export class BuildingCostAndOthers {

    // 页面表格数据
    public landAcqusitionData: any[];
    public buildingCostData: any[];
    public otherCostData: any[];
    public longTermExpenseData: any[];
    public govermentFinancialReturnData: any[] = [];
    public rentalData: any[] = [];
    // 页面弹框数据
    public modifyDialog: Boolean;
    private modifyFlag: string;
    private modifyAreaFlag: string;
    public deleteDialog: Boolean;
    private selectedIndexGroupCode: number;
    private selectedIndexDetailCode: number;
    private selectedIndexWeightCode: number | string;
    private selectedIndex: number;
    private selectedData: any[];
    // 页面双向绑定数据
    public allData: any = {};
    public msgs: Message[];
    public growLife: number = 5000;
    public dialogAcqusitionLandCost: number;
    public dialogAcqusitionInitialInvestment: number;
    public dialogAcqusitionPeriod: number;
    public dialogAcqusitionAcreage: number;
    public dialogAcqusitionAnnualDepreciation: number;
    public addAcqusitionFlag: Boolean = false;

    public dialogBuildingLandCost: number;
    public dialogBuildingInitialInvestment: number;
    public dialogBuildingAcreage: number;
    public dialogBuildingPeriod: number;
    public dialogBuildingAnnualDepreciation: number;
    public addBuildingFlag: Boolean = false;

    public dialogOtherLandCost: number;
    public dialogOtherInitialInvestment: number;
    public dialogOtherPeriod: number;
    public dialogOtherAnnualDepreciation: number;
    public addOtherFlag: Boolean = false;

    public dialogExpenseLandCost: number;
    public dialogExpenseInitialInvestment: number;
    public dialogExpenseAnnualDepreciation: number;
    public addExpenseFlag: Boolean = false;

    public dialogFinancialReturnLandCost: number;
    public addFinancialReturnFlag: Boolean = false;

    public dialogYearCount: number;
    public dialogOccuredNo: number;
    public dialogOccuredPercentage: number;
    public localStorageAuthority: Boolean;

    public dialogRentalRental: number;
    public dialogRentalInitialInvestment: number;

    public refreshTable: Boolean = true;
    // 动态按钮


    public inputPercentages: any[] = [];
    public addPercentageFlag: Boolean = false;
    private currentYear: number;
    public addDynamicFlag: Boolean;

    constructor(private httpService: HttpDataService, private messageService: MessageService, private dataManageService: DataManageService, private deleteService: DeleteComfirmService) {
        this.setEmptyPercentage();
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
            "indexGroupCode": "1"
        })
            .subscribe(data => {
                this.allData = data;
                let acquisitionSum, buildingSum, otherSum, expenseSum, finacialSum;
                acquisitionSum = buildingSum = otherSum = expenseSum = finacialSum = 0;
                if (!!data.LandAcquisitionCost) {
                    this.dialogAcqusitionLandCost = data.LandAcquisitionCost.landCost;
                    this.dialogAcqusitionInitialInvestment = data.LandAcquisitionCost.initialInvestment;
                    this.dialogAcqusitionPeriod = data.LandAcquisitionCost.period;
                    this.dialogAcqusitionAcreage = data.LandAcquisitionCost.acreage;
                    this.dialogAcqusitionAnnualDepreciation = data.LandAcquisitionCost.annualDepreciation;
                    if (data.LandAcquisitionCost.list) {
                        this.landAcqusitionData = data.LandAcquisitionCost.list;
                    } else {
                        this.landAcqusitionData = [];
                    }

                    this.dialogBuildingLandCost = data.BuildingCost.landCost;
                    this.dialogBuildingInitialInvestment = data.BuildingCost.initialInvestment;
                    this.dialogBuildingAcreage = data.BuildingCost.acreage;
                    this.dialogBuildingPeriod = data.BuildingCost.period;
                    this.dialogBuildingAnnualDepreciation = data.BuildingCost.annualDepreciation;
                    if (data.BuildingCost.list) {
                        this.buildingCostData = data.BuildingCost.list;
                    } else {
                        this.buildingCostData = [];
                    }

                    this.dialogOtherLandCost = data.OtherInvestment.landCost;
                    this.dialogOtherInitialInvestment = data.OtherInvestment.initialInvestment;
                    this.dialogOtherPeriod = data.OtherInvestment.period;
                    this.dialogOtherAnnualDepreciation = data.OtherInvestment.annualDepreciation;
                    if (data.OtherInvestment.list) {
                        this.otherCostData = data.OtherInvestment.list;
                    } else {
                        this.otherCostData = [];
                    }
                    
                    this.dialogExpenseLandCost = data.LongtermExpense.landCost;
                    this.dialogExpenseInitialInvestment = data.LongtermExpense.initialInvestment;
                    this.dialogExpenseAnnualDepreciation = data.LongtermExpense.annualDepreciation;
                    if (data.LongtermExpense.list) {
                        this.longTermExpenseData = data.LongtermExpense.list;
                    } else {
                        this.longTermExpenseData = [];
                    }

                    this.dialogFinancialReturnLandCost = data.governmentFinancialReturn.landCost;
                    if (data.governmentFinancialReturn.list) {
                        this.govermentFinancialReturnData = data.governmentFinancialReturn.list;
                    } else {
                        this.govermentFinancialReturnData = [];
                    }

                    this.dialogRentalRental = data.Rental.landCost;
                    this.dialogRentalInitialInvestment = data.Rental.initialInvestment;
                    if (data.Rental.list) {
                        this.rentalData = data.Rental.list;
                    } else {
                        this.rentalData = [];
                    }
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

    // inputDataChange() {

    // }
    // 数据动态计算
    calculationCost() {
        this.dialogAcqusitionInitialInvestment = Math.round(this.dialogAcqusitionLandCost * (1 + this.allData.LandTransactionCommission.rateValue / 100 + this.allData.DeedTax.rateValue / 100) * 100) / 100;
        this.dialogAcqusitionAnnualDepreciation = Math.round(this.dialogAcqusitionLandCost * (1 + this.allData.LandTransactionCommission.rateValue / 100 + this.allData.DeedTax.rateValue / 100) / this.dialogAcqusitionPeriod * 100) / 100;

        this.dialogBuildingInitialInvestment = Math.round(this.dialogBuildingLandCost * (1 + this.allData.StampDutyforRE.rateValue / 100) * 100) / 100;
        this.dialogBuildingAnnualDepreciation = Math.round(this.dialogBuildingLandCost * (1 + this.allData.StampDutyforRE.rateValue / 100) / this.dialogBuildingPeriod * 100) / 100;

        this.dialogOtherInitialInvestment = Math.round(this.dialogOtherLandCost * (1 + this.allData.StampDutyforEquip.rateValue / 100) * 100) / 100;
        this.dialogOtherAnnualDepreciation = Math.round(this.dialogOtherLandCost * (1 + this.allData.StampDutyforEquip.rateValue / 100) / this.dialogOtherPeriod * 100) / 100;

        this.dialogExpenseInitialInvestment = Math.round(this.dialogExpenseLandCost * (1 + this.allData.StampDutyforPCLEx.rateValue / 100) * 100) / 100;
        this.dialogExpenseAnnualDepreciation = Math.round(this.dialogExpenseLandCost * (1 + this.allData.StampDutyforPCLEx.rateValue / 100) * 100) / 100;

        this.dialogRentalInitialInvestment = Math.round(this.dialogRentalRental * (1 + this.allData.StampDutyforEquip.rateValue / 100) * 100) / 100;
    }

    /**
     * 权重数据修改
     * 
     * @memberof BuildingCostAndOthers
     */
    saveBuildingCostAndOthersClick() {
        let newData: any = {};
        newData.LandAcquisitionCost = {};
        newData.BuildingCost = {};
        newData.OtherInvestment = {};
        newData.LongtermExpense = {};
        newData.groupCodeVo = {};
        newData.Rental = {};
        newData.governmentFinancialReturn = {};
        newData.LandAcquisitionCost.landCost = this.dialogAcqusitionLandCost;
        newData.LandAcquisitionCost.initialInvestment = this.dialogAcqusitionInitialInvestment;
        newData.LandAcquisitionCost.period = this.dialogAcqusitionPeriod;
        newData.LandAcquisitionCost.acreage = this.dialogAcqusitionAcreage;
        newData.LandAcquisitionCost.annualDepreciation = this.dialogAcqusitionAnnualDepreciation;
        newData.LandAcquisitionCost.indexDetailsCode = this.allData.LandAcquisitionCost.indexDetailsCode;
        newData.LandAcquisitionCost.list = this.landAcqusitionData;

        newData.BuildingCost.landCost = this.dialogBuildingLandCost;
        newData.BuildingCost.acreage = this.dialogBuildingAcreage;
        newData.BuildingCost.period = this.dialogBuildingPeriod;
        newData.BuildingCost.initialInvestment = this.dialogBuildingInitialInvestment;
        newData.BuildingCost.annualDepreciation = this.dialogBuildingAnnualDepreciation;
        newData.BuildingCost.indexDetailsCode = this.allData.BuildingCost.indexDetailsCode;
        newData.BuildingCost.list = this.buildingCostData;

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

        newData.governmentFinancialReturn.landCost = this.dialogFinancialReturnLandCost;
        newData.governmentFinancialReturn.indexDetailsCode = this.allData.governmentFinancialReturn.indexDetailsCode;
        newData.governmentFinancialReturn.list = this.govermentFinancialReturnData;

        newData.Rental.landCost = this.dialogRentalRental;
        newData.Rental.initialInvestment = this.dialogRentalInitialInvestment;
        newData.Rental.indexDetailsCode = this.allData.Rental.indexDetailsCode;
        newData.Rental.list = this.rentalData;

        newData.groupCodeVo.indexGroupCode = "1";
        // 校验百分比
        let percentMessage: any[] = [];
        percentMessage = this.checkPercent();
        if (percentMessage.length != 0) {
            this.messageService.showInfo("The Percentage Of The " + percentMessage.join(",") + " Must Equal 100!");
            this.growLife = 300000;
            this.msgs = this.messageService.msgs;
            return;
        }
        // 校验重复年份
        let repeatlyYear: any[] = [];
        repeatlyYear = this.checkYear();
        if (repeatlyYear.length != 0) {
            this.messageService.showInfo("There Is Repeatly Year In " + repeatlyYear.join(",") + ".");
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
        this.selectedData = this.allData.LandAcquisitionCost.list;
        this.selectedIndexWeightCode = this.dataManageService.getUuId();
        this.dialogOccuredPercentage = null;
        if (this.landAcqusitionData.length != 0) {
            this.dialogOccuredNo = Number(this.landAcqusitionData[this.landAcqusitionData.length - 1].year) + 1;
        } else {
            this.dialogOccuredNo = Number(new Date().getFullYear());
        }
        this.dialogYearCount = 1;
        this.selectedIndexDetailCode = this.allData.LandAcquisitionCost.indexDetailsCode;
        this.selectedIndexGroupCode = this.allData.LandAcquisitionCost.indexGroupCode;
        this.modifyAreaFlag = "Acqusition";
        this.modifyDialog = true;
        this.addDynamicFlag = true;
        this.addPercentageFlag = false;
    }

    /**
     * 添加Building
     * 
     * @memberof BuildingCostAndOthers
     */
    addBuildingClick() {
        this.modifyFlag = "add";
        this.selectedIndexWeightCode = this.dataManageService.getUuId();
        this.selectedData = this.allData.BuildingCost.list;
        this.dialogOccuredPercentage = null;
        if (this.buildingCostData.length != 0) {
            this.dialogOccuredNo = Number(this.buildingCostData[this.buildingCostData.length - 1].year) + 1;
        } else {
            this.dialogOccuredNo = Number(new Date().getFullYear());
        }
        this.dialogYearCount = 1;
        this.selectedIndexDetailCode = this.allData.BuildingCost.indexDetailsCode;
        this.selectedIndexGroupCode = this.allData.BuildingCost.indexGroupCode;
        this.modifyAreaFlag = "Building";
        this.modifyDialog = true;
        this.addDynamicFlag = true;
        this.addPercentageFlag = false;
    }

    /**
     * 添加Other
     * 
     * @memberof BuildingCostAndOthers
     */
    addOtherClick() {
        this.modifyFlag = "add";
        this.selectedIndexWeightCode = this.dataManageService.getUuId();
        this.selectedData = this.allData.OtherInvestment.list;
        this.dialogOccuredPercentage = null;
        this.dialogYearCount = 1;
        if (this.otherCostData.length != 0) {
            this.dialogOccuredNo = Number(this.otherCostData[this.otherCostData.length - 1].year) + 1;
        } else {
            this.dialogOccuredNo = Number(new Date().getFullYear());
        }
        this.selectedIndexDetailCode = this.allData.OtherInvestment.indexDetailsCode;
        this.selectedIndexGroupCode = this.allData.OtherInvestment.indexGroupCode;
        this.modifyAreaFlag = "Other";
        this.modifyDialog = true;
        this.addDynamicFlag = true;
        this.addPercentageFlag = false;
    }

    /**
     * 添加Expense
     * 
     * @memberof BuildingCostAndOthers
     */
    addExpenseClick() {
        this.modifyFlag = "add";
        this.selectedIndexWeightCode = this.dataManageService.getUuId();
        if (this.longTermExpenseData.length != 0) {
            this.dialogOccuredNo = Number(this.allData.LongtermExpense.list[this.allData.LongtermExpense.list.length - 1].year) + 1;
        } else {
            this.dialogOccuredNo = Number(new Date().getFullYear());
        }
        this.selectedData = this.allData.LongtermExpense.list;
        this.dialogOccuredPercentage = null;
        this.dialogYearCount = 1;
        this.selectedIndexDetailCode = this.allData.LongtermExpense.indexDetailsCode;
        this.selectedIndexGroupCode = this.allData.LongtermExpense.indexGroupCode;
        this.modifyAreaFlag = "Expense";
        this.modifyDialog = true;
        this.addDynamicFlag = false;
        this.addPercentageFlag = false;
    }

    /**
     * 添加政府返还
     * 
     * @memberof BuildingCostAndOthers
     */
    addFinancialReturnClick() {
        this.modifyFlag = "add";
        this.selectedIndexWeightCode = this.dataManageService.getUuId();
        this.selectedData = this.allData.LongtermExpense.list;
        this.dialogOccuredPercentage = null;
        this.dialogYearCount = 1;
        if (this.govermentFinancialReturnData.length != 0) {
            this.dialogOccuredNo = Number(this.govermentFinancialReturnData[this.govermentFinancialReturnData.length - 1].year) + 1;
        } else {
            this.dialogOccuredNo = Number(new Date().getFullYear());
        }
        this.selectedIndexDetailCode = this.allData.governmentFinancialReturn.indexDetailsCode;
        this.selectedIndexGroupCode = this.allData.governmentFinancialReturn.indexGroupCode;
        this.modifyAreaFlag = "Return";
        this.modifyDialog = true;
        this.addDynamicFlag = true;
        this.addPercentageFlag = false;
    }

    /**
     * 添加Acqusition
     * 
     * @memberof BuildingCostAndOthers
     */
    addRentalClick() {
        this.modifyFlag = "add";
        this.selectedData = this.allData.LandAcquisitionCost.list;
        this.selectedIndexWeightCode = this.dataManageService.getUuId();
        this.dialogOccuredPercentage = null;
        if (this.landAcqusitionData.length != 0) {
            this.dialogOccuredNo = Number(this.landAcqusitionData[this.landAcqusitionData.length - 1].year) + 1;
        } else {
            this.dialogOccuredNo = Number(new Date().getFullYear());
        }
        this.dialogYearCount = 1;
        this.selectedIndexDetailCode = this.allData.Rental.indexDetailsCode;
        this.selectedIndexGroupCode = this.allData.Rental.indexGroupCode;
        this.modifyAreaFlag = "Rental";
        this.modifyDialog = true;
        this.addDynamicFlag = true;
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
        // if (dynamicFlag) {
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
        //                 occuredNo: this.getCurrentYear(),
        //                 occuredPercentage: stepData[i - 1].weightValue,
        //                 yearCount: reviewCount
        //             });
        //         } else if (i < stepData.length && stepData[i - 1].weightValue === stepData[i].weightValue && !!stepData[i].weightValue) {
        //             reviewCount++;
        //         } else {
        //             // debugger;;
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
        //     this.inputPercentages[0].occuredPercentage = data.weightValue;
        // }
        this.dialogOccuredNo = data.year;
        this.dialogOccuredPercentage = data.weightValue;
        this.selectedIndex = index;
        this.selectedData = data;
        this.selectedIndexDetailCode = data.indexDetailsCode;
        this.selectedIndexGroupCode = data.indexGroupCode;
        this.selectedIndexWeightCode = data.indexWeightCode;
        this.modifyFlag = "edit";
        this.modifyDialog = true;
        this.addPercentageFlag = true;
    }

    /**
     * 修改Acqusition
     * 
     * @param {any} idx 
     * @param {any} data 
     * @memberof BuildingCostAndOthers
     */
    editAcqusitionClick(idx, data) {
        this.dataReview(idx, data);
        this.addDynamicFlag = true;
        this.modifyAreaFlag = "Acqusition";
    }

    /**
     * 修改Builiding
     * 
     * @param {any} idx 
     * @param {any} data 
     * @memberof BuildingCostAndOthers
     */
    editBuildingClick(idx, data) {
        this.dataReview(idx, data);
        this.addDynamicFlag = true;
        this.modifyAreaFlag = "Building";
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
    }

    /**
     * 修改Expense
     * 
     * @param {any} idx 
     * @param {any} data 
     * @memberof BuildingCostAndOthers
     */
    editExpenseClick(idx, data) {
        this.dataReview(idx, data, false);
        this.modifyAreaFlag = "Expense";
        this.addDynamicFlag = false;
        if (data.weightValue) {
            this.addPercentageFlag = true;
        }
    }

    /**
     * 修改政府返还
     * 
     * @param {any} idx 
     * @param {any} data 
     * @memberof BuildingCostAndOthers
     */
    editFinancialReturnClick(idx, data) {
        this.dataReview(idx, data);
        this.modifyAreaFlag = "Return";
        this.addDynamicFlag = true;
    }

    /**
     * 修改Other
     * 
     * @param {any} idx 
     * @param {any} data 
     * @memberof BuildingCostAndOthers
     */
    editRentalClick(idx, data) {
        this.dataReview(idx, data);
        this.addDynamicFlag = true;
        this.modifyAreaFlag = "Rental";
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
        // for (let i  =  0; i < this.inputPercentages.length; i++) {
        // for (let j =  0; j < this.inputPercentages[i].yearCount; j++) {
        //         allPercent.push(this.inputPercentages[i].occuredPercentage);
        //         allYear.push(Number(this.inputPercentages[i].occuredNo) + j);
        //     }
        // }
        this.dialogYearCount = this.dialogYearCount ? this.dialogYearCount : 1;
        for (let i = 0; i < this.dialogYearCount; i++) {
            data.push({
                "indexDetailsCode": this.selectedIndexDetailCode,
                "indexGroupCode": this.selectedIndexGroupCode,
                "year": Number(this.dialogOccuredNo) + i,
                "weightValue": this.dialogOccuredPercentage || 0,
                "indexWeightCode": this.selectedIndexWeightCode
            }) 
        }
       if (this.modifyFlag == "add") {
            if (this.modifyAreaFlag == "Acqusition") {
                this.landAcqusitionData = this.landAcqusitionData.concat(data);
            } else if (this.modifyAreaFlag == "Building") {
                this.buildingCostData = this.buildingCostData.concat(data);
            } else if (this.modifyAreaFlag == "Other") {
                this.otherCostData = this.otherCostData.concat(data);
            } else if (this.modifyAreaFlag == "Expense") {
                this.longTermExpenseData = this.longTermExpenseData.concat(data);
            } else if (this.modifyAreaFlag == "Return") {
                this.govermentFinancialReturnData = this.govermentFinancialReturnData.concat(data);
            } else if (this.modifyAreaFlag == "Rental") {
                this.rentalData = this.rentalData.concat(data);
            }
            // 添加
            // this.httpService.post('/bpd-proj/bpd/indexDetails/insertDetailsWeight', data)
                // .subscribe(data => {
                    // if (data.code == "1") {
                        this.messageService.showSuccess("Operation Success!");
                        this.growLife = 5000;
                    // } else {
                        // this.messageService.showError("Operation Failed!");
                    // }
                    this.msgs = this.messageService.msgs;
                    // this.dataOnInit();
                // })
        } else if (this.modifyFlag == "edit") {
            let index: number = null;
            if (this.modifyAreaFlag == "Acqusition") {
                index = this.getIndex(this.landAcqusitionData);
                if (index != null) {
                    this.landAcqusitionData[index] = data[0];
                }
            } else if (this.modifyAreaFlag == "Building") {
                index = this.getIndex(this.buildingCostData);
                if (index != null) {
                    this.buildingCostData[index] = data[0];
                }
            } else if (this.modifyAreaFlag == "Other") {
                index = this.getIndex(this.otherCostData);
                if (index != null) {
                    this.otherCostData[index] = data[0];
                }
            } else if (this.modifyAreaFlag == "Expense") {
                index = this.getIndex(this.longTermExpenseData);
                if (index != null) {
                    this.longTermExpenseData[index] = data[0];
                }
            } else if (this.modifyAreaFlag == "Return") {
                index = this.getIndex(this.govermentFinancialReturnData);
                if (index != null) {
                    this.govermentFinancialReturnData[index] = data[0];
                }
            } else if (this.modifyAreaFlag == "Rental") {
                index = this.getIndex(this.rentalData);
                if (index != null) {
                    this.rentalData[index] = data[0];
                }
            }
            // 修改
            // if (this.selectedIndexDetailCode !==  this.allData.LongtermExpense.indexDetailsCode) {
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
        this.selectedIndexWeightCode = null;;
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
        this.selectedIndex = idx;
        this.selectedData = data;
        this.selectedIndexWeightCode = data.indexWeightCode;
        // this.modifyAreaFlag = "Acqusition";
        // this.deleteDialog = true;
        this.deleteService.confirm(() => {
            let index: number = null;
            index = this.getIndex(this.landAcqusitionData);
            if (index != null) {
                this.landAcqusitionData.splice(index, 1);
            }
        })
    }

    /**
     * 删除Building
     * 
     * @param {any} idx 
     * @param {any} data 
     * @memberof BuildingCostAndOthers
     */
    deleteBuildingClick(idx, data) {
        this.selectedIndex = idx;
        this.selectedData = data;
        this.selectedIndexWeightCode = data.indexWeightCode;
        // this.modifyAreaFlag = "Building";
        // this.deleteDialog = true;
        this.deleteService.confirm(() => {
            let index: number = null;
            index = this.getIndex(this.buildingCostData);
            if (index != null) {
                this.buildingCostData.splice(index, 1);
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
        this.selectedIndex = idx;
        this.selectedData = data;
        this.selectedIndexWeightCode = data.indexWeightCode;
        // this.modifyAreaFlag = "Other";
        // this.deleteDialog = true;
        this.deleteService.confirm(() => {
            let index: number = null;
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
        this.selectedIndex = idx;
        this.selectedData = data;
        this.selectedIndexWeightCode = data.indexWeightCode;
        // this.modifyAreaFlag = "Expense";
        // this.deleteDialog = true;
        this.deleteService.confirm(() => {
            let index: number = null;
            index = this.getIndex(this.longTermExpenseData);
            if (index != null) {
                this.longTermExpenseData.splice(index, 1);
            }
        })
    }

    /**
     * 删除Financial
     * 
     * @param {any} idx 
     * @param {any} data 
     * @memberof BuildingCostAndOthers
     */
    deleteFinancialReturnClick(idx, data) {
        this.selectedIndex = idx;
        this.selectedData = data;
        this.selectedIndexWeightCode = data.indexWeightCode;
        // this.modifyAreaFlag = "Return";
        // this.deleteDialog = true;
        this.deleteService.confirm(() => {
            let index: number = null;
            index = this.getIndex(this.govermentFinancialReturnData);
            if (index != null) {
                this.govermentFinancialReturnData.splice(index, 1);
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
    deleteRentalClick(idx, data) {
        this.selectedIndex = idx;
        this.selectedData = data;
        this.selectedIndexWeightCode = data.indexWeightCode;
        // this.modifyAreaFlag = "Rental";
        // this.deleteDialog = true;
        this.deleteService.confirm(() => {
            let index: number = null;
            index = this.getIndex(this.rentalData);
            if (index != null) {
                this.rentalData.splice(index, 1);
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
        let index: number = null;
        this.refreshTable = false;
        if (this.modifyAreaFlag == "Acqusition") {
            index = this.getIndex(this.landAcqusitionData);
            if (index != null) {
                this.landAcqusitionData.splice(index, 1);
            }
        } else if (this.modifyAreaFlag == "Building") {
            index = this.getIndex(this.buildingCostData);
            if (index != null) {
                this.buildingCostData.splice(index, 1);
            }
        } else if (this.modifyAreaFlag == "Other") {
            index = this.getIndex(this.otherCostData);
            if (index != null) {
                this.otherCostData.splice(index, 1);
            }
        } else if (this.modifyAreaFlag == "Expense") {
            index = this.getIndex(this.longTermExpenseData);
            if (index != null) {
                this.longTermExpenseData.splice(index, 1);
            }
        } else if (this.modifyAreaFlag == "Return") {
            index = this.getIndex(this.govermentFinancialReturnData);
            if (index != null) {
                this.govermentFinancialReturnData.splice(index, 1);
            }
        } else if (this.modifyAreaFlag == "Rental") {
            index = this.getIndex(this.rentalData);
            if (index != null) {
                this.rentalData.splice(index, 1);
            }
        } 


        // this.httpService.get('/bpd-proj/bpd/indexDetails/deleteDetailsWeight?' + Number(new Date()) + '&indexWeightCode=' + this.selectedIndexWeightCode)
        //     .subscribe(data => {
        //         if (data.code == "1") {
        //             this.messageService.showSuccess("Operation Success!");
        //         } else {
        //             this.messageService.showError("Operation Failed!");
        //         }
        //         this.msgs = this.messageService.msgs;
        //         this.dataOnInit();
        //     })


        this.refreshTable = true;
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

    private setEmptyPercentage(year: number = null) {
        this.inputPercentages = [];
        this.inputPercentages.push({
            occuredNo: year || this.getCurrentYear(),
            occuredPercentage: null,
            yearCount: 1
        })
    }

    private getCurrentYear(): number {
        return Number(new Date().getFullYear());
    }

    public dynamicInput(dynamic ,$event, regexFlag: Boolean = true) {
        // console.log(111);
        this.setInput(dynamic);
        if (regexFlag) {
            return this.inputRegex($event);
        } else {
            return $event;
        }
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
                if (sum < 100 &&  (this.inputPercentages[this.inputPercentages.length - 1].occuredPercentage == 0 || !!this.inputPercentages[this.inputPercentages.length - 1].occuredPercentage) && !!this.inputPercentages[this.inputPercentages.length - 1].occuredNo) {
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

    private checkPercent () {
        let percentMessage: any[] = [];
        let sum: number = 0;
        for (let i = 0; i < this.landAcqusitionData.length; i++) {
            sum += Number(this.landAcqusitionData[i].weightValue);
        }
        if (sum != 100) {
            percentMessage.push("Land Acqusition Cost");
        }

        sum = 0;
        for (let i = 0; i < this.buildingCostData.length; i++) {
            sum += Number(this.buildingCostData[i].weightValue);
        }
        if (sum != 100) {
            percentMessage.push("Building Cost");
        }
        sum = 0;
        for (let i = 0; i < this.otherCostData.length; i++) {
            sum += Number(this.otherCostData[i].weightValue);
        }
        if (sum != 100) {
            percentMessage.push("Other Cost");
        }
        // sum = 0;
        // for (let i = 0; i < this.longTermExpenseData.length; i++) {
        //     sum += Number(this.longTermExpenseData[i].weightValue);
        // }
        // if (sum != 100) {
        //     percentMessage.push("Long Term Expense");
        // }
        sum = 0;
        for (let i = 0; i < this.govermentFinancialReturnData.length; i++) {
            sum += Number(this.govermentFinancialReturnData[i].weightValue);
        }
        if (sum != 100) {
            percentMessage.push("Goverment Finacial Return");
        }

        return percentMessage;
    }

    private checkYear() {
        let yearMessage: any[] = [];
        let flag: Boolean = false;
        flag = this.isEcho(this.landAcqusitionData, "year");
        if (flag) {
            yearMessage.push("Land Acqusition Cost");
        }

        flag = false;
        flag = this.isEcho(this.buildingCostData, "year");
        if (flag) {
            yearMessage.push("Building Cost");
        }
        flag = false;
        flag = this.isEcho(this.otherCostData, "year");
        if (flag) {
            yearMessage.push("Other Cost");
        }
        // sum = 0;
        // for (let i = 0; i < this.longTermExpenseData.length; i++) {
        //     sum += Number(this.longTermExpenseData[i].weightValue);
        // }
        // if (sum != 100) {
        //     percentMessage.push("Long Term Expense");
        // }
        flag = false;
        flag = this.isEcho(this.govermentFinancialReturnData, "year");
        if (flag) {
            yearMessage.push("Goverment Finacial Return");
        }
        flag = false;
        flag = this.isEcho(this.rentalData, "year");
        if (flag) {
            yearMessage.push("Rental");
        }

        return yearMessage;       
    }

    private isEcho(arr: any[] = [], key: string = ""): Boolean {
        for (let i = 1; i < arr.length; i++) {
            for (let j = 0; j < i; j++) {
                if (arr[i][key] == arr[j][key]) {
                    return true;
                }
            }
        }
        return false;
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
