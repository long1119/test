import { Component, OnInit } from '@angular/core';
import 'style-loader!./vehicleProject.scss';
import { SelectItem, ConfirmationService } from 'primeng/primeng';
import { HttpDataService } from '../../../service/http.service';
import { MessageService } from '../../../service/message.service';

@Component({
  selector: 'vehicle-project',
  templateUrl: './vehicleProject.html',
  providers: [HttpDataService, MessageService, ConfirmationService]
})
export class VehicleProject implements OnInit{

	public display: boolean = false;

	public setStatusDisplay: boolean = false;

	public amypDisplay: boolean = false;

	public gridStore: any = [];

	public gridStoreLen: number;

    public gridStoreRows: any = '10';

    public gridStoreFirst: any = 0;

    public gridStorePage: any = 0;

	public amypGridStore: any = [];

	public memberStore: any = [];

	public modelStore: any = [];

	public ptStore: any = [];

	public umdStore: any = [];

	public ProgramType: SelectItem[];

	public programCodeStore: SelectItem[] = [];

	public investmentCharacterStore: SelectItem[] = [{'value':'Local','label':'Local'},{'value':'Global','label':'Global'},{'value':'Export','label':'Export'}];

	public investmentManagerStore: SelectItem[] = [];

    public selectedType: string;

    public selectedValue: string;

    public selectedStore : any = [];

    public selectedId: string = '';

    public textarea: string = '';

    public save: boolean = true;

	public saveChange: boolean = false;

	public projectCode: string = '';

	public avdCode: string = '';

	public projectName: string = '';

	public programCode: string = '';

	public approvedInvestment: number = 0;

	public approvedDate: any = '';

	public sop: any = "";

	public investmentCharacter: string = 'Local';

	public investmentManager: string = '';

	public projectSummary: string = '';
	
	public msgs: any;

    public growLife: number = 5000;

	public projManager: string = '';

	public searchDialog: boolean = false;

	public dialogDepartment: string = null;

	public dialogEmployeeCode: string = "";

	public dialogUserName: string = null;

	public managerData: any = [];

	public managerDataRows: any = '10';

	public managerDataFirst: any = 0;

	public managerDataLen: number;

	public modelStoreLen: number;  //new add

	public mainselectedStore: any = [];

	public amypGridStoreLen: number;

	public userRoot: boolean = true;

    public yearRange: string;

    public checked: boolean = true;

	constructor(private service: HttpDataService, private confirmationService: ConfirmationService, private msgservice: MessageService) {
		// 日期年份设置
        let currentYear = new Date().getFullYear();
        this.yearRange = "" + (Number(currentYear) - 10) + ":" + (Number(currentYear) + 50);
        for(let i=0; i<15; i++) {
        	this.yearSerchStore.push({
        		label: (currentYear - 10 + i) + '年',
        		value: currentYear -10 + i
        	})
        }
        this.yearSerchStore.unshift({
    		label: 'Select',
    		value: null
    	})
        for(let i=1; i<13; i++) {
        	this.monthSerchStore.push({
        		label: i + '月',
        		value: i<10 ? "0"+i : i
        	})
        }
        this.monthSerchStore.unshift({
    		label: 'Sel',
    		value: null
    	})
	}

	public checkedChange() {
		this.ngOnInit();
	}
    
