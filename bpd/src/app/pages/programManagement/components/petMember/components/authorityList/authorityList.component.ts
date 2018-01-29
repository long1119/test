import {
    Component,
    OnInit,
    Input,
    OnChanges,
    SimpleChanges
} from '@angular/core';
import {
    CommonModule
} from '@angular/common';
import {
    FormsModule
} from '@angular/forms';
import 'style-loader!./authorityList.scss';
import {
    SelectItem,
    Message,
    TreeNode
} from 'primeng/primeng';
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
    selector: 'authority-list',
    templateUrl: './authorityList.html',
})
export class AuthorityList {
    baseData: any[];
    userDetailData: any = {};
    @Input() changeProjectCode: string;
    @Input() changeProjectType: string;

    msgs: Message[];
    public growLife: number = 5000;
    RoleOption: SelectItem[] = [];
    parentUserOption: SelectItem[] = [];
    dialogUserName: string;
    dialogTextarea: string;
    selectedRole: string;
    selectedParentUser: string;
    selectedIndex: number;
    selectedData: any;
    selectedUserName: string;
    changeUserName: string;
    changeUserCode: string;
    changeRoleCode: string;

    addDialog: Boolean = false;
    editDialog: Boolean = false;
    searchDialog: Boolean = false;
    deleteDialog: Boolean = false;
    userSelectDialog: Boolean = false;
    userDetailDialog: Boolean = false;
    searchFlag: string;
    public localStorageAuthority: Boolean;
    editFlag: boolean;

    constructor(private httpService: HttpDataService, private messageService: MessageService, private dataManageService: DataManageService, private deleteService: DeleteComfirmService) {

    }

    ngOnInit() {
        this.httpService.get('/bpd-proj/bpd/role/getCombobox?')
            .subscribe(data => {
                // data.unshift({
                //     label: "none",
                //     value: null
                // })
                this.RoleOption = data;
                this.changeRoleCode = data[0].value;
                this.dialogTextarea = data[0].label;
                this.selectedRole = data[0].value;
            })
        this.localStorageAuthority = this.dataManageService.buttonAuthority("Maintain PET Members");
    }

    ngOnChanges(changes: SimpleChanges) {

        if (this.changeProjectCode) {
            this.httpService.post('/bpd-proj/bpd/petMember/getTreeList', {
                'projectId': this.changeProjectCode,
                "petFlug": "1"
            })
                .subscribe(data => {
                    this.baseData = data.data;
                })
            this.httpService.get('/bpd-proj/bpd/petMember/getCombobox?' + Number(new Date()) + '&projectId=' + this.changeProjectCode)
                .subscribe(data => {
                    data.unshift({
                        label: "none",
                        value: null
                    })
                    this.parentUserOption = data;
                })
        }
    }

    /**
     * 下拉框更改
     * 
     * @memberof AuthorityList
     */
    dropChange($event) {
        this.changeRoleCode = $event.value;
        this.changeUserCode = "";
        this.selectedUserName = "";
        for (let i = 0; i < this.RoleOption.length; i++) {
            if (this.RoleOption[i].value === $event.value) {
                this.dialogTextarea = this.RoleOption[i].label;
            }
        }
    }

    nodeSelect($event) {

    }

    /**
     * 用户code
     * 
     * @param {any} $event 
     * @memberof AuthorityList
     */
    recUserCode($event) {
        this.changeUserCode = $event;
        this.userSelectDialog = false;
        this.searchDialog = false;
        this.selectedUserName = this.changeUserName;
        if (this.searchFlag == "add") {
            this.addDialog = true;
        } else if (this.searchFlag == "edit") {
            this.editDialog = true;
        }
    }

    /**
     * 用户name
     * 
     * @param {any} $event 
     * @memberof AuthorityList
     */
    recUserName($event) {
        this.changeUserName = $event;
        this.userSelectDialog = false;
        this.searchDialog = false;
        this.selectedUserName = this.changeUserName;
        if (this.searchFlag == "add") {
            this.addDialog = true;
        } else if (this.searchFlag == "edit") {
            this.editDialog = true;
        }
    }

