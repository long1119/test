import { Component, OnInit } from '@angular/core';
import 'style-loader!./user.scss';
import { SelectItem } from 'primeng/primeng';
import { HttpDataService } from '../../../service/http.service';
import { MessageService } from '../../../service/message.service';

@Component({
  selector: 'user',
  templateUrl: './user.html',
  providers: [HttpDataService, MessageService]
})
export class User implements OnInit{

    public userRoot: boolean = true;

	public gridStore: any = [];

    public gridStoreLen: number;

    public gridStoreRows: any = '15';

    public gridStoreFirst: any = 0;

	public roleStore: any = [];

	public setStatusDisplay: boolean = false;

	public isChecked: boolean = false;

	public DepartmentSearch: string = null;

	public userNameSearch: string = null;

    public employeeSearch: string = null;

	public roleNameSearch: string = '';

	public roleCodes: string = '';

	public userCode: string = '';

	public roleCodeArr: any = [];

    public msgs: any;

    public growLife: number = 5000;

    public roleTypeSearch: string = null;

    public roleTypeSearchStore: any = [{'value':null,'label':'Select'},{'value':'PM','label':'PM'},{'value':'IM','label':'IM'},{'value':'PM/IM','label':'PM/IM'}];

	constructor(private service: HttpDataService, private msgservice: MessageService) {

	}
    
    ngOnInit() {
        if(!JSON.parse(window.localStorage.getItem("authorityData"))["Maintain User"] || 
            JSON.parse(window.localStorage.getItem("authorityData"))["Maintain User"] == 'false')
        {
            this.userRoot = false;
        }
    	let observable = this.service.post("/bpd-proj/bpd/user/getVList", {
        	"page": {
        		"page": 1,
        		"rows": 15
        	},
            "departmentName": this.DepartmentSearch,
            "userName": this.userNameSearch,
            "employeeCode": this.employeeSearch
        })
        .subscribe(data1 => {
            let data = data1.rows;
            this.gridStoreLen = data1.total;
    		for(let i = 0; i < data.length; i++) {
        		data[i].id = i + 1;
        	}
        	for(let i = 0; i < 15; i++) {
        		if(!data[i]) {
        			this.gridStore.push({
                        'ip': i
                    })
        		} else {
        			this.gridStore.push(data[i])
        		}
        	}
        }, err => {
        	for(let i = 0; i < 15; i++) {
	    		if(!this.gridStore[i]) {
	    			this.gridStore.push({
                        'ip': i
                    })
	    		}
	    	}
        });
    }



    public paginate(e) {
        let observable = this.service.post("/bpd-proj/bpd/user/getVList", {
            "page": {
                "page": e.page + 1,
                "rows": e.rows
            },
            "departmentName": this.DepartmentSearch,
            "userName": this.userNameSearch,
            "employeeCode": this.employeeSearch
        })
        .subscribe(data1 => {
            let data = data1.rows;
            this.gridStoreLen = data1.total;
            this.gridStoreRows = e.rows;
            this.gridStoreFirst = e.first;
            this.gridStore = [];
            for(let i = 0; i < data.length; i++) {
                data[i].id = i + 1;
            }
            for(let i = 0; i < e.rows; i++) {
                if(!data[i]) {
                    this.gridStore.push({
                        'ip': i
                    })
                } else {
                    this.gridStore.push(data[i])
                }
            }
        });
    }

    public editBtn(item) {
    	this.userCode = item.userCode;
    	this.roleCodes = item.roleCodes;
    	this.roleCodeArr = item.roleCodes ? item.roleCodes.split(",") : [];
    	this.service.post("/bpd-proj/bpd/role/getList", {})
    	.subscribe(data => {
            if(data.length) {
                this.roleStore = [];
                if(data.length < 10) {
                    for(let i = 0; i < 10; i++) {
                        if(!data[i]) {
                            this.roleStore.push({
                                ip: i
                            })
                        } else {
                            this.roleStore.push(data[i])
                        }
                    }
                } else {
                    this.roleStore = data;
                }
                for(let i = 0; i < data.length; i++) {
                    data[i].id = i + 1;
                    if(item.roleCodes){
                        if(item.roleCodes.split(',').indexOf(data[i].roleCode) != -1) {
                            data[i].isChecked = true;
                        } else {
                            data[i].isChecked = false;
                        }
                    } else {
                        data[i].isChecked = false;
                    }
                }
            }
            this.setStatusDisplay = true;
    	})
    }

    public cancelBtn() {
    	this.setStatusDisplay = false;
    }

    public checkbox(item) {
    	if(this.roleCodeArr.indexOf(item.roleCode) == -1) {
    		this.roleCodeArr.push(item.roleCode)
    	} else {
    		this.roleCodeArr.splice(this.roleCodeArr.indexOf(item.roleCode),1)
    	}
    }

    public searchEnterSearch($event) {
        if ($event.key === "Enter") {
            this.search();
        }
    }
    
    public search() {
        let e = {page: 0, first: 0, rows: "15"};
        this.paginate(e);
    }

