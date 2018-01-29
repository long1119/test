import { Component, OnInit, ElementRef } from '@angular/core';
import 'style-loader!./budgetReview.scss';
import { SelectItem, TreeNode, MenuItem, ConfirmationService } from 'primeng/primeng';
import { HttpDataService } from '../../../service/http.service';
import { MessageService } from '../../../service/message.service';
import { DataManageService } from '../../../service/dataManage.service';
import { RefreshMenuService } from '../../../service/refreshMenu.service';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'budget-review',
  templateUrl: './budgetReview.html',
  providers: [HttpDataService, MessageService, DataManageService, RefreshMenuService, ConfirmationService]
})
export class BudgetReview implements OnInit{

    public step: number = 1;

    public haveData: boolean = true;

    public msgs: any;
	
	public projectTypeSerch: string = null;

    public budgetItemSerchStore: any[] = [];

    public budgetItemSerch: string = "";

	public projectTypeSerchStore: any = [];

	public projectCodeSerch: string = null;

	public approvedInvestmentSerch: number = null;

	public selectedStore: any = [];

    public step2SelectedStore: any = [];

	public gridStore: any = [];

	public gridStoreLen: number;

	public budgetStore: any = [];

	public display: boolean = false;

    public ABMGridStore: any = [];

    public ABMselectedStore: any = {};

    public items: any;

    public WBEItemNameSerch: string = null;

    public ItemNameSerch: string = null;

    public AmountSerch: number = null;

    public lookupDisplay: boolean = false;

    public step2MainStore: any = [];

    public assumeStore: any = [];

    public plantStore: any = [];

    public plant: string = '';

    public plantCode: string = '';

    public costBookRegionName: string = '';

    public costBookRegionCode: string = '';

    public AuditLogStore: any = [];

    public treeTitle: string = '';

    public selectCategoryDisplay: boolean = false;

    public selectCategoryStore: any = [];

    public SCselectedStore: any = [];

    public selectRoleDisplay: boolean = false;

    public selectRoleStore: any = [];

    public budgetVersionName: string = '';

    public expirationTime: any;

    public undefinedField1: string = 'Part Import';

    public undefinedField2: string = 'Part Local';

    public undefinedField3: string = 'Die Set Import';

    public undefinedField4: string = 'Die Set Local';

    public undefinedField5: string = 'New/Modification';

    public commitDisplay: boolean = true;

    public importDisplay: boolean = true;

    public status4: boolean = false;

    public step2RegionCategoryCode: string = '';

    public step2Params: any;

    public assumeParams: any;

    public parameterDisplay: boolean = false;

    public parameterValue: string = '';

    public step1sonGrid: any;

    public addDialog: boolean = false;

    public wbsL7Display: boolean = false;

    public wbsL7Value: any;

    public wbsL7Index: any;

    public wbsDisplay: boolean = false;

    public wbsTreeStore: any = [];

    public messageDialog: boolean = false;

    public messageData: any = [];

    public uploadURL: string = '/bpd-proj/bpd/projectBudgetDetail/importProjectBudgetDetail';

    public selextedTree: any;

    // public costBookDisplay: boolean = true;

    public selectedFile: any = [];

    public isFlag: boolean = false;

    public wbsTreeSelectedStore: any = [];

    public wbsClickItem: any;

    public allowAssign: boolean = true;

    public yearRange: string;

    public isManager: boolean = true;

    public isJump: boolean = false;

    public checked: boolean = true;

	constructor(private service: HttpDataService, private confirmationService: ConfirmationService, private msgservice: MessageService, public route: ActivatedRoute,private dataManageService: DataManageService, private refreshMenuService: RefreshMenuService,private el:ElementRef) {
        // 刷新菜单
        let flag = this.dataManageService.getUuId();
        this.refreshMenuService.refreshMenu(flag);
        // 日期年份设置
        let currentYear = new Date().getFullYear();
        this.yearRange = "" + (Number(currentYear) - 10) + ":" + (Number(currentYear) + 50);
	}
    
    ngOnInit() {
        this.route.params.subscribe((data:any) => {
            if(data.projectCode) {
                this.isJump = true;
                let item: any = {
                    "approvedAmount" : data.status == 4 ? data.statusCount : 0,
                    "approvingAmount" : data.status == 2 ? data.statusCount : 0,
                    "budgetAmount" : data.status == 1 ? data.statusCount : 0,
                    "budgetVersionName" : data.budgetVersionName,
                    "disapprovedAmount" : data.status == 3 ? data.statusCount : 0,
                    "projectCode" : data.adProjectCode,
                    "adProjectCode": data.adProjectCode,
                    "projectManager": data.projectManager,
                    "status": data.status,
                    "projectName": data.projectName,
                    "projectType": data.projectType,
                    "plantCode": data.plantCode,
                    "plantName": data.plantName
                }
                this.selectedStore.projectName = data.projectName;
                this.selectedStore.projectType = data.projectType;
                this.selectedStore.adProjectCode = data.adProjectCode;
                this.selectedStore.projectCode = data.projectCode;
                this.selectedStore.plantCode = data.plantCode == "null" ? null : data.plantCode;
                this.selectedStore.plantName = data.plantName == "null" ? "" : data.plantName;
                this.selectedStore.projectManager = data.projectManager;
                this.selectedStore.status = data.status;
                this.budgetEditBtn(item);

            } else {
                this.isJump = false;
            }
        });

    	this.service.post("/bpd-proj/bpd/projectType/getPTCombobox",{})
    	.subscribe(data => {
            this.projectTypeSerchStore = [];
            for(let i=0; i<data.length; i++) {
                if(data[i].value != '100') {
                    this.projectTypeSerchStore.push({
                        label: data[i].label,
                        value: data[i].value
                    })
                }
            }
            this.projectTypeSerchStore.unshift({
                label: 'All',
                value: null
            })
            this.projectTypeSerch = null;
    	})

        this.service.post("/bpd-proj/bpd/allProjInfo/getByTypeCode",{
        	"page": {
        		"page": 1,
        		"rows": 10
        	},
        	"projectType": this.projectTypeSerch,
        	"projectCode": this.projectCodeSerch,
        	"approveInvestment": this.approvedInvestmentSerch,
            "budgetFlag": "1",
            "projectManager": this.checked ? window.localStorage.getItem("user") : null
        })
        .subscribe(data1 => {
        	this.gridStoreAjax(data1);
        })
    }

    public checkedChange() {
        this.ngOnInit();
    }

    public gridStoreAjax(data1) {	// 主表ajax
    	this.gridStore = [];
    	this.gridStoreLen = data1.total;
    	let data = data1.rows
    	for(let i = 0; i < data.length; i++) {
    		data[i].id = i + 1;
    		if(data[i].projectStatus == 0) {
				data[i].projectStatus = 'Runing';
    		} else if(data[i].projectStatus == 1) {
    			data[i].projectStatus = 'Closed';
    		} else {
    			data[i].projectStatus = 'Initial';
    		}
    	}
    	for(let i = 0; i < 10; i++) {
    		if(!data[i]) {
    			this.gridStore.push({
    				"ip": i+1
    			})
    		} else {
    			this.gridStore.push(data[i])
    		}
    	}
    	
        if(data.length) {
            this.haveData = true;
            if (!this.route.params['_value'].projectCode) {
                this.selectedStore = data[0];
                if(this.selectedStore.projectManager == window.localStorage.getItem("user")) {
                    this.isManager = true;
                } else {
                    this.isManager = false; 
                }
            }
            if(this.selectedStore.projectManager == window.localStorage.getItem('user')) {
                this.allowAssign = false;
            } else {
                this.allowAssign = true;
            }
            this.service.post("/bpd-proj/bpd/projectBudget/getMap",{
                "projectCode" : this.selectedStore.adProjectCode,
                "userCode": window.localStorage.getItem('user'),
                "projectType": this.selectedStore.projectType
            })
            .subscribe(data => {
                this.budgetStore = [];
                this.budgetVersionStore = [];
                if(data.length < 10) {
                    for(let i = 0; i < 10; i++) {
                        if(!data[i]) {
                            this.budgetStore.push({
                                "ip": i+1
                            })
                        } else {
                            data[i].id = i + 1;
                            data[i].approveDoaBrief = (data[i].approveDoa && data[i].approveDoa.length>10)  ? data[i].approveDoa.substr(0,10)+"..." : data[i].approveDoa;
                            this.budgetStore.push(data[i]);
                            this.budgetVersionStore.push({
                                label: data[i].budgetVersionName,
                                value: data[i].budgetVersionName
                            })
                            this.budgetVersion = this.budgetVersionStore[0].value;
                        }
                    }
                } else {
                    for(let i = 0; i < data.length; i++) {
                        data[i].id = i + 1;
                        data[i].approveDoaBrief = (data[i].approveDoa && data[i].approveDoa.length>10)  ? data[i].approveDoa.substr(0,10)+"..." : data[i].approveDoa;
                        this.budgetStore.push(data[i]);
                        this.budgetVersionStore.push({
                            label: data[i].budgetVersionName,
                            value: data[i].budgetVersionName
                        })
                        this.budgetVersion = this.budgetVersionStore[0].value;
                    }
                }
            })
        } else {
            this.haveData = false;
            this.budgetStore = [];
            this.firstPageFileStore = [];
            for(let i = 0; i < 10; i++) {
                this.budgetStore.push({
                    ip: i
                });
            }
        }
    }

    public approveInvestmentEnterSearch($event) { // 回车模糊搜索
        if ($event.key === "Enter") {
            this.lookUpBtn();
        }
    }

    public lookUpBtn() { 	//模糊搜索
    	this.service.post("/bpd-proj/bpd/allProjInfo/getByTypeCode",{
        	"page": {
        		"page": 1,
        		"rows": 10
        	},
        	"projectType": this.projectTypeSerch,
        	"projectCode": this.projectCodeSerch,
        	"approveInvestment": this.approvedInvestmentSerch,
            "budgetFlag": "1"
        })
        .subscribe(data1 => {
        	this.gridStoreAjax(data1);
        })
    }

