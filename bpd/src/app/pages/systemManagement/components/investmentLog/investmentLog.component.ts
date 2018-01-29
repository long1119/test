import {
    Component,
    OnInit
} from '@angular/core';

import {
    SelectItem,
    Message
} from 'primeng/primeng';

import 'style-loader!./investmentLog.scss';

import {
    HttpDataService
} from '../../../service/http.service';
import {
    MessageService
} from '../../../service/message.service';
import {
    DataManageService
} from '../../../service/dataManage.service';

@Component({
    selector: 'investment-log',
    templateUrl: './investmentLog.html'
})

export class InvestmentLog {
    // 表格列表数据
    private systemListData: SelectItem[] = [];
    private allSystemListData: SelectItem[] = [];

    // 页面数据
    private mainRoleName: string = "";
    private selectedRole: string;
    private dialogRoleName: string;
    public localStorageAuthority: Boolean;

    constructor(private httpService: HttpDataService, private messageService: MessageService, private dataManageService: DataManageService) {
        
        this.mainRoleName = "项目投资经理";
    }

    ngOnInit() {
        this.httpService.get('/bpd-proj/bpd/role/getRoleComboboxByRoleType?' + Number(new Date()) + '&roleTypes=IM,PM\/IM')
        .subscribe(data => {
            this.allSystemListData = this.systemListData = data;
            this.listDataIn();
            if (data.length !== 0) {
                this.selectedRole = data[0].value;
            }
        })
        this.localStorageAuthority = this.dataManageService.buttonAuthority("Set Authority");
    }

    /**
     * 为列表添加空数据
     * 
     * @memberof SystemLog
     */
    listDataIn() {
        let length = this.systemListData.length;
        if (length < 10) {
            for (let i = 0; i < 10 - length; i++) {
                this.systemListData.push(
                    {
                        label: "",
                        value: Math.sin(i) + 0.3
                    }
                )
            }
        }
    }

    systemListClick($event) {
        this.selectedRole = $event.value;
    }

    autoMatch() {
        this.systemListData = [];
        for (let i = 0; i < this.allSystemListData.length; i++) {
            if (this.allSystemListData[i].label.toUpperCase().indexOf(this.dialogRoleName.toUpperCase()) > -1) {
                this.systemListData.push(this.allSystemListData[i]);
            }
        }
        this.listDataIn();
    }
}