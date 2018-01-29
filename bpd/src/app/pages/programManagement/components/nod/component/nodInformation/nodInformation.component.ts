import {
    Component,
    OnInit,
    OnChanges,
    Input,
    SimpleChanges,
    Output,
    EventEmitter
} from '@angular/core';

import 'style-loader!./nodInformation.scss';

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
    WorkFlowStartService
} from '../../../../../../ebon/components/workflow/workflow-start.service';

import {
    SelectItem,
    Message,
    FileUpload
} from 'primeng/primeng';
import { FileUploadModule } from '../../../../../../../primeng/primeng';

@Component({
    selector: 'nod-information',
    templateUrl: './nodInformation.html'
})

export class NodInformation {

    public nodInformationData: any[] = [];
    public nodLogInformationData: any[] = [];
    public regionTypeData: any[] = [];
    @Input() changeAdProjectCode: string;
    @Input() changeManagerCode: string;
    @Output() managerOut = new EventEmitter();
    @Output() nodIdOut = new EventEmitter();

    // 页面绑定数据
    public dialogDocCtrlNum: string;
    public dialogEngineeringClassificantion: string;
    public dialogProjectName: string;
    public dialogProjectCode: string;
    public selectDecisionDate: Date;
    public selectSorpEopDate: Date;
    public selectEopDate: Date;
    public nodTypeOption: SelectItem[];
    public selectedNodType: string;
    public dialogDescription: string;
    public dialogSubmitDescription: string;
    public dialogApprovedInvestment: string;
    public dialogVehicleName: string;
    public dialogLcaVolume: string;
    public selectedNodeId: string;
    public dialogManufactureLocation: string;
    public msgs: Message[];
    public growLife: number = 5000;
    public ptLineupInfoEditable: Boolean = false;
    public selectedRegionTypeName: string;
    public selectedRegionTypeCode: any[] = [];
    public selectedVersionData: any[] = [];
    public uploadedFileData: any = {};
    private managerName: string = "";
    public yearRange: string;
    public uuId: string;
    // 表格内选中行的序列
    private selectedDeleteIndex: number;
    public selectedNodInformation: any;
    // 分页信息
    public nodInformationPaginatorTotal: number;
    public nodInformationPaginatorPage: number;
    public nodInformationPaginatorRow: number;
    public nodLogPaginatorTotal: number;
    public nodLogPaginatorPage: number;
    public nodLogPaginatorRow: number;
    // 页面弹框显示控制
    public modifyDialog: Boolean = false;
    private modifyFlag: string = "";
    public commitDialog: Boolean = false;
    public realSubmitDialog: Boolean = false;
    public deleteDialog: Boolean = false;
    public showDetailDialog: Boolean = false;
    public regionTypeDialog: Boolean = false;
    public managerFlag: Boolean = false;
    public commitFlag: Boolean = false;
    public localStorageAuthority: Boolean;
    public downloadFileDialog: Boolean = false;
    public showUploadFlag: Boolean = true;
    // 流程审批
    public setPetMemberDialog: Boolean;
    public recivedMap: any = {};
    public setPetMemberMessage: any;
    public changeMemberMessage: any;

    constructor(private dataManageService: DataManageService, private httpservice: HttpDataService, private messageService: MessageService, private workFlowStartService: WorkFlowStartService, private fileUpload: FileUpload, private deleteService: DeleteComfirmService) {
        // 分页信息初始化
        this.nodInformationPaginatorRow = 10;
        this.nodInformationPaginatorPage = 1;
        // 页面表格数据初始化
        this.nodInformationData = this.dataManageService.addEmptyOnInitTableData(10);
        let currentYear = new Date().getFullYear();
        this.yearRange = "" + (Number(currentYear) - 10) + ":" + (Number(currentYear) + 50);
    }

    ngOnInit() {
        this.managerName = window.localStorage.getItem('user');
        this.localStorageAuthority = this.dataManageService.buttonAuthority("Maintian NOD");
    }

    ngOnChanges(changes: SimpleChanges) {
        // 页面数据初始化
        if (this.changeAdProjectCode) {
            this.tableDataOnInit(this.nodInformationPaginatorPage, this.nodInformationPaginatorRow, this.changeAdProjectCode);
        }
        // 控制只能提交本人数据
        if (this.managerName == this.changeManagerCode) {
            this.managerFlag = true;
        } else {
            this.managerFlag = false;
        }
    }