    /**
     * 添加点击
     * 
     * @memberof ArSubProject
     */
    addClick() {
        this.httpService.get('/bpd-proj/bpd/petMember/getCombobox?' + Number(new Date()) + '&projectId=' + this.changeProjectCode)
            .subscribe(data => {
                data.unshift({
                    label: "none",
                    value: null
                })
                this.parentUserOption = data;
            })
        if (this.parentUserOption.length != 0) {
            this.selectedParentUser = this.parentUserOption[0].value;
        }
        if (this.RoleOption.length != 0) {
            this.selectedRole = this.RoleOption[0].value;
            this.changeRoleCode = this.RoleOption[0].value;
        }
        this.selectedUserName = "";
        this.dialogTextarea = "";
        this.addDialog = true;

        this.searchFlag = "add";
    }

    /**
     * 添加确认
     * 
     * @memberof ArSubProject
     */
    addSave() {
        this.httpService.post('/bpd-proj/bpd/petMember/insert', {
            "roleCode": this.selectedRole,
            "parentMember": this.selectedParentUser,
            "userCode": this.changeUserCode,
            "projectType": this.changeProjectType,
            // "userName": this.selectedUserName,
            "description": this.dialogTextarea,
            "projectId": this.changeProjectCode,
        })
            .subscribe(data => {
                if (data.code == "1") {
                    this.messageService.showSuccess("Operation Success!");
                    this.growLife = 5000;
                } else if (data.code == "2") {
                    this.messageService.showInfo("User Code Exists");
                    this.growLife = 300000;
                } else if (data.code == "3") {
                    this.messageService.showInfo("User Code Exist");
                    this.growLife = 300000;
                } else if (data.code == "5") {
                    this.messageService.showInfo(data.msg);
                    this.growLife = 300000;
                } else if (data.code == "4") {
                    this.messageService.showInfo("You Can't Set A ChildNod Whitch It's FatherNod Is Itself");
                    this.growLife = 300000;
                } else if (data.code == "7") {
                    this.messageService.showInfo("You Can't Set A Parent To A Child!")
                    this.growLife = 300000;
                } else {
                    this.messageService.showError("Operation Failed!");
                    this.growLife = 5000;
                }
                this.msgs = this.messageService.msgs;
                this.httpService.post('/bpd-proj/bpd/petMember/getTreeList', {
                    'projectId': this.changeProjectCode
                })
                    .subscribe(data => {
                        this.baseData = data.data;
                    })
            })
        this.addDialog = false;
    }

    /**
     * 添加取消
     * 
     * @memberof ArSubProject
     */
    addCancle() {
        this.addDialog = false;
    }

    /**
     * 编辑点击
     * 
     * @memberof ArSubProject
     */
    editClick(idx, data) {
        let editData = data;
        if (data.data.initPet != 1) {
            this.editFlag = true;
        } else {
            this.editFlag = false;
        }
        this.changeRoleCode = data.data.roleCode;
        this.selectedData = data.data;
        this.dialogTextarea = data.data.description;
        this.selectedRole = data.data.roleCode;
        this.selectedParentUser = data.data.parentMember;
        this.selectedUserName = data.data.userName;
        this.changeUserCode = data.data.userCode;
        this.editDialog = true;
        this.httpService.get('/bpd-proj/bpd/petMember/getCombobox?' + Number(new Date()) + '&projectId=' + this.changeProjectCode + '&petMemberCode=' + data.data.petMemberCode)
            .subscribe(data => {
                data.unshift({
                    label: "none",
                    value: null
                })
                for (let i = 0; i < data.length; i++) {
                    if (data[i].value == editData.data.id) {
                        data.splice(i, 1);
                    }
                }
                this.parentUserOption = data;
            })
        this.searchFlag = "edit";
    }

