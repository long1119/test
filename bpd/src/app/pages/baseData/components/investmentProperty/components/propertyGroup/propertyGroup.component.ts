import 'style-loader!./propertyGroup.scss';
import {
    Component,
    OnInit,
    Input,
    EventEmitter,
    Output
} from '@angular/core';
import {
    InvestmentPropertyService
} from '../../investmentProperty.service';
import {
    MessageService
} from '../../../../../service/message.service';
import {
    DataManageService
} from '../../../../../service/dataManage.service';
import {
    DeleteComfirmService
} from '../../../../../service/deleteDialog.service';
import {
    Message,
    SelectItem
} from 'primeng/primeng';
@Component({
    selector: 'property-group',
    templateUrl: './propertyGroup.html'
})

export class PropertyGroup {
    @Output() groupIdOut = new EventEmitter();
    @Output() groupNameOut = new EventEmitter();
    pGroupData: any[];
    propertyGroup: string;
    dialog: Boolean = false;
    //修改页面是否显示
    editDialog: Boolean = false;
    deleteDialog: Boolean = false;

    capitalExpense: SelectItem[];
    selectedCapitalExpense: any;
    //ngModel绑定
    dialogPropertyGroup: any;
    dialogSerialNo: string;
    listInsert: boolean = true;
    selectedIndex: number;
    selectGroupId: string;
    //message信息
    msgs: Message[] = [];
    growLife: number = 5000;
    public localStorageAuthority: Boolean;

    constructor(private service: InvestmentPropertyService, private msgService: MessageService, private dataManageService: DataManageService, private deleteService: DeleteComfirmService) {
        this.capitalExpense = [];
        this.capitalExpense.push({
            label: 'Capital',
            value: {
                id: 1,
                name: 'Capital'
            }
        });
        this.capitalExpense.push({
            label: 'Expense',
            value: {
                id: 1,
                name: 'Expense'
            }
        });
        this.selectedCapitalExpense = this.capitalExpense[0].value;
    }

    /**
     * 投资属性group数据加载
     */
    ngOnInit() {
        this.service.post('/bpd-proj/bpd/investmentPropertyGroup/getList', {})
            .subscribe(data => {
                this.pGroupData = data;
            });
        this.localStorageAuthority = this.dataManageService.buttonAuthority("Investment Property");
    }

    /**
     * 投资属性group添加页面显示
     */
    addClick() {
        this.dialogPropertyGroup = "";
        let serialNo =  Number(this.pGroupData[this.pGroupData.length - 1].serialNo);
        if (serialNo != 9) {
            this.dialogSerialNo = String(serialNo + 1);
        } else {
            this.dialogSerialNo = "91";
        }
        this.listInsert = true;
        this.dialog = true;
    }

    /**
     * 投资属性group保存
     */
    saveClick() {
        if (this.listInsert) { //添加
            this.dialog = false;
            //发送投资属性group保存请求
            this.service.post('/bpd-proj/bpd/investmentPropertyGroup/insert', {
                "groupPropertyName": this.dialogPropertyGroup,
                "serialNo": this.dialogSerialNo,
                'investmentCharacter': this.selectedCapitalExpense.name
            })
                .subscribe(data => {
                    if ("1" == data.code) { //操作成功
                        this.growLife = 5000;
                        this.msgService.showSuccess('Operation succeeded!');
                    } else if ("2" == data.code) { //投资属性组名称已存在
                        this.growLife = 999999;
                        this.msgService.showInfo('investmentPropertyCode already exist!');
                    } else { //操作失败
                        this.growLife = 5000;
                        this.msgService.showError('Operation failed!');
                    }
                    //获取操作信息
                    this.msgs = this.msgService.msgs;
                    //投资属性group页面数据刷新
                    this.service.post('/bpd-proj/bpd/investmentPropertyGroup/getList', {})
                        .subscribe(data => {
                            this.pGroupData = data;
                        });
                });
        } else { //修改
            this.editDialog = false;
            this.service.post('/bpd-proj/bpd/investmentPropertyGroup/update', {
                "groupPropertyName": this.dialogPropertyGroup,
                "serialNo": this.dialogSerialNo,
                "propertyGroupId": this.pGroupData[this.selectedIndex].propertyGroupId,
                'investmentCharacter': this.selectedCapitalExpense.name
            })
                .subscribe(data => {
                    if ("1" == data.code) { //操作成功
                        this.growLife = 5000;
                        this.msgService.showSuccess('Operation succeeded!');
                    } else if ("2" == data.code) { //投资属性组名称已存在
                        this.growLife = 999999;
                        this.msgService.showInfo('investmentPropertyGroup already exist!');
                    } else { //操作失败
                        this.growLife = 5000;
                        this.msgService.showError('Operation failed!');
                    }
                    //获取操作信息
                    this.msgs = this.msgService.msgs;
                    this.service.post('/bpd-proj/bpd/investmentPropertyGroup/getList', {})
                        .subscribe(data => {
                            this.pGroupData = data;
                        });
                });
        }
        this.propertyGroup = "";
        this.dialogPropertyGroup = "";
    }

