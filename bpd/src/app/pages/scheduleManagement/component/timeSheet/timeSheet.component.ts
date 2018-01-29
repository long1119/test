import {
    Component,
    OnInit
} from '@angular/core';

import 'style-loader!./timeSheet.scss';

import {
    SelectItem,
    Message
} from 'primeng/primeng';

import {
    MessageService
} from '../../../service/message.service';
import {
    HttpDataService
} from '../../../service/http.service';
import {
    WorkFlowStartService
} from '../../../../ebon/components/workflow/workflow-start.service';
import {
    DataManageService
} from '../../../service/dataManage.service';
import {
    RefreshMenuService
} from '../../../service/refreshMenu.service';
@Component({
    selector: 'time-sheet',
    templateUrl: './timeSheet.html',
    providers: [RefreshMenuService]
})

export class TimeSheet {
    programInfoData: any[] = [];
    gvdpVersionData: any[] = [];
    gvdpDetailData: any[] = [];
    copyTemplateData: any[] = [];
    timeSheetMessageData: any[] = [];
    selectedProgramInfoData: any;

    // 页面绑定数据
    msgs: Message[];
    public growLife: number = 5000;
    dialogProjectId: string;
    dialogProgramCode: string;
    dialogModelyear: string;
    dialogDescription: string;
    changeGvdpVersion: string;
    changeAdProjectCode: string;
    changeModelYear: string;
    changeCopyTemplate: string;
    selectedVersion: string;
    GVDPVersion: string;
    refreshFlag: Boolean = false;
    versionOption: SelectItem[] = [];
    selectedGvdpVersion: any;
    coverVersionItem: any[] = [];
    SelectedCopyTemplate: any;
    managerName: string;
    managerFlag: Boolean;
    changeMemberMessage: any;
    setPetMemberMessage: any;
    showTimeSheetData: Boolean = true;
    showApproveLog: Boolean = false;
    private recivedMap: any = {};
    saveAsDialog: boolean = false;

    // 弹出框隐藏显示 
    addTemplateDialog: Boolean = false;
    searchDialog: Boolean = false;
    copyTemplateDialog: Boolean = false;
    coverVersionDialog: Boolean = false;
    importDialog: Boolean = false;
    timeSheetMessageDialog: Boolean = false;
    submitDialog: Boolean = false;
    setSorpDialog: Boolean = false;
    selectSorpDate: Date = new Date();
    setSorpFlag: string = "";
    templateFlag: string;
    timeSheetStatus: any;
    freezeStatus: any;
    saveAsForbiden: Boolean;
    setPetMemberDialog: Boolean;
    yearRange: string;
    coverVersionFlag: string = "";
    coverVersionLabel: string = "Close";

    // 分页信息
    gvdpDetailTotal: number;
    detailPaginatorPage: number;
    detailPaginatorRow: number;
    copyTemplateTotal: number;
    copyPaginatorPage: number;
    copyPaginatorRow: number;
    public localStorageAuthority: Boolean;
    changeProjManager: string;
    changeProjectStatus: Boolean;
    importVersionOption: SelectItem[] = [];
    selectedImportVersion: string = "";

