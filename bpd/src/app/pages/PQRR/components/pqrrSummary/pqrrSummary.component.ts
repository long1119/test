import { Component, OnInit } from '@angular/core';
import 'style-loader!./pqrrSummary.scss';
import { SelectItem, TreeNode, MenuItem, ConfirmationService } from 'primeng/primeng';
import { HttpDataService } from '../../../service/http.service';
import { MessageService } from '../../../service/message.service';
import { DataManageService } from '../../../service/dataManage.service';

@Component({
  selector: 'pqrr-summary',
  templateUrl: './pqrrSummary.html',
  providers: [HttpDataService, MessageService, DataManageService, ConfirmationService]
})
export class PqrrSummary implements OnInit{

    public msgs: any;

    public gridStore: any = [];

    public gridStoreLen: number;

    public gridStoreRows: any = '15';

    public gridStoreFirst: any = 0;

    public selectedStore: any = [];

    public statusStore: any = [];

    public lookUpDisplay: boolean = false;

    public programCodeSearch: string = null;

    public commentDisplay: boolean = false;

    public commentParams: any;

    public comment: string = null;

    public scheduleStore: any = [];

    public setDateDisplay: boolean = false;

    public scheduleParams: any;

    public PQRRDate: any = null;

    public ReviewDate: any = null;

    public REPQRRDate: any = null;

    public preReviewSatusStore: any = [{'label':'Sel','value':1},{'label':'Yellow','value':2},{'label':'Red','value':3}];

    public summaryStore: any = [];

    public scheduleSave: any = [];

    public userRoot: boolean = true;
    
    public yearRange: string;

    public growLife: number = 5000;

	constructor(private service: HttpDataService, private confirmationService: ConfirmationService, private msgservice: MessageService, private dataManageService: DataManageService) {
        // 日期年份设置
        let currentYear = new Date().getFullYear();
        this.yearRange = "" + (Number(currentYear) - 10) + ":" + (Number(currentYear) + 50);
	}
    
    ngOnInit() {
        this.service.post("/bpd-proj/bpd/quality/showYearAndCode",{
            "page": {
                "page": 1,
                "rows": 15
            },
            'programCode': this.programCodeSearch
        })
        .subscribe(data1 => {
            this.getMainAjax(data1);
        })
    }

    public getMainAjax(data1) {
        let data = data1.rows;
        this.gridStoreLen = data1.total;
        this.gridStore = [];
        for(let i = 0; i < 15; i++) {
            if(!data[i]) {
                this.gridStore.push({
                    "ip": i
                })
            } else {
                this.gridStore.push(data[i])
            }
        }
        if(data.length) {
            this.selectedStore = data[0];
            this.service.get("/bpd-proj/bpd/quality/getPQM?adProjectCode="+this.selectedStore.adProjectCode)
            .subscribe(data => {
                if(data.indexOf(window.localStorage.getItem("user")) != -1) {
                    this.userRoot = true;
                } else {
                    this.userRoot = false; 
                }
            })
            this.getMyPqrr();
        }
    }

    public getMyPqrr() {
        this.service.post("/bpd-proj/bpd/quality/showMyPqrr",{
            'adProjectCode': this.selectedStore.adProjectCode
        })
        .subscribe(data => {
            this.statusStore = [];
            if(data.length < 15) {
                for(let i = 0; i < 15; i++) {
                    if(!data[i]) {
                        this.statusStore.push({
                            "ip": i+1
                        })
                    } else {
                        data[i].id = i + 1;
                        data[i].showPreReviewSatus = true;
                        if(data[i].preReviewSatus == "3") {
                            data[i].changePreReviewStatus = true;
                        } else {
                           data[i].changePreReviewStatus = false; 
                        }
                        this.statusStore.push(data[i]);
                    }
                }
            } else {
                for(let i = 0; i < data.length; i++) {
                    data[i].id = i + 1;
                    data[i].showPreReviewSatus = true;
                    if(data[i].preReviewSatus == "3") {
                        data[i].changePreReviewStatus = true;
                    } else {
                       data[i].changePreReviewStatus = false; 
                    }
                    this.statusStore.push(data[i]);
                }
            }
            if(this.statusStore.length) {
                if(this.statusStore[0].id) {
                    this.service.get("/bpd-proj/bpd/quality/selectAllPQRRByQualityId?qualityId="+this.statusStore[0].qualityId+"&"+Number(new Date()))
                    .subscribe(data => {
                        this.scheduleStore = data;
                        for(let i=0; i<data.length; i++) {
                            this.scheduleStore[i].id = i+1;
                        }
                    })
                } else {
                    this.scheduleStore = [];
                }
            } else {
                this.scheduleStore = [];
            }
        })
    }

