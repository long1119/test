import { Component, OnInit } from '@angular/core';
import 'style-loader!./programInfo.scss';
import { SelectItem, ConfirmationService } from 'primeng/primeng';
import { HttpDataService } from '../../../service/http.service';
import { MessageService } from '../../../service/message.service';

@Component({
  selector: 'program-info',
  templateUrl: './programInfo.html',
  providers: [HttpDataService, MessageService, ConfirmationService]
})
export class ProgramInfo implements OnInit{

	public userRoot: boolean = true;

	public display: boolean = false;

	public gridStore: any = [];

	public gridStoreLen: number;

    public gridStoreRows: any = '10';

    public gridStoreFirst: any = 0;

    public gridStorePage: any = 0;

	public selectedStore: any = [];

	public memberStore: any = [];

	public modelStore: any = [];

	public investmentStore: any = [];

	public umdStore: any = [];

	public programTypeStore: SelectItem[] = [];

	public categroyStore: SelectItem[] = [];

    public selectedType: string;

    public selectedValue: string;

    public selectedId: string = '';

    public textarea: string = '';

    public save: boolean = true;

	public saveChange: boolean = false;

    public programCode: string = '';

    public programType: string = '';

    public platform: string = '';

    public categroy: string = '';

    public sorp: any = '';

    public eop: any = '';

    public lca: any = '';

    public lifeCycle: any = '';

    public projectSummary: string = '';

    public minDateValue: Date = new Date();

    public minEopDateValue: any = "";

    public maxDateValue: Date;

	public msgs: any;

    public growLife: number = 5000;

    public modelStoreLength: number;

	public investmentStoreLength: number;

    public yearRange: string;

    public programTypeSerchStore: any = [{label:'All',value:null},{label:'Vehicle Investment',value:'110'},{label:'Pownertarn',value:'120'}];

    public programTypeSerch: string = null;

    public platformSerch: string = null;

    public lcaSerch: number = null;

    public yearSerchStore: any = [];

    public sorpYearSerch: string = null;

    public sorpMonthSerch: string = null;

    public monthSerchStore: any = [];

    public eopYearSerch: string = null;

    public eopMonthSerch: string = null;

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
    
    ngOnInit() {
    	if(!JSON.parse(window.localStorage.getItem("authorityData"))["Maintain Inv. Program Info"] || 
    		JSON.parse(window.localStorage.getItem("authorityData"))["Maintain Inv. Program Info"] == 'false')
    	{
            this.userRoot = false;
        }
        let observable = this.service.post("/bpd-proj/bpd/program/getVListPT", {
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
        	}
        	for(let i = 0; i < 10; i++) {
        		if(!data[i]) {
        			this.gridStore.push({
        				'ip': i
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
		        	this.modelStoreLength = data1.total;
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
		        }, err => {
		        	for(let i = 0; i < 10; i++) {
			    		if(!this.modelStore[i]) {
			    			this.modelStore.push({
			    				'ip': i
			    			})
			    		}
			    	}
		        })
		        this.service.post("/bpd-proj/bpd/vehicleInvestProject/getVListByProgramId", {
		        	"programId": this.selectedId,
		        	"page": {
		        		"page": 1,
		        		"rows": 10
		        	}
		        })
		        .subscribe(data1 => {
		        	let data = data1.rows;
		        	this.investmentStoreLength = data1.total;
		        	for(let i = 0; i < data.length; i++) {
		        		data[i].id = i + 1;

		        	}
		        	for(let i = 0; i < 10; i++) {
		        		if(!data[i]) {
		        			this.investmentStore.push({
		        				'ip': i
		        			})
		        		} else {
		        			this.investmentStore.push(data[i])
		        		}
		        	}
		        }, err => {
		        	for(let i = 0; i < 10; i++) {
			    		if(!this.investmentStore[i]) {
			    			this.investmentStore.push({
			    				'ip': i
			    			})
			    		}
			    	}
		        })
        	}
        }, err => {
        	for(let i = 0; i < 10; i++) {
	    		if(!this.gridStore[i]) {
	    			this.gridStore.push({
	    				'ip': i
	    			})
	    		}
	    	}
        });
    }

