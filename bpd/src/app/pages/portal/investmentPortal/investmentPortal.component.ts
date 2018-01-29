import {Component,OnInit} from '@angular/core';
import 'style-loader!./investmentPortal.scss';
import {SelectItem,Message} from 'primeng/primeng';
import {Router} from "@angular/router";
import {MessageService} from '../../service/message.service';
import {HttpDataService} from '../../service/http.service';
import {LocalStorage} from '../workPortal/local.storage';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'investment-portal',
  templateUrl: './investmentPortal.html',
})
export class InvestmentPortal {
  msgs: Message[];
  public growLife: number = 5000;
  categoryOption: SelectItem[];
  selectedCategory: string[] = [];
  display:boolean = false;
  investmentStatusTable:any[];
  flag:number;
  showKanban:boolean = false;
  showModuleYear:boolean = false;
  prjCode:any;
  prjCode1:any;
  pieData:any;
  barData:any;
  getData:any;
  investmentTable:any[]=[];
  status:any[];
  selectedStatus:any;
  projectCode:any;
  projectName:any;
  projectType:any;
  adProjectCode:any;
  totalRecord:number; //分页总条数
  paginatorPage:number; //当前页数
  paginatorRow:number; //当前页条数
  InvestmentBudgetTable:any[];
  modelYearTable:any[];
  totalRecord1:number;
  paginatorPage1:number;
  paginatorRow1:number;
  fuck:boolean = false;
  version:any[];
  selectedVersion:any;
  currency:any[];
  selectedCurrency:any;
  investGroupList:any[];
  investGroupList1:any[];
  investGroupList2:any[];
  summaryTable:any[] = [];
  summaryTable1:any[] = [];
  sum:number = 0;
  sum1:number = 0;
  totalSum:any[] = [];
  totalPercent:any[] = [];
  state:number = -1;   //设置一个状态，用于标记从哪一行点击进入弹框，并判断是否为同一行防止重复调接口
  index:number;
  types:any[];
  selectedType:any;
  calendarTable:any[] = [];
  Today:any;
  today:any;
  year:any;
  month:any;
  day:any;
  calendarData:any[] = [];
  calendarData1:any[];
  dayData:any[] = [];
  dayData1:any[];
  monthCalendar:boolean = true;
  dayCalendar:boolean = false;
  meetingTime:any;
  oneOfInvestmentTable:any[]=[];
  // close report 待办变量
  showDocuments:boolean = false;
  fileName:any;
  documentTable:any[];
  projectTypes:any[];
  choosedType:any;
  projectCode1:any;
  projectTable:any[];
  adProjectCode1:any[];
  projectCode2:any;
  projectType1:any;
  reportTable:any[];
  totalRecord2:number;
  paginatorPage2:number;
  paginatorRow2:number;
  exportTable:any;
  first:boolean = true;
  second:boolean = false;
  // card1 中数据
  investmentPortal:any[]=[];

  programCode:any;

  hideAndVisible:boolean = false;

  powerOfModify:any;    //权限判断变量

