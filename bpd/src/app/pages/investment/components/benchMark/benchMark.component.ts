import { Component, OnInit } from '@angular/core';
import 'style-loader!./benchMark.scss';
import { SelectItem, TreeNode, MenuItem } from 'primeng/primeng';
import { HttpDataService } from '../../../service/http.service';
import { MessageService } from '../../../service/message.service';
import { RefreshMenuService } from '../../../service/refreshMenu.service';
import { NgaModule } from '../../../../theme/nga.module';
import { DataManageService } from '../../../service/dataManage.service';

@Component({
  selector: 'bench-mark',
  templateUrl: './benchMark.html',
  providers: [HttpDataService, MessageService, RefreshMenuService, DataManageService,]
})
export class BenchMark implements OnInit{

    public msgs: any;

    public gridStore: any = [];

    public gridStoreLen: number;

    public gridStoreRows: any = '10';

    public gridStoreFirst: any = 0;

    public programStoreLen:number;

    public programStoreRows: any = '6';

    public programStoreFirst: any = 0;

    public haveStore: boolean = false;

    public display: boolean = false;

    public programStore: any = [];

    public programSelectedStore: any = [];

    // public programCodeSerch: string = null;

    public projectCodeSerch: string = null;

    public projectTypeSerch: string = null;

    public projectTypeSerchStore: any = [];

    public generalVehicleLookUpDisplay: boolean = false;

    public generalProgramCode: string = null;

    public generalPlatform: string = null;

    public generalBrand: string = null;

    public generalMarket: string = null;

    public generalLCA: string = null;

    public generalStyle: string = null;

    public generalClassificationStore: any = [];

    public generalClassification: string = null;

    public generalCompetitor: string = null;

    public generalProjectName: string = null;

    public generalProjectCode: string = null;

    public generalAVD: string = null;

    public generalCharacterStore: any = [{'value':null,'label':'All'},{'value':'Local','label':'Local'},{'value':'Global','label':'Global'},{'value':'Export','label':'Export'}];

    public generalCharacter: string = null;

    public generalRMB: string = null;

    public indexGridStore: any = [];

    public selectIndexDisplay: boolean = false;

    public selectIndexStore: any = [];

    public selectIndexSelectedStore: any = [];

    public budgetVersionStore: any = [];

    public budgetVersion: string = '';

    public sendArr: any = [];

    public compareStore: any = [];

    public compareExt2Store: any = [];

    public totalStore: any = [];

    public compareContentStore: any = [];

    public dialogTitle: string = '';

    public investmentStore: any = [];

    public investmentTitleStore: any = [];

    public investmentDisplay: boolean = false;

    public yearSerchStore: any = [];

    public sorpYearSerch: string = null;

    public sorpMonthSerch: string = null;

    public monthSerchStore: any = [];

    public emptyStore: any = [
      {'none':'','index':''},{'none':'','index':''},{'none':'','index':''},
      {'none':'','index':''},{'none':'','index':''},{'none':'','index':''},
      {'none':'','index':''},{'none':'','index':''},{'none':'','index':''},
      {'none':'','index':''},{'none':'','index':'-'},{'none':'','index':'-'}
    ];

	constructor(private service: HttpDataService, private msgservice: MessageService, private nga: NgaModule, private refreshMenuService: RefreshMenuService, private dataManageService: DataManageService) {
    let flag = this.dataManageService.getUuId()
    this.refreshMenuService.refreshMenu(flag);
    let currentYear = new Date().getFullYear();
    for(let i=0; i<15; i++) {
          this.yearSerchStore.push({
            label: (currentYear - 5 + i) + '年',
            value: currentYear -5 + i
          })
        }
        this.yearSerchStore.unshift({
        label: 'Select',
        value: null
      })
        for(let i=1; i<13; i++) {
          this.monthSerchStore.push({
            label: i + '月',
            value: i<10 ? "0"+i : i
          })
        }
        this.monthSerchStore.unshift({
        label: 'Sel',
        value: null
      })
	}
    
