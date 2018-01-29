import { Component, OnInit } from '@angular/core';
import 'style-loader!./modelYear.scss';
import { SelectItem, ConfirmationService } from 'primeng/primeng';
import { HttpDataService } from '../../../service/http.service';
import { MessageService } from '../../../service/message.service';

@Component({
  selector: 'model-year',
  templateUrl: './modelYear.html',
  providers: [HttpDataService, MessageService, ConfirmationService]
})
export class ModelYear implements OnInit{

	public display: boolean = false;

	public programCodeSerch: string = "";

	public modelYearSerch: string = "";

	public modelYear: number = new Date().getFullYear()-4;

	public gridStore: any = [];

	public gridStoreLen: number;

    public gridStoreRows: any = '10';

    public gridStoreFirst: any = 0;

    public gridStorePage: any = 0;

	public selectedStore: any = [];

	public memberStore: any = [];

	public modelStore: any = [];

	public ptStore: any = [];

	public ptStoreLen: number;

    public ptStoreRows: any = '10';

    public ptStoreFirst: any = 0;

    public ptStorePage: any = 0;

	public umdStore: any = [];

	public umdStoreLen: number;

    public umdStoreRows: any = '10';

    public umdStoreFirst: any = 0;

    public umdStorePage: any = 0;

	public ProgramType: SelectItem[];

    public selectedType: string;

    public selectedValue: string;

    public selectedId: string = '';

    public textarea: string = '';

    public programCodeStore: SelectItem[] = [];

    public plantStore: SelectItem[] = [];

    public classficationStore: SelectItem[] = [];

    public projectManagerStore: SelectItem[] = [];

    public categoryStore: SelectItem[] = [];

    public save: boolean = true;

    public saveChange = false;

    public ptRpo: string = null;

    public projectNameBrief: string = null;

    public projectCode: string = '';

    public programCode: string = '';

    public plant: string = '';

    public sorp: any = "";

    public ptLineupId: string = '';

    public classfication: string = '';

    public projectManager: string = '';

    public category: string = '';

    public projectSummary: string = '';

    public PTSave: boolean = true;

	public PTSaveChange: boolean = false;

	public PTDisplay: boolean = false;

	public PTDownloadDisplay: boolean = false;

	public engine: string = '';

	public transimission: string = '';

	public UMDSave: boolean = true;

	public UMDSaveChange: boolean = false;

	public UMDDisplay: boolean = false;

	public modelCode: string = '';

	public UMDtransimission: string = '';

	public searchDialog: boolean = false;

	public dialogDepartment: string = null;

	public dialogUserName: string = null;

	public managerData: any = [];

	public managerDataRows: any = '10';

	public managerDataFirst: any = 0;

	public managerDataLen: number;

	public msgs: any;

    public growLife: number = 5000;

	public projManager: string = '';

	public haveModelYear: boolean = false;

	public userRoot: boolean = true;

	public selectedPlant: any = [];

	public arTemplateData: any[] = [];

	public selectedVersionData: any = {};

	constructor(private service: HttpDataService, private confirmationService: ConfirmationService, private msgservice: MessageService) {
	}
    
    ngOnInit() {
    	if(!JSON.parse(window.localStorage.getItem("authorityData"))["Maintain Model Year Veh.projects"] || 
    		JSON.parse(window.localStorage.getItem("authorityData"))["Maintain Model Year Veh.projects"] == 'false')
    	{
            this.userRoot = false;
        }
        let e = {page: 0, first: 0, rows: "10"};
        this.paginate(e);
	}
	
	public lookUpEnterSearch($event) {
		if ($event.key === "Enter") {
			this.lookUpBtn();
		}
	}

    public lookUpBtn() {
    	let e = {page: 0, first: 0, rows: "10"};
        this.paginate(e);
    }

