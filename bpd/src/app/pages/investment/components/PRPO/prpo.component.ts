import {Component, OnInit} from '@angular/core';
import 'style-loader!./prpo.scss';
import {Message} from 'primeng/primeng';
import {HttpDataService} from '../../../service/http.service';
import {MessageService} from "../../../service/message.service";
import {LocalStorage} from "../../../portal/workPortal/local.storage";
import { DomSanitizer } from '@angular/platform-browser';
@Component({
    selector: 'prpo',
    templateUrl: './prpo.html'
})
export class prpoComponent {
    paginatorPage:number;
    paginatorRow:number;
    totalRecord:number;
    mainTable:any[]=[];
    flag:number;
    display:boolean = false;
    tableName:any;
    displayname:any;

    powerOfModify:any;     
    specialUrl:any;
    specialUrl1:any;
    see:boolean = false;
    // new add 2018/1/13
    nprNo:string;
    title:string;
    status:string;
    processName:string;
    companyName:string;
    deptName:string;
    purchaseType:string;
    expenseType:string;
    projectName:string;
    paginatorPage1:number;
    paginatorRow1:number;
    totalRecord1:number;
    mainTable1:any[]=[];
    nprNo1:string;
    title1:string;
    status1:string;
    processName1:string;
    companyName1:string;
    deptName1:string;
    purchaseType1:string;
    expenseType1:string;
    projectName1:string;
    constructor(private httpService: HttpDataService,private msgService: MessageService,private ls: LocalStorage,private sanitizer: DomSanitizer){
        
    }
    ngOnInit(){
        this.powerOfModify = JSON.parse(this.ls.get('authorityData'))['View PO list'];
        this.paginatorPage = 1;
        this.paginatorRow = 10;
        this.paginatorPage1 = 1;
        this.paginatorRow1 = 10;
        this.gotoPR();
    }
    lookUpEnterSearch($event) {
		if ($event.key === "Enter") {
			this.lookUpBtn();
		}
    }
    lookUpEnterSearch1($event) {
		if ($event.key === "Enter") {
			this.lookUpBtn1();
		}
    }
    lookUpBtn(){
        this.paginatorPage = 1;
        this.paginatorRow = 10;
        this.checkMainTable();
    }
    lookUpBtn1(){
        this.paginatorPage1 = 1;
        this.paginatorRow1 = 10;
        this.checkMainTable1();
    }
    checkMainTable(){
        this.httpService.post("/bpd-proj/bpd/prPo/getPIH",{
            "nprNo":this.nprNo,
            "title":this.title,
            "status":this.status,
            "processName":this.processName,
            "companyName":this.companyName,
            "deptName":this.deptName,
            "purchaseType":this.purchaseType,
            "expenseType":this.expenseType,
            "projectName":this.projectName,
            "page":{
                "page":this.paginatorPage,
                "rows":this.paginatorRow
            }
        }).subscribe(data => {
            this.totalRecord = data.total;
            this.mainTable = data.rows;
            this.mainTable.forEach(function(item){
                item.reasonForSpecifiedBrand1 = (item.reasonForSpecifiedBrand&&item.reasonForSpecifiedBrand.length>8)?(item.reasonForSpecifiedBrand.slice(0,8)+'...'):item.reasonForSpecifiedBrand;
                item.reasonForSingleSource1 = (item.reasonForSingleSource&&item.reasonForSingleSource.length>8)?(item.reasonForSingleSource.slice(0,8)+'...'):item.reasonForSingleSource;
                item.statement1 = (item.statement&&item.statement.length>8)?(item.statement.slice(0,8)+'...'):item.statement;
            })
        })
    }
     checkMainTable1(){
        this.httpService.post("/bpd-proj/bpd/prPo/getPID",{
            "nprNo":this.nprNo1,
            "title":this.title1,
            "status":this.status1,
            "processName":this.processName1,
            "companyName":this.companyName1,
            "deptName":this.deptName1,
            "purchaseType":this.purchaseType1,
            "expenseType":this.expenseType1,
            "projectName":this.projectName1,
            "page":{
                "page":this.paginatorPage1,
                "rows":this.paginatorRow1
            }
        }).subscribe(data => {
            this.totalRecord1 = data.total;
            this.mainTable1 = data.rows;
            this.mainTable1.forEach(function(item){
                item.goodsName1 = (item.goodsName&&item.goodsName.length>8)?(item.goodsName.slice(0,8)+'...'):item.goodsName;
            })
        })
    }
    
    // 分页切换事件
    paginate($event) {
        this.paginatorPage = $event.page + 1;
        this.paginatorRow = $event.rows;
        this.checkMainTable();
      }
      // 分页切换事件
    paginate1($event) {
        this.paginatorPage1 = $event.page + 1;
        this.paginatorRow1 = $event.rows;
        this.checkMainTable1();
      }
    //----------------------------------------------------------------------------------------
    handleChange(e){
        if(e.index==0){
            this.gotoPR();
        }else if(e.index==1){
            this.gotoPO();
        }
        else if(e.index==2){
            this.checkMainTable();
        }
        else{
            this.checkMainTable1();
        }
    }
    gotoPO(){
        // let timestamp = new Date().getTime();
        this.httpService.get("/bpd-proj/bpd/prPo/getPo").
        subscribe(data => {
            // this.specialUrl = this.sanitizer.bypassSecurityTrustResourceUrl(data.url+"?"+"timestamp="+data.timestamp+"&params="+data.poParams.replace(/\&/,'\&')+"&key="+data.poKey);
            this.specialUrl1 = this.sanitizer.bypassSecurityTrustResourceUrl(data);
            // this.specialUrl = data;
        })
    }
    gotoPR(){
        // let timestamp = new Date().getTime();
        this.httpService.get("/bpd-proj/bpd/prPo/getPr").
        subscribe(data => {
            // this.specialUrl = this.sanitizer.bypassSecurityTrustResourceUrl(data.url+"?"+"timestamp="+data.timestamp+"&params="+data.poParams.replace(/\&/,'\&')+"&key="+data.poKey);
            this.specialUrl = this.sanitizer.bypassSecurityTrustResourceUrl(data);
            // this.specialUrl = data;
        })
    }
    public mouseover(e,html) {
        if(html&&html.length>8){
            var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
            var messageDetail = document.getElementById("messageDetail");
            if(html.length > 200) {
                messageDetail.style.width = "400px"
            } else {
            messageDetail.style.width = "200px"
            };
            messageDetail.innerHTML = html;
            messageDetail.style.zIndex = "9999999";
            messageDetail.style.top = (e.pageY -scrollTop) + "px";
            messageDetail.style.left = (e.pageX - (-20)) + "px";
        }
    }

    public mouseup() {
        var messageDetail = document.getElementById("messageDetail");
        messageDetail.style.zIndex = "-999";
    }
}