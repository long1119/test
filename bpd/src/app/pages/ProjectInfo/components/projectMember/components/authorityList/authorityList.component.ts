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
    @Input() changeProjectCode: string;
    @Input() changeProjectType: string;

    msgs: Message[];
    public growLife: number = 5000;
    RoleOption: SelectItem[] = [];
    parentUserOption: SelectItem[] = [];
    changeRoleCode: string;
    dialogUserName: string;
    dialogTextarea: string;
    selectedRole: string;
    selectedParentUser: string;
    selectedIndex: number;
    selectedData: any;
    selectedUserName: string;
    changeUserName: string;
    changeUserCode: string;

    addDialog: Boolean = false;
    editDialog: Boolean = false;
    searchDialog: Boolean = false;
    deleteDialog: Boolean = false;
    userSelectDialog: Boolean = false;
    searchFlag: string;
    public localStorageAuthority: Boolean;

    private userDetailData: any = {};
    private userDetailDialog: Boolean;

    constructor(private httpService: HttpDataService, private messageService: MessageService, private dataManageService: DataManageService, private deleteService: DeleteComfirmService) {

    }

    ngOnInit() {
        this.httpService.post('/bpd-proj/bpd/role/getCombobox', {})
            .subscribe(data => {
                this.RoleOption = data;
                this.selectedRole = data[0].value;
                this.dialogTextarea = data[0].label;
                this.changeRoleCode = data[0].value;
            })
        this.localStorageAuthority = this.dataManageService.buttonAuthority("Maintain Costbook member");

    }

    ngOnChanges(changes: SimpleChanges) {
        let timeStamp = new Date();
        if (this.changeProjectCode) {
            if (this.changeProjectType == "110") {
                this.httpService.get('/bpd-proj/bpd/petMember/getTreeVehicleList?projectId=' + this.changeProjectCode)
                    .subscribe(data => {
                        this.baseData = data.data;
                    })
            } else {
                this.httpService.post('/bpd-proj/bpd/petMember/getTreeList', {
                    "projectId": this.changeProjectCode
                })
                    .subscribe(data => {
                        this.baseData = data.data;
                    })
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
        console.log($event);
        this.changeUserCode = $event;
        this.userSelectDialog = false;
        this.selectedUserName = this.changeUserName;
        this.searchDialog = false;
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
        this.selectedUserName = this.changeUserName;
        this.searchDialog = false;
        if (this.searchFlag == "add") {
            this.addDialog = true;
        } else if (this.searchFlag == "edit") {
            this.editDialog = true;
        }
    }


    dropDownChange($event) {
        console.log($event);
        this.changeRoleCode = $event.value;
        this.changeUserCode = "";
        // this.changeUserName = "";
        for (let i = 0; i < this.RoleOption.length; i++) {
            if (this.RoleOption[i].value === $event.value) {
                this.dialogTextarea = this.RoleOption[i].label;
            }
        }
        this.selectedUserName = "";
    }

    /**
     * 添加点击
     * 
     * @memberof ArSubProject
     */
    addClick() {
        if (this.parentUserOption.length != 0) {
            this.selectedParentUser = this.parentUserOption[0].value;
        }
        if (this.RoleOption.length != 0) {
            this.selectedRole = this.RoleOption[0].value;
        }
        this.dialogUserName = "";
        this.dialogTextarea = "";
        this.addDialog = true;
        this.selectedUserName = "";
        this.changeUserCode = "";
        this.changeRoleCode = this.RoleOption[0].value;
        this.searchFlag = "add";
        this.httpService.get('/bpd-proj/bpd/petMember/getCombobox?' + Number(new Date()) + '&projectId=' + this.changeProjectCode)
            .subscribe(data => {
                data.unshift({
                    label: "none",
                    value: null
                })
                this.parentUserOption = data;
            })
    }

    /**
     * 添加确认
     * 
     * @memberof ArSubProject
     */
    addSave() {
        // console.log(this.selectedRole);
        this.httpService.post('/bpd-proj/bpd/petMember/insert', {
            "roleCode": this.selectedRole,
            "parentMember": this.selectedParentUser,
            "userCode": this.changeUserCode,
            // "userName": this.selectedUserName,
            "projectType": this.changeProjectType,
            "description": this.dialogTextarea,
            "projectId": this.changeProjectCode,
            "petFlug": "PQM"
        })
            .subscribe(data => {
                if (data.code == "1") {
                    this.messageService.showSuccess("Operation Success!");
                    this.growLife = 5000;
                } else if (data.code == "2") {
                    this.messageService.showInfo("Role Code Exists!");
                    this.growLife = 300000;
                } else if (data.code == "3") {
                    this.messageService.showInfo("Role Code Exists!");
                    this.growLife = 300000;
                } else if (data.code == "5") {
                    this.messageService.showInfo(data.message);
                    this.growLife = 300000;
                } else if (data.code == "4") {
                    this.messageService.showInfo("You Can't Set A ChildNod Whitch It's FatherNod Is Itself");
                    this.growLife = 300000;
                } else {
                    this.messageService.showError("Operation Failed!");
                    this.growLife = 5000;
                }
                this.msgs = this.messageService.msgs;
                if (this.changeProjectType == "110") {
                    this.httpService.get('/bpd-proj/bpd/petMember/getTreeVehicleList?projectId=' + this.changeProjectCode)
                        .subscribe(data => {
                            this.baseData = data.data;
                        })

                } else {
                    this.httpService.post('/bpd-proj/bpd/petMember/getTreeList', {
                        "projectId": this.changeProjectCode
                    })
                        .subscribe(data => {
                            this.baseData = data.data;
                        })
                }

            })
        this.addDialog = false;
    }

    /**
     * 添加取消
     * 
     * @memberof ArSubProject
     */
    addCancel() {
        this.addDialog = false;
    }

    /**
     * 编辑点击
     * 
     * @memberof ArSubProject
     */
    editClick(idx, data) {
        let editData = data;
        this.changeRoleCode = "";
        this.selectedData = data.data;
        this.dialogTextarea = data.data.description;
        this.selectedRole = data.data.roleCode;
        this.changeRoleCode = data.data.roleCode;
        this.changeUserCode = data.data.userCode;
        this.selectedParentUser = data.data.parentMember;
        this.dialogUserName = "";
        this.selectedUserName = data.data.userName;
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

    /**
     * 编辑确认
     * 
     * @memberof ArSubProject
     */
    editSave() {
        console.log(this.baseData[this.selectedIndex]);
        this.httpService.post('/bpd-proj/bpd/petMember/update', {
            "roleCode": this.selectedRole,
            "parentMember": this.selectedParentUser,
            "userCode": this.changeUserCode,
            "description": this.dialogTextarea,
            "projectId": this.changeProjectCode,
            "petMemberCode": this.selectedData.petMemberCode
        })
            .subscribe(data => {
                if (data.code == "1") {
                    this.messageService.showSuccess("Operation Success!");
                    this.growLife = 5000;
                } else if (data.code == "2") {
                    this.messageService.showInfo("User Code Exist");
                    this.growLife = 300000;
                } else if (data.code == "3") {
                    this.messageService.showInfo("PQM Code Exist");
                    this.growLife = 300000;
                } else if (data.code == "4") {
                    this.messageService.showInfo("You Can't Set A ChildNod Whitch It's FatherNod Is Itself");
                    this.growLife = 300000;
                } else {
                    this.messageService.showError("Operation Failed!");
                    this.growLife = 5000;
                }
                this.msgs = this.messageService.msgs;
                if (this.changeProjectType == "110") {
                    this.httpService.get('/bpd-proj/bpd/petMember/getTreeVehicleList?projectId=' + this.changeProjectCode)
                        .subscribe(data => {
                            this.baseData = data.data;
                        })

                } else {
                    this.httpService.post('/bpd-proj/bpd/petMember/getTreeList', {
                        "projectId": this.changeProjectCode
                    })
                        .subscribe(data => {
                            this.baseData = data.data;
                        })
                }

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
        // console.log(data);
        this.selectedData = data.data;
        // this.deleteDialog = true;
        this.deleteService.confirm(() => {
            let timeStamp = new Date();
            this.httpService.get('/bpd-proj/bpd/petMember/delete?' + timeStamp.getTime() + '&petMemberCode=' + this.selectedData.petMemberCode)
                .subscribe(data => {
                    if (data.code == "1") {
                        this.messageService.showSuccess("Operation Success!");
                        this.growLife = 5000;
                    } else if (data.code == "4") {
                        this.messageService.showInfo("You Can Not Delelet A Data Who Has Children")
                        this.growLife = 300000;
                    } else if (data.code == "2") {
                        this.messageService.showInfo(data.msg);
                    } else {
                        this.messageService.showError("Operation Failed!");
                        this.growLife = 5000;
                    }
                    this.msgs = this.messageService.msgs;
                    if (this.changeProjectType == "110") {
                        this.httpService.get('/bpd-proj/bpd/petMember/getTreeVehicleList?projectId=' + this.changeProjectCode)
                            .subscribe(data => {
                                this.baseData = data.data;
                            })

                    } else {
                        this.httpService.post('/bpd-proj/bpd/petMember/getTreeList', {
                            "projectId": this.changeProjectCode
                        })
                            .subscribe(data => {
                                this.baseData = data.data;
                            })
                    }
                })
        })
    }

    /**
     * 删除确认
     * 
     * @memberof ArSubProject
     */
    deleteYes() {
        let timeStamp = new Date();
        this.httpService.get('/bpd-proj/bpd/petMember/delete?' + timeStamp.getTime() + '&petMemberCode=' + this.selectedData.petMemberCode)
            .subscribe(data => {
                if (data.code == "1") {
                    this.messageService.showSuccess("Operation Success!");
                    this.growLife = 300000;
                } else if (data.code == "4") {
                    this.messageService.showInfo("You Can Not Delelet A Data Who Has Children")
                    this.growLife = 300000;
                } else {
                    this.messageService.showError("Operation Failed!");
                    this.growLife = 5000;
                }
                this.msgs = this.messageService.msgs;
                if (this.changeProjectType == "110") {
                    this.httpService.get('/bpd-proj/bpd/petMember/getTreeVehicleList?projectId=' + this.changeProjectCode)
                        .subscribe(data => {
                            this.baseData = data.data;
                        })

                } else {
                    this.httpService.post('/bpd-proj/bpd/petMember/getTreeList', {
                        "projectId": this.changeProjectCode
                    })
                        .subscribe(data => {
                            this.baseData = data.data;
                        })
                }
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
}