    public paginate(e) {		// 主表格分页
		this.service.post("/bpd-proj/bpd/allProjInfo/getByTypeCode",{
        	"page": {
        		"page": e.page + 1,
        		"rows": e.rows
        	},
        	"projectType": this.projectTypeSerch,
        	"projectCode": this.projectCodeSerch,
        	"approveInvestment": this.approvedInvestmentSerch,
            "budgetFlag": "1"
        })
        .subscribe(data1 => {
        	this.gridStore = [];
        	this.gridStoreLen = data1.total;
	    	let data = data1.rows
	    	for(let i = 0; i < data.length; i++) {
	    		data[i].id = i + 1;
	    		if(data[i].projectStatus == 0) {
					data[i].projectStatus = 'Runing';
	    		} else if(data[i].projectStatus == 1) {
	    			data[i].projectStatus = 'Closed';
	    		} else {
	    			data[i].projectStatus = 'Initial';
	    		}
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
	    	
            if(data.length) {
                this.haveData = true;
                if (!this.route.params['_value'].projectCode)  {
                    this.selectedStore = data[0];
                    if(this.selectedStore.projectManager == window.localStorage.getItem("user")) {
                        this.isManager = true;
                    } else {
                        this.isManager = false; 
                    }
                }
                this.service.post("/bpd-proj/bpd/projectBudget/getMap",{
                    "projectCode" : this.selectedStore.adProjectCode,
                    "userCode": window.localStorage.getItem('user'),
                    "projectType": this.selectedStore.projectType
                })
                .subscribe(data => {
                    this.budgetStore = [];
                    if(data.length < 10) {
                        for(let i = 0; i < 10; i++) {
                            if(!data[i]) {
                                this.budgetStore.push({
                                    "ip": i+1
                                })
                            } else {
                                data[i].id = i + 1;
                                data[i].approveDoaBrief = (data[i].approveDoa && data[i].approveDoa.length>10)  ? data[i].approveDoa.substr(0,10)+"..." : data[i].approveDoa;
                                this.budgetStore.push(data[i])
                            }
                        }
                    } else {
                        for(let i = 0; i < data.length; i++) {
                            data[i].id = i + 1;
                            data[i].approveDoaBrief = (data[i].approveDoa && data[i].approveDoa.length>10)  ? data[i].approveDoa.substr(0,10)+"..." : data[i].approveDoa;
                            this.budgetStore.push(data[i]);
                        }
                    }
                }) 
            } else {
                this.haveData = false;
                this.budgetStore = [];
                this.firstPageFileStore = [];
                for(let i = 0; i < 10; i++) {
                    this.budgetStore.push({
                        ip: i
                    });
                }
            }
        })
	}

    public programGridRowClick(e) {		//主表行点击事件
        if (!this.route.params['_value'].projectCode) {
            this.selectedStore = e.data;
            if(this.selectedStore.projectManager == window.localStorage.getItem("user")) {
                this.isManager = true;
            } else {
                this.isManager = false; 
            }
        }
        if(this.selectedStore.projectManager == window.localStorage.getItem('user')) {
            this.allowAssign = false;
        } else {
            this.allowAssign = true;
        }
        if(e.data.id) {
            this.haveData = true;
            this.service.post("/bpd-proj/bpd/projectBudget/getMap",{
                "projectCode" : this.selectedStore.adProjectCode,
                "userCode": window.localStorage.getItem('user'),
                "projectType": this.selectedStore.projectType
            })
            .subscribe(data => {
                this.budgetStore = [];
                this.budgetVersionStore = [];
                if(data.length < 10) {
                    for(let i = 0; i < 10; i++) {
                        if(!data[i]) {
                            this.budgetStore.push({
                                "ip": i+1
                            })
                        } else {
                            data[i].id = i + 1;
                            data[i].approveDoaBrief = (data[i].approveDoa && data[i].approveDoa.length>10)  ? data[i].approveDoa.substr(0,10)+"..." : data[i].approveDoa;
                            this.budgetStore.push(data[i])
                            this.budgetVersionStore.push({
                                label: data[i].budgetVersionName,
                                value: data[i].budgetVersionName
                            })
                            this.budgetVersion = this.budgetVersionStore[0].value;
                        }
                    }
                } else {
                    for(let i = 0; i < data.length; i++) {
                        data[i].id = i + 1;
                        data[i].approveDoaBrief = (data[i].approveDoa && data[i].approveDoa.length>10)  ? data[i].approveDoa.substr(0,10)+"..." : data[i].approveDoa;
                        this.budgetStore.push(data[i]);
                        this.budgetVersionStore.push({
                            label: data[i].budgetVersionName,
                            value: data[i].budgetVersionName
                        })
                        this.budgetVersion = this.budgetVersionStore[0].value;
                    }
                }
            })
            this.getBudgetGrid();
        } else {
            this.haveData = false;
            this.budgetStore = [];
            this.firstPageFileStore = [];
            for(let i = 0; i < 10; i++) {
                this.budgetStore.push({
                    "ip": i+1
                })
            }
        }
    }

    public isAr: boolean = false;
    public ABMGridStoreAr: any = [];
    public AssignBudgetMission() {
        if(this.selectedStore.projectType == '300') {
            this.isAr = true;
            this.service.post("/bpd-proj/bpd/arProjectRegion/getVList",{
                adProjectCode: this.selectedStore.adProjectCode,
                arRegionFlag: '1'
            })
            .subscribe(data => {
                this.ABMGridStoreAr = [];
                if(data.length < 10) {
                    for(let i = 0; i < 10; i++) {
                        if(!data[i]) {
                            this.ABMGridStoreAr.push({
                                "ip": i+1
                            })
                        } else {
                            data[i].id = i + 1;
                            this.ABMGridStoreAr.push(data[i])
                        }
                    }
                } else {
                    for(let i = 0; i < data.length; i++) {
                        data[i].id = i + 1;
                        this.ABMGridStoreAr.push(data[i]);
                    }
                }
            })
            this.budgetVersionName = new Date().getFullYear().toString();
            this.expirationTime = null;
        } else {
            this.isAr = false;
            this.ABMGridStore = [];
            this.selectCategoryStore = [];
            this.SCselectedStore = [];
            this.expirationTime = null;
            this.budgetVersionName = null;
        }
    	this.display = true;
        this.service.get("/bpd-proj/bpd/projectBudget/getProjectBudgetCombobox?projectCode="+this.selectedStore.adProjectCode)
        .subscribe(data => {
            this.copyVersionStore = data;
            this.copyVersionStore.unshift({
                label: "Select",
                value: null
            })
            this.copyVersion = data[0].value;
        })

        if(this.isAr) {
            this.service.get("/bpd-proj/bpd/plant/getCompanyCombobox")
            .subscribe(data => {
               this.appPlantStore = data; 
               this.assPlant = data[0].value;
            })
        } else {
            this.service.post("/bpd-proj/bpd/plant/getPlantCombobox",{})
            .subscribe(data => {
               this.appPlantStore = data; 
               this.assPlant = data[0].value;
            })
        }
    }

    public appPlantStore: any = [];

    public assPlant: string = "";

    //  第一页文档上传
    public firstPageFileStore: any = [];
    public selectBudgetDisplay: boolean = false;
    public budgetVersionStore: any = [];
    public budgetVersion: string = null;
    public budgetUploadDialog: boolean = false;
    public budgetUploadURL: string = "/bpd-proj/bpd/att/upload";

    public firstPageChange(e) {   //  第一步tab页签切换
        this.getBudgetGrid();
    }

    public firstPageUploadBtn() {  // 选取区域
        if(this.budgetVersionStore.length) {
            this.budgetVersion = this.budgetVersionStore[0].value;
            this.selectBudgetDisplay = true;
        } else {
            this.msgservice.showInfo("No Budget Vision");
            this.msgs = this.msgservice.msgs;
        }
    }

    public selectBudgetSaveBtn() {  // 上传文件
        this.budgetVersion = this.budgetVersionStore.length ? this.budgetVersion : null;
        this.UuId = this.dataManageService.getUuId();

        this.budgetUploadURL = "/bpd-proj/bpd/att/upload?bussinessId=" + 
            this.selectedStore.adProjectCode +"/"+ this.budgetVersion + 
            "&attId=" + this.UuId + "&projId=" + 
            this.selectedStore.adProjectCode + "&sourceType=budgetProj";

        this.budgetUploadDialog = true;
    }

    // public allowUpload: boolean = false;
    public onBudgetUpload(e) {
        this.service.get('/bpd-proj/bpd/projectBudget/addAtt?attId=' + this.UuId + "&type=projectBudget")
        .subscribe(data => {
            if (data.code == 1) {
                this.msgservice.showSuccess("Operate Success!");
                this.getBudgetGrid();
            } else {
                this.msgservice.showError("Operate Failed!");
            }
            this.msgs = this.msgservice.msgs;
        })
        this.budgetUploadDialog = false;
        this.selectBudgetDisplay = false;
    }

    public downloadVersionFile(item) {
        this.service.get("/bpd-proj/bpd/att/downloadFiles?attIds=" + item.attId)
        .subscribe(data => {
            if(data['code'] == 0) {
              this.msgservice.showInfo("Can Not Find File!");
              this.msgs = this.msgservice.msgs; 
            } else {
              let token = window.sessionStorage.getItem("access_token");
              let url: string = "/bpd-proj/bpd/att/downloadFiles?attIds=" + item.attId + '&_=' + Number(new Date());
              if (token) {
                let realToken = token.substr(1, token.length - 2)
                url = url + "&accessToken=" + realToken;
              }
              window.location.href = url;
            }
        })
    }

    public downloadBudgetFile(item) {
        this.service.get("/bpd-proj/bpd/att/downloadFiles?attIds=" + item.attId)
        .subscribe(data => {
            if(data['code'] == 0) {
              this.msgservice.showInfo("Can not find file!");
              this.msgs = this.msgservice.msgs; 
            } else {
              let token = window.sessionStorage.getItem("access_token");
              let url: string = "/bpd-proj/bpd/att/downloadFiles?attIds=" + item.attId + '&_=' + Number(new Date());
              if (token) {
                let realToken = token.substr(1, token.length - 2)
                url = url + "&accessToken=" + realToken;
              }
              window.location.href = url;
            }
        })
    }

    public delBudgetFile(item) {
        this.confirmationService.confirm({
          message: 'Do You Want To Delete This Record?',
          header: 'Delete Confirmation',
          icon: 'fa fa-trash',
          accept: () => {
            this.service.get('/bpd-proj/bpd/att/delete?' + Number(new Date()) + "&attIds=" + item.attId)
            .subscribe(data => {
                if (data.code == 1) {
                    this.msgservice.showSuccess("Operate Success!");
                    this.getBudgetGrid();
                } else {
                    this.msgservice.showError("Operate Failed!");
                }
                this.msgs = this.msgservice.msgs;
            })
          }
        });
    }

    public getBudgetGrid() {
        if(this.selectedStore.id) {
            this.service.post('/bpd-proj/bpd/projectBudget/getBudgetFile', {
                projectCode: this.selectedStore.adProjectCode
            })
            .subscribe(data => {
                this.firstPageFileStore = data;
            })
        } else {
            this.firstPageFileStore = [];
        }
    }

    public exportRegionBudget(item) {
        let token = window.sessionStorage.getItem("access_token");
        let url: string = '/bpd-proj/bpd/projectBudgetDetail/exportExcel1?adProjectCode='+ this.selectedStore.adProjectCode+'&budgetVersionName='+encodeURI(item.budgetVersionName) + "&projectType=" + this.selectedStore.projectType + "&_=" + Number(new Date());
        if (token) {
            let realToken = token.substr(1, token.length - 2)
            url = url + "&accessToken=" + realToken;
        }
        window.location.href = url;
    }

    public commitAll(item) {
        this.confirmationService.confirm({
          message: 'Do You Want To Withdraw Budget?',
          header: 'Warn Confirmation',
          icon: 'fa fa-exclamation-triangle',
          accept: () => {
            this.service.get("/bpd-proj/bpd/projectBudget/approvingFlag?projectCode=" + item.projectCode+"&budgetVersionName="+item.budgetVersionName+"&projectType="+this.selectedStore.projectType+"&"+Number(new Date()))
            .subscribe(data => {
                if(data['code'] == 1) {
                    this.msgservice.showSuccess("Success");
                    this.msgs = this.msgservice.msgs;
                    this.getStep1BottomStore();
                } else if(data['code'] == 2) {
                    this.msgservice.showInfo("Please Set Plant Code");
                    this.msgs = this.msgservice.msgs;
                } else {
                    this.msgservice.showError("Operation Error!");
                    this.msgs = this.msgservice.msgs;
                }
            })
          }
        });
    }

    public approveBudgetItem:any = {};
    public approveBudget(item) {
        this.setApproveDisplay = true;
        this.approveBudgetItem = item;
        this.approveDoa = "";
        this.approveDate = "";
    }

    public setApproveDisplay: boolean = false;
    public approveDoa: string = "";
    public approveDate: any = "";
    public approveSave() {
        let approveDateStr = '';
        if(this.approveDate.toString().length > 10){
            let year = this.approveDate.getFullYear();
            let month = this.approveDate.getMonth() + 1;
            let day = this.approveDate.getDate();
            approveDateStr = year + '-' + month + '-' + day;
        } else {
            approveDateStr = this.approveDate;
        }
        let params = {};
        if(this.selectedStore.projectType == '110') {
            params = {
                projectCode1: this.selectedStore.projectCode,
                projectType: this.selectedStore.projectType,
                approveDoa: this.approveDoa,
                approveDate: approveDateStr,
                projectCode: this.selectedStore.adProjectCode,
                budgetVersionName: this.approveBudgetItem.budgetVersionName
            }
        } else if(this.selectedStore.projectType == '300') {
            params = {
                projectCode1: this.selectedStore.projectCode,
                projectType: this.selectedStore.projectType,
                approveDoa: this.approveDoa,
                approveDate: approveDateStr,
                projectCode: this.selectedStore.adProjectCode,
                budgetVersionName: this.approveBudgetItem.budgetVersionName,
                plantCode: this.selectedStore.plantCode
            }
        } else {
            params = {
                projectCode1: this.selectedStore.projectCode,
                projectType: this.selectedStore.projectType,
                approveDoa: this.approveDoa,
                approveDate: approveDateStr,
                projectCode: this.selectedStore.adProjectCode,
                budgetVersionName: this.approveBudgetItem.budgetVersionName,
                plantCode: this.selectedStore.plantName
            }
        }
        this.service.post("/bpd-proj/bpd/projectBudget/approve",params)
        .subscribe(data => {
            if(data['code'] == 1) {
                this.msgservice.showSuccess("Success");
                this.msgs = this.msgservice.msgs;
                this.setApproveDisplay = false;
                this.getStep1BottomStore();
                this.service.post("/bpd-proj/bpd/projectCostBook/insertMisc",{
                    projectCode: this.selectedStore.projectCode,
                    budgetVersionName: this.approveBudgetItem.budgetVersionName,
                    planBudget: this.approveBudgetItem.miscTotal
                })
                .subscribe(data => {
                    console.log(data['code'])
                })
            } else {
                this.msgservice.showInfo(data['msg']);
                this.msgs = this.msgservice.msgs;
            }
        })
    }

    public FreezeBtn(item) {
        if(item.freezeFlag == 1) {
            this.confirmationService.confirm({
              message: 'Do You Want To FX unFix Budget?',
              header: 'Warn Confirmation',
              icon: 'fa fa-exclamation-triangle',
              accept: () => {
                this.service.get("/bpd-proj/bpd/projectBudget/freezeFlag?projectCode=" + item.projectCode+"&budgetVersionName="+item.budgetVersionName+"&budgetFreezeFlag=0"+"&"+Number(new Date()))
                .subscribe(data => {
                    if(data['code'] == 1) {
                        this.msgservice.showSuccess("Success");
                        this.msgs = this.msgservice.msgs;
                        this.getStep1BottomStore();
                    } else {
                        this.msgservice.showError("Operation Error!");
                        this.msgs = this.msgservice.msgs;
                    }
                })
              }
            });
        } else {
           this.confirmationService.confirm({
              message: 'Do you want to FX Fix Budget?',
              header: 'Warn Confirmation',
              icon: 'fa fa-exclamation-triangle',
              accept: () => {
                this.service.get("/bpd-proj/bpd/projectBudget/freezeFlag?projectCode=" + item.projectCode+"&budgetVersionName="+item.budgetVersionName+"&budgetFreezeFlag=1"+"&"+Number(new Date()))
                .subscribe(data => {
                    if(data['code'] == 1) {
                        this.msgservice.showSuccess("Success");
                        this.msgs = this.msgservice.msgs;
                        this.getStep1BottomStore();
                    } else {
                        this.msgservice.showError("Operation Error!");
                        this.msgs = this.msgservice.msgs;
                    }
                })
              }
            }); 
        }
    }

    public versionSelect: string = "";
    public viewBudgetMissionDisplay: boolean = false;
    public viewMissionGridStore: any = [];
    public versionSelectStore: any = [];

    public ViewBudgetMission() {
        this.viewBudgetMissionDisplay = true;
        this.service.get("/bpd-proj/bpd/projectBudget/getProjectBudgetCombobox?projectCode="+this.selectedStore.adProjectCode)
        .subscribe(data => {
            this.versionSelectStore = data;
            this.versionSelectStore.unshift({
                label: "Select",
                value: null
            })
            this.versionSelect = data[0].value;
        })
        this.service.post("/bpd-proj/bpd/projectBudget/getRegionCatNameAndUser",{
            projectCode: this.selectedStore.adProjectCode
        })
        .subscribe(data => {
            this.viewMissionGridStore = [];
            if(data.length < 10) {
                for(let i = 0; i < 10; i++) {
                    if(!data[i]) {
                        this.viewMissionGridStore.push({
                            "ip": i+1
                        })
                    } else {
                        data[i].id = i + 1;
                        this.viewMissionGridStore.push(data[i])
                    }
                }
            } else {
                for(let i = 0; i < data.length; i++) {
                    data[i].id = i + 1;
                    this.viewMissionGridStore.push(data[i]);
                }
            }
        })
    }

    public selectionChange(e) {
        this.service.post("/bpd-proj/bpd/projectBudget/getRegionCatNameAndUser",{
            projectCode: this.selectedStore.adProjectCode,
            budgetVersionName: e.value
        })
        .subscribe(data => {
            this.viewMissionGridStore = [];
            if(data.length < 10) {
                for(let i = 0; i < 10; i++) {
                    if(!data[i]) {
                        this.viewMissionGridStore.push({
                            "ip": i+1
                        })
                    } else {
                        data[i].id = i + 1;
                        this.viewMissionGridStore.push(data[i])
                    }
                }
            } else {
                for(let i = 0; i < data.length; i++) {
                    data[i].id = i + 1;
                    this.viewMissionGridStore.push(data[i]);
                }
            }
        })
    }

    public getStep1BottomStore() {
        this.service.post("/bpd-proj/bpd/projectBudget/getMap",{
            "projectCode" : this.selectedStore.adProjectCode,
            "userCode": window.localStorage.getItem('user'),
            "projectType": this.selectedStore.projectType
        })
        .subscribe(data => {
            this.budgetStore = [];
            if(data.length < 10) {
                for(let i = 0; i < 10; i++) {
                    if(!data[i]) {
                        this.budgetStore.push({
                            "ip": i+1
                        })
                    } else {
                        data[i].id = i + 1;
                        data[i].approveDoaBrief = (data[i].approveDoa && data[i].approveDoa.length>10)  ? data[i].approveDoa.substr(0,10)+"..." : data[i].approveDoa;
                        this.budgetStore.push(data[i])
                    }
                }
            } else {
                for(let i = 0; i < data.length; i++) {
                    data[i].id = i + 1;
                    data[i].approveDoaBrief = (data[i].approveDoa && data[i].approveDoa.length>10)  ? data[i].approveDoa.substr(0,10)+"..." : data[i].approveDoa;
                    this.budgetStore.push(data[i]);
                }
            }
        })
    }

    public budgetEditBtn(item) {  // 编辑按钮，跳转下一页
        this.service.get('/bpd-proj/bpd/investmentProperty/getPropertyCombobox?'+Number(new Date()))
        .subscribe(data => {
            data.unshift({
                label: "All",
                value: null
            })
            this.budgetItemSerchStore = data;
            this.budgetItemSerch = data[0].value;
            this.WBEItemNameSerch = null;
            this.ItemNameSerch = null;
            this.AmountSerch = null;
        })
        if(this.selectedStore.projectType == '300' || this.selectedStore.projectType == '110') {
            this.plantCode = this.selectedStore.plantCode;
        } else {
            this.plantCode = this.selectedStore.plantName;
        }
        this.plant = this.selectedStore.plantName;
        this.step1sonGrid = item;
        this.step = 2;
        this.treeTitle = this.selectedStore.projectName;
        this.service.post("/bpd-proj/bpd/projectBudget/getTreeList",{
            "projectCode": item.projectCode,
            "budgetVersionName": item.budgetVersionName,
            "userCode": this.selectedStore.projectManager == window.localStorage.getItem('user') ? null : window.localStorage.getItem('user'),
            "status": this.isJump ? this.selectedStore.status : null
        })
        .subscribe(data => {
            let item1 = [];
            let item1Children = [];
            if(data[0].data.length) {
                for(let j=0; j<data[0].data.length; j++) {
                    for(let i=0; i<data[0].data[j].children.length; i++) {
                        item1Children.push({
                            label: data[0].data[j].children[i].data.regionName,
                            value: data[0].data[j].children[i].data.regionCode,
                            budgetVersionName: data[0].data[j].data.budgetVersionName,
                            regionCategoryName: data[0].data[j].data.regionCategoryName,
                            regionCategoryCode: data[0].data[j].data.regionCategoryCode,
                            adProjectCode: data[0].data[j].data.projectCode,
                            catFlag: data[0].data[j].data.catFlag,
                            colorFlag: data[0].data[j].children[i].data.colorFlag,
                            commitDisplay: false,
                            status: 1,
                            command: (event) => {
                                this.selextedTree = event;
                                this.getStep2MainStore(event);
                                this.commitDisplay = false;
                            }
                        })
                    }
                    item1.push({
                        label: data[0].data[j].data.regionCategoryName,
                        icon: 'fa-calendar',
                        children: item1Children,
                        expanded: false
                    })
                    item1Children = [];
                }
            }
            let item2 = [];
            let item2Children = [];
            if(data[1].data.length) {
                for(let j=0; j<data[1].data.length; j++) {
                    for(let i=0; i<data[1].data[j].children.length; i++) {
                        item2Children.push({
                            label: data[1].data[j].children[i].data.regionName,
                            value: data[1].data[j].children[i].data.regionCode,
                            budgetVersionName: data[1].data[j].data.budgetVersionName,
                            regionCategoryName: data[1].data[j].data.regionCategoryName,
                            regionCategoryCode: data[1].data[j].data.regionCategoryCode,
                            adProjectCode: data[1].data[j].data.projectCode,
                            catFlag: data[1].data[j].data.catFlag,
                            colorFlag: data[1].data[j].children[i].data.colorFlag,
                            commitDisplay: true,
                            status: 2,
                            command: (event) => {
                               this.selextedTree = event;
                               this.getStep2MainStore(event);
                               this.commitDisplay = true;
                            }
                        })
                    }
                    item2.push({
                        label: data[1].data[j].data.regionCategoryName,
                        icon: 'fa-check-square-o',
                        children: item2Children,
                        expanded: false
                    })
                    item2Children = [];
                }
            }
            let item3 = [];
            let item3Children = [];
            if(data[2].data.length) {
                for(let j=0; j<data[2].data.length; j++) {
                    for(let i=0; i<data[2].data[j].children.length; i++) {
                        item3Children.push({
                            label: data[2].data[j].children[i].data.regionName,
                            value: data[2].data[j].children[i].data.regionCode,
                            budgetVersionName: data[2].data[j].data.budgetVersionName,
                            regionCategoryName: data[2].data[j].data.regionCategoryName,
                            regionCategoryCode: data[2].data[j].data.regionCategoryCode,
                            adProjectCode: data[2].data[j].data.projectCode,
                            catFlag: data[2].data[j].data.catFlag,
                            colorFlag: data[2].data[j].children[i].data.colorFlag,
                            commitDisplay: false,
                            status: 3,
                            command: (event) => {
                                this.selextedTree = event;
                                this.getStep2MainStore(event);
                                this.commitDisplay = false;
                            }
                        })
                    }
                    item3.push({
                        label: data[2].data[j].data.regionCategoryName,
                        icon: 'fa-exclamation-circle',
                        children: item3Children,
                        expanded: false
                    })
                    item3Children = [];
                }
            }
            let item4 = [];
            let item4Children = [];
            if(data[3].data.length) {
                for(let j=0; j<data[3].data.length; j++) {
                    for(let i=0; i<data[3].data[j].children.length; i++) {
                        item4Children.push({
                            label: data[3].data[j].children[i].data.regionName,
                            value: data[3].data[j].children[i].data.regionCode,
                            budgetVersionName: data[3].data[j].data.budgetVersionName,
                            regionCategoryName: data[3].data[j].data.regionCategoryName,
                            regionCategoryCode: data[3].data[j].data.regionCategoryCode,
                            adProjectCode: data[3].data[j].data.projectCode,
                            catFlag: data[3].data[j].data.catFlag,
                            colorFlag: data[3].data[j].children[i].data.colorFlag,
                            commitDisplay: false,
                            status: 4,
                            command: (event) => {
                                this.selextedTree = event;
                                this.getStep2MainStore(event);
                                this.commitDisplay = false;
                            }
                        })
                    }
                    item4.push({
                        label: data[3].data[j].data.regionCategoryName,
                        icon: 'fa-check-square-o green',
                        children: item4Children,
                        expanded: false
                    })
                    item4Children = [];
                }
            }
            for(let i=0; i<4; i++) {
                if(data[i].data.length) {
                    if(i==0) {
                       this.selectedFile = item1[0].children[0];
                       this.commitDisplay = false;
                       this.importDisplay = true;
                       this.status4 = false;
                       break; 
                    } else if(i==1) {
                       this.selectedFile = item2[0].children[0];
                       this.commitDisplay = true;
                       this.importDisplay = true;
                       this.status4 = false;
                       break; 
                    } else if(i==2) {
                       this.selectedFile = item3[0].children[0];
                       this.commitDisplay = false;
                       this.importDisplay = true;
                       this.status4 = false;
                       break;
                    } else if(i==3) {
                        console.log(item4[0])
                       this.selectedFile = item4[0].children[0]; 
                       this.commitDisplay = false;
                       this.importDisplay = false;
                       this.status4 = true;
                       break;
                    }
                }
            }
            let event: any = {};
            event.item = this.selectedFile;
            // let e: any = {
            //     node: this.selectedFile 
            // }
            // this.selsctTreeEvent = e;
            if(this.selectedFile.catFlag == '1') {
                this.isFlag = true;
                this.selextedTree = event;
                this.getStep2FlagMainStore(event);
            } else {
                this.isFlag = false;
                this.selextedTree = event;
                this.getStep2MainStore(event);
            }
            this.items = [
                {
                    label: 'Wating For Budget (' + item.budgetAmount + ')',
                    icon: 'fa-calendar',
                    children: item1,
                    expanded: true
                },
                {
                    label: 'Waiting For Approving (' + item.approvingAmount + ')',
                    icon: 'fa-check-square-o',
                    children: item2,
                    expanded: true
                },
                {
                    label: 'BPD Return (' + item.disapprovedAmount + ')',
                    icon: 'fa-exclamation-circle',
                    children: item3,
                    expanded: true
                },
                {
                    label: 'BPD Approved (' + item.approvedAmount + ')',
                    icon: 'fa-check-square-o green',
                    children: item4,
                    expanded: true
                }
            ];

        })
    }

    public isExpanded: boolean = false;

    public expandAll(){
        for(let i=0; i<this.items.length; i++) {
            for(let j=0; j<this.items[i].children.length; j++) {
                this.items[i].children[j].expanded = true;
            }
        }
        this.nodeExpandAll();
        this.isExpanded = true;
    }

    public collapseAll(){
        for(let i=0; i<4; i++) {
            for(let j=0; j<this.items[i].children.length; j++) {
                this.items[i].children[j].expanded = false;
            }
        }
        this.isExpanded = false;
    }

    public selsctTreeEvent: any = {};
    public nodeSelect(e) {
        let event: any = {};
        event.item = e.node;
        this.selsctTreeEvent = e;
        if(!e.node.children) {
            if(e.node.catFlag == '1') {
                this.isFlag = true;
                this.selextedTree = event;
                this.getStep2FlagMainStore(event);
            } else {
                this.isFlag = false;
                this.selextedTree = event;
                this.getStep2MainStore(event);
            }
            let index = {
                index: this.tabIndex
            }
            this.handleChange(index);
            if(e.node.commitDisplay) {
                this.commitDisplay = true;
            } else {
                this.commitDisplay = false;
            }
            if(e.node.parent.icon == "fa-calendar" || 
                e.node.parent.icon == "fa-check-square-o" || 
                e.node.parent.icon == "fa-exclamation-circle") {
                this.importDisplay = true;
                this.status4 = false;
            } else {
                this.importDisplay = false;
                this.status4 = true;
            }
        }
    }

    public nodeExpand(e) {
        if(e.node.parent) {
            setTimeout(()=>{
                this.setColor(e);
            },10)
        }
    }

    public setColor(e) {
        for(let i=0; i<e.node.children.length; i++) {
            if(e.node.children[i].colorFlag) {
                e.originalEvent.target.parentNode.nextElementSibling.getElementsByTagName("p-treenode")[i].getElementsByTagName("li")[0].style.backgroundColor = "#e6e6e6";
            }
        }
    }

    public nodeExpandAll() {
        setTimeout(()=>{
            let colorFlagArr = [];
            for(let i=0; i<this.items.length; i++) {
                for(let j=0; j<this.items[i].children.length; j++) {
                    for(let x=0; x<this.items[i].children[j].children.length; x++) {
                        if(this.items[i].children[j].children[x].colorFlag) {
                            colorFlagArr.push(true);
                        } else {
                            colorFlagArr.push(false);
                        }
                    }
                }
            }
            for(let i=0; i<colorFlagArr.length; i++) {
                if(colorFlagArr[i]) {
                    this.el.nativeElement.querySelectorAll(".ui-treenode .ui-treenode-leaf")[i].style.backgroundColor = "#e6e6e6";
                } else {
                    this.el.nativeElement.querySelectorAll(".ui-treenode .ui-treenode-leaf")[i].style.backgroundColor = "#fff";
                }
            }
        },10)
    }

    public step2FlaggridStoreRows: any = '10';
    public step2FlaggridStoreFirst: any = 0;
    public step2FlaggridStoreLen: number = 0;
    public step2FlaggridStorePage: any = 0;
    public getStep2FlagMainStore(event) {
        //文件上传
        this.adProjectBusinessId = event.item.adProjectCode + "/" + event.item.budgetVersionName + "/" + event.item.value;
        this.step2RegionCategoryCode = event.item.regionCategoryCode;
        this.step2Params = {
            "projectCode": event.item.adProjectCode,
            "adProjectCode": event.item.adProjectCode,
            "regionCode": event.item.value,
            "budgetVersionName": event.item.budgetVersionName,
            "page": {
                "page": 1,
                "rows": 10
            }
        }
        this.service.post("/bpd-proj/bpd/mouldBudgetDetail/getList",this.step2Params)
        .subscribe(data1 => {
            this.step2FlaggridStoreLen = data1.total;
            let data = data1.rows;
            this.step2MainStore = [];
            for(let i = 0; i < data.length; i++) {
                data[i].id = i + 1;
                data[i].itemNameBrief = (data[i].itemName && data[i].itemName.length>30)  ? data[i].itemName.substr(0,27)+"..." : data[i].itemName;
                data[i].budgetCommentBrief = (data[i].budgetComment && data[i].budgetComment.length>30)  ? data[i].budgetComment.substr(0,27)+"..." : data[i].budgetComment;
                data[i].auditCommentBrief = (data[i].auditComment && data[i].auditComment.length>30)  ? data[i].auditComment.substr(0,27)+"..." : data[i].auditComment;
                this.step2MainStore.push(data[i])
            }
            if(data.length < 10) {
                for(let i=0; i<10-data.length; i++) {
                    this.step2MainStore.push({
                        "ip": i
                    })
                }
            }
            if(data.length) {
                this.step2SelectedStore = this.step2MainStore[0];
                if(this.selectedStore.projectType == '110') {
                    this.plantCode = this.step2MainStore[0].plantCode;
                }
                this.service.post("/bpd-proj/bpd/investmentIndex/getIndexList",{
                    "projectType" : this.selectedStore.projectType,
                    "regionCategoryCode" : this.step2SelectedStore.regionCategoryCode,
                    "projectCode" : this.step2SelectedStore.adProjectCode,
                    "budgetVersionName" : this.step2SelectedStore.budgetVersionName,
                    "regionCode" : this.step2SelectedStore.regionCode
                })
                .subscribe(data => {
                    this.assumeStore = [];
                    for(let i = 0; i < data.length; i++) {
                        data[i].id = i + 1;
                        this.assumeStore.push(data[i])
                    }
                })
                this.logSearch();
                this.service.post("/bpd-proj/bpd/budgetTemplate/getDefineFieldName",{
                    "regionCategoryCode": this.step2RegionCategoryCode
                })
                .subscribe(data => {
                    if(data.length) {
                        this.undefinedField1 = data[0];
                        this.undefinedField2 = data[1];
                        this.undefinedField3 = data[2];
                        this.undefinedField4 = data[3];
                        this.undefinedField5 = data[4]; 
                    } else {
                        this.undefinedField1 = 'Part Import';
                        this.undefinedField2 = 'Part Local';
                        this.undefinedField3 = 'Die Set Import';
                        this.undefinedField4 = 'Die Set Local';
                        this.undefinedField5 = 'New/Modification';
                    }
                })
            } else {
                this.step2SelectedStore = [];
                this.assumeStore = [];
                this.AuditLogStore = [];
                this.commitDisplay = false;
            }
        })

        this.service.post("/bpd-proj/bpd/mouldBudgetDetail/getList",{
           "projectCode": event.item.adProjectCode,
            "adProjectCode": event.item.adProjectCode,
            "regionCode": event.item.value,
            "budgetVersionName": event.item.budgetVersionName,
            "regionCategoryCode": event.item.regionCategoryCode,
            "page": {
                "page": 1,
                "rows": 100000
            } 
        })
        .subscribe(data1 => {
            let data = data1.rows;
            let _number: number = 0;
            for(let i = 0; i < data.length; i++) {
                if(data[i].sgm) {
                    _number += data[i].sgm
                }
            }
            this.ammountFlagTotal = "SGM E2UL CNY " + " (¥" + this.transform(_number) + ")";
        })
    }

    public step2Flagpaginate(e) {  // 第二页供应商模具分页
        this.step2Params.page =  {
            "page": e.page + 1,
            "rows": e.rows
        };
        this.service.post("/bpd-proj/bpd/mouldBudgetDetail/getList",this.step2Params)
        .subscribe(data1 => {
            this.step2FlaggridStoreRows = e.rows;
            this.step2FlaggridStoreFirst = Number(e.first);
            this.step2FlaggridStoreLen = data1.total;
            this.step2FlaggridStorePage = e.page;
            let data = data1.rows;
            this.step2MainStore = [];
            for(let i = 0; i < data.length; i++) {
                data[i].id = i + 1;
                data[i].itemNameBrief = (data[i].itemName && data[i].itemName.length>30)  ? data[i].itemName.substr(0,27)+"..." : data[i].itemName;
                data[i].budgetCommentBrief = (data[i].budgetComment && data[i].budgetComment.length>30)  ? data[i].budgetComment.substr(0,27)+"..." : data[i].budgetComment;
                data[i].auditCommentBrief = (data[i].auditComment && data[i].auditComment.length>30)  ? data[i].auditComment.substr(0,27)+"..." : data[i].auditComment;
                this.step2MainStore.push(data[i])
            }
            if(data.length < 10) {
                for(let i=0; i<10-data.length; i++) {
                    this.step2MainStore.push({
                        "ip": i
                    })
                }
            }
        })

        this.step2Params.page =  {
            "page": 1,
            "rows": 100000
        };
        this.service.post("/bpd-proj/bpd/mouldBudgetDetail/getList",this.step2Params)
        .subscribe(data1 => {
            let data = data1.rows;
            let _number: number = 0;
            for(let i = 0; i < data.length; i++) {
                if(data[i].sgm) {
                    _number += data[i].sgm
                }
            }
            this.ammountFlagTotal = "SGM E2UL CNY " + " (¥" + this.transform(_number) + ")";
        })
    }

    public step2gridStoreRows: any = '10';
    public step2gridStoreFirst: any = 0;
    public step2gridStoreLen: number = 0;
    public step2gridStorePage: any = 0;
    public getStep2MainStore(event) {
        //文件上传
        this.adProjectBusinessId = event.item.adProjectCode + "/" + event.item.budgetVersionName + "/" + event.item.value;
        this.step2RegionCategoryCode = event.item.regionCategoryCode;
        this.step2Params = {
            "adProjectCode": event.item.adProjectCode,
            "projectCode": event.item.adProjectCode,
            "regionCode": event.item.value,
            "budgetVersionName": event.item.budgetVersionName,
            "regionCategoryCode": event.item.regionCategoryCode,
            "oldBudgetVersionName": this.oldBudgetVersionName,
            "page": {
                "page": 1,
                "rows": 10
            }
        }
        this.service.post("/bpd-proj/bpd/projectBudgetDetail/getVProjectBudgetDetailList",this.step2Params)
        .subscribe(data1 => {
            this.step2gridStoreLen = data1.total;
            let data = data1.rows;
            this.step2MainStore = [];
            for(let i = 0; i < data.length; i++) {
                data[i].id = i + 1;
                data[i].itemNameBrief = (data[i].itemName && data[i].itemName.length>30)  ? data[i].itemName.substr(0,27)+"..." : data[i].itemName;
                data[i].budgetCommentBrief = (data[i].budgetComment && data[i].budgetComment.length>30)  ? data[i].budgetComment.substr(0,27)+"..." : data[i].budgetComment;
                data[i].auditCommentBrief = (data[i].auditComment && data[i].auditComment.length>30)  ? data[i].auditComment.substr(0,27)+"..." : data[i].auditComment;
                this.step2MainStore.push(data[i])
            }
            if(data.length < 10) {
                for(let i=0; i<10-data.length; i++) {
                    this.step2MainStore.push({
                        "ip": i
                    })
                }
            }
            if(data.length) {
                this.step2SelectedStore = this.step2MainStore[0];
                if(this.selectedStore.projectType == '110') {
                    this.plantCode = this.step2MainStore[0].plantCode;
                }
                this.service.post("/bpd-proj/bpd/investmentIndex/getIndexList",{
                    "projectType" : this.selectedStore.projectType,
                    "regionCategoryCode" : this.step2SelectedStore.regionCategoryCode,
                    "projectCode" : this.step2SelectedStore.adProjectCode,
                    "budgetVersionName" : this.step2SelectedStore.budgetVersionName,
                    "regionCode" : this.step2SelectedStore.regionCode
                })
                .subscribe(data => {
                    this.assumeStore = [];
                    for(let i = 0; i < data.length; i++) {
                        data[i].id = i + 1;
                        this.assumeStore.push(data[i])
                    }
                })
                this.logSearch();
                this.service.post("/bpd-proj/bpd/budgetTemplate/getDefineFieldName",{
                    "regionCategoryCode": this.step2RegionCategoryCode
                })
                .subscribe(data => {
                    if(data.length) {
                        this.undefinedField1 = data[0];
                        this.undefinedField2 = data[1];
                        this.undefinedField3 = data[2];
                        this.undefinedField4 = data[3];
                        this.undefinedField5 = data[4]; 
                    } else {
                        this.undefinedField1 = 'Part Import';
                        this.undefinedField2 = 'Part Local';
                        this.undefinedField3 = 'Die Set Import';
                        this.undefinedField4 = 'Die Set Local';
                        this.undefinedField5 = 'New/Modification';
                    }
                })
            } else {
                this.step2SelectedStore = [];
                this.assumeStore = [];
                this.AuditLogStore = [];
                this.commitDisplay = false;
            }
            this.oldBudgetVersionName = null;
        })

        this.service.post("/bpd-proj/bpd/projectBudgetDetail/getVProjectBudgetDetailList",{
            "projectCode": event.item.adProjectCode,
            "adProjectCode": event.item.adProjectCode,
            "regionCode": event.item.value,
            "budgetVersionName": event.item.budgetVersionName,
            "regionCategoryCode": event.item.regionCategoryCode,
            "page": {
                "page": 1,
                "rows": 1000000
            }
        })
        .subscribe(data1 => {
            let data = data1.rows;
            let _number: number = 0;
            for(let i = 0; i < data.length; i++) {
                if(data[i].planBudgetRmb) {
                    _number += data[i].planBudgetRmb
                }
            }
            this.AmountTotal = "Amount(CNY) " + " (¥" + this.transform(_number) + ")";
        })
    }

    public step2paginate(e) {  // 第二页分页
        this.step2Params.page =  {
            "page": e.page + 1,
            "rows": e.rows
        };
        this.service.post("/bpd-proj/bpd/projectBudgetDetail/getVProjectBudgetDetailList",this.step2Params)
        .subscribe(data1 => {
            this.step2gridStoreRows = e.rows;
            this.step2gridStoreFirst = Number(e.first);
            this.step2gridStoreLen = data1.total;
            this.step2gridStorePage = e.page;
            let data = data1.rows;
            this.step2MainStore = [];
            for(let i = 0; i < data.length; i++) {
                data[i].id = i + 1;
                data[i].itemNameBrief = (data[i].itemName && data[i].itemName.length>30)  ? data[i].itemName.substr(0,27)+"..." : data[i].itemName;
                data[i].budgetCommentBrief = (data[i].budgetComment && data[i].budgetComment.length>30)  ? data[i].budgetComment.substr(0,27)+"..." : data[i].budgetComment;
                data[i].auditCommentBrief = (data[i].auditComment && data[i].auditComment.length>30)  ? data[i].auditComment.substr(0,27)+"..." : data[i].auditComment;
                this.step2MainStore.push(data[i])
            }
            if(data.length < 10) {
                for(let i=0; i<10-data.length; i++) {
                    this.step2MainStore.push({
                        "ip": i
                    })
                }
            }
        })

        this.step2Params.page =  {
            "page": 1,
            "rows": 100000
        };
        this.service.post("/bpd-proj/bpd/projectBudgetDetail/getVProjectBudgetDetailList",this.step2Params)
        .subscribe(data1 => {
            let data = data1.rows;
            let _number: number = 0;
            for(let i = 0; i < data.length; i++) {
                if(data[i].planBudgetRmb) {
                    _number += data[i].planBudgetRmb
                }
            }
            this.AmountTotal = "Amount(CNY) " + " (¥" + this.transform(_number) + ")";
        })
    }

    public AmountTotal: string = "Amount(CNY)";

    public ammountFlagTotal: string = "SGM E2UL CNY";

    public transform(num:any): string {
        if(num) {
            var num = (num || 0).toString(), result = '';
            if(num.indexOf(".") == -1) {
               while (num.length > 3) {
                    result = ',' + num.slice(-3) + result;
                    num = num.slice(0, num.length - 3);
               }
               if (num) { result = num + result; }
               result = result + ".00";
               return result; 
            } else {
               let minNum = num.split(".")[0].toString();
               let litNum = num.split(".")[1].toString();
               while (minNum.length > 3) {
                    result = ',' + minNum.slice(-3) + result;
                    minNum = minNum.slice(0, minNum.length - 3);
               }
               if (minNum) { result = minNum + result; }
               if(litNum.length >= 2) {
                   litNum = litNum.slice(0,2);
               } else {
                   litNum = litNum + "0";
               }
               result = result+"."+litNum;
               return result;
            }
        } else {
            return num;
        }
      }

    public S2EnterSearch($event) {
        if ($event.key === "Enter") {
            this.lookupSaveBtn();
        }
    }

    public logWbsCodeSearch: string = "";
    public logItemNameSearch: string = "";
    public logSearch() {
        this.AuditLogStore = [];
        if(this.step2SelectedStore.budgetItem) {
            this.service.post("/bpd-proj/bpd/reviewLog/getVList",{
                "adProjectCode" : this.step2SelectedStore.adProjectCode,
                "budgetVersionName" : this.step2SelectedStore.budgetVersionName,
                "regionCode" : this.step2SelectedStore.regionCode,
                "wbsCode": this.logWbsCodeSearch,
                "itemName": this.logItemNameSearch
            })
            .subscribe(data => {
                for(let i = 0; i < data.length; i++) {
                    data[i].id = i + 1;
                    this.AuditLogStore.push(data[i])
                }
            })
        } else {
            this.msgservice.showInfo("No Budget Detail");
            this.msgs = this.msgservice.msgs;
        }
    }

    public logEnterSearch(e) {
        if (e.key === "Enter") {
            this.logSearch();
        }
    }

    public budgetLogWbsCodeSearch: string = "";
    public budgetLogItemNameSearch: string = "";
    public budgetLogSearch() {
        this.AuditLogStore = [];
        if(this.step2SelectedStore.budgetItem) {
            let e = {
                page: 0, 
                first: 0, 
                rows: "10",
                pageCount: 1
            }
            this.budgetLogPaginate(e);
        } else {
            this.growLife = 999999;
            this.msgservice.showInfo("No Budget Detail");
            this.msgs = this.msgservice.msgs;
        }
    }

    public budgetLogEnterSearch(e) {
        if (e.key === "Enter") {
            this.budgetLogSearch();
        }
    }

    public lookupSaveBtn() {  // 模糊查询确认
        let investmentPropertyName: any = "";
        if (this.budgetItemSerchStore.length  !=  0) {
            for (let i = 0; i < this.budgetItemSerchStore.length; i++) {
                if  (this.budgetItemSerch === this.budgetItemSerchStore[i].value) {
                    investmentPropertyName = this.budgetItemSerchStore[i].label;
                    if (investmentPropertyName === "All") {
                        investmentPropertyName = null;
                    }
                }
            }
        }
        if(this.isFlag) {
            let e = {page: 0, first: 0, rows: "10"};
            this.step2Params.page =  {
                "page": e.page + 1,
                "rows": e.rows
            };
            this.step2Params.wbsCode = this.WBEItemNameSerch.indexOf("-") != -1 ? this.WBEItemNameSerch.split("-").join("") : this.WBEItemNameSerch;
            this.step2Params.partDescription = this.ItemNameSerch;
            this.step2Params.sgm = this.AmountSerch;
            this.step2Params.investmentPropertyName = investmentPropertyName;
            this.step2Flagpaginate(e);
        } else {
            this.service.post("/bpd-proj/bpd/projectBudgetDetail/getVProjectBudgetDetailList",{
                "wbsCode": this.WBEItemNameSerch.indexOf("-") != -1 ? this.WBEItemNameSerch.split("-").join("") : this.WBEItemNameSerch,
                "itemName": this.ItemNameSerch,
                "planBudgetRmb": this.AmountSerch,
                "investmentPropertyName": investmentPropertyName,
                "adProjectCode": this.step2Params.adProjectCode,
                "regionCode":this.step2Params.regionCode,
                "budgetVersionName":this.step2Params.budgetVersionName,
                "regionCategoryCode":this.step2Params.regionCategoryCode,
                "page": {
                    "page": 1,
                    "rows": 10
                }

            })
            .subscribe(data1 => {
                this.step2gridStoreLen = data1.total;
                let data = data1.rows;
                this.step2MainStore = [];
                for(let i = 0; i < data.length; i++) {
                    data[i].id = i + 1;
                    data[i].itemNameBrief = (data[i].itemName && data[i].itemName.length>30)  ? data[i].itemName.substr(0,27)+"..." : data[i].itemName;
                    data[i].budgetCommentBrief = (data[i].budgetComment && data[i].budgetComment.length>30)  ? data[i].budgetComment.substr(0,27)+"..." : data[i].budgetComment;
                    data[i].auditCommentBrief = (data[i].auditComment && data[i].auditComment.length>30)  ? data[i].auditComment.substr(0,27)+"..." : data[i].auditComment;
                    this.step2MainStore.push(data[i])
                }
                if(data.length < 10) {
                    for(let i=0; i<10-data.length; i++) {
                        this.step2MainStore.push({
                            "ip": i
                        })
                    }
                }
            })

            this.service.post("/bpd-proj/bpd/projectBudgetDetail/getVProjectBudgetDetailList",{
                "wbsCode": this.WBEItemNameSerch.indexOf("-") != -1 ? this.WBEItemNameSerch.split("-").join("") : this.WBEItemNameSerch,
                "itemName": this.ItemNameSerch,
                "planBudgetRmb": this.AmountSerch,
                "investmentPropertyName": investmentPropertyName,
                "adProjectCode": this.step2Params.adProjectCode,
                "regionCode":this.step2Params.regionCode,
                "budgetVersionName":this.step2Params.budgetVersionName,
                "regionCategoryCode":this.step2Params.regionCategoryCode,
                "page": {
                    "page": 1,
                    "rows": 100000
                }
            })
            .subscribe(data1 => {
                let data = data1.rows;
                let _number: number = 0;
                for(let i = 0; i < data.length; i++) {
                    if(data[i].planBudgetRmb) {
                        _number += data[i].planBudgetRmb
                    }
                }
                this.AmountTotal = "Amount(CNY) " + " (¥" + this.transform(_number) + ")";
            })
        }
    }

    public step2Reload() {
        this.service.get('/bpd-proj/bpd/investmentProperty/getPropertyCombobox?'+Number(new Date()))
        .subscribe(data => {
            data.unshift({
                label: "All",
                value: null
            })
            this.budgetItemSerchStore = data;
            this.budgetItemSerch = data[0].value;
            this.WBEItemNameSerch = null;
            this.ItemNameSerch = null;
            this.AmountSerch = null;
        })
        if(this.selectedStore.projectType == '300' || this.selectedStore.projectType == '110') {
            this.plantCode = this.selectedStore.plantCode;
        } else {
            this.plantCode = this.selectedStore.plantName;
        }
        this.plant = this.selectedStore.plantName;
        let item = this.step1sonGrid;
        this.treeTitle = this.selectedStore.projectName;
        this.service.post("/bpd-proj/bpd/projectBudget/getTreeList",{
            "projectCode": item.projectCode,
            "budgetVersionName": item.budgetVersionName,
            "userCode": this.selectedStore.projectManager == window.localStorage.getItem('user') ? null : window.localStorage.getItem('user'),
            "status": this.isJump ? this.selectedStore.status : null
        })
        .subscribe(data => {
            this.step2MainStore = [];
            this.assumeStore = [];
            this.plantStore = [];
            let item1 = [];
            let item1Children = [];
            if(data[0].data.length) {
                for(let j=0; j<data[0].data.length; j++) {
                    for(let i=0; i<data[0].data[j].children.length; i++) {
                        item1Children.push({
                            label: data[0].data[j].children[i].data.regionName,
                            value: data[0].data[j].children[i].data.regionCode,
                            budgetVersionName: data[0].data[j].data.budgetVersionName,
                            regionCategoryName: data[0].data[j].data.regionCategoryName,
                            regionCategoryCode: data[0].data[j].data.regionCategoryCode,
                            adProjectCode: data[0].data[j].data.projectCode,
                            catFlag: data[0].data[j].data.catFlag,
                            colorFlag: data[0].data[j].children[i].data.colorFlag,
                            commitDisplay: false,
                            status: 1,
                            command: (event) => {
                                this.selextedTree = event;
                                this.getStep2MainStore(event);
                                this.commitDisplay = false;
                            }
                        })
                    }
                    item1.push({
                        label: data[0].data[j].data.regionCategoryName,
                        icon: 'fa-calendar',
                        children: item1Children,
                        expanded: false
                    })
                    item1Children = [];
                }
            }
            let item2 = [];
            let item2Children = [];
            if(data[1].data.length) {
                for(let j=0; j<data[1].data.length; j++) {
                    for(let i=0; i<data[1].data[j].children.length; i++) {
                        item2Children.push({
                            label: data[1].data[j].children[i].data.regionName,
                            value: data[1].data[j].children[i].data.regionCode,
                            budgetVersionName: data[1].data[j].data.budgetVersionName,
                            regionCategoryName: data[1].data[j].data.regionCategoryName,
                            regionCategoryCode: data[1].data[j].data.regionCategoryCode,
                            adProjectCode: data[1].data[j].data.projectCode,
                            catFlag: data[1].data[j].data.catFlag,
                            colorFlag: data[1].data[j].children[i].data.colorFlag,
                            commitDisplay: true,
                            status: 2,
                            command: (event) => {
                               this.selextedTree = event;
                               this.getStep2MainStore(event);
                               this.commitDisplay = true;
                            }
                        })
                    }
                    item2.push({
                        label: data[1].data[j].data.regionCategoryName,
                        icon: 'fa-check-square-o',
                        children: item2Children,
                        expanded: false
                    })
                    item2Children = [];
                }
            }
            let item3 = [];
            let item3Children = [];
            if(data[2].data.length) {
                for(let j=0; j<data[2].data.length; j++) {
                    for(let i=0; i<data[2].data[j].children.length; i++) {
                        item3Children.push({
                            label: data[2].data[j].children[i].data.regionName,
                            value: data[2].data[j].children[i].data.regionCode,
                            budgetVersionName: data[2].data[j].data.budgetVersionName,
                            regionCategoryName: data[2].data[j].data.regionCategoryName,
                            regionCategoryCode: data[2].data[j].data.regionCategoryCode,
                            adProjectCode: data[2].data[j].data.projectCode,
                            catFlag: data[2].data[j].data.catFlag,
                            colorFlag: data[2].data[j].children[i].data.colorFlag,
                            commitDisplay: false,
                            status: 3,
                            command: (event) => {
                                this.selextedTree = event;
                                this.getStep2MainStore(event);
                                this.commitDisplay = false;
                            }
                        })
                    }
                    item3.push({
                        label: data[2].data[j].data.regionCategoryName,
                        icon: 'fa-exclamation-circle',
                        children: item3Children,
                        expanded: false
                    })
                    item3Children = [];
                }
            }
            let item4 = [];
            let item4Children = [];
            if(data[3].data.length) {
                for(let j=0; j<data[3].data.length; j++) {
                    for(let i=0; i<data[3].data[j].children.length; i++) {
                        item4Children.push({
                            label: data[3].data[j].children[i].data.regionName,
                            value: data[3].data[j].children[i].data.regionCode,
                            budgetVersionName: data[3].data[j].data.budgetVersionName,
                            regionCategoryName: data[3].data[j].data.regionCategoryName,
                            regionCategoryCode: data[3].data[j].data.regionCategoryCode,
                            adProjectCode: data[3].data[j].data.projectCode,
                            catFlag: data[3].data[j].data.catFlag,
                            colorFlag: data[3].data[j].children[i].data.colorFlag,
                            commitDisplay: false,
                            status: 4,
                            command: (event) => {
                                this.selextedTree = event;
                                this.getStep2MainStore(event);
                                this.commitDisplay = false;
                            }
                        })
                    }
                    item4.push({
                        label: data[3].data[j].data.regionCategoryName,
                        icon: 'fa-check-square-o green',
                        children: item4Children,
                        expanded: false
                    })
                    item4Children = [];
                }
            }
            for(let i=0; i<4; i++) {
                if(data[i].data.length) {
                    if(i==0) {
                       this.selectedFile = item1[0].children[0];
                       this.commitDisplay = false;
                       this.importDisplay = true;
                       this.status4 = false;
                       break; 
                    } else if(i==1) {
                       this.selectedFile = item2[0].children[0];
                       this.commitDisplay = true;
                       this.importDisplay = true;
                       this.status4 = false;
                       break; 
                    } else if(i==2) {
                       this.selectedFile = item3[0].children[0];
                       this.commitDisplay = false;
                       this.importDisplay = true;
                       this.status4 = false;
                       break;
                    } else if(i==3) {
                       this.selectedFile = item4[0].children[0];
                       this.commitDisplay = false; 
                       this.importDisplay = false;
                       this.status4 = false;
                       break;
                    }
                }
            }
            let event: any = {};
            event.item = this.selectedFile;
            // let e: any = {
            //     node: this.selectedFile 
            // }
            // this.selsctTreeEvent = e;
            if(this.selectedFile.catFlag == '1') {
                this.isFlag = true;
                this.selextedTree = event;
                this.getStep2FlagMainStore(event);
            } else {
                this.isFlag = false;
                this.selextedTree = event;
                this.getStep2MainStore(event);
            }
            this.items = [
                {
                    label: 'Wating For Budget (' + item.budgetAmount + ')',
                    icon: 'fa-calendar',
                    children: item1,
                    expanded: true
                },
                {
                    label: 'Waiting For Approving (' + item.approvingAmount + ')',
                    icon: 'fa-check-square-o',
                    children: item2,
                    expanded: true
                },
                {
                    label: 'BPD Return (' + item.disapprovedAmount + ')',
                    icon: 'fa-exclamation-circle',
                    children: item3,
                    expanded: true
                },
                {
                    label: 'BPD Approved (' + item.approvedAmount + ')',
                    icon: 'fa-check-square-o green',
                    children: item4,
                    expanded: true
                }
            ];

        })
    }

    public publish(status) {
        let params = [];
        for(let i=0; i<this.step2MainStore.length; i++) {
            if(this.step2MainStore[i].id) {
                if(!this.step2MainStore[i].wbsCode) {
                    this.msgservice.showInfo("Please Fill in wbsCode!");
                    this.msgs = this.msgservice.msgs;
                    return; 
                }
                this.step2MainStore[i].status = 4;
                this.step2MainStore[i].wbsLevel6 = this.step2MainStore[i].investmentPropertyCode;
                this.step2MainStore[i].suggestion = this.step2MainStore[i].budgetComment;
                // this.step2MainStore[i].wbsCode = this.step2MainStore[i].wbsCode.split(".").join("");
                if(this.step2MainStore[i].wbsCode) {
                    this.step2MainStore[i].wbsCode = this.step2MainStore[i].wbsCode.split("-")[0] + this.step2MainStore[i].wbsCode.split("-")[1]
                }
                params.push(this.step2MainStore[i]);
            }
        }
        let publishUrl: string = null;
        if(status) {
            publishUrl = "/bpd-proj/bpd/projectBudget/update";
        } else {
            publishUrl = "/bpd-proj/bpd/mouldBudgetDetail/updateDetail";
        }
        this.service.post(publishUrl,params)
        .subscribe(data => {
            if(data['code'] == 1) {
                this.msgservice.showSuccess("Success");
                this.msgs = this.msgservice.msgs;
                for(let i=0; i<data.length; i++) {
                    if(data[i].budgetVersionName == this.step1sonGrid.budgetVersionName) {
                        this.step1sonGrid = data[i]
                    }
                }
                let params2 = [];
                if(status) {
                    for(let i=0; i<this.step2MainStore.length; i++) {
                        if(this.step2MainStore[i].id) {
                            params2.push({
                                "projectId" : this.step2MainStore[i].projectCode,
                                "budgetVersionName" : this.step2MainStore[i].budgetVersionName,
                                "planBudget" : this.step2MainStore[i].planBudgetRmb,
                                "projectCode" : this.selectedStore.projectCode,
                                "plantCode" : this.plantCode,
                                "regionCode" : this.step2MainStore[i].regionCode.substr(-2),
                                "wbsCode" : this.step2MainStore[i].wbsCode.split(".").join(""),
                                "wbsLevel6" : this.step2MainStore[i].wbsLevel6,
                                "wbsLevel7" : this.step2MainStore[i].wbsLevel7,
                                "investmentPropertyCode" : this.step2MainStore[i].investmentProperty,
                                "wbsDescription": this.step2MainStore[i].itemName
                            })
                        }
                    }
                } else {
                    for(let i=0; i<this.step2MainStore.length; i++) {
                        if(this.step2MainStore[i].id) {
                            params2.push({
                                "projectId" : this.step2MainStore[i].projectCode,
                                "budgetVersionName" : this.step2MainStore[i].budgetVersionName,
                                "planBudget" : this.step2MainStore[i].sgm,
                                "projectCode" : this.selectedStore.projectCode,
                                "plantCode" : this.plantCode,
                                "regionCode" : this.step2MainStore[i].regionCode.substr(-2),
                                "wbsCode" : this.step2MainStore[i].wbsCode.split(".").join(""),
                                "wbsLevel6" : this.step2MainStore[i].wbsLevel6,
                                "wbsLevel7" : this.step2MainStore[i].wbsLevel7,
                                "investmentPropertyCode" : this.step2MainStore[i].investmentProperty,
                                "wbsDescription": this.step2MainStore[i].partDescription
                            })
                        }
                    }
                }
                
                this.service.post("/bpd-proj/bpd/projectCostBook/insert",params2)
                .subscribe(data => {
                    if(data['code'] == 1) {
                        this.msgservice.showSuccess("Success");
                        this.msgs = this.msgservice.msgs;
                    } else if(data['code'] == 2){
                        this.msgservice.showInfo("CostBook Exists!");
                        this.msgs = this.msgservice.msgs;
                    } else {
                        this.msgservice.showError("Operation Error!");
                        this.msgs = this.msgservice.msgs;
                    }
                })
                this.step2Reload();
            } else if(data['code'] == 2){
                this.msgservice.showInfo("ReviewLog Exists!");
                this.msgs = this.msgservice.msgs;
            } else if(data['code'] == 3){
                let events = {page: 0, first: 0, rows: "10"};
                this.step2paginate(events)
                this.msgservice.showInfo("Please Fill in wbsCode!");
                this.msgs = this.msgservice.msgs;
            } else if(data['code'] == 4){
                let events = {page: 0, first: 0, rows: "10"};
                this.step2paginate(events)
                this.msgservice.showInfo("Please Set RMB!");
                this.msgs = this.msgservice.msgs;
            } else {
                this.msgservice.showError("Operation Error!");
                this.msgs = this.msgservice.msgs;
            }
        })
    }

    public return(status) {
        let params = [];
        for(let i=0; i<this.step2MainStore.length; i++) {
            if(this.step2MainStore[i].id) {
                this.step2MainStore[i].status = 3;
                this.step2MainStore[i].wbsLevel6 = this.step2MainStore[i].investmentPropertyCode;
                // this.step2MainStore[i].wbsCode = this.step2MainStore[i].wbsCode.split(".").join("");
                if(this.step2MainStore[i].wbsCode) {
                    this.step2MainStore[i].wbsCode = this.step2MainStore[i].wbsCode.split("-")[0] + this.step2MainStore[i].wbsCode.split("-")[1]
                }
                params.push(this.step2MainStore[i]);
            }
        }
        let publishUrl: string = null;
        if(status) {
            publishUrl = "/bpd-proj/bpd/projectBudget/update";
        } else {
            publishUrl = "/bpd-proj/bpd/mouldBudgetDetail/updateDetail";
        }
        this.service.post(publishUrl,params)
        .subscribe(data => {
            if(data['code'] == 1) {
                this.msgservice.showSuccess("Success");
                this.msgs = this.msgservice.msgs; 
                this.service.post("/bpd-proj/bpd/projectBudget/getMap",{
                    "projectCode" : this.selectedStore.adProjectCode,
                    "userCode": window.localStorage.getItem('user'),
                    "projectType": this.selectedStore.projectType
                })
                .subscribe(data => {
                    for(let i=0; i<data.length; i++) {
                        if(data[i].budgetVersionName == this.step1sonGrid.budgetVersionName) {
                            this.step1sonGrid = data[i]
                        }
                    } 
                    this.step2Reload();
                })
            } else if(data['code'] == 2){
                this.msgservice.showInfo("CostBook Exists!");
                this.msgs = this.msgservice.msgs;
            } else {
                this.msgservice.showError("Operation Error!");
                this.msgs = this.msgservice.msgs;
            }
        })
    }

    public tabIndex: number = 0;
    public handleChange(e) {   // tab切换
        if(e.index == 0) {
            this.tabIndex = 0;
            if(this.step2SelectedStore.budgetItem) {
                this.service.post("/bpd-proj/bpd/investmentIndex/getIndexList",{
                    "projectType" : this.selectedStore.projectType,
                    "regionCategoryCode" : this.step2SelectedStore.regionCategoryCode,
                    "projectCode" : this.step2SelectedStore.adProjectCode,
                    "budgetVersionName" : this.step2SelectedStore.budgetVersionName,
                    "regionCode" : this.step2SelectedStore.regionCode
                })
                .subscribe(data => {
                    this.assumeStore = [];
                    for(let i = 0; i < data.length; i++) {
                        data[i].id = i + 1;
                        this.assumeStore.push(data[i])
                    }
                })
            }
        } else if(e.index == 1) {
            this.tabIndex = 1;
            this.costBookRegionName = this.selextedTree.item.label;
            this.costBookRegionCode = this.isFlag ? this.selextedTree.item.value.substr(2,this.selextedTree.item.value.length) : this.selextedTree.item.value;
            this.service.post("/bpd-proj/bpd/plant/getList",{
                flag: '1'
            })
            .subscribe(data => {
               // this.plantStore = data;
               let arr = [];
               if(this.selectedStore.projectType == '300') {
                   for(let i=0; i<data.length; i++) {
                       arr.push({
                           label: data[i].company,
                           value: data[i].company
                       })
                   }
                    this.plantStore = arr;
                } else {
                    for(let i=0; i<data.length; i++) {
                       arr.push({
                           label: data[i].plantDescription,
                           value: data[i].plantDescription
                       })
                   }
                    this.plantStore = arr;
                }
                if(this.selectedStore.projectType == "110") {
                   this.plantCode = this.step2SelectedStore.plantCode;
                   this.plant = this.step2SelectedStore.plant;
                } else if (this.selectedStore.projectType == "300"){
                   this.plantCode = this.selectedStore.plantCode;
                   this.plant = this.selectedStore.plantName;
                } else {
                   this.plant = this.selectedStore.plantCode;
                   this.plantCode = this.selectedStore.plantName;
                }

                // if(!this.plantCode && !this.selectedStore.plantCode) {
                //     this.plant = this.plantStore[0].value;
                //     this.plantCode = this.plantStore[0].value;
                //     return;
                // }
                // if(!this.plantCode && this.selectedStore.plantCode) {
                //     this.plant = this.selectedStore.plantCode;
                //     this.plantCode = this.selectedStore.plantCode;
                //     return;
                // }
                // if(this.plantCode != this.selectedStore.plantCode) {
                //     return;
                // } 
            })
        } else if(e.index == 2) {
            this.tabIndex = 2;
            this.logSearch();
        } else if(e.index == 3) {
            this.tabIndex = 3;
            this.adProjectBusinessId = this.step2Params.adProjectCode + "/" + this.step2Params.budgetVersionName + "/" + this.step2Params.regionCode;
            this.service.post('/bpd-proj/bpd/att/getVList', {
                bussinessId: this.adProjectBusinessId
            })
            .subscribe(data => {
                this.budgetFileUpLoadList = data;
            })
        } else {
            this.tabIndex = 4;
            let e = {
                page: 0, 
                first: 0, 
                rows: "10",
                pageCount: 1
            }
            this.budgetLogPaginate(e);
        }
    }

    public plantChange(e) {
        // this.plantCode = e.value;
        this.service.get("/bpd-proj/bpd/plant/getByDescripition?plantDescription="+e.value)
        .subscribe(data => {
            this.plantCode = data.plantCode;
        })
    }

    public assumeEditBtn(item) {  // 假设编辑
        this.parameterDisplay = true;
        this.parameterValue = item.parameterValue;
        this.assumeParams = {
            "projectCode" : this.step2SelectedStore.adProjectCode,
            "budgetVersionName" : this.step2SelectedStore.budgetVersionName,
            "regionCode" : this.step2SelectedStore.regionCode,
            "investAssumeIndexId" : item.investAssumeIndexId,
            "budgetIndexId" : item.budgetIndexId
        }
    }

    public AuditLogDelBtn(item) {  // Audit log 删除
        this.confirmationService.confirm({
          message: 'Do You Want To Delete This Record?',
          header: 'Delete Confirmation',
          icon: 'fa fa-trash',
          accept: () => {
            this.service.get("/bpd-proj/bpd/reviewLog/delete?logId=" + item.logId+"&"+Number(new Date()))
            .subscribe(data => {
                if(data['code'] == 1) {
                    this.msgservice.showSuccess("Success");
                    this.msgs = this.msgservice.msgs;
                    this.logSearch();
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

    public parameterSaveBtn() {
        this.assumeParams.parameterValue = this.parameterValue;
        this.service.post("/bpd-proj/bpd/investmentIndex/update",this.assumeParams)
        .subscribe(data => {
            if(data['code'] == 1) {
                this.msgservice.showSuccess("Success");
                this.msgs = this.msgservice.msgs;
                this.parameterDisplay = false;
                this.service.post("/bpd-proj/bpd/investmentIndex/getIndexList",{
                    "projectType" : this.selectedStore.projectType,
                    "regionCategoryCode" : this.step2SelectedStore.regionCategoryCode,
                    "projectCode" : this.step2SelectedStore.adProjectCode,
                    "budgetVersionName" : this.step2SelectedStore.budgetVersionName,
                    "regionCode" : this.step2SelectedStore.regionCode
                })
                .subscribe(data => {
                    this.assumeStore = [];
                    for(let i = 0; i < data.length; i++) {
                        data[i].id = i + 1;
                        this.assumeStore.push(data[i])
                    }
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

    public parameterCancelBtn() {
        this.parameterDisplay = false;
    }

    public categoryNameSearch: string = "";
    public addMission() {
        this.selectCategoryDisplay = true;
        this.categoryNameSearch = "";
        if(!this.selectCategoryStore.length) {
           this.service.post("/bpd-proj/bpd/regionCategory/getRegionCateByRegion",{})
            .subscribe(data => {
                this.selectCategoryStore = [];
                for(let i=0; i<data.length; i++) {
                    this.selectCategoryStore.push({
                        categoryName: data[i].label,
                        categoryCode: data[i].value
                    })
                }
            }) 
        }
    }

    public categoryNameEnterSearch(e) {
        if (e.key === "Enter") {
            this.categoryNameSearchBtn();
        }
    }

    public categoryNameSearchBtn() {
        this.service.post("/bpd-proj/bpd/regionCategory/getRegionCateByRegion",{
           regionCategoryName: this.categoryNameSearch
        })
        .subscribe(data => {
            this.selectCategoryStore = [];
            for(let i=0; i<data.length; i++) {
                this.selectCategoryStore.push({
                    categoryName: data[i].label,
                    categoryCode: data[i].value
                })
            }
        }) 
    }

    public addMissionSaveBtn() {
        console.log(this.SCselectedStore) // 选中项
        this.ABMGridStore = [];
        for(let i=0; i<this.SCselectedStore.length; i++) {
           this.SCselectedStore[i].roleName = null;
           this.ABMGridStore.push(this.SCselectedStore[i]) 
        }
        // this.ABMselectedStore = this.ABMGridStore[0];
        this.selectCategoryDisplay = false;
    }

    public addMissionCancelBtn() {
        this.selectCategoryDisplay = false;
    }

    public setRole() {
        this.selectRoleDisplay = true;
        let projectId = '';
        if(this.selectedStore.projectType == '110' || this.selectedStore.projectType == '120') {
            projectId = this.selectedStore.programId
        } else {
            projectId = this.selectedStore.adProjectCode
        }
        this.service.get("/bpd-proj/bpd/user/userRole/getBudgetPet?projectId="+projectId+"&"+Number(new Date())+'&regionGroupCodes='+this.ABMselectedStore.categoryCode)
        .subscribe(data => {
            this.selectRoleStore = [];
            for(let i=0; i<data.length; i++) {
               // if(this.selectedStore.projectManager != data[i].userCode) {
                    this.selectRoleStore.push({
                        roleName: data[i].roleName,
                        roleCode: data[i].roleCode,
                        userName: data[i].userName,
                        userCode: data[i].userCode
                    })
               // }
            }
        })
    }

    public dbclick(e) {
        for(let i=0; i<this.ABMGridStore.length; i++) {
            if(this.ABMselectedStore.categoryName == this.ABMGridStore[i].categoryName) {
                this.ABMGridStore[i].roleName = e.data.roleName;
                this.ABMGridStore[i].roleCode = e.data.roleCode;
                this.ABMGridStore[i].userName = e.data.userName;
                this.ABMGridStore[i].userCode = e.data.userCode;
            }
        }
        this.selectRoleDisplay = false;
    }

    public ABMDelBtn(item,i) {
        this.confirmationService.confirm({
          message: 'Do You Want To Delete This Record?',
          header: 'Delete Confirmation',
          icon: 'fa fa-trash',
          accept: () => {
            for(let i=0; i<this.ABMGridStore.length; i++) {
                if(this.ABMGridStore[i].categoryName == item.categoryName) {
                    this.ABMGridStore.splice(i,1);
                    this.SCselectedStore.splice(i,1);
                }
            }
            // this.ABMselectedStore = this.ABMGridStore[0];
          }
        });
    }

    public copyVersionStore: any = [];
    public copyVersion: string = "";
    public timing: boolean = true;
    public ABMSaveBtn() {
        this.timing = false;
        let expirationTimeStr = '';
        if(this.expirationTime.toString().length > 10){
            let year = this.expirationTime.getFullYear();
            let month = this.expirationTime.getMonth() + 1;
            let day = this.expirationTime.getDate();
            expirationTimeStr = year + '-' + month + '-' + day;
        } else {
            expirationTimeStr = this.expirationTime;
        }
        let params = [];
        if(this.isAr) {
            for(let i=0; i<this.ABMGridStoreAr.length; i++) {
                if(this.ABMGridStoreAr[i].id) {
                    params.push({
                        "projectCode": this.selectedStore.adProjectCode,
                        "budgetVersionName": this.budgetVersionName,
                        "userCode": this.ABMGridStoreAr[i].reportPerson,
                        "versionDate": expirationTimeStr,
                        "regionCode": this.ABMGridStoreAr[i].regionCode,
                        "arRegionFlag": "1",
                        "projectName": this.selectedStore.projectName,
                        "copyBudgetVersionName": this.copyVersion,
                        "plant": this.assPlant,
                        "projectType": this.selectedStore.projectType
                    })
                }
            }
        } else {
            for(let i=0; i<this.ABMGridStore.length; i++) {
                params.push({
                    "projectCode": this.selectedStore.adProjectCode,
                    "budgetVersionName": this.budgetVersionName,
                    "regionCategoryCode": this.ABMGridStore[i].categoryCode,
                    "regionCategoryName": this.ABMGridStore[i].categoryName,
                    "roleCode": this.ABMGridStore[i].roleCode,
                    "userCode": this.ABMGridStore[i].userCode,
                    "versionDate": expirationTimeStr,
                    "projectName": this.selectedStore.projectName,
                    "copyBudgetVersionName": this.copyVersion,
                    "plant": this.assPlant,
                    "projectType": this.selectedStore.projectType
                })
                if(!this.ABMGridStore[i].userCode) {
                    this.msgservice.showInfo("Please Select User");
                    this.msgs = this.msgservice.msgs;
                    return;
                }
            }
        }
        this.service.post("/bpd-proj/bpd/projectBudget/insert",params)
        .subscribe(data => {
            if(data['code'] == 1) {
                this.msgservice.showSuccess("Success");
                this.msgs = this.msgservice.msgs;
                this.display = false;
                this.timing = true;
                this.service.post("/bpd-proj/bpd/projectBudget/getMap",{
                    "projectCode" : this.selectedStore.adProjectCode,
                    "userCode": window.localStorage.getItem('user'),
                    "projectType": this.selectedStore.projectType
                })
                .subscribe(data => {
                    this.budgetStore = [];
                    this.budgetVersionStore = [];
                    if(data.length < 10) {
                        for(let i = 0; i < 10; i++) {
                            if(!data[i]) {
                                this.budgetStore.push({
                                    "ip": i+1
                                })
                            } else {
                                data[i].id = i + 1;
                                data[i].approveDoaBrief = (data[i].approveDoa && data[i].approveDoa.length>10)  ? data[i].approveDoa.substr(0,10)+"..." : data[i].approveDoa;
                                this.budgetStore.push(data[i]);
                                this.budgetVersionStore.push({
                                    label: data[i].budgetVersionName,
                                    value: data[i].budgetVersionName
                                })
                                this.budgetVersion = this.budgetVersionStore[0].value;
                                }
                        }
                    } else {
                        for(let i = 0; i < data.length; i++) {
                            data[i].id = i + 1;
                            data[i].approveDoaBrief = (data[i].approveDoa && data[i].approveDoa.length>10)  ? data[i].approveDoa.substr(0,10)+"..." : data[i].approveDoa;
                            this.budgetStore.push(data[i]);
                            this.budgetVersionStore.push({
                                label: data[i].budgetVersionName,
                                value: data[i].budgetVersionName
                            })
                            this.budgetVersion = this.budgetVersionStore[0].value;
                        }
                    }
                })
            } else if(data['code'] == 2){
                this.msgservice.showInfo(data['msg']);
                this.msgs = this.msgservice.msgs;
                this.timing = true;
            } else if(data['code'] == 3){
                this.msgservice.showInfo("Budget Version Name Exists");
                this.msgs = this.msgservice.msgs;
                this.timing = true;
            } else {
                this.msgservice.showError("Operation Error!");
                this.msgs = this.msgservice.msgs;
                this.timing = true;
            }
        })
    }

    public ABMCancelBtn() {
        this.display = false;
    }

    public suggestionIndex: number = 0;
    public suggestion: string = null;
    public setSuggestionDisplay: boolean = false;
    public setSuggestionBtn(item,i) {
        this.suggestionIndex = i;
        this.suggestion = this.isFlag ? item.suggestion : item.auditComment;
        this.setSuggestionDisplay = true;
    }

    public setSuggestionSaveBtn() {
        let params: any = {};
        if(this.isFlag) {
            this.step2MainStore[this.suggestionIndex].suggestion = this.suggestion;
            params = {
                suggestion: this.suggestion,
                budgetItem: this.step2MainStore[this.suggestionIndex].budgetItem
            }
        } else {
            this.step2MainStore[this.suggestionIndex].auditComment = this.suggestion;
            this.step2MainStore[this.suggestionIndex].auditCommentBrief = (this.suggestion && this.suggestion.length>30)  ? this.suggestion.substr(0,27)+"..." : this.suggestion;
            params = {
                auditComment: this.suggestion,
                budgetItem: this.step2MainStore[this.suggestionIndex].budgetItem
            }
        }
        let logParams = [{
            "budgetItem" : this.step2MainStore[this.suggestionIndex].budgetItem,
            "suggestion" : this.isFlag ? this.step2MainStore[this.suggestionIndex].suggestion : this.step2MainStore[this.suggestionIndex].auditComment,
            "userCode" : window.localStorage.getItem('user')
        }];
        let publishUrl: string = null;
        if(!this.isFlag) {
            publishUrl = "/bpd-proj/bpd/projectBudgetDetail/update";
        } else {
            publishUrl = "/bpd-proj/bpd/mouldBudgetDetail/update";
        }
        this.service.post(publishUrl,params)
        .subscribe(data => {
            if(data['code'] == 1) {
                this.msgservice.showSuccess("Success");
                this.msgs = this.msgservice.msgs;
                this.service.post("/bpd-proj/bpd/reviewLog/insert",logParams)
                .subscribe(data => {
                    this.logSearch();
                })
            } else if(data['code'] == 2){
                this.msgservice.showInfo(data['msg']);
                this.msgs = this.msgservice.msgs;
            } else {
                this.msgservice.showError("Operation Error!");
                this.msgs = this.msgservice.msgs;
            }
        })
        this.setSuggestionDisplay = false;
    }

    public downloadTpl() {   // 导出预算模版

    }

    public downloadTplFlag() {
        let token = window.sessionStorage.getItem("access_token");
        let url: string = '/bpd-proj/bpd/mouldBudgetDetail/exportExcel?projectCode='+this.selectedStore.adProjectCode+'&budgetVersionName='+this.step2Params.budgetVersionName+'&regionCode='+this.step2Params.regionCode+'&regionCategoryCode='+this.step2Params.regionCategoryCode + "&_=" + Number(Date());
        if (token) {
            let realToken = token.substr(1, token.length - 2)
            url = url + "&accessToken=" + realToken;
        }
        window.location.href = url;
    }

    public onfileSelect(event) {
        this.chooseBudgetSheetDisplay = true;
        this.sheetValue = "";
    }
    public chooseBudgetSheetDisplay: boolean = false;
    public sheetValue: string = "";
    public importBudget() {  // 倒入普通excel
        this.addDialog = true;
    }

    public importBudgetFlag() {  // 倒入供应商模具excel
        this.addDialog = true;
    }

    public chooseBudgetSheetSaveBtn() {
        if(this.isFlag) {
            if(this.selectedStore.projectType == '110') {
                this.uploadURL = '/bpd-proj/bpd/mouldBudgetDetail/importMouldBudgetDetail?projectCode='+this.step1sonGrid.projectCode+'&plant='+this.step1sonGrid.plant+'&budgetVersionName='+encodeURI(this.step2Params.budgetVersionName)+'&regionCode='+this.step2Params.regionCode+'&regionCategoryCode='+this.step2Params.regionCategoryCode+'&excelName='+this.sheetValue;
            } else {
                this.uploadURL = '/bpd-proj/bpd/mouldBudgetDetail/importMouldBudgetDetail?projectCode='+this.step1sonGrid.projectCode+'&budgetVersionName='+encodeURI(this.step2Params.budgetVersionName)+'&regionCode='+this.step2Params.regionCode+'&regionCategoryCode='+this.step2Params.regionCategoryCode+'&excelName='+this.sheetValue;
            }
        } else {
            if(this.selectedStore.projectType == '110') {
                this.uploadURL = '/bpd-proj/bpd/projectBudgetDetail/importProjectBudgetDetail?adProjectCode='+this.step1sonGrid.projectCode+'&plant='+this.step1sonGrid.plant+'&budgetVersionName='+encodeURI(this.step2Params.budgetVersionName)+'&regionCode='+this.step2Params.regionCode+'&regionCategoryCode='+this.step2Params.regionCategoryCode+'&excelName='+this.sheetValue;
            } else {
                this.uploadURL = '/bpd-proj/bpd/projectBudgetDetail/importProjectBudgetDetail?adProjectCode='+this.step1sonGrid.projectCode+'&budgetVersionName='+encodeURI(this.step2Params.budgetVersionName)+'&regionCode='+this.step2Params.regionCode+'&regionCategoryCode='+this.step2Params.regionCategoryCode+'&excelName='+this.sheetValue;
            }
        }
        this.chooseBudgetSheetDisplay = false;
    }

    public sheetEnterSearch($event) { // 回车模糊搜索
        if ($event.key === "Enter") {
            this.chooseBudgetSheetSaveBtn();
        }
    }

    public exportS2() {   //  导出excel
        let token = window.sessionStorage.getItem("access_token");
        let url: string = "/bpd-proj/bpd/projectBudgetDetail/exportExcel?adProjectCode="+this.step1sonGrid.adProjectCode+"&budgetVersionName="+this.step2Params.budgetVersionName+"&regionCategoryCode="+this.step2Params.regionCategoryCode+"&regionCode="+this.step2Params.regionCode + "&_=" + Number(new Date());
        if (token) {
            let realToken = token.substr(1, token.length - 2)
            url = url + "&accessToken=" + realToken;
        }
        window.location.href = url;
    }

    onBasicUpload($event) {
        let response = eval('(' + $event.xhr.response + ')');
        if(response.list.length !== 0 && !response.message) {
            this.messageData = response.list;
            this.messageDialog = true;
            this.addDialog = false;
        }
        if(response.message) {
            this.msgservice.showError(response.message);
            this.msgs = this.msgservice.msgs;
        }
        if(response.list.length == 0 && !response.message) {
            this.msgservice.showSuccess("Success");
            this.msgs = this.msgservice.msgs;
            this.addDialog = false;
            if(!this.isFlag){
               this.getStep2MainStore(this.selextedTree); 
           } else {
               this.getStep2FlagMainStore(this.selextedTree);
           }
           // this.selsctTreeEvent.originalEvent.target.parentNode.parentNode.parentNode.style.backgroundColor = "#fff";
        }
    }

  public wbsClick(item) {
      this.wbsClickItem = item;
      this.wbsDisplay = true;
      this.service.post("/bpd-proj/bpd/investWbs/getTreeList",{
          "regionCatCode": this.selextedTree.item.regionCategoryCode
      })
      .subscribe(data => {
          this.wbsTreeStore = data.data
      })
  }

  public wbsDbclick(e) {
      if(e.target.innerText.trim().length < 6) {
            this.msgservice.showInfo("Wbs Code unvilable!");
            this.msgs = this.msgservice.msgs;
            return; 
        }
      this.wbsDisplay = false;
      if(this.addBudgetDisplay) {
          if(this.isFlag) {
              this.addWbsFlag = e.target.innerText.trim().split("-")[0] + e.target.innerText.trim().split("-")[1]
          } else {
              this.addWbs = e.target.innerText.trim().split("-")[0] + e.target.innerText.trim().split("-")[1]
          }
      } else {
          let url = "";
          if(this.isFlag) {
              url = "/bpd-proj/bpd/mouldBudgetDetail/update";
          } else {
              url = "/bpd-proj/bpd/projectBudgetDetail/update";
          }
          this.service.post(url,{
              "wbsCode": e.target.innerText.trim().split("-")[0] + e.target.innerText.trim().split("-")[1],
              "budgetItem": this.step2SelectedStore.budgetItem
          })
          .subscribe(data => {
                if(data['code'] == 1) {
                    if(!this.status4) {
                        this.wbsClickItem.wbsCode = e.target.innerText.trim();
                        this.msgservice.showSuccess("Success");
                        this.msgs = this.msgservice.msgs;
                        return;
                    }
                    let params2 = {};
                    if(status) {
                        params2 = {
                            "projectId" : this.wbsClickItem.projectCode,
                            "budgetVersionName" : this.wbsClickItem.budgetVersionName,
                            "planBudget" : this.wbsClickItem.planBudgetRmb ? this.wbsClickItem.planBudgetRmb : 0,
                            "projectCode" : this.selectedStore.projectCode,
                            "plantCode" : this.plantCode,
                            "regionCode" : this.wbsClickItem.regionCode.substr(-2),
                            "wbsCode" : e.target.innerText.trim(),
                            "oldWbsCode": this.wbsClickItem.wbsCode.split(".").join(""),
                            "wbsLevel6" : this.wbsClickItem.investmentProperty,
                            "wbsLevel7" : this.wbsClickItem.wbsLevel7,
                            "investmentPropertyCode" : this.wbsClickItem.investmentPropertyCode,
                            "wbsDescription": this.wbsClickItem.itemName
                        }
                    } else {
                        params2 = {
                            "projectId" : this.wbsClickItem.projectCode,
                            "budgetVersionName" : this.wbsClickItem.budgetVersionName,
                            "planBudget" : this.wbsClickItem.sgm ? this.wbsClickItem.sgm : 0,
                            "projectCode" : this.selectedStore.projectCode,
                            "plantCode" : this.plantCode,
                            "regionCode" : this.wbsClickItem.regionCode.substr(-2),
                            "wbsCode" : e.target.innerText.trim(),
                            "oldWbsCode": this.wbsClickItem.wbsCode.split(".").join(""),
                            "wbsLevel6" : this.wbsClickItem.investmentProperty,
                            "wbsLevel7" : this.wbsClickItem.wbsLevel7,
                            "investmentPropertyCode" : this.wbsClickItem.investmentPropertyCode,
                            "wbsDescription": this.wbsClickItem.partDescription
                        }
                    }
                    
                    this.service.post("/bpd-proj/bpd/projectCostBook/insert",[params2])
                    .subscribe(data => {
                        if(data['code'] == 1) {
                            this.msgservice.showSuccess("Success");
                            this.msgs = this.msgservice.msgs;
                            this.wbsClickItem.wbsCode = e.target.innerText.trim();
                        } else if(data['code'] == 2){
                            this.msgservice.showInfo("CostBook Exists!");
                            this.msgs = this.msgservice.msgs;
                        } else {
                            this.msgservice.showError("Operation Error!");
                            this.msgs = this.msgservice.msgs;
                        }
                    })
                } else if(data['code'] == 2){
                    this.msgservice.showInfo(data['msg']);
                    this.msgs = this.msgservice.msgs;
                } else {
                    this.msgservice.showError("Operation Error!");
                    this.msgs = this.msgservice.msgs;
                }
          })
      }
  }

  public wbsL7Click(item,i) {
      this.wbsL7Display = true;
      this.wbsL7Value = item.wbsLevel7;
      this.wbsL7Index = i;
  }

  public wbsL7SaveBtn() {
        this.wbsL7Display = false;
        this.service.post("/bpd-proj/bpd/projectBudgetDetail/update",{
            "budgetItem": this.step2SelectedStore.budgetItem,
            "wbsLevel7": this.wbsL7Value<10? '0'+this.wbsL7Value : this.wbsL7Value
        })
        .subscribe(data => {
            if(data['code'] == 1) {
                this.growLife = 5000;
                this.msgservice.showSuccess("Success");
                this.msgs = this.msgservice.msgs;
                this.step2MainStore[this.wbsL7Index].wbsLevel7 = this.wbsL7Value<10? '0'+this.wbsL7Value : this.wbsL7Value;
            } else {
                this.growLife = 5000;
                this.msgservice.showError("Operation Error!");
                this.msgs = this.msgservice.msgs;
            }
        })
  }

  public wbsL7CancelBtn() {
      this.wbsL7Display = false;
  }

  public messageDetermine() {
    this.messageDialog = false;
    this.step2Reload();
  }

  public messageVeto() {
    this.messageDialog = false;
    this.step2Reload();
  }

  public CBISave() {    //  改动
        if(this.selectedStore.projectType == '110') {
            if(!this.plantCode && this.selectedStore.projectType != '300') {
                this.growLife = 999999;
                this.msgservice.showInfo("Please Select Plant!");
                this.msgs = this.msgservice.msgs;
                return;
            }
            if(this.isFlag) {
                let params = [];
                for(let i=0; i<this.step2MainStore.length; i++) {
                    if(this.step2MainStore[i].id) {
                        if(this.selectedStore.projectType == '110') {
                            let plantName = "";
                            for(let i=0; i<this.plantStore.length; i++) {
                                if(this.plant == this.plantStore[i].value) {
                                    plantName = this.plantStore[i].value
                                }
                            }
                            this.step2MainStore[i].plant = plantName;
                            this.step2MainStore[i].plantCode = this.plantCode;
                        }
                        params.push(this.step2MainStore[i])
                    }
                }
                this.service.post("/bpd-proj/bpd/mouldBudgetDetail/updateDetail",params)
                .subscribe(data => {
                    if(data['code'] == 1) {
                        this.growLife = 5000;
                        this.msgservice.showSuccess("Success");
                        this.msgs = this.msgservice.msgs;
                    } else {
                        this.growLife = 5000;
                        this.msgservice.showError("Operation Error!");
                        this.msgs = this.msgservice.msgs;
                    }
                })
            } else {
                let params = [];
                for(let i=0; i<this.step2MainStore.length; i++) {
                    if(this.step2MainStore[i].id) {
                        if(this.selectedStore.projectType == '110') {
                            let plantName = "";
                            for(let i=0; i<this.plantStore.length; i++) {
                                if(this.plant == this.plantStore[i].value) {
                                    plantName = this.plantStore[i].value
                                }
                            }
                            this.step2MainStore[i].plant = plantName;
                            this.step2MainStore[i].plantCode = this.plantCode;
                        }
                        params.push(this.step2MainStore[i])
                    }
                }
                this.service.post("/bpd-proj/bpd/projectBudget/update",params)
                .subscribe(data => {
                    if(data['code'] == 1) {
                        this.growLife = 5000;
                        this.msgservice.showSuccess("Success");
                        this.msgs = this.msgservice.msgs;
                    } else {
                        this.growLife = 5000;
                        this.msgservice.showError("Operation Error!");
                        this.msgs = this.msgservice.msgs;
                    }
                })
            }
        } else {
            let plantName = "";
            for(let i=0; i<this.plantStore.length; i++) {
                if(this.plant == this.plantStore[i].value) {
                    plantName = this.plantStore[i].value
                }
            }
            let params = {
                "projectId" : this.isFlag ? this.selectedStore.adProjectCode : this.step2SelectedStore.adProjectCode,
                "plantCode" : plantName,
                "plant": this.plantCode,
                "projectType": this.selectedStore.projectType
            }
            this.service.post("/bpd-proj/bpd/projectBudgetDetail/updateProjectPlant",params)
            .subscribe(data => {
                if(data['code'] == 1) {
                    this.growLife = 5000;
                    this.msgservice.showSuccess("Success");
                    this.msgs = this.msgservice.msgs;
                } else {
                    this.growLife = 5000;
                    this.msgservice.showError("Operation Error!");
                    this.msgs = this.msgservice.msgs;
                }
            })
        }
    }

    public growLife: number = 5000;

    public delFlagBtn(item) {
        this.confirmationService.confirm({
          message: 'Do You Want To Delete This Record?',
          header: 'Delete Confirmation',
          icon: 'fa fa-trash',
          accept: () => {
            this.service.get("/bpd-proj/bpd/mouldBudgetDetail/deleteById?budgetItem="+item.budgetItem+"&"+Number(new Date()))
            .subscribe(data => {
                if(data['code'] == 1) {
                    this.msgservice.showSuccess("Success");
                    this.msgs = this.msgservice.msgs;
                    if(!this.isFlag){
                       this.getStep2MainStore(this.selextedTree); 
                    } else {
                       this.getStep2FlagMainStore(this.selextedTree);
                    }
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

    public delAllFlagBtn() {  // 供应商模具清空数据
        this.confirmationService.confirm({
          message: 'Do You Want To Delete These Record?',
          header: 'Delete Confirmation',
          icon: 'fa fa-trash',
          accept: () => {
            if(this.isFlag) {
                this.service.get("/bpd-proj/bpd/mouldBudgetDetail/deleteAll?adProjectCode="+this.step2Params.projectCode+'&budgetVersionName='+encodeURI(this.step2SelectedStore.budgetVersionName)+'&regionCode='+this.step2Params.regionCode+"&"+Number(new Date()))
                .subscribe(data => {
                    if(data['code'] == 1) {
                        this.growLife = 5000;
                        this.msgservice.showSuccess("Success");
                        this.msgs = this.msgservice.msgs;
                        this.getStep2FlagMainStore(this.selextedTree);
                        // this.selsctTreeEvent.originalEvent.target.parentNode.parentNode.parentNode.style.backgroundColor = "#e6e6e6";
                    } else {
                        this.growLife = 5000;
                        this.msgservice.showError("Operation Error!");
                        this.msgs = this.msgservice.msgs;
                    }
                })
            } else {
                this.service.get("/bpd-proj/bpd/projectBudgetDetail/deleteAll?adProjectCode="+this.step2Params.projectCode+'&budgetVersionName='+encodeURI(this.step2SelectedStore.budgetVersionName)+'&regionCode='+this.step2Params.regionCode+"&"+Number(new Date()))
                .subscribe(data => {
                    if(data['code'] == 1) {
                        this.growLife = 5000;
                        this.msgservice.showSuccess("Success");
                        this.msgs = this.msgservice.msgs;
                        this.getStep2MainStore(this.selextedTree);
                        // this.selsctTreeEvent.originalEvent.target.parentNode.parentNode.parentNode.style.backgroundColor = "#e6e6e6";
                    } else {
                        this.growLife = 5000;
                        this.msgservice.showError("Operation Error!");
                        this.msgs = this.msgservice.msgs;
                    }
                })
            }
          }
        });
    }

    public delAllBtn() {
        this.confirmationService.confirm({
          message: 'Do You Want To Delete These Record?',
          header: 'Delete Confirmation',
          icon: 'fa fa-trash',
          accept: () => {
            this.service.get("/bpd-proj/bpd/projectBudgetDetail/deleteAll?adProjectCode="+this.selectedStore.adProjectCode+'&budgetVersionName='+this.step2SelectedStore.budgetVersionName+'&regionCode='+this.step2SelectedStore.regionCode+"&"+Number(new Date()))
            .subscribe(data => {
                if(data['code'] == 1) {
                    this.msgservice.showSuccess("Success");
                    this.msgs = this.msgservice.msgs;
                    if(!this.isFlag){
                       this.getStep2MainStore(this.selextedTree); 
                       // this.selsctTreeEvent.originalEvent.target.parentNode.parentNode.parentNode.style.backgroundColor = "#e6e6e6";
                    } else {
                       this.getStep2FlagMainStore(this.selextedTree);
                       // this.selsctTreeEvent.originalEvent.target.parentNode.parentNode.parentNode.style.backgroundColor = "#e6e6e6";
                    }
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

    //   set Mics

    public micsDisplay: boolean = false;

    public micsData: any = [];

    public setMicsWeightDisplay: boolean = false;

    public micsWeight: number = null;

    public addMicsWeightDisplay: boolean = false;

    public addMicsWeight: any = null;

    public propertySerchStore: any = [];

    public propertySerch: string = null;

    public micsRecord: any;



    public setMics() {
        this.micsDisplay = true;
        this.service.post("/bpd-proj/bpd/misc/getVList",{
            "projectId": this.selectedStore.adProjectCode
        })
        .subscribe(data => {
            for(let i=0; i<data.length; i++) {
                data[i].id = i + 1;
                data[i].weightStr = data[i].weight + "%";
            }
            if(data.length < 10) {
                let _length = 10 - data.length;
                for(let i=0; i<_length; i++) {
                  data.push({
                    'ip':i
                  })
                }
                this.micsData = data;
            } else {
                this.micsData = data;
            }
        })
    }

    public editMics(item) {
        this.setMicsWeightDisplay = true;
        this.micsWeight = item.weight;
        this.micsRecord = item;
    }

    public delMics(item) {
        this.confirmationService.confirm({
          message: 'Do You Want To Delete This Record?',
          header: 'Delete Confirmation',
          icon: 'fa fa-trash',
          accept: () => {
            this.service.get("/bpd-proj/bpd/misc/deleteById?miscId="+item.miscId+"&"+Number(new Date()))
            .subscribe(data => {
                if(data['code'] == 1) {
                    this.msgservice.showSuccess("Success");
                    this.msgs = this.msgservice.msgs;
                    this.service.post("/bpd-proj/bpd/misc/getVList",{
                        "projectId": this.selectedStore.adProjectCode
                    })
                    .subscribe(data => {
                        this.micsData = [];
                        for(let i=0; i<data.length; i++) {
                            data[i].id = i + 1;
                            data[i].weightStr = data[i].weight + "%";
                        }
                        if(data.length < 10) {
                            let _length = 10 - data.length;
                            for(let i=0; i<_length; i++) {
                              data.push({
                                'ip':i
                              })
                            }
                            this.micsData = data;
                        } else {
                            this.micsData = data;
                        }
                    })
                } else if(data['code'] == 2){
                    this.msgservice.showInfo("Can Not Delete!");
                    this.msgs = this.msgservice.msgs;
                } else {
                    this.msgservice.showError("Operation Error!");
                    this.msgs = this.msgservice.msgs;
                }
            })
          }
        });
    }

    public addMics() {
        this.addMicsWeightDisplay = true;
        let investArr: any = [];
        for(let i=0; i<this.micsData.length; i++) {
            if(this.micsData[i].id) {
                investArr.push(this.micsData[i].propertyGroupId)
            }
        }
        this.service.post("/bpd-proj/bpd/investmentPropertyGroup/getGroup",{
         investArr: investArr   
        })
        .subscribe(data => {
            if(data.length) {
                this.propertySerchStore = data;
                this.propertySerch = data[0].value;
            } else {
                this.propertySerchStore = [];
                this.propertySerch = null;
            }
        })
        this.addMicsWeight = null;
    }    

    public addMicsWeightSaveBtn() {
        this.service.post("/bpd-proj/bpd/misc/insert",{
            "projectId": this.selectedStore.adProjectCode,
            "propertyGroupId": this.propertySerch,
            "weight": this.addMicsWeight
        })
        .subscribe(data => {
            if(data['code'] == 1) {
                this.msgservice.showSuccess("Success");
                this.msgs = this.msgservice.msgs;
                this.addMicsWeightDisplay = false;
                this.service.post("/bpd-proj/bpd/misc/getVList",{
                    "projectId": this.selectedStore.adProjectCode
                })
                .subscribe(data => {
                    this.micsData = [];
                    for(let i=0; i<data.length; i++) {
                        data[i].id = i + 1;
                        data[i].weightStr = data[i].weight + "%";
                    }
                    if(data.length < 10) {
                        let _length = 10 - data.length;
                        for(let i=0; i<_length; i++) {
                          data.push({
                            'ip':i
                          })
                        }
                        this.micsData = data;
                    } else {
                        this.micsData = data;
                    }
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

    public addMicsWeightCancelBtn() {
        this.addMicsWeightDisplay = false;
    }

    public micsWeightSaveBtn() {
        this.service.post("/bpd-proj/bpd/misc/update",{
            "miscId": this.micsRecord.miscId,
            "projectId": this.micsRecord.projectId,
            "propertyGroupId": this.micsRecord.propertyGroupId,
            "weight": this.micsWeight
        })
        .subscribe(data => {
            if(data['code'] == 1) {
                this.msgservice.showSuccess("Success");
                this.msgs = this.msgservice.msgs;
                this.setMicsWeightDisplay = false;
                this.service.post("/bpd-proj/bpd/misc/getVList",{
                    "projectId": this.selectedStore.adProjectCode
                })
                .subscribe(data => {
                    this.micsData = [];
                    for(let i=0; i<data.length; i++) {
                        data[i].id = i + 1;
                        data[i].weightStr = data[i].weight + "%";
                    }
                    if(data.length < 10) {
                        let _length = 10 - data.length;
                        for(let i=0; i<_length; i++) {
                          data.push({
                            'ip':i
                          })
                        }
                        this.micsData = data;
                    } else {
                        this.micsData = data;
                    }
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

    public micsWeightCancelBtn() {
        this.setMicsWeightDisplay = false;
    }

    // 版本比对

    public bugetVersionDisplay: boolean = false;

    public bugetVersionStore: any = [{"label":"Select","value":null}];

    public bugetVersion: string = null;

    public oldBudgetVersionName: string = null;

    public benchMarkBtn() {
        this.bugetVersionDisplay = true;
        this.bugetVersion = null;
        this.service.get("/bpd-proj/bpd/projectBudget/getProjectBudgetCombobox?projectCode="+this.selectedStore.adProjectCode+"&"+Number(new Date()))
        .subscribe(data => {
            this.bugetVersionStore = [];
            for(let i=0; i<data.length; i++) {
                console.log(data[i])
                if(data[i].value != this.step1sonGrid.budgetVersionName){
                    this.bugetVersionStore.push(data[i])
                }
            }
            this.bugetVersionStore.unshift({
                "label":"Select",
                "value":null
            })
        })
    }

    public bugetVersionSaveBtn() {
        this.bugetVersionDisplay = false;
        let e = {page: 0, first: 0, rows: "10"};
        this.step2Params = {
            "projectCode": this.selectedStore.adProjectCode,
            "adProjectCode": this.selectedStore.adProjectCode,
            "regionCode": this.selextedTree.item.value,
            "budgetVersionName": this.selextedTree.item.budgetVersionName,
            "regionCategoryCode": this.selextedTree.item.regionCategoryCode,
            "oldBudgetVersionName": this.bugetVersion,
            "page": {
                "page": 1,
                "rows": 10
            }
        }
        if(this.isFlag) {
            this.step2Flagpaginate(e);
        } else {
            this.step2paginate(e); 
        }
    }

    public bugetVersionCancelBtn() {
        this.bugetVersionDisplay = false;
    }

    public goBack() {
        this.step = 1;
        window.location.href = window.location.href.split(";")[0];
        this.ngOnInit();
        // this.getStep1BottomStore();
    }

    // 数字校验

    public rex:any = /(^0$)|(^0\.[0-9]{2}$)|(^100$)|(^[1-9][0-9]?(\.[0-9]{2})?$)/g;

    public oninputFun(e) {
        // if(this.addMicsWeight) {
        //     let addMicsWeightStr = this.addMicsWeight.toString();
        //     console.log(this.rex.test(addMicsWeightStr))
        //     if(!this.rex.test(addMicsWeightStr)){
        //         // let cutNum = addMicsWeightStr;
        //         // addMicsWeightStr.substr(-1);
        //         // console.log(cutNum)
        //         // this.addMicsWeight = Number(cutNum);
        //         this.addMicsWeight = 0;
        //         return;
        //     }
        // }
        console.log(this.addMicsWeight,e)
        this.addMicsWeight = 0;
    }

    // 文件上传
    public budgetFileUpLoadList: any[] = [];

    public budgetFileUpLoadUrlFirstStep: string = "/bpd-proj/bpd/att/upload";

    public budgetFileUpLoadUrlSecondStep: string = "/bpd-proj/bpd/projectBudgetDetail/addAtt";

    public fileUpLoadDialog: Boolean = false;

    public adProjectBusinessId: string;
    
    public UuId: string;

    /**
     * 上传弹框
     */
    public onBudgetFileUpLoadBtn() {
        this.UuId = this.dataManageService.getUuId();
        this.fileUpLoadDialog = true;
    }

    /**
     * 上传完成
     * @param  
     */
    public onBudgetFileUpload($event) {
        this.service.get(this.budgetFileUpLoadUrlSecondStep + '?' + Number(new Date()) + '&attId=' + this.UuId + "&type=bugetTemplateDirId")
            .subscribe(data => {
                if (data.code == 1) {
                    this.msgservice.showSuccess("Operate Success!");
                } else {
                    this.msgservice.showError("Operate Failed!");
                }
                this.msgs = this.msgservice.msgs;
                this.service.post('/bpd-proj/bpd/att/getVList', {
                    bussinessId: this.adProjectBusinessId
                })
                .subscribe(data => {
                    this.budgetFileUpLoadList = data;
                })
            })
        this.fileUpLoadDialog = false;
    }

    /**
     * 删除上传文件 
     * @param  
     */
    public onBudgetFileDeleteBtn($event) {
        this.confirmationService.confirm({
          message: 'Do You Want To Delete This Record?',
          header: 'Delete Confirmation',
          icon: 'fa fa-trash',
          accept: () => {
            this.service.get('/bpd-proj/bpd/att/delete?' + Number(new Date()) + "&attIds=" + $event.attId)
            .subscribe(data => {
                if (data.code == 1) {
                    this.msgservice.showSuccess("Operate Success!");
                } else {
                    this.msgservice.showError("Operate Failed!");
                }
                this.msgs = this.msgservice.msgs;
                this.service.post('/bpd-proj/bpd/att/getVList', {
                    bussinessId: this.adProjectBusinessId
                })
                .subscribe(data => {
                    this.budgetFileUpLoadList = data;
                })
            })
          }
        });
    }

    // 单条修改预算明细
    public setBudgetDisplay: boolean = false;
    public singleBudgetItem: any = {};
    public investmentPropertyStore: any = [];
    public currencyStore: any = [];
    public editBudgetBtn(item) {
        this.singleBudgetItem = item;
        this.service.get("/bpd-proj/bpd/investmentProperty/getPropertyCombobox")
        .subscribe(data => {
            this.investmentPropertyStore = data;
            this.singleBudgetItem.investmentPropertyCode = item.investmentPropertyCode;
        })
        this.service.get("/bpd-proj/bpd/currency/getCurrencyComboboxAll")
        .subscribe(data => {
            this.currencyStore = data;
            this.singleBudgetItem.currencyCode = item.currencyCode;
        })
        this.setBudgetDisplay = true;
    }

    public quantity(e) {
        this.singleBudgetItem.planBudget = this.singleBudgetItem.quantity * this.singleBudgetItem.price;
    }

    public quantityFlag(e) {
        this.singleBudgetItem.sgm = this.singleBudgetItem.sgmNonac + this.singleBudgetItem.sgmAc + this.singleBudgetItem.sgmSourced;
    }

    // 保存单条预算明细
    public setBudgetSaveBtn() {
        let params = this.singleBudgetItem;
        let publishUrl: string = null;
        if(!this.isFlag) {
            publishUrl = "/bpd-proj/bpd/projectBudgetDetail/update";
        } else {
            publishUrl = "/bpd-proj/bpd/mouldBudgetDetail/update";
        }
        this.service.post(publishUrl,params)
        .subscribe(data => {
            if(data['code'] == 1) {
                this.msgservice.showSuccess("Success");
                this.msgs = this.msgservice.msgs;
                this.setBudgetDisplay = false;
                if(!this.isFlag){
                    let e = {
                        page: this.step2gridStorePage, 
                        first: this.step2gridStoreFirst, 
                        rows: this.step2gridStoreRows,
                        pageCount: Math.ceil(this.step2gridStoreLen/this.step2gridStoreRows)
                    }
                    this.step2paginate(e);
                } else {
                    let e = {
                        page: this.step2FlaggridStorePage, 
                        first: this.step2FlaggridStoreFirst, 
                        rows: this.step2FlaggridStoreRows,
                        pageCount: Math.ceil(this.step2FlaggridStoreLen/this.step2FlaggridStoreRows)
                    }
                    this.step2Flagpaginate(e);
                }
            } else if(data['code'] == 2){
                this.msgservice.showInfo(data['msg']);
                this.msgs = this.msgservice.msgs;
            } else {
                this.msgservice.showError("Operation Error!");
                this.msgs = this.msgservice.msgs;
            }
        })
    }

    // 单条删除预算明细
    public delBudgetBtn(item) {
        this.confirmationService.confirm({
          message: 'Do You Want To Delete This Record?',
          header: 'Delete Confirmation',
          icon: 'fa fa-trash',
          accept: () => {
            let url: string = "";
            if(this.isFlag) {
                url = "/bpd-proj/bpd/mouldBudgetDetail/deleteById?budgetItem="+item.budgetItem+"&"+Number(new Date());
            } else {
                url = "/bpd-proj/bpd/projectBudgetDetail/deleteById?budgetItem="+item.budgetItem+"&"+Number(new Date());
            }
            this.service.get(url)
            .subscribe(data => {
                if(data['code'] == 1) {
                    this.msgservice.showSuccess("Success");
                    this.msgs = this.msgservice.msgs;
                    if(!this.isFlag){
                        let e = {
                            page: this.step2gridStorePage, 
                            first: this.step2gridStoreFirst, 
                            rows: this.step2gridStoreRows,
                            pageCount: Math.ceil(this.step2gridStoreLen/this.step2gridStoreRows)
                        }
                        this.step2paginate(e);
                    } else {
                        let e = {
                            page: this.step2FlaggridStorePage, 
                            first: this.step2FlaggridStoreFirst, 
                            rows: this.step2FlaggridStoreRows,
                            pageCount: Math.ceil(this.step2FlaggridStoreLen/this.step2FlaggridStoreRows)
                        }
                        this.step2Flagpaginate(e);
                    }
                } else if(data['code'] == 2){
                    this.msgservice.showInfo("Can not delete!");
                    this.msgs = this.msgservice.msgs;
                } else {
                    this.msgservice.showError("Operation Error!");
                    this.msgs = this.msgservice.msgs;
                }
            })
          }
        });
    }


    //  budget log 
    public budgetLogStore: any = [];
    public budgetLogLen: number;
    public budgetLogRows: any = '10';
    public budgetLogFirst: any = 0;
    public budgetLogPage: any = 0;

    public budgetLogPaginate(e) {
        let url:any = "";
        let params: any = {};
        if(this.isFlag) {
            url = "/bpd-proj/bpd/mouldBudgetLog/getList";
            params = {
               "page": {
                "page": e.page + 1,
                "rows": e.rows
                },
                budgetItem: this.step2SelectedStore.budgetItem,
                wbsCode: this.budgetLogWbsCodeSearch,
                partDescription: this.budgetLogItemNameSearch 
            }
        } else {
            url = "/bpd-proj/bpd/projectBudgetLog/getList";
            params = {
               "page": {
                "page": e.page + 1,
                "rows": e.rows
                },
                budgetItem: this.step2SelectedStore.budgetItem,
                wbsCode: this.budgetLogWbsCodeSearch,
                itemName: this.budgetLogItemNameSearch 
            }
        }
        this.service.post(url, params)
        .subscribe(data1 => {
            this.budgetLogStore = [];
            this.budgetLogLen = data1.total;
            this.budgetLogRows = e.rows;
            this.budgetLogFirst = Number(e.first);
            this.budgetLogPage = e.page;
            let data = data1.rows;
            for(let i = 0; i < data.length; i++) {
                data[i].id = i + 1;
            }
            for(let i = 0; i < e.rows; i++) {
                if(!data[i]) {
                    this.budgetLogStore.push({})
                } else {
                    this.budgetLogStore.push(data[i])
                }
            }
        });
    }

    public step2MainGridRowClick(event) {
        this.budgetLogItemNameSearch = "";
        this.budgetLogWbsCodeSearch = "";
        this.step2SelectedStore = event.data;
        if(this.tabIndex == 4) {
            let e = {
                page: 0, 
                first: 0, 
                rows: "10",
                pageCount: 1
            }
            this.budgetLogPaginate(e);
        }
    }

    //  新增预算明细
    public addBudgetDisplay: boolean = false;

    public addWbs: string = "";
    public addWbsL7: any = "01";
    public addItemName: string = "";
    public addInvestmentPropertyCode: string = null;
    public addItemDescription: string = "";
    public addCurrencyCode: string = "";
    public addUndefined1: string = "";
    public addUndefined2: string = "";
    public addUndefined3: string = "";
    public addUndefined4: string = "";
    public addUndefined5: string = "";
    public addQuantity: any = "";
    public addPrice: any = "";
    public addPlanBudget: any = "";
    public addBudgetComment: any = "";
    public addAuthor: string = "";

    public addWbsFlag: string = "";
    public addVppsLevelFullFlag: string = "";
    public addPartDescriptionFlag: string = "";
    public addOrderNumberFlag: string = "";
    public addPartTypeFlag: string = "";
    public addModLevelFlag: string = "";
    public addSmtFlag: string = "";
    public addPcsMemoFlag: string = "";
    public addDesignNumberFlag: string = "";
    public addSgmNonacFlag: any = "";
    public addSgmAcFlag: any = "";
    public addSgmSourcedFlag: any = "";
    public addSgmFlag: any = "";
    public addVarianceFlag: any = "";

    public addBudget() {

        this.addWbs = "";
        this.addWbsL7 = "01";
        this.addItemName = "";
        this.addInvestmentPropertyCode = "";
        this.addItemDescription = "";
        this.addCurrencyCode = "";
        this.addUndefined1 = "";
        this.addUndefined2 = "";
        this.addUndefined3 = "";
        this.addUndefined4 = "";
        this.addUndefined5 = "";
        this.addQuantity = "";
        this.addPrice = "";
        this.addPlanBudget = "";
        this.addBudgetComment = "";
        this.addAuthor = "";

        this.addWbsFlag = "";
        this.addVppsLevelFullFlag = "";
        this.addPartDescriptionFlag = "";
        this.addOrderNumberFlag = "";
        this.addPartTypeFlag = "";
        this.addModLevelFlag = "";
        this.addSmtFlag = "";
        this.addPcsMemoFlag = "";
        this.addDesignNumberFlag = "";
        this.addSgmNonacFlag = "";
        this.addSgmAcFlag = "";
        this.addSgmSourcedFlag = "";
        this.addSgmFlag = "";
        this.addVarianceFlag = "";

        this.service.get("/bpd-proj/bpd/investmentProperty/getPropertyCombobox")
        .subscribe(data => {
            if(data.length) {
                this.investmentPropertyStore = data;
                this.addInvestmentPropertyCode = data[0].value;
            }
        })
        this.service.get("/bpd-proj/bpd/currency/getCurrencyComboboxAll")
        .subscribe(data => {
            if(data.length) {
                this.currencyStore = data;
                this.addCurrencyCode = data[0].value;
            }
        })
        this.addBudgetDisplay = true;
    }

    public addQuantityFun(e) {
        this.addPlanBudget = this.addQuantity * this.addPrice;
    }

    public addQuantityFlagFun(e) {
        this.addSgmFlag = this.addSgmNonacFlag + this.addSgmAcFlag + this.addSgmSourcedFlag;
    }

    public addBudgetSaveBtn() {
        let url: string = "";
        let params: any = {};
        if(this.isFlag) {
            url = "/bpd-proj/bpd/mouldBudgetDetail/insert";
            params = {
                projectCode: this.step1sonGrid.projectCode,
                plant: (this.selectedStore.projectType == '110') ? this.step1sonGrid.plant : null,
                budgetVersionName: encodeURI(this.step2Params.budgetVersionName),
                regionCode: this.step2Params.regionCode,
                regionCategoryCode: this.step2Params.regionCategoryCode,
                wbsCode: this.addWbsFlag,
                vppsLevelFull: this.addVppsLevelFullFlag,
                partDescription: this.addPartDescriptionFlag,
                orderNumber: this.addOrderNumberFlag,
                partType: this.addPartTypeFlag,
                modLevel: this.addModLevelFlag,
                smt: this.addSmtFlag,
                pcsMemo: this.addPcsMemoFlag,
                designNumber: this.addDesignNumberFlag,
                sgmNonac: this.addSgmNonacFlag,
                sgmAc: this.addSgmAcFlag,
                sgmSourced: this.addSgmSourcedFlag,
                sgm: this.addSgmFlag,
                variance: this.addVarianceFlag,
                investmentPropertyCode: this.addInvestmentPropertyCode
            }
        } else {
            url = "/bpd-proj/bpd/projectBudgetDetail/insert";
            params = {
                adProjectCode: this.step1sonGrid.projectCode,
                plant: (this.selectedStore.projectType == '110') ? this.step1sonGrid.plant : null,
                budgetVersionName: encodeURI(this.step2Params.budgetVersionName),
                regionCode: this.step2Params.regionCode,
                regionCategoryCode: this.step2Params.regionCategoryCode,
                wbsCode: this.addWbs,
                wbsLevel7: Number(this.addWbsL7) < 10 ? '0' + Number(this.addWbsL7) : this.addWbsL7,
                itemName: this.addItemName,
                investmentPropertyCode: this.addInvestmentPropertyCode,
                itemDescription: this.addItemDescription,
                currencyCode: this.addCurrencyCode,
                undefinedField1:this.addUndefined1,
                undefinedField2:this.addUndefined2,
                undefinedField3:this.addUndefined3,
                undefinedField4:this.addUndefined4,
                undefinedField5:this.addUndefined5,
                quantity: this.addQuantity,
                price: this.addPrice,
                planBudget: this.addPlanBudget,
                budgetComment: this.addBudgetComment,
                author: this.addAuthor
            }
        }
        this.service.post(url,params)
        .subscribe(data => {
            if(data['code'] == 1) {
                this.growLife = 5000;
                this.msgservice.showSuccess("Success");
                this.msgs = this.msgservice.msgs;
                this.addBudgetDisplay = false;
                if(!this.isFlag){
                    let e = {
                        page: this.step2gridStorePage, 
                        first: this.step2gridStoreFirst, 
                        rows: this.step2gridStoreRows,
                        pageCount: Math.ceil(this.step2gridStoreLen/this.step2gridStoreRows)
                    }
                    this.step2paginate(e);
                } else {
                    let e = {
                        page: this.step2FlaggridStorePage, 
                        first: this.step2FlaggridStoreFirst, 
                        rows: this.step2FlaggridStoreRows,
                        pageCount: Math.ceil(this.step2FlaggridStoreLen/this.step2FlaggridStoreRows)
                    }
                    this.step2Flagpaginate(e);
                }
            } else if(data['code'] == 2){
                this.growLife = 999999;
                this.msgservice.showInfo(data['msg']);
                this.msgs = this.msgservice.msgs;
            } else {
                this.growLife = 5000;
                this.msgservice.showError("Operation Error!");
                this.msgs = this.msgservice.msgs;
            }
        })
    }

    public getWbsCode() {
        this.wbsDisplay = true;
        this.service.post("/bpd-proj/bpd/investWbs/getTreeList",{
          "regionCatCode": this.selextedTree.item.regionCategoryCode
        })
        .subscribe(data => {
          this.wbsTreeStore = data.data
        })
    }

    //   查看文字详情
    public mouseover(e,html) {
        var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        var messageDetail = document.getElementById("messageDetail");
        messageDetail.innerHTML = html;
        if(html.length > 200) {
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
};