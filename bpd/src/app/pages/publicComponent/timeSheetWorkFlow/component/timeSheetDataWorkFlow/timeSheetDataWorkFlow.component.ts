import {
    Component,
    OnInit,
    Output,
    EventEmitter,
    Input,
    OnChanges,
    SimpleChanges
} from '@angular/core';

import {
    SelectItem,
    Message
} from 'primeng/primeng';

import "style-loader!./timeSheetDataWorkFlow.scss";

import {
    HttpDataService
} from '../../../../service/http.service';
import {
    DataManageService
} from '../../../../service/dataManage.service';
import {
    MessageService
} from '../../../../service/message.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: "time-sheet-data-work-flow",
    templateUrl: "./timeSheetDataWorkFlow.html"
    // styleUrls: [
    //     './timeSheetDataWorkFlow.scss'
    // ]
})

export class TimeSheetDataWorkFlow {

    @Input() auditForm: any;
    public timePaginatorPage: number;
    public timePaginatorRow: number;
    public timeSheetTotal: number;
    public timeSheetData: any[] = [];
    public addDisable: Boolean = false;

    public modifyDialog: Boolean;
    private modifyFlag: string;
    public deleteDialog: Boolean;
    private selectedIndex: number;
    private adjuestDialog: Boolean;

    public managerName: string;

    public isSorpOrNot: Boolean;
    public dialogElementName: string;
    public selectPlanDate: Date;
    public dialogElementId: string;
    public msgs: Message[];
    public growLife: number = 5000;
    public yearRange: string;

    private dialogPlantDate: number;
    private selectAdjustmentPlanDate: Date;
    private diaologDisabledPlanDate: string;
    private dialogCurrentElement: string;
    private selectedAdjustType: string;
    private adjustTypeOption: SelectItem[] = [];

    private selectedTimingItemId: string;
    private selectedElementName: string;
    private previewDialog: Boolean = false;
    private specialURL: any;    //new add
    public addType: string = "";
    public modifyFlagOption: SelectItem[] = [];
    public elementPaginatorPage: number = 1;
    public elementPaginatorRow: number = 10;
    public elementPaginatorTotal: number = 0;
    public chooseGvdpDetailDialog: boolean = false;
    public GraphicData: any[] = [];
    public dialogElementNameForSearch: string = "";
    public dialogElementIdForSearch: string = "";
    public elementPaginatorFirst: number = 0; 
    constructor(private httpService: HttpDataService, private dataManageService: DataManageService, private messageService: MessageService, private sanitizer: DomSanitizer) {
        this.timePaginatorPage = 1;
        this.timePaginatorRow = 10;
        // 日期年份设置
        let currentYear = new Date().getFullYear();
        this.yearRange = "" + (Number(currentYear) - 10) + ":" + (Number(currentYear) + 50);
        // 初始化多选列表
        this.adjustTypeOption.push({
            label: "this element and follow-up",
            value: "1"
        });
        this.adjustTypeOption.push({
            label: "this element and previous",
            value: "0"
        });
        // this.adjustTypeOption.push({
        //     label: "this element only",
        //     value: "2"
        // })
        this.modifyFlagOption.push({
            label: "Undefined",
            value: "costum"
        });
        this.modifyFlagOption.push({
            label: "Defined",
            value: "check"
        });
        this.selectedAdjustType = this.adjustTypeOption[0].value;
    }

    ngOnInit() {
        this.managerName = window.localStorage.getItem("user");
    }

    ngOnChanges(changes: SimpleChanges) {
        this.tableOnInit();
    }

    private tableOnInit() {
        let auditForm = this.auditForm;
        let sanitizer = this.sanitizer;
        this.httpService.post('/bpd-proj/bpd/masterTimeSheetDate/getVList', {
            "timingId": this.auditForm.businessId,
            // "page": {
            //     "page": this.timePaginatorPage,
            //     "rows": this.timePaginatorRow
            // }
        })
            .subscribe(data => {
                if (data.length != 0) {
                    if (this.managerName == data[0].projManager) {
                        this.addDisable = true;
                    }
                    this.specialURL = sanitizer.bypassSecurityTrustResourceUrl("assets/drawTimeSheet/svg.html?" + Number(new Date()) + "&adProjectCode=" + data[0].adProjectCode +
                        "&timingId=" + auditForm.businessId);
                    this.timeSheetData = this.dataManageService.addEmptyTableData(data, this.timePaginatorRow);
                }
                // this.timeSheetTotal = data.total;
            })
    }

