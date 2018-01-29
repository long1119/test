import {
    Component,
    OnInit,
    OnChanges,
    Input,
    SimpleChanges
} from '@angular/core';

import 'style-loader!./scoreCardDetail.scss';

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
    selector: 'score-card-detail',
    templateUrl: './scoreCardDetail.html'
})

export class ScoreCardDetail {

    @Input()
    changeProjectCode: string;
    // 页面表格数据
    public scoreCardDetailData: any[];
    private scoreCardDetailUrl: string;
    public reportSummaryData: any[];
    private reportSummaryUrl: string;
    public scoreCardMetricsData: any[];
    private scoreCardMetricsUrl: string;
    private exportScoreCardMetricsUrl: string;
    public scoreCardItemData: any[];
    private scoreCardItemUrl: string;
    private scoreCardItemInsertUrl: string;
    private scoreCardItemDeleteUrl: string;
    private scoreCardItemSingleUrl: string;
    private scoreCardDropDownUrl: string;
    private scoreCardDetailEditUrl: string;
    private scoreCardDetailDeleteUrl: string;
    private updateInitialMetricsUrl: string;

    // 页面双向绑定数据
    public preStatusVersionOption: SelectItem[] = [];
    public selectedPreStatusVersion: string;
    public selectedPreStatusName: string;
    public urStatusVersionOption: SelectItem[] = [];
    public selectedUrStatusVersion: string;
    public selectedUrStatusName: string;
    public dialogConfirm: string;
    public dialogConfirmFlag: Boolean;
    public selectedValue: string;
    public dialogItem: string;
    public msgs: Message[];
    public growLife: number = 5000;

    // 页面弹框展示标识
    public showSubjectDialog: Boolean;
    public deleteDialog: Boolean;
    public addItemDialog: Boolean;
    private selectedIndex: number;
    private selectedPqrrMailStone: string;
    private deleteFlag: string;
    private selectedSendData: any;

    // 编辑summary report内容
    public authorizeRadio: string;
    public editSummaryReportStatusDialog: Boolean;
    public editSummaryReportMemoDialog: Boolean;
    private summaryReportFlag: Boolean;
    public dialogSummaryReportMemo: string;

    // 分页信息初始化
    private scoreCardDetailPaginatorTotal: number;
    private scoreCardDetailPaginatorPage: number;
    private scoreCardDetailPaginatorRow: number;
    public localStorageAuthority: Boolean = true;

    constructor(private dataManageService: DataManageService, private httpservice: HttpDataService, private messageService: MessageService, private deleteService: DeleteComfirmService) {
        //  请求路径初始化
        this.scoreCardDetailUrl = '/bpd-proj/bpd/programScorecard/getVList';
        this.scoreCardMetricsUrl = '/bpd-proj/bpd/scorecardReport/getVList';
        this.exportScoreCardMetricsUrl = '/bpd-proj/bpd/scorecardReport/exportExcel';
        this.scoreCardItemUrl = '/bpd-proj/bpd/actionPlan/getList';
        this.scoreCardItemInsertUrl = '/bpd-proj/bpd/actionPlan/insert';
        this.scoreCardItemDeleteUrl = '/bpd-proj/bpd/actionPlan/deleteById';
        this.scoreCardItemSingleUrl = '/bpd-proj/bpd/actionPlan/getById';
        this.reportSummaryUrl = '/bpd-proj/bpd/programScorecardStatus/getVProgramScorecardStatus';
        this.scoreCardDropDownUrl = '/bpd-proj/bpd/programScorecard/getList1';
        this.scoreCardDetailEditUrl = '/bpd-proj/bpd/programScorecard/update';
        this.scoreCardDetailDeleteUrl = '/bpd-proj/bpd/programScorecard/delete';
        this.updateInitialMetricsUrl = '/bpd-proj/bpd/scorecardReport/update';

        // 分页信息初始化
        this.scoreCardDetailPaginatorPage = 1;
        this.scoreCardDetailPaginatorRow = 10;
    }

