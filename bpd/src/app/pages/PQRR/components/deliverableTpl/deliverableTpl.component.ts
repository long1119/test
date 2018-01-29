import { Component, OnInit } from '@angular/core';
import 'style-loader!./deliverableTpl.scss';
import { SelectItem, TreeNode, MenuItem, ConfirmationService } from 'primeng/primeng';
import { HttpDataService } from '../../../service/http.service';
import { MessageService } from '../../../service/message.service';
import { DataManageService } from '../../../service/dataManage.service';

@Component({
  selector: 'deliverable-tpl',
  templateUrl: './deliverableTpl.html',
  providers: [HttpDataService, MessageService, DataManageService, ConfirmationService]
})
export class DeliverableTpl implements OnInit{

    public msgs: any;

    public gridStore: any = [];

    public gridStoreLen: number;

    public gridStoreRows: any = '15';

    public gridStoreFirst: any = 0;

    public PQRRSerchStore: any = [];

    public PQRRSerch: string = null;

    public departmentSerchStore: any = [];

    public departmentSerch: string = null;

    public display: boolean = false;

    public save: boolean = true;

    public saveChange: boolean = false;

    public addDialog: boolean = false;

    public messageDialog: boolean = false;

    public messageData: any = [];

    public uploadURL: string = '/bpd-proj/bpd/projectCostBook/importExcel';

    public PQRRMilestoneStore: any = [];

    public departmentStore: any = [];

    public PQRRMilestone: string = '';

    public department: string = '';

    public templateFile: string = '';

    public description: string = '';

    public delivTempId: string = '';

    public owner: string = '';

    public ownerCode: string = '';

    public roleStore: any = [];

    public roleStoreLen: number;
    
    public roleDisplay: boolean = false;

    public userRoot: boolean = true;

    public loginUser: string = "";

	constructor(private service: HttpDataService, private confirmationService: ConfirmationService, private msgservice: MessageService, private dataManageService: DataManageService) {
	}
    
    ngOnInit() {
        this.loginUser = window.localStorage.getItem('user');
        if(!JSON.parse(window.localStorage.getItem("authorityData"))["Maintain Deliverable Template"] || 
            JSON.parse(window.localStorage.getItem("authorityData"))["Maintain Deliverable Template"] == 'false')
        {
            this.userRoot = false;
        }
        this.service.post("/bpd-proj/bpd/delivTemp/getPqrrCombobox",{})
        .subscribe(data => {
            this.PQRRSerchStore = data;
            this.PQRRSerchStore.unshift({
                label: 'All',
                value: null
            })
            this.PQRRSerch = null;
        })
        this.service.post("/bpd-proj/bpd/delivTemp/getDptCombobox",{})
        .subscribe(data => {
            this.departmentSerchStore = data;
            this.departmentSerchStore.unshift({
                label: 'All',
                value: null
            })
            this.departmentSerch = null;
        })
    	this.service.post("/bpd-proj/bpd/delivTemp/getVList",{
    		"page": {
                "page": 1,
                "rows": 15
            },
            "pqrrMilestone": this.PQRRSerch,
            "deptId": this.departmentSerch
    	})
    	.subscribe(data1 => {
    		this.getAjax(data1);
    	})
    }

    public selectionLeftChange(event) {    // 下拉框change事件
        this.PQRRSerch = event.value;
        let e = {page: 0, first: 0, rows: "15"};
        this.paginate(e);
    }

    public selectionRightChange(event) {   // 下拉框change事件
        this.departmentSerch = event.value;
        let e = {page: 0, first: 0, rows: "15"};
        this.paginate(e);
    }

    public getAjax(data1) {   // 获取主表ajax
    	let data = data1.rows;
		this.gridStoreLen = data1.total;
		this.gridStore = [];
		for(let i = 0; i < data.length; i++) {
            data[i].id = i + 1;
        }
        for(let i = 0; i < 15; i++) {
            if(!data[i]) {
                this.gridStore.push({
                    "ip": i+1
                })
            } else {
                this.gridStore.push(data[i])
            }
        }
    }

