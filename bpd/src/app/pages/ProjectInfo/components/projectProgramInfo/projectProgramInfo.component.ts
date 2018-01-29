import { Component, OnInit } from '@angular/core';
import 'style-loader!./projectProgramInfo.scss';
import { SelectItem, TreeNode, ConfirmationService } from 'primeng/primeng';
import { HttpDataService } from '../../../service/http.service';
import { MessageService } from '../../../service/message.service';

@Component({
  selector: 'project-program-info',
  templateUrl: './projectProgramInfo.html',
  providers: [HttpDataService, MessageService, ConfirmationService]
})
export class ProjectProgramInfo implements OnInit{

	public userRoot: boolean = true;

	public programCodeSerch: string = null;

	public display : boolean = false;

	public statusDisplay : boolean = false;

	public petMemberDisplay: boolean = false;

	public memberSave: boolean = true;

	public radioSelectedValue: string = 'val1';

	public memo: string = '';

	public gridStore: any = [];

	public gridStoreRows: any = '10';

    public gridStoreFirst: any = 0;

	public modelStore: any = [];

	public memberStore: any = [];

	public ClassficationStore: any = [];

	public selectedStore: any = [];

	public modelSelectedStore: any = [];

	public selectedId: string = '';

	public tabIndex: number = 0;

	public adProjectCode: string = '';

	public programCode: string = '';

	public platform: string = '';

	public brand: string = '';

	public segmentMarket: any = '';

	public segmentMarketShare: any = '';

	public sorp: any = '';

	public eop: any = '';

	public lca: any = '';

	public lifeCycle: any = '';

	public bodyStyle: any = '';

	public Classfication: any = '';

	public competitor: any = '';

	public msgs: any;

    public growLife: number = 5000;

	public userName: string = '';

	public userNameStore: any = [];

	public role: string = '';

	public parentUser : string = '';

	public parentUserStore: any = [];

	public description: string = '';

	public roleStore: any = [];

	public gridStoreLen: number;


	public searchDialog: boolean = false;

	public dialogDepartment: string = null;

	public dialogUserName: string = null;

	public dialogEmployeeCode: string = null;

	public managerData: any = [];

	public managerDataRows: any = '10';

	public managerDataFirst: any = 0;

	public managerDataLen: number;

    public yearRange: string;

    public setLCARoot: boolean = true;

	constructor(private service: HttpDataService, private confirmationService: ConfirmationService, private msgservice: MessageService) {
		// 日期年份设置
        let currentYear = new Date().getFullYear();
        this.yearRange = "" + (Number(currentYear) - 10) + ":" + (Number(currentYear) + 50);
	}
    
    ngOnInit() {
    	if(!JSON.parse(window.localStorage.getItem("authorityData"))["Assign Vehicle Program PPM"] || 
    		JSON.parse(window.localStorage.getItem("authorityData"))["Assign Vehicle Program PPM"] == 'false')
    	{
            this.userRoot = false;
        }
        if(!JSON.parse(window.localStorage.getItem("authorityData"))["Maintain LCA volume"] || 
    		JSON.parse(window.localStorage.getItem("authorityData"))["Maintain LCA volume"] == 'false')
    	{
            this.setLCARoot = false;
        }
        this.service.post("/bpd-proj/bpd/program/getVList",{
        	"page": {
        		"page": 1,
        		"rows": 10
        	}
        })
        .subscribe(data1 => {
			this.gridStoreLen = data1.total;
        	let data = data1.rows;
    		for(let i = 0; i < data.length; i++) {
        		data[i].id = i + 1;
        		if(data[i].projManager)
        		data[i].projManagerStr = data[i].projManager ? data[i].projManager.split("@@@")[0] : "";
        		data[i].projManagerStrBrif = (data[i].projManagerStr && data[i].projManagerStr.length>30)  ? data[i].projManagerStr.substr(0,27)+"..." : data[i].projManagerStr;
        	}
        	for(let i = 0; i < 10; i++) {
        		if(!data[i]) {
        			this.gridStore.push({
        				"ip" : i
        			})
        		} else {
        			this.gridStore.push(data[i])
        		}
        	}
        	if(data.length) {
        		this.selectedStore = data[0];
	        	this.selectedId = data[0].programId;
	        	this.service.post("/bpd-proj/bpd/vehicleProject/getVList", {
		        	"programId": this.selectedId,
		        	"page": {
		        		"page": 1,
		        		"rows": 10
		        	}
		        })
		        .subscribe(data1 => {
		        	let data = data1.rows;
		        	for(let i = 0; i < data.length; i++) {
		        		data[i].id = i + 1;
		        	}
		        	for(let i = 0; i < 10; i++) {
		        		if(!data[i]) {
		        			this.modelStore.push({})
		        		} else {
		        			this.modelStore.push(data[i])
		        		}
		        	}
		        	this.modelSelectedStore = data[0];
		        	this.adProjectCode = data.length ? data[0].adProjectCode : '';
		        }, err => {
		        	for(let i = 0; i < 10; i++) {
			    		if(!this.modelStore[i]) {
			    			this.modelStore.push({})
			    		}
			    	}
		        })
        	}
        })
    }

