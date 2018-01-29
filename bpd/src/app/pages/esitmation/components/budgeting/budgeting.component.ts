import { Component, OnInit, ElementRef } from '@angular/core';
import 'style-loader!./budgeting.scss';
import { SelectItem, TreeNode, MenuItem, ConfirmationService } from 'primeng/primeng';
import { HttpDataService } from '../../../service/http.service';
import { MessageService } from '../../../service/message.service';
import { DataManageService } from '../../../service/dataManage.service';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'budgeting',
  templateUrl: './budgeting.html',
  providers: [HttpDataService, MessageService, ConfirmationService]
})
export class Budgeting implements OnInit{

    public step: number = 1;
	
	public projectTypeSerch: string = null;

    public projectTypeSerchStore: any = [];
    
    public budgetItemSerchStore: any[] = [];

    public budgetItemSerch: string = "";

	public projectCodeSerch: string = null;

	public approvedInvestmentSerch: number = null;

	public selectedStore: any = [];

    public step2SelectedStore: any = [];

	public gridStore: any = [];

	public gridStoreLen: number;

	public budgetStore: any = [{'id':1}];

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

    public AuditLogStore: any = []

    public treeTitle: string = '';

    public parameterDisplay: boolean = false;

    public parameterValue: any = null;

    public assumeParams: any;

    public step2RegionCategoryCode: string = '';

    public step2Params: any;

    public undefinedField1: string = 'Part Import';

    public undefinedField2: string = 'Part Local';

    public undefinedField3: string = 'Die Set Import';

    public undefinedField4: string = 'Die Set Local';

    public undefinedField5: string = 'New/Modification';

    public msgs: any;

    public growLife: number = 5000;

    public commitDisplay: boolean = true;

    public importDisplay: boolean = true;

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

    public costBookDisplay: boolean = true;

    public treeStore: any = [];

    public selectedTree: any = [];

    public selectedFile: any = [];

    public isFlag: boolean = false;

    public wbsTreeSelectedStore: any = [];

    public wbsClickItem: any;

    // 文件上传
    public budgetFileUpLoadList: any[] = [];

    public budgetFileUpLoadUrlFirstStep: string = "/bpd-proj/bpd/att/upload";

    public budgetFileUpLoadUrlSecondStep: string = "/bpd-proj/bpd/projectBudgetDetail/addAtt";

    public fileUpLoadDialog: Boolean = false;

    public adProjectBusinessId: string;
    
    public UuId: string;

    public yearRange: string;

    public isJump: boolean = false;

    public checked: boolean = true;

