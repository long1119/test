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
import 'style-loader!./ArProject.scss';
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
    selector: 'ar-project',
    templateUrl: './ArProject.html',
})
export class ArProejct {
    addDialog: Boolean = false;
    editDialog: Boolean = false;
    deleteDialog: Boolean = false;
    searchManagerDialog: Boolean = false;
    searchCompanyDialog: Boolean = false;
    selectedIndex: string;
    searchFlag: string;

    dialogTextarea: string;
    dialogInvestmentManager: string;
    dialogProjectName: string;
    dialogProjectCode: string;
    dialogAVDCode: string;
    dialogDepartment: string;
    dialogApprovedInvestment: string;
    dialogUserName: string;
    dialogCompany: string;
    changeCode: string;
    growMessage: Message[];
    public growLife: number = 5000;

    baseData: any[] = [];
    managerData: any[] = [];
    companyData: any[] = [];
    selectedCompanyData: any;
    YearOption: SelectItem[] = [];
    investmentYearOption: SelectItem[] = [];
    companyOption: SelectItem[] = [];
    selectedCompany: string;
    selectedYear: any;
    selectedInvestmentYear: any;
    selectedManager: string;
    selectedDropdownCompany: string;
    selectedApprovedInvestment: string;
    selectedManagerData: any;
    requireFlag: Boolean = true;
    public baseDataLen: number;
    paginatorPage: number;
    paginatorRow: number;
    public paginatorTotal: number;
    rolePaginatorPage: number;
    rolePaginatorRow: number;
    dialogInvestmentYear: number;
    selectedBaseData: any;
    public localStorageAuthority: Boolean;
    projectCodeFlag: Boolean = true;
    dateYear: Date;
    public changeRegionIds: string;
    private refreshSubProject: Boolean = true;
    public yearRange: string;
    public sopDate: Date;

    private currentUserName: string;
    private currentUserCode: string;


    constructor(private httpService: HttpDataService, private messageService: MessageService, private dataManageService: DataManageService, private deleteService: DeleteComfirmService) {
        this.dateYear = new Date();
        this.YearOption.push({
            label: "" + (this.dateYear.getFullYear() - 1),
            value: "" + (this.dateYear.getFullYear() - 1)
        });
        this.YearOption.push({
            label: "" + (this.dateYear.getFullYear()),
            value: "" + (this.dateYear.getFullYear())
        });
        this.YearOption.push({
            label: "" + (this.dateYear.getFullYear() + 1),
            value: "" + (this.dateYear.getFullYear() + 1)
        });

        // 重置分页信息
        this.paginatorPage = 1;
        this.paginatorRow = 10;
        this.rolePaginatorPage = 1;
        this.rolePaginatorRow = 10;
        // 日期年份设置
        let currentYear = new Date().getFullYear();
        this.yearRange = "" + (Number(currentYear) - 10) + ":" + (Number(currentYear) + 50);
    }

    ngOnInit() {

        this.tableOnInit();
        this.selectedYear = this.YearOption[1].value;
        this.localStorageAuthority = this.dataManageService.buttonAuthority("Maintain AR.Project");
        this.currentUserCode = window.localStorage.getItem("user");
        this.currentUserName = window.localStorage.getItem("userName");

    }

    // checkbox
    public checked: boolean = true;
    public checkedChange() {
        this.tableOnInit();
    }

    tableOnInit(flag: Boolean = true) {
        let refreshFlag = flag;
        this.searchCompanyClick(false);
        this.httpService.post('/bpd-proj/bpd/arProject/getArYearCombobox', {})
            .subscribe(data => {
                data.unshift({
                    label: "all",
                    value: ""
                });
                // console.log(data);
                this.investmentYearOption = data;
                this.selectedInvestmentYear = data[0].value
            })
        this.httpService.post('/bpd-proj/bpd/arProject/getCompanyCombobox', {})
            .subscribe(data => {
                data.unshift({
                    label: "all",
                    value: ""
                });
                // console.log(data);
                this.companyOption = data;
                this.selectedDropdownCompany = data[0].value
            })
        this.httpService.post("/bpd-proj/bpd/arProject/getVList", {
            "page": {
                "page": this.paginatorPage,
                "rows": this.paginatorRow
            },
            projectManager: this.checked ? window.localStorage.getItem("user") : null
        })
            .subscribe(data => {
                this.baseDataLen = data.total; // new add
                if (data.rows.length != 0) {
                    this.baseData = this.dataManageService.addEmptyPaginatorTableData(data, 10);
                    if (refreshFlag) {
                        let firstOne: any = {};
                        firstOne = this.selectedBaseData = data.rows[0];
                        this.changeRegionIds = firstOne.arProjectRegionIds;
                        this.changeCode = firstOne.adProjectCode;
                    }
                } else {
                    this.baseData = this.dataManageService.addEmptyOnInitTableData(10);
                }
            })
    }

