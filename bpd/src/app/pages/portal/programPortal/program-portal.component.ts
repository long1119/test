/**
 * Created by 田建辉 on 2017/8/22.
 */
import {Component,OnInit} from '@angular/core';
import { HttpDataService} from '../../service/http.service';
import {MessageService} from "../../service/message.service";
import { Message} from 'primeng/primeng';
import 'style-loader!./program-portal.scss';
import {LocalStorage} from '../workPortal/local.storage'
@Component({
    selector:'program-portal',
    templateUrl:'./program-portal.html'
})
export class programPortalComponent{
    display:boolean = false;
    showProgram:boolean = false;
    showElementConfig:boolean = false;
    setPQRRdate:any;
    // card3 里的变量
    programCode:any;
    modelYear:any;
    totalRecord:number;
    projectInformationTable:any[]=[];
    paginatorPage:number;
    paginatorRow:number;
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
    msgs: Message[];
    tab:any[];
    fromFather:any;  //  CR/DN 需要（父给子）
    scoreStatus:string;  //   （父给子）
    fuck:boolean = false;
    // card1 中数据
    vehiclePortal:any[]=[];

    fromScore:boolean = false;     //2017/12/13
    fuck1:boolean = false;
    router:any[] = [];
    mixedRouter:any;
    constructor(private httpService: HttpDataService, private msgService: MessageService,private ls: LocalStorage) {
    }
    ngOnInit(){
        this.router = ["time-sheet","crdn-tracking","buget-template","score-card","nod","meeting","pet-member","so-list","document-management"];
        this.httpService.post("/bpd-proj/bpd/portal/getVehicleManagePendList",{
          "userCode":this.ls.get('user')
        }).subscribe(data => {
          this.vehiclePortal = data;
        })
        this.paginatorPage = 1;
        this.paginatorRow = 10;
        this.getInformationData();
        // this.httpService.get("/bpd-proj/bpd/qualityagent/getCountOfPQRR?userCode="+this.ls.get('user'))
        // .subscribe(data => {
        //     this.setPQRRdate = data;
        // });
        this.tab = [true,false,false,false,false,false,false];
        let localRouter1 = JSON.parse(this.ls.get('menusOne'));
        let localRouter2 = JSON.parse(this.ls.get('menusTwo'));
        let routerOfInvestment1 = [];
        for(let i=0;i<localRouter1.length;i++){
          if(localRouter1[i].children != null){
            for(let j=0,len= localRouter1[i].children.length;j<len;j++){
              let child = localRouter1[i].children[j].path;
              routerOfInvestment1.push(child);
            }
          }
        };
        let routerOfInvestment2 = [];
        for(let i=0;i<localRouter2.length;i++){
          if(localRouter2[i].children != null){
            for(let j=0,len= localRouter2[i].children.length;j<len;j++){
              let child = localRouter2[i].children[j].path;
              routerOfInvestment2.push(child);
            }
          }
        };
        let setRouter = new Set(this.router);
        let union = new Set([...routerOfInvestment1,...routerOfInvestment2]);
        this.mixedRouter = new Set(Array.from(union).filter(x => (setRouter.has(x))));
    };
    // card1中弹框关闭
    shutDown(){
      if(this.fromScore){
        this.httpService.post("/bpd-proj/bpd/portal/getVehicleManagePendList",{
          "userCode":this.ls.get('user')
        }).subscribe(data => {
          this.vehiclePortal = data;
        })
      }
      this.fuck = false;
      this.display = false;
    }
    // card3中弹窗关闭
    cutDown(){
      this.fuck1 = false;
      this.showProgram = false;
    }
    // 从子组件取数据
    getData(e){
      this.fromScore = e;
      if(this.fromScore){
        this.httpService.post("/bpd-proj/bpd/portal/getVehicleManagePendList",{
          "userCode":this.ls.get('user')
        }).subscribe(data => {
          this.vehiclePortal = data;
        })
      }
    }
     // card1中的点击事件
     open1(){
        this.display = true;
        this.fuck = true;
        for(let i=0;i<this.tab.length;i++){
          this.tab[i] = false;
        }
        this.tab[0]=true;
        // this.httpService.post("/bpd-proj/bpd/gvdpTemplate/getVList", {})
        // .subscribe(data => {
        //     // this.GVDPdata = data
        // });
     }
     open2(){
      this.display = true;
      this.fuck = true;
      for(let i=0;i<this.tab.length;i++){
        this.tab[i] = false;
      }
      this.tab[1]=true;
     }
     open3(){
      this.display = true;
      this.fuck = true;
      for(let i=0;i<this.tab.length;i++){
        this.tab[i] = false;
      }
      this.tab[2]=true;
    }
    open4(){
      this.display = true;
      this.fuck = true;
      for(let i=0;i<this.tab.length;i++){
        this.tab[i] = false;
      }
      this.tab[3]=true;
    }
    open5(){
      this.display = true;
      this.fuck = true; 
      for(let i=0;i<this.tab.length;i++){
        this.tab[i] = false;
      }
      this.tab[4]=true;
    }
    open6(){
      this.scoreStatus = "feedback";
      this.display = true;
      this.fuck = true;
      for(let i=0;i<this.tab.length;i++){
        this.tab[i] = false;
      }
      this.tab[5]=true;
    }
    open7(){
      this.scoreStatus = "prepare";
      this.display = true;
      this.fuck = true;
      for(let i=0;i<this.tab.length;i++){
        this.tab[i] = false;
      }
      this.tab[5]=true;
    }
    open8(){
      this.scoreStatus = "approval";
      this.display = true;
      this.fuck = true;
      for(let i=0;i<this.tab.length;i++){
        this.tab[i] = false;
      }
      this.tab[5]=true;
    }
    lookUpEnterSearch($event) {
      if ($event.key === "Enter") {
        this.lookUp();
      }
    }
    //查询按钮事件
    lookUp(){
        this.getInformationData();
    }
    // card3 中的分页事件
  paginate($event) {
    this.paginatorPage = $event.page + 1;
    this.paginatorRow = $event.rows;
    this.getInformationData();
  }
    // project information board 第二列的点击事件
    openProgram(val1,val2,val3){
       this.showProgram = true;
       this.fuck1 = true;
       this.fromFather = {
        "adProjectCode":val1,
        "programCode":val2,
        "projectStauts":val3
       };
    }