    public setStatusBtn() {
    	this.statusDisplay = true;
    }

    public statusCancelBtn() {
    	this.statusDisplay = false;
    }

    public statusSaveChangeBtn() {
    	this.service.post("/dfdsfdsf",{
    		"radioSelectedValue" : this.radioSelectedValue,
    		"memo" : this.memo
    	})
    	.subscribe(data => {
    		if(data['code'] == 1) {
    			this.msgservice.showSuccess("Operation Success!");
				this.growLife = 5000;
		        this.msgs = this.msgservice.msgs;
    			this.statusDisplay = false;
    		} else if(data['code'] == 2){
				this.msgservice.showInfo("Project Code Exists!");
				this.growLife = 300000;
				this.msgs = this.msgservice.msgs;
			} else {
				this.msgservice.showError("Operation Error!");
				this.growLife = 5000;
		        this.msgs = this.msgservice.msgs;
			}
    	});
    }

    public programGridRowClick(e) {
    	if(e.data.id) {
    		this.selectedId = e.data.programId;
			this.service.post("/bpd-proj/bpd/vehicleProject/getVList", {
	        	"programId": this.selectedId,
	        	"page": {
	        		"page": 1,
	        		"rows": 10
	        	}
	        })
	        .subscribe(data1 => {
	        	this.modelStore = [];
	        	let data = data1.rows;
	        	for(let i = 0; i < data.length; i++) {
	        		data[i].id = i + 1;
	        	}
	        	for(let i = 0; i < 10; i++) {
	        		if(!data[i]) {
	        			this.modelStore.push({
	        				'ip': i
	        			})
	        		} else {
	        			this.modelStore.push(data[i])
	        		}
	        	}
	        	this.adProjectCode = data.length ? data[0].adProjectCode : '';
	        }, err => {
	        	for(let i = 0; i < 10; i++) {
		    		if(!this.modelStore[i]) {
		    			this.modelStore.push({
		    				'ip': i
		    			})
		    		}
		    	}
	        }) 
    	} else {
    		this.modelStore = [];
    		for(let i = 0; i < 10; i++) {
    			this.modelStore.push({
    				'ip': i
    			})
	    	}
    	}
    }

    public editBtn(item) {
    	this.display = true;
    	this.programCode = item.programCode;
    	this.platform = item.modelPlatform;
    	this.brand = item.brandName;
		this.segmentMarket = item.segmentMarket;
		this.segmentMarketShare = item.segmentMarketShare;
		this.lca = item.lcaVolume;
		this.sorp = item.sorp;
		this.eop = item.eop;
		this.lifeCycle = item.lifecycleVolume;
		this.competitor = item.competitor;
		this.bodyStyle = item.bodyStyle;
		this.Classfication = item.psd;
		if(item.projManager) {
			this.selectUserStore = [];
			let codeArr: any = item.projManager.split("@@@")[1].split(",");
	    	let nameArr: any = item.projManager.split("@@@")[0].split(",");
	    	for(let i=0; i<codeArr.length; i++) {
	    		this.selectUserStore.push({
	    			"userName": nameArr[i],
	    			"userCode": codeArr[i] 
	    		})
	    	}
		} else {
			this.selectUserStore = [];
		}
	}

	public modelGridRowClick(e) {
		this.adProjectCode = e.data.adProjectCode;
	}

    public cancelBtn() {
    	this.display = false;
    }

