import { Component, OnInit } from '@angular/core';
import 'style-loader!./role.scss';
import { ConfirmationService } from 'primeng/primeng';
import { HttpDataService } from '../../../service/http.service';
import { MessageService } from '../../../service/message.service';

@Component({
  selector: 'role',
  templateUrl: './role.html',
  providers: [HttpDataService, MessageService, ConfirmationService]
})
export class Role implements OnInit{

    public userRoot: boolean = true;

	public gridStore: any = [];

    public gridUserStore: any = [];

    public gridUserStoreLen: number;

    public gridUserStoreRows: any = '10';

    public gridUserStoreFirst: any = 0;

    public mainselectedStore: any = [];

	public roleStore: any = [];

    public selectedStore: any = [];

    public userStoreLen: number;

    public userStoreRows: any = '10';

    public userStoreFirst: any = 0;

    public userStorePage: any = 0;

	public selectedData: any = [];

	public setStatusDisplay: boolean = false;

	public roleNameValue: string;

	public roleCode: string = '';

	public DepartmentSearch: string = "";

    public userNameSearch: string = "";
    
    public employeeSearch: string = "";

    public roleDescriptionSearch: string = "";

    public allowShow: boolean = false;

    public msgs: any;

    public growLife: number = 5000;

    public userCodes: any;

    public roleTypeStore: any = [{'value':'PM','label':'PM'},{'value':'IM','label':'IM'},{'value':'PM/IM','label':'PM/IM'}];

    public roleType: string = 'PM';

    public roleTypeSearchStore: any = [{'value':null,'label':'Select'},{'value':'PM','label':'PM'},{'value':'IM','label':'IM'},{'value':'PM/IM','label':'PM/IM'}];

	constructor(private service: HttpDataService, private confirmationService: ConfirmationService, private msgservice: MessageService) {

	}
    
    ngOnInit() {
        if(!JSON.parse(window.localStorage.getItem("authorityData"))['Set Roles'] ||
            JSON.parse(window.localStorage.getItem("authorityData"))['Set Roles'] == 'false')
        {
            this.userRoot = false;
        }
        this.getRoleStore();
    }

    public editBtn(item) {
    	this.roleCode = item.roleCode;
        // this.userCodes = item.userCodes ? item.userCodes.split(",") : [];
        this.userCodes = [];
        for (let i = 0; i < this.selectedStore.length; i++) {
            if (this.selectedStore[i].userCode) {
                this.userCodes.push(this.selectedStore[i].userCode);
            }
        }
        this.DepartmentSearch = null;
        this.userNameSearch = null;
        this.employeeSearch = null;
    	this.service.post("/bpd-proj/bpd/user/getVList", {
        	"page": {
        		"page": 1,
        		"rows": 10
        	},
            "userCodes": this.userCodes,
            "departmentName": this.DepartmentSearch,
            "userName": this.userNameSearch,
            "employeeCode": this.employeeSearch
        })
        .subscribe(data1 => {
            this.setStatusDisplay = true;
            let data = data1.rows;
            this.gridUserStoreLen = data1.total;
        	this.gridUserStore = [];
    		for(let i = 0; i < data.length; i++) {
        		data[i].id = i + 1;
        	}
        	for(let i = 0; i < 10; i++) {
        		if(!data[i]) {
        			this.gridUserStore.push({
                        'ip': i
                    })
        		} else {
        			this.gridUserStore.push(data[i])
        		}
        	}
        });
    }

    public paginate(e) {
        this.service.post("/bpd-proj/bpd/user/getVList", {
            "page": {
                "page": e.page + 1,
                "rows": e.rows
            },
            "userCodes": this.userCodes,
            "departmentName": this.DepartmentSearch,
            "userName": this.userNameSearch,
            "employeeCode": this.employeeSearch
        })
        .subscribe(data1 => {
            let data = data1.rows;
            this.gridUserStoreLen = data1.total;
            this.gridUserStoreRows = e.rows;
            this.gridUserStoreFirst = e.first;
            this.gridUserStore = [];
            for(let i = 0; i < data.length; i++) {
                data[i].id = i + 1;
            }
            for(let i = 0; i < e.rows; i++) {
                if(!data[i]) {
                    this.gridUserStore.push({
                        'ip': i
                    })
                } else {
                    this.gridUserStore.push(data[i])
                }
            }
        });
    }

    public roleDisplay: boolean = false;
    public roleName: string = null;
    public description: string = null;
    public save: boolean = true;
    public saveChange: boolean = false;
    public roleItem: any;

    public add() {
        this.roleDisplay = true;
        this.save = true;
        this.saveChange = false;
        this.roleName = null;
        this.description = null;
        this.roleType = 'PM';
    }

