import {Component, OnInit} from '@angular/core';
import 'style-loader!./closeReport.scss';
import {Message} from 'primeng/primeng';
import {HttpDataService} from '../../../service/http.service';
import {MessageService} from "../../../service/message.service";
import {LocalStorage} from "../../../portal/workPortal/local.storage"
@Component({
    selector: 'close-report',
    templateUrl: './closeReport.html'
})
export class closeReportComponent {
    projectTable:any[];
    projectTypes:any[]=[];
    selectedType:any;
    projectCode:any;
    prjCode:any;
    adProjectCode:any;
    showReport:boolean = false;
    selectInvestmentDialog:boolean = false;
    totalRecord:number;
    paginatorPage:number;
    paginatorRow:number;
    closeReport:any;
    reportTable:any[] = [];
    exportTable:any;
    projectType:any;
    jack:boolean = false;
    msgs: Message[];
    public growLife: number = 5000;
    flag: any;
    flag2: any;
    projectManagerCode:string;
    userCode:string;
    budgetVersions:any[] = [];
    selectedVersion:string;

    public checked: boolean = true;
    constructor(private httpService: HttpDataService,private msgService: MessageService,private ls: LocalStorage){

    }
    ngOnInit(){
      this.paginatorPage = 1;
      this.paginatorRow = 10;
      this.httpService.post("/bpd-proj/bpd/allProjInfo/getProjectTypeCombobox",{})
      .subscribe(data => {
          this.projectTypes = data;
          this.projectTypes.unshift({
            label:"All",
            value:""
          })
      });
      this.selectedType = null;
      this.checkMainTable();
      this.userCode = this.ls.get('user');
    }
    // version 查询
    getVersion(){
      let timeStamp = new Date().getTime();
      this.httpService.get("/bpd-proj/bpd/allProjInfo/getCostBookVersion?"+timeStamp+"&projectCode="+this.prjCode)
      .subscribe(data => {
        this.budgetVersions = data;
        this.budgetVersions.unshift({
          label:'All',value:''
        })
        this.selectedVersion = data[0].value;
      })
    }

    // 根据version切换版本
    changeVersion(){
      this.requestBoxData();
    }
    // 主表查询
    checkMainTable(){
      this.httpService.post("/bpd-proj/bpd/allProjInfo/getCloseReport",{
        "projectType":this.selectedType,
        "projectCode":this.projectCode,
        "page": {
          "page": this.paginatorPage,
          "rows": this.paginatorRow
        },
        "projectManager": this.checked ? window.localStorage.getItem("user") : null
      }).subscribe(data1 => {
        this.projectTable = [];
        this.totalRecord = data1.total;
        let data = data1.rows;
        if(data.length>0){
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
                this.projectTable.push({
                    "ip": i+1
                })
            } else {
                this.projectTable.push(data[i])
            }
        }
        }
        // this.projectTable = data;
      })
    }

    public checkedChange() {
        this.checkMainTable();
    }
    // 分页请求数据
    paginate(e){
      this.paginatorPage = e.page + 1;
      this.paginatorRow = e.rows;
      this.checkMainTable();
    }

    projectCodeEnterSearch($event) { // 回车模糊查询
      if ($event.key === "Enter") {
        this.check();
      }
    }

    // 主表格模糊查询
    check(){
      this.paginatorPage = 1;
      this.paginatorRow = 10;
      this.checkMainTable();
    }
    // 弹框数据请求事件
    requestBoxData(){
      this.httpService.post("/bpd-proj/bpd/allProjInfo/showDetilOfCloseReport",{
        "adProjectCode": this.adProjectCode,
        "projectCode": this.prjCode,
        "budgetVersionName":this.selectedVersion
      }).subscribe(data => {
        this.reportTable = data;
        if(this.reportTable.length<10){
          for(let i=this.reportTable.length;i<10;i++){
            this.reportTable.push({id:i});
          }
        }
      })
    }
    //导出事件
    export(){
      // this.adProjectCode = "A-V17003";
      // this.prjCode = "B-006-14";
      let timeStamp = new Date().getTime();
      let token = window.sessionStorage.getItem("access_token");
      let url: string = "/bpd-proj/bpd/allProjInfo/exportExcel?"+timeStamp+"&adProjectCode="+this.adProjectCode+"&projectCode="+this.prjCode + '&_=' + Number(new Date());
      if (token) {
        let realToken = token.substr(1, token.length - 2)
        url = url + "&accessToken=" + realToken;
      }
      window.location.href = url;
    }
    // 弹框中的按钮事件
    switch(){
      this.selectInvestmentDialog = true;
    }
    // 弹框提交事件
    tijiao(){
      this.jack = true;
    }
    // 二层弹框双击事件
    returnNeed(e){
      this.prjCode = e.data.projectCode;
      this.adProjectCode = e.data.adProjectCode;
      this.projectType = e.data.projectType;
      this.projectManagerCode = e.data.projectManager;
      this.closeReport = this.prjCode+' Close Report';
      this.selectInvestmentDialog = false;
      this.getVersion();
      this.selectedVersion = null;
      this.requestBoxData();
    }
    // 表格view列点击事件
    openBox(value1,value2,value3,value4){
      this.prjCode = value1;
      this.closeReport = this.prjCode+' Close Report';
      this.adProjectCode = value2;
      this.projectType = value3;
      this.projectManagerCode = value4;
      this.getVersion();
      this.selectedVersion = null;
      this.requestBoxData();
      this.showReport = true;
    }
    // 投资汇总表格备注提交
    handRemark(e){
      this.httpService.post("/bpd-proj/bpd/closeReportDesc/add",{
        "adProjectCode":this.adProjectCode,
        "subject":e.subject,
        "regionCategoryCode":e.regionCategoryCode
      }).subscribe(data => {
        console.log(data);
      })
    }
    // 确认提交
    cando(){
      this.httpService.post("/bpd-proj/bpd/allProjInfo/CloseReport",{
        "adProjectCode": this.adProjectCode,
        "projectType": this.projectType
      }).subscribe(data => {
        if(data.code == 1){
          this.msgService.showSuccess('Opration succeed!');
          this.growLife = 5000;
        }
        else{
          this.msgService.showError('Opration failed!');
          this.growLife = 5000;
        }
        this.msgs = this.msgService.msgs;
      })
      this.jack = false;
      this.showReport = false;
    }

    outTable() {
      this.flag2 = -1;
    }
    gotoClick(val){
      console.log("flag"+this.flag);
      this.flag = val;
      this.flag2 = -1;
    }
    gotoCover(val) {
      this.flag2 = val;
      console.log("flag2"+this.flag2);
      if (this.flag2 == this.flag) {
          this.flag2 = -1;
      }
  }
}