    onNodInformationRowClick($event) {
        if ($event.data.status === "Not Approved") {
            this.commitFlag = true;
        } else {
            this.commitFlag = false;
        }
        this.selectedNodeId = $event.data.nodeId;
        this.managerOut.emit($event.data.projManager);
        this.nodIdOut.emit($event.data.nodeId);
    }

    /**
     * nod log 分页信息
     * 
     * @param {any} $event 
     * @memberof NodInformation
     */
    public nodLogPaginate($event) {
        this.nodLogPaginatorPage = $event.page;
        this.nodLogPaginatorRow = $event.rows;
        this.httpservice.post('/bpd-proj/bpd/node/getVList', {
            "adProjectCode": this.changeAdProjectCode,
            // "status": "1",
            "page": {
                "page": $event.page + 1,
                "rows": $event.rows
            }
        })
            .subscribe(data => {
                this.nodLogPaginatorTotal = data.total;
                this.nodLogInformationData = this.dataManageService.addEmptyPaginatorTableData(data, 5);
            })
    }

    /**
     * 页面表格数据初始化
     * 
     * @param page 分页页数
     * @param row 分页显示行数
     */
    private tableDataOnInit(page: number, row: number, code: string) {
        let total: number;
        this.httpservice.post('/bpd-proj/bpd/node/getVList', {
            "adProjectCode": code,
            // "status": "0",
            "page": {
                "page": page,
                "rows": row
            }
        })
            .subscribe(data => {
                this.nodInformationPaginatorTotal = data.total;
                if (data.rows.length != 0) {
                    for (let i = 0; i < data.rows.length; i++) {
                        if (data.rows[i].status == "0") {
                            data.rows[i].status = "Approving";
                        } else if (data.rows[i].status == "2") {
                            data.rows[i].status = "Approved";
                        } else if (data.rows[i].status == '1') {
                            data.rows[i].status = "Not Approved";
                        }
                    }
                }
                this.nodInformationData = this.dataManageService.addEmptyPaginatorTableData(data, 10);
            })
        this.selectedNodeId = "";
        return total;
    }

    /**
     * 下拉框内容获取
     * 
     * @memberof NodInformation
     */
    private nodTypeSelection(flag: Boolean) {
        //this.httpservice.get('/bpd-proj/bpd/nodeType/getNodeTypeCombobox?' + Number(new Date()))
        //.subscribe(data => {
        //this.nodTypeOption = data;
        //// 判断下拉框是否默认为第一项
        //if (flag && data.length != 0) {
        //this.selectedNodType = data[0].value;
        //}
        //})
    }

    /**
     * 分页信息
     * 
     * @param {any} $event 
     * @memberof Nod
     */
    public nodInformationPaginate($event) {
        this.nodInformationPaginatorPage = $event.page + 1;
        this.nodInformationPaginatorRow = $event.row;
        this.tableDataOnInit(this.nodInformationPaginatorPage, this.nodInformationPaginatorRow, this.changeAdProjectCode);
    }

    /**
     * 添加页面弹窗展示
     * 
     * @memberof NodInformation
     */
    public searchRegionTypeClick() {
        this.httpservice.post('/bpd-proj/bpd/nodeType/getList', {})
            .subscribe(data => {
                this.regionTypeData = this.dataManageService.addEmptyTableData(data, 10);
                if (this.modifyFlag == "editInformation") {
                    this.dataReset(this.selectedDeleteIndex, data);
                }
            })
        this.regionTypeDialog = true;
    }

    /**
     * 数据回显处理
     * 
     * @private
     * @param {any} data 
     * @memberof NodInformation
     */
    private dataReset(idx: number, data = []) {
        if (this.nodInformationData[idx].idArray && this.nodInformationData[idx].nameArray) {
            let idArray: any;
            this.selectedRegionTypeName = this.nodInformationData[idx].nameArray;
            this.selectedRegionTypeCode = idArray = this.nodInformationData[idx].idArray.split(",");
            if (data.length != 0) {
                for (let j = 0; j < idArray.length; j++) {
                    for (let k = 0; k < data.length; k++) {
                        if (idArray[j] == data[k].nodeTypeId) {
                            this.selectedVersionData.push(data[k]);
                        }
                    }
                }
            }
        }
        // this.selectedRegionTypeName = name.join(",");
        // this.selectedRegionTypeCode = 
    }