    public paginate(e) {    // 分页
    	this.service.post("/bpd-proj/bpd/delivTemp/getVList",{
    		"page": {
                "page": e.page + 1,
                "rows": e.rows
            },
            "pqrrMilestone": this.PQRRSerch,
            "deptId": this.departmentSerch
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
	                    "ip": i+1
	                })
	            } else {
	                this.gridStore.push(data[i])
	            }
	        }
    	})
    }
 
    public tplDownload(item) {  // 下载模版
        this.service.get('/bpd-proj/bpd/att/downloadByBusinessId?businessId='+item.delivTempId)
        .subscribe(data => {
            if(data['code'] == 0) {
                this.msgservice.showInfo("Can Not Find File!");
                this.msgs = this.msgservice.msgs; 
            } else {
                let token = window.sessionStorage.getItem("access_token");
                let url: string = '/bpd-proj/bpd/att/downloadByBusinessId?businessId='+item.delivTempId + '&_=' + Number(new Date());
                if (token) {
                    let realToken = token.substr(1, token.length - 2)
                    url = url + "&accessToken=" + realToken;
                }
                window.location.href = url;
            }
        })
    }

    public AddBtn() {   //  添加按钮
    	this.display = true;
    	this.save = true;
    	this.saveChange = false;
    	this.service.post("/bpd-proj/bpd/delivTemp/getNotPqrrCombobox",{})
    	.subscribe(data => {
            this.PQRRMilestoneStore = data;
            if(data.length) {
               this.PQRRMilestone = data[0].value; 
           } else {
               this.PQRRMilestone = null;
           }
            
    	})
    	this.service.post("/bpd-proj/bpd/dept/getCombobox",{})
    	.subscribe(data => {
    		this.departmentStore = data;
    		this.department = data[0].value;
    	})
		this.templateFile = '';
		this.description = '';
        this.ownerCode = '';
        this.owner = '';
    }

    public editItem: any = {};

    public editBtn(item) {  //  修改按钮
        this.editItem = item;
    	this.display = true;
    	this.saveChange = true;
    	this.save = false;
    	this.service.post("/bpd-proj/bpd/delivTemp/getNotPqrrCombobox",{})
    	.subscribe(data => {
    		this.PQRRMilestoneStore = data;
            this.PQRRMilestoneStore.unshift({
                label: item.elementName,
                value: item.pqrrMilestone
            })
    		this.PQRRMilestone = item.pqrrMilestone;
    	})
    	this.service.post("/bpd-proj/bpd/dept/getCombobox",{})
    	.subscribe(data => {
    		this.departmentStore = data;
    		this.department = item.deptId;
    	})
		this.templateFile = item.fileName;
		this.description = item.description;
        this.delivTempId = item.delivTempId;
        this.ownerCode = item.roleCode;
        this.owner = item.roleName;
    }

    public delBtn(item) {   //  删除按钮
        this.confirmationService.confirm({
          message: 'Do You Want To Delete This Record?',
          header: 'Delete Confirmation',
          icon: 'fa fa-trash',
          accept: () => {
            this.service.get("/bpd-proj/bpd/delivTemp/deleteDelivTemp?delivTempId="+item.delivTempId+"&attId="+item.attId+"&"+Number(new Date()))
            .subscribe(data => {
                if(data['code'] == 1) {
                    this.msgservice.showSuccess("Success");
                    this.msgs = this.msgservice.msgs;
                    this.service.post("/bpd-proj/bpd/delivTemp/getVList",{
                        "page": {
                            "page": 1,
                            "rows": 15
                        },
                        "pqrrMilestone": this.PQRRSerch,
                        "deptId": this.departmentSerch
                    })
                    .subscribe(data1 => {
                        this.getAjax(data1);
                    })
                    this.service.post("/bpd-proj/bpd/delivTemp/getPqrrCombobox",{})
                    .subscribe(data => {
                        this.PQRRSerchStore = data;
                        this.PQRRSerchStore.unshift({
                            label: 'All',
                            value: null
                        })
                        this.PQRRSerch = null;
                    })
                    this.service.post("/bpd-proj/bpd/delivTemp/getDptCombobox",{})
                    .subscribe(data => {
                        this.departmentSerchStore = data;
                        this.departmentSerchStore.unshift({
                            label: 'All',
                            value: null
                        })
                        this.departmentSerch = null;
                    })
                } else if(data['code'] == 2){
                    this.msgservice.showInfo("Project Code Exists!");
                    this.msgs = this.msgservice.msgs;
                } else {
                    this.msgservice.showError("Operation Error!");
                    this.msgs = this.msgservice.msgs;
                }
            })
          }
        });
    }

    public roleDbclick(e) {   // 选取角色
        this.owner = e.data.roleName;
        this.ownerCode = e.data.roleCode;
        this.roleDisplay = false;
    }

    public dialogRoleName: string = "";
    public lookClick() {
        let e = {page: 0, first: 0, rows: "10"};
        this.rolePaginate(e);
    }

    public lookClickEnterSearch($event) {
        if ($event.key === "Enter") {
            this.lookClick();
        }
    }

    public getRole() {
        this.dialogRoleName = "";
        this.roleDisplay = true;
        this.service.post("/bpd-proj/bpd/role/getList1",{
            "page": {
                "page": 1,
                "rows": 10
            },
            "pqrrRoleType": "IM"
        })
        .subscribe(data1 => {
            let data = data1.rows;
            this.roleStoreLen = data1.total;
            this.roleStore = [];
            for(let i = 0; i < data.length; i++) {
                data[i].id = i + 1;
            }
            for(let i = 0; i < 10; i++) {
                if(!data[i]) {
                    this.roleStore.push({
                        "ip": i+1
                    })
                } else {
                    this.roleStore.push(data[i])
                }
            }
        })
    }

    public rolePaginate(e) {
        this.service.post("/bpd-proj/bpd/role/getList1",{
            "page": {
                "page": e.page + 1,
                "rows": e.rows
            },
            "roleName": this.dialogRoleName,
            "pqrrRoleType": "IM"
        })
        .subscribe(data1 => {
            let data = data1.rows;
            this.roleStoreLen = data1.total;
            this.roleStore = [];
            for(let i = 0; i < data.length; i++) {
                data[i].id = i + 1;
            }
            for(let i = 0; i < e.rows; i++) {
                if(!data[i]) {
                    this.roleStore.push({
                        "ip": i+1
                    })
                } else {
                    this.roleStore.push(data[i])
                }
            }
        })
    }

    public saveBtn() {     //  新增保存按钮
    	this.service.post("/bpd-proj/bpd/delivTemp/addDelivTemp",{
    		"description" : this.description,
    		"pqrrMilestone" : this.PQRRMilestone,
    		"deptId" : this.department,
            "roleCode" : this.ownerCode,
            "uuid": this.UuId,
            "delivTempId": this.getId
    	})
    	.subscribe(data => {
    		if(data['code'] == 1) {
                this.msgservice.showSuccess("Success");
                this.msgs = this.msgservice.msgs;
                this.display = false;
                this.service.post("/bpd-proj/bpd/delivTemp/getPqrrCombobox",{})
                .subscribe(data => {
                    this.PQRRSerchStore = data;
                    this.PQRRSerchStore.unshift({
                        label: 'All',
                        value: null
                    })
                    this.PQRRSerch = null;
                })
                this.service.post("/bpd-proj/bpd/delivTemp/getDptCombobox",{})
                .subscribe(data => {
                    this.departmentSerchStore = data;
                    this.departmentSerchStore.unshift({
                        label: 'All',
                        value: null
                    })
                    this.departmentSerch = null;
                })
                this.service.post("/bpd-proj/bpd/delivTemp/getVList",{
                    "page": {
                        "page": 1,
                        "rows": 15
                    },
                    "pqrrMilestone": this.PQRRSerch,
                    "deptId": this.departmentSerch
                })
                .subscribe(data1 => {
                    this.getAjax(data1);
                })
            } else if(data['code'] == 2){
                this.msgservice.showInfo("Project Code Exists!");
                this.msgs = this.msgservice.msgs;
            } else {
                this.msgservice.showError("Operation Error!");
                this.msgs = this.msgservice.msgs;
            }
    	})
    }

    public saveChangeBtn() {   //  修改保存按钮
        this.service.post("/bpd-proj/bpd/delivTemp/updateDelivTemp",{
            "description" : this.description,
            "pqrrMilestone" : this.PQRRMilestone,
            "deptId" : this.department,
            "delivTempId" : this.delivTempId,
            "roleCode" : this.ownerCode,
            "attId": this.editItem.attId,
            "uuid": this.UuId
        })
        .subscribe(data => {
            if(data['code'] == 1) {
                this.msgservice.showSuccess("Success");
                this.msgs = this.msgservice.msgs;
                this.display = false;
                this.service.post("/bpd-proj/bpd/delivTemp/getVList",{
                    "page": {
                        "page": 1,
                        "rows": 15
                    },
                    "pqrrMilestone": this.PQRRSerch,
                    "deptId": this.departmentSerch
                })
                .subscribe(data1 => {
                    this.getAjax(data1);
                })
            } else if(data['code'] == 2){
                this.msgservice.showInfo("Project Code Exists!");
                this.msgs = this.msgservice.msgs;
            } else {
                this.msgservice.showError("Operation Error!");
                this.msgs = this.msgservice.msgs;
            }
        })
    }

    public cancelBtn() {  //  取消按钮
    	this.display = false;
    }

    public UuId: any = null;

    public getId: string = null;

    public upload() {
        if(this.save) {
            this.service.get("/bpd-proj/bpd/delivTemp/getId?"+Number(new Date()))
            .subscribe(data => {
                this.getId = data;
                this.UuId = this.dataManageService.getUuId();
                this.uploadURL = '/bpd-proj/bpd/att/upload?attId='+this.UuId+'&bussinessId='+data + '&' +Number(new Date());
                this.addDialog = true;
            })
        } else {
            this.UuId = this.dataManageService.getUuId();
            this.uploadURL = "/bpd-proj/bpd/att/upload?attId="+this.UuId+"&bussinessId="+this.editItem.delivTempId + "&" + Number(new Date());
            this.addDialog = true;
        }
    }

    onBasicUpload($event) {
        let response = eval('(' + $event.xhr.response + ')');
        if(response['code'] == 1) {
            this.addDialog = false;
            this.templateFile = $event.files[0].name;
        } else {
            this.msgservice.showError(response.msg);
            this.msgs = this.msgservice.msgs;
            this.addDialog = false;
        }
    }

};