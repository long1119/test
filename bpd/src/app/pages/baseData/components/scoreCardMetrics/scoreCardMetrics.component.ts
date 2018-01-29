import {
    Component,
    OnInit
} from '@angular/core';

import {
    SelectItem,
    Message,
} from 'primeng/primeng';

import 'style-loader!./scoreCardMetrics.scss';

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

@Component({
    selector: 'score-card-metrics',
    templateUrl: './scoreCardMetrics.html'
})

export class ScoreCardMetrics {

    //页面表格数据
    public scoreCardMetricsData: any[];
    // 页面弹窗显示关闭
    public modifyDialog: Boolean;
    private modifyFlag: string;
    public deleteDialog: Boolean;
    public searchDialog: Boolean;
    private selectedData: any;
    // 页面数据双向绑定
    public dialogMetricName: string;
    public metricGroupOption: SelectItem[];
    public selectedMetricGroup: string;
    public dataSourceOption: SelectItem[];
    public selectedDataSource: string;
    public dataFlagOption: SelectItem[];
    public selectedDataFlag: string;
    public dataTypeOption: SelectItem[];
    public selectedDataType: string;
    public dialogBfsAccount: string;
    public departmentOption: SelectItem[];
    public selectedDepartment: string;
    public bfsOption: SelectItem[];
    public selectedBfs: string;
    // public selectedOwnerName: string;
    // public selectedOwnerCode: string;
    public roleOption: SelectItem[];
    public selectedRole: string;
    public characterFlags: String[];
    public msgs: Message[];
    public growLife: number = 5000;
    public localStorageAuthority: Boolean;

    constructor(private httpService: HttpDataService, private messageService: MessageService, private dataManageService: DataManageService, private deleteService: DeleteComfirmService) {
        // 下拉框数据初始化
        this.metricGroupOption = [];
        this.metricGroupOption.push({
            label: "Customer",
            value: "Customer"
        });
        this.metricGroupOption.push({
            label: "Finance",
            value: "Finance"
        });
        this.selectedMetricGroup = this.metricGroupOption[0].value;

        this.dataSourceOption = [];
        this.dataSourceOption.push({
            label: "EMDM",
            value: "EMDM"
        });
        this.dataSourceOption.push({
            label: "BFS",
            value: "BFS"
        });
        this.dataSourceOption.push({
            label: "FeedBack",
            value: "FeedBack"
        });
        this.selectedDataSource = this.dataSourceOption[0].value;

        this.dataFlagOption = [];
        this.dataFlagOption.push({
            label: "N/A",
            value: 1
        });
        this.dataFlagOption.push({
            label: "Hight Is Better",
            value: 2
        });
        this.dataFlagOption.push({
            label: "Low Is Better",
            value: 3
        });
        this.selectedDataFlag = this.dataFlagOption[0].value;

        this.dataTypeOption = [];
        this.dataTypeOption.push({
            label: "Text",
            value: "1"
        });
        this.dataTypeOption.push({
            label: "Number",
            value: "2"
        });
        this.dataTypeOption.push({
            label: "Date",
            value: "3"
        });
        this.dataTypeOption.push({
            label: "Percent",
            value: "4"
        });
        this.selectedDataType = this.dataTypeOption[0].value;
        // this.departmentOption = [];
        // this.departmentOption.push({
        //     label: "VLE/VCE",
        //     value: "VLE/VCE"
        // });
        // this.departmentOption.push({
        //     label: "QD",
        //     value: "QD"
        // });
        // this.departmentOption.push({
        //     label: "MD",
        //     value: "MD"
        // });
        // this.departmentOption.push({
        //     label: "FD",
        //     value: "FD"
        // });
        // this.departmentOption.push({
        //     label: "PATAC",
        //     value: "PATAC"
        // });
        // this.departmentOption.push({
        //     label: "BPD",
        //     value: "BPD"
        // });
        // this.selectedDepartment = this.departmentOption[0].value;
        this.bfsOption = [];
        this.characterFlags = [];
    }

    // recUserName($event) {
    //     this.selectedOwnerName = $event;
    // }

    // recUserCode($event) {
    //     this.selectedOwnerCode = $event;
    // }

    ngOnInit() {
        this.tableOnInit();
        this.dorpDownOnInit();
        this.localStorageAuthority = this.dataManageService.buttonAuthority("Maintian Scorecard Indicator");
    }

