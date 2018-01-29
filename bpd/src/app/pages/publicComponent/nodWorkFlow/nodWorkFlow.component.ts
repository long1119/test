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
    Message
} from 'primeng/primeng';

import "style-loader!./nodWorkFlow.scss";
import {
    MessageService
} from '../../service/message.service';
import {
    HttpDataService
} from '../../service/http.service';
import {
    DataManageService
} from '../../service/dataManage.service';

@Component({
    selector: "nod-work-flow",
    templateUrl: "./nodWorkFlow.html",
    styleUrls: [
        './nodWorkFlow.scss'
    ]
})

export class NodWorkFlow {
    @Input() auditForm: any;
    private allData: any = {};
    public selectedTimeSheet: Boolean;
    public selectedFiles: Boolean;
    public selectedDevlibable: Boolean;
    public regionTypeDialog: Boolean;

    public nodInformationData: any[];
    public selectedVersionData: any[];
    public regionTypeData: any[];
    public selectedRegionTypeCode: any[];
    public selectedRegionTypeName: string;
    // 分页信息
    // 页面双向绑定数据
    public dialogNodeType: string;
    public dialogDocCtrlNum: string;
    public dialogProjectName: string;
    public dialogProjectCode: string;
    public dialogEngineeringClassificantion: string;
    public dialogLcaVolume: string;
    public dialogManufactureLocation: string;
    public dialogApprovedInvestment: string;
    public dialogVehicleName: string;
    public dialogDescription: string;
    public selectDecisionDate: Date;
    public selectSorpEopDate: Date;
    public selectEopDate: Date;
    public msgs: Message[];
    public growLife: number = 5000;

    private selectedDeleteIndex: number;
    private nodeId: string;
    private adProjectCode: string;
    public changeAdProjectCode: string;

    private addDisable: boolean;
    private managerName: string;

    constructor(private dataManageService: DataManageService, private httpService: HttpDataService, private messageService: MessageService) {
        this.selectedDevlibable = false;
        this.selectedTimeSheet = true;
        this.selectedFiles = false;
        // 分页信息
        // 表格数据初始化
        this.selectedRegionTypeCode = [];
        // 获取各种数据
        this.managerName = window.localStorage.getItem("user");

    }

    ngOnInit() {

    }

    ngOnChanges() {
        if (this.auditForm) {
            let adProjectCode = this.changeAdProjectCode = this.adProjectCode = this.auditForm.businessId.split(' ')[1];
            this.nodeId = this.auditForm.businessId.split(' ')[0];
            this.tableOnInit();
            this.selectedVersionData = [];
        }
    }

    tableOnInit() {
        this.httpService.post('/bpd-proj/bpd/node/getVList', {
            "nodeId": this.nodeId,
            // "status": "0",
            "page": {
                "page": 1,
                "rows": 1
            }
        })
            .subscribe(dataAll => {
                let data = this.allData = dataAll.rows[0];
                if (data.projManager === this.managerName) {
                    this.addDisable = true;
                } else {
                    this.addDisable = false;
                }
                if (data.sorp) {
                    let sorp: any = data.sorp.split("-");
                    let sorpYear = sorp[0].toString();
                    let sorpMonth: any = (Number(sorp[1]) - 1).toString();
                    let sorpDate = sorp[2].toString();
                    this.selectSorpEopDate = new Date(sorpYear, sorpMonth, sorpDate);
                }
                if (data.eop) {
                    this.selectEopDate = this.dataManageService.getDateDate(data.eop);
                }
                if (data.decisionDate) {
                    // this.selectDecisionDate = this.dataManageService.getDateDate(data.decisionDate);
                    let decision: any = data.decisionDate.split("-");
                    let decisionYear = decision[0].toString();
                    let decisionMonth: any = (Number(decision[1]) - 1).toString();
                    let decisionDate = decision[2].toString();
                    this.selectDecisionDate = new Date(decisionYear, decisionMonth, decisionDate);
                }
                this.selectedRegionTypeName = data.nameArray;
                this.dialogDocCtrlNum = data.docControlNumber + "-" + this.selectedRegionTypeName;
                this.dialogProjectName = data.projectName || "";
                this.dialogProjectCode = data.projectCode || "";
                this.dialogLcaVolume = data.lcaVolume || "";
                this.dialogManufactureLocation = data.plantDescription || "";
                this.dialogApprovedInvestment = data.approveInvestment || "";
                this.dialogDescription = data.decisionDescription || "";
                this.dialogVehicleName = data.vehicleName || "";
                this.dialogEngineeringClassificantion = data.engineeringClassification || "";
            })
    }

    /**
     * 添加页面弹窗展示
     * 
     * @memberof NodInformation
     */
    public searchRegionTypeClick() {
        this.httpService.post('/bpd-proj/bpd/nodeType/getList', {})
            .subscribe(data => {
                this.regionTypeData = this.dataManageService.addEmptyTableData(data, 10);
                this.dataReset(0, data);
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
        if (this.allData.idArray && this.allData.nameArray) {
            let idArray: any;
            this.selectedRegionTypeName = this.allData.nameArray;
            this.selectedRegionTypeCode = idArray = this.allData.idArray.split(",");
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
            informationDate = this.dataManageService.getStrDate(this.selectDecisionDate);
        }
        // sorp 日期格式转化
        let sorpDate: string;
        if (this.selectSorpEopDate) {
            sorpDate = this.dataManageService.getStrDate(this.selectSorpEopDate);
        }
        let eopDate: string;
        if (this.selectEopDate) {
            eopDate = this.dataManageService.getStrDate(this.selectEopDate);
        }
        // 编辑表格数据
        this.httpService.post('/bpd-proj/bpd/node/update', {
            "adProjectCode": this.adProjectCode,
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
            "nodeId": this.nodeId,
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
            })
    }

    public regionTypeSave() {
        let name: any = [];
        // let code: any = [];
        this.selectedRegionTypeCode = [];
        if (this.selectedVersionData.length != 0) {
            for (let i = 0; i < this.selectedVersionData.length; i++) {
                name.push(this.selectedVersionData[i].markName.substr(0,1));
                this.selectedRegionTypeCode.push(this.selectedVersionData[i].nodeTypeId);
            }
        }
        this.selectedRegionTypeName = name.join(",");
        // this.selectedRegionTypeCode = code.join(",");
        this.regionTypeDialog = false;
    }

    public regionTypeCancel() {
        this.dataReset(0);
        this.regionTypeDialog = false;
    }
}