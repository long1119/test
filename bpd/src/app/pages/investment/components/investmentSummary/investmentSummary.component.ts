import {Component, OnInit} from '@angular/core';
import 'style-loader!./investmentSummary.scss';
import {Message} from 'primeng/primeng';
import {HttpDataService} from '../../../service/http.service';
import {MessageService} from "../../../service/message.service";
@Component({
    selector: 'investment-summary',
    templateUrl: './investmentSummary.html'
})
export class investmentSummaryComponent {
    projectTable:any[];
    showSummary:boolean = false;
    projectTypes:any[];
    selectedType:any;
    projectCode:any;
    // 弹框变量
    prjCode:any;
    version:any[];
    selectedVersion:any;
    currency:any[];
    selectedCurrency:any;
    summaryTable:any[] = [];
    investGroupList:any[] = [];
    summaryTable1:any[];
    // investGroupList1:any[];
    // investGroupList2:any[] = [];
    // totalPercent:any[]=[];
    totalPercent1:any[]=[];
    sum:number = 0;
    sum1:number = 0;
    // totalSum:any[]=[];
    totalSum1:any[]=[];
    selectInvestmentDialog:boolean = false;
    totalRecord:number;
    paginatorPage:number;
    paginatorRow:number;
    adProjectCode:any;
    flag: any;
    flag2: any;

    years:any[];    // 加于2017/11/30
    selectedYear:any;
    selectedCurrency1:any;
    summaryTable8:any[] = [];
    investGroupList8:any[] = [];
    showSummary1:boolean = false;
    sum8:any = 0;
    sum9:number = 0;
    summaryTable9:any[] = [];
    totalPercent8:any[] = [];
    totalSum8:any[] = [];
    // totalSum9:any[] = [];
    selectedCurrency2:any;
    arBreakdownTable:any[] = [];
    arSum1:any;
    arSum2:any;
    arSum1x:any;
    arSum2x:any;
    summaryReport:boolean = true;
    paymentCashflow:boolean = false;
    poRate:boolean = false;
    poRateTable:any[] = [];
    paymentCashflowTable:any[] = [];
    titleData:any[] = [];