    // project information board 第9列的点击事件
    // openElementConfig(){
    //     this.showElementConfig = true;
    // }

    // project information board 查询事件
    getInformationData(){
        this.httpService.post("/bpd-proj/bpd/vehicleProject/getVehicleProjectOfIndex",{
            "page": {
                "page": this.paginatorPage,
                "rows": this.paginatorRow
              },
            "modelYear":this.modelYear,
            "programCode":this.programCode
        }).subscribe(data => {
            this.totalRecord = data.total;
            this.projectInformationTable = data.rows;
            for(let i=0;i<this.projectInformationTable.length;i++){
              if(this.projectInformationTable[i].vehicleProjectOfMilestones == null){
                this.projectInformationTable[i].vehicleProjectOfMilestones = [];
              }
              // else{
              //   let kk = this.projectInformationTable[i].projectSchedule.split(";");
              //   let k1 = kk[0].split(",");
              //   let k2 = kk[1].split(",");
              //   let k3 = [];
              //   for(let j=0;j<k1.length;j++){
              //     let k4 = {
              //       "key":k1[j],
              //       "value":k2[j]
              //     };
              //     k3.push(k4);
              //   }
              //   this.projectInformationTable[i].projectSchedule = k3;
              // }
            }
        })
    }
    // project information board 第一列设置状态颜色
    giveColor(value){
        if(value == 1){
            return "green";
        }
        else if(value == 2){
            return "yellow";
        }
        else if(value == 3){
            return "red";
        }
        else{
            return '';
        }
    }
    giveColor1(value){
      if(value == 1){
        return "#92D050";
      }
      else if(value == 0){
        return "gray";
      }
      else if(value == 2){
        return "red";
      }
    }
    // 拖放事件

    //放到何处
    allowDrop(ev)
    {
    ev.preventDefault();
    }
    
    //拖动开始
    drag(ev)
    {
    ev.dataTransfer.setData("Text",ev.target.id);
    }
    
    //进行放置
    drop(ev)
    {
    ev.preventDefault();
    var data=ev.dataTransfer.getData("Text");
    ev.target.appendChild(document.getElementById(data));
    }

    // card2 中的shared documents点击事件
    // openDocument(){
    //     this.showDocuments = true;
    // }
   // card2 中的shared documents请求数据
  //  requestDocuments(){
  //    this.httpService.post("",{

  //    }).subscribe(data => {
  //      this.documentTable = data;
  //    })
  //  }
  // checkUpEnterSearch($event) {
  //   if ($event.key === "Enter") {
  //     this.checkUp();
  //   }
  // }
  // card2 中的shared documents弹框中查询事件
  // checkUp(){
  //   this.requestDocuments();
  // }
     // ----------------------close report 待办
  checkMainTable(){
    this.httpService.post("/bpd-proj/bpd/allProjInfo/getCloseReport",{
      "projectType":this.choosedType,
      "projectCode":this.projectCode1,
      "page": {
        "page": this.paginatorPage2,
        "rows": this.paginatorRow2
    }
    }).subscribe(data1 => {
      this.totalRecord = data1.total;
      let data = data1.rows;
      for(let i = 0; i < data.length; i++) {
        if(data[i].projectStatus == 0) {
            data[i].projectStatus = 'Runing';
        } else if(data[i].projectStatus == 1) {
            data[i].projectStatus = 'Closed';
        } else {
            data[i].projectStatus = 'Initial';
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
  sousuo(){
    this.paginatorPage2 = 1;
    this.paginatorRow2 = 10;
    this.checkMainTable();
  }
  export(){
    this.httpService.post("/bpd-proj/bpd/allProjInfo/exportExcel",{
      "adProjectCode": this.adProjectCode1,
      "projectCode": this.projectCode2
    }).subscribe(data => {
      this.exportTable = data;
      this.second = false;
      this.first = true;
    })
  }
  tijiao(){
    this.httpService.post("/bpd-proj/bpd/allProjInfo/CloseReport",{
      "adProjectCode": this.adProjectCode1,
      "projectType": this.projectType1
    }).subscribe(data => {
      if(data.code == 1){
        this.msgService.showSuccess('Opration succeed!');
      }
      else{
        this.msgService.showError('Opration failed!');
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

  /**
   * 刷新首页
   * 
   * @param {any} $event 
   * @memberof programPortalComponent
   */
  public refreshAgent($event) {
    console.log("program-portal");
    this.httpService.post("/bpd-proj/bpd/portal/getVehicleManagePendList",{
      "userCode":this.ls.get('user')
    })
      .subscribe(data => {
        this.vehiclePortal = data;
      })   
  }
}