    ngOnInit() {
    }

    public RefreshDataBtn() {     // 清除数据
      this.haveStore = false;
    }

    public ExportBtn() {       // 数据导出
      let arr = [];
      for(let i=0; i<this.sendArr.length; i++) {
        if(arr.indexOf(this.sendArr[i]) == -1) {
          arr.push(this.sendArr[i])
        }
      }
      let token = window.sessionStorage.getItem("access_token");
      let url: string = "/bpd-proj/bpd/projectCostBook/exportExcelCostBook?projectIds="+""+"&totals="+this.totalStore.join(',') + '&_=' + Number(new Date());
      if (token) {
        let realToken = token.substr(1, token.length - 2)
        url = url + "&accessToken=" + realToken;
      }
      window.location.href = url;
    }

    public exportInvestmentBtn() {
      let arr = [];
      for(let i=0; i<this.sendArr.length; i++) {
        if(arr.indexOf(this.sendArr[i]) == -1) {
          arr.push(this.sendArr[i])
        }
      }
      let token = window.sessionStorage.getItem("access_token");
      let url: string = "/bpd-proj/bpd/projectCostBook/exportExcelRegion?projectIds="+""+"&regionCategoryCode="+this.exportItem['categoryCode'] + '&_=' + Number(new Date());
      if (token) {
        let realToken = token.substr(1, token.length - 2)
        url = url + "&accessToken=" + realToken;
      }
      window.location.href = url;
    }

    public SelectProjectBtn() {  // 选择对比弹出框显示
      this.sendArr = [];
      this.projectCodeSerch = null;
      this.service.get("/bpd-proj/bpd/projectBudgetIndex/deleteById?projectId="+""+"&"+Number(new Date()))
      .subscribe(data => {
        this.haveStore = false;
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
        this.service.post("/bpd-proj/bpd/allProjInfo/getAllProjectQuery",{
          "page": {
            "page": 1,
            "rows": 6
          },
          "benchMarkFlag": "1"
        })
        .subscribe(data1 => {
          this.programStore = [];
          this.programStoreLen = data1.total;
          this.programStoreFirst = 0;
          let data = data1.rows;
          if(data.length) {
            this.programSelectedStore = data[0];
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
            for(let i = 0; i < 6; i++) {
              if(!data[i]) {
                this.programStore.push({
                  "ip": i+1
                })
              } else {
                this.programStore.push(data[i])
              }
            }
            this.display = true;
            this.service.post("/bpd-proj/bpd/projectBudgetIndex/getList",{
              "projectId": this.programSelectedStore.projectCode
            })
            .subscribe(data => {
              this.indexGridStore = data;
            })
          }
        })
      })
    }

    public programGridRowClick(e) {
      this.service.post("/bpd-proj/bpd/projectBudgetIndex/getList",{
        "projectId": e.data.projectCode
      })
      .subscribe(data => {
        this.indexGridStore = data;
      })
    }

    public compareStore1: any = [];
    public compareStore2: any = [];
    public saveBtn() {        // 确认对比数据
      let arr = [];
      for(let i=0; i<this.sendArr.length; i++) {
        if(arr.indexOf(this.sendArr[i]) == -1) {
          arr.push(this.sendArr[i])
        }
      }
      this.service.get("/bpd-proj/bpd/projectBudgetIndex/getProjectIndexName?"+Number(new Date()))
      .subscribe(data => {
        this.service.get("/bpd-proj/bpd/projectCostBook/getProjectCostBookActual?"+Number(new Date()))
        .subscribe(data1 => {
          this.display = false;
          this.haveStore = true;
          if(data.projectIndexNameList) {
            this.compareStore = data.projectIndexNameList;
            this.compareStore1 = [];
            this.compareStore2 = [];
            for(let i=0; i<2; i++) {
              this.compareStore1.push(data.projectIndexNameList[i])
            }
            for(let i=2; i<data.projectIndexNameList.length; i++) {
              this.compareStore2.push(data.projectIndexNameList[i])
            }
            this.compareExt2Store = [];
            let arr = [];
            for(let i=2; i<data.projectIndexNameList.length; i++) {
              this.compareExt2Store.push(data.projectIndexNameList[i])
                let dataSum = 0;
              for(let j=0; j<data1.length-1; j++) {
                dataSum = data1[j][data.projectIndexNameList[i]] + dataSum;
              }
                arr.push(dataSum)
            }
            this.totalStore = arr;
          } else {
            this.compareStore = [];
            this.compareStore1 = [];
            this.compareStore2 = [];
            this.totalStore = [];
          }
          this.compareContentStore = data1;

        })
      })
    }