    ngOnInit() {
        // this.localStorageAuthority = this.dataManageService.buttonAuthority("Maintain Scorecard Detail Report");

    }

    ngOnChanges(changes: SimpleChanges) {
        let data: any = {};
        if (this.changeProjectCode) {
            data = {
                "adProjectCode": this.changeProjectCode,
                "scorecardType": "1",
                "page": {
                    "page": this.scoreCardDetailPaginatorPage,
                    "rows": this.scoreCardDetailPaginatorRow
                }
            }
            this.httpservice.post(this.scoreCardDetailUrl, data)
                .subscribe(data => {
                    this.scoreCardDetailPaginatorTotal = data.total;
                    this.scoreCardDetailData = this.dataManageService.addEmptyPaginatorTableData(data, this.scoreCardDetailPaginatorRow);
                })
            let dropDownData = "?adProjectCode=" + this.changeProjectCode + "&type=1";
            this.httpservice.get(this.scoreCardDropDownUrl + dropDownData)
                .subscribe(data => {
                    this.urStatusVersionOption = [];
                    for (let i = 0; i < data.length; i++) {
                        this.urStatusVersionOption.push(data[i]);
                    }
                    this.preStatusVersionOption = data;
                    this.preStatusVersionOption.unshift({
                        label: "CSO",
                        value: "10219"
                    })
                    if (data.length != 0) {
                        this.selectedPreStatusVersion = data[0].value;
                        this.selectedPreStatusName = data[0].label;
                    }
                    if (data.length > 1) {
                        this.selectedUrStatusVersion = data[1].value;
                        let str = data[1].value.split(",")[0]
                        this.selectedUrStatusName = str.split("-")[0] + "-" + str.split("-")[1];
                    } else {
                        this.selectedUrStatusVersion = data[0].value;
                        let str = data[0].value.split(",")[0]
                        this.selectedUrStatusName = str.split("-")[0] + "-" + str.split("-")[1];
                    }
                })
        }
    }

    // private tableOnInit(url: string, sendData: any = {}, paginator: Boolean = false, callBack ? : any): any {
    //     let tableData: any[] = [];
    //     let tableTotal: number = null;
    //     let newdata: any;
    //     this.httpservice.post(url, sendData)
    //         .subscribe(data => {
    //             newdata = data;
    //         });
    //         console.log(newdata);
    //         return {
    //             tableData: tableData,
    //             tableTotal: tableTotal
    //         }
    // }

    /**
     * scoreCardDetial分页事件
     * 
     * @param {any} $event 
     * @memberof ScoreCardDetail
     */
    public scoreCardDetailPaginate($event) {
        this.scoreCardDetailPaginatorPage = $event.page + 1;
        this.scoreCardDetailPaginatorRow = $event.rows;
        let data = {
            "adProjectCode": this.changeProjectCode,
            "scorecardType": "1",
            "page": {
                "page": $event.page + 1,
                "rows": $event.rows
            }
        }
        this.httpservice.post(this.scoreCardDetailUrl, data)
            .subscribe(data => {
                this.scoreCardDetailPaginatorTotal = data.total;
                this.scoreCardDetailData = this.dataManageService.addEmptyPaginatorTableData(data, $event.rows);
            })
    }