    public paginate(e) {    //  主表分页
        this.service.post("/bpd-proj/bpd/quality/showYearAndCode",{
            "page": {
                "page": e.page + 1,
                "rows": e.rows
            },
            'programCode': this.programCodeSearch
        })
        .subscribe(data1 => {
            let data = data1.rows;
            this.gridStoreLen = data1.total;
            this.gridStoreRows = e.rows;
            this.gridStoreFirst = e.first;
            this.gridStore = [];
            for(let i = 0; i < e.rows; i++) {
                if(!data[i]) {
                    this.gridStore.push({
                        "ip": i
                    })
                } else {
                    this.gridStore.push(data[i])
                }
            }
            if(data.length) {
                this.selectedStore = data[0];
                this.service.get("/bpd-proj/bpd/quality/getPQM?adProjectCode="+this.selectedStore.adProjectCode)
                .subscribe(data => {
                    if(data.indexOf(window.localStorage.getItem("user")) != -1) {
                        this.userRoot = true;
                    } else {
                        this.userRoot = false; 
                    }
                })
                this.getMyPqrr();
            }
        })
    }

    public lookUpBtn() {    // 模糊查询按钮
        this.programCodeSearch = null;
        this.lookUpDisplay = true;

    }

    public lookUpSaveBtn() {    // 模糊查询确认按钮
        let e = {page: 0, first: 0, rows: "15"};
        this.paginate(e);
        this.lookUpDisplay = false;
    }

    public lookUpCancelBtn() {   //  模糊查询取消按钮
        this.lookUpDisplay = false;
    }

    public programGridRowClick(e) {  // 主表点击行
        console.log(e)
        if(!e.data.ip) {
            this.selectedStore = e.data
        }

        this.service.get("/bpd-proj/bpd/quality/getPQM?adProjectCode="+this.selectedStore.adProjectCode)
        .subscribe(data => {
            if(data.indexOf(window.localStorage.getItem("user")) != -1) {
                this.userRoot = true;
            } else {
                this.userRoot = false; 
            }
        })
        this.getMyPqrr();
    }

    public tabIndex: number = 0;
    public handleChange(e) {    // tab页切换
        if(e.index == 0) {
            this.tabIndex = 0;
        } else if(e.index == 1) {
            this.tabIndex = 1;
            if(this.statusStore.length) {
                if(this.statusStore[0].id) {
                    this.service.get("/bpd-proj/bpd/quality/selectAllPQRRByQualityId?qualityId="+this.statusStore[0].qualityId+"&"+Number(new Date()))
                    .subscribe(data => {
                        this.scheduleStore = data;
                        for(let i=0; i<data.length; i++) {
                            this.scheduleStore[i].id = i+1;
                        }
                    })
                } else {
                    this.scheduleStore = [];
                }
            }
        }
    }

    public pqrrChange(e,item) {
        item.showPreReviewSatus = false;
    }

    public prepqrrChange(e,item) {
        item.changePreReviewStatus = false;
    }

    public changeColor(item) {  //change color
        if(item.deleteFlag != '1' && !item.showPreReviewSatus) {
            item.pqrrStatus = 4;
            // item.preReviewSatus = 0;
        }
    }

    public changePreColor(item) {  //change pre color
        if(item.deleteFlag != '1' || item.changePreReviewStatus) {
            item.preReviewSatus = 4;
        }
    }

    public changeDelivColor(item) {  // change deliv color
        item.status = 0;
    }