    //    public timeSheetPaginate($event) {
    //     this.timePaginatorPage = $event.page + 1;
    //     this.timePaginatorRow = $event.rows;
    //     this.httpService.post('/bpd-proj/bpd/masterTimeSheetDate/getVList', {
    //                     "timingId": this.auditForm.businessId,
    //                     "page": {
    //                         "page": $event.page + 1,
    //                         "rows": $event.rows
    //                     }
    //                 })
    //                 .subscribe(data => {
    //                     this.timeSheetTotal = data.total;
    //                     this.timeSheetData = this.dataManageService.addEmptyPaginatorTableData(data, this.timePaginatorPage);
    //                 })
    //    }

    /**
     * 表格列点击事件
     * 
     * @param {any} $event 
     * @memberof TimeSheetData
     */
    onTimeSheetRowClick($event) {
        this.diaologDisabledPlanDate = $event.data.planDate;
        this.selectedTimingItemId = $event.data.timingItemId;
        this.selectedElementName = $event.data.elementName;
    }

    toggleAddType($event) {
        if ($event.value === "custom") {
            this.addType = "custom"
            this.httpService.get('/bpd-proj/bpd/masterTimeSheetDate/createElementId')
                .subscribe(data => {
                    this.dialogElementId = data;
                })
        } else {
            this.addType = "check";
            this.dialogElementId = "";
        }
    }

    public addTimeSheetClick() {
        this.httpService.get('/bpd-proj/bpd/masterTimeSheetDate/createElementId')
            .subscribe(data => {
                this.dialogElementId = data;
            })
        this.dialogElementName = "";
        this.selectPlanDate = new Date();
        this.modifyFlag = "add";
        this.modifyDialog = true;
    }

    public editTimeSheetClick(idx, data) {
        this.selectedIndex = idx;
        this.dialogElementName = data.elementName;
        this.dialogElementId = data.elementId;
        if (data.planDate) {
            let planDate: any = data.planDate.split("-");
            let planDateYear = planDate[0].toString();
            let planDateMonth: any = (Number(planDate[1]) - 1).toString();
            let planDateDate = planDate[2].toString();
            this.selectPlanDate = new Date(planDateYear, planDateMonth, planDateDate);
        }
        if (data.elementName.toUpperCase() === "SORP") {
            this.isSorpOrNot = true;
        } else {
            this.isSorpOrNot = false;
        }
        this.modifyFlag = "edit";
        this.modifyDialog = true;
    }