    refreshFlagIn($event) {
        this.refreshSubProject = !this.refreshSubProject;
        this.tableOnInit();
        this.selectedBaseData.arProjectRegionIds = $event;
    }

    onRowClick($event) {
        this.changeCode = $event.data.adProjectCode;
        this.changeRegionIds = $event.data.arProjectRegionIds;
    }

    onDialogRowClick($event) {
        // console.log($event.data);
        this.selectedManager = $event.data.userName;
        console.log(this.selectedManagerData)
        this.searchManagerDialog = false;
        if (this.searchFlag === "add") {
            this.addDialog = true;
        } else if (this.searchFlag == "edit") {
            this.editDialog = true;
        }
    }

    onCompanyDblClick($event) {
        this.selectedCompany = $event.data.company;
        this.searchCompanyDialog = false;
        if (this.searchFlag === "add") {
            this.addDialog = true;
        } else if (this.searchFlag == "edit") {
            this.editDialog = true;
        }
    }

    /**
     * 年份搜索
     * 
     * @memberof ArProejct
     */
    searchYearClick() {
        this.paginate({ page: 0, rows: 10, first: 0 })
    }

    searchYearEnterSearch($event) {
        if ($event.code === "Enter") {
            this.searchYearClick();
        }
    }

    /**
     * 非空驗證
     * 
     * @memberof ArProejct
     */
    requireChange($event) {
        //     // console.log($event);
        //     if (this.dialogTextarea && this.dialogProjectName && this.selectedManager) {
        //         this.requireFlag = false;
        //     } else {
        //         this.requireFlag = true;
        //     }
    }

    /**
     * projectCode校验
     * 
     * @param {any} $event 
     * @memberof ArProejct
     */
    checkOutRegionCode($event) {
        // let regionCodeReg = /\w{8}/;
        // let reg = new RegExp(regionCodeReg);
        if (this.dialogProjectCode.length != 8 && this.dialogProjectCode != "") {
            // this.dialogProjectCode = "";
            this.projectCodeFlag = false;
            this.messageService.showInfo("Plase Insert 8 Number Or Letter");
            this.growLife = 300000;
            this.growMessage = this.messageService.msgs;
        } else {
            this.projectCodeFlag = true;
        }
    }
    /**
     * 
     * @param 分页
     */
    public paginate(e) {
        this.paginatorPage = e.page + 1;
        this.paginatorRow = e.rows;
        this.httpService.post("/bpd-proj/bpd/arProject/getVList", {
            "arYear": this.selectedInvestmentYear,
            "plantCode": this.selectedDropdownCompany,
            "approvedInvestment": this.selectedApprovedInvestment,
            "page": {
                "page": e.page + 1,
                "rows": e.rows
            },
            projectManager: this.checked ? window.localStorage.getItem("user") : null
        })
            .subscribe(data => {
                this.baseDataLen = data.total; // new add
                if (data.rows.length != 0) {
                    this.baseData = this.dataManageService.addEmptyPaginatorTableData(data, 10);
                    this.selectedBaseData = data.rows[0];
                    this.changeCode = data.rows[0].adProjectCode;
                    this.changeRegionIds = data.rows[0].arProjectRegionIds;
                } else {
                    this.baseData = this.dataManageService.addEmptyOnInitTableData(10);
                }
            })
    }

    /**
     * 角色分页
     * 
     * @param {any} e 
     * @memberof ArProejct
     */
    roelPaginate(e) {
        this.rolePaginatorRow = e.rows;
        this.rolePaginatorPage = e.page + 1;
        this.httpService.post("/bpd-proj/bpd/user/getVList", {
            "userName": this.dialogUserName,
            "departmentName": this.dialogDepartment,
            "page": {
                "page": e.page + 1,
                "rows": e.rows
            }
        })
            .subscribe(data => {
                this.paginatorTotal = data.total;
                if (data.rows.length != 0) {
                    this.managerData = data.rows;
                }
            })

    }

    lookClickEnterSearch($event) {
        if ($event.key === "Enter") {
            this.lookClick();
        }
    }

    lookClick() {
        this.roelPaginate({ page: 0, rows: 10, first: 0 });
    }

    lookCompanyEnterSearch($event) {
        if ($event.key === "Enter") {
            this.lookCompanyClick();
        }
    }

    lookCompanyClick() {
        this.searchCompanyClick();
    }

    /**
     * 下拉框内容切換
     * 
     * @memberof ArProejct
     */
    yearChange() {
        let timeStamp = new Date();
        this.httpService.get('/bpd-proj/bpd/arProject/getAdProjectCode?' + timeStamp.getTime() + '&newDate=' + this.selectedYear)
            .subscribe(data => {
                this.dialogAVDCode = data;
            })
    }

