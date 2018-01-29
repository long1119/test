import { Component, OnInit } from '@angular/core';
import 'style-loader!./deliverableBill.scss';
import { SelectItem, TreeNode, MenuItem, ConfirmationService } from 'primeng/primeng';
import { HttpDataService } from '../../../service/http.service';
import { MessageService } from '../../../service/message.service';

@Component({
  selector: 'deliverable-bill',
  templateUrl: './deliverableBill.html',
  providers: [HttpDataService, MessageService, ConfirmationService]
})
export class DeliverableBill implements OnInit{

    public msgs: any;

    public PQRRSerchStore: any = [];

    public PQRRSerch: string = '';

    public gridStore: any = [];

    public gridStoreLen: number;

    public gridStoreRows: any = '15';

    public gridStoreFirst: any = 0;

    public display: boolean = false;

    public save: boolean = true;

    public saveChange: boolean = false;

    public PQRRMilestoneStore: any = [];

    public PQRRMilestone: string = '';

    public departmentStore: any = [];

    public department: string = '';

    public delivableName: string = '';

    public delivId: string = '';

    public description: string = '';

    public elementId: string = '';

    public userRoot: boolean = true;

    public loginUser: string = "";

	constructor(private service: HttpDataService, private confirmationService: ConfirmationService, private msgservice: MessageService) {
	}
    
    ngOnInit() {
        this.loginUser = window.localStorage.getItem('user');
        if(!JSON.parse(window.localStorage.getItem("authorityData"))["Maintain Deliverable List"] || 
            JSON.parse(window.localStorage.getItem("authorityData"))["Maintain Deliverable List"] == 'false')
        {
            this.userRoot = false;
        }
        this.service.post("/bpd-proj/bpd/delivBill/getPqrrCombobox",{})
        .subscribe(data => {
        	this.PQRRSerchStore = data;
            this.PQRRSerchStore.unshift({
                label : 'All',
                value : null
            })
        	this.PQRRSerch = data[0].value;

        	this.service.post("/bpd-proj/bpd/delivBill/getVList",{
        		"page": {
	                "page": 1,
	                "rows": 15
	            },
        		'pqrrMilestone': this.PQRRSerch
        	})
        	.subscribe(data1 => {
        		this.getAjax(data1);
        	})
        })
    }

    public getAjax(data1) {      // 获取主表ajax
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
        console.log(e)
    	this.service.post("/bpd-proj/bpd/delivBill/getVList",{
    		"page": {
                "page": e.page + 1,
                "rows": e.rows
            },
    		'pqrrMilestone': this.PQRRSerch
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

    public selectionChange(event) {   // 下拉框change事件
        this.PQRRSerch = event.value;
        let e = {page: 0, first: 0, rows: "15"};
        this.paginate(e);
    }

    public AddBtn() {     // add
    	this.display = true;
    	this.save = true;
    	this.saveChange = false;
    	this.service.post("/bpd-proj/bpd/delivBill/getNotPqrrCombobox",{})
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
    	this.delivableName = '';
		this.description = '';
		this.elementId = '';
    }

    public editBtn(item) {   // edit
    	this.display = true;
    	this.save = false;
    	this.saveChange = true;
    	this.service.post("/bpd-proj/bpd/delivBill/getNotPqrrCombobox",{})
    	.subscribe(data => {
    		this.PQRRMilestoneStore = data;
            this.PQRRMilestoneStore.unshift({
                value: item.pqrrMilestone,
                label: item.elementName
            })
    		this.PQRRMilestone = item.pqrrMilestone;
    	})
    	this.service.post("/bpd-proj/bpd/dept/getCombobox",{})
    	.subscribe(data => {
    		this.departmentStore = data;
    		this.department = item.deptId;
    	})
    	this.delivableName = item.delivName;
        this.delivId = item.delivId;
		this.description = item.description;
		this.elementId = item.elememntId;
    }

    public delBtn(item) {    //  delete
        this.confirmationService.confirm({
          message: 'Do You Want To Delete This Record?',
          header: 'Delete Confirmation',
          icon: 'fa fa-trash',
          accept: () => {
            this.service.get("/bpd-proj/bpd/delivBill/delete?delivId="+item.delivId+"&"+Number(new Date()))
            .subscribe(data => {
                if(data['code'] == 1) {
                    this.msgservice.showSuccess("Success");
                    this.msgs = this.msgservice.msgs;
                    this.PQRRSerch = null;
                    this.service.post("/bpd-proj/bpd/delivBill/getVList",{
                        "page": {
                            "page": 1,
                            "rows": 15
                        },
                        'pqrrMilestone': null
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
        });
    }

    public saveBtn() {    // 新增保存按钮
    	this.service.post("/bpd-proj/bpd/delivBill/insert",{
    		"delivName" : this.delivableName,
    		"description" : this.description,
    		"pqrrMilestone" : this.PQRRMilestone,
    		"elememntId" : this.elementId,
    		"deptId" : this.department
    	})
    	.subscribe(data => {
    		if(data['code'] == 1) {
                this.msgservice.showSuccess("Success");
                this.msgs = this.msgservice.msgs;
                this.display = false;
                this.PQRRSerch = null;
                this.service.post("/bpd-proj/bpd/delivBill/getPqrrCombobox",{})
                .subscribe(data => {
                    this.PQRRSerchStore = data;
                    this.PQRRSerchStore.unshift({
                        label : 'All',
                        value : null
                    })
                    this.PQRRSerch = data[0].value;

                    this.service.post("/bpd-proj/bpd/delivBill/getVList",{
                        "page": {
                            "page": 1,
                            "rows": 15
                        },
                        'pqrrMilestone': this.PQRRSerch
                    })
                    .subscribe(data1 => {
                        this.getAjax(data1);
                    })
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
    	this.service.post("/bpd-proj/bpd/delivBill/update",{
    		"delivName" : this.delivableName,
    		"description" : this.description,
    		"pqrrMilestone" : this.PQRRMilestone,
    		"elememntId" : this.elementId,
    		"deptId" : this.department,
            "delivId" : this.delivId
    	})
    	.subscribe(data => {
    		if(data['code'] == 1) {
                this.msgservice.showSuccess("Success");
                this.msgs = this.msgservice.msgs;
                this.display = false;
                this.PQRRSerch = null;
                this.service.post("/bpd-proj/bpd/delivBill/getVList",{
	        		"page": {
		                "page": 1,
		                "rows": 15
		            },
	        		'pqrrMilestone': null
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

    public cancelBtn() {     // 取消按钮
		this.display = false;
    }

};