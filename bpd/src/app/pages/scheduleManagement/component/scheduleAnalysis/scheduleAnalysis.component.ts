import {
    Component,
    OnInit,
    OnChanges,
    Input,
    SimpleChanges
} from '@angular/core';

import 'style-loader!./scheduleAnalysis.scss';

import {
    DataManageService
} from '../../../service/dataManage.service';
import {
    HttpDataService
} from '../../../service/http.service';
import {
    MessageService
} from '../../../service/message.service';
import {
    DeleteComfirmService
} from '../../../service/deleteDialog.service';

import {
    SelectItem,
    Message
} from 'primeng/primeng';

@Component({
    selector: 'schedule-analysis',
    templateUrl: './scheduleAnalysis.html'
})

export class ScheduleAnalysis {
    // table Data
    public projectMultipleData: any[] = [];
    public projectSingleData: any[] = [];
    public selectedSingleProjectData: any[] = [];
    public selectedMultipleProjectData: any[] = [];
    public compareAnalysisData: any[] = [];
    public compareAnalysisDataList: any[] = [];
    public compareAnalysisDataListAll: any[] = [];
    public compareAnalysisDateWeekList: any[] = [];
    public elementData: any[] = [];
    public choosedGeneralityData: any[] = [];
    public customerElementData: any[] = [];
    public changeAdProjectCode: string = "";
    public compareData: any[] = [];
    public compareDataList: any[] = [];

    // Selection Data
    public classificationOption: SelectItem[] = [];
    public selectedClassification: string = "";
    public statusOption: SelectItem[] = [];
    public selectedStatus: string = "";
    public comparisionOption: SelectItem[] = [];
    public selectedComparision: string = "";
    public dialogFromElementName: string = "";
    public dialogMutipleProgramCode: string = "";
    public dialogMutipleProjectName: string = "";
    public dialogToElementName: string = "";
    public selectFromToElementFlag: string = "";
    public selectedFromToElement: any[];

    // dialog
    public projectComparisionDialog: Boolean = false;
    public deleteDialog: Boolean = false;
    public selectedIndex: number;
    public selectedData: any = {};
    public comparisionStep: string = "stepOne";
    public addElementDialog: Boolean = false;
    public comparisionNextStep: string = "Next";
    public selectElementDialog: Boolean = false;
    public msgs: Message[];
    public growLife: number = 5000;
    public dialogCompareElementCode: string = "";
    public dialogCompareElementName: string = "";
    public dialogSearchModelYear: string = "";
    public dialogSearchProjectCode: string = "";
    public stepTwoCodes: string;

    // paginator
    public projectPaginatorTotal: number;
    public projectPaginatorPage: number;
    public projectPaginatorRow: number;
    public projectPaginatorFirst: number;

    constructor(private httpService: HttpDataService, private messageService: MessageService, private dataManageService: DataManageService, private deleteService: DeleteComfirmService) {
        // dropdown data oninit
        this.statusOption = this.statusOption.concat([{
            label: "None",
            value: null
        },
        {
            label: "Freezed",
            value: "freezed"
        },
        {
            label: "Unfreezed",
            value: "unfreezed"
        },
        {
            label: "Closed",
            value: "closed"
        },
        {
            label: "Canceled",
            value: "canceled"
        },
        ])
        this.comparisionOption = this.comparisionOption.concat([{
            label: "Compare Generality",
            value: "generality"
        },
        {
            label: "Devaition Week",
            value: "week"
        }
        ])
        // projectpaginator oninit 
        this.projectPaginatorRow = 10;
        this.projectPaginatorPage = 1;
    }

    ngOnInit() {
        // dropDown Oninit 
        this.httpService.get('/bpd-proj/bpd/projectLevel/getProjectLevelNameCombobox?' + Number(new Date()) + "&projectType=100")
            .subscribe(data => {
                data.unshift({
                    label: "Please Choose",
                    value: null
                })
                this.classificationOption = data;
            })
        // projectData Oninit
            this.projectPaginate({firs:0, page: 0, rows:10});
    }


    /**
     * project paginator
     * 
     * @param {any} $event 
     * @memberof ScheduleAnalysis
     */
    public projectPaginate($event) {
        this.projectPaginatorPage = $event.page + 1;
        this.projectPaginatorRow = $event.rows;
        this.projectPaginatorFirst = $event.first;
        // projectData Oninit
        this.httpService.post('/bpd-proj/bpd/vehicleProject/getVList', {
            'classification': this.selectedClassification,
            'projectStatus': this.selectedStatus,
            "page": {
                "page": $event.page + 1,
                "rows": $event.rows
            },
            "modelYearFlag": "1",
            "modelYear": this.dialogSearchModelYear,
            "projectCode": this.dialogSearchProjectCode
        })
            .subscribe(data => {
                this.projectPaginatorTotal = data.total;
                this.projectSingleData = this.dataManageService.addEmptyPaginatorTableData(data, this.projectPaginatorRow);
            })
    }

