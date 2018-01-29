import { Component, OnInit } from '@angular/core';
import 'style-loader!./costBook.scss';
import { SelectItem, TreeNode, MenuItem } from 'primeng/primeng';
import { HttpDataService } from '../../../service/http.service';
import { MessageService } from '../../../service/message.service';

@Component({
  selector: 'cost-book',
  templateUrl: './costBook.html',
  providers: [HttpDataService, MessageService]
})
export class CostBook implements OnInit{

    public step: number = 1;

    public msgs: any;

    public projectTypeSerchStore: any = [];

    public projectTypeSerch: string = '';

    public projectCodeSerch: string = '';

    public gridStore: any = [];

    public gridStoreLen: number;

    public gridStoreRows: any = '15';

    public gridStoreFirst: any = 0;

    public gridStorePage: any = 0;

    public selectedStore: any = [];

    public sapItemName: string = '';

    public sapWbsCode: string = '';

    public wbsStore: any = [];

    public wbsStoreLen: number;

    public wbsStoreRows: any = '10';

    public wbsStoreFirst: any = 0;

    public wbsStorePage: any = 0;

    public ExportSAPDialog: boolean = false;

    public SAPData: any = [];

    public SAPgridStoreLen: number;

    public WbsIdDialog: string = '';

    public WbsDescriptionDialog: string = '';

    public selectInvestmentDialog: boolean = false;

    public switchProjprojectTypeSerchStore: any = [];

    public switchProjprojectTypeSerch: string = '';

    public switchProjprojectCodeSerch: string = '';

    public switchProjData: any = [];

    public SPgridStoreLen: number;

    public addDialog: boolean = false;

    public messageDialog: boolean = false;

    public messageData: any = [];

    public uploadURL: string = '/bpd-proj/bpd/projectCostBook/importExcel';

    public userRoot: boolean = true;

    public totalAmount: any = "Current Budget " + 0;

    public ReleasedBudget: any = "Released Budget " + 0;

    public PRCommitted: any = "PR Committed " + 0;

    public POCommitted: any = "PO Committed " + 0;

    public ActualCost: any = "Actual Cost " + 0;

    public TotalCost: any = "Total Cost " + 0;

    public BalRelBud: any = "Bal.Rel.Bud. " + 0;

    public Forecast: any = "Forecast " + 0;

    public CloseActual: any = "Close Actual " + 0;

    public checked: boolean = true;

	constructor(private service: HttpDataService, private msgservice: MessageService) {
	}
    
