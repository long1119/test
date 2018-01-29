import {
    Component,
    OnInit,
    Input,
    OnChanges,
    SimpleChanges
} from '@angular/core';
import {
    SelectItem,
    Message
} from 'primeng/primeng';
import 'style-loader!./programParameter.scss';
import {
    HttpDataService
} from '../../../../../service/http.service';
import {
    MessageService
} from '../../../../../service/message.service';
import {
    DataManageService
} from '../../../../../service/dataManage.service';
import {
    DeleteComfirmService
} from '../../../../../service/deleteDialog.service';

@Component({
    selector: 'program-parameter',
    templateUrl: './programParameter.html'
})

export class ProgramParameter {
    addDialog: Boolean = false;
    deleteDialog: Boolean = false;
    editDialog: Boolean = false;

    parameterGroupOption: SelectItem[];
    dataTypeOption: SelectItem[] = [];
    selectedDataType
    selectedParameterGroup: string;
    selectedDataId: string;
    selectedIndex: number;
    msgs: Message[] = [];
    growLife: number;


    baseData: any;
    dialogParameterName: string;
    dialogDataType: string;
    dialogDescription: string;
    dialogParameterGroup: string;
    searchParameterName: string;
    @Input() changedCatId: string;
    @Input() changedCatName: string;
    @Input() changedDropDown: any;

    public localStorageAuthority: Boolean;

    constructor(private httpService: HttpDataService, private messageService: MessageService, private dataManageService: DataManageService, private deleteService: DeleteComfirmService) {
        this.dataTypeOption.push({
            label: "string",
            value: "string"
        });
        this.dataTypeOption.push({
            label: "number",
            value: "number"
        })
        this.dataTypeOption.push({
            label: "date",
            value: "date"
        })

    }

    ngOnInit() {
        this.httpService.post('/bpd-proj/bpd/investAssumeIndex/getVList', {})
            .subscribe(data => {
                this.baseData = data;
            })
        this.httpService.post('/bpd-proj/bpd/investAssumeCat/getInvestAssumeCatCombobox', {})
            .subscribe(data => {
                data.unshift({
                    label: "all",
                    value: null
                })
                this.parameterGroupOption = data;
                this.selectedParameterGroup = data[0].value;
            })
        this.localStorageAuthority = this.dataManageService.buttonAuthority("Maintain Investment Parameter");
    }

    ngOnChanges(changes: SimpleChanges) {
        console.log(!this.changedCatId);
        if (this.changedCatId) {
            this.httpService.post('/bpd-proj/bpd/investAssumeIndex/getVList', {
                "investAssumeCatId": this.changedCatId
            })
                .subscribe(data => {
                    console.log(data)
                    this.baseData = data;
                })
            this.dialogDescription = "";
        }
        // this.httpService.post('/bpd-proj/bpd/investAssumeCat/getInvestAssumeCatCombobox', {})
        //     .subscribe(data => {
        //         this.parameterGroupOption = data;
        //         for (let i = 0; i < data.length; i++) {
        //             if (this.changedCatId == data[i].value) {
        //                 this.dialogDescription = data[i].label;
        //                 break;
        //             }
        //         }
        //     })
    }

    /**
     * 回车键搜索
     * 
     * @private
     * @param {any} $event 
     * @memberof ProgramParameter
     */
    private parameterNameEnterSearch($event) {
        if ($event.key === "Enter") {
            this.lookClick();
        }
    }

    /**
     * 关键字搜索
     * 
     * @memberof ProgramParameter
     */
    lookClick() {
        if (this.parameterGroupOption) {
            this.selectedParameterGroup = this.selectedParameterGroup || this.parameterGroupOption[0].value;
        }
        this.httpService.post('/bpd-proj/bpd/investAssumeIndex/getVList', {
            "investAssumeCatId": this.selectedParameterGroup,
            "investAssumeIndexName": this.dialogDescription
        })
            .subscribe(data => {
                this.baseData = data;
            })
    }

    /**
     * 显示添加弹窗
     * 
     * @memberof Region
     */
    addClick() {
        // console.log(this.changedCatName);
        this.dialogParameterGroup = this.changedCatName;
        this.addDialog = true;
        // if (this.parameterGroupOption) {
        //     this.selectedParameterGroup = this.changedCatId || this.parameterGroupOption[0].value;
        // }
        this.dialogParameterName = "";
        this.selectedDataType = this.dataTypeOption[0].value;
    }