    /**
     * dropDown Change
     * 
     * @param {any} $event 
     * @memberof ScheduleAnalysis
     */
    public dropDownChange($event) {
        // projectData Oninit
        this.projectPaginate({first: 0, page: 0, rows: 10})
    }

    /**
     * projectTable click
     * 
     * @param {any} $event 
     * @memberof ScheduleAnalysis
     */
    onProjectRowClick($event) {
        console.log($event);
        this.changeAdProjectCode = $event.data.adProjectCode;
    }

    /**
     * show project comparison dialog
     * 
     * @memberof ScheduleAnalysis
     */
    public projectComparisionClick() {
        this.dialogMutipleProgramCode = "";
        this.dialogMutipleProjectName = "";
        this.comparisionNextStep = "Next";
        this.comparisionStep = "stepOne";
        // multipleDataTable oninit
        this.httpService.post('/bpd-proj/bpd/masterTimeSheetDate/getNotAdProjectCode', {
            "modelYearFlag": "1"
        })
            .subscribe(data => {
                this.projectMultipleData = data;
            })
        this.selectedMultipleProjectData = [];
        this.projectComparisionDialog = true;
    }

    /**
     * comparision下拉框切换
     * 
     * @param {any} $event 
     * @memberof ScheduleAnalysis
     */
    comparisionDropDownChange($event) {
        this.dialogCompareElementCode = "";
        this.dialogCompareElementName = "";
        if (this.selectedComparision == 'generality') {
            //     let codes: any = [];
            //     for (let i = 0; i < this.selectedMultipleProjectData.length; i++) {
            //         codes.push(this.selectedMultipleProjectData[i].adProjectCode);
            //     }
            //     codes.join(',');
            //     this.httpService.get('/bpd-proj/bpd/masterTimeSheetDate/getDistinctVList?' + Number(new Date()) + '&adProjectCodes=' + codes)
            //         .subscribe(data => {
            //             this.elementData = this.dataManageService.addEmptyTableData(data, 10);
            //         })
        } else if (this.selectedComparision == "week") {

        }
    }

    public compareElementClickEnterSearch($event) {
        if ($event.code === "Enter") {
            this.searchCompareElementClick();
        }
    }

    public searchMutipleClick() {
        this.httpService.post('/bpd-proj/bpd/masterTimeSheetDate/getNotAdProjectCode', {
            "modelYearFlag": "1",
            "projectName": this.dialogMutipleProjectName,
            "programCode": this.dialogMutipleProgramCode
        })
            .subscribe(data => {
                this.projectMultipleData = data;
            })
        this.selectedMultipleProjectData = [];
    }

    public searchCompareElementClick() {
        this.httpService.get('/bpd-proj/bpd/masterTimeSheetDate/getDistinctVList?' + Number(new Date()) + '&adProjectCodes=' + this.stepTwoCodes + "&elementName=" + this.dialogCompareElementName + "&elementId=" + this.dialogCompareElementCode)
            .subscribe(data => {
                this.elementData = data;
            })
        this.customerElementData = [];
    }