    ngOnInit() {
        if(!JSON.parse(window.localStorage.getItem("authorityData"))["Generate Project Costbook"] || 
            JSON.parse(window.localStorage.getItem("authorityData"))["Generate Project Costbook"] == 'false')
        {
            this.userRoot = false;
        }
        this.service.post("/bpd-proj/bpd/projectType/getPTCombobox",{})
        .subscribe(data => {
            this.projectTypeSerchStore = [];
            for(let i=0; i<data.length; i++) {
                if(data[i].value != 100) {
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
                "rows": 15
            },
            "projectType": this.projectTypeSerch,
            "projectCode": this.projectCodeSerch,
            "costBookFlag": "1",
            "projectManager": this.checked ? window.localStorage.getItem("user") : null
        })
        .subscribe(data1 => {
            this.gridStoreAjax(data1);
        })
    }

    public checkedChange() {
        this.ngOnInit();
    }

    public projectCodeEnterSearch($event) { //回车模糊查询
        if ($event.key === "Enter") {
            this.lookUpBtn();
        }
    }

    public lookUpBtn() {     //模糊搜索
        let e = {
            page: 0, 
            first: 0, 
            rows: "15"
        }
        this.paginate(e);
    }

    public gridStoreAjax(data1) {
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

    public paginate(e) {        // 主表格分页
        this.service.post("/bpd-proj/bpd/allProjInfo/getByTypeCode",{
            "page": {
                "page": e.page + 1,
                "rows": e.rows
            },
            "projectType": this.projectTypeSerch,
            "projectCode": this.projectCodeSerch,
            "costBookFlag": "1"
        })
        .subscribe(data1 => {
            this.gridStore = [];
            this.gridStoreLen = data1.total;
            this.gridStoreRows = e.rows;
            this.gridStoreFirst = Number(e.first);
            this.gridStorePage = e.page;
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
        })
    }

    public haveData: boolean = true;
    public regionCategorySearch: string = "";

    public toStep2Btn(item) {      //页面跳转第二步
        this.selectedStore = item;
        this.step = 2;
        this.service.get("/bpd-proj/bpd/projectCostBook/getCostBookBudgetCombobox?adProjectCode="+this.selectedStore.projectCode+"&"+Number(new Date()))
        .subscribe(data => {
            if(data.length) {
                this.budgetVersionValueStore = data;
                this.budgetVersionValue = data[0].value;
            }
        })
        this.service.get("/bpd-proj/bpd/projectCostBook/getCostBookBudgetCombobox?adProjectCode="+this.selectedStore.projectCode+"&"+Number(new Date()))
        .subscribe(data => {
            if(data.length) {
                this.budgetVersionValue = data[0].value;
                this.service.post("/bpd-proj/bpd/projectCostBook/getAllInfo",{
                    "page": {
                        "page": 1,
                        "rows": 10
                    },
                    "projectId" : this.selectedStore.projectCode,
                    "sapWbsDescription" : this.sapItemName,
                    "regionCategoryNameEnglish": this.regionCategorySearch,
                    "sapWbsCode" : this.sapWbsCode,
                    "budgetVersionName": this.budgetVersionValue
                })
                .subscribe(data1 => {
                    this.wbsStore = [];
                    this.wbsStoreLen = data1.total;
                    let data = data1.rows
                    for(let i = 0; i < data.length; i++) {
                        data[i].id = i + 1;
                        data[i].regionCategoryNameBrief = (data[i].regionCategoryName && data[i].regionCategoryName.length>6)  ? data[i].regionCategoryName.substr(0,6)+"..." : data[i].regionCategoryName;
                        data[i].sapWbsDescriptionBrief = (data[i].sapWbsDescription && data[i].sapWbsDescription.length>10)  ? data[i].sapWbsDescription.substr(0,10)+"..." : data[i].sapWbsDescription;
                    }
                    for(let i = 0; i < 10; i++) {
                        if(!data[i]) {
                            this.wbsStore.push({
                                "ip": i+1
                            })
                        } else {
                            this.wbsStore.push(data[i])
                        }
                    }
                    if(this.wbsStore[0].id) {
                        this.haveData = false;
                    } else {
                        this.haveData = true;
                    }
                })
                this.getAmount();
            } else {
                this.service.post("/bpd-proj/bpd/projectCostBook/getAllInfo",{
                    "page": {
                        "page": 1,
                        "rows": 10
                    },
                    "projectId" : this.selectedStore.projectCode,
                    "sapWbsDescription" : this.sapItemName,
                    "regionCategoryNameEnglish": this.regionCategorySearch,
                    "sapWbsCode" : this.sapWbsCode,
                    "budgetVersionName": ""
                })
                .subscribe(data1 => {
                    this.wbsStore = [];
                    this.wbsStoreLen = data1.total;
                    let data = data1.rows
                    for(let i = 0; i < data.length; i++) {
                        data[i].id = i + 1;
                        data[i].regionCategoryNameBrief = (data[i].regionCategoryName && data[i].regionCategoryName.length>6)  ? data[i].regionCategoryName.substr(0,6)+"..." : data[i].regionCategoryName;
                        data[i].sapWbsDescriptionBrief = (data[i].sapWbsDescription && data[i].sapWbsDescription.length>10)  ? data[i].sapWbsDescription.substr(0,10)+"..." : data[i].sapWbsDescription;
                    }
                    for(let i = 0; i < 10; i++) {
                        if(!data[i]) {
                            this.wbsStore.push({
                                "ip": i+1
                            })
                        } else {
                            this.wbsStore.push(data[i])
                        }
                    }
                    if(this.wbsStore[0].id) {
                        this.haveData = false;
                    } else {
                        this.haveData = true;
                    }
                })
                this.getAmount();
            }
        })
    }

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

    public getAmount() {
        this.service.post("/bpd-proj/bpd/projectCostBook/getAllInfo",{
            "page": {
                "page": 1,
                "rows": 100000
            },
            "projectId" : this.selectedStore.projectCode,
            "sapWbsDescription" : this.sapItemName,
            "regionCategoryNameEnglish": this.regionCategorySearch,
            "sapWbsCode" : this.sapWbsCode,
            "budgetVersionName": this.budgetVersionValue
        })
        .subscribe(data1 => {
            let data = data1.rows;
            let _number: number = 0;
            let releasedBudgetNumber: number = 0;
            let sapPrCommittedNumber: number = 0;
            let sapPoCommittedNumber: number = 0;
            let sapActualCostNumber: number = 0;
            let sapTotalCostNumber: number = 0;
            let sapBalanceReleaseedBudgetNumber: number = 0;
            let sapBudgetForecastNumber: number = 0;
            let sapCloseActualNumber: number = 0; 
            for(let i = 0; i < data.length; i++) {
                if(data[i].sapCurrentBudget) {
                    _number += data[i].sapCurrentBudget
                }
                if(data[i].sapReleasedBudget) {
                    releasedBudgetNumber += data[i].sapReleasedBudget
                }
                if(data[i].sapPrCommitted) {
                    sapPrCommittedNumber += data[i].sapPrCommitted
                }
                if(data[i].sapPoCommitted) {
                    sapPoCommittedNumber += data[i].sapPoCommitted
                }
                if(data[i].sapActualCost) {
                    sapActualCostNumber += data[i].sapActualCost
                }
                if(data[i].sapTotalCost) {
                    sapTotalCostNumber += data[i].sapTotalCost
                }
                if(data[i].sapBalanceReleaseedBudget) {
                    sapBalanceReleaseedBudgetNumber += data[i].sapBalanceReleaseedBudget
                }
                if(data[i].sapBudgetForecast) {
                    sapBudgetForecastNumber += data[i].sapBudgetForecast
                }
                if(data[i].sapCloseActual) {
                    sapCloseActualNumber += data[i].sapCloseActual
                }
            }
            this.totalAmount = "Current Budget " + " (¥" + this.transform(_number) + ")";
            this.ReleasedBudget = "Released Budget " + " (¥" + this.transform(releasedBudgetNumber) + ")";
            this.PRCommitted = "PR Committed " + " (¥" + this.transform(sapPrCommittedNumber) + ")";
            this.POCommitted = "PO Committed " + " (¥" + this.transform(sapPoCommittedNumber) + ")";
            this.ActualCost = "Actual Cost " + " (¥" + this.transform(sapActualCostNumber) + ")";
            this.TotalCost = "Total Cost " + " (¥" + this.transform(sapTotalCostNumber) + ")";
            this.BalRelBud = "Bal.Rel.Bud. " + " (¥" + this.transform(sapBalanceReleaseedBudgetNumber) + ")";
            this.Forecast = "Forecast " + " (¥" + this.transform(sapBudgetForecastNumber) + ")";
            this.CloseActual = "Close Actual " + " (¥" + this.transform(sapCloseActualNumber) + ")";
        })
    }

    public wbsPaginate(e) {        // 表格分页
        this.service.post("/bpd-proj/bpd/projectCostBook/getAllInfo",{
            "page": {
                "page": e.page + 1,
                "rows": e.rows
            },
            "projectId" : this.selectedStore.projectCode,
            "sapWbsDescription" : this.sapItemName,
            "regionCategoryNameEnglish": this.regionCategorySearch,
            "sapWbsCode" : this.sapWbsCode,
            "budgetVersionName": this.budgetVersionValue
        })
        .subscribe(data1 => {
            this.wbsStore = [];
            this.wbsStoreLen = data1.total;
            this.wbsStoreRows = e.rows;
            this.wbsStoreFirst = Number(e.first);
            this.wbsStorePage = e.page;
            let data = data1.rows
            for(let i = 0; i < data.length; i++) {
                data[i].id = i + 1;
                data[i].regionCategoryNameBrief = (data[i].regionCategoryName && data[i].regionCategoryName.length>6)  ? data[i].regionCategoryName.substr(0,6)+"..." : data[i].regionCategoryName;
                data[i].sapWbsDescriptionBrief = (data[i].sapWbsDescription && data[i].sapWbsDescription.length>10)  ? data[i].sapWbsDescription.substr(0,10)+"..." : data[i].sapWbsDescription;
            }
            for(let i = 0; i < e.rows; i++) {
                if(!data[i]) {
                    this.wbsStore.push({
                        "ip": i+1
                    })
                } else {
                    this.wbsStore.push(data[i])
                }
            }
        })
        this.getAmount();
    }

    public sapItemEnterSearch($event) { //回车模糊查询
        if ($event.key === "Enter") {
            this.step2LookUpBtn();
        }
    }

    public step2LookUpBtn() {    // 第二步模糊查询
        let e = {
            page: 0, 
            first: 0, 
            rows: "10"
        }
        this.wbsPaginate(e);
    }

    public ExportSAPBtn() {    // 导出SAP获取列表
        this.ExportSAPDialog = true;
        this.service.post("/bpd-proj/bpd/projectActualCost/getVList",{
            "projectId" : this.selectedStore.projectCode,
            "costBookCode" : this.WbsIdDialog,
            "wbsDescription" : this.WbsDescriptionDialog,
            "budgetVersionName": this.budgetVersionValue,
            "page": {
                "page": 1,
                "rows": 10
            }
        })
        .subscribe(data1 => {
            let data = data1.rows;
            this.SAPgridStoreLen = data1.total;
            this.SAPData = [];
            for(let i = 0; i < 10; i++) {
                if(!data[i]) {
                    this.SAPData.push({
                        "ip": i+1
                    })
                } else {
                    this.SAPData.push(data[i])
                }
            }
        })
    }

    public wbsDescriptionEnterSearch($event) { // 回车模糊查询
        if ($event.key === "Enter") {
            this.dialogLookUpBtn();
        }
    }
    
    public dialogLookUpBtn() {
        this.service.post("/bpd-proj/bpd/projectActualCost/getVList",{
            "projectId" : this.selectedStore.projectCode,
            "costBookCode" : this.WbsIdDialog,
            "wbsDescription" : this.WbsDescriptionDialog,
            "budgetVersionName": this.budgetVersionValue,
            "page": {
                "page": 1,
                "rows": 10
            }
        })
        .subscribe(data1 => {
            let data = data1.rows;
            this.SAPgridStoreLen = data1.total;
            this.SAPData = [];
            for(let i = 0; i < 10; i++) {
                if(!data[i]) {
                    this.SAPData.push({
                        "ip": i+1
                    })
                } else {
                    this.SAPData.push(data[i])
                }
            }
        })
    }

    public SAPpaginate(e) {
        this.service.post("/bpd-proj/bpd/projectActualCost/getVList",{
            "projectId" : this.selectedStore.projectCode,
            "costBookCode" : this.WbsIdDialog,
            "wbsDescription" : this.WbsDescriptionDialog,
            "budgetVersionName": this.budgetVersionValue,
            "page": {
                "page": e.page + 1,
                "rows": e.rows
            }
        })
        .subscribe(data1 => {
            let data = data1.rows;
            this.SAPData = [];
            for(let i = 0; i < e.rows; i++) {
                if(!data[i]) {
                    this.SAPData.push({
                        "ip": i+1
                    })
                } else {
                    this.SAPData.push(data[i])
                }
            }
        })
    }

    public dialogExportBtn() {
        let token = window.sessionStorage.getItem("access_token");
        let url: string = '/bpd-proj/bpd/projectActualCost/exportSAP?projectId='+this.selectedStore.projectCode + '&_=' + Number(new Date());
        if (token) {
            let realToken = token.substr(1, token.length - 2)
            url = url + "&accessToken=" + realToken;
        }
        window.location.href = url;
    }

    public switchProjBtn() {     // 打开switch proj 窗口
        this.selectInvestmentDialog = true;
        this.service.post("/bpd-proj/bpd/projectType/getPTCombobox",{})
        .subscribe(data => {
            this.switchProjprojectTypeSerchStore = [];
            for(let i=0; i<data.length; i++) {
                if(data[i].value != 100) {
                    this.switchProjprojectTypeSerchStore.push({
                        label: data[i].label,
                        value: data[i].value
                    })
                }
            }
            this.switchProjprojectTypeSerchStore.unshift({
                label: 'All',
                value: null
            })
            this.switchProjprojectTypeSerch = null;
        })
        this.service.post("/bpd-proj/bpd/allProjInfo/getByTypeCode",{
            "projectType" : this.switchProjprojectTypeSerch,
            "projectCode" : this.switchProjprojectCodeSerch,
            "page": {
                "page": 1,
                "rows": 10
            },
            "costBookFlag": "1"
        })
        .subscribe(data1 => {
            let data = data1.rows;
            this.SPgridStoreLen = data1.total;
            this.switchProjData = [];
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
                    this.switchProjData.push({
                        "ip": i+1
                    })
                } else {
                    this.switchProjData.push(data[i])
                }
            }
        })

    }