    public cancelBtn() {      // 选择对比弹出框关闭
      this.display = false;
    }

    public projectCodeEnterSearch($event) {
      if ($event.key === "Enter") {
        this.dialogLookUpBtn();
      }
    }
    
    public dialogLookUpBtn() {
      let e = {page: 0, first: 0, rows: "6"};
      this.paginate(e);
    }

    public generalLookupDisplay: boolean = false;

    public generalARLookUpDisplay: boolean = false;

    public generalBuildingLookUpDisplay: boolean = false;

    public generalPowerLookUpDisplay: boolean = false;

    public selectionChange(event) {
      this.generalLookupDisplay = false;
      this.projectTypeSerch = event.value;
      let e = {page: 0, first: 0, rows: "6"};
      this.paginate(e);
      if(event.value) {
        this.generalLookupDisplay = true;
      }
    }

    public paginate(e) {
      let params: any = {};
      if(this.projectTypeSerch == '110') {
        params = {
          programCode: this.generalProgramCode,
          projectType: this.projectTypeSerch,
          modelPlatform: this.generalPlatform,
          brandName: this.generalBrand,
          segmentMarket: this.generalMarket,
          lcaVolume: this.generalLCA,
          categoryCode: this.generalCategory,
          bodyStyle: this.generalStyle,
          competitor: this.generalCompetitor,
          projectName: this.generalProjectName,
          projectCode: this.projectCodeSerch,
          adProjectCode: this.generalAVD,
          investmentCharacter: this.generalCharacter,
          approveInvestment: this.generalRMB,
          sop: (this.sorpYearSerch ? this.sorpYearSerch : null) + (this.sorpMonthSerch ? "-" + this.sorpMonthSerch : null),
          ptModel: this.generalPtModel,
          projectLevelId: this.generalClassification,
          plantCode: this.plant,
          "page": {
            "page": e.page + 1,
            "rows": e.rows
          },
          "benchMarkFlag": "1"
        }
      } else if(this.projectTypeSerch == '120') {
        params = {
          programCode: this.generalProgramCode,
          projectType: this.projectTypeSerch,
          modelPlatform: this.generalPlatform,
          ptModel: this.PTModel,
          rpo: this.PTRPO,
          modelYear: this.PTModelYear,
          projectLevelId: this.generalClassification,
          ptCount1: this.PTCount,
          competitor: this.generalCompetitor,
          projectName: this.generalProjectName,
          projectCode: this.projectCodeSerch,
          adProjectCode: this.generalAVD,
          investmentCharacter: this.generalCharacter,
          approveInvestment: this.generalRMB,
          categoryCode: this.generalCategory,
          plantCode: this.plant,
          sop: (this.sorpYearSerch ? this.sorpYearSerch : null) + (this.sorpMonthSerch ? "-" + this.sorpMonthSerch : null),
          "page": {
            "page": e.page + 1,
            "rows": e.rows
          },
          "benchMarkFlag": "1"
        }
      } else if(this.projectTypeSerch == '200') {
          params = {
            projectName: this.buildingProjectName,
            projectCode: this.projectCodeSerch,
            adProjectCode: this.buildingAVDCode,
            categoryCode: this.generalCategory,
            sop: (this.sorpYearSerch ? this.sorpYearSerch : null) + (this.sorpMonthSerch ? "-" + this.sorpMonthSerch : null),
            landArea: this.landArea,
            buildArea: this.buildingArea,
            loc: this.location,
            "page": {
              "page": e.page + 1,
              "rows": e.rows
            },
            projectType: '200',
            "benchMarkFlag": "1"
          }
      } else if(this.projectTypeSerch == '300') {
        params = {
          arYear: this.ARYear,
          projectCode: this.projectCodeSerch,
          "page": {
            "page": e.page + 1,
            "rows": e.rows
          },
          projectType: '300',
          "benchMarkFlag": "1"
        }
      } else {
        params = {
          projectCode: this.projectCodeSerch,
          "page": {
            "page": e.page + 1,
            "rows": e.rows
          },
          "benchMarkFlag": "1"
        }
      }
      this.service.post("/bpd-proj/bpd/allProjInfo/getAllProjectQuery",params)
      .subscribe(data1 => {
        let data = data1.rows;
        if(data.length) {
          this.programStore = [];
          this.programStoreLen = data1.total;
          this.programStoreRows = e.rows;
          this.programStoreFirst = e.first;
          this.programSelectedStore = data[0];
          for(let i = 0; i < data.length; i++) {
            data[i].id = i + 1;
          }
          for(let i = 0; i < e.rows; i++) {
            if(!data[i]) {
              this.programStore.push({
                "ip": i+1
              })
            } else {
              this.programStore.push(data[i])
            }
          }
          this.service.post("/bpd-proj/bpd/projectBudgetIndex/getList",{
            "projectId": this.programSelectedStore.projectCode
          })
          .subscribe(data => {
            this.indexGridStore = data;
          })
        } else {
          this.programStore = [{ip:1},{ip:2},{ip:3},{ip:4},{ip:5},{ip:6}];
        }
      })
    }