    /**
     * next step
     * 
     * @memberof ScheduleAnalysis
     */
    public projectComparisionSave() {
        let names: any = [];
        let codes: any = [];
        if (this.comparisionStep == 'stepOne') {
            if (this.selectedMultipleProjectData.length == 0) {
                this.messageService.showInfo("Please Select Element");
                this.growLife = 300000;
                this.msgs = this.messageService.msgs;
                return false;
            }
            this.comparisionStep = 'stepTwo';
            this.choosedGeneralityData = [];
            this.selectedComparision = this.comparisionOption[0].value;
            for (let i = 0; i < this.selectedMultipleProjectData.length; i++) {
                codes.push(this.selectedMultipleProjectData[i].adProjectCode);
            }
            if (codes.length === 0) {
                codes.push(this.projectMultipleData[0].adProjectCode);
            }
            this.stepTwoCodes = codes = codes.join(',');
            // 获取element数据
            this.httpService.get('/bpd-proj/bpd/masterTimeSheetDate/getDistinctVList?' + Number(new Date()) + '&adProjectCodes=' + codes).subscribe(data => {
                this.elementData = data;
            })
            this.projectComparisionDialog = true;
        } else if (this.comparisionStep == 'stepTwo') {
            this.dialogCompareElementCode = "";
            this.dialogCompareElementName = "";
            if (this.selectedComparision == 'generality') {
                if (this.selectedMultipleProjectData.length === 0 || this.choosedGeneralityData.length === 0) {
                    this.messageService.showInfo("Please Select Element");
                    this.growLife = 300000;
                    this.msgs = this.messageService.msgs;
                    return false;
                }
                for (let i = 0; i < this.selectedMultipleProjectData.length; i++) {
                    codes.push(this.selectedMultipleProjectData[i].adProjectCode);
                }
                codes = codes.join(',');
                for (let i = 0; i < this.choosedGeneralityData.length; i++) {
                    names.push(this.choosedGeneralityData[i].elementName);
                }
                names = names.join(",");

                this.httpService.post('/bpd-proj/bpd/masterTimeSheetDate/getProjectComparisionHeardMap?', {
                    elementNames: names
                })
                    .subscribe(data => {
                        if (data.length != 0) {
                            this.compareAnalysisDataList = data;
                            this.compareAnalysisDataListAll = [];
                            this.compareAnalysisDateWeekList = [];
                            for (let i = 0; i < data.length; i++) {
                                this.compareAnalysisDataListAll.push(data[i] + " - Date");
                                this.compareAnalysisDataListAll.push(data[i] + " - Week");
                                this.compareAnalysisDateWeekList.push("Date");
                                this.compareAnalysisDateWeekList.push("Week");
                            }
                        } else {
                            this.compareAnalysisDataList = [];
                        }
                    })
                this.httpService.post('/bpd-proj/bpd/masterTimeSheetDate/projectComparision?', {
                    adProjectCodes: codes,
                    elementNames: names
                })
                    .subscribe(data => {
                        this.compareAnalysisData = data;
                    })
            } else if (this.selectedComparision == 'week') {
                if (this.customerElementData.length != 0) {
                    for (let i = 0; i < this.selectedMultipleProjectData.length; i++) {
                        codes.push(this.selectedMultipleProjectData[i].adProjectCode);
                    }
                    codes = codes.join(',');
                    this.httpService.post('/bpd-proj/bpd/masterTimeSheetDate/getWeekComparisionHeardMap', {
                        "listMap": this.customerElementData
                    })
                        .subscribe(data => {
                            this.compareDataList = data;
                        })
                    this.httpService.post('/bpd-proj/bpd/masterTimeSheetDate/weekComparision', {
                        "listMap": this.customerElementData,
                        "adProjectCodes": codes
                    })
                        .subscribe(data => {
                            this.compareData = data;
                        })
                } else {
                    this.messageService.showInfo("Please Add Element");
                    this.growLife = 300000;
                    this.msgs = this.messageService.msgs;
                    return false;
                }
            }
            this.comparisionNextStep = "Close";
            this.comparisionStep = 'stepThree';
        } else if (this.comparisionStep == 'stepThree') {
            this.projectComparisionDialog = false;
        }
    }

    /**
     * previousStep
     * 
     * @memberof ScheduleAnalysis
     */
    public projectComparisionPrevious() {
        if (this.comparisionStep == 'stepTwo') {
            this.comparisionStep = 'stepOne';
            // this.dialogMutipleProgramCode = "";
            // this.dialogMutipleProjectName = "";
        } else if (this.comparisionStep == 'stepThree') {
            this.comparisionStep = 'stepTwo';
            // this.dialogCompareElementCode = "";
            // this.dialogCompareElementName = "";
            this.comparisionNextStep = "Next";
        }
    }

    /**
     * cancel comparision
     * 
     * @memberof ScheduleAnalysis
     */
    public projectComparisionCancel() {
        this.projectComparisionDialog = false;
    }

    /**
     * choose element
     * 
     * @memberof ScheduleAnalysis
     */
    public addCustomerClick() {
        this.dialogFromElementName = "";
        this.dialogToElementName = "";
        this.addElementDialog = true;
    }

    /**
     * from to 选择 element 弹框展示
     * 
     * @memberof ScheduleAnalysis
     */
    public chooseFromElementClick() {
        this.selectedFromToElement = [];
        this.selectElementDialog = true;
        this.selectFromToElementFlag = "from";
    }
    public chooseToElementClick() {
        this.selectedFromToElement = [];
        this.selectElementDialog = true;
        this.selectFromToElementFlag = "to";
    }