    public setSuggestionDisplay: boolean = false;
    public suggestion: string = "";
    public suggestionE: number = 0;
    public suggestionItem: any = {}; 
    public selectionChange(e,item) {
        if(e.value == 2 || e.value == 3) {
            this.suggestion = item.subject;
            this.setSuggestionDisplay = true;
            this.suggestionE = e.value;
            this.suggestionItem = item;
        } else {
            this.service.post("/bpd-proj/bpd/delivAgentDeatil/delivAgentDeatils",[{
                delivAgentDeatilId: item.delivAgentDeatilId,
                status: e.value
            }])
            .subscribe(data => {
                if(data['code'] == 1) {
                    this.growLife = 5000;
                    this.msgservice.showSuccess("Success");
                    this.msgs = this.msgservice.msgs;
                    this.service.post("/bpd-proj/bpd/delivAgentDeatil/getDelivAgentDeatil",{
                        deptId: this.toDeptDeptId,
                        pqrrMilestoneName: this.pqrrStatusItem.pqrrMilestoneName,
                        adProjectCode: this.pqrrStatusItem.adProjectCode
                    })
                    .subscribe(data => {
                        this.Deliverables = [];
                        if(data.length < 10) {
                            for(let i = 0; i < 10; i++) {
                                if(!data[i]) {
                                    this.Deliverables.push({
                                        "ip": i+1
                                    })
                                } else {
                                    data[i].id = i + 1;
                                    this.Deliverables.push(data[i])
                                }
                            }
                        } else {
                            for(let i = 0; i < data.length; i++) {
                                data[i].id = i + 1;
                                this.Deliverables.push(data[i]);
                            }
                        }
                    })
                } else {
                    this.growLife = 999999;
                    this.msgservice.showInfo(data['businessData']);
                    this.msgs = this.msgservice.msgs;
                }
            })
        }
    }

    public setSuggestionSaveBtn() {
        this.service.post("/bpd-proj/bpd/delivAgentDeatil/delivAgentDeatils",[{
            delivAgentDeatilId: this.suggestionItem.delivAgentDeatilId,
            status: this.suggestionE,
            subject: this.suggestion
        }])
        .subscribe(data => {
            if(data['code'] == 1) {
                this.growLife = 5000;
                this.msgservice.showSuccess("Success");
                this.msgs = this.msgservice.msgs;
                this.setSuggestionDisplay = false;
                this.service.post("/bpd-proj/bpd/delivAgentDeatil/getDelivAgentDeatil",{
                    deptId: this.toDeptDeptId,
                    pqrrMilestoneName: this.pqrrStatusItem.pqrrMilestoneName,
                    adProjectCode: this.pqrrStatusItem.adProjectCode
                })
                .subscribe(data => {
                    this.Deliverables = [];
                    if(data.length < 10) {
                        for(let i = 0; i < 10; i++) {
                            if(!data[i]) {
                                this.Deliverables.push({
                                    "ip": i+1
                                })
                            } else {
                                data[i].id = i + 1;
                                this.Deliverables.push(data[i])
                            }
                        }
                    } else {
                        for(let i = 0; i < data.length; i++) {
                            data[i].id = i + 1;
                            this.Deliverables.push(data[i]);
                        }
                    }
                })
            } else {
                this.growLife = 999999;
                this.msgservice.showInfo(data['businessData']);
                this.msgs = this.msgservice.msgs;
            }
        })
    }

    public setSuggestionCancelBtn() {
        this.suggestionItem.status = 0;
        this.setSuggestionDisplay = false;
    }

    public submitBtn(item) {    // submit
        this.confirmationService.confirm({
          message: 'Are You Confirm PQRR Status?',
          header: 'Information Confirm',
          icon: 'fa fa-warning',
          accept: () => {
            if(item.pqrrStatus == 4) {
                this.growLife = 999999;
                this.msgservice.showInfo("Please Set PQRR Status");
                this.msgs = this.msgservice.msgs;
                return;
            }
            if(item.pqrrStatus == 3) {
                if(!item.rePqrrDate) {
                    this.growLife = 999999;
                    this.msgservice.showInfo("Please Set Re-PQRR Date");
                    this.msgs = this.msgservice.msgs;
                    return; 
                }
                if(new Date(item.rePqrrDate).getTime() < new Date(item.pqrrDate).getTime()) {
                    this.growLife = 999999;
                    this.msgservice.showInfo("Re-PQRR Date Must Longer Than PQRR Date");
                    this.msgs = this.msgservice.msgs;
                    return; 
                }
            }
            this.service.post("/bpd-proj/bpd/quality/updateMyPQRR",{
                "qualityId": item.qualityId,
                "pqrrDate" : item.pqrrDate,
                "rePqrrDate" : this.DateToString(item.rePqrrDate),
                "pqrrStatus" : item.pqrrStatus,
                "preReviewSatus": item.preReviewSatus,
                "pqrrMilestoneName": item.pqrrMilestoneName,
                "adProjectCode": this.selectedStore.adProjectCode
            })
            .subscribe(data => {
                if(data['code'] == 1) {
                    this.growLife = 5000;
                    this.msgservice.showSuccess("Success");
                    this.msgs = this.msgservice.msgs;
                    this.getMyPqrr();
                } else if(data['code'] == 2){
                    this.growLife = 999999;
                    this.msgservice.showInfo(data['businessData']);
                    this.msgs = this.msgservice.msgs;
                } else {
                    this.growLife = 999999;
                    this.msgservice.showError(data['businessData']);
                    this.msgs = this.msgservice.msgs;
                }
            })
          }
        });
    }