    private tableOnInit() {
        this.httpService.post('/bpd-proj/bpd/scordcardMetrix/getVList', {})
            .subscribe(data => {
                for (let i = 0; i < data.length; i++) {
                    if (data[i] != null) {
                        if (data[i].wFlag == 1) {
                            data[i].wFlag = "W";
                        } else {
                            data[i].wFlag = "";
                        }
                        if (data[i].dataType == 1) {
                            data[i].dataType = "Text";
                        } else if (data[i].dataType == 2) {
                            data[i].dataType = "Number";
                        } else if (data[i].dataType == 3) {
                            data[i].dataType = "Date";
                        } else if (data[i].dataType == 4) {
                            data[i].dataType = "Percent";
                        }
                        if (data[i].dataFlag == 1) {
                            data[i].dataFlag = "N/A";
                        } else if (data[i].dataFlag == 2) {
                            data[i].dataFlag = "High Is Better";
                        } else if (data[i].dataFlag == 3) {
                            data[i].dataFlag = "Low Is Better";
                        }
                    }
                }
                this.scoreCardMetricsData = this.dataManageService.addEmptyTableData(data, 10);
            })
    }

    private dorpDownOnInit() {
        this.httpService.get('/bpd-proj/bpd/role/getCombobox?' + Number(new Date()))
            .subscribe(data => {
                setTimeout(() => {
                    return (() => {
                        this.roleOption = data;
                        this.selectedRole = data[0].value;
                    })();
                }, 0);
            })
        this.httpService.get('/bpd-proj/bpd/dept/getCombobox?' + Number(new Date()))
            .subscribe(data => {
                setTimeout(() => {
                    return (() => {
                        this.departmentOption = data;
                        this.selectedDepartment = data[0].value;
                    })();
                }, 0);
            })
        this.httpService.get('/bpd-proj/bpd/scordcardMetrix/getBFS')
            .subscribe(data => {
                let newData: any[] = [];
                for (let i = 0; i < data.length; i++) {
                    newData.push({
                        label: data[i],
                        value: data[i]
                    })
                }
                newData.unshift({
                    label: "None",
                    value: null
                })
                this.bfsOption = newData;
                this.selectedBfs = newData[0].value;
                console.log(newData);
            })
    }

    /**
     * checkbox点击事件
     * 
     * @memberof ScoreCardMetrics
     */
    public onCheckboxChange() {
        // console.log(this.characterFlags);
    }

    /**
     * [dorpChange description]
     * @param {[type]} $event [description]
     */
    public dropChange($event) {
        if ($event === "BFS") {
            this.dialogBfsAccount = null;
        }
    }

    /**
     * 添加弹框展示
     * 
     * @memberof ScoreCardMetrics
     */
    public addClick() {
        this.modifyDialog = true;
        this.modifyFlag = "add";
        // this.dialogBfsAccount = "";
        this.dialogMetricName = "";
        this.characterFlags = [];
        // this.selectedDepartment = this.departmentOption[0].value;
        this.dorpDownOnInit();
        this.dialogBfsAccount = this.bfsOption[0].value;
        this.selectedDataFlag = this.dataFlagOption[0].value;
        this.selectedDataSource = this.dataSourceOption[0].value;
        this.selectedMetricGroup = this.metricGroupOption[0].value;
        this.selectedDataType = this.dataTypeOption[0].value;
    }

    /**
     * 编辑弹框显示
     * 
     * @param {any} idx 
     * @param {any} data 
     * @memberof ScoreCardMetrics
     */
    public editClick(idx, data) {
        this.selectedData = data;
        this.dialogMetricName = data.indexName;
        this.dialogBfsAccount = data.bfsAccount;
        this.characterFlags = [];
        if (data.wFlag) {
            this.characterFlags.push("1");
        }
        // this.dorpDownOnInit();
        let department: string;
        for (let i = 0; i < this.departmentOption.length; i++) {
            if (data.department == this.departmentOption[i].label) {
                department = this.departmentOption[i].value;
            }
        }
        // this.selectedBfs = data.bfs;
        this.selectedDepartment = data.department;
        let dataFlag: string = "";
        for (let i = 0; i < this.dataFlagOption.length; i++) {
            if (this.dataFlagOption[i].label == data.dataFlag) {
                dataFlag = this.dataFlagOption[i].value;
            }
        }
        this.selectedDataFlag = dataFlag;
        let dataType: string = "";
        for (let i = 0; i < this.dataTypeOption.length; i++) {
            if (this.dataTypeOption[i].label === data.dataType) {
                dataType = this.dataTypeOption[i].value;
            }
        }
        this.selectedDataType = dataType;
        this.selectedDataSource = data.dataSource;
        this.selectedMetricGroup = data.metricGroup;
        this.selectedRole = data.owner;
        this.modifyDialog = true;
        this.modifyFlag = "edit";
    }