    constructor(private httpService: HttpDataService, private messageService: MessageService, private workFlowStartService: WorkFlowStartService, private dataManageService: DataManageService, private refreshMenuService: RefreshMenuService) {
        // 分页信息初始化
        this.detailPaginatorPage = 1;
        this.detailPaginatorRow = 5;
        this.copyPaginatorPage = 1;
        this.copyPaginatorRow = 10;

        // 表格数据初始化
        for (let i = 0; i < 10; i++) {
            this.programInfoData.push({
                id: i
            });
            this.copyTemplateData.push({
                id: i
            })
        }
        for (let i = 0; i < 5; i++) {
            this.gvdpDetailData.push({
                id: i
            });
        }

        // version下拉框默认值
        this.versionOption.push({
            label: "none",
            value: null
        })
        // 刷新菜单默认选中项
        let flag = this.dataManageService.getUuId()
        this.refreshMenuService.refreshMenu(flag);
        // 日期年份设置
        let currentYear = new Date().getFullYear();
        this.yearRange = "" + (Number(currentYear) - 10) + ":" + (Number(currentYear) + 50);
    }
    ngOnInit() {
        // 获取modelYear 表格数据
        this.httpService.post('/bpd-proj/bpd/vehicleProject/getVList2', {
            "timeSheetFlag": "1"
        })
            .subscribe(data => {
                this.programInfoData = data;
                if (data.length !== 0) {
                    this.selectedProgramInfoData = data[0];
                    this.changeProjManager = data[0].projManager;
                    this.changeAdProjectCode = data[0].adProjectCode;
                    this.versionDropDown(data[0].adProjectCode);
                    this.isProjManagerOrNot(data[0].projManager);
                    if (data[0].masterTimeSheetStatus == 2) {
                        this.changeProjectStatus = false;
                    } else {
                        this.changeProjectStatus = true;
                    }
                }
            })
        this.managerName = window.localStorage.getItem("user");
        // 获取version下拉框
        this.localStorageAuthority = this.dataManageService.buttonAuthority("Maintain Master timesheet");

    }