    public selectDeptDialog:boolean = false;
    public deptStore: any = [];
    public selectedDeptValue: any = [];
    public returnItem: any = {};

    public returnBtn(item) {  // return
        this.confirmationService.confirm({
          message: 'Are You Return PQRR Status?',
          header: 'Information Confirm',
          icon: 'fa fa-warning',
          accept: () => {
            this.returnItem = item;
            this.service.post("/bpd-proj/bpd/delivAgent/getList",{
                "adProjectCode": item.adProjectCode,
                "pqrrMilestoneName": item.pqrrMilestoneName
            })
            .subscribe(data => {
                this.deptStore = data;
                this.selectDeptDialog = true;
                this.getMyPqrr();
            })
          }
        });
    }

    public selectDeptSaveBtn() {
        this.service.post("/bpd-proj/bpd/delivAgent/return1",{
            adProjectCode: this.returnItem.adProjectCode,
            pqrrMilestoneName: this.returnItem.pqrrMilestoneName,
            deptName: this.selectedDeptValue.join(",")
        })
        .subscribe(data => {
            if(data['code'] == 1) {
                this.growLife = 5000;
                this.msgservice.showSuccess("Success");
                this.msgs = this.msgservice.msgs;
                this.selectDeptDialog = false;
            } else {
                this.growLife = 999999;
                this.msgservice.showInfo(data['businessData']);
                this.msgs = this.msgservice.msgs;
            }
        })
    }

    public pqrrStatusItem: any;

    public showSummary(item) {    //  showSummary
        this.pqrrStatusItem = item;
        this.commentDisplay = true;
        this.service.post("/bpd-proj/bpd/delivAgentDeatil/showWithDept",{
            "adProjectCode": item.adProjectCode,
            "pqrrMilestoneName": item.pqrrMilestoneName
        })
        .subscribe(data => {
            this.summaryStore = data;
        })
    }

    //  时间校验
    public minPQRRDate: any;
    public minPreDate: any;
    public minReDate: any;
    public minToday: any;
    public scheduleEditBtn(item) {
        this.scheduleParams = item;
        this.PQRRDate = item.pqrrDate;
        this.ReviewDate = item.preReviewDate;
        this.REPQRRDate = item.rePqrrDate;
        this.setDateDisplay = true;
        this.minPQRRDate = new Date(item['planDate']);
        this.minToday = new Date();
        this.minPreDate = item.pqrrDate ? new Date(item['pqrrDate']) : new Date(item['planDate']);
        if(item.preReviewDate) {
            this.minReDate = new Date(item.preReviewDate);
            return;
        } else if(item.rePqrrDate) {
            this.minReDate = new Date(item.rePqrrDate);
            return;
        } else if(item.pqrrDate) {
            this.minReDate = new Date(item.pqrrDate);
            return;
        } else {
            this.minReDate = new Date(item.planDate);
            return;
        }
    }

    public pqrrDateBlur(value) {
        if(this.PQRRDate > this.minPreDate) {
            this.minPreDate = this.PQRRDate;
            if(this.PQRRDate > this.minReDate) {
                this.minReDate = this.PQRRDate;
            }
        }
    }

    public preDateBlur(value) {
        if(this.ReviewDate > this.minReDate) {
            this.minReDate = this.ReviewDate;
        }
    }