    clearUser() {
        let data = {
            "userCode": "",
            "projectId": this.changeProjectCode,
            "petMemberCode": this.userDetailData.petMemberCode
        }
        this.httpService.post('/bpd-proj/bpd/petMember/update', data)
            .subscribe(data => {
                if (data.code == "1") {
                    this.messageService.showSuccess("Operation Success!");
                    this.growLife = 5000;
                } else if (data.code == "2") {
                    this.messageService.showInfo("User Code Exist");
                    this.growLife = 300000;
                } else if (data.code == "3") {
                    this.messageService.showInfo("User Code Exist");
                    this.growLife = 300000;
                } else if (data.code == "4") {
                    this.messageService.showInfo("You Can't Set A ChildNod Whitch It's FatherNod Is Itself");
                    this.growLife = 300000;
                } else if (data.code == "7") {
                    this.messageService.showInfo("You Can't Set A Parent To A Child!")
                    this.growLife = 300000;
                } else {
                    this.messageService.showError("Operation Failed!");
                    this.growLife = 5000;
                }
                this.msgs = this.messageService.msgs;
                this.httpService.post('/bpd-proj/bpd/petMember/getTreeList', {
                    'projectId': this.changeProjectCode
                })
                    .subscribe(data => {
                        this.baseData = data.data;
                    })
            })
        this.userDetailDialog = false;
    }

    /**
     * 编辑确认
     * 
     * @memberof ArSubProject
     */
    editSave() {
        let data = {
            "roleCode": this.selectedRole,
            "parentMember": this.selectedParentUser,
            "userCode": this.changeUserCode,
            "projectType": this.changeProjectType,
            "description": this.dialogTextarea,
            "projectId": this.changeProjectCode,
            "petMemberCode": this.selectedData.petMemberCode
        }
        if (!this.editFlag) {
            data.roleCode = null;
        }
        this.httpService.post('/bpd-proj/bpd/petMember/update', data)
            .subscribe(data => {
                if (data.code == "1") {
                    this.messageService.showSuccess("Operation Success!");
                    this.growLife = 5000;
                } else if (data.code == "2") {
                    this.messageService.showInfo("User Code Exist");
                    this.growLife = 300000;
                } else if (data.code == "3") {
                    this.messageService.showInfo("User Code Exist");
                    this.growLife = 300000;
                } else if (data.code == "4") {
                    this.messageService.showInfo("You Can't Set A ChildNod Whitch It's FatherNod Is Itself");
                    this.growLife = 300000;
                } else if (data.code == "7") {
                    this.messageService.showInfo("You Can't Set A Parent To A Child!")
                    this.growLife = 300000;
                } else {
                    this.messageService.showError("Operation Failed!");
                    this.growLife = 5000;
                }
                this.msgs = this.messageService.msgs;
                this.httpService.post('/bpd-proj/bpd/petMember/getTreeList', {
                    'projectId': this.changeProjectCode
                })
                    .subscribe(data => {
                        this.baseData = data.data;
                    })
            })
        this.editDialog = false;
    }

    /**
     * 编辑取消
     * 
     * @memberof ArSubProject
     */
    editCancle() {
        this.editDialog = false;
    }

    /**
     * 搜索弹框
     * 
     * @memberof AuthorityList
     */
    searchClick() {
        this.editDialog = false;
        this.addDialog = false;
        this.searchDialog = true;
        this.userSelectDialog = true;
    }

    /**
     * 搜索确认
     * 
     * @memberof AuthorityList
     */
    // searchSave() {
    //     this.selectedUserName = this.changeUserName;
    //     this.searchDialog = false;
    //     if (this.searchFlag == "add") {
    //         this.addDialog = true;
    //     } else if (this.searchFlag == "edit") {
    //         this.editDialog = true;
    //     }
    // }

    /**
     * 搜索取消
     * 
     * @memberof AuthorityList
     */
    // searchCancle() {
    //     this.searchDialog = false;
    //     if (this.searchFlag == "add") {
    //         this.addDialog = true;
    //     } else if (this.searchFlag == "edit") {
    //         this.editDialog = true;
    //     }
    // }