    public editRoleBtn(item) {
        this.roleItem = item;
        this.roleDisplay = true;
        this.save = false;
        this.saveChange = true;
        this.roleName = item.roleName;
        this.description = item.roleDescription;
        this.roleType = item.roleType; 
    }

    public saveRoleBtn() {
        this.service.post("/bpd-proj/bpd/role/insert",{
            "roleName" : this.roleName,
            "roleDescription" :  this.description,
            "roleType": this.roleType,
            "roleFlag": "0"
        })
        .subscribe(data => {
            if(data['code'] == 1) {
                this.msgservice.showSuccess("Success");
                this.growLife = 5000;
                this.msgs = this.msgservice.msgs;
                this.getRoleStore();
                this.roleDisplay = false;
            } else {
               this.msgservice.showInfo("Role Name Exists!");
                this.growLife = 300000;
               this.msgs = this.msgservice.msgs; 
               this.getRoleStore();
            }
        })
    }

    public saveRoleChangeBtn() {
        this.service.post("/bpd-proj/bpd/role/update",{
            "roleCode" : this.roleItem.roleCode,
            "roleName" : this.roleName,
            "roleDescription" :  this.description,
            "roleType": this.roleType 
        })
        .subscribe(data => {
            if(data['code'] == 1) {
                this.msgservice.showSuccess("Success");
                this.growLife = 5000;
                this.msgs = this.msgservice.msgs;
                this.getRoleStore();
                this.roleDisplay = false;
            } else {
               this.msgservice.showInfo("Role Name Exists!");
                this.growLife = 300000;
               this.msgs = this.msgservice.msgs; 
            }
        })
    }

    public delRoleBtn(item) {
        this.confirmationService.confirm({
            message: 'Do You Want To Delete This Record?',
            header: 'Delete Confirmation',
            icon: 'fa fa-trash',
            accept: () => {
                this.service.get("/bpd-proj/bpd/role/delete?roleCode="+item.roleCode+"&"+Number(new Date()))
                .subscribe(data => {
                    if(data['code'] == 1) {
                        this.msgservice.showSuccess("Success");
                        this.growLife = 5000;
                        this.msgs = this.msgservice.msgs;
                        this.allowShow = false;
                        this.getRoleStore();
                    } else if(data['code'] == 2) {
                        this.msgservice.showInfo("Have User");
                        this.growLife = 300000;
                        this.msgs = this.msgservice.msgs;
                    } else {
                       this.msgservice.showError("Operation Error!");
                        this.growLife = 5000;
                       this.msgs = this.msgservice.msgs; 
                    }
                })
            }
        });
    }

    public roleNameSearch: string = "";

    public roleTypeSearch: string = "";

    public exportBtn() {
        let token = window.sessionStorage.getItem("access_token");
        let url: string = "/bpd-proj/bpd/role/exportExcel" + '?roleName=' + this.roleNameSearch + '&roleType=' + this.roleTypeSearch + '&roleDescription=' + this.roleDescriptionSearch + '&' + Number(new Date());
        if (token) {
            let realToken = token.substr(1, token.length - 2)
            url = url + "&accessToken=" + realToken;
        }
        window.location.href = url;
    }

    public roleSearchEnterSearch($event) {
        if ($event.key === "Enter") {
            this.roleSearch();
        }
    }
    
    public roleSearch() {
        this.getRoleStore();
    }

    public getRoleStore() {
        this.service.post("/bpd-proj/bpd/role/getVList",{
            roleName: this.roleNameSearch,
            roleDescription: this.roleDescriptionSearch,
            roleType: this.roleTypeSearch
        })
        .subscribe(data => {
            this.gridStore = [];
            for(let i = 0; i < data.length; i++) {
                data[i].id = i + 1;
            }
            if(data.length < 10) {
               for(let i = 0; i < 10; i++) {
                    if(!data[i]) {
                        this.gridStore.push({
                            "ip": i+1
                        })
                    } else {
                        this.gridStore.push(data[i])
                    }
                } 
            } else {
                for(let i=0; i<data.length; i++) {
                    this.gridStore.push(data[i])
                }
            }
        });
    }

    public selectionChange(e,item) {
        if(item.roleCode) {  //修改
            this.service.post("/bpd-proj/bpd/role/update",{
                "roleCode" : item.roleCode,
                "roleName" : item.roleName,
                "roleDescription" : item.roleDescription,
                "roleType": e.value 
            })
            .subscribe(data => {
                if(data['code'] == 1) {
                    this.msgservice.showSuccess("Success");
                    this.growLife = 5000;
                    this.msgs = this.msgservice.msgs;
                } else {
                   this.msgservice.showError("Operation Error!");
                    this.growLife = 5000;
                   this.msgs = this.msgservice.msgs; 
                }
            })
        }
    }

