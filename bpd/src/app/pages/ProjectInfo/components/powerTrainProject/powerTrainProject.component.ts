import { Component, OnInit } from '@angular/core';
import 'style-loader!./powerTrainProject.scss';
import { SelectItem, ConfirmationService } from 'primeng/primeng';
import { HttpDataService } from '../../../service/http.service';
import { MessageService } from '../../../service/message.service';

@Component({
  selector: 'power-train-project',
  templateUrl: './powerTrainProject.html',
  providers: [HttpDataService, MessageService, ConfirmationService]
})
export class PowerTrainProject implements OnInit{

	public display: boolean = false;

	public gridStore: any = [];

	public gridStoreLen: number;

    public gridStoreRows: any = '10';

    public gridStoreFirst: any = 0;

    public gridStorePage: any = 0;

	public programCodes: SelectItem[] = [];

	public ClassficationStore: SelectItem[] = [];

	public InvestmentManagerStore: SelectItem[] = [];

	public projectCode: string = '';

	public avdCode: string = '';

	public projectName: string = '';

	public programCode: string = '';

	public PTModel: string = '';

	public platform: string = '';

	public modelYear: number;

	public rpo: string = '';

	public PTCount: number;

	public Classfication: string = '';

	public projectCategory: string = null;

	public projectCategoryStore: any = [];

	public InvestmentManager: string = '';

	public ApprovedInvestment: number;

	public ApprovedDate: any = '';

	public sop: any = '';

	public ProjectSummary: string = '';

	public save: boolean = true;

	public saveChange: boolean = false;

	public msgs: any;

    public growLife: number = 5000;

	public projManager: string = '';

	public searchDialog: boolean = false;

	public dialogDepartment: string = null;

	public dialogUserName: string = null;

	public dialogEmployeeCode: string = null;

	public managerData: any = [];

	public managerDataRows: any = '10';

	public managerDataFirst: any = 0;

	public managerDataLen: number;

	public userRoot: boolean = true;

	public yearRange: string;

	public checked: boolean = true;

	public programCodeSerchStore: any = [];

	public categorySerchStore: any = [];