    public regionTypeSave() {
        let name: any = [];
        // let code: any = [];
        this.selectedRegionTypeCode = [];
        if (this.selectedVersionData.length != 0) {
            for (let i = 0; i < this.selectedVersionData.length; i++) {
                name.push(this.selectedVersionData[i].markName.substr(0, 1));
                this.selectedRegionTypeCode.push(this.selectedVersionData[i].nodeTypeId);
            }
        }
        this.selectedRegionTypeName = name.join(",");
        // this.selectedRegionTypeCode = code.join(",");
        this.regionTypeDialog = false;
    }

    public regionTypeCancel() {
        if (this.modifyFlag === "editInformation") {
            this.dataReset(this.selectedDeleteIndex);
        }
        this.regionTypeDialog = false;
    }

    /**
     * 添加弹窗
     * 
     * @memberof NodInformation
     */
    public informationAddClick() {
        this.nodTypeSelection(true);
        this.httpservice.get('/bpd-proj/bpd/node/getProject?' + Number(new Date()) + '&adProjectCode=' + this.changeAdProjectCode)
            .subscribe(data => {
                // sorp 转日期
                if (data.sorp) {
                    let sorp: any = data.sorp.split("-");
                    let sorpYear = sorp[0].toString();
                    let sorpMonth: any = (Number(sorp[1]) - 1).toString();
                    let sorpDate = sorp[2].toString();
                    this.selectSorpEopDate = new Date(sorpYear, sorpMonth, sorpDate);
                }
                if (data.eop) {
                    let eop: any = data.eop.split("-");
                    console.log(eop);
                    let eopYear = eop[0].toString();
                    let eopMonth: any = (Number(eop[1]) - 1).toString();
                    let eopDate = eop[2].toString();
                    this.selectEopDate = new Date(eopYear, eopMonth, eopDate);
                }
                this.dialogProjectName = data.projectName || "";
                this.dialogProjectCode = data.projectCode || "";
                this.dialogLcaVolume = data.lcaVolume || "";
                this.dialogManufactureLocation = data.plantDescription || "";
                this.dialogApprovedInvestment = data.approveInvestment || "";
                this.dialogDescription = "";
                this.dialogVehicleName = data.vehicleName || "";
                this.dialogEngineeringClassificantion = data.engineeringClassification || "";
            })
        this.selectDecisionDate = new Date();
        this.selectedRegionTypeName = "";
        this.selectedRegionTypeCode = [];
        this.selectedVersionData = [];

        this.ptLineupInfoEditable = false;
        this.modifyFlag = "addInformation";
        this.modifyDialog = true;
    }


    /**
     * 编辑弹窗
     * 
     * @param {any} idx 
     * @param {any} data 
     * @memberof NodInformation
     */
    public informationEditClick(idx, data) {
        this.nodTypeSelection(false);
        this.selectedNodType = data.nodeTypeId;
        // sorp 转日期
        if (data.sorp) {
            let sorp: any = data.sorp.split("-");
            let sorpYear = sorp[0].toString();
            let sorpMonth: any = (Number(sorp[1]) - 1).toString();
            let sorpDate = sorp[2].toString();
            this.selectSorpEopDate = new Date(sorpYear, sorpMonth, sorpDate);
        }
        // Decision转日期
        if (data.decisionDate) {
            let decision: any = data.decisionDate.split("-");
            let decisionYear = decision[0].toString();
            let decisionMonth: any = (Number(decision[1]) - 1).toString();
            let decisionDate = decision[2].toString();
            this.selectDecisionDate = new Date(decisionYear, decisionMonth, decisionDate);
        }
        if (data.eop) {
            this.selectEopDate = this.dataManageService.getDateDate(data.eop);
        }

        this.dialogProjectName = data.projectName;
        this.dialogProjectCode = data.projectCode;
        this.dialogEngineeringClassificantion = data.engineeringClassification;
        this.dialogLcaVolume = data.lcaVolume;
        this.dialogManufactureLocation = data.plantDescription;
        this.dialogApprovedInvestment = data.approveInvestment;
        this.dialogVehicleName = data.vehicleName;
        this.dialogDescription = data.decisionDescription;
        this.selectedVersionData = [];
        this.dataReset(idx);
        this.dialogDocCtrlNum = data.docControlNumber + "-" + this.selectedRegionTypeName;
        this.ptLineupInfoEditable = false;
        this.selectedDeleteIndex = idx;
        this.modifyFlag = "editInformation";
        this.modifyDialog = true;
    }