    ngOnInit() {
    	if(!JSON.parse(window.localStorage.getItem("authorityData"))["Maintain Inv. Veh.project"] || 
    		JSON.parse(window.localStorage.getItem("authorityData"))["Maintain Inv. Veh.project"] == 'false')
    	{
            this.userRoot = false;
        }
        let observable = this.service.post("/bpd-proj/bpd/vehicleInvestProject/getVList", {
        	"page": {
        		"page": 1,
        		"rows": 10
        	},
        	prProgramCode: this.programCodeSerch,
        	projManager: this.checked ? window.localStorage.getItem("user") : null
        })
        .subscribe(data1 => {
        	this.gridStore = [];
			this.gridStoreLen = data1.total;
        	let data = data1.rows;
        	if(data.length) {
	    		for(let i = 0; i < data.length; i++) {
	        		data[i].id = i + 1;
	        	}
	        	for(let i = 0; i < 10; i++) {
	        		if(!data[i]) {
	        			this.gridStore.push({
	        				'ip' : i
	        			})
	        		} else {
	        			this.gridStore.push(data[i])
	        		}
	        	}
	        	this.mainselectedStore = data[0];
	            this.selectedId = data[0].adProjectCode;
	            this.service.post("/bpd-proj/bpd/investmentToVehicleProje/getVList", {
		        	"investVehicleProjectCode": this.mainselectedStore.projectCode,
		        	"page": {
		        		"page": 1,
		        		"rows": 10
		        	}
		        })
		        .subscribe(data1 => {
		        	let data = data1.rows;
					this.modelStoreLen = data.total;
		        	for(let i = 0; i < data.length; i++) {
		        		data[i].id = i + 1;
		        	}
		        	for(let i = 0; i < 10; i++) {
		        		if(!data[i]) {
		        			this.modelStore.push({
		        				'ip' : i
		        			})
		        		} else {
		        			this.modelStore.push(data[i])
		        		}
		        	}
		        }, err => {
		        	for(let i = 0; i < 10; i++) {
			    		if(!this.modelStore[i]) {
			    			this.modelStore.push({
			    				'ip' : i
			    			})
			    		}
			    	}
		        })
	        }
        }, err => {
        	for(let i = 0; i < 10; i++) {
	    		if(!this.gridStore[i]) {
	    			this.gridStore.push({
	    				'ip' : i
	    			})
	    		}
	    	}
        });
    }

	public addBtn() {       // 新增
		this.display = true;
		this.save = true;
		this.saveChange = false;
		this.projectName = '';
		this.programCode = '';
		this.approvedInvestment = 0;
		this.approvedDate = '';
		this.sop = '';
		this.investmentCharacter = 'Local';
		this.investmentManager = window.localStorage.getItem("userName");
		this.projManager = window.localStorage.getItem("user");
		this.projectSummary = '';
		
		this.service.get("/bpd-proj/bpd/vehicleInvestProject/createAdProjCode?"+Number(new Date()))
		.subscribe(data => {
			this.avdCode = data;
			this.projectCode = data;
		})
		this.programCodeStore = [];
		this.service.post("/bpd-proj/bpd/program/getProgramCombobox",{})
		.subscribe(data => {
			for(let i=0; i<data.length; i++) {
				this.programCodeStore.push(data[i])
			}
			this.programCode = data[0].value;
		})
	}

	public editBtn(item) {      // 编辑按钮
		console.log(item)
		this.display = true;
		this.save = false;
		this.saveChange = true;
		this.projectCode = item.projectCode;
		this.avdCode = item.adProjectCode;
		this.projectName = item.projectName;
		this.programCode = item.programId;
		this.approvedInvestment = item.approveInvestment;
		this.approvedDate = item.approveInvestmentDate;
		this.sop = item.sop;
		this.investmentCharacter = item.investmentCharacter;
		this.projectSummary = item.projectSummary;
		this.investmentManager = item.projMangerName;
	 	this.projManager = item.projManager

		this.programCodeStore = [];
		this.service.post("/bpd-proj/bpd/program/getProgramCombobox",{})
		.subscribe(data => {
			for(let i=0; i<data.length; i++) {
				this.programCodeStore.push(data[i])
			}
			this.programCode = item.programId;
		})
	}