    /**
     * 保存模态框弹出
     * 
     * @memberof BugetTemplate
     */
    addClick() {
        this.httpService.get('/bpd-proj/bpd/arProject/getAdProjectCode?newDate=' + this.selectedYear)
            .subscribe(data => {
                this.dialogAVDCode = data;
                this.dialogProjectCode = data;
            })
        this.selectedManagerData = null;
        this.selectedYear = this.YearOption[1].value;
        this.dialogProjectName = "";
        this.selectedManager = this.currentUserName;
        this.dialogTextarea = "";
        this.dialogApprovedInvestment = "";
        this.selectedCompany = "";
        this.selectedCompanyData = null;
        this.sopDate = new Date();
        this.searchFlag = "add";
        this.addDialog = true;
    };

    /**
     * 添加确认
     * 
     * @memberof BugetTemplate
     */
    addSave() {
        let sopDate = this.dataManageService.getStrDate(this.sopDate);
        if (!this.selectedManagerData) {
            this.selectedManagerData = { userCode: this.currentUserCode }
        }
        this.httpService.post("/bpd-proj/bpd/arProject/insert", {
            "adProjectCode": this.dialogAVDCode,
            "projectName": this.dialogProjectName,
            "projectCode": this.dialogProjectCode,
            "projectManager": this.selectedManagerData.userCode,
            "projectSummary": this.dialogTextarea,
            "approvedInvestment": this.dialogApprovedInvestment,
            "arYear": this.selectedYear,
            "plantCode": this.selectedCompanyData.plantDescription,
            "sop": sopDate
        })
            .subscribe(data => {
                // this.baseDataLen = data.total;
                if (data.code == 1) {
                    this.messageService.showSuccess("Operation Success!");
                    this.growLife = 5000;
                    this.tableOnInit();
                } else if (data.code == "2") {
                    this.messageService.showInfo("Project Code Exists!");
                    this.growLife = 300000;
                } else {
                    this.messageService.showError("Operation Error!");
                    this.growLife = 5000;
                }
                this.growMessage = this.messageService.msgs;
            })

        this.addDialog = false;
    }

    addCancle() {
        this.addDialog = false;
    }


    /**
     * 编辑模态框弹出
     * 
     * @memberof BugetTemplate
     */
    editClick(idx, data) {
        this.projectCodeFlag = true;
        this.selectedIndex = idx;
        this.selectedYear = data.arYear;
        this.selectedManagerData = [];
        this.selectedCompanyData = [];
        for (let i = 0; i < this.managerData.length; i++) {
            if (this.managerData[i].userCode == data.userCode) {
                this.selectedManagerData = this.managerData[i];
            }
        }
        for (let i = 0; i < this.companyData.length; i++) {
            if (this.companyData[i].plantDescription === data.plantCode) {
                this.selectedCompanyData = this.companyData[i];
            }
        }
        if (data.sop) {
            this.sopDate = this.dataManageService.getDateDate(data.sop);
        }
        this.dialogAVDCode = data.adProjectCode;
        this.dialogProjectCode = data.projectCode;
        this.dialogProjectName = data.projectName;
        this.dialogApprovedInvestment = data.approvedInvestment;
        this.selectedManager = data.userName;
        this.selectedCompany = data.company;
        this.dialogTextarea = data.projectSummary;
        this.dialogInvestmentYear = data.arYear;
        this.searchFlag = "edit";
        this.editDialog = true;
    }

    /**
     * 编辑确认
     * 
     * @memberof BugetTemplate
     */
    editSave() {
        let sopDate = this.dataManageService.getStrDate(this.sopDate);
        this.httpService.post("/bpd-proj/bpd/arProject/update", {
            "adProjectCode": this.dialogAVDCode,
            "projectName": this.dialogProjectName,
            "projectCode": this.dialogProjectCode,
            "projectManager": this.selectedManagerData.userCode,
            "projectSummary": this.dialogTextarea,
            // "arYear": this.selectedYear,
            "approvedInvestment": this.dialogApprovedInvestment,
            "plantCode": this.selectedCompanyData.plantDescription,
            "sop": sopDate
        })
            .subscribe(data => {
                // this.baseDataLen = data.total;
                if (data.code == 1) {
                    this.messageService.showSuccess("Operation Success!");
                    this.growLife = 5000;
                    this.tableOnInit();
                } else if (data.code == "2") {
                    this.messageService.showInfo("Project Code Exists!");
                    this.growLife = 300000;
                } else {
                    this.messageService.showError("Operation Error!");
                    this.growLife = 5000;
                }
                this.growMessage = this.messageService.msgs;
            })
        this.editDialog = false;
    }

    /**
     * 编辑取消
     * 
     * @memberof BugetTemplate
     */
    editCancle() {
        this.editDialog = false;
    }