    public ARYearStore:any = [];
    public ARYear: string = null;
    public PTModel: string = null;
    public PTRPO: string = null;
    public PTModelYear: string = null;
    public PTCount: string = null;
    public buildingProjectName: string = null;
    public buildingProjectCode: string = null;
    public buildingAVDCode: string = null;
    public ARProjectCode: string = null;

    public generalLookup() {     // 精确搜索
      this.generalProgramCode = null;
      this.generalPlatform = null;
      this.generalBrand = null;
      this.generalMarket = null;
      this.generalLCA = null;
      this.generalStyle = null;
      this.generalCompetitor = null;
      this.generalProjectName = null;
      this.generalProjectCode = null;
      this.generalAVD = null;
      this.generalCharacter = null;
      this.generalRMB = null;
      this.ARYear = null;
      this.PTModel = null;
      this.PTRPO = null;
      this.PTModelYear = null;
      this.PTCount = null;
      this.buildingProjectName = null;
      this.buildingProjectCode = null;
      this.buildingAVDCode = null;
      this.ARProjectCode = null;
      this.generalCategory = "";
      this.plant = "";
      this.generalPtModel = "";
      this.generalPtCount = "";
      this.sorpYearSerch = "";
      this.sorpMonthSerch = "";
      this.landArea = "";
      this.buildingArea = "";
      this.location = "";
      if(this.projectTypeSerch == '300') {
        this.generalARLookUpDisplay = true;
        this.service.post("/bpd-proj/bpd/arProject/getArYearCombobox",{})
        .subscribe(data => {
          if(data) {
            this.ARYearStore = data;
            this.ARYearStore.unshift({
              label: "Select",
              value: null
            })
            this.ARYear = data[0].value;
          }
        })
      } else if(this.projectTypeSerch == '200') {
        this.generalBuildingLookUpDisplay = true;
        this.service.get("/bpd-proj/bpd/projectCategory/getInvestAssumeCatCombobox?projectType=200&"+Number(new Date()))
        .subscribe(data => {
          if(data) {
            this.generalCategoryStore = data;
            this.generalCategoryStore.unshift({
              label: "Select",
              value: null
            })
            this.generalCategory = data[0].value;
          }
        })
      } else if(this.projectTypeSerch == '120') {
        this.generalPowerLookUpDisplay = true;
        this.service.get("/bpd-proj/bpd/projectLevel/getProjectLevelNameCombobox?projectType=120&"+Number(new Date()))
        .subscribe(data => {
          if(data) {
            this.generalClassificationStore = data;
            this.generalClassificationStore.unshift({
              label: "Select",
              value: null
            })
            this.generalClassification = data[0].value;
          }
        })
        this.service.get("/bpd-proj/bpd/projectCategory/getInvestAssumeCatCombobox?projectType=120&"+Number(new Date()))
        .subscribe(data => {
          if(data) {
            this.generalCategoryStore = data;
            this.generalCategoryStore.unshift({
              label: "Select",
              value: null
            })
            this.generalCategory = data[0].value;
          }
        })
        this.service.post("/bpd-proj/bpd/plant/getInvestAssumeCatCombobox",{})
        .subscribe(data => {
          this.plantStore = data;
          if(data.length) {
            this.plantStore.unshift({
              label: "Select",
              value: null
            })
            this.plant = data[0].value;
          }
        })
      } else if(this.projectTypeSerch == '110') {
        this.service.get("/bpd-proj/bpd/projectCategory/getInvestAssumeCatCombobox?projectType=100&"+Number(new Date()))
        .subscribe(data => {
          if(data) {
            this.generalCategoryStore = data;
            this.generalCategoryStore.unshift({
              label: "Select",
              value: null
            })
            this.generalCategory = data[0].value;
          }
        })
        this.service.post("/bpd-proj/bpd/plant/getInvestAssumeCatCombobox",{})
        .subscribe(data => {
          this.plantStore = data;
          if(data.length) {
            this.plantStore.unshift({
              label: "Select",
              value: null
            })
            this.plant = data[0].value;
          }
        })
        this.service.get("/bpd-proj/bpd/projectLevel/getProjectLevelNameCombobox?projectType=100&"+Number(new Date()))
        .subscribe(data => {
          if(data) {
            this.generalClassificationStore = data;
            this.generalClassificationStore.unshift({
              label: "Select",
              value: null
            })
            this.generalClassification = data[0].value;
          }
        })
        this.generalVehicleLookUpDisplay = true;
      }
    }