    public cancelBtn() {
    	this.setStatusDisplay = false;
    }

    public saveBtn() {
        this.setStatusDisplay = false;
    }

   public dbclick(event) {
        if(event.data.id) {
            this.allowShow = true;
            this.selectedStore.push(event.data);
            let userCode: string = event.data.userCode;
            this.service.post("/bpd-proj/bpd/role/addRoleUser", {
                "roleCode": this.roleCode,
                "userCode": userCode
            })
            .subscribe(data2 => {
                let e = {
                    page: this.userStorePage, 
                    first: this.userStoreFirst, 
                    rows: this.userStoreRows,
                    pageCount: Math.ceil(this.userStoreLen/this.userStoreRows)
                  }
                this.userPaginate(e);
                // this.reloadRoleGrid(this.roleCode);
                this.setStatusDisplay = false; 
                this.msgservice.showSuccess("Success");
                this.growLife = 5000;
                this.msgs = this.msgservice.msgs;
            })
        }

   }

    public search() {
    	let e = {page: 0, first: 0, rows: "10"};
        this.paginate(e);
    }

    public onRowClick(event) {
        if(event.data.id && event.data.roleCode) {
            this.roleCode = event.data.roleCode;
            let e = {
                page: 0, 
                first: 0, 
                rows: "10"
            }
            this.userPaginate(e); 
        } else {
            this.allowShow = false;
        }
    }

    public userPaginate(e) {
        this.service.post("/bpd-proj/bpd/user/userRole/getVList",{
            "page": {
                "page": e.page + 1,
                "rows": e.rows
            },
            "roleCode" : this.roleCode
        })
        .subscribe(data1 => {
            if(data1.rows.length > 0) {
                this.selectedStore = [];
                this.userStoreLen = data1.total;
                this.userStoreRows = e.rows;
                this.userStoreFirst = Number(e.first);
                this.userStorePage = e.page;
                let data = data1.rows;
                this.allowShow = true;
                for(let i = 0; i < data.length; i++) {
                    data[i].id = i + 1;
                }
                for(let i = 0; i < e.rows; i++) {
                    if(!data[i]) {
                        this.selectedStore.push({
                            "ip": i+1
                        })
                    } else {
                        this.selectedStore.push(data[i])
                    }
                }
            } else {
                this.allowShow = false;
            }
            
        })
    }

    public delBtn(item) {
        this.confirmationService.confirm({
            message: 'Do You Want To Delete This Record?',
            header: 'Delete Confirmation',
            icon: 'fa fa-trash',
            accept: () => {
                this.service.get("/bpd-proj/bpd/role/deleteByUserRoleCode?userCode="+item.userCode+"&roleCode="+this.roleCode+"&"+Number(new Date()))
                .subscribe(data => {
                    if(data['code'] == 1) {
                        this.msgservice.showSuccess("Success");
                        this.growLife = 5000;
                        this.msgs = this.msgservice.msgs;
                        let e = {
                            page: this.userStoreFirst == this.userStoreRows ? this.userStorePage - 1 : this.userStorePage, 
                            first: this.userStoreFirst == this.userStoreRows ? this.userStoreRows - this.userStoreFirst : this.userStoreFirst, 
                            rows: this.userStoreRows,
                            pageCount: this.userStoreFirst == this.userStoreRows ? Math.ceil(this.userStoreLen/this.userStoreRows) - 1 : Math.ceil(this.userStoreLen/this.userStoreRows)
                        }
                        this.userPaginate(e);
                        this.reloadRoleGrid(item.roleCode);
                    } else if(data['code'] == 2){
                        this.msgservice.showInfo("Project Code Exists!");
                        this.growLife = 300000;
                        this.msgs = this.msgservice.msgs;
                    } else {
                        this.msgservice.showError("Operation Error!");
                        this.growLife = 5000;
                        this.msgs = this.msgservice.msgs;
                    }
                })
            }
        });
    }

    public reloadRoleGrid(item) {
        this.service.post("/bpd-proj/bpd/role/getVList", {
            roleName: this.roleNameSearch,
            roleDescription: this.roleDescriptionSearch,
            roleType: this.roleTypeSearch
        })
        .subscribe(data => {
            this.gridStore = [];
            for(let i = 0; i < data.length; i++) {
                data[i].id = i + 1;
                if(data[i].roleCode == item) {
                    this.mainselectedStore = data[i];
                }
            }
            if(data.length < 10) {
               for(let i = 0; i < 10; i++) {
                    if(!data[i]) {
                        this.gridStore.push({
                            "ip": i+1
                        })
                    } else {
                        this.gridStore.push(data[i])
                    }
                } 
            } else {
                for(let i=0; i<data.length; i++) {
                    this.gridStore.push(data[i])
                }
            }
        });
    }
};