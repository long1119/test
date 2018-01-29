import {
    Component,
    OnInit,
    Input,
    OnChanges,
    SimpleChanges
} from '@angular/core';

import 'style-loader!./rateChange.scss';

import {
    SelectItem,
    Message
} from 'primeng/primeng';

import {
    HttpDataService
} from '../../../../../service/http.service';
import {
    DataManageService
} from '../../../../../service/dataManage.service';
import {
    MessageService
} from '../../../../../service/message.service';
import {
    DeleteComfirmService
} from '../../../../../service/deleteDialog.service';



@Component({
    selector: 'rate-change',
    templateUrl: './rateChange.html'
})

export class RateChange {
    rateChangeData: any[] = [];
    rateChangeEditableData: any[] = [];
    fxViewData: any[] = [];
    currencyData: any[] = [];
    categoryData: any[] = [];
    msgs: Message[];
    public growLife: number = 5000;
    selectedParameter: any[] = [];

    @Input() changeProjectId;
    @Input() changeSop: string;
    @Input() changeForcastInfo: string;

    private currentYear: number;
    starYearOption: SelectItem[] = [];
    yearListData: any[] = [2017];
    fxYearListData: number[];
    yearEditableListData: any[] = [2017];
    dialogStarYear: string;
    dialogYearCount: string;
    stepSelect: Boolean = false;
    addDialog: Boolean = false;
    deleteDialog: Boolean = false;
    fxDialog: Boolean = false;

    fxCurrencyDataArray: any[];
    rateDataArray: any[];

    confirmCheck: Boolean = true;
    stepOne: Boolean = false;
    selectMode: string;
    public localStorageAuthority: Boolean;

    constructor(private messageService: MessageService, private httpService: HttpDataService, private dataManageService: DataManageService, private deleteService: DeleteComfirmService) {
        // 年份下拉框内容
        this.currentYear = new Date().getFullYear();
        for (let i = this.currentYear - 5; i <= this.currentYear + 5; i++) {
            this.starYearOption.push({
                label: "" + i,
                value: "" + i
            })
        }
        // 基础数据默认设置
        for (let i = 0; i < 10; i++) {
            this.rateChangeData.push({ id: i });
            this.rateChangeEditableData.push({ id: i });
        }
    }