    public confirmBtn() {
    	if(this.selectUserStore.length == 0) {
    		this.msgservice.showInfo("No Manager!");
            this.growLife = 300000;
	        this.msgs = this.msgservice.msgs;
	        return;
    	}
    	let params = {};
    	if(this.userRoot) {
    		let codeArr: any = [];
	    	let nameArr: any = [];
			for(let i=0; i<this.selectUserStore.length; i++) {
				codeArr.push(this.selectUserStore[i].userCode);
				nameArr.push(this.selectUserStore[i].userName);
			}
			params = {
				"programId": this.selectedId,
				// "programCode": this.selectedStore.programCode,
				"projManager": nameArr.join(",") + "@@@" + codeArr.join(","),
				"lifecycleVolume": this.lifeCycle,
				"lcaVolume": this.lca,
				"segmentMarket": this.segmentMarket,
				"segmentMarketShare": this.segmentMarketShare
			}
    	} else {
    		params = {
				"programId": this.selectedId,
				// "programCode": this.selectedStore.programCode,
				"lifecycleVolume": this.lifeCycle,
				"lcaVolume": this.lca,
				"segmentMarket": this.segmentMarket,
				"segmentMarketShare": this.segmentMarketShare
			}
    	}
		this.service.post("/bpd-proj/bpd/program/updateProgram",params)
		.subscribe(data => {
			if(data['code'] == 1) {
    			this.msgservice.showSuccess("Operation Success!");
				this.growLife = 5000;
		        this.msgs = this.msgservice.msgs;
    			this.display = false;
    			let e = {page: 0, first: 0, rows: "10"};
		    	this.paginate(e);
    		} else {
				this.msgservice.showError("Operation Error!");
				this.growLife = 5000;
		        this.msgs = this.msgservice.msgs;
			}
		})
    }

    public confirmAndNotificateBtn() {

    }

    public notificateBtn(item) {

    }

	public lookUpEnterSearch($event) {
		if ($event.key === "Enter") {
			this.lookUpBtn();
		}
	}
	
    public lookUpBtn() {
    	let e = {
            page: 0, 
            first: 0, 
            rows: "10", 
            pageCount: 1
          }
          this.paginate(e);
    }

	public paginate(e) {
		this.service.post("/bpd-proj/bpd/program/getVList",{
        	"page": {
        		"page": e.page + 1,
        		"rows": e.rows
        	},
        	"programCode": this.programCodeSerch
        })
        .subscribe(data1 => {
        	this.gridStore = [];
        	let data = data1.rows;
        	this.gridStoreLen = data1.total;
        	this.gridStoreRows = e.rows;
            this.gridStoreFirst = e.first;
    		for(let i = 0; i < data.length; i++) {
        		data[i].id = i + 1;
        		if(data[i].projManager)
        		data[i].projManagerStr = data[i].projManager ? data[i].projManager.split("@@@")[0] : "";
	        	data[i].projManagerStrBrif = (data[i].projManagerStr && data[i].projManagerStr.length>30)  ? data[i].projManagerStr.substr(0,27)+"..." : data[i].projManagerStr;
        	}
        	for(let i = 0; i < e.rows; i++) {
        		if(!data[i]) {
        			this.gridStore.push({
        				"ip" : i
        			})
        		} else {
        			this.gridStore.push(data[i])
        		}
        	}
        	if(data.length) {
        		this.selectedStore = data[0];
	        	this.selectedId = data[0].programId;
	        	this.service.post("/bpd-proj/bpd/vehicleProject/getVList", {
		        	"programId": this.selectedId,
		        	"page": {
		        		"page": 1,
		        		"rows": 10
		        	}
		        })
		        .subscribe(data1 => {
		        	this.modelStore = [];
		        	let data = data1.rows;
		        	for(let i = 0; i < data.length; i++) {
		        		data[i].id = i + 1;
		        	}
		        	for(let i = 0; i < 10; i++) {
		        		if(!data[i]) {
		        			this.modelStore.push({})
		        		} else {
		        			this.modelStore.push(data[i])
		        		}
		        	}
		        	this.modelSelectedStore = data[0];
		        	this.adProjectCode = data.length ? data[0].adProjectCode : '';
		        })
        	} else {
        		this.selectedStore = [];
        		this.modelStore = [];
        		for(let i = 0; i < 10; i++) {
	    			this.modelStore.push({
	    				ip: i
	    			})
		    	}
        	}
        })
	}