    public DateToString(val) {
        let valStr = '';
        if(!val) {
           return valStr; 
        }
        if(val.toString().length > 19){
            let year = val.getFullYear();
            let month = val.getMonth() + 1;
            let day = val.getDate();
            valStr = year + '-' + month + '-' + day;
        } else {
            valStr = val;
        }
        return valStr;
    }

    public setDateSaveBtn() {
        let params = {
            "pqrrDate" : this.DateToString(this.PQRRDate),
            "preReviewDate" : this.DateToString(this.ReviewDate),
            "rePqrrDate" : this.DateToString(this.REPQRRDate),
            "qualityId" : this.scheduleParams.qualityId
        }
        this.service.post("/bpd-proj/bpd/quality/updateAllPQRRDate",[params])
        .subscribe(data => {
            if(data['code'] == 1) {
                this.growLife = 5000;
                this.msgservice.showSuccess("Success");
                this.msgs = this.msgservice.msgs;
                this.scheduleParams.pqrrDate = this.DateToString(this.PQRRDate);
                this.scheduleParams.preReviewDate = this.DateToString(this.ReviewDate);
                this.scheduleParams.rePqrrDate = this.DateToString(this.REPQRRDate);
                this.setDateDisplay = false;
            } else {
                this.growLife = 999999;
                this.msgservice.showInfo(data['businessData']);
                this.msgs = this.msgservice.msgs;
            }
        })
    }

    public scheduleSaveBtn() {
        
    }

    public setDateCancelBtn() {
        this.setDateDisplay = false;
    }

    public programCodeStr: string = null;

    public pqrrMilestoneNameStr: string = null;

    public toDeptDeptId: string = null;

    public toDept(e) {
        this.toDeptDeptId = e.target.innerText;
        this.programCodeStr = this.selectedStore.programCode;
        this.pqrrMilestoneNameStr = this.pqrrStatusItem.pqrrMilestoneName;
        this.service.post("/bpd-proj/bpd/delivAgentDeatil/getDelivAgentDeatil",{
            deptId: e.target.innerText,
            pqrrMilestoneName: this.pqrrStatusItem.pqrrMilestoneName,
            adProjectCode: this.pqrrStatusItem.adProjectCode
        })
        .subscribe(data => {
            this.Deliverables = [];
            if(data.length < 10) {
                for(let i = 0; i < 10; i++) {
                    if(!data[i]) {
                        this.Deliverables.push({
                            "ip": i+1
                        })
                    } else {
                        data[i].id = i + 1;
                        this.Deliverables.push(data[i])
                    }
                }
            } else {
                for(let i = 0; i < data.length; i++) {
                    data[i].id = i + 1;
                    this.Deliverables.push(data[i]);
                }
            }
        })
        this.getDeliverablesTable();
        this.setStatus = true;
    }

    public getDeliverablesTable() {
        this.service.post("/bpd-proj/bpd/delivAgent/getDelivFile",{
            "adProjectCode": this.pqrrStatusItem.adProjectCode,
            "deptName": this.toDeptDeptId,
            "pqrrMilestoneName": this.pqrrStatusItem.pqrrMilestoneName
        }).subscribe(data => {
            this.DeliverablesTable = [];
            if(data.length < 2) {
                if(data.length) {
                    for(let i = 0; i < 2; i++) {
                        if(!data[i]) {
                            this.DeliverablesTable.push({
                                "ip": i+1
                            })
                        } else {
                            data[i].id = i + 1;
                            this.DeliverablesTable.push(data[i])
                        }
                    }
                } else {
                    this.DeliverablesTable = data;
                }
            } else {
                for(let i = 0; i < data.length; i++) {
                    data[i].id = i + 1;
                    this.DeliverablesTable.push(data[i]);
                }
            }
        })
    }

    public setStatusHide() {
        this.setStatus = false;
        this.getMyPqrr();
        this.service.post("/bpd-proj/bpd/delivAgentDeatil/showWithDept",{
            "adProjectCode": this.pqrrStatusItem.adProjectCode,
            "pqrrMilestoneName": this.pqrrStatusItem.pqrrMilestoneName
        })
        .subscribe(data => {
            this.summaryStore = data;
        })
    }

    //  dept dialog
    public setStatus:boolean = false;