    /**
     * 提交数据确认
 * 
     * @memberof NodInformation
     */
    public informationModifySave() {
        // 日期格式转化
        let informationDate: string;
        if (this.selectDecisionDate) {
            informationDate = this.selectDecisionDate.getFullYear() + "-" + (Number(this.selectDecisionDate.getMonth()) + 1) + "-" + this.selectDecisionDate.getDate();
        }
        // sorp 日期格式转化
        let sorpDate: string;
        if (this.selectSorpEopDate) {
            sorpDate = this.selectSorpEopDate.getFullYear() + "-" + (Number(this.selectSorpEopDate.getMonth()) + 1) + "-" + this.selectSorpEopDate.getDate();
        }
        let eopDate: string;
        if (this.selectEopDate) {
            eopDate = this.dataManageService.getStrDate(this.selectEopDate);
        }
        if (this.modifyFlag == "addInformation") {
            // 添加表格数据
            this.httpservice.post('/bpd-proj/bpd/node/insert', {
                "adProjectCode": this.changeAdProjectCode,
                "decisionDate": informationDate,
                "sorp": sorpDate,
                "eop": eopDate,
                "projectName": this.dialogProjectName,
                "projectCode": this.dialogProjectCode,
                "decisionDescription": this.dialogDescription,
                "lcaVolume": this.dialogLcaVolume,
                "plantDescription": this.dialogManufactureLocation,
                "approveInvestment": this.dialogApprovedInvestment,
                "engineeringClassification": this.dialogEngineeringClassificantion,
                "vehicleName": this.dialogVehicleName,
                // "nodeTypeId": this.selectedNodType
                "nodeTypeIdArray": this.selectedRegionTypeCode
            })
                .subscribe(data => {
                    if (data.code == "1") {
                        this.messageService.showSuccess("Operation Success!");
                        this.growLife = 5000;
                    } else {
                        this.messageService.showError("Operation Failed!");
                        this.growLife = 5000;
                    }
                    this.msgs = this.messageService.msgs;
                    // 刷新页面表格
                    this.tableDataOnInit(this.nodInformationPaginatorPage, this.nodInformationPaginatorRow, this.changeAdProjectCode);
                })
        } else if (this.modifyFlag == "editInformation") {
            // 编辑表格数据
            this.httpservice.post('/bpd-proj/bpd/node/update', {
                "adProjectCode": this.changeAdProjectCode,
                "decisionDate": informationDate,
                "sorp": sorpDate,
                "eop": eopDate,
                "projectName": this.dialogProjectName,
                "projectCode": this.dialogProjectCode,
                "decisionDescription": this.dialogDescription,
                "lcaVolume": this.dialogLcaVolume,
                "plantDescription": this.dialogManufactureLocation,
                "approveInvestment": this.dialogApprovedInvestment,
                "engineeringClassification": this.dialogEngineeringClassificantion,
                "vehicleName": this.dialogVehicleName,
                // "nodeTypeId": this.selectedNodType,
                "nodeId": this.nodInformationData[this.selectedDeleteIndex].nodeId,
                "nodeTypeIdArray": this.selectedRegionTypeCode
            })
                .subscribe(data => {
                    if (data.code == "1") {
                        this.messageService.showSuccess("Operation Success!");
                        this.growLife = 5000;
                    } else {
                        this.messageService.showError("Operation Failed!");
                        this.growLife = 5000;
                    }
                    this.msgs = this.messageService.msgs;
                    // 刷新页面表格
                    this.tableDataOnInit(this.nodInformationPaginatorPage, this.nodInformationPaginatorRow, this.changeAdProjectCode);
                })
        }
        this.modifyDialog = false;
    }

    /**
     * 提交数据取消
     * 
     * @memberof NodInformation
     */
    public informationModifyCancel() {
        this.modifyDialog = false;
    }