    public roleSearchEnterSearch($event) {
        if ($event.key === "Enter") {
            this.roleSearch();
        }
    }

    public roleSearch() {
    	this.service.post("/bpd-proj/bpd/role/getList", {
    		"roleName": this.roleNameSearch,
            "roleType": this.roleTypeSearch
    	})
    	.subscribe(data => {
            if(data.length) {
                this.roleStore = [];
                if(data.length < 10) {
                    for(let i = 0; i < 10; i++) {
                        if(!data[i]) {
                            this.roleStore.push({
                                ip: i
                            })
                        } else {
                            this.roleStore.push(data[i])
                        }
                    }
                } else {
                    this.roleStore = data;
                }
                for(let i = 0; i < data.length; i++) {
                    data[i].id = i + 1;
                    if(this.roleCodeArr){
                        if(this.roleCodeArr.indexOf(data[i].roleCode) != -1) {
                            data[i].isChecked = true;
                        } else {
                            data[i].isChecked = false;
                        }
                    } else {
                        data[i].isChecked = false;
                    }
                }
            } else {
                this.roleStore = [];
                for(let i = 0; i < 10; i++) {
                    this.roleStore.push({
                        ip: i
                    })
                }
            }
    	})
    }

    public saveBtn() {
    	let roleCodes = this.roleCodeArr.join(",");
    	this.service.get("/bpd-proj/bpd/user/userRole/updateUserRoles?userCode="+this.userCode+"&roleCodes="+roleCodes+"&"+Number(new Date()))
    	.subscribe(data => {
            if(data['code'] == 1) {
                this.msgservice.showSuccess("Success");
                this.growLife = 5000;
                this.msgs = this.msgservice.msgs;
                this.setStatusDisplay = false;
                let e = {page: 0, first: 0, rows: "15"};
                this.paginate(e);
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

    //  新增同步用户
    public addDisplay: boolean = false;
    public userNameHrSearch: string = "";
    public employeeHrSearch: string = "";
    public hrUserStore: any = [];
    public hrGridStoreLen: number;
    public hrGridStoreRows: any = '10';
    public hrGridStoreFirst: any = 0;
    public addBtn() {
        this.userNameHrSearch = "";
        this.employeeHrSearch = "";
        this.hrUserStore = [{ip:1},{ip:2},{ip:3},{ip:4},{ip:5},{ip:6},{ip:7},{ip:8},{ip:9},{ip:10}];
        this.addDisplay = true;
    }

    public hrSearchEnterSearch(event) {
        if (event.key === "Enter") {
            if(this.employeeHrSearch || this.userNameHrSearch) {
                let e = {page: 0, first: 0, rows: "10"};
                this.hrPaginate(e);
            } else {
                this.msgservice.showInfo("Please Fill UserName/Employee ID!");
                this.growLife = 300000;
                this.msgs = this.msgservice.msgs;
                this.hrUserStore = [{ip:1},{ip:2},{ip:3},{ip:4},{ip:5},{ip:6},{ip:7},{ip:8},{ip:9},{ip:10}];
            }
        }
    }

    public hrPaginate(e) {
        let observable = this.service.post("/bpd-proj/bpd/user/getHrUserList", {
            "page": {
                "page": e.page + 1,
                "rows": e.rows
            },
            "employeeCode": this.employeeHrSearch,
            "userName": this.userNameHrSearch,
            "userFlag": "1"
        })
        .subscribe(data1 => {
            let data = data1.rows;
            if(data.length == 0) {
                this.msgservice.showInfo("No User!");
                this.growLife = 300000;
                this.msgs = this.msgservice.msgs;
                this.hrUserStore = [{ip:1},{ip:2},{ip:3},{ip:4},{ip:5},{ip:6},{ip:7},{ip:8},{ip:9},{ip:10}];
                return;
            }
            this.hrGridStoreLen = data1.total;
            this.hrGridStoreRows = e.rows;
            this.hrGridStoreFirst = e.first;
            this.hrUserStore = [];
            for(let i = 0; i < data.length; i++) {
                data[i].id = i + 1;
            }
            for(let i = 0; i < e.rows; i++) {
                if(!data[i]) {
                    this.hrUserStore.push({
                        'ip': i
                    })
                } else {
                    this.hrUserStore.push(data[i])
                }
            }
        }, err => {
            for(let i = 0; i < 10; i++) {
                if(!this.hrUserStore[i]) {
                    this.hrUserStore.push({
                        'ip': i
                    })
                }
            }
        });
    }

    public dbclick(e) {
        if(e.data.userCode) {
            this.service.post("/bpd-proj/bpd/user/update",{
                userCode: e.data.userCode
            })
            .subscribe(data => {
                if(data['code'] == 1) {
                    this.msgservice.showSuccess("Success");
                    this.growLife = 5000;
                    this.msgs = this.msgservice.msgs;
                    this.addDisplay = false;
                } else {
                    this.msgservice.showInfo("User Code Exists!");
                    this.growLife = 300000;
                    this.msgs = this.msgservice.msgs;
                }
            })
        }
    }

};