    /**
     * from to element 行点击事件
     * 
     * @param {any} $event 
     * @memberof ScheduleAnalysis
     */
    public onSelectFromToElementRowClick($event) {
        if (this.selectFromToElementFlag == "from") {
            this.dialogFromElementName = $event.data.elementName;
        } else if (this.selectFromToElementFlag == "to") {
            this.dialogToElementName = $event.data.elementName;
        }
    }

    /**
     * 选择 from to element 确认
     * 
     * @memberof ScheduleAnalysis
     */
    public selectElementSave() {
        this.selectElementDialog = false;
    }

    /**
     * 删除已选中的 from to element
     * 
     * @param {any} idx 
     * @param {any} data 
     * @memberof ScheduleAnalysis
     */
    deleteCustomerClick(idx, data) {
        this.selectedData = data;
        // this.deleteDialog = true;
        this.deleteService.confirm(() => {
            this.deleteYes();
        })
    }

    deleteYes() {
        let index = null;
        index = this.getIndex(this.customerElementData);
        if (index != null) {
            this.customerElementData.splice(index, 1);
        }
        this.deleteDialog = false;
    }

    deleteNo() {
        this.deleteDialog = false;
    }

    /**
     * 添加 from to element 确认
     * 
     * @memberof ScheduleAnalysis
     */
    public addCustomerSave() {
        let fromToElementData: any = {};
        fromToElementData.fromElementName = this.dialogFromElementName;
        fromToElementData.toElementName = this.dialogToElementName;
        // for (let i = 0; i < this.elementData.length; i++) {
        //     if (this.dialogFromElementName == this.elementData[i].elementName) {
        //         fromToElementData.fromElmenetId = this.elementData[i].elementId;
        //     }
        //     if (this.dialogToElementName == this.elementData[i].elementName) {
        //         fromToElementData.toElementId = this.elementData[i].elementId;
        //     }
        // }
        this.customerElementData.push(fromToElementData);
        this.addElementDialog = false;
    }

    /**
     * 添加 from to element 取消
     * 
     * @memberof ScheduleAnalysis
     */
    public addCustomerCancel() {
        this.addElementDialog = false;
    }

    /**
     * 导出
     * 
     * @memberof ScheduleAnalysis
     */
    public exportGeneralityData() {
        let codes: any = [];
        let names: any = [];
        for (let i = 0; i < this.selectedMultipleProjectData.length; i++) {
            codes.push(this.selectedMultipleProjectData[i].adProjectCode);
        }
        codes = codes.join(',');
        for (let i = 0; i < this.choosedGeneralityData.length; i++) {
            names.push(this.choosedGeneralityData[i].elementName);
        }
        names = names.join(",");
        this.httpService.post('/bpd-proj/bpd/masterTimeSheetDate/projectComparisionSession', {
            adProjectCodes: codes,
            elementNames: names
        })
            .subscribe(data => {
                let token = window.sessionStorage.getItem("access_token");
                // adProjectCodes=" + codes + "&elementNames=" + names + '&
                let url: string = "/bpd-proj/bpd/masterTimeSheetDate/exportProjectComparision?sessionKey=" + data + "&_=" + Number(new Date());
                if (token) {
                    let realToken = token.substr(1, token.length - 2)
                    url = url + "&accessToken=" + realToken;
                }
                window.location.href = url;
            })
    }

    public exportWeekData() {
        let codes: any = [];
        for (let i = 0; i < this.selectedMultipleProjectData.length; i++) {
            codes.push(this.selectedMultipleProjectData[i].adProjectCode);
        }
        codes = codes.join(',');
        let str: string = "";
        for (let i = 0, a = this.customerElementData; i < a.length; i++) {
            str += "fromElementName:" + a[i].fromElementName + ";" + "toElementName:" + a[i].toElementName + "@"
        }
        str = str.substr(0, str.length - 1);
        // let str =  JSON.stringify(this.customerElementData).substr(1, JSON.stringify(this.customerElementData).length - 2)
        this.httpService.post('/bpd-proj/bpd/masterTimeSheetDate/weekSession', {
            adProjectCodes: codes,
            listMap: this.customerElementData
        })
            .subscribe(data => {
                let token = window.sessionStorage.getItem("access_token");
                // adProjectCodes=" + codes + "&listMap=" + str + '&
                let url: string = "/bpd-proj/bpd/masterTimeSheetDate/exportWeekComparision?sessionKey=" + data + "&_=" + Number(new Date());
                if (token) {
                    let realToken = token.substr(1, token.length - 2)
                    url = url + "&accessToken=" + realToken;
                }
                window.location.href = url;
            })
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