  tableFlag:any;
  tableFlag2:any;
  specialURL:any;
  showModelYear:boolean = false;
  router:any[] = [];
  mixedRouter:any;
  // new add 2018/1/15
  projectType2:any;
  sop:any;
  platform:any;
  status1:any;
  statuss:any[]=[];
  newTime:any;    //new add 2018/1/25
  constructor(private httpService: HttpDataService,private msgService: MessageService,private ls: LocalStorage,private sanitizer: DomSanitizer) {
    this.categoryOption = [];
    this.categoryOption.push({label:'New York', value:'New York'});
    this.categoryOption.push({label:'Rome', value:'Rome'});
    this.categoryOption.push({label:'London', value:'London'});
    this.categoryOption.push({label:'Istanbul', value:'Istanbul'});
    this.categoryOption.push({label:'Paris', value:'Paris'});
    this.paginatorPage = 1;
    this.paginatorRow = 10;
    this.paginatorPage1 = 1;
    this.paginatorRow1 = 10;
  }
  ngOnInit () {
    this.newTime = new Date();
    this.statuss = [
      {label:'All',value:null},
      {label:'open',value:'0'},
      {label:'close',value:'1'}
    ]
    this.powerOfModify = JSON.parse(this.ls.get("authorityData"))['Maintain Close Report'];
    if(this.powerOfModify=="true"){
        this.powerOfModify = true;
    }
    else{
        this.powerOfModify = false;
    }
    this.httpService.post("/bpd-proj/bpd/portal/getList",{
      "userCode":this.ls.get('user')
    }).subscribe(data => {
      this.investmentPortal = data;
    })
    this.index = 0;
    this.types =[
      {label:'All',value:''},
      {label:'Participate',value:0},
      {label:'CC to me',value:1},
    ]
    this.selectedType = "";
    this.status = [
      {label:'Making Project Budget',value:1},
      {label:'Disapproved Project Budget',value:3}
    ];
    // this.selectedStatus = 2;
    // this.today = new Date();
    // this.year = this.today.getFullYear();
    // this.month = this.today.getMonth();
    // this.meetingTime = this.year+'-'+(this.month+1);
    // this.dateHandle(this.year,this.month);             //    位置待定
    this.getInvestmentStatusTable();
    this.router = ["project-member","investment-status","bench-mark","investment-document"];
    let localRouter2 = JSON.parse(this.ls.get('menusTwo'));
    let routerOfInvestment2 = [];
    for(let i=0;i<localRouter2.length;i++){
      if(localRouter2[i].children != null){
        for(let j=0,len= localRouter2[i].children.length;j<len;j++){
          let child = localRouter2[i].children[j].path;
          routerOfInvestment2.push(child);
        }
      }
    };
    let localRouter1 = JSON.parse(this.ls.get('menusOne'));
    let routerOfInvestment1 = [];
    for(let i=0;i<localRouter1.length;i++){
      if(localRouter1[i].children != null){
        for(let j=0,len= localRouter1[i].children.length;j<len;j++){
          let child = localRouter1[i].children[j].path;
          routerOfInvestment1.push(child);
        }
      }
    };
    let union:Set<any> = new Set([...routerOfInvestment1,...routerOfInvestment2]);
    let setRouter = new Set(this.router);
    this.mixedRouter = new Set(Array.from(union).filter(x => (setRouter.has(x))));
  }
  lookUpEnterSearch($event) {
    if ($event.key === "Enter") {
      this.lookUp();
    }
  }
  // investment status card 里的查询事件
  lookUp(){
    this.paginatorPage = 1;
    this.paginatorRow = 10;
    this.getInvestmentStatusTable();
}
// investment status card 里的表格第一列的点击事件
  open(value1,value2,value3,value4,value5){
    if(this.state!=value4){
      this.state = value4;
      this.fuck = false;
      this.totalSum = [];
      this.investGroupList = [];
      this.modelYearTable = [];
      this.prjCode1 = value1;
      this.projectType = value2;
      this.adProjectCode = value3;
      this.programCode = value5;
      if(this.index == 1){
        this.requestBodyOne();
      }
      else if(this.index == 0){
        this.requestBodyTwo();
      }
      // else if(this.index == 3){
      //   this.requestBodyThree();
      // }
      else{
        this.requestBodyFour();
      }
    }
    this.showKanban = true;
  }