    ngOnInit() {

        this.localStorageAuthority = this.dataManageService.buttonAuthority("Maintain FX&cashflow");
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.changeProjectId) {
            // 查询fx表头
            this.httpService.post('/bpd-proj/bpd/exchangeYearRate/getYearRateList', {
                // "projectId": this.changeProjectId
                "exchangeRateId": "1"
            })
                .subscribe(data => {
                    this.fxYearListData = data.yearList;
                    this.changeForcastInfo = data.forcastInfo;
                })
            // 查询fx数据
            this.httpService.post('/bpd-proj/bpd/exchangeRateInfo/getMapByDate', {
                "exchangeRateId": "1"
                // "projectId": this.changeProjectId
            })
                .subscribe(data => {
                    this.fxViewData = data;
                })
            //获取年份动态表头
            this.httpService.post('/bpd-proj/bpd/projectAverageRateDetail/getYearCurrencyList', {
                "projectId": this.changeProjectId
            })
                .subscribe(data => {
                    this.yearListData = data;
                })
            // 年度费率展示
            this.httpService.post('/bpd-proj/bpd/projectAverageRateInfo/getMap', {
                "projectId": this.changeProjectId
            })
                .subscribe(data => {
                    this.rateChangeData = this.dataManageService.addEmptyTableData(data, 10);
                })
        }
    }

    // /**
    //  * 项目汇率列点击事件
    //  * 
    //  * @param {any} $event 
    //  * @memberof RateChange
    //  */
    // onRateChangeRowClick($event) {
    //     // 平均汇率展示
    //     this.httpService.post('/bpd-proj/bpd/projectAverageRateInfo/getVList', {
    //             "projectId": this.changeProjectId,
    //             "propertyGroupId": $event.data.propertyGroupId
    //         })
    //         .subscribe(data => {
    //             this.currencyData = data;
    //         })
    // }


    /**
     * 添加数据返回
     * 
     * @param {any} $event 
     * @memberof RateChange
     */
    editedDataRec($event) {
        // 截取多余空数据
        let checkData: any[] = [];
        this.confirmCheck = false;
        for (let i = 0; i < $event.length; i++) {
            if ($event[i].propertyGroupId) {
                checkData.push($event[i]);
            }
        }
        // 获取表格内用户输入的汇率
        let checkNumFlag: boolean = true;
        for (let i = 0; i < checkData.length; i++) {
            let checkNum: number = 0;
            for (let key in checkData[i]) {
                // 校验汇率总和是否等于100
                if (Number(key) && checkData[i][key]) {
                    checkNum += Number(checkData[i][key]);
                }
            }
            if (checkNum % 100 !== 0) {
                checkNumFlag = false;
            }
        }
        let rateDataArray: any[] = [];
        let rateData: any;
        if (!checkNumFlag) {
            this.confirmCheck = true;
        } else {
            this.confirmCheck = false;
            for (let i = 0; i < checkData.length; i++) {
                for (let key in checkData[i]) {
                    if (Number(key)) {
                        rateData = {}
                        rateData.projectId = checkData[i].projectId;
                        rateData.propertyGroupId = checkData[i].propertyGroupId;
                        rateData.rateYear = key;
                        if (checkData[i][key]) {
                            rateData.investmentWeight = checkData[i][key];
                        } else {
                            rateData.investmentWeight = 0;
                        }
                        rateDataArray.push(rateData);
                    }
                }
            }
        }

        let fxSum: number;
        let fxCurrencyData: any;
        let fxCurrencyDataArray: any[] = [];

        for (let i = 0; i < checkData.length; i++) {
            for (let j = 0; j < this.fxViewData.length; j++) {
                fxSum = 0;
                fxCurrencyData = {};
                for (let fxKey in this.fxViewData[j]) {
                    for (let checkKey in checkData[i]) {
                        if (checkKey == fxKey) {
                            fxSum += Number(checkData[i][checkKey]) * Number(this.fxViewData[j][fxKey]) / 100;

                        }
                    }
                }
                fxCurrencyData.projectId = checkData[i].projectId;
                fxCurrencyData.propertyGroupId = checkData[i].propertyGroupId;
                fxCurrencyData.currencyCode = this.fxViewData[j].currencyCode;
                fxCurrencyData.averageExchangeRate = fxSum;
                fxCurrencyDataArray.push(fxCurrencyData);
            }
        }
        this.fxCurrencyDataArray = fxCurrencyDataArray;
        this.rateDataArray = rateDataArray;
    }

    /**
     * add按钮事件
     * 
     * @memberof RateChange
     */
    addClick() {
        this.fxCurrencyDataArray = [];
        this.rateDataArray = [];
        this.selectedParameter = [];
        // 判断页面数据，如果存在数据则添加页面只读且回显
        if (this.rateChangeData[0].propertyGroupName) {
            this.dialogStarYear = this.yearListData[0] + "";
            let yearCountList: any[] = [];
            for (let i = 0; i < this.yearListData.length; i++) {
                if (Number(this.yearListData[i])) {
                    yearCountList.push(this.yearListData[i]);
                }
            }
            this.dialogYearCount = yearCountList[yearCountList.length - 1] - yearCountList[0] + 1 + "";
            // 查询投资属性
            this.httpService.post('/bpd-proj/bpd/investmentPropertyGroup/getList', {

            })
                .subscribe(data => {
                    this.categoryData = data;
                    // 选中项回显
                    for (let i = 0; i < this.rateChangeData.length; i++) {
                        for (let j = 0; j < data.length; j++) {
                            if (data[j].groupPropertyName && this.rateChangeData[i].propertyGroupName == data[j].groupPropertyName) {
                                this.selectedParameter.push(data[j]);
                            }
                        }
                    }
                })
            this.stepOne = true;
        } else {
            // 查询投资属性
            this.httpService.post('/bpd-proj/bpd/investmentPropertyGroup/getList', {})
                .subscribe(data => {
                    this.categoryData = data;
                })
            // 输入栏置空
            this.dialogYearCount = "";
            this.selectedParameter = [];
            this.dialogStarYear = this.currentYear + "";
            this.selectMode = "mutiple";
            this.stepOne = false;
        }
        this.stepSelect = false;
        this.addDialog = true;
    }

    nextStepClick() {
        if (!this.stepOne) {
            // 添加投资权重
            let projectAverageRateInfoInsert = [];
            for (let i = 0; i < this.selectedParameter.length; i++) {
                projectAverageRateInfoInsert.push({
                    "projectId": this.changeProjectId,
                    "propertyGroupId": this.selectedParameter[i].propertyGroupId,
                    "minYear": this.dialogStarYear,
                    "yearCount": this.dialogYearCount
                })
            }
            this.httpService.post('/bpd-proj/bpd/projectAverageRateInfo/insert', projectAverageRateInfoInsert)
                .subscribe(data => {
                    // //添加页面获取年份动态表头与投资属性group
                    // let insertListData: any[] = [];
                    // for (let i = 0; i < Number(this.dialogYearCount); i++) {
                    //     insertListData.push(Number(this.dialogStarYear) + i);
                    // }
                    // this.yearEditableListData = insertListData;
                    // let insertData: any[] = [];
                    // for (let i = 0; i < this.selectedParameter.length; i++) {
                    //     insertData.push({
                    //         "propertyGroupId": this.selectedParameter[i].propertyGroupId,
                    //         "propertyGroupName": this.selectedParameter[i].groupPropertyName
                    //     })
                    // }
                    // let dataLength = insertData.length
                    // for (let i = 0; i < 10 - dataLength; i++) {
                    //     insertData.push({
                    //         id: i
                    //     })
                    // }
                    // this.rateChangeEditableData = insertData;

                    if (data.code == 1) {
                        this.messageService.showSuccess("Operation Success!");
                        this.growLife = 5000;
                    } else {
                        this.messageService.showError("Operation Error!");
                        this.growLife = 5000;
                    }
                    this.msgs = this.messageService.msgs;


                    //获取年份动态表头
                    this.httpService.post('/bpd-proj/bpd/projectAverageRateDetail/getYearCurrencyList', {
                        "projectId": this.changeProjectId
                    })
                        .subscribe(data => {
                            this.yearListData = data;
                        })
                    let insertListData: any[] = [];
                    for (let i = 0; i < Number(this.dialogYearCount); i++) {
                        insertListData.push(Number(this.dialogStarYear) + i);
                    }
                    this.yearEditableListData = insertListData;
                    // 年度费率展示
                    this.httpService.post('/bpd-proj/bpd/projectAverageRateInfo/getMap', {
                        "projectId": this.changeProjectId
                    })
                        .subscribe(data => {
                            this.rateChangeEditableData = this.rateChangeData = this.dataManageService.addEmptyTableData(data, 10);
                        })
                });
        } else {
            let editData = [];
            for (let i = 0; i < this.yearListData.length; i++) {
                if (Number(this.yearListData[i])) {
                    editData.push(this.yearListData[i]);
                }
            }
            this.yearEditableListData = editData;
            this.rateChangeEditableData = this.rateChangeData;
        }


        this.stepOne = true;
        this.selectMode = "";
        this.stepSelect = true;
    }

    /**
     * 上一步按钮，展示投资属性group
     * 
     * @memberof RateChange
     */
    priorStepClick() {
        this.stepSelect = false;
    }

    fxClick() {
        this.fxDialog = true;
    }

    /**
     * 添加年度费率
     * 
     * @memberof RateChange
     */
    addSave() {
        this.httpService.post('/bpd-proj/bpd/projectAverageRateInfo/update', {
            "projectAverageRateInfoList": this.fxCurrencyDataArray,
            "projectAverageRateDetailList": this.rateDataArray
        })
            .subscribe(data => {
                if (data.code == 1) {
                    this.messageService.showSuccess("Operation Success!");
                    this.growLife = 5000;
                } else {
                    this.messageService.showError("Operation Error!");
                    this.growLife = 5000;
                }
                this.msgs = this.messageService.msgs;
                //获取年份动态表头
                this.httpService.post('/bpd-proj/bpd/projectAverageRateDetail/getYearCurrencyList', {
                    "projectId": this.changeProjectId
                })
                    .subscribe(data => {
                        this.yearListData = data;
                    })
                // 年度费率展示
                this.httpService.post('/bpd-proj/bpd/projectAverageRateInfo/getMap', {
                    "projectId": this.changeProjectId
                })
                    .subscribe(data => {
                        this.rateChangeEditableData = this.rateChangeData = this.dataManageService.addEmptyTableData(data, 10);
                    })
            })
        this.addDialog = false;
    }

    addCancle() {
        this.addDialog = false;
    }

    /**
     * 删除弹框弹出
     * 
     * @memberof RateChange
     */
    deleteClick() {
        // this.deleteDialog = true;
        this.deleteService.confirm(() => {
            this.httpService.get('/bpd-proj/bpd/projectAverageRateInfo/delete?' + Number(new Date()) + "&projectId=" + this.changeProjectId)
                .subscribe(data => {
                    if ("1" == data.code) { //操作成功
                        this.messageService.showSuccess('Operation succeeded!');
                        this.growLife = 5000;
                    } else { //操作失败
                        this.messageService.showError('Operation failed!');
                        this.growLife = 5000;
                    }
                    //获取操作信息
                    this.msgs = this.messageService.msgs;
                    //获取年份动态表头
                    this.httpService.post('/bpd-proj/bpd/projectAverageRateDetail/getYearCurrencyList', {
                        "projectId": this.changeProjectId
                    })
                        .subscribe(data => {
                            this.yearListData = data;
                        })
                    // 年度费率展示
                    this.httpService.post('/bpd-proj/bpd/projectAverageRateInfo/getMap', {
                        "projectId": this.changeProjectId
                    })
                        .subscribe(data => {
                            this.rateChangeData = this.dataManageService.addEmptyTableData(data, 10);
                        })
                })
        })
    }

    /**
     * 删除所有数据
     * 
     * @memberof RateChange
     */
    deleteYes() {
        this.httpService.get('/bpd-proj/bpd/projectAverageRateInfo/delete?' + Number(new Date()) + "&projectId=" + this.changeProjectId)
            .subscribe(data => {
                if ("1" == data.code) { //操作成功
                    this.messageService.showSuccess('Operation succeeded!');
                    this.growLife = 5000;
                } else { //操作失败
                    this.messageService.showError('Operation failed!');
                    this.growLife = 5000;
                }
                //获取操作信息
                this.msgs = this.messageService.msgs;
                //获取年份动态表头
                this.httpService.post('/bpd-proj/bpd/projectAverageRateDetail/getYearCurrencyList', {
                    "projectId": this.changeProjectId
                })
                    .subscribe(data => {
                        this.yearListData = data;
                    })
                // 年度费率展示
                this.httpService.post('/bpd-proj/bpd/projectAverageRateInfo/getMap', {
                    "projectId": this.changeProjectId
                })
                    .subscribe(data => {
                        this.rateChangeData = this.dataManageService.addEmptyTableData(data, 10);
                    })
            })
        this.deleteDialog = false;
    }

    /**
     * 删除取消
     * 
     * @memberof RateChange
     */
    deleteNo() {
        this.deleteDialog = false;
    }
}