    public generalCategoryStore: any = [];
    public generalCategory: string = "";
    public plantStore: any = [];
    public plant: string = "";
    public generalPtModel: string = "";
    public generalPtCount: string = "";
    public landArea: string = "";
    public buildingArea: string = "";
    public location: string = "";

    public lookupSaveBtn() {
      let params: any = {};
      if(this.projectTypeSerch == '110') {
        params = {
          programCode: this.generalProgramCode,
          projectType: this.projectTypeSerch,
          modelPlatform: this.generalPlatform,
          brandName: this.generalBrand,
          segmentMarket: this.generalMarket,
          lcaVolume: this.generalLCA,
          categoryCode: this.generalCategory,
          bodyStyle: this.generalStyle,
          competitor: this.generalCompetitor,
          projectName: this.generalProjectName,
          projectCode: this.projectCodeSerch,
          adProjectCode: this.generalAVD,
          investmentCharacter: this.generalCharacter,
          approveInvestment: this.generalRMB,
          sop: (this.sorpYearSerch ? this.sorpYearSerch : null) + (this.sorpMonthSerch ? "-" + this.sorpMonthSerch : null),
          plantCode: this.plant,
          projectLevelId: this.generalClassification,
          "page": {
            "page": 1,
            "rows": 6
          },
          "benchMarkFlag": "1"
        }
      } else if(this.projectTypeSerch == '120') {
        params = {
          programCode: this.generalProgramCode,
          projectType: this.projectTypeSerch,
          modelPlatform: this.generalPlatform,
          ptModel: this.PTModel,
          rpo: this.PTRPO,
          modelYear: this.PTModelYear,
          projectLevelId: this.generalClassification,
          ptCount1: this.PTCount,
          competitor: this.generalCompetitor,
          projectName: this.generalProjectName,
          projectCode: this.projectCodeSerch,
          adProjectCode: this.generalAVD,
          investmentCharacter: this.generalCharacter,
          approveInvestment: this.generalRMB,
          categoryCode: this.generalCategory,
          plantCode: this.plant,
          sop: (this.sorpYearSerch ? this.sorpYearSerch : null) + (this.sorpMonthSerch ? "-" + this.sorpMonthSerch : null),
          "page": {
            "page": 1,
            "rows": 6
          },
          "benchMarkFlag": "1"
        }
      } else if(this.projectTypeSerch == '200') {
          params = {
            projectName: this.buildingProjectName,
            projectCode: this.projectCodeSerch,
            adProjectCode: this.buildingAVDCode,
            categoryCode: this.generalCategory,
            sop: (this.sorpYearSerch ? this.sorpYearSerch : null) + (this.sorpMonthSerch ? "-" + this.sorpMonthSerch : null),
            landArea: this.landArea,
            buildArea: this.buildingArea,
            loc: this.location,
            "page": {
              "page": 1,
              "rows": 6
            },
            projectType: '200',
            "benchMarkFlag": "1"
          }
      } else if(this.projectTypeSerch == '300') {
        params = {
          arYear: this.ARYear,
          projectCode: this.projectCodeSerch,
          "page": {
            "page": 1,
            "rows": 6
          },
          projectType: '300',
          "benchMarkFlag": "1"
        }
      } else {
        params = {
          projectCode: this.projectCodeSerch,
          "page": {
            "page": 1,
            "rows": 6
          },
          "benchMarkFlag": "1"
        }
      }
      this.service.post("/bpd-proj/bpd/allProjInfo/getAllProjectQuery",params)
      .subscribe(data1 => {
        let data = data1.rows
        this.programStore = [];
        this.programStoreLen = data1.total;
        this.programSelectedStore = data[0];
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
        for(let i = 0; i < 6; i++) {
          if(!data[i]) {
            this.programStore.push({
              "ip": i+1
            })
          } else {
            this.programStore.push(data[i])
          }
        }
        if(this.projectTypeSerch == '300') {
          this.generalARLookUpDisplay = false;
        } else if(this.projectTypeSerch == '200') {
          this.generalBuildingLookUpDisplay = false;
        } else if(this.projectTypeSerch == '120') {
          this.generalPowerLookUpDisplay = false;
        } else if(this.projectTypeSerch == '110') {
          this.generalVehicleLookUpDisplay = false;
        }
      })
    }