  checkEnterSearch($event) {
    if ($event.key === "Enter") {
      this.check();
    }
  }

// to do task card 里的弹框中investment budget表格的查询事件 
  check(){
    this.httpService.post("/bpd-proj/bpd/projectBudget/getProjectBudget", {
      // userCode:"sjm6rh",
      userCode:this.ls.get('user'),
      // projectCode: this.prjCode,
      status: this.selectedStatus,
      projectCode1:this.projectCode
    })
    .subscribe(data => {
        this.InvestmentBudgetTable = data;
        if(this.InvestmentBudgetTable.length){
          for(let i=0;i<this.InvestmentBudgetTable.length;i++){
            this.InvestmentBudgetTable[i].id = i+1;
          }
        };
    })
  }
  click() {
    let token = window.sessionStorage.getItem("access_token");
    let url: string = "/bpd-proj/bpd/projectActualCost/exportSAP" + '&_=' + Number(new Date());
    if (token) {
      let realToken = token.substr(1, token.length - 2)
      url = url + "&accessToken=" + realToken;
    }
    window.location.href = url;
  }
  // card1里的点击事件
  openInvestment1(){
    this.hideAndVisible = true;
    this.selectedStatus = 1;
    this.display = true;
    this.openBody1();
  }
  openInvestment2(){
    this.hideAndVisible = false;
    this.selectedStatus = 2;
    this.display = true;
    this.openBody1();
  }
  openInvestment3(){
    this.display = true;
    this.openBody2();
  }
  openInvestment4(){
    this.display = true;
    this.openBody3();
  }
//  to do task card 里的弹框中investment budget表格第二列点击事件
  openInvestmentBudget(){

  }
//  to do task card 里的弹框中的切换事件
  // openBody(){
  //   this.flag = 0;
  // }
  openBody1(){
      this.flag = 1;
      this.httpService.post("/bpd-proj/bpd/projectBudget/getProjectBudget", {
        // userCode:"sjm6rh",
        userCode:this.ls.get('user'),
        status: this.selectedStatus
        // projectCode: this.prjCode
      })
      .subscribe(data => {
          this.InvestmentBudgetTable = data
          if(this.InvestmentBudgetTable.length){
            for(let i=0;i<this.InvestmentBudgetTable.length;i++){
              this.InvestmentBudgetTable[i].id = i+1;
            }
          }
      })
  }
  openBody2(){
    this.flag = 2;
    this.monthCalendar = true;
    this.dayCalendar = false;
    this.today = new Date();
    this.year = this.today.getFullYear();
    this.month = this.today.getMonth();
    this.meetingTime = this.year+'-'+(this.month+1);
    this.calendarTable = [];
    this.dateHandle(this.year,this.month);
    this.checkDate();
  }
  openBody3(){
    this.second = false;
    this.first = true;
    this.flag = 3;
    this.httpService.post("/bpd-proj/bpd/allProjInfo/getProjectTypeCombobox",{})
    .subscribe(data => {
        this.projectTypes = data;
        this.projectTypes.unshift({
          label:"All",
          value:""
        })
    })
    this.choosedType = null;
    this.paginatorPage2 = 1;
    this.paginatorRow2 = 10;
    this.checkMainTable();
  }

