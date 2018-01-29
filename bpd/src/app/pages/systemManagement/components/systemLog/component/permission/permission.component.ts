import {
    Component,
    OnInit,
    Input,
    OnChanges,
    SimpleChanges
} from '@angular/core';

import {
    SelectItem,
    Message,
    TreeNode
} from 'primeng/primeng';

import 'style-loader!./permission.scss';

import {
    HttpDataService
} from '../../../../../service/http.service';
import {
    MessageService
} from '../../../../../service/message.service';
import {
    DataManageService
} from '../../../../../service/dataManage.service';

@Component({
    selector: 'permission',
    templateUrl: './permission.html'
})

export class Permission {

    // 页面数据
    @Input() selectedRole: string;
    public selectedManagement: string = "";
    public managementCheckBoxs: string[] = [];
    public managementCheckBoxsOne: any[] = [];
    public managementCheckBoxsTwo: any[] = [];
    public managementCheckBoxsThree: any[] = [];
    public magementDialog: Boolean = false;
    public permissionData: TreeNode[];
    public selectedPermission: any[] = [];
    public selectedValues: string[] = [];
    public selectedSelfValues: string;
    public selectedValue: any[] = [];
    public selectionMode: string;
    public selectedId: string;
    public setPersonalAuthority: Boolean = false;
    public msgs: Message[];
    public growLife: number = 5000;
    public localStorageAuthority: Boolean;
    public showSpecialFlag: string;
    private allAuthority: any[] = [];


    constructor(private httpService: HttpDataService, private messageService: MessageService, private dataManageService: DataManageService) {
        this.permissionData = [{
            data: {}
        }];

        this.selectionMode = "checkbox";
    }

    ngOnInit() {
        this.httpService.get('data/authority.json')
            .subscribe(data => {
                this.allAuthority = this.allAuthority.concat(data.specialRegion).concat(data.specialPlatForm).concat(data.noSpecial);
            })

        this.httpService.post('/bpd-proj/bpd/menuPermission/getTreeList', {
            "menuType": "1"
        })
            .subscribe(data => {
                this.permissionData = data.data;
                this.getReview(data.data);
            })
        this.localStorageAuthority = this.dataManageService.buttonAuthority("Set Authority");
    }

    ngOnChanges(changes: SimpleChanges) {
        this.getReview(this.permissionData);
    }

    getReview(data) {
        let treeData: any = data;
        if (this.selectedRole) {
            this.httpService.get('/bpd-proj/bpd/rolePermission/getPermIdsByRoleCodeAndRolePermType?' + Number(new Date()) + '&roleCode=' + this.selectedRole + '&rolePermType=1')
                .subscribe(data => {
                    // console.log(this.permissionData);
                    // 选中树表回显
                    this.selectedPermission = [];
                    if (data.length != 0) {
                        for (let i = 0; i < data.length; i++) {
                            // 循环树表方法
                            this.selectedPermission.concat(this.dataManageService.treeCircle(data[i], "id", treeData, this.selectedPermission));
                        }
                    }
                })
        }
    }


    /**
     * 多选框与单选框互斥
     * 
     * @memberof Permission
     */
    onRadioClick() {
        // if (this.selectedValue !== "sgm01") {
        //     // this.selectedValues = [];
        //     // this.setPersonalAuthority = false;
        //     // this.selectedSelfValues = "";
        // }
        // if (this.selectedSelfValues !== "sgm04") {
        //     this.setPersonalAuthority = true;
        // } else {
        //     this.selectedValues = [];
        //     this.setPersonalAuthority = false;
        // }
        // this.selectedValues = [];
        if (this.selectedSelfValues !== "sgm05") {
            this.setPersonalAuthority = true;
        } else {
            this.selectedValues = [];
            this.setPersonalAuthority = false;
        }
    }

    onSelfCheckboxChange($event) {
        // this.selectedValue = [];
        // let flag = true;
        // for (let i = 0; i < this.selectedSelfValues.length; i++) {
        //     if (this.selectedSelfValues == "sgm03") {
        //         flag = false;
        //     }
        // }
        // if (!flag) {
        //     this.setPersonalAuthority = true;
        // } else {
        //     this.selectedValues = [];
        //     this.setPersonalAuthority = false;
        // }
        if (this.selectedValue.length !== 0 && this.showSpecialFlag === "Special Platform") {
            this.selectedValues = [];
        }
    }

    setSelection(data) {
        let selfData: string = "";
        let otherData: any = [];
        let eventData: any = [];
        for (let i = 0; i < data.length; i++) {
            if (data[i] == "sgm01") {
                eventData.push(data[i]);
            } else if (data[i] == "sgm04" || data[i] == "sgm05") {
                selfData = data[i];
            } else if (data[i] != "sgm01" && data[i] != "sgm02" && data[i] != "sgm03" && data[i] != "sgm04" && data[i] != "sgm05") {
                otherData.push(data[i]);
            }
        }
        return {
            eventData: eventData,
            otherData: otherData,
            selfData: selfData
        };
    }