    public modifySave() {
        let auditForm = this.auditForm;
        let planDay = this.selectPlanDate.getDate();
        let planYear = this.selectPlanDate.getFullYear();
        let planMonth = Number(this.selectPlanDate.getMonth()) + 1;
        let selectPlanDate = planYear + '-' + planMonth + '-' + planDay;
        if (this.modifyFlag === "add") {
            this.httpService.post('/bpd-proj/bpd/masterTimeSheetDate/insert', {
                "elementId": this.dialogElementId,
                "elementName": this.dialogElementName,
                "planDate": selectPlanDate,
                "timingId": this.auditForm.businessId
                // "adProjectCode": this.changeAdProjectCode,
                // "timingItemId": this.timeSheetData[this.selectedIndex].timingItemId
            })
                .subscribe(data => {
                    // 弹出提示
                    if (data.code == 1) {
                        this.messageService.showSuccess("Operation Success!");
                        this.growLife = 5000;
                    } else if (data.code == 2) {
                        this.messageService.showInfo("Element Id Exists!");
                        this.growLife = 300000;
                    } else if (data.code == 3) {
                        this.messageService.showInfo("Element Name Can't Be SORP!");
                        this.growLife = 300000;
                    } else if (data.code == 7) {
                        this.messageService.showInfo("You Should Set The Time Of SOPR First!");
                        this.growLife = 300000;
                    } else {
                        this.messageService.showError("Operation Error!");
                        this.growLife = 5000;
                    }
                    this.msgs = this.messageService.msgs;
                    // 初始化timesheet 表格数据
                    this.tableOnInit();
                })
        } else if (this.modifyFlag === "edit") {
            this.httpService.post('/bpd-proj/bpd/masterTimeSheetDate/update', {
                "elementId": this.dialogElementId,
                "elementName": this.dialogElementName,
                "planDate": selectPlanDate,
                "timingId": this.auditForm.businessId,
                // "adProjectCode": this.changeAdProjectCode,
                "timingItemId": this.timeSheetData[this.selectedIndex].timingItemId
            })
                .subscribe(data => {
                    // 弹出提示
                    if (data.code == 1) {
                        this.messageService.showSuccess("Operation Success!");
                        this.growLife = 5000;
                    } else if (data.code == 2) {
                        this.messageService.showInfo("Element Id Exists!");
                        this.growLife = 300000;
                    } else if (data.code == 3) {
                        this.messageService.showInfo("Element Name Can't Be SORP!");
                        this.growLife = 300000;
                    } else if (data.code == 7) {
                        this.messageService.showInfo("You Should Set The Time Of SOPR First!");
                        this.growLife = 300000;
                    } else {
                        this.messageService.showError("Operation Error!");
                        this.growLife = 5000;
                    }
                    this.msgs = this.messageService.msgs;
                    // 初始化timesheet 表格数据
                    this.tableOnInit();
                })
        }
        this.modifyDialog = false;
    }

    public modifyCancel() {
        this.modifyDialog = false;
    }

    /**
     * 批量修改页面显示
     * 
     * @memberof TimeSheetData
     */
    private batchAdjustClick() {
        this.dialogCurrentElement = this.selectedElementName;
        this.selectAdjustmentPlanDate = new Date();
        this.onDateSelect(new Date());
        this.dialogPlantDate -= 1;
        this.adjuestDialog = true;
    }

    /**
     * 日期更改事件
     * 
     * @param {any} $event 
     * @memberof TimeSheetData
     */
    private onDateSelect($event) {
        if (this.diaologDisabledPlanDate) {
            let planDate: any[] = this.diaologDisabledPlanDate.split("-");
            let year: number = Number(planDate[0]);
            let month: number = Number(planDate[1]);
            let day: number = Number(planDate[2]);
            this.dialogPlantDate = Math.round((Number($event.getTime()) - (Number(new Date(year, month - 1, day).getTime()))) / 1000 / 24 / 3600);
        }
    }

    /**
     * 批量修改确认
     * 
     * @memberof TimeSheetData
     */
    private batchAdjustSave() {
        this.adjuestDialog = false;
        let timingItemIds: any = [];
        let selectedIndex: number;
        // 处理表格数据删除多余空数据
        let timeData: any = [];
        for (let i = 0; i < this.timeSheetData.length; i++) {
            if (this.timeSheetData[i].timingItemId) {
                timeData.push(this.timeSheetData[i]);
            }
        }
        // 获取批量修改的 ItemId
        // for (let i = 0; i < this.timeSheetData.length; i++) {
        //     if (this.selectedTimingItemId == this.timeSheetData[i].timingItemId) {
        //         selectedIndex = i;
        //         break;
        //     }
        // }
        // if (this.selectedAdjustType == "2") {
        //     timingItemIds = this.selectedTimingItemId;
        // } else if (this.selectedAdjustType == "1") {
        //     for (let i = selectedIndex; i >= 0; i--) {
        //         timingItemIds.push(this.timeSheetData[i].timingItemId);
        //     }
        //     timingItemIds = timingItemIds.join(",");
        // } else if (this.selectedAdjustType == "0") {
        //     for (let i = selectedIndex; i < timeData.length; i++) {
        //         timingItemIds.push(timeData[i].timingItemId);
        //     }
        //     timingItemIds = timingItemIds.join(",");
        // }
        // 日期格式处理
        let planDay = this.selectAdjustmentPlanDate.getDate();
        let planYear = this.selectAdjustmentPlanDate.getFullYear();
        let planMonth = Number(this.selectAdjustmentPlanDate.getMonth()) + 1;
        let selectPlanDate = planYear + '-' + planMonth + '-' + planDay;
        // 批量修改请求
        if (this.diaologDisabledPlanDate) {
            this.httpService.post('/bpd-proj/bpd/masterTimeSheetDate/updateAll', {
                "timingId": this.auditForm.businessId,
                // "adProjectCode": this.changeAdProjectCode,
                "period": this.dialogPlantDate,
                "planDate": selectPlanDate,
                "timingItemId": this.selectedTimingItemId,
                "flag": this.selectedAdjustType
            })
                .subscribe(data => {
                    // 弹出提示
                    if (data.code == 1) {
                        this.messageService.showSuccess("Operation Success!");
                        this.growLife = 5000;
                    } else if (data.code == "7") {
                        this.messageService.showInfo("You Should Set Time For All Data!");
                        this.growLife = 300000;
                    } else {
                        this.messageService.showError("Operation Error!");
                        this.growLife = 5000;
                    }
                    this.msgs = this.messageService.msgs;
                    this.selectedTimingItemId = "";
                    // 初始化timesheet 表格数据
                    this.tableOnInit();
                })
        } else {
            this.messageService.showInfo("You Shoud Set Time First!");
            this.growLife = 300000;
            this.msgs = this.messageService.msgs;
        }
    }