  // card3中的弹框请求数据事件
  requestBodyOne(){
    this.oneOfInvestmentTable = [];
    let timeStamp = new Date().getTime();
    if(this.projectType == 300){
      this.httpService.get("/bpd-proj/bpd/arProject/getIndexDtoByid?"+timeStamp+"&adProjectCode="+this.adProjectCode)
      .subscribe(data => {
        this.oneOfInvestmentTable.push(data);
      })
    }
    else if(this.projectType == 200){
      this.httpService.get("/bpd-proj/bpd/buildProj/getIndexDtoById?"+timeStamp+"&adProjCode="+this.adProjectCode)
      .subscribe(data => {
        this.oneOfInvestmentTable.push(data);
      })
    }
    else if(this.projectType == 120){
      this.httpService.get("/bpd-proj/bpd/powertrainProject/getIndexById?"+timeStamp+"&adProjectCode="+this.adProjectCode)
      .subscribe(data => {
        this.oneOfInvestmentTable.push(data);
      })
    }
    else if(this.projectType == 110){
      this.httpService.get("/bpd-proj/bpd/vehicleInvestProject/getIndexById?"+timeStamp+"&adProjectCode="+this.adProjectCode)
      .subscribe(data => {
        this.oneOfInvestmentTable.push(data);
      })
    }
  }
  requestBodyTwo(){
    // let timeStamp = new Date().getTime();
    this.investmentTable = [];
    this.httpService.post("/bpd-proj/bpd/allProjInfo/getBudgetByRegionGroup",{
      "projectType":this.projectType,
      "adProjectCode":this.adProjectCode,
      "projectCode":this.prjCode1,
      "id":1                          // 加于2017/11/24
    }).subscribe(data => {
      if(data){
        this.getData = data;
        this.pieData = {
        labels: this.getData.group,
        datasets: [
          {
              data: this.getData.totalCost,
              backgroundColor: [
                  "#FF6384",
                  "#36A2EB",
                  "#FFCE56",
                  "#C23531",
                  "#BDA29A",
                  "#570E1A"
              ],
              hoverBackgroundColor: [
                  "#FF6384",
                  "#36A2EB",
                  "#FFCE56",
                  "#C23531",
                  "#BDA29A",
                  "#570E1A"
              ]
          }
        ]    
      };
        this.barData = {
        labels: this.getData.group,
        datasets: [
            {
                label: 'Current Budg',
                backgroundColor: '#42A5F5',
                borderColor: '#1E88E5',
                data: this.getData.currentBudget
            },
            {
                label: 'Total Cost',
                backgroundColor: '#9CCC65',
                borderColor: '#7CB342',
                data: this.getData.totalCost
            }
        ]
      };
      this.fuck = true;
      if(data.group.length>0){
        for(let i=0;i<data.currentBudget.length;i++){
          let opp = {
            currentBudget:data.currentBudget[i],
            totalCost:data.totalCost[i],
            group:data.group[i]
          }
          this.investmentTable.push(opp);
        }
      }
      }
    })
  }
  requestBodyThree(){
    // this.totalSum = [];
    let timeStamp = new Date().getTime();
    this.httpService.get("/bpd-proj/bpd/projectBudget/getProjectBudgetCombobox?"+timeStamp+"&projectCode="+this.adProjectCode)
    .subscribe(data => {
        this.version = data;
        if(this.version.length>0){
          this.selectedVersion = this.version[0].value;
        }
        this.httpService.get("/bpd-proj/bpd/currency/getCurrencyCombobox?"+timeStamp)
        .subscribe(data => {
            this.currency = data;
            if(this.currency.length>0){
              this.selectedCurrency = this.currency[0].value;
            }
            this.getSummaryTable();
        });
    });
    // this.httpService.get("/bpd-proj/bpd/currency/getCurrencyCombobox")
    // .subscribe(data => {
    //     this.currency = data;
    //     this.selectedCurrency = this.currency[0].value;
    // });
    // this.getSummaryTable();
  }
   // 数据加千分位函数
  toThousand(val){
    let go = val.toString().split('.');
    let re=/(?=(?!(\b))(\d{3})+$)/g;
    let go1 = go[0].replace(re,",");
    var go2 = go1+'.'+go[1];
    return go2;
  }
  getSummaryTable(){
    this.totalSum = [];
    this.totalPercent = [];
    this.investGroupList = [];
    this.httpService.post("/bpd-proj/bpd/investmentPropertyGroup/getList", {
    })
    .subscribe(data => {
        if(data){
          for(let i=0;i<data.length;i++){
            this.investGroupList.push(data[i].groupPropertyName);
          }
        }
        this.httpService.post("/bpd-proj/bpd/projectBudgetDetail/getMap", {
          "adProjectCode":this.adProjectCode,
          "budgetVersionName":this.selectedVersion,
          "currencyCode":this.selectedCurrency
        })
        .subscribe(data => {
          if(data.length>0){
            if(data[data.length-1].regionCatagory == "Misc"){
              this.summaryTable = data.slice(0,-1);
              this.summaryTable1 = data.slice(-1); 
            }
            else{
              this.summaryTable = data;
              this.summaryTable1 = [];
            }
            for(let i=0;i<this.investGroupList.length;i++){
              var key = this.investGroupList[i];
             for(let j=0;j<this.summaryTable.length;j++){
               if(!this.summaryTable[j][key]){
                  this.summaryTable[j][key] = 0;
               }
               else{
                this.summaryTable[j][key] = Number(this.summaryTable[j][key].toFixed(2));
               }
                this.sum += this.summaryTable[j][key]*100;
             }
             this.sum = this.sum/100;
             if(this.summaryTable1.length>0){
              if(!this.summaryTable1[0][key]){
                this.summaryTable1[0][key] = 0;
              }
              this.sum1 = this.sum*100*this.summaryTable1[0][key]*100/1000000;
              let sum2 = this.toThousand(this.sum1.toFixed(2));
              this.totalPercent.push(sum2);
             }
             else{
              let sum1 = 0;
              this.totalPercent.push(this.toThousand(sum1.toFixed(2)));
             }
             let sum3 = this.toThousand(this.sum.toFixed(2));
             this.totalSum.push(sum3);
             this.sum = 0;  //下一轮循环从0开始
            }
            for(let k=0;k<this.investGroupList.length;k++){
              var key1 = this.investGroupList[k];
              for(let m=0;m<this.summaryTable.length;m++){
                let value = this.summaryTable[m][key1].toFixed(2);
                this.summaryTable[m][key1] = this.toThousand(value);
              };
            }
          }
        });
    });
  }
  //summary 中的过滤查询
  checkSummary(){
    this.totalSum = [];
    this.totalPercent = [];
    this.getSummaryTable();
  }
  // module year 点击事件 
  requestBodyFour(){
    this.getModuleYearTable();
  }
  handleChange(e){
    this.index = e.index;
    if(e.index==1){
      this.requestBodyOne();
    }
    else if(e.index==0){
      if(!this.fuck){
        this.requestBodyTwo();
      }
    }
    // else if(e.index==3) {
    //   if(this.investGroupList.length==0){
    //     this.requestBodyThree();
    //   }
    // }
    else if(e.index == 2){
      if(this.modelYearTable.length==0){
        this.requestBodyFour();
      }
    }
  }
  // 分页事件
  paginate($event) {
    this.paginatorPage = $event.page + 1;
    this.paginatorRow = $event.rows;
    this.getInvestmentStatusTable();
  }
  paginate1($event) {
    this.paginatorPage1 = $event.page + 1;
    this.paginatorRow1 = $event.rows;
    this.getModuleYearTable();
  }
  // 分页请求数据
  getInvestmentStatusTable(){
    this.httpService.post("/bpd-proj/bpd/allProjInfo/getInvestmentStatusOfInvestment", {
      "page": {
        "page": this.paginatorPage,
        "rows": this.paginatorRow
      },
      "projectCode":this.prjCode,
      "projectName":this.projectName,
      "projectType":this.projectType2,
      "sop":this.sop,
      "platform":this.platform,
      "status":this.status1
    })
    .subscribe(data => {
      this.totalRecord = data.total;
      this.investmentStatusTable = data.rows;
      // if(this.investmentStatusTable){
      //   for(let i=0;i<this.investmentStatusTable.length;i++){
      //     this.investmentStatusTable[i].currentBudget = this.toThousand(this.investmentStatusTable[i].currentBudget.toFixed(2));
      //     this.investmentStatusTable[i].releaseBudget = this.toThousand(this.investmentStatusTable[i].releaseBudget.toFixed(2));
      //     this.investmentStatusTable[i].totalCost = this.toThousand(this.investmentStatusTable[i].totalCost.toFixed(2));
      //     this.investmentStatusTable[i].bal = this.toThousand(this.investmentStatusTable[i].bal.toFixed(2));
      //     this.investmentStatusTable[i].closeActual = this.toThousand(this.investmentStatusTable[i].closeActual.toFixed(2));
      //   }
      // }
    })
  }