    onCheckboxChange($event) {
        // this.selectedValue = "";
        if (this.showSpecialFlag === "Special Platform") {
            this.selectedValue = [];
        }
    }

    /**
     * 权限信息编辑
     * 
     * @memberof Permission
     */
    editAuthorization() {

    }

    getParentId(data, ids = []) {
        let newIds: any[] = [];
        let selectedIds: any = ids;
        for (let i = 0; i < data.length; i++) {
            if (data[i].data.parentId) {
                // newIds.concat(this.dataManageService.treeCircle(data[i].data.parentId, "id", this.permissionData, newIds));
            }
            selectedIds.push(data[i].data.id);
        }
        if (newIds.length !== 0) {
            this.getParentId(newIds, selectedIds);
        } else {
            return selectedIds;
        }
    }

    /**
     * 保存权限信息
     * 
     * @memberof Permission
     */
    saveAuthorization() {
        let ids: any = [];
        // let selectedIds: any = [];
        let newIds: any = [];
        let newObj: any = {};
        // ids = this.getParentId(this.selectedPermission, []);
        for (let _i = 0, _a = this.selectedPermission; _i < _a.length; _i++) {
            ids.push(_a[_i].data.id);
        }
        // 去重
        for (let i = 0; i < ids.length; i++) {
            if (!newObj[ids[i]]) {
                newIds.push(ids[i]);
                newObj[ids[i]] = 1;
            }
        }

        ids = newIds.join(",")
        this.httpService.post('/bpd-proj/bpd/rolePermission/batchAddBeforeDelete?', {
            permIds: ids,
            roleCode: this.selectedRole,
            rolePermType: 1
        })
            .subscribe(data => {
                if (data.code == 1) {
                    this.messageService.showSuccess("Operation Success!");
                    this.growLife = 5000;
                } else {
                    this.messageService.showError("Operation Failed!");
                    this.growLife = 5000;
                }
                this.msgs = this.messageService.msgs;
            })
    }

    private setSpecialData(data: any[] = []) {
        if (data.length != 0) {
            for (let i = 0; i < Math.floor(data.length / 3); i++) {
                this.managementCheckBoxsOne.push(data[i]);
            }
            for (let i = Math.floor(data.length / 3); i < Math.floor(data.length / 3) * 2; i++) {
                this.managementCheckBoxsTwo.push(data[i]);
            }
            for (let i = Math.floor(data.length / 3) * 2; i < data.length; i++) {
                this.managementCheckBoxsThree.push(data[i]);
            }
        }
    }
    /**
     * 弹框显示事件
     * 
     * @param {any} data 
     * @memberof Permission
     */
    authorityClick($event, data) {
        let authorityData = data;
        this.showSpecialFlag = "";
        this.httpService.get('data/authority.json')
            .subscribe(data => {

                // for ()
                // console.log(JSON.parse(data).specialRegion);
                // console.log(data.specialRegion);
                for (let i = 0; i < data.specialRegion.length; i++) {
                    if (authorityData.data.permMenuSign == data.specialRegion[i]) {
                        this.showSpecialFlag = "Special Region";
                        this.httpService.get('/bpd-proj/bpd/regionCategory/getCombobox')
                            .subscribe(data => {
                                this.setSpecialData(data);
                                // this.managementCheckBoxs = data;
                            })
                    }
                }
                for (let k = 0; k < data.specialPlatForm.length; k++) {
                    if (authorityData.data.permMenuSign == data.specialPlatForm[k]) {
                        this.showSpecialFlag = "Special Platform";
                        this.httpService.post('/bpd-proj/bpd/program/getModelPlatform', {})
                            .subscribe(data => {
                                this.setPersonalAuthority = true;
                                let newData: any[] = [];
                                for (let i = 0; i < data.length; i++) {
                                    newData.push({
                                        label: data[i],
                                        value: data[i]
                                    });
                                }
                                this.setSpecialData(newData);
                                // this.managementCheckBoxs = data;
                            })
                    }
                }
            })
        // 阻止事件冒泡
        let e = $event || window.event;
        if (e.stopPropagation) {
            e.stopPropagation(); //W3C 
        } else {
            e.cancelBubble = true; //IE 
        }
        this.selectedManagement = data.data.ename;
        this.managementCheckBoxsOne = [];
        this.managementCheckBoxsTwo = [];
        this.managementCheckBoxsThree = [];
        this.selectedValue = [];
        this.selectedValues = [];
        this.selectedSelfValues = "";
        this.setPersonalAuthority = false;
        // if (data.data.isData == "1") {
        //     this.httpService.post('/bpd-proj/bpd/program/getModelPlatform', {})
        //         .subscribe(data => {
        //             if (data.length != 0) {
        //                for (let i = 0; i < Math.ceil(data.length / 3); i++) {
        //                    this.managementCheckBoxsOne.push(data[i]);
        //                }
        //                for (let i = Math.ceil(data.length / 3); i < Math.floor(data.length / 3 * 2); i++) {
        //                    this.managementCheckBoxsTwo.push(data[i]);
        //                }
        //                for (let i  = Math.ceil(data.length / 3 * 2); i < data.length; i++) {
        //                    this.managementCheckBoxsThree.push(data[i]);
        //                }
        //             }
        //             this.managementCheckBoxs = data;
        //         })
        // }
        // else if (data.data.permType == "2") {
        //     this.httpService.get('/bpd-proj/bpd/regionCategory/getCombobox')
        //         .subscribe(data => {
        //             if (data.length != 0) {
        //                for (let i = 0; i < Math.floor(data.length / 3); i++) {
        //                    this.managementCheckBoxsOne.push(data[i]);
        //                }
        //                for (let i = Math.floor(data.length / 3); i < Math.floor(data.length / 3) * 2; i++) {
        //                    this.managementCheckBoxsTwo.push(data[i]);
        //                }
        //                for (let i  = Math.floor(data.length / 3) * 2; i < data.length; i++) {
        //                    this.managementCheckBoxsThree.push(data[i]);
        //                }
        //             }
        //             this.managementCheckBoxs = data;
        //         })

        // }
        this.httpService.get('/bpd-proj/bpd/dataPermConfig/getDataPermIdsByPermIdAndRoleCode?' + Number(new Date()) + '&permId=' + data.data.id + '&roleCode=' + this.selectedRole)
            .subscribe(data => {
                if (data.length != 0) {
                    // if (data[0] != "noLimited" || "currentRegion") {
                    //     this.selectedValues = data;
                    // } else {
                    //     this.selectedValue = data[0];
                    // }
                    for (let i = 0; i < data.length; i++) {
                        if (data[i] == "sgm05") {
                            this.setPersonalAuthority = true;
                        }
                    }
                    // if (data[0] == "sgm01") {
                    // this.selectedValue.push(data[0]);
                    // } else {
                    let reData = this.setSelection(data);
                    this.selectedValue = reData.eventData;
                    this.selectedSelfValues = reData.selfData;
                    this.selectedValues = reData.otherData;
                    // }
                } else {
                    this.selectedSelfValues = "sgm04";
                }
            })
        this.selectedId = data.data.id;
        this.magementDialog = true;
    }