    public programCodeSerch: string = null;

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

	public addBtn() {       // 新增
		this.display = true;
		this.save = true;
		this.saveChange = false;
		this.programCode = '';
		this.programType = '';
		this.platform = '';
		this.categroy = '';
		this.sorp = "";
		this.eop = "";
		this.lca = '';
		this.lifeCycle = '';
		this.projectSummary = '';
		this.minDateValue = new Date();
		this.minEopDateValue = "";
		this.maxDateValue = new Date("2099-01-01");
		this.service.post("/bpd-proj/bpd/projectType/getProjectTypeCombobox",{})
		.subscribe(data => {
			this.programTypeStore = [];
			for(let i=0; i<data.length; i++) {
				this.programTypeStore.push(data[i])
			}
			this.programType = data[0].value;
		})

        this.service.get("/bpd-proj/bpd/projectCategory/getInvestAssumeCatCombobox?projectType="+'120' +'&'+Number(new Date()))
		.subscribe(data => {
			this.categroyStore = [];
			for(let i=0; i<data.length; i++) {
				this.categroyStore.push(data[i])
			}
			this.categroy = data[0].value;
		})
	}

	public editBtn(item) {      // 编辑按钮
		this.display = true;
		this.save = false;
		this.saveChange = true;
		this.programCode = item.programCode;
		this.programType = item.programTypeCode;
		this.platform = item.modelPlatform;
		this.categroy = item.projectLevelId;
		this.sorp = item.sorp;
		this.eop = item.eop;
		this.lca = item.lcaVolume;
		this.lifeCycle = item.lifecycleVolume;
		this.projectSummary = item.competitor;
		this.minDateValue = new Date();
		this.minEopDateValue = new Date(item.sorp);
		this.maxDateValue = new Date("2099-01-01");
		this.service.post("/bpd-proj/bpd/projectType/getProjectTypeCombobox",{})
		.subscribe(data => {
			this.programTypeStore = [];
			for(let i=0; i<data.length; i++) {
				this.programTypeStore.push(data[i])
			}
			// this.programType = item.projectType;
		})

        this.service.get("/bpd-proj/bpd/projectCategory/getInvestAssumeCatCombobox?projectType="+'120' +'&'+Number(new Date()))
		.subscribe(data => {
			this.categroyStore = [];
			for(let i=0; i<data.length; i++) {
				this.categroyStore.push(data[i])
			}
			this.categroy = item.projectLevelId;
		})
	}