    public checked: boolean = true;
    constructor(private httpService: HttpDataService,private msgService: MessageService) {

    }
    ngOnInit(){
      this.paginatorPage = 1;
      this.paginatorRow = 10;
      this.httpService.post("/bpd-proj/bpd/projectType/getPTCombobox",{})
      .subscribe(data => {
          this.projectTypes = data;
          if(this.projectTypes){
            let j = -1;
            for(let i=0;i<this.projectTypes.length;i++){
              if (this.projectTypes[i].value == "100"){
                j=i;
              }
            };
            this.projectTypes.splice(j,1);
            let k = -1;
            for(let m=0;m<this.projectTypes.length;m++){
              if (this.projectTypes[m].value == "300"){
                k=m;
              }
            };
            this.projectTypes.splice(k,1);
          }
          this.projectTypes.unshift({
              label: 'All',
              value: null
          })
          this.selectedType = null;
      });
      let timeStamp = new Date().getTime();
      this.httpService.get("/bpd-proj/bpd/currency/getCurrencyCombobox?"+timeStamp)
          .subscribe(data => {
              this.currency = data;
              if(this.currency.length>0){
                this.selectedCurrency = this.currency[0].value;
              }
          });
      // this.projectTable = [
      //     {
      //       projectCode:"jiohfhnkjk"
      //     },
      //     {
      //       projectCode:"jiohfhokmnn"
      //     }
      // ]
      this.checkMainTable();  
    }
    gotoOne(){
      this.summaryReport = true;
      this.paymentCashflow = false;
      this.poRate = false;
      this.checkBoxTable();
    }
    gotoTwo(){
      this.summaryReport = false;
      this.paymentCashflow = true;
      this.poRate = false;
      this.checkBoxTable2();
    }
    gotoThree(){
      this.summaryReport = false;
      this.paymentCashflow = false;
      this.poRate = true;
      this.checkBoxTable3();
    }
    gotoCover(val) {
      this.flag2 = val;
      if (this.flag2 == this.flag) {
          this.flag2 = -1;
      }
  }
  gotoClick(val){
    this.flag = val;
    this.flag2 = -1;
  }
  outTable() {
    this.flag2 = -1;
}
    // 主表查询
    checkMainTable(){
      this.httpService.post("/bpd-proj/bpd/allProjInfo/getByTypeCode",{
        "summaryFlag":"1",
        "arBudgetSummaryFlag":"1",
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
        if(data.length){
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
    // 数据加千分位函数
    toThousand(val){
      let go = val.toString().split('.');
      let re=/(?=(?!(\b))(\d{3})+$)/g;
      let go1 = go[0].replace(re,",");
      var go2 = go1+'.'+go[1];
      return go2;
    }
    // 弹框表查询
    checkBoxTable(){
      // this.totalSum = [];
      // this.totalPercent = [];
      this.totalSum1 = [];
      this.totalPercent1 = [];
      this.investGroupList = [];
      // this.httpService.post("/bpd-proj/bpd/projectBudgetDetail/getInvestmentGroup", {
      //   "adProjectCode":this.adProjectCode,
      //   "budgetVersionName":this.selectedVersion,
      //   "currencyCode":this.selectedCurrency
      // })
      // .subscribe(data => {
      //     this.investGroupList = data.investGroupNameList;
      //     this.investGroupList1 = data.investGroupNameList.slice(0,2);
      //     this.investGroupList2 = data.investGroupNameList.slice(2);
      //     this.httpService.post("/bpd-proj/bpd/projectBudgetDetail/getMap", {
      //       "adProjectCode":this.adProjectCode,
      //       "budgetVersionName":this.selectedVersion,
      //       "currencyCode":this.selectedCurrency
      //     })
      this.httpService.post("/bpd-proj/bpd/investmentPropertyGroup/getSummaryList",{
            }).subscribe(data => {
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
                  };
                  // else{
                  //   this.summaryTable[j][key] = Number(this.summaryTable[j][key].toFixed(2));
                  // }
                    this.sum += this.summaryTable[j][key]*100;
                }
                this.sum = this.sum/100;
                if(this.summaryTable1.length>0){
                  if(!this.summaryTable1[0][key]){
                    this.summaryTable1[0][key] = 0;
                  }
                  this.sum1 = this.sum*100*this.summaryTable1[0][key]*100/1000000;
                  // let sum2 = this.toThousand(this.sum1.toFixed(2));
                  // this.totalPercent.push(sum2);
                  this.totalPercent1.push(this.sum1);
                }
                else{
                  let sum1 = 0;
                  this.totalPercent1.push(sum1);
                  // this.totalPercent.push(this.toThousand(sum1.toFixed(2)));
                }
                this.totalSum1.push(this.sum);
                // let sum3 = this.toThousand(this.sum.toFixed(2));
                // this.totalSum.push(sum3);
                this.sum = 0;  //下一轮循环从0开始
              }
              // for(let k=0;k<this.investGroupList.length;k++){
              //     var key1 = this.investGroupList[k];
              //     for(let m=0;m<this.summaryTable.length;m++){
              //         let value = this.summaryTable[m][key1].toFixed(2);
              //         this.summaryTable[m][key1] = this.toThousand(value);
              //     };
              // }
            }
            if(this.totalPercent1.length){
              this.totalPercent1[3] = this.totalPercent1[0]+this.totalPercent1[1]+this.totalPercent1[2];
              this.totalSum1[3] = this.totalSum1[0]+this.totalSum1[1]+this.totalSum1[2];
              let max = this.totalPercent1.length;
              this.totalPercent1[max-1] = 0;
              for(let i=0;i<max-1;i++){
                this.totalPercent1[max-1] += this.totalPercent1[i];
              };
              this.totalPercent1[max-1] -= this.totalPercent1[3];
            };
            if(this.totalSum1.length){
              for(let i=0;i<this.totalSum1.length;i++){
                this.totalSum1[i] += this.totalPercent1[i];
              }
            }
          });
      });
    }
    checkBoxTable3(){
      this.httpService.post("/bpd-proj/bpd/budgetExchange/getList", {
        "projectCode":this.adProjectCode,
        "budgetVersionName":this.selectedVersion
      }).subscribe(data => {
        this.poRateTable = data;
      })
    }
    checkBoxTable2(){
      this.httpService.post("/bpd-proj/bpd/paymentWeightDetail/getYear",{
        "projectId":this.adProjectCode
      }).subscribe(data => {
        this.titleData = data.yearList;
        this.httpService.post("/bpd-proj/bpd/projectBudgetDetail/getPaymentMap", {
          "adProjectCode":this.adProjectCode,
          "budgetVersionName":this.selectedVersion
        }).subscribe(data => {
          this.paymentCashflowTable = data;
          // if(this.paymentCashflowTable.length){
          //   let tem,index;
          //   for (var i = 0, len = this.paymentCashflowTable.length; i < len; i++) {
          //       if (this.paymentCashflowTable[i].PropertyGroupName == 'Capital') {
          //           tem = this.paymentCashflowTable[i];
          //           index=i;
          //           break;
          //       }
          //   }
          //   this.paymentCashflowTable.splice(index, 1)
          //   this.paymentCashflowTable.unshift(tem)
          // }
        })
      })
    }
    // 表格view列点击事件
    gotoSummary(value1,value2){
      this.prjCode = value1;
      this.adProjectCode = value2;
      this.showSummary = true;
      let timeStamp = new Date().getTime();
      this.httpService.get("/bpd-proj/bpd/projectBudget/getProjectBudgetCombobox?"+timeStamp+"&projectCode="+this.adProjectCode)
      .subscribe(data => {
          this.version = data;
          if(this.version.length>0){
            this.selectedVersion = this.version[0].value;
            if(this.summaryReport){
              this.checkBoxTable();
            }
            else if(this.paymentCashflow){
              this.checkBoxTable2();
            }
            else{
              this.checkBoxTable3();
            }
          }
      });
    }
    // 请求Ar项目数据
    gotoSummary1(){
      let thisYear = new Date().getFullYear();
      let lastYear = thisYear-1;
      let nextYear = thisYear+1;
      this.years = [
        {label:lastYear,value:lastYear},
        {label:thisYear,value:thisYear},
        {label:nextYear,value:nextYear}
      ];
      this.selectedYear = thisYear;
      this.selectedCurrency1 = this.currency[0].value;
      this.selectedCurrency2 = this.currency[0].value;
      this.showSummary1 = true;
      this.checkMaintable1();
      this.checkARComparison();
    }
    // 查询AR预算
    checkMaintable1(){
      this.investGroupList8 = [];
      this.totalPercent8 = [];
      this.totalSum8 = [];
      // this.totalSum9 = [];
      this.httpService.post("/bpd-proj/bpd/projectBudgetDetail/getProjectCompany",{
        "currencyCode":this.selectedCurrency1,
        "arYear":this.selectedYear
      }).subscribe(data => {
        this.investGroupList8 = data.companyProjectList;
        if(this.investGroupList8.length){
          this.investGroupList8.push('Sub-Total');
          this.investGroupList8.push('% of Total');
        }
        this.httpService.post("/bpd-proj/bpd/projectBudgetDetail/getArMap",{
          "currencyCode":this.selectedCurrency1,
          "arYear":this.selectedYear
        }).subscribe(data => {
          if(data.length>0){
            this.summaryTable8 = data;
            for(let i=0;i<this.investGroupList8.length;i++){
              let key = this.investGroupList8[i];
              if(key == '% of Total'){
                this.sum8 = "100%";
                // this.totalSum8.push(this.sum8);
                this.totalSum8.push(100);
              }
              else{
                for(let j=0;j<this.summaryTable8.length;j++){
                  this.sum8 += this.summaryTable8[j][key];
                }
                this.totalSum8.push(this.sum8);
              }
              this.sum8 = 0;
            }
          }
        })
      })
    }
    // 查询AR当前年与上一年费用对比
    checkARComparison(){
      this.arSum1 = 0;
      this.arSum2 = 0;
      this.httpService.post("/bpd-proj/bpd/projectBudgetDetail/getArYearMap",{
        "currencyCode":this.selectedCurrency1,
        "arYear":this.selectedYear
      }).subscribe(data => {
        this.arBreakdownTable = data;
        if(this.arBreakdownTable.length>0){
          for(let i=0;i<this.arBreakdownTable.length;i++){
            if(!this.arBreakdownTable[i]['当年']){
              this.arBreakdownTable[i]['当年'] = 0;
            }
            this.arSum1 += this.arBreakdownTable[i]['当年'];
            this.arBreakdownTable[i]['当年'] = this.toThousand(this.arBreakdownTable[i]['当年'].toFixed(2));
            if(!this.arBreakdownTable[i]['上一年']){
              this.arBreakdownTable[i]['上一年'] = 0;
            } 
            this.arSum2 += this.arBreakdownTable[i]['上一年'];
            this.arBreakdownTable[i]['上一年'] = this.toThousand(this.arBreakdownTable[i]['上一年'].toFixed(2));
          }
          this.arSum1x = this.toThousand(this.arSum1.toFixed(2));
          this.arSum2x = this.toThousand(this.arSum2.toFixed(2));
        }
      })
    }
    // 查询AR当前年与上一年费用对比(下拉框切换)
    switchCurrency(){
      this.checkARComparison();
    }

    checkEnterSearch($event) {
      if ($event.key === "Enter") {
        this.check();
      }
    }

    // 模糊查询
    check(){
      this.paginatorPage = 1;
      this.paginatorRow = 10;
      this.checkMainTable();
    }
    checkSummary1(){
      this.checkMaintable1();
      this.checkARComparison();
    }
    // 弹框里的模糊查询
    checkSummary(){
      if(this.summaryReport){
        this.checkBoxTable();
      }
      else if(this.paymentCashflow){
        this.checkBoxTable2();
      }
      else{
        this.checkBoxTable3();
      }
    }
    // switch 弹框双击事件
    returnNeed(val1,val2){
      this.adProjectCode = val1;
      this.prjCode = val2;
      this.selectInvestmentDialog = false;
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
              if(this.summaryReport){
                this.checkBoxTable();
              }
              else if(this.paymentCashflow){
                this.checkBoxTable2();
              }
              else{
                this.checkBoxTable3();
              }
          });
      });
    }
    // 弹框里的 switch project 按钮点击事件
    switchProject(){
      this.selectInvestmentDialog = true;
    }
    // 弹框里的 export 按钮点击事件
    export(){
      let totals = this.totalSum1.join();
      let miscs = this.totalPercent1.join();
      let timeStamp = new Date().getTime();
      let token = window.sessionStorage.getItem("access_token");
      let url: string = "/bpd-proj/bpd/projectBudgetDetail/exportExcelSummary?"+timeStamp+'&adProjectCode='+this.adProjectCode+'&budgetVersionName='+this.selectedVersion+'&currencyCode='+this.selectedCurrency+'&totals='+'Total,总计,'+totals+'&miscs='+'Misc,不可预见费,'+miscs;
      if (token) {
        let realToken = token.substr(1, token.length - 2)
        url = url + "&accessToken=" + realToken;
      }
      window.location.href = url;
    }
    export1(){
      let totals = this.totalSum8.join();
      console.log(totals);
      let timeStamp = new Date().getTime();
      let token = window.sessionStorage.getItem("access_token");
      let url: string = "/bpd-proj/bpd/projectBudgetDetail/exportExcelArSummary?"+timeStamp+'&arYear='+this.selectedYear+'&currencyCode='+this.selectedCurrency1+'&totals='+'Total,总计,'+totals;
      if (token) {
        let realToken = token.substr(1, token.length - 2)
        url = url + "&accessToken=" + realToken;
      }
      window.location.href = url;
    }
    export2(){
      let totals = this.arSum1 + ',' + this.arSum2;
      let timeStamp = new Date().getTime();
      let token = window.sessionStorage.getItem("access_token");
      let url: string = "/bpd-proj/bpd/projectBudgetDetail/exportExcelArYearSummary?"+timeStamp+'&arYear='+this.selectedYear+'&currencyCode='+this.selectedCurrency2+'&totals='+'Total,总计,'+totals;
      if (token) {
        let realToken = token.substr(1, token.length - 2)
        url = url + "&accessToken=" + realToken;
      }
      window.location.href = url;
    }
}