    /**
     * 搜索弹框
     * 
     * @memberof ArProejct
     */
    searchManagerClick() {
        this.httpService.post("/bpd-proj/bpd/user/getVList", {
            "page": {
                "page": this.rolePaginatorPage,
                "rows": this.rolePaginatorRow
            }
        })
            .subscribe(data => {
                this.paginatorTotal = data.total;
                if (data.rows.length != 0) {
                    this.managerData = data.rows;
                }
            })

        this.dialogDepartment = "";
        this.selectedManagerData = [];
        this.dialogUserName = "";
        this.searchManagerDialog = true;
        this.editDialog = false;
        this.addDialog = false;
    }

    searchCompanyClick(flag2: Boolean = false, flag: Boolean = false) {
        this.httpService.post('/bpd-proj/bpd/plant/getList', {
            "plantDescription": this.dialogCompany
        })
            .subscribe(data => {
                // if (data.length != 0) {
                this.companyData = data;
                // }
            })
        if (flag) {
            this.selectedCompanyData = null;
            this.selectedCompany = "";
        }
        if (flag2) {
            this.searchCompanyDialog = true;
            this.addDialog = false;
            this.editDialog = false;
        }
    }

    /**
     * 搜索确认
     * 
     * @memberof ArProejct
     */
    searchSave() {
        this.searchManagerDialog = false;
        if (this.searchFlag === "add") {
            this.addDialog = true;
        } else if (this.searchFlag == "edit") {
            this.editDialog = true;
        }
    }

    /**
     * 搜索取消
     * 
     * @memberof ArProejct
     */
    searchCancle() {
        this.searchManagerDialog = false;
        if (this.searchFlag === "add") {
            this.selectedManager = "";
            this.addDialog = true;
        } else if (this.searchFlag == "edit") {
            this.selectedManager = this.baseData[this.selectedIndex].proejctManager;
            this.editDialog = true;
        }
    }

    /**
     * 删除
     * 
     * @param {any} idx 
     * @param {any} data 
     * @memberof ArProejct
     */
    deleteClick(idx, data) {
        this.selectedIndex = idx;
        // this.deleteDialog = true;
        this.deleteService.confirm(() => {
            let timeStamp = new Date();
            this.httpService.get("/bpd-proj/bpd/arProject/delete?" + timeStamp.getTime() + "&adProjectCode=" + this.baseData[this.selectedIndex].adProjectCode)
                .subscribe(data => {
                    if (data.code == 1) {
                        this.messageService.showSuccess("Operation Success!");
                        this.growLife = 5000;
                        this.tableOnInit();
                    } else if ("2" == data.code) { //操作失败
                        this.messageService.showInfo('You can not delete the data who has children!');
                        this.growLife = 300000;
                    } else if ("3" == data.code) {
                        this.messageService.showInfo("Pet Member Exist In This Ar Project!");
                        this.growLife = 300000;
                    } else if ("4" == data.code) {
                        this.messageService.showInfo("Budget Exist In This Ar Program");
                        this.growLife = 300000;
                    } else {
                        this.messageService.showError("Operation Error!");
                        this.growLife = 5000;
                    }
                    this.growMessage = this.messageService.msgs;
                })
        })
    }

    /**
     * 删除确认
     * 
     * @memberof ArProejct
     */
    deleteYes() {
        let timeStamp = new Date();
        this.httpService.get("/bpd-proj/bpd/arProject/delete?" + timeStamp.getTime() + "&adProjectCode=" + this.baseData[this.selectedIndex].adProjectCode)
            .subscribe(data => {
                if (data.code == 1) {
                    this.messageService.showSuccess("Operation Success!");
                    this.growLife = 5000;
                    this.tableOnInit();
                } else if ("2" == data.code) { //操作失败
                    this.messageService.showInfo('You can not delete the data who has children!');
                    this.growLife = 300000;
                } else if ("3" == data.code) {
                    this.messageService.showInfo("Pet Member Exist In This Ar Project!");
                    this.growLife = 300000;
                } else if ("4" == data.code) {
                    this.messageService.showInfo("Budget Exist In This Ar Program");
                    this.growLife = 300000;
                } else {
                    this.messageService.showError("Operation Error!");
                    this.growLife = 5000;
                }
                this.growMessage = this.messageService.msgs;
            })
        this.deleteDialog = false;
    }

    /**
     * 删除取消
     * 
     * @memberof ArProejct
     */
    deleteNo() {
        this.deleteDialog = false;
    }

    checkEnglish($event) {
        let reg = /[^a-zA-Z0-9]/;
        let regexp = new RegExp(reg);
        if (!regexp.test($event)) {
            return $event;
        } else {
            this.messageService.showInfo("Please Inser Number Or Letter!")
            this.growLife = 3000000;
            this.growMessage = this.messageService.msgs;
            return null;
        }
    }
};