    /**
     * 展示单挑数据
     * 
     * @param {any} idx 
     * @param {any} data 
     * @memberof ScoreCardDetail
     */
    public showSubjectClick(idx, data) {
        let dropDownData = "?adProjectCode=" + this.changeProjectCode + "&type=1";
        let sendData = this.selectedSendData = {
            "pqrrMilestone": data.pqrrMilestone,
            "adProjectCode": this.changeProjectCode,
            "valueOfMilestone1": this.selectedPreStatusVersion,
            "valueOfMilestone2": this.selectedUrStatusVersion,
        }
        this.httpservice.get(this.scoreCardDropDownUrl + dropDownData)
            .subscribe(data => {
                this.urStatusVersionOption = [];
                for (let i = 0; i < data.length; i++) {
                    this.urStatusVersionOption.push(data[i]);
                }
                this.preStatusVersionOption = data;
                this.preStatusVersionOption.unshift({
                    label: "CSO",
                    value: "10219"
                })
                sendData.valueOfMilestone1 = this.selectedPreStatusVersion = data[0].value;
                sendData.valueOfMilestone2 = this.selectedUrStatusVersion = data[1].value;
                this.selectedPreStatusName = data[0].label;
                if (data.length >= 1) {
                    let str = data[1].value.split(",")[0]
                    this.selectedUrStatusName = str.split("-")[0] + "-" + str.split("-")[1];
                }
                this.httpservice.post(this.reportSummaryUrl, sendData)
                    .subscribe(data => {
                        this.showSubjectDialog = true;
                        for (let i = 0; i < data.length; i++) {
                            if (!data[i].statusDesc) {
                                data[i].statusDesc = "-";
                            }
                        }
                        this.reportSummaryData = this.dataManageService.addEmptyTableData(data, 5);
                    })
            })
        this.selectedValue = data.riskAssume.toString();
        this.selectedPqrrMailStone = data.pqrrMilestone;
        this.selectedIndex = idx;
        this.dialogConfirm = "Next";
        this.dialogConfirmFlag = false;
    }

    /**
     * 删除单条subject数据
     * 
     * @param {any} idx 
     * @param {any} data 
     * @memberof ScoreCardDetail
     */
    public subjectDeleteClick(idx, data) {
        // this.deleteFlag = "subject";
        this.selectedIndex = idx;
        // this.deleteDialog = true;
        this.deleteService.confirm(() => {
            let data = {
                "adProjectCode": this.changeProjectCode,
                "scorecardType": "1",
                "page": {
                    "page": this.scoreCardDetailPaginatorPage,
                    "rows": this.scoreCardDetailPaginatorRow
                }
            }

            this.httpservice.get(this.scoreCardDetailDeleteUrl + '?' + Number(new Date()) + '&pqrrMilestone=' + this.selectedPqrrMailStone)
                .subscribe(data => {
                    if (data.code === "1") {
                        this.messageService.showSuccess("Operate Success!");
                        this.growLife = 5000;
                    } else {
                        this.messageService.showError("Operate Failed!");
                        this.growLife = 5000;
                    }
                    this.msgs = this.messageService.msgs;
                    this.httpservice.post(this.scoreCardDetailUrl, data)
                        .subscribe(data => {
                            this.scoreCardDetailPaginatorTotal = data.total;
                            this.scoreCardDetailData = this.dataManageService.addEmptyPaginatorTableData(data, this.scoreCardDetailPaginatorRow);
                        })
                })
        })
    }

    /**
     * 单选框选择事件
     * 
     * @memberof ScoreCardDetail
     */
    public onRadioClick() {
        console.log(this.selectedValue);
    }

