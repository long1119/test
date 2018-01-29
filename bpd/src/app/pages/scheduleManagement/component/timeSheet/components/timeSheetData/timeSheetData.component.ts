import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
    OnChanges,
    SimpleChanges
} from '@angular/core';

import {
    SelectItem,
    Message,
    ConfirmationService
} from 'primeng/primeng';

import {
    MessageService
} from '../../../../../service/message.service';
import {
    HttpDataService
} from '../../../../../service/http.service';
import {
    TimeSheet
} from '../../timeSheet.component';
import {
    DataManageService
} from '../../../../../service/dataManage.service';
import 'style-loader!./timeSheetData.scss';

import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'time-sheet-data',
    templateUrl: './timeSheetData.html'
})

export class TimeSheetData {
    timeSheetData: any[] = [{}];
    selectPlanDate: Date;
    selectAdjustmentPlanDate: Date;

    @Input() auditForm: any;
    @Input() changeAdProjectCode: string = "";
    @Input() changeTimingId: string = "";
    @Input() changeProjManager: string;
    @Input() refreshFlag: Boolean;
    @Input() changeProjectStatus: Boolean;
    @Output() submitStatusFlagOut = new EventEmitter();

    // 页面弹窗显示
    modifyDialog: Boolean = false;
    adjuestDialog: Boolean = false;
    deleteDialog: Boolean = false;
    previewDialog: Boolean = false;

    // 分页信息
    timeSheetTotal: number;
    timePaginatorPage: number;
    timePaginatorRow: number;
    timePaginatorFirst: number;

    // 判断弹窗为添加或删除
    modifyFlag: string = "";

    // 页面数据
    msgs: Message[];
    public growLife: number = 5000;
    dialogElementId: string;
    dialogElementName: string;
    selectedTimingItemId: string;
    dialogCurrentElement: string;
    selectedElementName: string;
    selectedAdjustType: string;
    diaologDisabledPlanDate: string;
    selectedStatusValues: string[] = [];
    selectedtimeSheetData: any[];
    selectIndex: number;
    dialogPlantDate: number;
    adjustTypeOption: SelectItem[] = [];
    checkboxFlag: Boolean = true;
    specialURL: any;    //new add
    isSorpOrNot: Boolean = false;
    dialogSearchElementName: string;
    dialogSearchElementCode: string;
    addType: string = "custom";
    public localStorageAuthority: Boolean;
    private managerName: string;
    public managerFlag: Boolean;
    public yearRange: string;
    public timeSheetDataTotalRecords: number = 0;
    public elementPaginatorPage: number = 1;
    public elementPaginatorRow: number = 10;
    public elementPaginatorTotal: number = 0;
    public chooseGvdpDetailDialog: boolean = false;
    public GraphicData: any[] = [];
    public dialogElementNameForSearch: string = "";
    public dialogElementIdForSearch: string = "";
    public modifyFlagOption: SelectItem[] = [];
    public elementPaginatorFirst: number = 0;

