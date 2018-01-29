import { Component, OnInit } from '@angular/core';
import 'style-loader!./buildingProject.scss';
import { SelectItem, ConfirmationService } from 'primeng/primeng';
import { HttpDataService } from '../../../service/http.service';
import { MessageService } from '../../../service/message.service';

@Component({
  selector: 'building-project',
  templateUrl: './buildingProject.html',
  providers: [HttpDataService, MessageService, ConfirmationService]
})
export class BuildingProject implements OnInit{

	public display: boolean = false;

	public gridStore: any = [];

	public gridStoreLen: number;

    public gridStoreRows: any = '10';

    public gridStoreFirst: any = 0;

    public gridStorePage: any = 0;

	public ProgramType: SelectItem[];

    public selectedType: string;

    public selectedValue: string;

    public selectedId: string = '';

    public textarea: string = '';

    public PlantStore: SelectItem[] = [];

    public ClassficationStore: SelectItem[] = [];

    public InvestmentManagerStore: SelectItem[] = [];

    public projectCode: string = '';

	public avdCode: string = '';
 	
 	public projectName: string = '';

 	public Classfication: string = '';

 	public landArea: number = null;

 	public building: number = null;

 	public sop: any = '';

 	public InvestmentManager: string = '';

 	public Plant: string = '';

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

	public ApprovedInvestment: string = "";

	public ApprovedDate: any = '';