    public SelectIndexBtn() {    //   选择对比指标及版本
      this.sendArr = [];
      this.service.post("/bpd-proj/bpd/budgetIndex/getList",{})
      .subscribe(data => {
        if(data.length){
          this.selectIndexStore = data;
          let arr: any = [];
          for(let i = 0; i< this.indexGridStore.length; i++) {
            arr.push(this.selectIndexStore[this.indexGridStore[i].indexId - 1])
          }
          this.selectIndexSelectedStore = arr;
          this.service.get("/bpd-proj/bpd/projectCostBook/getCostBookBudgetCombobox?adProjectCode="+this.programSelectedStore.projectCode+"&"+Number(new Date()))
          .subscribe(data1 => {
            if(data1.length){
              for(let i=0; i<this.selectIndexStore.length; i++) {
                this.selectIndexStore[i].budgetVersion = data1;
                if(this.selectIndexStore[i].flag) {
                  if(this.indexGridStore.length) {
                    for(let j = 0; j< this.indexGridStore.length; j++) {
                      if(this.indexGridStore[j].indexId == this.selectIndexStore[i].indexId) {
                        this.selectIndexStore[i].budgetVersionName = this.indexGridStore[j].budgetVersionName;
                      } else {
                        this.selectIndexStore[i].budgetVersionName = data1[0].value;
                      }
                    }
                  } else {
                    this.selectIndexStore[i].budgetVersionName = data1[0].value;
                  }
                } else {
                  this.selectIndexStore[i].budgetVersionName = null;
                }
              }
              this.budgetVersionStore = data1;
            } else {
              this.budgetVersionStore = [];
              this.budgetVersion = null;
            }
            this.selectIndexDisplay = true;
          })
        }
      })
    }