  //module year 分页请求数据
  getModuleYearTable(){
    this.httpService.post("/bpd-proj/bpd/vehicleProject/getIndexVList", {
      "page": {
        "page": this.paginatorPage1,
        "rows": this.paginatorRow1
      },
      // "projectCode":this.prjCode
      "programCode":this.programCode
    })
    .subscribe(data => {
      this.totalRecord1 = data.total;
      // if (!data.rows.length) {
      //   data.rows = [{}];
      // }
      // let length = data.rows.length;

      // while (length > 10) {
      //   length -= 10;
      // }
      // if (length > 0 && length < 10) {
      //   for (let i = 0; i < 10 - length; i++) {
      //     data.rows.push({
      //       id: i
      //     });
      //   }
      // }
      this.modelYearTable = data.rows;
    })
  }
  //module year 里的第四列点击事件
  openModelYear(val1,val2){
    let timeStamp = new Date().getTime();
    this.specialURL = this.sanitizer.bypassSecurityTrustResourceUrl("assets/drawTimeSheet/svg.html?" + timeStamp + "&adProjectCode=" + val1 +"&timingId=" + val2);
    this.showModelYear = true;
  }
  // 请求日历数据
  checkDate(){
    this.httpService.post("/bpd-proj/bpd/attendance/getMeeting",{
      attend:this.selectedType,
      userCode:this.ls.get('user'),
      meetingTime:this.meetingTime
    }).subscribe(data => {
      if(this.monthCalendar){
        for(let i=0;i<data.length;i++){
          let fuck = data[i].meetingTime.replace(/-/g,"/");
          let changeTime = new Date(fuck);
          let y = changeTime.getFullYear();
          let M = changeTime.getMonth();
          let d = changeTime.getDate();
          let h = changeTime.getHours();
          let m = changeTime.getMinutes();
          data[i].timeFlag = new Date(y,M,d,h,m,0);
          data[i].meetingTime = (changeTime.getMonth()+1)+'.'+changeTime.getDate();
        }
        this.calendarData = data;
      }
      else{
        this.dayData = data;
        for(let i=0;i<this.dayData.length;i++){
          let fuck = data[i].meetingTime.replace(/-/g,"/");
          // this.dayData[i].meetingTime = fuck;
          let changeTime = new Date(fuck);
          this.dayData[i].begin = changeTime;
          let minute = changeTime.getMinutes()+data[i].minutes;
          let yyyy = changeTime.getFullYear();
          let MM = changeTime.getMonth();
          let dd = changeTime.getDate();
          let HH = changeTime.getHours();
          let newDate = new Date(yyyy,MM,dd,HH,minute);
          this.dayData[i].end = newDate;
          let yyyy1 = newDate.getFullYear();
          let MM1 = newDate.getMonth()+1;
          let dd1 = newDate.getDate();
          let HH1 = newDate.getHours();
          let mm1 = newDate.getMinutes();
          let M1,d1,H1,m1;
          if(MM1<10){
              M1 = "0"+MM1;
          }else{
              M1 = MM1;
          };
          if(dd1<10){
              d1 = "0"+dd1;
          }else{
              d1 = dd1;
          };
          if(HH1<10){
              H1 = "0"+HH1;
          }else{
              H1 = HH1;
          };
          if(mm1<10){
              m1 = "0"+mm1;
          }else{
              m1 = mm1;
          }
          this.dayData[i].endTime = yyyy1+'-'+M1+'-'+d1+' '+H1+':'+m1;
        };
        for (let m = 0; m < this.dayData.length; m++) {
          for (let n = m+1; n < this.dayData.length; n++) {
          if (this.dayData[m].begin > this.dayData[n].begin) {
          let temp = this.dayData[n];
          this.dayData[n] = this.dayData[m];
          this.dayData[m] = temp;
          }
        }
        };
        for(let i=0;i<this.dayData.length;i++){
          for(let j=i+1;j<this.dayData.length;j++){
            if(this.dayData[i].end>this.dayData[j].begin){
              this.dayData[i].flag = 'red';
              this.dayData[j].flag = 'red';
            }
          }
        };
        // if(this.dayData.length==0){
        //   this.msgService.showInfo("No meeting!");
        //   this.msgs = this.msgService.msgs;
        // }
      }
    })
  }
  // 日期处理
  itemHandle(time){
    let time1 =(time.getMonth()+1)+'.'+time.getDate();
    return time1;
  }
  dateHandle(val1,val2){
    //  var today = new Date();
    //  var year = today.getFullYear();
    //  var month = today.getMonth();
     this.Today = val1+'.'+(val2+1);
     var other = new Date(val1,val2,1);
     var week = other.getDay();
     var num = 2-week;
     if(week == 0){
       num = -5;
     };
     for(let i=0;i<35;i++){
       let item = new Date(val1,val2,num+i);
       let calendarItem = this.itemHandle(item); 
       this.calendarTable.push(calendarItem);
     }
  }
  // 上一个月份
  pre(){
    if(this.monthCalendar){
      this.month -= 1;
      if(this.month == -1){
        let newYear = new Date(this.year,this.month,1);
        this.year = newYear.getFullYear();
        this.month = newYear.getMonth();
      }
      this.meetingTime = this.year + '-' +(this.month+1);
      this.calendarTable = [];
      this.dateHandle(this.year,this.month); 
      this.checkDate();
    }
    else{
       this.day -= 1;
       if(this.day == 0){
         let newYear = new Date(this.year,this.month,this.day);
         this.year = newYear.getFullYear();
         this.month = newYear.getMonth();
         this.day = newYear.getDate();
       }
       this.Today = (this.month+1)+'.'+this.day;
       this.meetingTime = this.year + '-' + (this.month+1) + '-' + this.day;
       this.checkDate();
    }
  }
  // 下一个月份
  next(){
    if(this.monthCalendar){
      this.month += 1;
      if(this.month == 12){
        var newYear = new Date(this.year,this.month,1);
        this.year = newYear.getFullYear();
        this.month = newYear.getMonth();
      }
      this.meetingTime = this.year + '-' +(this.month+1);
      this.calendarTable = [];
      this.dateHandle(this.year,this.month);
      this.checkDate();
    }
    else{
      this.day += 1;
      if(this.day >= 28){
        let newYear = new Date(this.year,this.month,this.day);
        this.year = newYear.getFullYear();
        this.month = newYear.getMonth();
        this.day = newYear.getDate();
      }
      this.Today = (this.month+1)+'.'+this.day;
      this.meetingTime = this.year + '-' + (this.month+1) + '-' + this.day;
      this.checkDate();
    }
  }
  // 向日历里插数据     ******************** no use now
  // insertData(){
  //   for(var i=0;i<this.calendarTable.length;i++){
  //     var div = document.getElementById(this.calendarTable[i]);
  //     console.log(div);
  //     if(div != null){
  //       for(var j=0;j<this.calendarData.length;j++){
  //         let itemDate = new Date(this.calendarData[j].meetingTime);
  //         let newItemDate = this.itemHandle(itemDate);
  //         if(newItemDate == this.calendarTable[i]){
  //           div.style.borderColor = "#4B98DC";
  //           var newDiv = document.createElement('div');
  //           newDiv.innerHTML = this.calendarData[j].meetingName;
  //           newDiv.className = "child";
  //           div.appendChild(newDiv);
  //         }
  //       }
  //     }
  //   }
  // }
  // 日历第一个点击按钮
  lookMonth(){
    let time = new Date();
    this.year = time.getFullYear();
    this.month = time.getMonth();
    this.day = time.getDate();
    this.meetingTime = this.year+'-'+(this.month+1);
    this.Today = this.year + '.' + (this.month+1);
    this.checkDate();
    this.monthCalendar = true;
    this.dayCalendar = false;
  }
  // 日历第二个点击按钮
  lookDay(){
    let time = new Date();
    this.year = time.getFullYear();
    this.month = time.getMonth();
    this.day = time.getDate();
    this.Today = (time.getMonth()+1)+'.'+time.getDate();
    let newTime = time.getFullYear()+'-'+(time.getMonth()+1)+'-'+time.getDate();
    this.meetingTime = newTime;
    this.checkDate();
    this.dayCalendar = true;
    this.monthCalendar = false;
  }
  // 日历模糊查询
  checkCalendar(){
    this.checkDate();
  }
  // 从月日历的天中进入天日历
  gotoDay(value){
    if (this.giveBorder(value)) {
      let jack = this.year+'.'+value;
      let time = jack.split('.').join('-');
      this.Today = value;
      this.day = new Date(time.replace(/-/g,'/')).getDate();
      this.dayCalendar = true;
      this.monthCalendar = false;
      this.meetingTime = time;
      this.checkDate();
    }
    // else{
    //   this.msgService.showInfo('No meeting!');
    //   this.msgs = this.msgService.msgs;
    // }
  }
  // 绑定class
  giveBorder(option){
    let flag: Boolean = false;
    for(let i=0;i<this.calendarData.length;i++){
      if (option == this.calendarData[i].meetingTime){
        flag = true;
      }
    }
    return flag;
  }
  // card2 中的shared documents点击事件
  // openDocument(){
  //   this.showDocuments = true;
  // }
   // card2 中的shared documents请求数据
   requestDocuments(){
     this.httpService.post("",{

     }).subscribe(data => {
       this.documentTable = data;
     })
   }
  // card2 中的shared documents弹框中查询事件
  checkUp(){
    this.requestDocuments();
  }
  // ----------------------close report 待办
  checkMainTable(){
    this.httpService.post("/bpd-proj/bpd/allProjInfo/getCloseReport1",{
      "projectType":this.choosedType,
      "projectCode":this.projectCode1,
      "userName":this.ls.get('user'),
      "page": {
        "page": this.paginatorPage2,
        "rows": this.paginatorRow2
    }
    }).subscribe(data1 => {
      this.totalRecord2 = data1.total;
      let data = data1.rows;
      if(data){
        for(let i = 0; i < data.length; i++) {
          data[i].id = i+1;
          if(data[i].projectStatus == 0) {
              data[i].projectStatus = 'Runing';
          } else if(data[i].projectStatus == 1) {
              data[i].projectStatus = 'Closed';
          } else {
              data[i].projectStatus = 'Initial';
          }
      }
      }
      this.projectTable = data;
    })
  }
  paginate2(e){
    this.paginatorPage2 = e.page + 1;
    this.paginatorRow2 = e.rows;
    this.checkMainTable();
  }