	public addBtn() {       // 新增
		this.projectName = '';
		this.display = true;
		this.save = true;
		this.saveChange = false;
		this.ptRpo = null;
		this.projectNameBrief = null;
		this.projectCode = '';
		this.programCode = '';
		this.plant = '';
		this.classfication = '';
		this.category = '';
		this.projectSummary = '';
		this.projectManagerStore = [];
		this.modelYear = new Date().getFullYear()-4;
		this.modelYearLtt = 0;
		this.programCodeStore = [];
		this.service.get("/bpd-proj/bpd/program/getProgramComboboxByProjectMessage?projManager="+window.localStorage.getItem("user") +"&"+ Number(new Date()))
		.subscribe(data => {
			if(data.length) {
				for(let i=0; i<data.length; i++) {
					this.programCodeStore.push(data[i])
				}
				this.programCode = data[0].value;
				this.programCodeStr = data[0].label;
				this.service.get("/bpd-proj/bpd/program/getProgramManagerCombobox?programId="+this.programCode+"&"+Number(new Date()))
				.subscribe(data1 => {
					if(data1.length) {
						this.projectManagerStore = data1;
						this.projectManager = data1[0].label;
						this.projManager = data1[0].value;
						// this.projectManager = window.localStorage.getItem("userName");
						// this.projManager = window.localStorage.getItem("user");
						this.service.get("/bpd-proj/bpd/program/getSorpCombobox?programId="+this.programCode+"&"+Number(new Date()))
						.subscribe(data2 => {
							this.sorp = data2;
						})
					}
				})
			}
		})

		this.service.post("/bpd-proj/bpd/plant/getInvestAssumeCatCombobox",{})
		.subscribe(data => {
			for(let i=0; i<data.length; i++) {
				this.plantStore = data;
			}
			if(data.length) {
				this.plant = data[0].value;
			}
		})
		
		this.service.get("/bpd-proj/bpd/projectLevel/getProjectLevelNameCombobox?projectType=100&"+Number(new Date()))
		.subscribe(data => {
			if(data.length) {
				this.classficationStore = [];
				for(let i=0; i<data.length; i++) {
					this.classficationStore.push(data[i])
				}
				this.classfication = data[0].value;
				this.classficationStr = data[0].label;
			}
		})
		this.service.get("/bpd-proj/bpd/projectCategory/getInvestAssumeCatCombobox?projectType=100&"+Number(new Date()))
		.subscribe(data => {
			if(data.length) {
				this.categoryStore = [];
				for(let i=0; i<data.length; i++) {
					this.categoryStore.push(data[i])
				}
				this.category = data[0].value;
			}
		})
	}

	public editBtn(item) {      // 编辑按钮
		this.display = true;
		this.save = false;
		this.saveChange = true;
		this.ptRpo = item.ptRpo;
		this.projectNameBrief = item.projectNameBrief;
		this.projectCode = item.projectCode;
		this.projectName = item.projectName;
		this.sorp = item.sorp;
		this.projectManager = item.userName;
		this.projectSummary = item.projectSummary;
		this.projManager = item.projManager;
		this.modelYear = parseInt(item.modelYear);
		this.modelYearLtt = item.modelYear - parseInt(item.modelYear);
		this.programCode = item.programId;
		this.programCodeStr = item.programCode;
		this.service.get("/bpd-proj/bpd/program/getProgramManagerCombobox?programId="+this.programCode+"&"+Number(new Date()))
		.subscribe(data1 => {
			if(data1.length) {
				this.projectManagerStore = data1;
				this.projectManager = item.projManager;
			}
		})
		this.service.get("/bpd-proj/bpd/projectLevel/getProjectLevelNameCombobox?projectType=100&"+Number(new Date()))
		.subscribe(data => {
			if(data.length) {
				this.classficationStore = [];
				for(let i=0; i<data.length; i++) {
					this.classficationStore.push(data[i])
				}
				this.classfication = item.classification;
				this.classficationStr = item.levelName;
			}
		})

		this.service.post("/bpd-proj/bpd/plant/getInvestAssumeCatCombobox",{})
		.subscribe(data => {
			for(let i=0; i<data.length; i++) {
				this.plantStore = data;
			}
			if(data.length) {
				this.plant = item.plantCode;
			}
		})

		this.service.get("/bpd-proj/bpd/projectCategory/getInvestAssumeCatCombobox?projectType=100&"+Number(new Date()))
		.subscribe(data => {
			if(data.length) {
				this.categoryStore = [];
				for(let i=0; i<data.length; i++) {
					this.categoryStore.push(data[i])
				}
				this.category = item.categoryType ? item.categoryType : data[0].value;
			}
		})
	}