	public getUser() {
		let userCodesArr = [];
		for(let i=0; i<this.selectUserStore.length; i++) {
			userCodesArr.push(this.selectUserStore[i].userCode)
		}
		this.dialogDepartment = null;
	    this.dialogUserName = null;
	    this.dialogEmployeeCode = null;
		this.service.post("/bpd-proj/bpd/user/getVList", {
			"page": {
                "page": 1,
                "rows": 10
            },
            "departmentName" : this.dialogDepartment,
			"userName": this.dialogUserName,
			"userCodes": userCodesArr,
			"employeeCode": this.dialogEmployeeCode
		})
        .subscribe(data1 => {
        	this.managerData = [];
        	let data = data1.rows;
        	this.managerDataLen = data1.total;
            for(let i = 0; i < data.length; i++) {
        		data[i].id = i + 1;
        	}
        	for(let i = 0; i < 10; i++) {
        		if(!data[i]) {
        			this.managerData.push({
        				'ip': i
        			})
        		} else {
        			this.managerData.push(data[i])
        		}
        	}
        	this.searchDialog = true;
        })
	}

	public managerPaginate(e) {
		let userCodesArr = [];
		for(let i=0; i<this.selectUserStore.length; i++) {
			userCodesArr.push(this.selectUserStore[i].userCode)
		}
		this.service.post("/bpd-proj/bpd/user/getVList",{
    		"page": {
                "page": e.page + 1,
                "rows": e.rows
            },
            "departmentName" : this.dialogDepartment,
			"userName": this.dialogUserName,
			"userCodes": userCodesArr,
			"employeeCode": this.dialogEmployeeCode
    	})
    	.subscribe(data1 => {
    		let data = data1.rows;
			this.managerDataLen = data1.total;
            this.managerDataRows = e.rows;
            this.managerDataFirst = e.first;
			this.managerData = [];
			for(let i = 0; i < data.length; i++) {
	            data[i].id = i + 1;
	        }
	        for(let i = 0; i < e.rows; i++) {
	            if(!data[i]) {
	                this.managerData.push({
	                    "ip": i+1
	                })
	            } else {
	                this.managerData.push(data[i])
	            }
	        }
    	})
	}

	public lookClickEnterSearch($event) {
		if ($event.key === "Enter") {
			this.managerlookClick();
		}
	}
	
	public managerlookClick() {
		let e = {page: 0, first: 0, rows: "10"};
        this.managerPaginate(e);
	}

	public dbclick(e) {
		if(!e.data.userCode) {
			return;
		}
		this.selectUserStore.push({
			userName: e.data.userName,
			userCode: e.data.userCode
		})
		this.searchDialog = false;
		this.dialogDepartment = null;
	    this.dialogUserName = null;
	    this.dialogEmployeeCode = null;
	}

	public selectUserStore: any = [];

	public delUser(items) {
		this.confirmationService.confirm({
	      message: 'Do You Want To Delete This Record?',
	      header: 'Delete Confirmation',
	      icon: 'fa fa-trash',
	      accept: () => {
	        let arr: any = [];
			for(let i=0; i<this.selectUserStore.length; i++) {
				arr.push(this.selectUserStore[i].userCode)
			}
			this.selectUserStore.splice(arr.indexOf(items.userCode),1);
	      }
	    });
	}

	public LCABlur(e) {
		let eopArr = this.eop.split("-");
		let sorpArr = this.sorp.split("-");
		let month = (eopArr[0] - sorpArr[0])*12 + (eopArr[1] - sorpArr[1] - (-1));
		month == 0 ? month = month+1 : month = month;
		this.lifeCycle = this.lca/12*month;
	}


	//   查看文字详情
	public mouseover(e,item) {
		var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
		var messageDetail = document.getElementById("messageDetail");
		messageDetail.innerHTML = item.projManagerStr;
		if(item.projMangerStr.length > 200) {
	      messageDetail.style.width = "400px"
	    } else {
	      messageDetail.style.width = "200px"
	    }
		messageDetail.style.zIndex = "9999999";
		messageDetail.style.top = (e.pageY -scrollTop) + "px";
		messageDetail.style.left = (e.pageX - (-20)) + "px";
	}

	public mouseup() {
		var messageDetail = document.getElementById("messageDetail");
		messageDetail.style.zIndex = "-999";
	}


	//  checkNum

	public checkNum(event) {
		console.log(event)
		var event = event.which ? event.which : event.keyCode;
	    if (event == 8 || event == 9 || event == 109 || event == 110 || (event >= 48 && event <= 57) || (event >= 96 && event <= 105)) {
	        return true;
	    } else {
	        return false;
	    }
	}
};