  sousuoEnterSearch($event) {
    if ($event.key === "Enter") {
      this.sousuo();
    }
  }

  sousuo(){
    this.paginatorPage2 = 1;
    this.paginatorRow2 = 10;
    this.checkMainTable();
  }
  export(){
    let token = window.sessionStorage.getItem("access_token");
    let url: string = "/bpd-proj/bpd/allProjInfo/exportExcel?adProjectCode="+this.adProjectCode1+"&projectCode="+this.projectCode2 + '&_=' + Number(new Date());
    if (token) {
      let realToken = token.substr(1, token.length - 2)
      url = url + "&accessToken=" + realToken;
    }
    window.location.href = url;
    this.second = false;
    this.first = true;
  }
  tijiao(){
    this.httpService.post("/bpd-proj/bpd/allProjInfo/CloseReport",{
      "adProjectCode": this.adProjectCode1,
      "projectType": this.projectType1
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
    this.second = false;
    this.first = true;
  }
  openBox(value1,value2,value3){
    this.projectCode2 = value1;
    this.adProjectCode1 = value2;
    this.projectType1 = value3;
    this.requestBoxData();
    this.second = true;
    this.first = false;
  }
  requestBoxData(){
    this.httpService.post("/bpd-proj/bpd/allProjInfo/showDetilOfCloseReport",{
      "adProjectCode": this.adProjectCode1,
      "projectCode": this.projectCode2
    }).subscribe(data => {
      this.reportTable = data;
    })
  }
// ------------------------------------------------------投资关闭表格操作
  outTable() {
    this.tableFlag2 = -1;
  }
  gotoClick(val){
    this.tableFlag = val;
    this.tableFlag2 = -1;
  }
  gotoCover(val) {
    this.tableFlag2 = val;
    if (this.tableFlag2 == this.tableFlag) {
        this.tableFlag2 = -1;
    }
  }
}