    /**
     * 批量修改取消
     * 
     * @memberof TimeSheetData
     */
    private batchAdjustCancel() {
        this.adjuestDialog = false;
    }

    private viewGraphicClick() {
        this.previewDialog = true;
    }

    public deleteTimeSheetClick(idx, data) {
        this.selectedIndex = idx;
        this.deleteDialog = true;
    }

    public deleteYes() {
        let auditForm = this.auditForm;
        this.httpService.get('/bpd-proj/bpd/masterTimeSheetDate/delete?' + Number(new Date()) + '&timingItemId=' + this.timeSheetData[this.selectedIndex].timingItemId)
            .subscribe(data => {
                // 弹出提示
                if (data.code == 1) {
                    this.messageService.showSuccess("Operation Success!");
                    this.growLife = 5000;
                } else {
                    this.messageService.showError("Operation Error!");
                    this.growLife = 5000;
                }
                this.msgs = this.messageService.msgs;
                // 置空选中项
                // this.selectedTimingItemId = "";
                // this.selectedtimeSheetData = [];
                // 初始化timesheet 表格数据
                this.tableOnInit();
            })
        this.deleteDialog = false;
    }

    public deleteNo() {
        this.deleteDialog = false;
    }

    openChoose() {
        this.elementPaginatorPage = 1;
        this.elementPaginatorRow = 10;
        this.chooseGvdpDetailDialog = true;
        this.dialogElementIdForSearch = "";
        this.dialogElementNameForSearch = "";
        this.getGraphicData();
    }

    getGraphicData() {
        this.checkElement()
    }

    bindData($event) {
        this.dialogElementName = $event.data.elementName;
        this.dialogElementId = $event.data.elementId;
        this.chooseGvdpDetailDialog = false;
    }

    ementNameEnterSearch($event) {
        if ($event.code === "Enter") {
            this.checkElement();
        }
    }

    checkElement() {
        this.paginateForSearch({ page: 0, rows: 10, first: 0 });
    }

    paginateForSearch($event) {
        this.elementPaginatorPage = $event.page + 1;
        this.elementPaginatorRow = $event.rows;
        this.elementPaginatorFirst = $event.first;
        this.httpService.post("/bpd-proj/bpd/graphicConfig/getList", {
            "elementName": this.dialogElementNameForSearch,
            "elementId": this.dialogElementIdForSearch,
            "page": {
                "page": this.elementPaginatorPage,
                "rows": this.elementPaginatorRow
            }
        })
            .subscribe(data => {
                this.elementPaginatorTotal = data.total;
                this.GraphicData = this.dataManageService.addEmptyPaginatorTableData(data, 10);
            })
    }
}