	public approvedInvestmentSerch: string = "";

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
    	if(!JSON.parse(window.localStorage.getItem("authorityData"))["Maintainr Fac.Project"] || 
    		JSON.parse(window.localStorage.getItem("authorityData"))["Maintainr Fac.Project"] == 'false')
    	{
            this.userRoot = false;
        }
        let observable = this.service.post("/bpd-proj/bpd/buildProj/getVList", {
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
        		if(data[i].projStatus == 1) {
        			data[i].projStatus = 'close';
        		} else {
        			data[i].projStatus = 'Initial';
        		}

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
	 	this.projectName = '';
	 	this.Classfication = '';
	 	this.landArea = null;
	 	this.building = null;
	 	this.sop = '';
	 	this.InvestmentManager = window.localStorage.getItem("userName");
	 	this.projManager = window.localStorage.getItem("user");
	 	this.Plant = '';
		this.ProjectSummary = '';
		this.service.get("/bpd-proj/bpd/buildProj/createAdProjCode?"+Number(new Date()))
		.subscribe(data => {
			this.avdCode = data;
			this.projectCode = data;
		});
		this.ClassficationStore = [];
		this.service.get("/bpd-proj/bpd/projectCategory/getInvestAssumeCatCombobox?projectType=200&"+Number(new Date()))
		.subscribe(data => {
			this.ClassficationStore = data;
			this.Classfication = data[0].value;
		})
	}

	public editBtn(item) {      // 编辑按钮
		this.display = true;
		this.save = false;
		this.saveChange = true;
		this.avdCode = item.adProjCode;
		this.projectCode = item.projCode;
	 	this.projectName = item.projName;
	 	this.Classfication = item.categoryCode;
	 	this.landArea = item.landArea;
	 	this.building = item.buildArea;
	 	this.sop = item.sop;
	 	this.InvestmentManager = item.userName;
	 	this.projManager = item.projManager
	 	this.Plant = item.loc;
		this.ProjectSummary = item.projSum;
		this.ClassficationStore = [];
		this.ApprovedInvestment = item.approvedInvestment;
		this.ApprovedDate = item.approvedInvestmentDate;
		this.service.get("/bpd-proj/bpd/projectCategory/getInvestAssumeCatCombobox?projectType=200&"+Number(new Date()))
		.subscribe(data => {
			this.ClassficationStore = data;
			this.Classfication = item.categoryCode ? item.categoryCode : data[0].value;
		})
	}

	public delBtn(item) {       // 删除按钮
		this.confirmationService.confirm({
	      message: 'Do You Want To Delete This Record?',
	      header: 'Delete Confirmation',
	      icon: 'fa fa-trash',
	      accept: () => {
	        this.service.get("/bpd-proj/bpd/buildProj/delete?adProjCode="+item.adProjCode +'&'+Number(new Date()))
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
		let sopStr = '';
		if(this.sop.toString().length > 10){
			let year = this.sop.getFullYear();
			let month = this.sop.getMonth() + 1;
			let day = this.sop.getDate();
			sopStr = year + '-' + month + '-' + day;
		} else {
			sopStr = this.sop;
		}
		let approvedDateStr = "";
		if(this.ApprovedDate.toString().length > 10){
			let year = this.ApprovedDate.getFullYear();
			let month = this.ApprovedDate.getMonth() + 1;
			let day = this.ApprovedDate.getDate();
			approvedDateStr = year + '-' + month + '-' + day;
		} else {
			approvedDateStr = this.sop;
		}
		this.service.post("/bpd-proj/bpd/buildProj/insert",{
			"adProjCode": this.avdCode,
			"projCode": this.projectCode,
			"projName": this.projectName,
			"categoryCode": this.Classfication,
			"landArea": this.landArea,
			"buildArea": this.building,
			"sop": sopStr,
			"projManager": this.projManager,
			"loc": this.Plant,
			"projSum": this.ProjectSummary,
			"projStatus": 0,
			"approveInvestmentDate": approvedDateStr,
			"approveInvestment": this.ApprovedInvestment
		})
		.subscribe(data => {
			if(data['code'] == 1){
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
		let sopStr = '';
		if(this.sop.toString().length > 10){
			let year = this.sop.getFullYear();
			let month = this.sop.getMonth() + 1;
			let day = this.sop.getDate();
			sopStr = year + '-' + month + '-' + day;
		} else {
			sopStr = this.sop;
		}
		let approvedDateStr = "";
		if(this.ApprovedDate.toString().length > 10){
			let year = this.ApprovedDate.getFullYear();
			let month = this.ApprovedDate.getMonth() + 1;
			let day = this.ApprovedDate.getDate();
			approvedDateStr = year + '-' + month + '-' + day;
		} else {
			approvedDateStr = this.sop;
		}
		this.service.post("/bpd-proj/bpd/buildProj/update",{
			"adProjCode": this.avdCode,
			"projCode": this.projectCode,
			"projName": this.projectName,
			"categoryCode": this.Classfication,
			"landArea": this.landArea,
			"buildArea": this.building,
			"sop": sopStr,
			"projManager": this.projManager,
			"loc": this.Plant,
			"projSum": this.ProjectSummary,
			"projStatus": 0,
			"approveInvestmentDate": approvedDateStr,
			"approveInvestment": this.ApprovedInvestment
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

	public getUser() {
		this.dialogDepartment = null;
	    this.dialogUserName = null;
	    this.dialogEmployeeCode = null;
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

	public yearSerchStore: any = [];

    public sorpYearSerch: string = "";

    public sorpMonthSerch: string = "";

    public monthSerchStore: any = [];

	public paginate(e) {
		let observable = this.service.post("/bpd-proj/bpd/buildProj/getVList", {
			"page": {
        		"page": e.page + 1,
        		"rows": e.rows
        	},
        	projCode: this.projectCodeSerch,
        	projName: this.projectNameSerch,
        	categoryName: this.classificationSerch,
        	loc: this.locationSerch,
        	landArea: this.landSerch,
        	buildArea: this.buildingSerch,
        	sop: (this.sorpYearSerch ? this.sorpYearSerch : "") + (this.sorpMonthSerch ? "-" + this.sorpMonthSerch : ""),
			projManager: this.checked ? window.localStorage.getItem("user") : null,
			approveInvestment: this.approvedInvestmentSerch
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
        		if(data[i].projStatus == 1) {
        			data[i].projStatus = 'close';
        		} else {
        			data[i].projStatus = 'Initial';
        		}

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

	public projectCodeSerch: string = null;

	public projectNameSerch: string = null;

	public classificationSerch: string = "";

	public locationSerch: string = "";

	public buildingSerch: number = null;

	public landSerch: number = null;

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