    /**
     * 版本下拉框函数
     * 
     * @private
     * @memberof TimeSheet
     */
    public versionDropDown(changeAdProjectCode: string = this.changeAdProjectCode) {
        // 获取版本下拉框
        this.httpService.get('/bpd-proj/bpd/masterTimeSheet/getVersionCombobox?' + Number(new Date()) + '&adProjectCode=' + changeAdProjectCode)
            .subscribe(data => {
                // 如果不存在大版本版本号变为 0.X
                if (data != null && data.length != 0) {
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].label[0] == ".") {
                            data[i].label = "0" + data[i].label;
                        }
                    }
                    this.versionOption = data;
                    this.selectedVersion = data[0].value;
                } else {
                    // version下拉框默认值
                    this.versionOption = [];
                    this.versionOption.push({
                        label: "none",
                        value: ""
                    })
                    this.selectedVersion = this.versionOption[0].value;
                }
            })
    }

    /**
     * 接收status状态
     * 
     * @param {any} $event 
     * @memberof TimeSheetData
     */
    submitStatusFlagIn($event) {
        this.freezeStatus = $event;
        if ($event == 1) {
            this.timeSheetStatus = true;
        } else {
            this.timeSheetStatus = false;
        }
        if ($event == "saveAsForbiden") {
            this.saveAsForbiden = false;
        } else {
            this.saveAsForbiden = true;
        }
    }

    /**
     * 提交后 冻结 
     * 
     * @private
     * @returns 
     * @memberof TimeSheet
     */
    private frezzeButton() {
        if (this.freezeStatus == "1") {
            this.messageService.showInfo("You Can Not Take This Operation After Submit!");
            this.growLife = 300000;
            this.msgs = this.messageService.msgs;
            return true;
        } else {
            return false;
        }
    }

    /**
     * modelYear 选择 控制gvdp信息
     * 
     * @param {any} $event 
     * @memberof TimeSheet
     */
    onRowClick($event) {
        this.changeProjManager = $event.data.projManager;
        if ($event.data.masterTimeSheetStatus == 2) {
            this.changeProjectStatus = false;
        } else {
            this.changeProjectStatus = true;
        }
        // console.log(this.changeProjectStatus,11);
        this.changeAdProjectCode = $event.data.adProjectCode;
        this.isProjManagerOrNot($event.data.projManager);
        // 获取版本下拉框
        this.versionDropDown();
        // this.httpService.get('/bpd-proj/bpd/masterTimeSheet/getVersionCombobox?' + Number(new Date()) + '&adProjectCode=' + $event.data.adProjectCode)
        //     .subscribe(data => {
        //         // 如果不存在大版本版本号变为 0.X
        //         if (data != null && data.length != 0) {
        //             for (let i = 0; i < data.length; i++) {
        //                 if (data[i].label[0] == ".") {
        //                     data[i].label = "0" + data[i].label;
        //                 }
        //             }
        //             this.versionOption = data;
        //             this.selectedVersion = data[0].value;
        //         } else {
        //             // version下拉框默认值
        //             this.versionOption = [];
        //             this.versionOption.push({
        //                 label: "none",
        //                 value: null
        //             })
        //             this.selectedVersion = this.versionOption[0].value;
        //         }
        //     })
    }

    /**
     * 版本选择事件 
     * 
     * @memberof TimeSheet
     */
    versionChange($event) {
        this.selectedVersion = $event.value;
    }


    /**
     * gvdp明细分页信息
     * 
     * @param {any} $event 
     * @memberof TimeSheet
     */
    gvdpDetailPaginate($event) {
        this.detailPaginatorPage = $event.page + 1;
        this.detailPaginatorRow = $event.rows;
        this.httpService.post('/bpd-proj/bpd/gvdpTemplateDetail/getList', {
            "page": {
                "page": $event.page + 1,
                "rows": $event.rows
            },
            templateId: this.changeGvdpVersion
        })
            .subscribe(data => {
                this.gvdpDetailTotal = data.total;
                if (!data.rows.length) {
                    data.rows = [{}];
                }
                let length = data.rows.length;
                if (length > 0 && length < 5) {
                    for (let i = 0; i < 5 - length; i++) {
                        data.rows.push({
                            id: i
                        });
                    }
                }
                this.gvdpDetailData = data.rows;
            });
    }

    copyTemplatePaginate($event) {
        this.copyPaginatorPage = $event.page + 1;
        this.copyPaginatorRow = $event.row;
        // 获取copy页面信息
        this.httpService.post('/bpd-proj/bpd/masterTimeSheetDate/getNotAdProjectCode', {
            // "adProjectCode": this.changeAdProjectCode,
            "programCode": this.dialogProgramCode,
            // "page": {
            //     "page": $event.page + 1,
            //     "rows": $event.row
            // },
            "modelYearFlag": "1"
        })
            .subscribe(data => {
                // this.copyTemplateTotal = data.total;
                if (data.length === 0) {
                    this.messageService.showInfo("No Data!");
                    this.growLife = 300000;
                }
                this.msgs = this.messageService.msgs;
                this.copyTemplateData = this.dataManageService.addEmptyTableData(data, 10);
            })
    }

    /**
     * 通过modelYear搜索页面信息
     * 
     * @memberof TimeSheet
     */
    searchClick() {
        this.dialogModelyear = "";
        this.dialogProjectId = "";
        this.searchDialog = true;
    }

    searchEnterSearch($event) {
        if ($event.key === "Enter") {
            this.searchSave();
        }
    }

    searchSave() {
        this.httpService.post('/bpd-proj/bpd/vehicleProject/getVList2', {
            "programCode": this.dialogProjectId,
            "modelYear": this.dialogModelyear,
            "timeSheetFlag": "1"
        })
            .subscribe(data => {
                if (!data.length) {
                    data = [{}];
                }
                let length = data.length;
                if (length > 0 && length < 10) {
                    for (let i = 0; i < 10 - length; i++) {
                        data.push({
                            id: i
                        });
                    }
                }
                this.programInfoData = data;
            })
        this.searchDialog = false;

    }

    searchCancel() {
        this.searchDialog = false;
    }

    /**
     * 添加模板弹窗
     * 
     * @memberof TimeSheet
     */
    addTemplateClick() {
        if (this.frezzeButton()) {
            return;
        }
        // 获取gvdp模板
        this.httpService.post('/bpd-proj/bpd/gvdpTemplate/getVList', {})
            .subscribe(data => {
                this.gvdpVersionData = data;
                if (data.length === 0) {
                    this.messageService.showInfo("No Data!");
                    this.growLife = 300000;
                }
                this.msgs = this.messageService.msgs;
                this.addTemplateDialog = true;
            });
        this.selectedGvdpVersion = [];
        this.gvdpDetailData = [];
    }

    /**
     * 选择gvdp模板版本
     * 
     * @param {any} $event 
     * @memberof TimeSheet
     */
    onGvdpVersionRowClick($event) {

        this.changeGvdpVersion = $event.data.templateId;
        this.GVDPVersion = $event.data.templateTitle;
        // 获取gvdp明细
        this.detailPaginatorPage = 1;
        this.detailPaginatorRow = 10;
        this.httpService.post('/bpd-proj/bpd/gvdpTemplateDetail/getList', {
            "templateId": $event.data.templateId,
            "page": {
                "page": this.detailPaginatorPage,
                "rows": this.detailPaginatorRow
            }
        })
            .subscribe(data => {
                this.gvdpDetailTotal = data.total;
                if (!data.rows.length) {
                    data.rows = [{}];
                }
                let length = data.rows.length;
                if (length > 0 && length < 5) {
                    for (let i = 0; i < 5 - length; i++) {
                        data.rows.push({
                            id: i
                        });
                    }
                }
                this.gvdpDetailData = data.rows;
            });
    }

    /**
     * 添加模板弹窗确认
     * 
     * @memberof TimeSheet
     */
    addTemplateSave() {
        this.setSorpFlag = "addTemplate";
        this.addTemplateDialog = false;
        this.httpService.get('/bpd-proj/bpd/masterTimeSheet/importTimeSheetByTemplateId?' + Number(new Date()) + '&adProjectCode=' + this.changeAdProjectCode +
            '&templateId=' + this.changeGvdpVersion + "&selectedVersionTimingId=" + this.selectedVersion)
            .subscribe(data => {
                if (data.code == 1) {
                    this.messageService.showSuccess("Operation Success!");
                    this.growLife = 5000;
                    // 重新获取下拉框信息
                    this.setSorpDialog = true;
                    this.versionDropDown();
                } else if (data.code == 4) {
                    this.messageService.showInfo("SORP Code Is The Only One!");
                    this.growLife = 300000;
                } else if (data.code == 6) {
                    this.coverVersionDialog = true;
                    this.coverVersionItem = data.item;
                } else if (data.code == 2) {
                    this.messageService.showInfo("Element Id Exists!");
                    this.growLife = 300000;
                } else {
                    this.messageService.showError("Operation Error!");
                    this.growLife = 5000;
                }
                this.msgs = this.messageService.msgs;
                // 重新获取下拉框
                this.versionDropDown();
                this.refreshFlag = !this.refreshFlag;
                // 获取gvdp明细
                // this.httpService.post('/bpd/gvdpTemplateDetail/getList', {
                //         "templateId": this.changeGvdpVersion,
                //         "page": {
                //             "page": this.detailPaginatorPage,
                //             "rows": this.detailPaginatorRow
                //         }
                //     })
                //     .subscribe(data => {
                //         this.gvdpDetailTotal = data.total;
                //         if (!data.rows.length) {
                //             data.rows = [{}];
                //         }
                //         let length = data.rows.length;
                //         if (length > 0 && length < 5) {
                //             for (let i = 0; i < 5 - length; i++) {
                //                 data.rows.push({
                //                     id: i
                //                 });
                //             }
                //         }
                //         this.gvdpDetailData = data.rows;
                //     });
            })
    }

    /**
     * 添加模板取消
     * 
     * @memberof TimeSheet
     */
    addTemplateCancel() {
        this.addTemplateDialog = false;
    }

    /**
     * 复制模板弹出框
     * 
     * @memberof TimeSheet
     */
    copyTemplateClick() {
        if (this.frezzeButton()) {
            return;
        }
        this.setSorpFlag = "copyTemplate";
        this.SelectedCopyTemplate = [];
        this.copyTemplateDialog = true;
        // 获取copy页面信息
        this.copyTemplatePaginate({ page: 0, rows: 10, first: 0 })
    }

    lookUpEnterSearch($event) {
        if ($event.key === "Enter") {
            this.lookUpClick();
        }
    }

    /**
     * 检索copyTemplate
     * 
     * @memberof TimeSheet
     */
    lookUpClick() {
        this.copyTemplatePaginate({ page: 0, rows: 10, first: 0 })
    }

    /**
     * 复制模版点击事件
     * 
     * @param {any} $event 
     * @memberof TimeSheet
     */
    onCopyTemplateRowClick($event) {
        this.changeCopyTemplate = $event.data.adProjectCode;
        this.httpService.get('/bpd-proj/bpd/masterTimeSheet/getVersionCombobox?' + Number(new Date()) + '&adProjectCode=' + $event.data.adProjectCode)
            .subscribe(data => {
                // 如果不存在大版本版本号变为 0.X
                if (data != null && data.length != 0) {
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].label[0] == ".") {
                            data[i].label = "0" + data[i].label;
                        }
                    }
                    this.importVersionOption = data;
                    this.selectedImportVersion = data[0].value;
                } else {
                    // version下拉框默认值
                    this.importVersionOption = [];
                    this.importVersionOption.push({
                        label: "none",
                        value: ""
                    })
                    this.selectedImportVersion = this.importVersionOption[0].value;
                }
            })
    }

    /**
     * 复制模板确认
     * 
     * @memberof TimeSheet
     */
    copyTemplateSave() {
        this.copyTemplateDialog = false;
        this.httpService.get('/bpd-proj/bpd/masterTimeSheet/importTimeSheetByAdProjectCode?' + Number(new Date()) + '&orderAdProjectCode=' + this.changeAdProjectCode + '&adProjectCode=' + this.changeCopyTemplate + '&selectedVersionTimingId=' + this.selectedVersion + "&timingId=" + this.selectedImportVersion)
            .subscribe(data => {
                if (data.code == 1) {
                    this.messageService.showSuccess("Operation Success!");
                    this.growLife = 5000;
                    // 刷新下拉框内容
                    this.versionDropDown();
                    this.refreshFlag = !this.refreshFlag;
                } else if (data.code == 4) {
                    this.messageService.showInfo("SORP Code Is The Only One!");
                    this.growLife = 300000;
                } else if (data.code == 5) {
                    this.messageService.showInfo("No Version Can Be Use!");
                    this.growLife = 300000;
                } else if (data.code == 3) {
                    this.messageService.showInfo("There's No Plan Date In The Template");
                    this.growLife = 300000;
                } else if (data.code == 2) {
                    this.messageService.showInfo("Element ID Exsits!");
                    this.growLife = 300000;
                } else if (data.code == 6) {
                    this.coverVersionDialog = true;
                    this.coverVersionItem = data.item;
                } else {
                    this.messageService.showError("Operation Error!");
                    this.growLife = 5000;
                }
                this.msgs = this.messageService.msgs;
            })
    }

    /**
     * 复制模板取消
     * 
     * @memberof TimeSheet
     */
    copyTemplateCancel() {

        this.copyTemplateDialog = false;
    }

    /**
     * 版本覆盖确认
     * 
     * @memberof TimeSheet
     */
    coverVersionSave() {
        this.httpService.post('/bpd-proj/bpd/masterTimeSheetDate/insertTimeSheet', this.coverVersionItem)
            .subscribe(data => {
                if (data.code == 1) {
                    this.messageService.showSuccess("Operation Success!");
                    this.growLife = 5000;
                    // 刷新下拉框内容
                    if (this.setSorpFlag === "addTemplate") {
                        this.setSorpDialog = true;
                    } else {
                        this.versionDropDown();
                        this.refreshFlag = !this.refreshFlag;
                    }
                } else {
                    this.messageService.showError("Operation Error!");
                    this.growLife = 5000;
                }
                this.msgs = this.messageService.msgs;
            })

        this.coverVersionDialog = false;
    }

    /**
     * 版本覆盖取消
     * 
     * @memberof TimeSheet
     */
    coverVersionCancel() {
        this.coverVersionDialog = false;
    }

    /**
     * 导入弹窗显示
     * 
     * @memberof TimeSheet
     */
    importClick() {
        if (this.frezzeButton()) {
            return;
        }
        this.importDialog = true;
    }

    /**
     * 导入返回值接收
     * 
     * @param {any} $event 
     * @memberof TimeSheet
     */
    onImportUpload($event) {
        let response = eval('(' + $event.xhr.response + ')');
        // if (response.list)
            // 刷新下拉框内容
        this.importDialog = false;
        this.coverVersionFlag = "nothing";
        this.coverVersionLabel = "Next";
        if (response.code == 4) {
            this.coverVersionItem = response.list;
            this.coverVersionDialog = true;
        } else if (response.code == 3) {
            this.coverVersionItem = response.list;
            this.timeSheetMessageData = response.ExcelError.list;
            this.timeSheetMessageDialog = true;
        } else if (response.code == 5) {
            this.coverVersionFlag = "sendError";
            this.coverVersionItem = response.list;
            this.timeSheetMessageData = response.ExcelError.list;
            this.timeSheetMessageDialog = true;
        } else if (response.code == 1) {
            this.messageService.showSuccess("Operate Success!");
            this.growLife = 5000;
            // 刷新下拉框内容
            this.versionDropDown();
            this.refreshFlag = !this.refreshFlag;
        } else {
            this.coverVersionFlag = "showError";
            this.coverVersionLabel = "Close";
            if (response.ExcelError.list.length !== 0) {
                this.timeSheetMessageData = response.ExcelError.list;
                this.importDialog = false;
                this.timeSheetMessageDialog = true;
            } else {
                if (!response.ExcelError.message) {
                    this.messageService.showSuccess("Operate Success!");
                    this.growLife = 5000;
                    // 刷新下拉框内容
                    this.versionDropDown();
                    this.refreshFlag = !this.refreshFlag;
                } else {
                    this.messageService.showInfo(response.message);
                    this.growLife = 300000;
                }
            }
        }

        this.msgs = this.messageService.msgs;
    }

    /**
     * 导入错误
     * 
     * @param {any} $event 
     * @memberof TimeSheet
     */
    onImportUploadError($event) {
        this.messageService.showError("Upload Failed!");
        this.growLife = 5000;
        this.msgs = this.messageService.msgs;

    }

    messageDetermine() {
        if (this.coverVersionFlag === "showError") {

        } else if (this.coverVersionFlag === "sendError") {
            this.httpService.post('/bpd-proj/bpd/masterTimeSheetDate/insertTimeSheetData', this.coverVersionItem)
                .subscribe(data => {
                    if (data.code == 1) {
                        this.messageService.showSuccess("Operation Success!");
                        this.growLife = 5000;
                        // 刷新下拉框内容
                        if (this.setSorpFlag === "addTemplate") {
                            this.setSorpDialog = true;
                        } else {
                            this.versionDropDown();
                            this.refreshFlag = !this.refreshFlag;
                        }
                    } else if (data.code == 2) {
                        this.messageService.showInfo("There Must Be One SORP !");
                        this.growLife = 5000;
                    }else {
                        this.messageService.showError("Operation Error!");
                        this.growLife = 5000;
                    }
                    this.msgs = this.messageService.msgs;
                })
        } else if (this.coverVersionFlag === "nothing") {
            this.coverVersionDialog = true;
        }
        this.timeSheetMessageDialog = false;
    }

    messageVeto() {
        this.timeSheetMessageDialog = false;
    }

    /**
     * 版本另存为
     * 
     * @memberof TimeSheet
     */
    saveAsClick() {
        this.saveAsDialog = true;
    }

    saveAsYes() {
        let str: string = this.versionOption[0].label;
        if (str[str.length - 1] == "9" && str[str.length - 2] == ".") {
            this.messageService.showInfo("The Version Is Too Much!");
            this.growLife = 300000;
            this.msgs = this.messageService.msgs;
        } else {
            this.httpService.get('/bpd-proj/bpd/masterTimeSheet/saveAs?' + Number(new Date()) + '&orderTimingId=' + this.selectedVersion)
                .subscribe(data => {
                    if (data.code == 1) {
                        // 刷新下拉框内容
                        this.versionDropDown();
                        this.refreshFlag = !this.refreshFlag;
                        this.messageService.showSuccess("Operation Success!");
                        this.growLife = 5000;
                    } else if (data.code == 5) {
                        this.messageService.showInfo("Week Is Required!");
                        this.growLife = 300000;
                    } else {
                        this.messageService.showError("Operation Error!");
                        this.growLife = 5000;
                    }
                    this.msgs = this.messageService.msgs;
                })
        }
        this.saveAsDialog = false;
    }

    saveAsNo() {
        this.saveAsDialog = false;
    }

    /**
     * 导出excel
     * 
     * @memberof TimeSheet
     */
    exportClick() {
        let _that = this;
        if (!this.saveAsForbiden) {
            this.messageService.showInfo("Please Set SORP Time First!");
            this.growLife = 300000;
            this.msgs = this.messageService.msgs;
            return;
        }
        this.httpService.get('/bpd-proj/bpd/masterTimeSheetDate/projectLevelIsExist?adProjectCode=' + this.changeAdProjectCode)
            .subscribe(data => {
                if (data.code == 2) {
                    this.messageService.showInfo("No File!");
                    this.growLife = 3000000;
                    this.msgs = this.messageService.msgs;
                } else {
                    let token = window.sessionStorage.getItem("access_token");
                    let url: string = '/bpd-proj/bpd/masterTimeSheetDate/masterTimeSheetExport?timingId=' + _that.selectedVersion + "&filePath=" + data.businessData + "&adProjectCode=" + this.changeAdProjectCode + '&_=' + Number(new Date());
                    if (token) {
                        let realToken = token.substr(1, token.length - 2)
                        url = url + "&accessToken=" + realToken;
                    }
                    window.location.href = url;
                }
            })
    }

    /**
     * 提交弹框
     * 
     * @memberof TimeSheet
     */
    submitClick() {
        this.dialogDescription = "";
        this.submitDialog = true;
    }

    /**
     * 提交确认
     * 
     * @memberof TimeSheet
     */
    submitSave() {
        this.httpService.post('/bpd-proj/bpd/masterTimeSheet/updateStatus', {
            "descriPtion": this.dialogDescription,
            "timingId": this.selectedVersion,
            "status": "1",
            "adProjectCode": this.changeAdProjectCode
        })
            .subscribe(data => {
                if (data.code == 1) {
                    // 刷新下拉框内容
                    this.versionDropDown();
                    this.refreshFlag = !this.refreshFlag;
                    this.messageService.showSuccess("Operation Success!");
                    this.growLife = 5000;
                    // 发起流程
                    // this.workFlowStartService.start('timesheet', this.selectedVersion, [], () => {});
                } else if (data.code == 2) {
                    this.messageService.showInfo("You Can't Submit With A Empty Plant Date!");
                    this.growLife = 300000;
                } else if (data.code == 3) {
                    this.messageService.showInfo("Please Set Member Of PQM First!");
                } else if (data.code == 7) {
                    this.messageService.showInfo(data.msg);
                } else {
                    this.messageService.showError("Operation Error!");
                    this.growLife = 5000;
                }
                this.msgs = this.messageService.msgs;
            })
        this.submitDialog = false;
    }

    submitFlowSave() {
        this.httpService.post('/bpd-proj/bpd/masterTimeSheet/updateDescriPtion', {
            timingId: this.selectedVersion,
            descriPtion: this.dialogDescription
        })
            .subscribe(data => {
                if (data.code == 1) {
                    this.messageService.showSuccess("Operation Success!");
                    this.growLife = 5000;
                    this.httpService.get('/bpd-proj/bpd/masterTimeSheet/getPetIsExit?' + Number(new Date()) + '&timingId=' + this.selectedVersion)
                        .subscribe(data => {
                            let showDialogFlag: Boolean = true;
                            let flow: Boolean = false;
                            let setData: any = {};
                            let newData: any[] = [];
                            if (data["0"]) {
                                this.setPetMemberDialog = true;
                                this.setPetMemberMessage = data["0"].substr(0, data["0"].length - 1);
                                flow = true;
                            } else if (data[1]) {
                                for (let key in data[1]) {
                                    if (data[1][key].length !== 0) {
                                        showDialogFlag = false;
                                        flow = true;
                                        setData[key] = data[1][key];
                                    } else if (data[1][key].length > 1) {
                                        flow = true;
                                        newData.push({
                                            role: key,
                                            user: data[1][key][0]
                                        })
                                    } else {
                                        this.recivedMap[key] = data[1][key][0].userCode;
                                    }
                                }
                            }
                            if (!flow) {
                                this.httpService.post('/bpd-proj/bpd/masterTimeSheet/updateDescriPtion', {
                                    "descriPtion": this.dialogDescription,
                                    "timingId": this.selectedVersion,
                                    "adProjectCode": this.changeAdProjectCode
                                })
                                    .subscribe(data => {
                                        if (data.code == 1) {
                                            // 刷新下拉框内容
                                            // this.versionDropDown();
                                            // this.refreshFlag = !this.refreshFlag;
                                            // this.messageService.showSuccess("Operation Success!");
                                            // 发起流程
                                            this.workFlowStartService.start('timeSheet', this.selectedVersion, [{ name: "obj", value: JSON.stringify(this.recivedMap) }], () => {
                                                this.versionDropDown();
                                                this.refreshFlag = !this.refreshFlag;
                                            });
                                        } else if (data.code == 7) {
                                            this.messageService.showInfo("You Can't Submit With A Empty Plant Date!");
                                            this.growLife = 300000;
                                        } else {
                                            // this.messageService.showError("Operation Error!");
                                        }
                                        // this.msgs = this.messageService.msgs;
                                    })
                            }
                            if (!showDialogFlag) {
                                this.changeMemberMessage = setData;
                            }
                        })
                } else {
                    this.messageService.showError("Operation Error!");
                    this.growLife = 5000;
                }
            })
        this.submitDialog = false;
    }

    /**
     * 提交取消
     * 
     * @memberof TimeSheet
     */
    submitCancel() {
        this.submitDialog = false;
    }

    private isProjManagerOrNot(manager) {
        if (manager === this.managerName) {
            this.managerFlag = true;
        } else {
            this.managerFlag = false;
        }
    }

    /**
     * 接收流程数据
     * 
     * @param {any} $evenet 
     * @memberof TimeSheet
     */
    mapRecive($event) {
        for (let key in this.recivedMap) {
            $event[key] = this.recivedMap[key];
        }
        // console.log(JSON.stringify($event));
        // 发起流程
        this.workFlowStartService.start('timeSheet', this.selectedVersion, [{ name: "obj", value: JSON.stringify($event) }], () => {
            this.versionDropDown();
            this.refreshFlag = !this.refreshFlag;
        });
    }

    setSorpSave() {
        let sorpDate = this.dataManageService.getStrDate(this.selectSorpDate);
        this.httpService.post('/bpd-proj/bpd/masterTimeSheetDate/updateSORPDate', {
            "elementId": "10094",
            "elementName": "SORP",
            "timingId": this.selectedVersion,
            "adProjectCode": this.changeAdProjectCode,
            "planDate": sorpDate
        })
            .subscribe(data => {
                // 弹出提示
                if (data.code == 1) {
                    this.messageService.showSuccess("Operation Success!");
                    this.growLife = 5000;
                    this.versionDropDown();
                    this.refreshFlag = !this.refreshFlag;
                    this.setSorpDialog = false;
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
            })

    }

    tabViewChange($event) {
        switch ($event.index) {
            case 0:
                this.showTimeSheetData = true;
                this.showApproveLog = false;
                break;
            case 1:
                this.showTimeSheetData = false;
                this.showApproveLog = true;
                break;
        }
    }
}