    /**
     * 权限修改确认
     * 
     * @memberof Permission
     */
    authoritySave() {
        // console.log(this.selectedValues);
        let permBuissIds: string = "";
        if (this.showSpecialFlag === "Special Region") {
            if (this.selectedValue[0] == "sgm01") {
                if (this.selectedValues.length != 0) {
                    permBuissIds = this.selectedValue[0] + "," + this.selectedSelfValues + "," + this.selectedValues.join(",");
                } else {
                    permBuissIds = this.selectedValue[0] + "," + this.selectedSelfValues;
                }
            } else {
                permBuissIds = "sgm02,sgm03" + "," + this.selectedSelfValues + "," + this.selectedValues.join(",");
            }
        } else {
            // permBuissIds =  "sgm02,sgm03" + "," + this.selectedSelfValues +  "," + this.selectedValues.concat(this.selectedValue).join(",");
            if (this.selectedValue[0] != "sgm01") {
                if (this.selectedValues.length != 0) {
                    permBuissIds = "sgm02,sgm03,sgm05" + "," + this.selectedValues.join(",");
                } else {
                    permBuissIds = "sgm02,sgm03";
                }
            } else {
                if (this.selectedValues.length !== 0) {
                    permBuissIds = this.selectedValue[0] + ",sgm04," + this.selectedValues.join(",");
                } else {
                    permBuissIds = this.selectedValue[0] + ",sgm04";
                }
            }
        }
        this.httpService.post('/bpd-proj/bpd/dataPermConfig/batchAddBeforeDelete?', {
            permId: this.selectedId,
            permBuissIds: permBuissIds,
            roleCode: this.selectedRole
        })
            .subscribe(data => {
                if (data.code == 1) {
                    this.messageService.showSuccess("Operation Success!");
                    this.growLife = 5000;
                } else {
                    this.messageService.showError("Operation Failed!");
                    this.growLife = 5000;
                }
                this.msgs = this.messageService.msgs;
            })
        this.magementDialog = false;
    }
    /**
     * 权限修改取消
     * 
     * @memberof Permission
     */
    authorityCancel() {
        this.magementDialog = false;
    }

    /**
     * 树表行选中事件
     * 
     * @param {any} $event 
     * @memberof Permission
     */
    nodeSelect($event) {
        let temp: any = {};
        let newArr: any[] = [];
        for (let i = 0; i < this.selectedPermission.length; i++) {
            if (!temp[this.selectedPermission[i].data.id]) {
                newArr.push(this.selectedPermission[i]);
                temp[this.selectedPermission[i].data.id] = i;
            }
        }
        this.selectedPermission = newArr;
    }
    // console.log(this.selectedPermission);
    isDateFlag($event) {
        for (let i = 0; i < this.allAuthority.length; i++) {
            if ($event == this.allAuthority[i]) {
                return true;
            }
        }
        return false;
    }
}