    cancleClick() {
        this.dialog = false;
        this.editDialog = false;
        this.propertyGroup = "";
        this.dialogPropertyGroup = "";
    }

    /**
     * 投资属性编辑跳转
     * @param idx
     * @param data
     */
    editClick(idx, data) {
        //查询该条数据信息
        this.service.get("/bpd-proj/bpd/investmentPropertyGroup/getById?" + Number(new Date()) + "&propertyGroupId=" + data.propertyGroupId)
            .subscribe(data => {
                this.dialogPropertyGroup = data.groupPropertyName;
                this.propertyGroup = data.groupPropertyName;
                this.dialogSerialNo = data.serialNo;
            });
        this.selectedIndex = idx;
        this.listInsert = false;
        this.editDialog = true;
        this.selectedCapitalExpense = {
            id: 1,
            name: data.investmentCharacter
        };
        this.dialogPropertyGroup = "";
    };

    /**
     * 投资属性group删除
     * @param idx
     * @param data
     */
    deleteClick(idx, data) {
        // this.deleteDialog = true;
        this.selectedIndex = idx;
        this.deleteService.confirm(() => {
            //发送删除请求
            let timeStamp = new Date();
            this.service.get('/bpd-proj/bpd/investmentPropertyGroup/delete?' + timeStamp.getTime() + '&propertyGroupId=' +
                this.pGroupData[this.selectedIndex].propertyGroupId
            )
                .subscribe(data => {
                    if ("1" == data.code) { //操作成功
                        this.growLife = 5000;
                        this.msgService.showSuccess('Operation succeeded!');
                        this.groupIdOut.emit("");
                    } else if ("2" == data.code) {
                        this.growLife = 999999;
                        this.msgService.showInfo(data.msg)
                    } else { //操作失败
                        this.growLife = 999999;
                        this.msgService.showError('Operation failed!');
                    }
                    //获取操作信息
                    this.msgs = this.msgService.msgs;
                    //刷新页面数据
                    this.service.post('/bpd-proj/bpd/investmentPropertyGroup/getList', {})
                        .subscribe(data => {
                            this.pGroupData = data;
                        });
                });
        })
    }
    /**
     * 删除确认
     * 
     * @memberof PropertyGroup
     */
    deleteYes() {
        //发送删除请求
        let timeStamp = new Date();
        this.service.get('/bpd-proj/bpd/investmentPropertyGroup/delete?' + timeStamp.getTime() + '&propertyGroupId=' +
            this.pGroupData[this.selectedIndex].propertyGroupId
        )
            .subscribe(data => {
                if ("1" == data.code) { //操作成功
                    this.growLife = 5000;
                    this.msgService.showSuccess('Operation succeeded!');
                    this.groupIdOut.emit("");
                } else if ("2" == data.code) {
                    this.growLife = 999999;
                    this.msgService.showInfo(data.msg)
                } else { //操作失败
                    this.growLife = 999999;
                    this.msgService.showError('Operation failed!');
                }
                //获取操作信息
                this.msgs = this.msgService.msgs;
                //刷新页面数据
                this.service.post('/bpd-proj/bpd/investmentPropertyGroup/getList', {})
                    .subscribe(data => {
                        this.pGroupData = data;
                    });
            });
        this.deleteDialog = false;
    }

    deleteNo() {
        this.deleteDialog = false;
    }

    /**
     * 单击行事件
     * @param event
     */
    handleRowClick(event) {
        this.groupIdOut.emit(event.data.propertyGroupId);
        this.groupNameOut.emit(event.data.groupPropertyName);
    }
}