    public budegetChange(e,item) {
      console.log(e,item)
    }

    public selectIndexSaveBtn() {
      let params: any = [];
      for(let i=0; i<this.selectIndexSelectedStore.length; i++){
        params.push({
          "projectId": this.programSelectedStore.projectCode,
          "adProjectCode": this.programSelectedStore.adProjectCode, 
          "indexId": this.selectIndexSelectedStore[i].indexId,
          "budgetVersionName": (this.selectIndexSelectedStore[i].indexId == 5 || this.selectIndexSelectedStore[i].indexId == 6) ? (this.budgetVersionStore[0] ? this.budgetVersionStore[0].value : "") : this.selectIndexSelectedStore[i].budgetVersionName
        })
        this.sendArr.push(this.programSelectedStore.projectCode);
      }
      if(!params) {
        this.msgservice.showInfo("Please Select Index");
        this.msgs = this.msgservice.msgs;
        return;
      }
      this.service.post("/bpd-proj/bpd/projectBudgetIndex/insert",params)
      .subscribe(data => {
        if(data['code'] == 1) {
          this.service.post("/bpd-proj/bpd/projectBudgetIndex/getList",{
            "projectId": this.programSelectedStore.projectCode
          })
          .subscribe(data => {
            this.indexGridStore = data;
          })
          this.msgservice.showSuccess("Success");
          this.msgs = this.msgservice.msgs;
        } else {
          this.msgservice.showError("Operation Error!");
          this.msgs = this.msgservice.msgs;
        }
      })
      this.selectIndexDisplay = false;
    }

    public selectIndexCancelBtn() {
      this.selectIndexDisplay = false;
    }

    public ClearIndexBtn() {     //   清空对比
      this.service.get("/bpd-proj/bpd/projectBudgetIndex/deleteById?projectId="+this.programSelectedStore.projectCode+"&"+Number(new Date()))
      .subscribe(data => {
        if(data['code'] == 1) {
          this.indexGridStore = [];
          if(this.sendArr.indexOf(this.programSelectedStore.projectCode)) {
            this.sendArr.splice(this.sendArr.indexOf(this.programSelectedStore.projectCode),1)
          }
          this.msgservice.showSuccess("Success");
          this.msgs = this.msgservice.msgs;
        } else {
          this.msgservice.showError("Operation Error!");
          this.msgs = this.msgservice.msgs;
        }
      })
    }

    public exportItem: any = {};
    public categoryClick(item,tdItem) {
      this.exportItem = item;
      let arr = [];
      for(let i=0; i<this.sendArr.length; i++) {
        if(arr.indexOf(this.sendArr[i]) == -1) {
          arr.push(this.sendArr[i])
        }
      }
      if(tdItem == 'Region Category' && item['Region Category'] !== 'Misc') {
        this.service.get("/bpd-proj/bpd/projectCostBook/getProjectCostBookActualByRegionCate?projectIds="+arr.join(',')+"&regionCategoryCode="+item['categoryCode']+"&"+Number(new Date()))
        .subscribe(data => {
          this.dialogTitle = item['Region Category'];
          this.investmentDisplay = true;
          this.investmentStore = [];
          for(let i = 0; i < data.length; i++) {
            data[i].id = i + 1;
            this.investmentStore.push(data[i])
          }
          // for(let i = 0; i < 10; i++) {
          //   if(!data[i]) {
          //     this.investmentStore.push({
          //       'ip': i
          //     })
          //   } else {
          //     this.investmentStore.push(data[i])
          //   }
          // }
          this.investmentTitleStore = ['L1~L3','L4~L5','Item Name'].concat(this.compareExt2Store);
        })
      }
    }


    //  /bpd-proj/bpd/regionCatAssumeIndex/getVList  post regionCatCode '01'
};