    /**
     * subjuect弹框确认按钮点击事件
     * 
     * @memberof ScoreCardDetail
     */
    public dialogSave() {
        if (this.dialogConfirm === "Next") {
            this.dialogConfirm = "Previous";
            this.dialogConfirmFlag = true;
            let metricsData = {
                adProjectCode: this.changeProjectCode,
                elementId: this.selectedPqrrMailStone
            }
            this.httpservice.post(this.scoreCardMetricsUrl, metricsData)
                .subscribe(data => {
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].dataFlag == 1) {
                            data[i].dataFlag = "N/A";
                        } else if (data[i].dataFlag == 2) {
                            data[i].dataFlag = "High Is Better";
                        } else {
                            data[i].dataFlag = "Low Is Better";
                        }
                    }
                    this.scoreCardMetricsData = this.dataManageService.addEmptyTableData(data, 5);
                })
            this.httpservice.post(this.scoreCardItemUrl, this.selectedSendData)
                .subscribe(data => {
                    this.scoreCardItemData = this.dataManageService.addEmptyTableData(data, 5);
                })
        } else if (this.dialogConfirm === "Previous") {
            let sendData = this.selectedSendData = {
                "pqrrMilestone": this.selectedPqrrMailStone,
                "adProjectCode": this.changeProjectCode,
                "valueOfMilestone1": this.selectedPreStatusVersion,
                "valueOfMilestone2": this.selectedUrStatusVersion,
            }
            let dropDownData = "?adProjectCode=" + this.changeProjectCode + "&type=1";
            this.httpservice.post(this.reportSummaryUrl, sendData)
                .subscribe(data => {
                    for (let i = 0; i < data.length; i++) {
                        if (!data[i].statusDesc) {
                            data[i].statusDesc = "-";
                        }
                    }
                    this.reportSummaryData = this.dataManageService.addEmptyTableData(data, 5);
                })
            // this.httpservice.get(this.scoreCardDropDownUrl + dropDownData)
            //     .subscribe(data => {
            //         if (data.length != 0) {
            //             this.urStatusVersionOption = [];
            //             for (let i = 0; i < data.length; i++) {
            //                 this.urStatusVersionOption.push(data[i]);
            //             }
            //             this.preStatusVersionOption = data;
            //             this.preStatusVersionOption.unshift({
            //                 label: "CSO",
            //                 value: "10219"
            //             })
            //             this.selectedPreStatusVersion = data[0].value;
            //             this.selectedUrStatusVersion = data[1].value;
            //             this.selectedPreStatusName = data[0].value;
            //             this.selectedUrStatusName = data[1].value;
            //         }

            //     })

            this.dialogConfirm = "Next";
            this.dialogConfirmFlag = false;
        }
    }

    /**
     * 修改状态
     * 
     * @memberof ScoreCardDetail
     */
    public dialogConfirmSave() {
        let sendData = {
            'adProjectCode': this.changeProjectCode,
            'riskAssume': this.selectedValue,
            'pqrrMilestone': this.selectedPqrrMailStone
        }
        let sendDetailData = {
            "page": {
                "page": this.scoreCardDetailPaginatorPage,
                "rows": this.scoreCardDetailPaginatorRow
            },
            "scorecardType": "1",
            "adProjectCode": this.changeProjectCode
        }
        this.httpservice.post(this.scoreCardDetailEditUrl, sendData)
            .subscribe(data => {
                if (data.code == 1) {
                    this.messageService.showSuccess("Opearte Success!");
                    this.growLife = 5000;
                } else {
                    this.messageService.showError("Operate Failed!");
                    this.growLife = 5000;
                }
                this.msgs = this.messageService.msgs;
                this.httpservice.post(this.scoreCardDetailUrl, sendDetailData)
                    .subscribe(data => {
                        this.scoreCardDetailData = this.dataManageService.addEmptyPaginatorTableData(data, this.scoreCardDetailPaginatorRow);
                    })
            })
        this.showSubjectDialog = false;
    }

    /**
     * 修改状态取消
     * 
     * @memberof ScoreCardDetail
     */
    public dialogCancel() {

        this.showSubjectDialog = false;
    }

    /**
     * 搜索模糊查询
     * 
     * @memberof ScoreCardDetail
     */
    public lookSummaryClick() {
        let data = {
            "adProjectCode": this.changeProjectCode,
            "pqrrMilestone": this.selectedPqrrMailStone,
            "valueOfMilestone1": this.selectedPreStatusVersion,
            "valueOfMilestone2": this.selectedUrStatusVersion
        }
        this.httpservice.post(this.reportSummaryUrl, data)
            .subscribe(data => {
                for (let i = 0; i < this.urStatusVersionOption.length; i++) {
                    if (this.selectedUrStatusVersion === this.urStatusVersionOption[i].value) {
                        let str = this.urStatusVersionOption[i].value.split(",")[0]
                        this.selectedUrStatusName = str.split("-")[0] + "-" + str.split("-")[1];
                    }
                }
                for (let i = 0; i < this.preStatusVersionOption.length; i++) {
                    if (this.selectedPreStatusVersion === this.preStatusVersionOption[i].value) {
                        if (this.preStatusVersionOption[i].label === "CSO") {
                            this.selectedPreStatusName = this.preStatusVersionOption[i].label;
                        } else {
                            let str = this.preStatusVersionOption[i].value.split(",")[0]
                            this.selectedPreStatusName = str.split("-")[0] + "-" + str.split("-")[1];
                        }
                    }
                }
                for (let i = 0; i < data.length; i++) {
                    if (!data[i].statusDesc) {
                        data[i].statusDesc = "-";
                    }
                }
                this.reportSummaryData = this.dataManageService.addEmptyTableData(data, this.scoreCardDetailPaginatorRow);
            })
    }

    /**
     * 表格数据初始化
     * 
     * @memberof ScoreCardDetail
     */
    public initialMetricsClick() {
        let updateData = {
            adProjectCode: this.changeProjectCode,
            deleteFlag: 0
        }
        let metricsData = {
            adProjectCode: this.changeProjectCode,
            elementId: this.selectedPqrrMailStone
        }
        this.httpservice.post(this.updateInitialMetricsUrl, updateData)
            .subscribe(data => {
                this.httpservice.post(this.scoreCardMetricsUrl, metricsData)
                    .subscribe(data => {
                        for (let i = 0; i < data.length; i++) {
                            if (data[i].dataFlag == 1) {
                                data[i].dataFlag = "N/A";
                            } else if (data[i].dataFlag == 2) {
                                data[i].dataFlag = "High Is Better";
                            } else {
                                data[i].dataFlag = "Low Is Better";
                            }
                        }
                        this.scoreCardMetricsData = this.dataManageService.addEmptyTableData(data, 5);
                    })
            })
    }

    public exportInitialMetricsClick() {
        let metricsDataString: string = "adProjectCode=" + this.changeProjectCode + "&pqrrMilestone=" + this.selectedPqrrMailStone
        let token = window.sessionStorage.getItem("access_token");
        let url: string = this.exportScoreCardMetricsUrl + '?_=' + Number(new Date()) + '&' + metricsDataString;
        if (token) {
            let realToken = token.substr(1, token.length - 2)
            url = url + "&accessToken=" + realToken;
        }
        window.location.href = url;
    }

    public metricDeleteClick(idx, data) {
        let updateData = {
            adProjectCode: this.changeProjectCode,
            deleteFlag: 1,
            indexId: data.indexId,
            elementId: data.elementId
        }
        let metricsData = {
            adProjectCode: this.changeProjectCode,
            elementId: this.selectedPqrrMailStone
        }
        this.httpservice.post(this.updateInitialMetricsUrl, updateData)
            .subscribe(data => {
                this.httpservice.post(this.scoreCardMetricsUrl, metricsData)
                    .subscribe(data => {
                        for (let i = 0; i < data.length; i++) {
                            if (data[i].dataFlag == 1) {
                                data[i].dataFlag = "N/A";
                            } else if (data[i].dataFlag == 2) {
                                data[i].dataFlag = "High Is Better";
                            } else {
                                data[i].dataFlag = "Low Is Better";
                            }
                        }
                        this.scoreCardMetricsData = this.dataManageService.addEmptyTableData(data, 5);
                    })
            })
    }

    /**
     * scoreCardMetric表格添加
     * 
     * @memberof ScoreCardDetail
     */
    public addItemClick() {
        this.addItemDialog = true;
        this.dialogItem = "";
    }

    /**
     * 添加item
     * 
     * @memberof ScoreCardDetail
     */
    public itemAddSave() {
        let sendData: any = {
            "item": this.dialogItem,
            "pqrrMilestone": this.selectedPqrrMailStone,
            "adProjectCode": this.changeProjectCode
        };
        this.httpservice.post(this.scoreCardItemInsertUrl, sendData)
            .subscribe(data => {
                if (data.code == "1") {
                    this.messageService.showSuccess("Operate Success!");
                    this.growLife = 5000;
                } else {
                    this.messageService.showError("Operate Failed!");
                    this.growLife = 5000;
                }
                this.msgs = this.messageService.msgs;
                this.httpservice.post(this.scoreCardItemUrl, this.selectedSendData)
                    .subscribe(data => {
                        this.scoreCardItemData = this.dataManageService.addEmptyTableData(data, 5);
                    })
            })
        this.addItemDialog = false;
    }

    /**
     * 添加item取消
     * 
     * @memberof ScoreCardDetail
     */
    public itemAddCancel() {
        this.addItemDialog = false;
    }

    /**
     * item删除事件
     * 
     * @param {any} idx 
     * @param {any} data 
     * @memberof ScoreCardDetail
     */
    public deleteItemClick(idx, data) {
        // this.deleteFlag = "item";
        this.selectedIndex = idx;
        // this.deleteDialog = true;
        this.deleteService.confirm(() => {
            this.httpservice.get(this.scoreCardItemDeleteUrl + "?" + Number(new Date()) + "&decisionId=" + this.scoreCardItemData[this.selectedIndex].decisionId)
                .subscribe(data => {
                    if (data.code === "1") {
                        this.messageService.showSuccess("Operate Success!");
                        this.growLife = 5000;
                    } else {
                        this.messageService.showError("Operate Failed!");
                        this.growLife = 5000;
                    }
                    this.msgs = this.messageService.msgs;
                    this.httpservice.post(this.scoreCardItemUrl, this.selectedSendData)
                        .subscribe(data => {
                            this.scoreCardItemData = this.dataManageService.addEmptyTableData(data, 5);
                        })
                })
        })
    }

    /**
     * 删除确认
     * 
     * @memberof ScoreCardDetail
     */
    public deleteYes() {
        if (this.deleteFlag === "item") {
            this.httpservice.get(this.scoreCardItemDeleteUrl + "?" + Number(new Date()) + "&decisionId=" + this.scoreCardItemData[this.selectedIndex].decisionId)
                .subscribe(data => {
                    if (data.code === "1") {
                        this.messageService.showSuccess("Operate Success!");
                        this.growLife = 5000;
                    } else {
                        this.messageService.showError("Operate Failed!");
                        this.growLife = 5000;
                    }
                    this.msgs = this.messageService.msgs;
                    this.httpservice.post(this.scoreCardItemUrl, this.selectedSendData)
                        .subscribe(data => {
                            this.scoreCardItemData = this.dataManageService.addEmptyTableData(data, 5);
                        })
                })
        } else if (this.deleteFlag == 'subject') {
            let data = {
                "adProjectCode": this.changeProjectCode,
                "scorecardType": "1",
                "page": {
                    "page": this.scoreCardDetailPaginatorPage,
                    "rows": this.scoreCardDetailPaginatorRow
                }
            }

            this.httpservice.get(this.scoreCardDetailDeleteUrl + '?' + Number(new Date()) + '&pqrrMilestone=' + this.selectedPqrrMailStone)
                .subscribe(data => {
                    if (data.code === "1") {
                        this.messageService.showSuccess("Operate Success!");
                        this.growLife = 5000;
                    } else {
                        this.messageService.showError("Operate Failed!");
                        this.growLife = 5000;
                    }
                    this.msgs = this.messageService.msgs;
                    this.httpservice.post(this.scoreCardDetailUrl, data)
                        .subscribe(data => {
                            this.scoreCardDetailPaginatorTotal = data.total;
                            this.scoreCardDetailData = this.dataManageService.addEmptyPaginatorTableData(data, this.scoreCardDetailPaginatorRow);
                        })
                })
        }
        this.deleteDialog = false;
    }

    /**
     * 删除取消
     * 
     * @memberof ScoreCardDetail
     */
    public deleteNo() {
        this.deleteDialog = false;
    }

    /**
     * 编辑summary report状态
     * 
     * @param {any} data 
     * @memberof ScoreCardDetail
     */
    public editSummaryReportStatus(idx, data, flag) {
        if (data.freezedStatus == 2) {
            this.messageService.showInfo("The Version Is Freezed!");
            this.growLife = 300000;
            this.msgs = this.messageService.msgs;
            return false;
        }
        if (data.dataType == 2 || data.dataType == 4) {
            this.messageService.showInfo("You Can't Edit If The Type Is Number!");
            this.growLife = 300000;
            this.msgs = this.messageService.msgs;
            return false;
        }
        this.editSummaryReportStatusDialog = true;
        if (flag) {
            this.authorizeRadio = data.statusOfMilestone1;
        } else {
            this.authorizeRadio = data.statusOfMilestone2;
        }
        this.selectedIndex = idx;
        this.summaryReportFlag = flag;
    }

    public editSummaryReportStatusSave(data) {
        let sendData: any = {
            pqrrMilestone: this.selectedUrStatusVersion,
            adProjectCode: this.changeProjectCode,
            indexId: this.reportSummaryData[this.selectedIndex].indexId,
            colorStatus: this.authorizeRadio,
        }
        // if (!this.summaryReportFlag) {
        //     sendData[0].elementId = this.selectedUrStatusVersion;
        // }
        this.httpservice.post("/bpd-proj/bpd/programScorecardStatus/update", sendData)
            .subscribe(data => {
                if (data['code'] == 1) {
                    this.messageService.showSuccess("Operate Success!");
                    this.growLife = 5000;
                    this.editSummaryReportStatusDialog = false;
                    this.lookSummaryClick();
                } else {
                    this.messageService.showError(data['businessData']);
                    this.growLife = 300000;
                }
                this.msgs = this.messageService.msgs;
            })
    }

    /**
     * 编辑summary report描述
     * 
     * @param {any} data 
     * @memberof ScoreCardDetail
     */
    public editSummaryReportMemo(idx, data) {
        if (data.freezedStatus == 2) {
            this.messageService.showInfo("The Version Is Freezed!");
            this.growLife = 300000;
            this.msgs = this.messageService.msgs;
            return false;
        }
        this.selectedIndex = idx;
        this.editSummaryReportMemoDialog = true;
        if (data.statusDesc !== "-") {
            this.dialogSummaryReportMemo = data.statusDesc;
        } else {
            this.dialogSummaryReportMemo = "";
        }
    }

    public editSummaryReportMemoSave() {
        let sendData: any = {
            pqrrMilestone: this.selectedUrStatusVersion,
            adProjectCode: this.changeProjectCode,
            indexId: this.reportSummaryData[this.selectedIndex].indexId,
            statusDesc: this.dialogSummaryReportMemo,
        }
        this.httpservice.post("/bpd-proj/bpd/programScorecardStatus/update", sendData)
            .subscribe(data => {
                if (data['code'] == 1) {
                    this.messageService.showSuccess("Operate Success!");
                    this.growLife = 5000;
                    this.editSummaryReportMemoDialog = false;
                    this.lookSummaryClick();
                } else {
                    this.messageService.showError(data['businessData']);
                    this.growLife = 300000;
                }
                this.msgs = this.messageService.msgs;
            })
    }

    public exportSummaryReportClick() {
        let token = window.sessionStorage.getItem("access_token");
        let url: string = "/bpd-proj/bpd/programScorecardStatus/exportExcel?valueOfMilestone1=" + this.selectedPreStatusVersion + '&valueOfMilestone2=' + this.selectedUrStatusVersion + '&adProjectCode=' + this.changeProjectCode + '&' + Number(new Date());
        if (token) {
            let realToken = token.substr(1, token.length - 2)
            url = url + "&accessToken=" + realToken;
        }
        window.location.href = url;
    }

    public preStatusVersionChange($event) {
        // for (let i = 0; i < this.preStatusVersionOption.length; i++) {
        //     if ($event = this.preStatusVersionOption[i].value) {
        //         this.selectedPreStatusName = this.preStatusVersionOption[i].label;
        //     }
        // }
    }


    public urStatusVersionChange($event) {
        // for (let i = 0; i < this.urStatusVersionOption.length; i++) {
        //     if ($event = this.urStatusVersionOption[i].value) {
        //         this.selectedUrStatusName = this.urStatusVersionOption[i].label;
        //     }
        // }
    }
}