    /**
     * 修改数据保存
     * 
     * @memberof ScoreCardMetrics
     */
    public modifySave() {
        let data: any = {
            indexName: null,
            metricGroup: null,
            bfsAccount: null,
            dataSource: null,
            dataFlag: null,
            department: null,
            owner: null,
            wFlag: null,
            dataType: null,
            serialNo: null
        };
        if (this.selectedData) {
            if (this.selectedData.indexName !== this.dialogMetricName) {
                data.indexName = this.dialogMetricName;
            }
            if (this.selectedData.metricGroup !== this.selectedMetricGroup) {
                data.metricGroup = this.selectedMetricGroup;
            }
            if (this.selectedData.bfsAccount !== this.dialogBfsAccount) {
                data.bfsAccount = this.dialogBfsAccount;
            }
            if (this.selectedData.dataSource !== this.selectedDataSource) {
                data.dataSource = this.selectedDataSource;
            }
            if (this.selectedData.dataType !== this.selectedDataType) {
                data.dataType = this.selectedDataType;
            }
            if (this.selectedData.dataFlag !== this.selectedDataFlag) {
                data.dataFlag = this.selectedDataFlag;
            }
            if (this.selectedData.department !== this.selectedDepartment) {
                data.department = this.selectedDepartment;
            }
            if (this.selectedData.owner !== this.selectedRole) {
                data.owner = this.selectedRole;
            }
            if (this.selectedData.wFlag !== this.characterFlags[0]) {
                data.wFlag = this.characterFlags[0] || "";
            }
        } else {
            data = {
                "indexName": this.dialogMetricName,
                "metricGroup": this.selectedMetricGroup,
                "bfsAccount": this.dialogBfsAccount,
                "dataSource": this.selectedDataSource,
                "dataFlag": this.selectedDataFlag,
                "department": this.selectedDepartment,
                "owner": this.selectedRole,
                "wFlag": this.characterFlags[0] || "",
                "dataType": this.selectedDataType,
                "indexId": null,
                "serialNo": this.scoreCardMetricsData.length && this.scoreCardMetricsData[this.scoreCardMetricsData.length - 1].serialNo ? (this.scoreCardMetricsData[this.scoreCardMetricsData.length - 1].serialNo + 1) : 1
            }
        }
        if (this.selectedData && this.selectedData.length != 0) {
            data.indexId = this.selectedData.indexId;
        }
        if (this.modifyFlag == "add") {
            this.httpService.post('/bpd-proj/bpd/scordcardMetrix/add', data)
                .subscribe(data => {
                    if (data.code == 1) {
                        this.growLife = 5000;
                        this.messageService.showSuccess("Operate Success!");
                        this.tableOnInit();
                    } else {
                        this.growLife = 5000;
                        this.messageService.showError("Operate Failed!");
                    }
                    this.msgs = this.messageService.msgs;
                })
        } else if (this.modifyFlag == "edit") {
            this.httpService.post('/bpd-proj/bpd/scordcardMetrix/update', data)
                .subscribe(data => {
                    if (data.code == 1) {
                        this.growLife = 5000;
                        this.messageService.showSuccess("Operate Success!");
                        this.tableOnInit();
                    } else {
                        this.growLife = 5000;
                        this.messageService.showError("Operate Failed!");
                    }
                    this.msgs = this.messageService.msgs;
                })
        }
        this.modifyDialog = false;
    }

    public modifyCancel() {
        this.modifyDialog = false;
    }

    /**
     * 添加人物界面显示
     * 
     * @memberof ScoreCardMetrics
     */
    public searchClick() {
        this.searchDialog = true;
    }

    /**
     * 人物选择确认
     * 
     * @memberof ScoreCardMetrics
     */
    // public searchSave() {
    //     this.searchDialog = false;
    // }

    /**
     * 人物选择取消
     * 
     * @memberof ScoreCardMetrics
     */
    // public searchCancel() {
    //     this.selectedOwnerCode = "";
    //     this.selectedOwnerName = "";
    //     this.searchDialog = true;
    // }

    /**
     * 删除弹框展示
     * 
     * @param {any} idx 
     * @param {any} data 
     * @memberof ScoreCardMetrics
     */
    public deleteClick(idx, data) {
        this.selectedData = data;
        // this.deleteDialog = true;
        this.deleteService.confirm(() => {
            this.httpService.post('/bpd-proj/bpd/scordcardMetrix/delete?', {
                indexId: this.selectedData.indexId
            })
                .subscribe(data => {
                    if (data.code == 1) {
                        this.growLife = 5000;
                        this.messageService.showSuccess("Operate Success!");
                        this.tableOnInit();
                    } else {
                        this.growLife = 5000;
                        this.messageService.showError("Operate Failed!");
                    }
                    this.msgs = this.messageService.msgs;
                })
        })
    }

    /**
     * 删除确认
     * 
     * @memberof ScoreCardMetrics
     */
    public deleteYes() {
        this.deleteDialog = false;
        this.httpService.post('/bpd-proj/bpd/scordcardMetrix/delete?', {
            indexId: this.selectedData.indexId
        })
            .subscribe(data => {
                if (data.code == 1) {
                    this.growLife = 5000;
                    this.messageService.showSuccess("Operate Success!");
                    this.tableOnInit();
                } else {
                    this.growLife = 5000;
                    this.messageService.showError("Operate Failed!");
                }
                this.msgs = this.messageService.msgs;
            })
    }

    /**
     * 删除取消
     * 
     * @memberof ScoreCardMetrics
     */
    public deleteNo() {
        this.deleteDialog = false;
    }
}