    /**
     * 添加确认保存
     * 
     * @memberof Region
     */
    addSave() {

        this.httpService.post('/bpd-proj/bpd/investAssumeIndex/insert', {
            "investAssumeIndexName": this.dialogParameterName,
            "indexDataType": this.selectedDataType,
            "investAssumeCatId": this.changedCatId
        })
            .subscribe(data => {
                if ("1" == data.code) { //操作成功
                    this.growLife = 5000;
                    this.messageService.showSuccess('Operation succeeded!');
                } else { //操作失败
                    this.growLife = 5000;
                    this.messageService.showError('Operation failed!');
                }
                this.msgs = this.messageService.msgs;
                this.httpService.post('/bpd-proj/bpd/investAssumeIndex/getVList', {
                    "investAssumeCatId": this.changedCatId
                })
                    .subscribe(data => {
                        this.baseData = data;
                    })
            })
        this.addDialog = false;

        this.dialogParameterName = "";
    }

    /**
     * 添加取消
     * 
     * @memberof Region
     */
    addCancle() {


        this.addDialog = false;

        this.dialogParameterName = "";
        this.dialogDataType = "";
    }

    /**
     * 修改弹窗显示
     * 
     * @memberof Region
     */
    editClick(idx, data) {
        // console.log(data);
        this.selectedIndex = idx;
        // this.dialogDescription = data.investAssumeCatName
        // this.selectedParameterGroup = data.investAssumeCatId;
        this.editDialog = true;

        this.dialogParameterGroup = data.investAssumeCatName;
        this.dialogParameterName = data.investAssumeIndexName;
        this.selectedDataType = data.indexDataType;
    }

    /**
     * 更改确认
     * 
     * @memberof Region
     */
    editSave() {

        this.httpService.post('/bpd-proj/bpd/investAssumeIndex/update', {
            "investAssumeIndexName": this.dialogParameterName,
            "indexDataType": this.selectedDataType,
            "investAssumeIndexId": this.baseData[this.selectedIndex].investAssumeIndexId
        })
            .subscribe(data => {
                if ("1" == data.code) { //操作成功
                    this.growLife = 5000;
                    this.messageService.showSuccess('Operation succeeded!');
                } else { //操作失败
                    this.growLife = 5000;
                    this.messageService.showError('Operation failed!');
                }
                this.msgs = this.messageService.msgs;
                this.httpService.post('/bpd-proj/bpd/investAssumeIndex/getVList', {
                    "investAssumeCatId": this.changedCatId
                })
                    .subscribe(data => {
                        this.baseData = data;
                    })
            })
        this.editDialog = false;

        this.dialogParameterName = "";
        this.dialogDataType = "";
    }

    /**
     * 更改取消
     * 
     * @memberof Region
     */
    editCancle() {
        this.editDialog = false;

        this.dialogParameterName = "";
        this.dialogDataType = "";
    }

    /**
     * 删除弹窗
     * 
     * @memberof Region
     */
    deleteClick(idx, data) {

        this.selectedIndex = idx;
        // this.deleteDialog = true;
        this.deleteService.confirm(() => {
            let timeStamp = new Date();
            this.httpService.get('/bpd-proj/bpd/investAssumeIndex/delete?' + timeStamp.getTime() + '&investAssumeIndexId=' +
                this.baseData[this.selectedIndex].investAssumeIndexId)
                .subscribe(data => {
                    if ("1" == data.code) { //操作成功
                        this.growLife = 5000;
                        this.messageService.showSuccess('Operation succeeded!');
                    } else if ("2" == data.code) {
                        this.growLife = 999999;
                        this.messageService.showInfo(data.msg);
                    } else { //操作失败
                        this.growLife = 5000;
                        this.messageService.showError('Operation failed!');
                    }
                    this.msgs = this.messageService.msgs;
                    this.httpService.post('/bpd-proj/bpd/investAssumeIndex/getVList', {
                        "investAssumeCatId": this.changedCatId
                    })
                        .subscribe(data => {
                            this.baseData = data;
                        })
                })
        })

    }

    /**
     * 删除确认
     * 
     * @memberof Region
     */
    deleteYes() {
        let timeStamp = new Date();
        this.httpService.get('/bpd-proj/bpd/investAssumeIndex/delete?' + timeStamp.getTime() + '&investAssumeIndexId=' +
            this.baseData[this.selectedIndex].investAssumeIndexId)
            .subscribe(data => {
                if ("1" == data.code) { //操作成功
                    this.growLife = 5000;
                    this.messageService.showSuccess('Operation succeeded!');
                } else if ("2" == data.code) {
                    this.growLife = 999999;
                    this.messageService.showInfo(data.msg);
                } else { //操作失败
                    this.growLife = 5000;
                    this.messageService.showError('Operation failed!');
                }
                this.msgs = this.messageService.msgs;
                this.httpService.post('/bpd-proj/bpd/investAssumeIndex/getVList', {
                    "investAssumeCatId": this.changedCatId
                })
                    .subscribe(data => {
                        this.baseData = data;
                    })
            })
        this.deleteDialog = false;
    }

    /**
     * 删除取消
     * 
     * @memberof Region
     */
    deleteNo() {
        this.deleteDialog = false;
    }
}