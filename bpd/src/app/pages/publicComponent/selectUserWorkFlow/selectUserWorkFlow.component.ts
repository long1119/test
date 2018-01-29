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
    HttpDataService
} from '../../service/http.service';
import {
    DataManageService
} from '../../service/dataManage.service';
import {
    MessageService
} from '../../service/message.service';

import {
    SelectItem
} from 'primeng/primeng';

@Component({
    selector: "select-user-work-flow",
    templateUrl: "./selectUserWorkFlow.html",
    styleUrls: [
        './selectUserWorkFlow.scss'
    ]
})

export class SelectUserWorkFlow {

    @Input() changeMemberMessage: any;
    @Output() userRoleOut = new EventEmitter<any>();
    public memberDatas: any[];
    public selectUserDialog: Boolean;
    private outMap: any = {};

    constructor(private dataManageService: DataManageService, private httpService: HttpDataService) {
        this.memberDatas = [];
    }

    ngOnInit() {
        // console.log(this.memberDataManage(this.memberDatas));
    }

    ngOnChanges(changes: SimpleChanges) {
        console.log(this.changeMemberMessage);
        if (this.changeMemberMessage) {
            this.selectUserDialog = true;
            this.memberDatas = this.memberDataManage(this.changeMemberMessage);
        }
    }

    private memberDataManage(data): any[] {
        let memberData: any[] = [];
        for (let memberKey in data) {
            let userOption: SelectItem[] = [];
            for (let i = 0; i < data[memberKey].length; i++) {
                if (data[memberKey][i] != null) {
                    userOption.push({
                        label: data[memberKey][i].userName,
                        value: data[memberKey][i].userCode
                    })
                }
            }
            memberData.push({
                    role: memberKey,
                    user: userOption,
                    selectedUser: data[memberKey][0].userCode
                })
        }
        return memberData;
    }

    public selectUserSave() {
        let outMap: any = {};
        for (let i =  0; i < this.memberDatas.length; i++) {
            outMap[this.memberDatas[i].role] = this.memberDatas[i].selectedUser;
        }
        this.userRoleOut.emit(outMap);
        this.selectUserDialog = false;
    }

    public selectUserCancel() {
        this.selectUserDialog = false;
    }
}