import {Component, OnInit} from '@angular/core';
import 'style-loader!./investmentStatus.scss';
import {Message} from 'primeng/primeng';
import {HttpDataService} from '../../../service/http.service';
import {MessageService} from "../../../service/message.service";
import {DataManageService} from "../../../service/dataManage.service";
import {
    RefreshMenuService
} from '../../../service/refreshMenu.service';
@Component({
    selector: 'investment-status',
    templateUrl: './investmentStatus.html',
    providers: [RefreshMenuService]
})
export class investmentStatusComponent {
    projectTable:any[];
    projectTypes:any[]=[];
    selectedType:any;
    projectCode:any;
    projectName:any;
    Classification:any;
    prjCode:any;
    adProjectCode:any;
    projectType:any;
    investmentTable:any[]=[];
    showStatus:boolean = false;
    pieData:any;
    barData:any;
    getData:any;
    fuck:boolean = false;
    summaryTable:any[] = [];
    selectInvestmentDialog:boolean = false;
    paginatorPage:number;
    paginatorRow:number;
    totalRecord:number;
    flag: any;
    flag2: any;

    public checked: boolean = true;

    constructor(private httpService: HttpDataService,private msgService: MessageService, private dataManageService: DataManageService, private refreshMenuService: RefreshMenuService){
        // 刷新菜单默认选中项
        let flag = this.dataManageService.getUuId()
        this.refreshMenuService.refreshMenu(flag);
    }
    ngOnInit(){
      this.paginatorPage = 1;
      this.paginatorRow = 10;
      this.httpService.post("/bpd-proj/bpd/projectType/getPTCombobox",{})
      .subscribe(data => {
        this.projectTypes = []
        for(let i=0; i<data.length; i++) {
                if(data[i].value != 100) {
                    this.projectTypes.push({
                        label: data[i].label,
                        value: data[i].value
                    })
                }
            }
          this.projectTypes.unshift({
            label:"All",
            value:""
          })
      })
      this.checkMainTable();
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
        "projectType":this.selectedType,
        "projectCode":this.projectCode,
        "projectName":this.projectName,
        "levelName": this.Classification,
        "costBookFlag":'5',
        "projectManager": this.checked ? window.localStorage.getItem("user") : null,
        "page": {
          "page": this.paginatorPage,
          "rows": this.paginatorRow
      }
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

    checkEnterSearch($event) {
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
      this.fuck = false;
      this.investmentTable = [];
      this.httpService.post("/bpd-proj/bpd/allProjInfo/getBudgetByRegionGroup",{
        "adProjectCode":this.adProjectCode,
        "projectCode":this.prjCode,
        "projectType":this.projectType
      })
      .subscribe(data => {
        if(data){
          this.getData = data;
          let newData = [];
          for(let i=0;i<this.getData.group.length;i++){
            let keven = {
              name: this.getData.group[i],
              value: this.getData.currentBudget[i]
            };
            newData.push(keven);
          }
          // this.pieData = {
          //   labels: this.getData.group,
          //   datasets: [
          //     {
          //         data: this.getData.totalCost,
          //         backgroundColor: [
          //             "#FF6384",
          //             "#36A2EB",
          //             "#FFCE56",
          //             "#C23531",
          //             "#BDA29A",
          //             "#570E1A"
          //         ],
          //         hoverBackgroundColor: [
          //             "#FF6384",
          //             "#36A2EB",
          //             "#FFCE56",
          //             "#C23531",
          //             "#BDA29A",
          //             "#570E1A"
          //         ]
          //     }
          //   ],
          // }; 
          this.pieData = {
            // title : {
            //     text: '某站点用户访问来源',
            //     subtext: '纯属虚构',
            //     x:'center'
            // },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: this.getData.group
            },
            series : [
                {
                    // name: '访问来源',
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    selectedMode: 'mutiple',
                    data: newData,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
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
        if(this.getData.group.length>0){
          for(let i=0;i<this.getData.group.length;i++){
            let opp = {
              group:this.getData.group[i],
              currentBudget:this.getData.currentBudget[i],
              totalCost:this.getData.totalCost[i]
            };
            this.investmentTable.push(opp);
          }
        }
        this.fuck = true;
        }
      });
    }
    // 弹框investment summary 数据请求事件
    requestSummaryTable(){
      let timeStamp = new Date().getTime();
      this.httpService.get("/bpd-proj/bpd/allProjInfo/getBudgetByRegionAct?"+timeStamp+"&projectCode="+this.prjCode)
      .subscribe(data => {
        this.summaryTable = data;
      })
    }
    // 弹框中的按钮事件
    switch(){
      this.selectInvestmentDialog = true;
    }
    // 表格view列点击事件
    openBox(value1,value2,val3){
      this.prjCode = value1;
      this.adProjectCode = value2;
      this.projectType = val3;
      this.fuck = false;
      this.requestBoxData();
      this.requestSummaryTable();
      this.showStatus = true;
    }
    // switch 弹框双击事件
    returnNeed(e){
      this.adProjectCode = e.data.adProjectCode;
      this.prjCode = e.data.projectCode;
      this.projectType = e.data.projectType;
      this.selectInvestmentDialog = false;
      this.requestBoxData();
      this.requestSummaryTable();
    }
    // 分页请求
    paginate(e){
      // this.flag = -1;
      this.paginatorPage = e.page + 1;
      this.paginatorRow = e.rows;
      this.checkMainTable();
    }
}