    /**
     * 删除弹框展示
     * 
     * @memberof NodInformation
     */
    public informationDeleteClick(idx, data) {
        this.selectedDeleteIndex = idx;
        // this.deleteDialog = true;
        this.deleteService.confirm(() => {
            this.httpservice.get('/bpd-proj/bpd/node/delete?' + Number(new Date()) + '&nodeId=' + this.nodInformationData[this.selectedDeleteIndex].nodeId + "&adProjectCode=" + this.changeAdProjectCode)
                .subscribe(data => {
                    if (data.code == "1") {
                        this.messageService.showSuccess("Operation Success!");
                        this.growLife = 5000;
                    } else {
                        this.messageService.showError("Operation Failed!");
                        this.growLife = 5000;
                    }
                    this.msgs = this.messageService.msgs;
                    // 刷新页面表格
                    this.tableDataOnInit(this.nodInformationPaginatorPage, this.nodInformationPaginatorRow, this.changeAdProjectCode);
                })
        })
    }

    /**
     * 删除确认
     * 
     * @memberof NodInformation
     */
    public informationDeleteYes() {
        this.httpservice.get('/bpd-proj/bpd/node/delete?' + Number(new Date()) + '&nodeId=' + this.nodInformationData[this.selectedDeleteIndex].nodeId)
            .subscribe(data => {
                if (data.code == "1") {
                    this.messageService.showSuccess("Operation Success!");
                    this.growLife = 5000;
                } else {
                    this.messageService.showError("Operation Failed!");
                    this.growLife = 5000;
                }
                this.msgs = this.messageService.msgs;
                // 刷新页面表格
                this.tableDataOnInit(this.nodInformationPaginatorPage, this.nodInformationPaginatorRow, this.changeAdProjectCode);
            })
        this.deleteDialog = false;
    }

    /**
     * 展示nod详细数据
     * 
     * @param {any} idx 
     * @param {any} data 
     * @memberof NodInformation
     */
    public showDetailClick(idx, data) {
        this.nodTypeSelection(false);
        // this.selectedNodType = data.nameArray;
        this.selectedRegionTypeName = data.nameArray;
        this.dialogDocCtrlNum = data.docControlNumber + "-" + data.nameArray;
        this.dialogProjectName = data.projectName;
        this.dialogProjectCode = data.projectCode;
        this.dialogEngineeringClassificantion = data.engineeringClassification;
        this.dialogLcaVolume = data.lcaVolume;
        this.dialogManufactureLocation = data.plantDescription;
        this.dialogApprovedInvestment = data.approveInvestment;
        this.dialogVehicleName = data.vehicleName;
        this.dialogDescription = data.decisionDescription;
        this.selectDecisionDate = data.decisionDate;
        this.selectEopDate = data.eop;
        this.selectSorpEopDate = data.sorp;

        this.httpservice.post('/bpd-proj/bpd/node/getVList', {
            "adProjectCode": this.changeAdProjectCode,
            "status": "1",
            "page": {
                "page": this.nodLogPaginatorPage,
                "rows": this.nodLogPaginatorRow
            }
        })
            .subscribe(data => {
                this.nodLogPaginatorTotal = data.total;
                this.nodLogInformationData = this.dataManageService.addEmptyPaginatorTableData(data, 5);
            })

        this.ptLineupInfoEditable = true;
        this.showDetailDialog = true;
    }

    /**
     * 
     * 
     * @memberof NodInformation
     */
    public informationDeleteNo() {
        this.deleteDialog = false;
    }

    /**
     * TODO: 流程
     * 
     * @memberof NodInformation
     */
    public informationCommitClick() {
        this.commitDialog = true;
        this.dialogSubmitDescription = "";
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
        this.workFlowStartService.start('nod', this.selectedNodInformation.nodeId + ' ' + this.changeAdProjectCode, [{ name: "obj", value: JSON.stringify($event) }], () => {
            this.tableDataOnInit(this.nodInformationPaginatorPage, this.nodInformationPaginatorRow, this.changeAdProjectCode);
        });
    }