    public projectCodeDialogEnterSearch($event) { //
        if ($event.key === "Enter") {
            this.switchProjdialogLookUpBtn();
        }
    }
    
    public switchProjdialogLookUpBtn() {
        this.service.post("/bpd-proj/bpd/allProjInfo/getByTypeCode",{
            "projectType" : this.switchProjprojectTypeSerch,
            "projectCode" : this.switchProjprojectCodeSerch,
            "page": {
                "page": 1,
                "rows": 10
            },
            "costBookFlag": "1"
        })
        .subscribe(data1 => {
            let data = data1.rows;
            this.SPgridStoreLen = data1.total;
            this.switchProjData = [];
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
                    this.switchProjData.push({
                        "ip": i+1
                    })
                } else {
                    this.switchProjData.push(data[i])
                }
            }
        })
    }

    public SPpaginate(e) {
        this.service.post("/bpd-proj/bpd/allProjInfo/getByTypeCode",{
            "projectType" : this.switchProjprojectTypeSerch,
            "projectCode" : this.switchProjprojectCodeSerch,
            "page": {
                "page": e.page + 1,
                "rows": e.rows
            },
            "costBookFlag": "1"
        })
        .subscribe(data1 => {
            let data = data1.rows;
            this.SPgridStoreLen = data1.total;
            this.switchProjData = [];
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
                    this.switchProjData.push({
                        "ip": i+1
                    })
                } else {
                    this.switchProjData.push(data[i])
                }
            }
        })
    }

    public step2ExportBtn() {
        let token = window.sessionStorage.getItem("access_token");
        let url: string = '/bpd-proj/bpd/projectCostBook/exportExcel?projectId='+this.selectedStore.projectCode +'&budgetVersionName='+ this.budgetVersionValue + '&_=' + Number(new Date());
        if (token) {
            let realToken = token.substr(1, token.length - 2)
            url = url + "&accessToken=" + realToken;
        }
        window.location.href = url;
    }

    public step2ImportBtn() {
        this.uploadURL = '/bpd-proj/bpd/projectCostBook/importExcel';
        this.addDialog = true;
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
            let e = {
                page: 0, 
                first: 0, 
                rows: "10"
            }
            this.wbsPaginate(e);
        }
    }

    public dbclick(event) {
        this.selectedStore = event.data;
        let e = {
            page: 0, 
            first: 0, 
            rows: "10"
        }
        this.wbsPaginate(e);
        this.selectInvestmentDialog = false;
    }

    //  切换版本

    public selectVersionDialog: boolean = false;

    public budgetVersionValueStore: any = [];

    public budgetVersionValue: string = null;

    public switchVersionBtn() {
        this.selectVersionDialog = true;
        this.service.get("/bpd-proj/bpd/projectCostBook/getCostBookBudgetCombobox?adProjectCode="+this.selectedStore.projectCode+"&"+Number(new Date()))
        .subscribe(data => {
            if(data.length) {
                this.budgetVersionValueStore = data;
                this.budgetVersionValue = data[0].value;
            }
        })
    }

    public selectVersionSaveBtn() {
        let e = {
            page: 0, 
            first: 0, 
            rows: "10"
        }
        this.wbsPaginate(e);
        this.selectVersionDialog = false;
    }

    public selectVersionCancelBtn() {
        this.selectVersionDialog = false;
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