	public delBtn(item) {       // 删除按钮
		this.confirmationService.confirm({
	      message: 'Do You Want To Delete This Record?',
	      header: 'Delete Confirmation',
	      icon: 'fa fa-trash',
	      accept: () => {
	       	this.service.get("/bpd-proj/bpd/vehicleInvestProject/delete?adProjectCode=" + item.adProjectCode +'&'+Number(new Date()))
			.subscribe(data => {
				if(data['code'] == 1) {
					this.msgservice.showSuccess("Success");
					this.growLife = 5000;
			        this.msgs = this.msgservice.msgs;
			        let e = {
			            page: this.gridStorePage, 
			            first: this.gridStoreFirst, 
			            rows: this.gridStoreRows,
			            pageCount: Math.ceil(this.gridStoreLen/this.gridStoreRows)
			        }
			        this.paginate(e);
				} else if(data['code'] == 2){
					this.msgservice.showInfo(data['msg']);
					this.growLife = 300000;
					this.msgs = this.msgservice.msgs;
				} else if(data['code'] == 7){
					this.msgservice.showInfo("have ModelYear!");
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

	public handleChange(e) {
		switch(e.index) {
			case 0:
				for(let i = 0; i < 10; i++) {
		    		if(!this.modelStore[i]) {
		    			this.modelStore.push({})
		    		}
		    	}
				break;
			case 1:
				for(let i = 0; i < 10; i++) {
		    		if(!this.ptStore[i]) {
		    			this.ptStore.push({})
		    		}
		    	}
				break;
			case 2:
				for(let i = 0; i < 10; i++) {
		    		if(!this.umdStore[i]) {
		    			this.umdStore.push({})
		    		}
		    	}
				break;	
		}
	}

	public programGridRowClick(e) {    //  二级表格联动
		this.mainselectedStore = e.data;
		if(e.data.projectCode) {
			this.selectedId = e.data.adProjectCode;
			this.service.post("/bpd-proj/bpd/investmentToVehicleProje/getVList", {
	        	"investVehicleProjectCode": this.mainselectedStore.projectCode,
	        	"page": {
	        		"page": 1,
	        		"rows": 10
	        	}
	        })
	        .subscribe(data1 => {
	        	let data = data1.rows;
	        	this.modelStore = [];
	        	for(let i = 0; i < data.length; i++) {
	        		data[i].id = i + 1;
	        	}
	        	for(let i = 0; i < 10; i++) {
	        		if(!data[i]) {
	        			this.modelStore.push({
	        				'ip':i
	        			})
	        		} else {
	        			this.modelStore.push(data[i])
	        		}
	        	}
	        }, err => {
	        	this.modelStore = [];
	        	for(let i = 0; i < 10; i++) {
		    		if(!this.modelStore[i]) {
		    			this.modelStore.push({
		    				'ip' : i
		    			})
		    		}
		    	}
	        }) 
		} else {
			this.modelStore = [];
		}
	}

	public saveBtn() {
		let approvedDateStr = '';
		if(this.approvedDate.toString().length > 10){
			let year = this.approvedDate.getFullYear();
			let month = this.approvedDate.getMonth() + 1;
			let day = this.approvedDate.getDate();
			approvedDateStr = year + '-' + month + '-' + day;
		} else {
			approvedDateStr = this.approvedDate;
		}
		let sopStr = '';
		if(this.sop.toString().length > 10){
			let year = this.sop.getFullYear();
			let month = this.sop.getMonth() + 1;
			let day = this.sop.getDate();
			sopStr = year + '-' + month + '-' + day;
		} else {
			sopStr = this.sop;
		}
		this.service.post("/bpd-proj/bpd/vehicleInvestProject/insert",{
			"projectCode": this.projectCode,
			"adProjectCode": this.avdCode,
			"projectName": this.projectName,
			"programId": this.programCode,
			"approveInvestment": this.approvedInvestment,
			"approveInvestmentDate": approvedDateStr,
			"sop": sopStr,
			"investmentCharacter": this.investmentCharacter,
			"projManager": this.projManager,
			"projectSummary": this.projectSummary
		})
		.subscribe(data => {
			if(data['code'] == 1) {
				this.msgservice.showSuccess("Success");
				this.growLife = 5000;
		        this.msgs = this.msgservice.msgs;
		        // this.gridStore = [];
		        // this.modelStore = [];
				let e = {
		            page: this.gridStorePage, 
		            first: this.gridStoreFirst, 
		            rows: this.gridStoreRows,
		            pageCount: Math.ceil(this.gridStoreLen/this.gridStoreRows)
		        }
		        this.paginate(e);
		        this.display = false;
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

	public saveChangeBtn() {
		let approvedDateStr = '';
		if(this.approvedDate) {
			if(this.approvedDate.toString().length > 10){
				let year = this.approvedDate.getFullYear();
				let month = this.approvedDate.getMonth() + 1;
				let day = this.approvedDate.getDate();
				approvedDateStr = year + '-' + month + '-' + day;
			} else {
				approvedDateStr = this.approvedDate;
			}
		}
		let sopStr = '';
		if(this.sop) {
			if(this.sop.toString().length > 10){
				let year = this.sop.getFullYear();
				let month = this.sop.getMonth() + 1;
				let day = this.sop.getDate();
				sopStr = year + '-' + month + '-' + day;
			} else {
				sopStr = this.sop;
			}
		}
		this.service.post("/bpd-proj/bpd/vehicleInvestProject/update",{
			"projectCode": this.projectCode,
			"adProjectCode": this.avdCode,
			"projectName": this.projectName,
			"programId": this.programCode,
			"approveInvestment": this.approvedInvestment,
			"approveInvestmentDate": approvedDateStr,
			"investmentCharacter": this.investmentCharacter,
			"projManager": this.projManager,
			"projectSummary": this.projectSummary,
			"sop": sopStr
		})
		.subscribe(data => {
			if(data['code'] == 1) {
				this.msgservice.showSuccess("Success");
				this.growLife = 5000;
		        this.msgs = this.msgservice.msgs;
		        // this.gridStore = [];
				// this.modelStore = [];
				let e = {
		            page: this.gridStorePage, 
		            first: this.gridStoreFirst, 
		            rows: this.gridStoreRows,
		            pageCount: Math.ceil(this.gridStoreLen/this.gridStoreRows)
		        }
		        this.paginate(e);
		        this.display = false;
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

	public cancelBtn() {
		this.display = false;
	}

	public addAMYPBtn() {
		this.selectedStore = [];
		this.amypGridStore = [];
		this.service.post("/bpd-proj/bpd/vehicleProject/getVList",{
			programId: this.mainselectedStore.programId,
			"page": {
				"page": 1,
				"rows": 10
			}
		})
		.subscribe(data1 => {
			this.selectedStore = [];
			this.amypGridStore = [];
        	let data = data1.rows;
        	this.amypGridStoreLen = data1.total;
		    if(data.length) {
		        for(let i = 0; i < data.length; i++) {
		          data[i].id = i + 1;
		        }
		    }
		    for(let i = 0; i < 10; i++) {
		        if(!data[i]) {
		          this.amypGridStore.push({
		            "ip": i+1
		          })
		        } else {
		          this.amypGridStore.push(data[i])
		        }
		    }
			this.service.post("/bpd-proj/bpd/investmentToVehicleProje/getList",{
				"investVehicleProjectCode": this.mainselectedStore.projectCode
			})
			.subscribe(data => {
				let gridArr = [];
				for(let i=0; i<this.amypGridStore.length; i++) {
					gridArr.push(this.amypGridStore[i].adProjectCode)
				}
				for(let i=0; i<10-this.amypGridStore.length; i++) {
					gridArr.push({
						'ip': i
					})
				}
				let idArr = data.split(",");
				for(let j=0; j<idArr.length; j++) {
					if(gridArr.indexOf(idArr[j]) != -1) {
						this.selectedStore.push(this.amypGridStore[gridArr.indexOf(idArr[j])])
					}
				}
			})
		})
		this.amypDisplay = true;
	}

    public amypGridStoreRows: any = '10';

    public amypGridStoreFirst: any = 0;

    public amypGridStorePage: any = 0;

	public amypGridPageChange(e) {
		this.service.post("/bpd-proj/bpd/vehicleProject/getVList",{
			"page": {
				"page": e.page + 1,
				"rows": e.rows
			},
			programId: this.mainselectedStore.programId
		})
		.subscribe(data1 => {
			this.selectedStore = [];
			this.amypGridStore = [];
			this.amypGridStoreRows = e.rows;
	        this.amypGridStoreFirst = Number(e.first);
	        this.amypGridStorePage = e.page;
        	let data = data1.rows;
        	this.amypGridStoreLen = data1.total;
		    if(data.length) {
		        for(let i = 0; i < data.length; i++) {
		          data[i].id = i + 1;
		        }
		    }
		    for(let i = 0; i < e.rows; i++) {
		        if(!data[i]) {
		          this.amypGridStore.push({
		            "ip": i+1
		          })
		        } else {
		          this.amypGridStore.push(data[i])
		        }
		    }
			this.service.post("/bpd-proj/bpd/investmentToVehicleProje/getList",{
				"investVehicleProjectCode": this.mainselectedStore.projectCode
			})
			.subscribe(data => {
				let gridArr = [];
				for(let i=0; i<this.amypGridStore.length; i++) {
					gridArr.push(this.amypGridStore[i].adProjectCode)
				}
				for(let i=0; i<10-this.amypGridStore.length; i++) {
					gridArr.push({
						'ip': i
					})
				}
				let idArr = data.split(",");
				for(let j=0; j<idArr.length; j++) {
					if(gridArr.indexOf(idArr[j]) != -1) {
						this.selectedStore.push(this.amypGridStore[gridArr.indexOf(idArr[j])])
					}
				}
			})
		})
	}

	public amypSaveBtn() {
		let arr = [];
		for(let i=0; i<this.selectedStore.length; i++) {
			arr.push(this.selectedStore[i].adProjectCode)
		}
		this.service.get("/bpd-proj/bpd/investmentToVehicleProje/batchAdd?investVehicleProjectCode=" + this.mainselectedStore.projectCode + "&vehicleProjectCodeindexs=" + arr.join(",") +'&'+Number(new Date()))
		.subscribe(data => {
			if(data['code'] == 1) {
				this.msgservice.showSuccess("Success");
				this.growLife = 5000;
		        this.msgs = this.msgservice.msgs;
				this.amypDisplay = false;
				this.service.post("/bpd-proj/bpd/investmentToVehicleProje/getVList", {
	        	"investVehicleProjectCode": this.mainselectedStore.projectCode,
		        	"page": {
		        		"page": 1,
		        		"rows": 10
		        	}
		        })
		        .subscribe(data1 => {
		        	let data = data1.rows;
		        	this.modelStore = [];
		        	for(let i = 0; i < data.length; i++) {
		        		data[i].id = i + 1;
		        	}
		        	for(let i = 0; i < 10; i++) {
		        		if(!data[i]) {
		        			this.modelStore.push({
		        				'ip' : i
		        			})
		        		} else {
		        			this.modelStore.push(data[i])
		        		}
		        	}
		        }, err => {
		        	this.modelStore = [];
		        	for(let i = 0; i < 10; i++) {
			    		if(!this.modelStore[i]) {
			    			this.modelStore.push({
			    				'ip' : i
			    			})
			    		}
			    	}
		        })
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

	public amypCancelBtn() {
		this.amypDisplay = false;
	}

	public onRowSelect(event) {
		console.log(event.data)
	}

	public onRowUnselect(event) {
		console.log(event)
		for(let i = 0; i < this.selectedStore.length; i++) {
			if(this.selectedStore[i].adProjectCode == event.data.adProjectCode) {
				this.selectedStore.splice(i,1)
			}
		}
	}

	public getUser() {
		this.dialogDepartment = null;
	    this.dialogUserName = null;
	    this.dialogEmployeeCode = "";
		this.service.post("/bpd-proj/bpd/user/getVListInvestment", {
			"page": {
                "page": 1,
                "rows": 10
            },
            "departmentName" : this.dialogDepartment,
			"userName": this.dialogUserName,
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
		this.service.post("/bpd-proj/bpd/user/getVListInvestment",{
    		"page": {
                "page": e.page + 1,
                "rows": e.rows
            },
            "departmentName" : this.dialogDepartment,
			"userName": this.dialogUserName,
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
			this.lookClick();
		}
	}
	
	public lookClick() {
		let e = {page: 0, first: 0, rows: "10"};
        this.managerPaginate(e);
	}

	public dbclick(e) {
		this.investmentManager = e.data.userName;
		this.projManager = e.data.userCode;
		this.searchDialog = false;
	}

	public projectCodeCheck() {
		if(this.projectCode.length) {
			if(this.projectCode.length != 8) {
				this.msgservice.showError("projectCode length is not 8 bits!");
				this.growLife = 300000;
				this.msgs = this.msgservice.msgs;
				this.projectCode = '';
			}
		}
	}

	public programCodeSerch: string = "";
	public projectNameSerch: string = "";
	public costbookCodeSerch: string = "";
	public approveInvestmentSerch: number = null;
	public yearSerchStore: any = [];
    public sorpYearSerch: string = "";
    public sorpMonthSerch: string = "";
    public approveDateYearSerch: string = "";
    public approveDateMonthSerch: string = "";
    public monthSerchStore: any = [];

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
		let observable = this.service.post("/bpd-proj/bpd/vehicleInvestProject/getVList", {
        	"page": {
        		"page": e.page + 1,
        		"rows": e.rows
        	},
        	prProgramCode: this.programCodeSerch,
        	projManager: this.checked ? window.localStorage.getItem("user") : null,
        	projectName: this.projectNameSerch,
        	projectCode: this.costbookCodeSerch,
        	approveInvestment: this.approveInvestmentSerch,
        	sop: (this.sorpYearSerch ? this.sorpYearSerch : "") + (this.sorpMonthSerch ? "-" + this.sorpMonthSerch : ""),
        	approveInvestmentDate: (this.approveDateYearSerch ? this.approveDateYearSerch : "") + (this.approveDateMonthSerch ? "-" + this.approveDateMonthSerch : "")
        })
        .subscribe(data1 => {
        	this.gridStore = [];
	        this.gridStoreLen = data1.total;
	        this.gridStoreRows = e.rows;
	        this.gridStoreFirst = Number(e.first);
	        this.gridStorePage = e.page;
	        let data = data1.rows;
    		for(let i = 0; i < data.length; i++) {
        		data[i].id = i + 1;
        	}
        	for(let i = 0; i < e.rows; i++) {
        		if(!data[i]) {
        			this.gridStore.push({
        				'ip' : i
        			})
        		} else {
        			this.gridStore.push(data[i])
        		}
        	}
        	if(data.length == 0) {
        		return;
        	}
        	this.mainselectedStore = data[0];
            this.selectedId = data[0].adProjectCode;
            this.service.post("/bpd-proj/bpd/investmentToVehicleProje/getVList", {
	        	"investVehicleProjectCode": this.mainselectedStore.projectCode,
	        	"page": {
	        		"page": 1,
	        		"rows": 10
	        	}
	        })
	        .subscribe(data1 => {
	        	let data = data1.rows;
	        	this.modelStore = [];
	        	for(let i = 0; i < data.length; i++) {
	        		data[i].id = i + 1;
	        	}
	        	for(let i = 0; i < 10; i++) {
	        		if(!data[i]) {
	        			this.modelStore.push({
	        				'ip' : i
	        			})
	        		} else {
	        			this.modelStore.push(data[i])
	        		}
	        	}
	        }, err => {
	        	for(let i = 0; i < 10; i++) {
		    		if(!this.modelStore[i]) {
		    			this.modelStore.push({
		    				'ip' : i
		    			})
		    		}
		    	}
	        })
        }, err => {
        	for(let i = 0; i < 10; i++) {
	    		if(!this.gridStore[i]) {
	    			this.gridStore.push({
	    				'ip' : i
	    			})
	    		}
	    	}
        });
	}

	public paginateModelStore(e) {
		this.service.post("/bpd-proj/bpd/investmentToVehicleProje/getVList", {
        	"investVehicleProjectCode": this.mainselectedStore.projectCode,
        	"page": {
        		"page": e.page + 1,
        		"rows": e.rows
        	}
        })
        .subscribe(data1 => {
        	let data = data1.rows;
        	this.modelStore = [];
        	for(let i = 0; i < data.length; i++) {
        		data[i].id = i + 1;
        	}
        	for(let i = 0; i < e.rows; i++) {
        		if(!data[i]) {
        			this.modelStore.push({
        				'ip' : i
        			})
        		} else {
        			this.modelStore.push(data[i])
        		}
        	}
        }, err => {
        	for(let i = 0; i < 10; i++) {
	    		if(!this.modelStore[i]) {
	    			this.modelStore.push({
	    				'ip' : i
	    			})
	    		}
	    	}
        })
	}

	checkEnglish($event) {
		let reg = /[^a-zA-Z0-9]/;
        let regexp = new RegExp(reg);
        if (!regexp.test($event)) {
            return $event;
        } else {
			this.msgservice.showInfo("Please Inser Number Or Letter!")
			this.growLife = 3000000;
			this.msgs = this.msgservice.msgs;
            return null;
        }
	}
};