	constructor(private service: HttpDataService, private confirmationService: ConfirmationService, private msgservice: MessageService,public route: ActivatedRoute, private dataManageService: DataManageService,private el:ElementRef) {
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
                    "status": data.status,
                    "projectName": data.projectName,
                    "projectType": data.projectType,
                    "plantCode": data.plantCode,
                    "plantName": data.plantName,
                    "projectManager": data.projectManager,
                    "userCode": window.localStorage.getItem('user')
                }
                this.selectedStore.projectName = data.projectName;
                this.selectedStore.projectType = data.projectType;
                this.selectedStore.plantCode = data.plantCode == "null" ? null : data.plantCode;
                this.selectedStore.plantName = data.plantName == "null" ? "" : data.plantName;
                this.selectedStore.adProjectCode = data.adProjectCode;
                this.selectedStore.projectCode = data.projectCode;
                this.selectedStore.projectManager = data.projectManager;
                this.selectedStore.status = data.status;
                this.budgetEditBtn(item);
            } else {
                this.isJump = false;
            }
        });
        if(this.step == 1) {
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
            if (!this.route.params['_value'].projectCode) {
                this.selectedStore = data[0];
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
            this.budgetStore = [];
            for(let i = 0; i < 10; i++) {
                this.budgetStore.push({
                    ip: i
                });
            }
        }
    	
    }

    private approvedInvestmentEnterSearch($event) { // 回车模糊查询
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
                if (!this.route.params['_value'].projectCode) {
                    this.selectedStore = data[0];
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
                this.budgetStore = [];
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
        this.step1sonGrid = item;
        this.step = 2;
        this.treeTitle = this.selectedStore.projectName;
        this.getTree(item);
    }

    public getTree(item) {
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
                            commitDisplay: true,
                            command: (event) => {
                                this.selextedTree = event;
                                this.getStep2MainStore(event);
                                this.commitDisplay = true;
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
                            commitDisplay: false,
                            command: (event) => {
                               this.selextedTree = event;
                               this.getStep2MainStore(event);
                               this.commitDisplay = false;
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
                            commitDisplay: true,
                            command: (event) => {
                                this.selextedTree = event;
                                this.getStep2MainStore(event);
                                this.commitDisplay = true;
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
            if(item1[0]) {
                this.selectedFile = item1[0].children[0];
                this.commitDisplay = true;
                this.importDisplay = true;
            } else {
                if(item2[0]) {
                    this.selectedFile = item2[0].children[0];
                    this.commitDisplay = false;
                    this.importDisplay = false;
                } else {
                    if(item3[0]) {
                       this.selectedFile = item3[0].children[0];
                       this.commitDisplay = true;
                       this.importDisplay = false; 
                    } else {
                        this.selectedFile = item4[0].children[0]; 
                        this.commitDisplay = false;
                        this.importDisplay = false;
                    } 
                }
            }
            let event: any = {
                item: this.selectedFile
            };
            // let e: any = {
            //     node: this.selectedFile 
            // }
            // console.log(e)
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
        console.log(e)
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
            if(e.node.parent.icon == "fa-calendar" || e.node.parent.icon == "fa-exclamation-circle") {
                this.importDisplay = true;
            } else {
                this.importDisplay = false;
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
        this.adProjectBusinessId = event.item.adProjectCode + "/" + event.item.budgetVersionName + "/" + event.item.value;
        this.step2RegionCategoryCode = event.item.regionCategoryCode;
        this.step2Params = {
            "projectCode": event.item.adProjectCode,
            "adProjectCode": event.item.adProjectCode,
            "regionCode": event.item.value,
            "budgetVersionName": event.item.budgetVersionName,
            "regionCategoryCode": event.item.regionCategoryCode,
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
                    "regionCategoryCode": event.item.regionCategoryCode
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
            "projectCode": event.item.adProjectCode,
            "adProjectCode": event.item.adProjectCode,
            "regionCode": event.item.value,
            "budgetVersionName": event.item.budgetVersionName,
            "regionCategoryCode": event.item.regionCategoryCode,
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
                    "regionCategoryCode": event.item.regionCategoryCode
                })
                .subscribe(data => {
                    this.undefinedField1 = data[0];
                    this.undefinedField2 = data[1];
                    this.undefinedField3 = data[2];
                    this.undefinedField4 = data[3];
                    this.undefinedField5 = data[4];
                })
            } else {
                this.step2SelectedStore = [];
                this.assumeStore = [];
                this.AuditLogStore = [];
                this.commitDisplay = false;
            }
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

    public S2EnterSearch($event) { // 回车模糊搜索
        if ($event.key === "Enter") {
            this.lookupSaveBtn();
        }
    }

// getVProjectBudgetDetailList
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

    public tabIndex: number = 0;
    public handleChange(e) {   // tab切换
        if(e.index == 0) {
            this.tabIndex = 0;
            this.assumeStore = [];
            if(this.step2SelectedStore.budgetItem) {
                this.service.post("/bpd-proj/bpd/investmentIndex/getIndexList",{
                    "projectType" : this.selectedStore.projectType,
                    "regionCategoryCode" : this.step2SelectedStore.regionCategoryCode,
                    "projectCode" : this.step2SelectedStore.adProjectCode,
                    "budgetVersionName" : this.step2SelectedStore.budgetVersionName,
                    "regionCode" : this.step2SelectedStore.regionCode
                })
                .subscribe(data => {
                    for(let i = 0; i < data.length; i++) {
                        data[i].id = i + 1;
                        this.assumeStore.push(data[i])
                    }
                })
            }
        } else if(e.index == 1) {
            this.tabIndex = 1;
            this.costBookDisplay = true;
            this.costBookRegionName = this.selextedTree.item.label;
            this.costBookRegionCode = this.isFlag ? this.selextedTree.item.value.substr(2,this.selextedTree.item.value.length) : this.selextedTree.item.value;
            this.service.post("/bpd-proj/bpd/plant/getList",{
                flag: '1'
            })
            .subscribe(data => {
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
            this.growLife = 999999;
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

    public plantChange(e) {
        // this.plantCode = e.value;
        this.service.get("/bpd-proj/bpd/plant/getByDescripition?plantDescription="+e.value)
        .subscribe(data => {
            this.plantCode = data.plantCode;
        })
    }

    public assumeItem: any = {};
    public assumeEditBtn(item) {  // 假设编辑
        this.assumeItem = item;
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
        this.service.post("/bpd-proj/bpd/reviewLog/delete",{
            "logId" : item.logId
        })
        .subscribe(data => {
            if(data['code'] == 1) {
                this.growLife = 5000;
                this.msgservice.showSuccess("Success");
                this.msgs = this.msgservice.msgs;
                this.logSearch();
            } else if(data['code'] == 2){
                this.growLife = 999999;
                this.msgservice.showInfo("Project Code Exists!");
                this.msgs = this.msgservice.msgs;
            } else {
                this.growLife = 5000;
                this.msgservice.showError("Operation Error!");
                this.msgs = this.msgservice.msgs;
            }
        })
    }

    public parameterSaveBtn() {
        if(typeof(this.parameterValue) == 'object') {
            let year = this.parameterValue.getFullYear();
            let month = this.parameterValue.getMonth() + 1;
            let day = this.parameterValue.getDate();
            this.assumeParams.parameterValue = year + '-' + month + '-' + day;
        } else {
            this.assumeParams.parameterValue = this.parameterValue;
        }
        this.service.post("/bpd-proj/bpd/investmentIndex/update",this.assumeParams)
        .subscribe(data => {
            if(data['code'] == 1) {
                this.growLife = 5000;
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
                this.growLife = 999999;
                this.msgservice.showInfo("Project Code Exists!");
                this.msgs = this.msgservice.msgs;
            } else {
                this.growLife = 5000;
                this.msgservice.showError("Operation Error!");
                this.msgs = this.msgservice.msgs;
            }
        })
    }

    public parameterCancelBtn() {
        this.parameterDisplay = false;
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
        this.service.post("/bpd-proj/bpd/allProjInfo/getByTypeCode",{
            page: {page: 1, rows: 10},
            adProjectCode: this.selectedStore.adProjectCode
        })
        .subscribe(data => {
            this.selectedStore = data.rows[0];
            this.plant = this.selectedStore.plantCode;
            this.plantCode = this.selectedStore.plantCode;
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
                if(item.status) {
                    for(let i=1; i<item.status; i++) {
                        data.unshift({data:[]})
                    }
                }
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
                                commitDisplay: true,
                                command: (event) => {
                                    this.selextedTree = event;
                                    this.getStep2MainStore(event);
                                    this.commitDisplay = true;
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
                                commitDisplay: false,
                                command: (event) => {
                                   this.selextedTree = event;
                                   this.getStep2MainStore(event);
                                   this.commitDisplay = false;
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
                                commitDisplay: true,
                                command: (event) => {
                                    this.selextedTree = event;
                                    this.getStep2MainStore(event);
                                    this.commitDisplay = true;
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
                           this.commitDisplay = true;
                           this.importDisplay = true;
                           break; 
                        } else if(i==1) {
                           this.selectedFile = item2[0].children[0];
                           this.commitDisplay = false;
                           this.importDisplay = false;
                           break; 
                        } else if(i==2) {
                           this.selectedFile = item3[0].children[0];
                           this.commitDisplay = true;
                           this.importDisplay = false;
                           break;
                        } else if(i==3) {
                           this.selectedFile = item4[0].children[0]; 
                           this.commitDisplay = false;
                           this.importDisplay = false;
                           break;
                        }
                    }
                }
                let event: any = {};
                event.item = this.selectedFile;
                // let e: any = {
                //     node: this.selectedFile 
                // }
                // console.log(e,111)
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
        })
    }

    public commitS2() {  // 提交审批
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
        
        if(!this.plantCode && this.selectedStore.projectType != '300') {
            this.growLife = 999999;
            this.msgservice.showInfo("Please Select Plant!");
            this.msgs = this.msgservice.msgs;
            return;
        }
        let params = [];
        for(let i=0; i<this.step2MainStore.length; i++) {
            if(this.step2MainStore[i].id) {
                this.step2MainStore[i].status = 2;
                this.step2MainStore[i].projectName = this.selectedStore.projectName;
                this.step2MainStore[i].projectManager = this.selectedStore.projectManager;
                this.step2MainStore[i].regionName = this.selextedTree.item.label;
                this.step2MainStore[i].wbsLevel6 = this.step2MainStore[i].investmentPropertyCode;
                if(this.step2MainStore[i].wbsCode) {
                    this.step2MainStore[i].wbsCode = this.step2MainStore[i].wbsCode.split("-")[0] + this.step2MainStore[i].wbsCode.split("-")[1]
                }
                if(this.selectedStore.projectType == '110') {
                   this.step2MainStore[i].plant =  this.plant
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
                // this.CBISave();
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
                this.growLife = 999999;
                this.msgservice.showInfo("Project Code Exists!");
                this.msgs = this.msgservice.msgs;
            } else {
                this.growLife = 5000;
                this.msgservice.showError("Operation Error!");
                this.msgs = this.msgservice.msgs;
            }
        })
    }

    public commitS2Flag() {  // 供应商模具提交审批
        if(!this.plantCode && this.selectedStore.projectType != '300') {
            this.growLife = 5000;
            this.msgservice.showInfo("Please Select Plant!");
            this.msgs = this.msgservice.msgs;
            return;
        }
        let params = [];
        for(let i=0; i<this.step2MainStore.length; i++) {
            if(this.step2MainStore[i].id) {
                this.step2MainStore[i].status = 2;
                this.step2MainStore[i].projectName = this.selectedStore.projectName;
                this.step2MainStore[i].projectManager = this.selectedStore.projectManager;
                this.step2MainStore[i].regionName = this.selextedTree.item.label;
                if(this.step2MainStore[i].wbsCode) {
                    this.step2MainStore[i].wbsCode = this.step2MainStore[i].wbsCode.split("-")[0] + this.step2MainStore[i].wbsCode.split("-")[1]
                }
                if(this.selectedStore.projectType == '110') {
                    this.step2MainStore[i].plant =  this.plant
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
                // this.CBISave();
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
                this.growLife = 999999;
                this.msgservice.showInfo("Project Code Exists!");
                this.msgs = this.msgservice.msgs;
            } else {
                this.growLife = 5000;
                this.msgservice.showError("Operation Error!");
                this.msgs = this.msgservice.msgs;
            }
        })
    }

    public editInputBlur(e,item,i) {
        this.step2MainStore[i].budgetComment = e.target.value;
    }

    public budgetTplDialog: boolean = false;

    public budgetTplData: any = [];

    public downloadTpl() {   // 导出普通预算模版
        this.budgetTplDialog = true;
        if(this.selectedStore.projectType == '300') {
            this.service.post("/bpd-proj/bpd/att/getVList",{
                bussinessId: '300'
            })
            .subscribe(data => {
                this.budgetTplData= data;
            })
        } else {
            this.service.post("/bpd-proj/bpd/att/getVList",{
                bussinessId: this.step2Params.regionCategoryCode + 'cat'
            })
            .subscribe(data => {
                this.budgetTplData= data;
            })
        } 
    }

    public downloadTplFlag() {  // 导出供应商预算模版
        let token = window.sessionStorage.getItem("access_token");
        let url: string = '/bpd-proj/bpd/mouldBudgetDetail/exportExcel?projectCode='+ this.step2Params.projectCode+'&budgetVersionName='+encodeURI(this.step2Params.budgetVersionName)+'&regionCode='+this.step2Params.regionCode + "&_=" + Number(new Date());
        if (token) {
            let realToken = token.substr(1, token.length - 2)
            url = url + "&accessToken=" + realToken;
        }
        window.location.href = url;
    }

    public dbclick(e) {
        this.service.get("/bpd-proj/bpd/att/downloadFiles?attIds="+e.data.attId)
        .subscribe(data => {
            if(data['code'] == 0) {
                this.growLife = 999999;
                this.msgservice.showInfo("Can not find file!");
                this.msgs = this.msgservice.msgs; 
            } else {
                let token = window.sessionStorage.getItem("access_token");
                let url: string = "/bpd-proj/bpd/att/downloadFiles?attIds="+e.data.attId + "&_=" + Number(new Date());
                if (token) {
                    let realToken = token.substr(1, token.length - 2)
                    url = url + "&accessToken=" + realToken;
                }
                window.location.href = url;
                this.budgetTplDialog = false;
            }
        })
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

    public exportS2() {   //  导出普通excel
        let token = window.sessionStorage.getItem("access_token");
        let url: string = "/bpd-proj/bpd/projectBudgetDetail/exportExcel?adProjectCode="+this.step1sonGrid.projectCode+"&budgetVersionName="+encodeURI(this.step2Params.budgetVersionName)+"&regionCategoryCode="+this.step2Params.regionCategoryCode+"&regionCode="+this.step2Params.regionCode + "&_=" + Number(new Date());
        if (token) {
            let realToken = token.substr(1, token.length - 2)
            url = url + "&accessToken=" + realToken;
        }
        window.location.href = url;
    }

    public downloadBudgetFile(item) {
        this.service.get("/bpd-proj/bpd/att/downloadFiles?attIds=" + item.attId)
        .subscribe(data => {
            if(data['code'] == 0) {
              this.growLife = 999999;
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

    // 供应商模具单条增删改

    public delFlagBtn(item) {
        this.confirmationService.confirm({
          message: 'Do You Want To Delete This Record?',
          header: 'Delete Confirmation',
          icon: 'fa fa-trash',
          accept: () => {
            this.service.get("/bpd-proj/bpd/mouldBudgetDetail/deleteById?budgetItem="+item.budgetItem+"&"+Number(new Date()))
            .subscribe(data => {
                if(data['code'] == 1) {
                    this.growLife = 5000;
                    this.msgservice.showSuccess("Success");
                    this.msgs = this.msgservice.msgs;
                    if(!this.isFlag){
                       this.getStep2MainStore(this.selextedTree); 
                    } else {
                       this.getStep2FlagMainStore(this.selextedTree);
                    }
                } else if(data['code'] == 2){
                    this.growLife = 999999;
                    this.msgservice.showInfo("Can Not Delete!");
                    this.msgs = this.msgservice.msgs;
                } else {
                    this.growLife = 5000;
                    this.msgservice.showError("Operation Error!");
                    this.msgs = this.msgservice.msgs;
                }
            })
          }
        });
    }

    public editFlagBtn(item) {

    }

    onBasicUpload($event) {
        let response = eval('(' + $event.xhr.response + ')');
        if(response.list.length !== 0 && !response.message) {
            this.messageData = response.list;
            this.messageDialog = true;
            this.addDialog = false;
        }
        if(response.message) {
            this.growLife = 999999;
            this.msgservice.showError(response.message);
            this.msgs = this.msgservice.msgs;
        }
        if(response.list.length == 0 && !response.message) {
            this.growLife = 5000;
            this.msgservice.showSuccess("Success");
            this.msgs = this.msgservice.msgs;
            this.addDialog = false;
            this.commitDisplay = true;
            if(!this.isFlag){
               this.getStep2MainStore(this.selextedTree); 
           } else {
               this.getStep2FlagMainStore(this.selextedTree);
           }
           // this.selsctTreeEvent.originalEvent.target.parentNode.parentNode.parentNode.style.backgroundColor = "#fff";
        }
    }

    public wbsDbclick(e) {
        if(e.target.innerText.trim().length < 6) {
            this.growLife = 999999;
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
                    this.growLife = 5000;
                    this.msgservice.showSuccess("Success");
                    this.msgs = this.msgservice.msgs;
                    this.wbsClickItem.wbsCode = e.target.innerText.trim();
                } else if(data['code'] == 2){
                    this.growLife = 999999;
                    this.msgservice.showInfo("Project Code Exists!");
                    this.msgs = this.msgservice.msgs;
                } else {
                    this.growLife = 5000;
                    this.msgservice.showError("Operation Error!");
                    this.msgs = this.msgservice.msgs;
                }
          })
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

  public wbsL7Click(item,i) {
      this.wbsL7Display = true;
      this.wbsL7Value = item.wbsLevel7;
      this.wbsL7Index = i;
  }

  public wbsL7SaveBtn() {
      this.step2MainStore[this.wbsL7Index].wbsLevel7 = this.wbsL7Value < 10 ? '0' + this.wbsL7Value: this.wbsL7Value;
      this.wbsL7Display = false;
  }

  public wbsL7CancelBtn() {
      this.wbsL7Display = false;
  }

    public CBISave() {
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
                            this.step2MainStore[i].plant =  plantName;
                            this.step2MainStore[i].plantCode =  this.plantCode;
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
                           this.step2MainStore[i].plant =  plantName;
                           this.step2MainStore[i].plantCode =  this.plantCode;
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

    public goBack() {
        this.step = 1;
        window.location.href = window.location.href.split(";")[0];
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
                    this.growLife = 5000;
                    this.msgservice.showSuccess("Operate Success!");
                } else {
                    this.growLife = 5000;
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
                    this.growLife = 5000;
                    this.msgservice.showSuccess("Operate Success!");
                } else {
                    this.growLife = 5000;
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

    // showDetail
    public suggestionDetail: string = null;
    public showDetail(e,item,op3) {
        this.suggestionDetail = item.auditComment;
        op3.toggle(e);
    }

    public showDetail2(e,item,op2) {
        this.suggestionDetail = item.suggestion;
        op2.toggle(e);
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
                this.growLife = 5000;
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
                    this.growLife = 5000;
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
                    this.growLife = 999999;
                    this.msgservice.showInfo("Can not delete!");
                    this.msgs = this.msgservice.msgs;
                } else {
                    this.growLife = 5000;
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
        let observable = this.service.post(url, params)
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

    public addWbs: any = "";
    public addWbsL7: any = "01";
    public addItemName: any = "";
    public addInvestmentPropertyCode: any = null;
    public addItemDescription: any = "";
    public addCurrencyCode: any = "";
    public addUndefined1: any = "";
    public addUndefined2: any = "";
    public addUndefined3: any = "";
    public addUndefined4: any = "";
    public addUndefined5: any = "";
    public addQuantity: any = "";
    public addPrice: any = "";
    public addPlanBudget: any = "";
    public addBudgetComment: any = "";
    public addAuthor: any = "";

    public addWbsFlag: any = "";
    public addVppsLevelFullFlag: any = "";
    public addPartDescriptionFlag: any = "";
    public addOrderNumberFlag: any = "";
    public addPartTypeFlag: any = "";
    public addModLevelFlag: any = "";
    public addSmtFlag: any = "";
    public addPcsMemoFlag: any = "";
    public addDesignNumberFlag: any = "";
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
                this.msgservice.showInfo(data["msg"]);
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