	public delBtn(item) {       // 删除按钮
		this.confirmationService.confirm({
	      message: 'Do You Want To Delete This Record?',
	      header: 'Delete Confirmation',
	      icon: 'fa fa-trash',
	      accept: () => {
	        this.service.get("/bpd-proj/bpd/program/delete?programId=" + item.programId +'&'+Number(new Date()))
			.subscribe(data => {
				if(data['code'] == 1) {
					this.msgservice.showSuccess("Operation Success!");
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

	public handleChange(e) {
		switch(e.index) {
			case 0:
				for(let i = 0; i < 10; i++) {
		    		if(!this.modelStore[i]) {
		    			this.modelStore.push({
		    				'ip': i
		    			})
		    		}
		    	}
				break;
			case 1:
				for(let i = 0; i < 10; i++) {
		    		if(!this.investmentStore[i]) {
		    			this.investmentStore.push({
		    				'ip': i
		    			})
		    		}
		    	}
				break;
			case 2:
				for(let i = 0; i < 10; i++) {
		    		if(!this.umdStore[i]) {
		    			this.umdStore.push({
		    				'ip': i
		    			})
		    		}
		    	}
				break;	
		}
	}

	

	public saveBtn() {
		let sorpStr = '';
		if(this.sorp.toString().length > 10){
			let year = this.sorp.getFullYear();
			let month = this.sorp.getMonth() + 1;
			let day = this.sorp.getDate();
			sorpStr = year + '-' + month + '-' + day;
		} else {
			sorpStr = this.sorp;
		}
		let eopStr = '';
		if(this.eop.toString().length > 10){
			let year = this.eop.getFullYear();
			let month = this.eop.getMonth() + 1;
			let day = this.eop.getDate();
			eopStr = year + '-' + month + '-' + day;
		} else {
			eopStr = this.eop;
		}
		this.service.post("/bpd-proj/bpd/program/insert",{
			"programCode": this.programCode,
			"projectType": '120',
			"modelPlatform": this.platform,
			"projectLevelId": this.categroy,
			"sorp": sorpStr,
			"eop": eopStr,
			"lcaVolume": this.lca,
			"lifecycleVolume": Math.ceil(this.lifeCycle),
			"competitor": this.projectSummary
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
		let sorpStr = '';
		if(this.sorp.toString().length > 10){
			let year = this.sorp.getFullYear();
			let month = this.sorp.getMonth() + 1;
			let day = this.sorp.getDate();
			sorpStr = year + '-' + month + '-' + day;
		} else {
			sorpStr = this.sorp;
		}
		let eopStr = '';
		if(this.eop.toString().length > 10){
			let year = this.eop.getFullYear();
			let month = this.eop.getMonth() + 1;
			let day = this.eop.getDate();
			eopStr = year + '-' + month + '-' + day;
		} else {
			eopStr = this.eop;
		}
		this.service.post("/bpd-proj/bpd/program/update",{
			"programCode": this.programCode,
			"projectType": '120',
			"modelPlatform": this.platform,
			"projectLevelId": this.categroy,
			"sorp": sorpStr,
			"eop": eopStr,
			"lcaVolume": this.lca,
			"lifecycleVolume": Math.ceil(this.lifeCycle),
			"competitor": this.projectSummary,
			"programId": this.selectedId
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

	public programGridRowClick(e) {    //  二级表格联动
		if(e.data.id) {
			this.selectedId = e.data.programId
			this.service.post("/bpd-proj/bpd/vehicleProject/getVList", {
	        	"programId": this.selectedId,
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
	        				'ip': i
	        			})
	        		} else {
	        			this.modelStore.push(data[i])
	        		}
	        	}
	        });
	        this.service.post("/bpd-proj/bpd/vehicleInvestProject/getVListByProgramId",{
	        	"programId": this.selectedId,
	        	"page": {
	        		"page": 1,
	        		"rows": 10
	        	}
	        })
	        .subscribe(data1 => {
	        	let data = data1.rows;
	        	this.investmentStore = [];
	        	for(let i = 0; i < data.length; i++) {
	        		data[i].id = i + 1;
	        	}
	        	for(let i = 0; i < 10; i++) {
	        		if(!data[i]) {
	        			this.investmentStore.push({
	        				'ip': i
	        			})
	        		} else {
	        			this.investmentStore.push(data[i])
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
        	this.investmentStore = [];
			for(let i = 0; i < 10; i++) {
    			this.investmentStore.push({
    				'ip': i
    			})
        	}
		}
	}

	public LCABlur(e) {
		if(this.sorp && this.eop) {
			let month = (this.eop.getFullYear() - this.sorp.getFullYear())*12 + (this.eop.getMonth() - this.sorp.getMonth() - (-1));
			month == 0 ? month = month+1 : month = month;
			this.lifeCycle = this.lca/12*month;
		} else {
			this.lca = '';
			this.msgservice.showInfo("Please Fill SORP/EOP");
            this.growLife = 300000;
	        this.msgs = this.msgservice.msgs;
		}
	}

	public eopBlur() {
		this.maxDateValue = this.eop;
	}

	public sorpBlur() {
		this.minEopDateValue = this.sorp;
	}

	public projectCodeCheck() {
		if(this.programCode.length) {
			if(this.programCode.length != 8) {
				this.msgservice.showInfo("ProgramCode Length Is Not 8 Bits!");
				this.growLife = 300000;
				this.msgs = this.msgservice.msgs;
				this.programCode = '';
			}
		}
	}

	public paginate(e) {
		let observable = this.service.post("/bpd-proj/bpd/program/getVListPT", {
        	"page": {
        		"page": e.page + 1,
        		"rows": e.rows
        	},
        	programCode: this.programCodeSerch,
        	programTypeCode: this.programTypeSerch,
        	modelPlatform: this.platformSerch,
        	lcaVolume: this.lcaSerch,
        	sorp: (this.sorpYearSerch ? this.sorpYearSerch : null) + (this.sorpMonthSerch ? "-" + this.sorpMonthSerch : null),
        	eop: (this.eopYearSerch ? this.eopYearSerch : null) + (this.eopMonthSerch ? "-" + this.eopMonthSerch : null)
        })
        .subscribe(data1 => {
        	this.gridStore = [];
        	let data = data1.rows;
        	this.gridStoreLen = data1.total;
	        this.gridStoreRows = e.rows;
	        this.gridStoreFirst = Number(e.first);
	        this.gridStorePage = e.page;
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
		        	this.modelStore = [];
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
		        })
		        this.service.post("/bpd-proj/bpd/vehicleInvestProject/getVListByProgramId", {
		        	"programId": this.selectedId,
		        	"page": {
		        		"page": 1,
		        		"rows": 10
		        	}
		        })
		        .subscribe(data1 => {
		        	let data = data1.rows;
		        	this.investmentStore = [];
		        	for(let i = 0; i < data.length; i++) {
		        		data[i].id = i + 1;

		        	}
		        	for(let i = 0; i < 10; i++) {
		        		if(!data[i]) {
		        			this.investmentStore.push({
		        				'ip': i
		        			})
		        		} else {
		        			this.investmentStore.push(data[i])
		        		}
		        	}
		        }, err => {
		        	for(let i = 0; i < 10; i++) {
			    		if(!this.investmentStore[i]) {
			    			this.investmentStore.push({
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
	        	this.investmentStore = [];
				for(let i = 0; i < 10; i++) {
	    			this.investmentStore.push({
	    				'ip': i
	    			})
	        	}
        	}
        	
        }, err => {
        	for(let i = 0; i < 10; i++) {
	    		if(!this.gridStore[i]) {
	    			this.gridStore.push({
	    				'ip': i
	    			})
	    		}
	    	}
        });
	}

	public paginateModelStore(e) {
		this.service.post("/bpd-proj/bpd/vehicleProject/getVList", {
        	"programId": this.selectedId,
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
        				'ip': i
        			})
        		} else {
        			this.modelStore.push(data[i])
        		}
        	}
        }, err => {
        	for(let i = 0; i < 10; i++) {
	    		if(!this.modelStore[i]) {
	    			this.modelStore.push({
	    				'ip': i
	    			})
	    		}
	    	}
        })
	}

	public paginateInvestmentStore(e) {
		this.service.post("/bpd-proj/bpd/vehicleInvestProject/getVListByProgramId", {
        	"programId": this.selectedId,
        	"page": {
        		"page": e.page + 1,
        		"rows": e.rows
        	}
        })
        .subscribe(data1 => {
        	let data = data1.rows;
        	this.investmentStore = [];
        	for(let i = 0; i < data.length; i++) {
        		data[i].id = i + 1;

        	}
        	for(let i = 0; i < e.rows; i++) {
        		if(!data[i]) {
        			this.investmentStore.push({
        				'ip': i
        			})
        		} else {
        			this.investmentStore.push(data[i])
        		}
        	}
        }, err => {
        	for(let i = 0; i < 10; i++) {
	    		if(!this.investmentStore[i]) {
	    			this.investmentStore.push({
	    				'ip': i
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