    /**
     * 删除点击
     * 
     * @memberof ArSubProject
     */
    deleteClick(idx, data) {
        this.selectedData = data.data;
        // this.deleteDialog = true;
        this.deleteService.confirm(() => {
            this.httpService.get('/bpd-proj/bpd/petMember/delete?' + Number(new Date()) + '&petMemberCode=' + this.selectedData.petMemberCode)
                .subscribe(data => {
                    if (data.code == "1") {
                        this.growLife = 5000;
                        this.messageService.showSuccess("Operation Success!");
                    } else if (data.code == "2") {
                        this.messageService.showInfo(data.msg);
                        this.growLife = 300000;
                    } else if (data.code == "4") {
                        this.messageService.showInfo("You Can Not Delelet A Data Who Has Children")
                        this.growLife = 300000;
                    } else {
                        this.messageService.showError("Operation Failed!");
                        this.growLife = 5000;
                    }
                    this.msgs = this.messageService.msgs;
                    this.httpService.post('/bpd-proj/bpd/petMember/getTreeList', {
                        'projectId': this.changeProjectCode
                    })
                        .subscribe(data => {
                            this.baseData = data.data;
                        })
                })
        })
    }

    /**
     * 删除确认
     * 
     * @memberof ArSubProject
     */
    deleteYes() {
        this.httpService.get('/bpd-proj/bpd/petMember/delete?' + Number(new Date()) + '&petMemberCode=' + this.selectedData.petMemberCode)
            .subscribe(data => {
                if (data.code == "1") {
                    this.messageService.showSuccess("Operation Success!");
                    this.growLife = 5000;
                } else if (data.code == "2") {
                    this.messageService.showInfo(data.msg);
                    this.growLife = 300000;
                } else if (data.code == "4") {
                    this.messageService.showInfo("You Can Not Delelet A Data Who Has Children")
                    this.growLife = 300000;
                } else {
                    this.messageService.showError("Operation Failed!");
                    this.growLife = 5000;
                }
                this.msgs = this.messageService.msgs;
                this.httpService.post('/bpd-proj/bpd/petMember/getTreeList', {
                    'projectId': this.changeProjectCode
                })
                    .subscribe(data => {
                        this.baseData = data.data;
                    })
            })
        this.deleteDialog = false;
    }

    /**
     * 删除取消
     * 
     * @memberof ArSubProject
     */
    deleteNo() {
        this.deleteDialog = false;
    }

    showDetailClick(idx, data) {
        this.userDetailData = data.data;
        this.userDetailDialog = true;
    }

    exportClick() {
        let token = window.sessionStorage.getItem("access_token");
        let url: string = '/bpd-proj/bpd/petMember/exportExcel?projectId=' + this.changeProjectCode + "&petFlug=1&_=" + Number(new Date());
        if (token) {
            let realToken = token.substr(1, token.length - 2)
            url = url + "&accessToken=" + realToken;
        }
        window.location.href = url;
    }

    initClick() {
        this.httpService.get('/bpd-proj/bpd/program/loadPet?programId=' + this.changeProjectCode)
            .subscribe(data => {
                if (data.code == "1") {
                    this.messageService.showSuccess("Operation Success!");
                    this.growLife = 5000;
                    this.httpService.post('/bpd-proj/bpd/petMember/getTreeList', {
                        'projectId': this.changeProjectCode,
                        "petFlug": "1"
                    })
                        .subscribe(data => {
                            this.baseData = data.data;
                        })
                } else if (data.code == "2") {
                    this.messageService.showInfo(data.msg);
                    this.growLife = 300000;
                } else if (data.code == "4") {
                    this.messageService.showInfo("You Can Not Delelet A Data Who Has Children")
                    this.growLife = 300000;
                } else {
                    this.messageService.showError("Operation Failed!");
                    this.growLife = 5000;
                }
                this.msgs = this.messageService.msgs;
            })
    }
}