    submitFlowSave() {
        this.httpservice.post('/bpd-proj/bpd/node/update', {
            descriPtionStart: this.dialogSubmitDescription,
            nodeId: this.selectedNodInformation.nodeId
        })
            .subscribe(data => {
                if (data.code == 1) {
                    this.httpservice.get('/bpd-proj/bpd/node/getUserIsExit?' + Number(new Date()))
                        .subscribe(data => {
                            let showDialogFlag: Boolean = true;
                            let flow: Boolean = false;
                            let setData: any = {};
                            let newData: any[] = [];
                            if (data["0"]) {
                                this.setPetMemberDialog = true;
                                this.setPetMemberMessage = data["0"].substr(0, data["0"].length - 1);
                            } else if (data[1]) {
                                for (let key in data[1]) {
                                    if (data[1][key].length !== 0) {
                                        showDialogFlag = false;
                                        flow = true;
                                        setData[key] = data[1][key];
                                    } else if (data[1][key].length > 1) {
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
                                this.workFlowStartService.start('nod', this.selectedNodInformation.nodeId + ' ' + this.changeAdProjectCode, [{ name: "obj", value: JSON.stringify(this.recivedMap) }], () => {
                                    this.tableDataOnInit(this.nodInformationPaginatorPage, this.nodInformationPaginatorRow, this.changeAdProjectCode);
                                });
                            }
                            if (!showDialogFlag) {
                                this.changeMemberMessage = setData;
                            }
                        })
                }
            })
        this.commitDialog = false;
    }

    submitSave() {
        this.uuId = this.dataManageService.getUuId();
        this.realSubmitDialog = true;
    }

    private realSubmitSave() {
        this.httpservice.post('/bpd-proj/bpd/node/update', {
            "nodeId": this.selectedNodInformation.nodeId,
            descriPtionStart: this.dialogSubmitDescription,
            "status": "2"
        })
            .subscribe(data => {
                if (data.code == "1") {
                    this.messageService.showSuccess("Operation Success!");
                    this.growLife = 5000;
                    this.commitDialog = false;
                } else {
                    this.messageService.showError("Operation Failed!");
                    this.growLife = 5000;
                }
                this.msgs = this.messageService.msgs;
                // 刷新页面表格
                this.tableDataOnInit(this.nodInformationPaginatorPage, this.nodInformationPaginatorRow, this.changeAdProjectCode);
            })
    }

    submitCancel() {
        this.commitDialog = false;
    }

    onBasicSelect($event) {
        console.log("$$")
        if (this.dataManageService.checkUpload($event, "pdf")) {
            this.fileUpload.clear();
            // this.fileUpload.upload();
            return;
        } else {
            console.log(this.dataManageService.checkUpload($event, "pdf"));
        }
    }

    onBasicBeforeUpload($event) {

    }

    onBasicUpload($event) {
        this.httpservice.get('/bpd-proj/bpd/node/addAtt?' + Number(new Date()) + '&attId=' + this.uuId + '&type=nod')
            .subscribe(data => {
                if (data.code == "1") {
                    this.growLife = 5000;
                    this.messageService.showSuccess("Operate Success!");
                    this.realSubmitDialog = false;
                } else {
                    this.growLife = 5000;
                    this.messageService.showError("Operate Failed!");
                }
                this.msgs = this.messageService.msgs;
                this.realSubmitSave();
            })
    }

    public informationDownloadClick(idx, data) {
        this.httpservice.post("/bpd-proj/bpd/att/getVList", {
            bussinessId: data.nodeId
        })
            .subscribe(data => {
                this.uploadedFileData = data[0];
                if (this.uploadedFileData) {
                    this.downloadFileDialog = true;
                } else {
                    this.messageService.showInfo("No Download Files");
                    this.growLife = 300000;
                    this.msgs = this.messageService.msgs;
                }
            })
    }

    public downloadFileClick() {
        let token = window.sessionStorage.getItem("access_token");
        let url: string = '/bpd-proj/bpd/att/downloadFiles?attIds=' + this.uploadedFileData.attId + "&_=" + Number(new Date());
        if (token) {
            let realToken = token.substr(1, token.length - 2)
            url = url + "&accessToken=" + realToken;
        }
        window.location.href = url;
    }

    /**
     * TODO: 导出word文档
     * 
     * @memberof NodInformation
     */
    public informationExportClick() {
        let token = window.sessionStorage.getItem("access_token");
        let url: string = '/bpd-proj/bpd/node/exportWord?adProjectCode=' + this.changeAdProjectCode + '&nodeId=' + this.selectedNodInformation.nodeId + '&_=' + Number(new Date());
        if (token) {
            let realToken = token.substr(1, token.length - 2)
            url = url + "&accessToken=" + realToken;
        }
        window.location.href = url;
    }
}