    constructor(private httpService: HttpDataService, private messageService: MessageService, private timeSheet: TimeSheet, private sanitizer: DomSanitizer, private dataManageService: DataManageService, private confirmationService: ConfirmationService) {
        // 初始化多选列表
        this.adjustTypeOption.push({
            label: "This Element And Follow-Up",
            value: "1"
        });
        this.adjustTypeOption.push({
            label: "This Element And Previous",
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
        // 初始化分页信息
        this.timePaginatorPage = 1;
        this.timePaginatorRow = 10;
        this.timePaginatorFirst = 0;
        // 初始化表格数据
        for (let i = 0; i < 10; i++) {
            this.timeSheetData.push({
                id: i
            });
        }
        // 日期年份设置
        let currentYear = new Date().getFullYear();
        this.yearRange = "" + (Number(currentYear) - 10) + ":" + (Number(currentYear) + 50);
    }

    ngOnInit() {
        this.localStorageAuthority = this.dataManageService.buttonAuthority("Maintain Master timesheet");
        this.managerName = window.localStorage.getItem("user");
    }

    ngOnChanges(changes: SimpleChanges) {
        // 判断modelYear与版本号是否存在    ******* 
        if (this.changeAdProjectCode && this.changeTimingId) {
            this.tableOninit();
        } else {
            this.timeSheetData = [];
        }
        // 置空选中项
        this.selectedTimingItemId = "";
        this.timePaginatorPage = 1;
        this.isProjManagerOrNot(this.changeProjManager);
        // this.selectedtimeSheetData = [];
        // 初始化iframeURL
        let timeStamp = new Date().getTime();
        this.specialURL = this.sanitizer.bypassSecurityTrustResourceUrl("assets/drawTimeSheet/svg.html?" + timeStamp + "&adProjectCode=" + this.changeAdProjectCode +
            "&timingId=" + this.changeTimingId);
        this.dialogSearchElementName = "";
        this.dialogSearchElementCode = "";
    }

    public timeSheetDataAll: any = [];
    private tableOninit() {
        // 初始化timesheet 表格数据
        this.httpService.post('/bpd-proj/bpd/masterTimeSheetDate/getVList', {
            "adProjectCode": this.changeAdProjectCode,
            "timingId": this.changeTimingId,
            "elementName": this.dialogSearchElementName,
            "elementId": this.dialogSearchElementCode,
            // "page": {
            //     "page": this.timePaginatorPage,
            //     "rows": this.timePaginatorRow
            // }
        })
            .subscribe(data => {
                this.timeSheetTotal = data.length;
                this.timePaginatorPage = 0;
                this.timePaginatorRow = 10;
                this.timePaginatorFirst = 0;
                if (data.length != 0) {
                    this.timeSheetData = [];
                    if(data.length > 10) {
                        for(let i=0; i<10; i++) {
                            this.timeSheetData.push(data[i])
                        }
                    } else {
                       for(let i=0; i<data.length; i++) {
                            this.timeSheetData.push(data[i])
                        } 
                    }
                    // this.timeSheetDataTotalRecords = 10;
                    this.timeSheetDataAll = data;
                } else {
                    this.timeSheetData = [];
                    this.timeSheetDataAll = [];
                }
                if (data.length != 0) {
                    this.submitStatusFlagOut.emit(data[data.length - 1].timeSheetstatus);
                } else {
                    this.submitStatusFlagOut.emit("saveAsForbiden");
                }
            })
    }

    private elementNameEnterSearch($event) {
        if ($event.key === "Enter") {
            this.searchByElementName();
        }
    }

    private searchByElementName() {
        this.tableOninit();
    }

    private isProjManagerOrNot(manager) {
        if (manager === this.managerName) {
            this.managerFlag = false;
        } else {
            this.managerFlag = true;
        }
    }

    /**
     * 列表状态checkbox选中
     * 
     * @param {any} data 
     * @memberof TimeSheetData
     */
    onStatusCheckboxChange(idx, data) {
        this.checkboxFlag = false;
        this.httpService.post('/bpd-proj/bpd/masterTimeSheetDate/updateStatus', {
            "timingItemId": data.timingItemId,
            "status": 1
        })
            .subscribe(data => {
                if (data.code == "1") {
                    this.timeSheetData[idx].status = 1;
                    this.messageService.showSuccess("Operate Success!");
                    this.growLife = 5000;
                } else {
                    this.messageService.showError("Operate Failed");
                    this.growLife = 5000;
                }
                this.msgs = this.messageService.msgs;
                this.checkboxFlag = true;
                this.selectedStatusValues = [];
            })
    }

    /**
     * 分页
     * 
     * @param {any} $event 
     * @memberof TimeSheetData
     */
    timeSheetPaginate($event) {
        // 重置分页信息
        this.timePaginatorPage = $event.page + 1;
        this.timePaginatorRow = $event.rows;
        this.timePaginatorFirst = Number($event.first);
        // 初始化timesheet 表格数据
        // this.tableOninit();
        this.timeSheetData = [];
        let [{pageIndex = 0, pageLen = 10}] = [
        {
            pageIndex:(this.timePaginatorPage - 1)*this.timePaginatorRow,
            pageLen:(((this.timePaginatorPage)*this.timePaginatorRow)<this.timeSheetDataAll.length) ? 
            (this.timePaginatorPage)*this.timePaginatorRow : 
            this.timeSheetDataAll.length
        }];
        console.log(pageIndex,pageLen)
        for(let i=pageIndex; i<pageLen; i++) {
            this.timeSheetData.push(this.timeSheetDataAll[i])
        }
    }

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

    /**
     * 添加页面显示
     * 
     * @memberof TimeSheetData
     */
    addTimeSheetClick() {
        this.httpService.get('/bpd-proj/bpd/masterTimeSheetDate/createElementId')
            .subscribe(data => {
                this.dialogElementId = data;
            })
        this.selectPlanDate = null;
        this.dialogElementName = "";
        this.modifyFlag = "addTimeSheet";
        this.modifyDialog = true;
        this.addType = 'custom';
    }

    editTimeSheetClick(idx, data) {
        // console.log(data);
        this.addType = 'custom';
        this.selectIndex = idx;
        // TODO: 回显待做
        if (data.planDate) {
            let planDate: any = data.planDate.split("-");
            let planDateYear = planDate[0].toString();
            let planDateMonth: any = (Number(planDate[1]) - 1).toString();
            let planDateDate = planDate[2].toString();
            this.selectPlanDate = new Date(planDateYear, planDateMonth, planDateDate);
        }
        this.dialogElementId = data.elementId;
        this.dialogElementName = data.elementName;
        this.modifyFlag = "editTimeSheet";
        this.modifyDialog = true;
        if (data.elementName.toUpperCase() === "SORP") {
            this.isSorpOrNot = true;
        } else {
            this.isSorpOrNot = false;
        }
    }

    /**
     * 添加timesheet确认
     * 
     * @memberof TimeSheetData
     */
    modifySave(): void {
        // 日期格式处理
        let planDay = this.selectPlanDate.getDate();
        let planYear = this.selectPlanDate.getFullYear();
        let planMonth = Number(this.selectPlanDate.getMonth()) + 1;
        let selectPlanDate = planYear + '-' + planMonth + '-' + planDay;
        if (this.modifyFlag == "addTimeSheet") {
            // 第一条必须为SORP
            if (this.dialogElementName.toUpperCase() != "SORP" && !this.timeSheetData[0]) {
                this.dialogElementName = this.dialogElementName.toUpperCase();
                this.messageService.showInfo("You Can't Add A Version Without Element Name \"SORP\"");
                this.growLife = 300000;
                this.msgs = this.messageService.msgs;
                // this.modifyDialog = false;
                return;
            }
            // 已存在sorp后不能插入sorp
            if (this.timeSheetData[0] && this.dialogElementName.toUpperCase() == "SORP") {
                this.messageService.showInfo("Element Name Can't Be \"SORP\"!");
                this.growLife = 300000;
                this.msgs = this.messageService.msgs;
                // this.modifyDialog = false;
                return;
            }
            // timesheet 表格数据插入
            this.httpService.post('/bpd-proj/bpd/masterTimeSheetDate/insert', {
                "elementId": this.dialogElementId,
                "elementName": this.dialogElementName,
                "planDate": selectPlanDate,
                "timingId": this.changeTimingId,
                "adProjectCode": this.changeAdProjectCode
            })
                .subscribe(data => {
                    // 弹出提示
                    if (data.code == 1) {
                        this.messageService.showSuccess("Operation Success!");
                        this.growLife = 5000;
                    } else if (data.code == 2) {
                        this.messageService.showInfo("Element ID Exists!");
                        this.growLife = 300000;
                    } else if (data.code == 3) {
                        this.messageService.showInfo("Element Name Can't Be SORP!");
                        this.growLife = 300000;
                    } else if (data.code == 4) {
                        this.messageService.showInfo("Plan Date Can't Be !virgin");
                        this.growLife = 300000;
                    } else {
                        this.messageService.showError("Operation Error!");
                        this.growLife = 5000;
                    }
                    this.msgs = this.messageService.msgs;
                    // 刷新下拉框
                    this.timeSheet.versionDropDown();
                    // 初始化timesheet 表格数据
                    this.tableOninit();
                })
        } else if (this.modifyFlag == "editTimeSheet") {
            // timesheet 表格数据更新
            this.httpService.post('/bpd-proj/bpd/masterTimeSheetDate/update', {
                // "elementId": this.dialogElementId,
                "elementName": this.dialogElementName,
                "planDate": selectPlanDate,
                // "timingId": this.changeTimingId,
                // "adProjectCode": this.changeAdProjectCode,
                "timingItemId": this.timeSheetData[this.selectIndex].timingItemId
            })
                .subscribe(data => {
                    // 弹出提示
                    if (data.code == 1) {
                        this.specialURL = this.sanitizer.bypassSecurityTrustResourceUrl("assets/drawTimeSheet/svg.html?adProjectCode=" + this.changeAdProjectCode + "&timingId=" + this.changeTimingId);
                        this.messageService.showSuccess("Operation Success!");
                        this.growLife = 5000;
                    } else if (data.code == 2) {
                        this.messageService.showInfo("Element ID Exists!");
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
                    // 刷新下拉框
                    this.timeSheet.versionDropDown();
                    // 初始化timesheet 表格数据
                    this.tableOninit();
                })
        }
        this.modifyDialog = false;
    }

    /**
     * 添加取消
     * 
     * @memberof TimeSheetData
     */
    modifyCancel() {
        this.modifyDialog = false;
    }

    /**
     * 编辑取消
     * 
     * @memberof TimeSheetData
     */
    editTimeSheetCancel() {
        this.modifyDialog = false;
    }

    /**
     * 删除弹框
     * 
     * @memberof TimeSheetData
     */
    deleteTimeSheetClick(idx, data) {
        this.selectIndex = idx;
        // this.deleteDialog = true;
        this.confirmationService.confirm({
            message: 'Do You Want To Delete This Record?',
            header: 'Delete Confirmation',
            icon: 'fa fa-trash',
            accept: () => {
                this.httpService.get('/bpd-proj/bpd/masterTimeSheetDate/delete?' + Number(new Date()) + '&timingItemId=' + this.timeSheetData[this.selectIndex].timingItemId)
                    .subscribe(data => {
                        // 弹出提示
                        if (data.code == 1) {
                            this.specialURL = this.sanitizer.bypassSecurityTrustResourceUrl("assets/drawTimeSheet/svg.html?adProjectCode=" + this.changeAdProjectCode +
                                "&timingId=" + this.changeTimingId);
                            this.messageService.showSuccess("Operation Success!");
                            this.growLife = 5000;
                        } else {
                            this.messageService.showError("Operation Error!");
                            this.growLife = 5000;
                        }
                        this.msgs = this.messageService.msgs;
                        // 置空选中项
                        this.selectedTimingItemId = "";
                        // this.selectedtimeSheetData = [];
                        // 初始化timesheet 表格数据
                        this.tableOninit();
                    })
            }
        });
    }

    /**
     * 删除确认
     * 
     * @memberof TimeSheetData
     */
    deleteYes() {
        this.httpService.get('/bpd-proj/bpd/masterTimeSheetDate/delete?' + Number(new Date()) + '&timingItemId=' + this.timeSheetData[this.selectIndex].timingItemId)
            .subscribe(data => {
                // 弹出提示
                if (data.code == 1) {
                    this.specialURL = this.sanitizer.bypassSecurityTrustResourceUrl("assets/drawTimeSheet/svg.html?adProjectCode=" + this.changeAdProjectCode +
                        "&timingId=" + this.changeTimingId);
                    this.messageService.showSuccess("Operation Success!");
                    this.growLife = 5000;
                } else {
                    this.messageService.showError("Operation Error!");
                    this.growLife = 5000;
                }
                this.msgs = this.messageService.msgs;
                // 置空选中项
                this.selectedTimingItemId = "";
                // this.selectedtimeSheetData = [];
                // 初始化timesheet 表格数据
                this.tableOninit();
            })
        this.deleteDialog = false;
    }

    /**
     * 删除取消
     * 
     * @memberof TimeSheetData
     */
    deleteNo() {
        this.deleteDialog = false;
    }

    /**
     * 批量修改页面显示
     * 
     * @memberof TimeSheetData
     */
    batchAdjustClick() {
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
    onDateSelect($event) {
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
    batchAdjustSave() {
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
                "timingId": this.changeTimingId,
                "adProjectCode": this.changeAdProjectCode,
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
                    this.tableOninit();
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
    batchAdjustCancel() {
        this.adjuestDialog = false;
    }

    /**
     * TODO:
     * 
     * @memberof TimeSheetData
     */
    viewGraphicClick() {
        this.previewDialog = true;
    }

    public timeSheetDataLazyLoad($event) {
        console.log($event);
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