	public classificationSerchStore: any = [];

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
    	if(!JSON.parse(window.localStorage.getItem("authorityData"))["Maintain Inv. PT Project"] || 
    		JSON.parse(window.localStorage.getItem("authorityData"))["Maintain Inv. PT Project"] == 'false')
    	{
            this.userRoot = false;
        }
        this.service.post("/bpd-proj/bpd/program/getPowerTrainProgramCombobox",{})
		.subscribe(data => {
			this.programCodeSerchStore = data;
			this.programCodeSerchStore.unshift({
				label: 'Select',
				value: null
			})
			this.programCodeSerch = data[0].value;
		})
		this.service.get("/bpd-proj/bpd/projectCategory/getInvestAssumeCatCombobox?"+Number(new Date())+"&projectType=120")
		.subscribe(data => {
			this.classificationSerchStore = data;
			this.classificationSerchStore.unshift({
				label: 'Select',
				value: null
			})
			this.classificationSerch = data[0].value;

		})
		this.service.get("/bpd-proj/bpd/projectLevel/getProjectLevelNameCombobox?projectType=120&"+Number(new Date()))
		.subscribe(data => {
			this.categorySerchStore = data;
			this.categorySerchStore.unshift({
				label: 'Select',
				value: null
			})
			this.categorySerch = data[0].value;
		})
        let observable = this.service.post("/bpd-proj/bpd/powertrainProject/getVList", {
        	"page": {
        		"page": 1,
        		"rows": 10
        	},
        	projManager: this.checked ? window.localStorage.getItem("user") : null
        })
        .subscribe(data1 => {
        	this.gridStore = [];
			this.gridStoreLen = data1.total;
			let data = data1.rows;
    		for(let i = 0; i < data.length; i++) {
        		data[i].id = i + 1;
        	}
        	for(let i = 0; i < 10; i++) {
        		if(!data[i]) {
        			this.gridStore.push({})
        		} else {
        			this.gridStore.push(data[i])
        		}
        	}
        }, err => {
        	for(let i = 0; i < 10; i++) {
	    		if(!this.gridStore[i]) {
	    			this.gridStore.push({})
	    		}
	    	}
        });
    }

	public addBtn() {       // 新增
		this.display = true;
		this.save = true;
		this.saveChange = false;
		this.ApprovedDate = '';
		this.sop = '';
		this.projectName = '';
		this.programCode = '';
		this.PTModel = '';
		this.platform = '';
		this.modelYear = null;
		this.rpo = '';
		this.PTCount = null;
		this.Classfication = '';
		this.InvestmentManager = window.localStorage.getItem("userName");
		this.projManager = window.localStorage.getItem("user");
		this.ApprovedInvestment = null;
		this.ProjectSummary = '';
		this.service.get("/bpd-proj/bpd/powertrainProject/createAdProjCode?"+Number(new Date()))
		.subscribe((data) => {
			this.avdCode = data;
			this.projectCode = data;
		});

		this.service.get("/bpd-proj/bpd/projectCategory/getInvestAssumeCatCombobox?"+Number(new Date())+"&projectType=120")
		.subscribe(data => {
			this.projectCategoryStore = data;
			this.projectCategory = data[0].value;

		})

		this.service.post("/bpd-proj/bpd/program/getPowerTrainProgramCombobox",{})
		.subscribe(data => {
			this.programCodes = [];
			for(let i=0; i<data.length; i++) {
				this.programCodes.push(data[i])
			}
			this.programCode = data[0].value;
		})

        this.service.get("/bpd-proj/bpd/projectLevel/getProjectLevelNameCombobox?projectType=120&"+Number(new Date()))
		.subscribe(data => {
			this.ClassficationStore = [];
			for(let i=0; i<data.length; i++) {
				this.ClassficationStore.push(data[i])
			}
			this.Classfication = data[0].value;
		})
	}

	public editBtn(item) {      // 编辑按钮
		this.display = true;
		this.save = false;
		this.saveChange = true;
		this.avdCode = item.adProjectCode;
		this.ApprovedDate = item.approveInvestmentDate;
		this.sop = item.sop;
		this.projectCode = item.projectCode;
		this.projectName = item.projectName;
		this.PTModel = item.ptModel;
		this.platform = item.modelPlatform;
		this.modelYear = item.modelYear;
		this.rpo = item.rpo;
		this.PTCount = item.ptCount;
		this.ApprovedInvestment = item.approveInvestment;
		this.ProjectSummary = item.projectSummary;
		this.projManager = item.projManager;
		this.InvestmentManager = item.projManagerName;
		this.service.post("/bpd-proj/bpd/program/getPowerTrainProgramCombobox",{})
		.subscribe(data => {
			this.programCodes = [];
			for(let i=0; i<data.length; i++) {
				this.programCodes.push(data[i])
			}
			this.programCode = item.programId;
		})
		
        this.service.get("/bpd-proj/bpd/projectLevel/getProjectLevelNameCombobox?projectType=120&"+Number(new Date()))
		.subscribe(data => {
			this.ClassficationStore = [];
			for(let i=0; i<data.length; i++) {
				this.ClassficationStore.push(data[i])
			}
			this.Classfication = item.projectLevelId;
		})

		this.service.get("/bpd-proj/bpd/projectCategory/getInvestAssumeCatCombobox?"+Number(new Date())+"&projectType=120")
		.subscribe(data => {
			this.projectCategoryStore = data;
			this.projectCategory = item.categoryCode ? item.categoryCode : data[0].value;

		})
	}

	public delBtn(item) {       // 删除按钮
		this.confirmationService.confirm({
	      message: 'Do You Want To Delete This Record?',
	      header: 'Delete Confirmation',
	      icon: 'fa fa-trash',
	      accept: () => {
	        this.service.get("/bpd-proj/bpd/powertrainProject/delete?adProjectCode="+item.adProjectCode + '&'+Number(new Date()))
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
				} else {
					this.msgservice.showError("Operation Error!");
					this.growLife = 5000;
			        this.msgs = this.msgservice.msgs;
				}
			})
	      }
	    });
	}

	public saveBtn() {
		let ApprovedDateStr = '';
		if(this.ApprovedDate.toString().length > 10){
			let year = this.ApprovedDate.getFullYear();
			let month = this.ApprovedDate.getMonth() + 1;
			let day = this.ApprovedDate.getDate();
			ApprovedDateStr = year + '-' + month + '-' + day;
		} else {
			ApprovedDateStr = this.ApprovedDate;
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
		this.service.post("/bpd-proj/bpd/powertrainProject/insert",{
			"projectCode": this.projectCode,
			"adProjectCode": this.avdCode,
			"projectName": this.projectName,
			"programId": this.programCode,
			"ptModel": this.PTModel,
			"modelPlatform": this.platform,
			"modelYear": this.modelYear,
			"rpo": this.rpo,
			"sop": sopStr,
			"ptCount": this.PTCount,
			"projectLevelId": this.Classfication,
			"projManager": this.projManager,
			"approveInvestment": this.ApprovedInvestment,
			"approveInvestmentDate": ApprovedDateStr,
			"projectSummary": this.ProjectSummary,
			"categoryCode": this.projectCategory
		})
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
		let ApprovedDateStr = '';
		if(this.ApprovedDate && this.ApprovedDate.toString().length > 10){
			let year = this.ApprovedDate.getFullYear();
			let month = this.ApprovedDate.getMonth() + 1;
			let day = this.ApprovedDate.getDate();
			ApprovedDateStr = year + '-' + month + '-' + day;
		} else {
			ApprovedDateStr = this.ApprovedDate;
		}
		let sopStr = '';
		if(this.sop && this.sop.toString().length > 10){
			let year = this.sop.getFullYear();
			let month = this.sop.getMonth() + 1;
			let day = this.sop.getDate();
			sopStr = year + '-' + month + '-' + day;
		} else {
			sopStr = this.sop;
		}
		this.service.post("/bpd-proj/bpd/powertrainProject/update",{
			"projectCode": this.projectCode,
			"adProjectCode": this.avdCode,
			"projectName": this.projectName,
			"programId": this.programCode,
			"ptModel": this.PTModel,
			"modelPlatform": this.platform,
			"modelYear": this.modelYear,
			"rpo": this.rpo,
			"sop": sopStr,
			"ptCount": this.PTCount,
			"projectLevelId": this.Classfication,
			"projManager": this.projManager,
			"approveInvestment": this.ApprovedInvestment,
			"approveInvestmentDate": ApprovedDateStr,
			"projectSummary": this.ProjectSummary,
			"categoryCode": this.projectCategory
		})
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

	public projectCodeChange() {
		console.log(this.projectCode)
	}

	public getUser() {
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
		this.InvestmentManager = e.data.userName;
		this.projManager = e.data.userCode;
		this.searchDialog = false;
		this.dialogDepartment = null;
	    this.dialogUserName = null;
	    this.dialogEmployeeCode = null;
	}

	public projectCodeCheck() {
		if(this.projectCode.length) {
			if(this.projectCode.length != 8) {
				this.msgservice.showInfo("projectCode length is not 8 bits!");
				this.growLife = 300000;
				this.msgs = this.msgservice.msgs;
				this.projectCode = '';
			}
		}
	}

	public paginate(e) {
		let observable = this.service.post("/bpd-proj/bpd/powertrainProject/getVList", {
        	"page": {
        		"page": e.page + 1,
        		"rows": e.rows
        	},
        	programId: this.programCodeSerch,
        	projectCode: this.projectCodeSerch,
        	projectName: this.projectNameSerch,
        	sop: (this.sorpYearSerch ? this.sorpYearSerch : "") + (this.sorpMonthSerch ? "-" + this.sorpMonthSerch : ""),
        	approveInvestmentDate: (this.approveDateYearSerch ? this.approveDateYearSerch : "") + (this.approveDateMonthSerch ? "-" + this.approveDateMonthSerch : ""),
        	projManager: this.checked ? window.localStorage.getItem("user") : null,
        	approveInvestment: this.approvedInvestmentSerch,
        	projectLevelId: this.categorySerch,
        	categoryCode: this.classificationSerch
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
        			this.gridStore.push({})
        		} else {
        			this.gridStore.push(data[i])
        		}
        	}
        }, err => {
        	for(let i = 0; i < 10; i++) {
	    		if(!this.gridStore[i]) {
	    			this.gridStore.push({})
	    		}
	    	}
        });
	}

	public programCodeSerch: string = "";

	public projectCodeSerch: string = "";

	public projectNameSerch: string = "";

	public yearSerchStore: any = [];

    public sorpYearSerch: string = "";

    public sorpMonthSerch: string = "";

    public approveDateYearSerch: string = "";

    public approveDateMonthSerch: string = "";

    public monthSerchStore: any = [];

    public approvedInvestmentSerch: number = null;

    public categorySerch: string = "";

    public classificationSerch: string = "";

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