	public setPlantDialog: boolean = false;
	public getPlant() {
		this.setPlantDialog = true;
		this.service.post("/bpd-proj/bpd/plant/getInvestAssumeCatCombobox",{})
		.subscribe(data => {
			for(let i=0; i<data.length; i++) {
				this.plantStore = data;
			}
			this.selectedPlant = [];
			if(this.plant) {
				for(let i=0; i<this.plant.split(",").length; i++) {
					this.selectedPlant.push(this.plant.split(",")[i])
				}
			}
		})
	}

	public setPlantSaveBtn() {
		this.plant = this.selectedPlant.join(",");
		this.setPlantDialog = false;
	}

	public delBtn(item) {       // 删除按钮
		this.confirmationService.confirm({
	      message: 'Do You Want To Delete This Record?',
	      header: 'Delete Confirmation',
	      icon: 'fa fa-trash',
	      accept: () => {
	        this.service.get("/bpd-proj/bpd/vehicleProject/delete?adProjectCode=" + item.adProjectCode +'&'+Number(new Date()))
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
					this.msgservice.showInfo("You Can't Delete "+ item.programCode + ":" + item.modelYear +" Because Exists Timing Sheet!");
					this.growLife = 300000;
					this.msgs = this.msgservice.msgs;
				} else if(data['code'] == 4){
					this.msgservice.showInfo("You Can't Delete "+ item.programCode + ":" + item.modelYear +" Because Exists PT Lineup Info!");
					this.growLife = 300000;
					this.msgs = this.msgservice.msgs;
				} else if(data['code'] == 5){
					this.msgservice.showInfo("You Can't Delete "+ item.programCode + ":" + item.modelYear +" Because Exists UMD Info!");
					this.growLife = 300000;
					this.msgs = this.msgservice.msgs;
				} else if(data['code'] == 6){
					this.msgservice.showInfo("You Can't Delete "+ item.programCode + ":" + item.modelYear +" Because Exists Veh Project!");
					this.growLife = 300000;
					this.msgs = this.msgservice.msgs;
				} else if(data['code'] == 3){
					this.msgservice.showInfo("You Can't Delete "+ item.programCode + ":" + item.modelYear +" Because Exists NOD!");
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
		    		if(!this.ptStore[i]) {
		    			this.ptStore.push({
		    				'ip': i
		    			})
		    		}
		    	}
				break;
			case 1:
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

	public programGridRowClick(e) {    //  二级表格联动
		if(e.data.id) {
			this.haveModelYear = true;
			this.selectedId = e.data.adProjectCode
			this.service.post("/bpd-proj/bpd/ptLineup/getList", {
	        	"adProjectCode": this.selectedId,
	        	"page": {
	        		"page": 1,
	        		"rows": 10
	        	}
	        })
	        .subscribe(data1 => {
	        	this.ptStore = [];
	        	let data = data1.rows;
	        	for(let i = 0; i < data.length; i++) {
	        		data[i].id = i + 1;
	        	}
	        	for(let i = 0; i < 10; i++) {
	        		if(!data[i]) {
	        			this.ptStore.push({
	        				'ip': i
	        			})
	        		} else {
	        			this.ptStore.push(data[i])
	        		}
	        	}
	        }, err => {
	        	for(let i = 0; i < 10; i++) {
		    		if(!this.ptStore[i]) {
		    			this.ptStore.push({
		    				'ip': i
		    			})
		    		}
		    	}
	        })
	        this.service.post("/bpd-proj/bpd/projectUmd/getList", {
	        	"adProjectCode": this.selectedId,
	        	"page": {
	        		"page": 1,
	        		"rows": 10
	        	}
	        })
	        .subscribe(data1 => {
	        	this.umdStore = [];
	        	let data = data1.rows;
	        	for(let i = 0; i < data.length; i++) {
	        		data[i].id = i + 1;
	        	}
	        	for(let i = 0; i < 10; i++) {
	        		if(!data[i]) {
	        			this.umdStore.push({
	        				'ip': i
	        			})
	        		} else {
	        			this.umdStore.push(data[i])
	        		}
	        	}
	        }, err => {
	        	for(let i = 0; i < 10; i++) {
		    		if(!this.umdStore[i]) {
		    			this.umdStore.push({
		    				'ip': i
		    			})
		    		}
		    	}
	        }) 
		} else {
			this.haveModelYear = false;
			for(let i = 0; i < e.rows; i++) {
    			this.umdStore.push({
    				'ip': i
    			})
    			this.ptStore.push({
    				'ip': i
    			})
	    	}
		}
	}

	public changeValueLabel(_store,_value) {
		let newString = _store.filter(function(item){
		    if(item.value === _value) {
		    	return item['label'];
		    }
		});
		return newString[0].label;
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
		let ptRpoStr = "";
		let projectNameBriefStr = "";
		let ModelYearLttStr = "";
		if(this.ptRpo) {
			ptRpoStr = "-" + this.ptRpo;
		}
		if(this.projectNameBrief) {
			projectNameBriefStr = "-" + this.projectNameBrief;
		}
		if(this.changeValueLabel(this.modelYearLttStore,this.modelYearLtt) != '00') {
			ModelYearLttStr = "." + this.changeValueLabel(this.modelYearLttStore,this.modelYearLtt);
		}
		let projectNameStr = this.changeValueLabel(this.programCodeStore,this.programCode)+"-"+
			this.changeValueLabel(this.modelYearStore,this.modelYear)+
			ModelYearLttStr+ "-" + this.plant +
			ptRpoStr+
			projectNameBriefStr;
		this.service.post("/bpd-proj/bpd/vehicleProject/insert",{
			"projectCode": this.projectCode,
			"programId": this.programCode,
			"plantCode": this.plant,
			"sorp": sorpStr,
			"classification": this.classfication,
			"projManager": this.projManager,
			"categoryType": this.category,
			"projectSummary": this.projectSummary,
			"modelYear": this.modelYear + this.modelYearLtt,
			"ptRpo": this.ptRpo,
			"projectNameBrief": this.projectNameBrief,
			"projectName": projectNameStr
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
				this.msgservice.showInfo("Model Year Exists!");
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
		let ptRpoStr = "";
		let projectNameBriefStr = "";
		let ModelYearLttStr = "";
		if(this.ptRpo) {
			ptRpoStr = "-" + this.ptRpo;
		}
		if(this.projectNameBrief) {
			projectNameBriefStr = "-" + this.projectNameBrief;
		}
		if(this.changeValueLabel(this.modelYearLttStore,this.modelYearLtt) != '00') {
			ModelYearLttStr = "." + this.changeValueLabel(this.modelYearLttStore,this.modelYearLtt);
		}
		let projectNameStr = this.programCodeStr+"-"+
			this.changeValueLabel(this.modelYearStore,this.modelYear)+
			ModelYearLttStr+ "-" +
			this.plant+
			ptRpoStr+
			projectNameBriefStr;
		this.service.post("/bpd-proj/bpd/vehicleProject/update",{
			"projectCode": this.projectCode,
			"adProjectCode": this.selectedId,
			"programId": this.programCode,
			"projectName": projectNameStr,
			"plantCode": this.plant,
			"sorp": sorpStr,
			"classification": this.classfication,
			"projManager": this.projManager,
			"categoryType": this.category,
			"projectSummary": this.projectSummary,
			"modelYear": this.modelYear + this.modelYearLtt,
			"ptRpo": this.ptRpo,
			"projectNameBrief": this.projectNameBrief
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
				this.msgservice.showInfo("Model Year Exists!");
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

	public PTAddBtn() {
		this.PTDisplay = true;
		this.PTSave = true;
		this.PTSaveChange = false;
		this.engine = '';
		this.transimission = '';
	}

	public PTDownloadBtn() {
		this.PTDownloadDisplay = true;
		this.service.post('/bpd-proj/bpd/att/getVList', {
            bussinessId: "100"
        })
            .subscribe(data => {
                if (data.length != 0) {
                    this.arTemplateData = data;
                } else {
                    this.arTemplateData = [];
                }
            })
	}

	public downloadTemplateDblClick(idx, data) {
		let token = window.sessionStorage.getItem("access_token");
        let url: string = '/bpd-proj/bpd/att/downloadFiles?attIds=' + data.attId + "&_=" + Number(new Date());
        if (token) {
            let realToken = token.substr(1, token.length - 2)
            url = url + "&accessToken=" + realToken;
        }
		window.location.href = url;
		this.PTDownloadDisplay = false;
	}

	public PTEditBtn(item) {
		this.PTDisplay = true;
		this.PTSave = false;
		this.PTSaveChange = true;
		this.engine = item.engine;
		this.transimission = item.transmission;
		this.ptLineupId = item.ptLineupId;
	}

	public PTDelBtn(item) {
		this.confirmationService.confirm({
	      message: 'Do You Want To Delete This Record?',
	      header: 'Delete Confirmation',
	      icon: 'fa fa-trash',
	      accept: () => {
	        this.service.get("/bpd-proj/bpd/ptLineup/delete?ptLineupId=" + item.ptLineupId +'&'+Number(new Date()))
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
			        this.paginatePtStore(e);
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

	public PTCancelBtn() {
		this.PTDisplay = false;
	}

	public PTSaveBtn() {
		this.service.post("/bpd-proj/bpd/ptLineup/insert",{
			"engine" : this.engine,
			"transmission": this.transimission,
			"adProjectCode": this.selectedId
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
		        this.paginatePtStore(e);
		        this.PTDisplay = false;
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

	public PTSaveChangeBtn() {
		this.service.post("/bpd-proj/bpd/ptLineup/update",{
			"engine" : this.engine,
			"transmission": this.transimission,
			"ptLineupId": this.ptLineupId
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
		        this.paginatePtStore(e);
		        this.PTDisplay = false;
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


	public UMDAddBtn() {
		this.UMDDisplay = true;
		this.UMDSave = true;
		this.UMDSaveChange = false;
		this.modelCode = '';
		this.UMDtransimission = '';
	}

	public UMDEditBtn(item) {
		this.UMDDisplay = true;
		this.UMDSave = false;
		this.UMDSaveChange = true;
		this.modelCode = item.modelCode;
		this.UMDtransimission = item.comments;
	}

	public UMDDelBtn(item) {
		this.confirmationService.confirm({
	      message: 'Do You Want To Delete This Record?',
	      header: 'Delete Confirmation',
	      icon: 'fa fa-trash',
	      accept: () => {
	        this.service.get("/bpd-proj/bpd/projectUmd/delete?modelCode=" + item.modelCode +'&adProjectCode='+ this.selectedId)
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
			        this.paginateUmdStore(e);
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

	public UMDCancelBtn() {
		this.UMDDisplay = false;
	}

	public UMDSaveBtn() {
		this.service.post("/bpd-proj/bpd/projectUmd/insert",{
			"modelCode" : this.modelCode,
			"comments": this.UMDtransimission,
			"adProjectCode": this.selectedId 
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
		        this.paginateUmdStore(e);
		        this.UMDDisplay = false;
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

	public UMDSaveChangeBtn() {
		this.service.post("/bpd-proj/bpd/projectUmd/update",{
			"modelCode" : this.modelCode,
			"comments": this.UMDtransimission,
			"adProjectCode": this.selectedId
		})
		.subscribe(data => {
			if(data['code'] == 1) {
				let e = {
		            page: this.gridStorePage, 
		            first: this.gridStoreFirst, 
		            rows: this.gridStoreRows,
		            pageCount: Math.ceil(this.gridStoreLen/this.gridStoreRows)
		        }
		        this.paginateUmdStore(e);
		        this.UMDDisplay = false;
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

	public getUser() {
		this.dialogDepartment = null;
	    this.dialogUserName = null;
		this.service.post("/bpd-proj/bpd/user/getVList", {
			"page": {
                "page": 1,
                "rows": 10
            },
            "departmentName" : this.dialogDepartment,
			"userName": this.dialogUserName
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
		this.service.post("/bpd-proj/bpd/user/getVList",{
    		"page": {
                "page": e.page + 1,
                "rows": e.rows
            },
            "departmentName" : this.dialogDepartment,
			"userName": this.dialogUserName
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
		this.projectManager = e.data.userName;
		this.projManager = e.data.userCode;
		this.searchDialog = false;
		this.dialogDepartment = null;
	    this.dialogUserName = null;
	}

	public paginate(e) {
		let observable = this.service.post("/bpd-proj/bpd/vehicleProject/getVList", {
        	"page": {
        		"page": e.page + 1,
        		"rows": e.rows
        	},
        	"programCode": this.programCodeSerch,
        	"modelYear": this.modelYearSerch,
        	"modelYearFlag": "1"
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
        		if(data[i].projectStauts == 0) {
        			data[i].projectStauts = 'Freezed';
        		} else {
        			data[i].projectStauts = 'Unfreezed';
        		}
        	}
        	if(data[0]) {
        		this.haveModelYear = true;
        		for(let i = 0; i < e.rows; i++) {
	        		if(!data[i]) {
	        			this.gridStore.push({
	        				'ip': i
	        			})
	        		} else {
	        			this.gridStore.push(data[i])
	        		}
	        	}
	        	this.selectedStore = data[0];
	            this.selectedId = data[0].adProjectCode;
	            this.service.post("/bpd-proj/bpd/ptLineup/getList", {
		        	"adProjectCode": this.selectedId,
		        	"page": {
		        		"page": 1,
		        		"rows": 10
		        	}
		        })
		        .subscribe(data1 => {
		        	let data = data1.rows;
		        	this.ptStore = [];
		        	for(let i = 0; i < data.length; i++) {
		        		data[i].id = i + 1;
		        	}
		        	for(let i = 0; i < 10; i++) {
		        		if(!data[i]) {
		        			this.ptStore.push({
		        				'ip': i
		        			})
		        		} else {
		        			this.ptStore.push(data[i])
		        		}
		        	}
		        }, err => {
		        	for(let i = 0; i < 10; i++) {
			    		if(!this.ptStore[i]) {
			    			this.ptStore.push({
			    				'ip': i
			    			})
			    		}
			    	}
		        })
		        this.service.post("/bpd-proj/bpd/projectUmd/getList", {
		        	"adProjectCode": this.selectedId,
		        	"page": {
		        		"page": 1,
		        		"rows": 10
		        	}
		        })
		        .subscribe(data1 => {
		        	this.umdStore = [];
					let data = data1.rows;
		        	for(let i = 0; i < data.length; i++) {
		        		data[i].id = i + 1;
		        	}
		        	for(let i = 0; i < e.rows; i++) {
		        		if(!data[i]) {
		        			this.umdStore.push({
		        				'ip': i
		        			})
		        		} else {
		        			this.umdStore.push(data[i])
		        		}
		        	}
		        }, err => {
		        	for(let i = 0; i < e.rows; i++) {
			    		if(!this.umdStore[i]) {
			    			this.umdStore.push({
			    				'ip': i
			    			})
			    		}
			    	}
		        })
        	} else {
        		this.haveModelYear = false;
        		for(let i = 0; i < e.rows; i++) {
	    			this.umdStore.push({
	    				'ip': i
	    			})
	    			this.ptStore.push({
	    				'ip': i
	    			})
		    	}
		    	for(let i = 0; i < e.rows; i++) {
		    		if(!this.gridStore[i]) {
		    			this.gridStore.push({
		    				'ip': i
		    			})
		    		}
		    	}
        	}
        }, err => {
        	for(let i = 0; i < e.rows; i++) {
	    		if(!this.gridStore[i]) {
	    			this.gridStore.push({
	    				'ip': i
	    			})
	    		}
	    	}
        });
	}

	public paginatePtStore(e) {
		this.service.post("/bpd-proj/bpd/ptLineup/getList", {
        	"adProjectCode": this.selectedId,
        	"page": {
        		"page": e.page + 1,
        		"rows": e.rows
        	}
        })
        .subscribe(data1 => {
        	this.ptStore = [];
	        this.ptStoreLen = data1.total;
	        this.ptStoreRows = e.rows;
	        this.ptStoreFirst = Number(e.first);
	        this.ptStorePage = e.page;
	        let data = data1.rows;
        	for(let i = 0; i < data.length; i++) {
        		data[i].id = i + 1;
        	}
        	for(let i = 0; i < e.rows; i++) {
        		if(!data[i]) {
        			this.ptStore.push({
        				'ip': i
        			})
        		} else {
        			this.ptStore.push(data[i])
        		}
        	}
        }, err => {
        	for(let i = 0; i < e.rows; i++) {
	    		if(!this.ptStore[i]) {
	    			this.ptStore.push({
	    				'ip': i
	    			})
	    		}
	    	}
        })
	}

	public paginateUmdStore(e) {
		this.service.post("/bpd-proj/bpd/projectUmd/getList", {
        	"adProjectCode": this.selectedId,
        	"page": {
        		"page": e.page + 1,
        		"rows": e.rows
        	}
        })
        .subscribe(data1 => {
			this.umdStore = [];
	        this.umdStoreLen = data1.total;
	        this.umdStoreRows = e.rows;
	        this.umdStoreFirst = Number(e.first);
	        this.umdStorePage = e.page;
	        let data = data1.rows;
        	for(let i = 0; i < data.length; i++) {
        		data[i].id = i + 1;
        	}
        	for(let i = 0; i < e.rows; i++) {
        		if(!data[i]) {
        			this.umdStore.push({
        				'ip': i
        			})
        		} else {
        			this.umdStore.push(data[i])
        		}
        	}
        }, err => {
        	for(let i = 0; i < e.rows; i++) {
	    		if(!this.umdStore[i]) {
	    			this.umdStore.push({
	    				'ip': i
	    			})
	    		}
	    	}
        })
	}

	public ExportBtn() {
		if(!this.programCodeSerch) {
			this.programCodeSerch = ""
		}
		if(!this.modelYearSerch) {
			this.modelYearSerch = "";
		}
		let token = window.sessionStorage.getItem("access_token");
		let url: string = "/bpd-proj/bpd/vehicleProject/exportExcel?programCode="+this.programCodeSerch+"&modelYearFlag=1&modelYear="+this.modelYearSerch + '&_=' + Number(new Date());
		if (token) {
			let realToken = token.substr(1, token.length - 2)
			url = url + "&accessToken=" + realToken;
		}
		window.location.href = url;
	}

	public projectName: string = '';

	public programCodeStr: string = '';

	public classficationStr: string = '';


	public programCodeChange(e) {
		this.service.get("/bpd-proj/bpd/program/getProgramManagerCombobox?programId="+e.value+"&"+Number(new Date()))
		.subscribe(data1 => {
			this.projectManagerStore = data1;
			this.projectManager = data1[0].label;
			this.projManager = data1[0].value;
			// this.projectManager = window.localStorage.getItem("userName");
			// this.projManager = window.localStorage.getItem("user");
			this.service.get("/bpd-proj/bpd/program/getSorpCombobox?programId="+e.value+"&"+Number(new Date()))
			.subscribe(data => {
				this.sorp = data;
			})
		})
	}

	// modelYear Edit
	public modelYearLttStore: any = [
		{label:'00',value:0},
		{label:'25',value:0.25},
		{label:'50',value:0.5},
		{label:'75',value:0.75}
	];

	public modelYearStore: any = [
		{label:'MY14',value:new Date().getFullYear()-4},
		{label:'MY15',value:new Date().getFullYear()-3},
		{label:'MY16',value:new Date().getFullYear()-2},
		{label:'MY17',value:new Date().getFullYear()-1},
		{label:'MY18',value:new Date().getFullYear()},
		{label:'MY19',value:new Date().getFullYear()+1},
		{label:'MY20',value:new Date().getFullYear()+2},
		{label:'MY21',value:new Date().getFullYear()+3},
		{label:'MY22',value:new Date().getFullYear()+4},
		{label:'MY23',value:new Date().getFullYear()+5},
		{label:'MY24',value:new Date().getFullYear()+6},
		{label:'MY25',value:new Date().getFullYear()+7},
		{label:'MY26',value:new Date().getFullYear()+8},
		{label:'MY27',value:new Date().getFullYear()+9},
		{label:'MY28',value:new Date().getFullYear()+10}
	]

	public modelYearLtt: number = 0;

	
};