    public Deliverables:any[];

    public DeliverablesTable:any[];

    public downloadFileTpl(item){
        this.service.get("/bpd-proj/bpd/att/downloadFiles?attIds="+item.deptName)
        .subscribe(data => {
            if(data['code'] == 0) {
                this.growLife = 999999;
                this.msgservice.showInfo("Can Not Find File!");
                this.msgs = this.msgservice.msgs; 
            } else {
                let token = window.sessionStorage.getItem("access_token");
                let url: string = "/bpd-proj/bpd/att/downloadFiles?attIds="+item.deptName+ '&_=' + Number(new Date());
                if (token) {
                    let realToken = token.substr(1, token.length - 2)
                    url = url + "&accessToken=" + realToken;
                }
                window.location.href = url;
            }
        })
    }

    public downloadFile(item){
        this.service.get("/bpd-proj/bpd/att/downloadFiles?attIds="+item.attId)
        .subscribe(data => {
            if(data['code'] == 0) {
                this.growLife = 999999;
                this.msgservice.showInfo("Can Not Find File!");
                this.msgs = this.msgservice.msgs; 
            } else {
                let token = window.sessionStorage.getItem("access_token");
                let url: string = "/bpd-proj/bpd/att/downloadFiles?attIds="+item.attId+ '&_=' + Number(new Date());
                if (token) {
                    let realToken = token.substr(1, token.length - 2)
                    url = url + "&accessToken=" + realToken;
                }
                window.location.href = url;
            }
        })
    }

    public UuId: any = null;
    public uploadDelivItem: any;
    public uploadDeliv(item,e) {
        this.uploadDelivItem = item;
        this.UuId = this.dataManageService.getUuId();
        this.uploadURL = "/bpd-proj/bpd/att/upload?attId="+this.UuId+"&bussinessId="+item.delivAgentId + "&" + Number(new Date());
        this.addDialog = true;
    }

    public delDeliv(item,e) {
        this.confirmationService.confirm({
          message: 'Do You Want To Delete This Record?',
          header: 'Delete Confirmation',
          icon: 'fa fa-trash',
          accept: () => {
            this.service.get("/bpd-proj/bpd/att/delete?attIds="+item.deptName+"&"+Number(new Date()))
            .subscribe(data => {
                if(data['code'] == 1) {
                    this.service.post("/bpd-proj/bpd/delivAgent/update",{
                        adProjectCode: item.adProjectCode,
                        delivAgentId: item.delivAgentId,
                        pqrrMilestoneName: item.pqrrMilestoneName,
                        uploadStatus: '0'
                    })
                    .subscribe(data => {
                        this.growLife = 5000;
                        this.msgservice.showSuccess("Success");
                        this.msgs = this.msgservice.msgs;
                        this.getDeliverablesTable();
                    })
                } else {
                    this.growLife = 999999;
                    this.msgservice.showError("Operation Error!");
                    this.msgs = this.msgservice.msgs; 
                }
            })
          }
        });
    }

    // upload File

    public addDialog: boolean = false;

    public messageDialog: boolean = false;

    public messageData: any = [];

    public uploadURL: string = '/bpd-proj/bpd/quality/addAtt?attId='+this.UuId+'&type=PQRR';

    onBasicUpload($event) {
        let response = eval('(' + $event.xhr.response + ')');
        if(response['code'] == 1) {
            this.addDialog = false;
            this.service.get('/bpd-proj/bpd/quality/addAtt?attId='+this.UuId+'&type=PQRR')
            .subscribe(data => {
                this.service.post("/bpd-proj/bpd/delivAgent/update",{
                    adProjectCode: this.uploadDelivItem.adProjectCode,
                    delivAgentId: this.uploadDelivItem.delivAgentId,
                    pqrrMilestoneName: this.uploadDelivItem.pqrrMilestoneName,
                    uploadStatus: '1'
                })
                .subscribe(data => {
                    this.growLife = 5000;
                    this.msgservice.showSuccess("Success");
                    this.msgs = this.msgservice.msgs;
                    this.getDeliverablesTable();
                })
            })
        } else {
            this.growLife = 999999;
            this.msgservice.showError(response.msg);
            this.msgs = this.msgservice.msgs;
            this.addDialog = false;
        }
    }
};