import {Component,OnInit,Input,Output,EventEmitter} from '@angular/core';
import { HttpDataService} from '../../../../service/http.service';
import {MessageService} from "../../../../service/message.service";
import {Message,SelectItem} from 'primeng/primeng';
import 'style-loader!./vehicleManagement.scss';
import {LocalStorage} from '../../../workPortal/local.storage';
import {DataManageService} from '../../../../service/dataManage.service'

@Component({
    selector: "vehicleManagement",
    templateUrl: './vehicleManagement.html'
})
export class vehicleManagementComponent{
    status:SelectItem[];
    programCode:any;
    selectedStatus:any;
    timeSheetTable:any[];
    masterTimeSheet:boolean = false;
    PQRRplan:boolean = false;
    edit:boolean = false;
    PQRRtable:any[] = [];
    PQRRDate:any[];
    newPQRRdate:any[]=[];
    Deliverables:any[];
    setStatus:boolean = false;
    // radio:boolean = true;
    // selectedValue:any = " ";
    files:boolean = false;
    DeliverablesTable:any[];
    response:any;
    msgs: Message[];
    public growLife: number = 5000;
    headerTitle:any;
    index:number;
    pqrrDate:any;
    preReviewDate:any;
    rePqrrDate:any;
    qualityId:any;
    programCode1:any[] = [];
    milestone:any[] = [];
    roleCode:any;
    selectedCode:any;
    selectedMilestone:any;
    deliverablesTable:any[];
    delivAgentId:any;
    picture_name:any;
    delivAgentId1:any;
    // meeting 变量
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
    // scorecard 变量
    scorecardTable:any[] = [];
    scoreTitle:any;
    scoreBox:boolean = false;
    reminderDay:number;
    prCode:any[]=[];
    selectedPrCode:any;
    scoreStatus:any[]=[];
    selectedScoreStatus:any;
    totalRecord:number;
    paginatorPage:number = 1;
    paginatorRow:number = 10;
    mileStone:any;
    planDate:any;
    intervalDay:any;
    boxOfscoreBox:boolean = false;
    boxInBox:boolean = false;
    scoreData:any[] = [];
    changeStatus:any;
    elsemetrics:any;
    elsegroup:any;
    elsedepartment:any;
    elseownerName:any;
    elseownerCode:any;
    elsetarget:any;
    elseStatus:any;
    dataType:any;
    subjectElse:any;
    subTargetElse:any;
    statusElse:any;
    changeTable:any[] = [];
    indexId:any;
    targetVolume:any;
    adProjectCode:any;
    pqrrMilestone:any;
    proposedVolume:any;
    subjectName:any;
    val1:any;
    val2:any;
    subject:any;
    targetVolumex:any;    // new add 2017/12/6
    dataSource:any;     //new 2017/12/8
    addJudge:boolean = false;
    indexId1:any[] = [];
    indexName:any[] = [];
    createUser:any;
    updateUser:any;
    roleCodes:any;
    // -----------------search user 弹框变量
    searchUser:boolean = false;
    dialogDepartment: string = null;
    dialogUserName: string = null;
    managerData: any = [];
    managerDataRows: any = '10';
    managerDataFirst: any = 0;
    managerDataLen: number;
    // 上传要使用的变量
    attId:any;
    attIds:any;
    bussinessId:any;
    bussinessId1:any;
    elseAdProjectCode:any;
    elseDeptId:any;
    elsePqrrMilestoneName:any;
    public yearRange: string;

    owner:any;
    timeCheck:boolean;
    newTime:any;   //new add 2018/1/25

    //流程变量
    public wfType: any = "nod";
    public nodCount: number;
    public timeSheetCount: number;
    public scoreCardCount: number;

    //懒加载
    public selectedNod: Boolean = true;
    public selectedTimeSheet: Boolean = true;
    public selectedScoreCard: Boolean = true;
    @Input () tabs:any[]=[];
    @Input () scorecardStatus:string;
    // @Input () 
    @Output () refreshAgent = new EventEmitter;
    @Output() event = new EventEmitter();
    changeLength:boolean = false;

    constructor(private httpService: HttpDataService, private msgService: MessageService,private ls: LocalStorage, private dataManageService: DataManageService) {
        // 日期年份设置
        let currentYear = new Date().getFullYear();
        this.yearRange = "" + (Number(currentYear) - 10) + ":" + (Number(currentYear) + 50);
    }
    ngOnInit(){
        // let uuid:string = this.dataManageService.getUuId();       
        // this.attId = "8888";
        this.newTime = new Date();
        this.types =[
            {label:'All',value:''},
            {label:'Participate',value:0},
            {label:'CC to me',value:1},
          ]
        this.selectedType = "";
        this.status = [];
        this.status.push({label:'Select Approve Status', value:''});
        this.status.push({label:'Waiting for Setting PQRR Date', value:0});
        this.status.push({label:'Has Set PQRR Date', value:1});
        this.scoreStatus = [
            {label:'Waiting for processing', value:null},
            {label:'Processed', value:'ok'}
        ];
        this.selectedScoreStatus = null;
        this.requestDropdownData();
        if(this.tabs[0] == true){
            this.wfType = "nod";
            this.selectedNod = true;
            this.selectedTimeSheet = false;
            this.selectedScoreCard = false;
        }
        else if(this.tabs[1] == true) {
            this.wfType = "timeSheet"
            this.selectedNod = false;
            this.selectedTimeSheet = true;
            this.selectedScoreCard = false;
        } else if (this.tabs[2]==true){
            this.requestBodyThree();
        }
        else if(this.tabs[3]==true){
            this.requestBodyFour();
        }
        else if(this.tabs[4]==true){
            this.requestBodyFive();
        }
        else if(this.tabs[5]==true){
            this.requestBodySix();
            this.wfType = "scorecard"
            this.selectedNod = false;
            this.selectedTimeSheet = false;
            this.selectedScoreCard = true;
        }
        // if(this.scorecardStatus == "feedback"){
        //     this.requestFeedbackScorecard();
        // }
        // else if(this.scorecardStatus == "prepare"){
        //     this.requestPrepareScorecard();
        // }
        // else {
        //     this.requestApprovalScorecard();
        // }

        // this.today = new Date();
        // this.year = this.today.getFullYear();
        // this.month = this.today.getMonth();
        // this.meetingTime = this.year+'-'+(this.month+1);
        // this.dateHandle(this.year,this.month);  
    };

    handleChange(e){
        if(e.index==0){
        //   this.requestBodyOne();
          this.wfType = "nod";
          this.selectedNod = true;
          this.selectedTimeSheet = false;
          this.selectedScoreCard = false;
        }
        else if(e.index==1){
        //   this.requestBodyTwo();
          this.wfType = "timeSheet";
          this.selectedNod = false;
          this.selectedTimeSheet = true;
          this.selectedScoreCard = false;
        }
        else if(e.index==2) {
          this.requestBodyThree();
        }
        else if(e.index == 3){
          this.requestBodyFour();
        }
        else if(e.index == 4){
            this.requestBodyFive();
        }
        else if(e.index == 5){
            this.requestBodySix();
            this.wfType = "scorecard";
            this.selectedNod = false;
            this.selectedTimeSheet = false;
            this.selectedScoreCard = true;

        }
      }
      requestBodyOne(){

      }
      requestBodyTwo(){

      }
      requestBodyThree(){
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
    //   PQRR 请求数据
      requestBodyFour(){
        let len = this.PQRRtable.length;
        this.httpService.post("/bpd-proj/bpd/qualityAgent/showQualityAgents",{
            agentStatus:this.selectedStatus,
            userCode:this.ls.get('user'),
            subject:this.programCode
        })
        .subscribe(data => {
            this.PQRRtable = data;
            this.owner = this.ls.get('userName');
            if(this.PQRRtable.length != len){
                this.changeLength = true;
                this.event.emit(this.changeLength);
            }
            else{
                this.changeLength = false;
            }
        });
      }

    //   Deliverables 请求数据
    requestBodyFive(){
        let timeStamp = new Date().getTime();
        this.httpService.get("/bpd-proj/bpd/delivAgent/getAgentComBox?"+timeStamp)
        .subscribe(data => {
            this.programCode1 = data.listProgramCode;
            this.milestone = data.listPQRR;
            this.programCode1.unshift(
                {"label":"All","value":null}
            );
            this.milestone.unshift(
                {"label":"All","value":null}
            )
        })
        this.getDeliverablesTable();
    }
    requestBodySix(){
        if(this.scorecardStatus == "feedback"){
            this.requestFeedbackScorecard();
        }
        else if(this.scorecardStatus == "prepare"){
            this.requestPrepareScorecard();
        }
        // else{
        //     this.requestApprovalScorecard();
        // }
    }
    //  Deliverables 请求表格数据
    getDeliverablesTable(){
        this.httpService.post("/bpd-proj/bpd/delivAgent/getDelivAgents",{
            programCode:this.selectedCode,
            userCode:this.ls.get('user'),
            pqrrMilestoneName:this.selectedMilestone
        })
        .subscribe(data => {
            this.deliverablesTable = data;
        });
    }
    // 打开弹框
    openMasterTimeSheet(){
        this.masterTimeSheet = true;
    }
    //弹框提交
    confirm(){
        this.masterTimeSheet = false;
    }
    // 打开PQRR弹框
    openPQRR(value,value1){
        let timeStamp = new Date().getTime();
        this.headerTitle = value;
        this.qualityId = value1;
        this.PQRRplan = true;
        this.httpService.get("/bpd-proj/bpd/quality/selectAllPQRRByQualityId?"+timeStamp+"&qualityId="+this.qualityId)
        .subscribe(data => {
            this.PQRRDate = data;
        })
    }
     // 打开PQRR弹框里的修改弹框
    openEdit(value,val1,val2,val3){
        this.edit = true;
        this.pqrrDate = val1;
        this.preReviewDate = val2;
        this.rePqrrDate = val3;
        this.index = value;
    }
    // 回车查询
    checkEnterSearch($event) {
        if ($event.key === "Enter") {
            this.check();
        }
    }
    // PQRR 模糊查询
    check(){
        this.requestBodyFour();
    }
    //  Deliverables 模糊查询
    check1(){
        this.getDeliverablesTable();
    }
    // 时间转换
    getNewTime(date){
        let yy = new Date(date).getFullYear();
        let MM = new Date(date).getMonth()+1;
        let dd = new Date(date).getDate();
        let y,m,d;
        if(yy<10){
            y = '0'+yy;
        }
        else{
            y = yy;
        }
        if(MM<10){
            m = '0'+MM;
        }
        else{
            m = MM;
        }
        if(dd<10){
            d = '0'+dd;
        }
        else{
            d = dd;
        }
        return date = y+'-'+m+'-'+d;
    }
    // 提交修改
    handover(){
        let one = new Date(this.preReviewDate);
        let two = new Date(this.pqrrDate);
        let three = new Date(this.rePqrrDate);
        if(this.rePqrrDate){
          if(three>two){
              this.timeCheck = two>one?true:false;
          }
          else{
              this.timeCheck = false;
          }
        }
        else{
            this.timeCheck = two>one?true:false;
        };
        if(this.timeCheck){
            this.edit = false;
            if(this.PQRRDate[this.index].qualityId==this.qualityId){
                this.PQRRDate[this.index].pqrrStatus = '1';
                this.changeLength = true;
            }
            else{
                this.changeLength = false;
            }
            if(this.pqrrDate){
                // var myDate1 = new Date(this.pqrrDate);
                // this.pqrrDate = myDate1.getFullYear()+'-'+(myDate1.getMonth()+1)+'-'+myDate1.getDate();
                this.pqrrDate = this.getNewTime(this.pqrrDate);
            }
            if(this.preReviewDate){
                // var myDate2 = new Date(this.preReviewDate);
                // this.preReviewDate = myDate2.getFullYear()+'-'+(myDate2.getMonth()+1)+'-'+myDate2.getDate();
                this.preReviewDate = this.getNewTime(this.preReviewDate);
            }
            if(this.rePqrrDate){
                // var myDate3 = new Date(this.rePqrrDate);
                // this.rePqrrDate = myDate3.getFullYear()+'-'+(myDate3.getMonth()+1)+'-'+myDate3.getDate();
                this.rePqrrDate = this.getNewTime(this.rePqrrDate);
            }
            this.PQRRDate[this.index].pqrrDate = this.pqrrDate;
            this.PQRRDate[this.index].preReviewDate = this.preReviewDate;
            this.PQRRDate[this.index].rePqrrDate = this.rePqrrDate;
            let newDate = {
                qualityId:this.PQRRDate[this.index].qualityId,
                // adProjectCode:this.PQRRDate[this.index].adProjectCode,
                // pqrrMilestoneName:this.PQRRDate[this.index].pqrrMilestoneName,
                pqrrDate:this.pqrrDate,
                preReviewDate:this.preReviewDate,
                rePqrrDate:this.rePqrrDate,
                // timingItemId:this.PQRRDate[this.index].timingItemId,
                pqrrStatus:this.PQRRDate[this.index].pqrrStatus
            };
            // this.newPQRRdate.push(newDate);
            this.newPQRRdate = [newDate];
            this.storeData();
        }
        else{
            this.msgService.showInfo("The Above Time Increases From Top To Bottom");
            this.growLife = 300000;
            this.msgs = this.msgService.msgs; 
        }
    }
    // PQRR 修改提交到库
    storeData(){
        this.httpService.post("/bpd-proj/bpd/quality/updateAllPQRRDate",this.newPQRRdate)
        .subscribe(data => {
            if ("1" == data.code) { //操作成功
                this.msgService.showSuccess('Opration Succeed!');
                this.growLife = 5000;
                this.newPQRRdate = [];
                if(this.changeLength){
                    this.requestBodyFour();
                }
            } else if ("0" == data.code) {//操作失败
                this.msgService.showError('Operation Failed!');
                this.growLife = 5000;
            }else { //校验提示
                this.msgService.showInfo(data.businessData);
                this.growLife = 300000;
            }
            //获取操作信息
            this.msgs = this.msgService.msgs;
        });
        // this.PQRRplan = false;
    }
    // commit deliverable 里的点击
    turnOn(value){
        this.roleCode = value.roleCode;
        this.elseAdProjectCode = value.adProjectCode;
        this.elseDeptId = value.deptName;
        this.elsePqrrMilestoneName = value.pqrrMilestoneName;
        this.delivAgentId = value.delivAgent;
        this.bussinessId = 'PQRRB/'+value.programCode+'/'+value.pqrrMilestoneName+'/'+value.deptId;
        this.httpService.post("/bpd-proj/bpd/delivAgentDeatil/getDelivAgentDeatil",{
            // delivAgent:this.delivAgentId
            "adProjectCode":this.elseAdProjectCode,
            "deptId":this.elseDeptId,
            "pqrrMilestoneName":this.elsePqrrMilestoneName
        })
        .subscribe(data => {
            this.Deliverables = data;
        });
        this.requestDeliverablesTable();
        this.setStatus = true;
    }
    requestDeliverablesTable(){
        // for(let i=0;i<this.DeliverablesTable.length;i++){
        //     this.DeliverablesTable[i].fileName = null;
        //     this.DeliverablesTable[i].attId = null;
        // }
        this.httpService.post("/bpd-proj/bpd/delivAgent/getDelivFile",{
            "roleCode":this.roleCode,
            "adProjectCode":this.elseAdProjectCode,
            "deptName":this.elseDeptId,
            "pqrrMilestoneName":this.elsePqrrMilestoneName
            // bussinessId:this.bussinessId
        }).subscribe(data => {
            this.DeliverablesTable = data;
            // if(data.length>0){
            //     for(let i=0;i<this.DeliverablesTable.length;i++){
            //         for(let j=0;j<data.length;j++){
            //             let kk = data[j].bussinessId.slice(-1);
            //             if(i==kk){
            //                 this.DeliverablesTable[i].fileName = data[j].fileName;
            //                 this.DeliverablesTable[i].attId = data[j].attId;
            //             }
            //         }
            //     }
            // }
        })
    }
    // //选择status
    // newlife(){
    //     this.selectedValue = " ";
    //     this.radio = true;
    // }
    // transform(){
    //     if(this.radio){
    //         this.radio = false;
    //     }
    //     else{
    //         this.radio = true;
    //     };
    // }
    // 导入文件事件
    onBasicUpload($event) {
        let response = eval('(' + $event.xhr.response + ')');
        // let response = JSON.parse($event.xhr.response);
        this.response = response;
        let timeStamp = new Date().getTime();
        if (response.code == "1") {
            this.httpService.get("/bpd-proj//bpd/quality/addAtt?"+timeStamp+"&attId="+this.attId+"&type=PQRR")
            .subscribe(data => {
                if(data.code == 1){
                    this.httpService.post("/bpd-proj/bpd/delivAgent/update",{
                            "uploadStatus":1,
                            "delivAgentId":this.delivAgentId1,
                            "adProjectCode":this.elseAdProjectCode,
                            // "deptId":this.elseDeptId,
                            "pqrrMilestoneName":this.elsePqrrMilestoneName
                        }).subscribe(data => {
                
                        })
                        this.requestDeliverablesTable();
                    // this.httpService.post("/bpd-proj/bpd/delivAgent/getDelivFile",{
                    //     "roleCode":this.roleCode,
                    //     "adProjectCode":this.elseAdProjectCode,
                    //     "deptName":this.elseDeptId,
                    //     "pqrrMilestoneName":this.elsePqrrMilestoneName
                    // }).subscribe(data => {
                    //     this.DeliverablesTable = data;
                    //     // let jj = Number(data[0].bussinessId.slice(-1));
                    //     // this.DeliverablesTable[jj].fileName = data[0].fileName;
                    //     // this.DeliverablesTable[jj].attId = data[0].attId;
                    //     // console.log(this.DeliverablesTable);
                    // })
                    this.msgService.showSuccess("Operation Success!");
                    this.growLife = 5000;
                }
                else{
                    this.msgService.showSuccess("Operation Fail!");
                    this.growLife = 5000;
                }
                this.msgs = this.msgService.msgs;
            })
            this.files = false;
            // this.msgService.showSuccess("Operation Success!");
            // this.msgs = this.msgService.msgs;
        } else if (response.code == "3") {
            this.files = false;
            // this.gvdpTemplateDetailErr = response.gvdpTemplateDetailErr;
            // console.log(this.gvdpTemplateDetailErr);
        } else if (response.code == "2") {
            this.files = false;
            // this.messageDialog1 = true;
            // this.gvdpTemplateDetailErr = response.excelError.list;
            // console.log(this.gvdpTemplateDetailErr);
        } else {
            this.files = false;
            // this.msgService.showSuccess("Operation Fail!");
            // this.msgs = this.msgService.msgs;
        }
    }
    // 下载
    xiazai(value){
        let token = window.sessionStorage.getItem("access_token");
        let url: string = "/bpd-proj/bpd/att/downloadFiles?attIds="+value + '&_=' + Number(new Date());
        if (token) {
            let realToken = token.substr(1, token.length - 2)
            url = url + "&accessToken=" + realToken;
        }
        window.location.href = url;
    }
    // 替换数组里的picture
    public pictureChange(i) {
        if(this.picture_name){
            this.Deliverables[i].status = this.picture_name;
        }
        else{
            this.picture_name = this.Deliverables[i].status;
        }
    }
    // 接收子组件变量
    pictureData(event){
        this.picture_name = event;
        console.log("pictureData");
        console.log(this.picture_name);
    }
    // commit deliverable 里的更新弹框提交
    handStatus(){
        var newDeliverables = [];
        for(let i=0;i<this.Deliverables.length;i++){
            let deliv = {
                delivAgentDeatilId:this.Deliverables[i].delivAgentDeatilId,
                status:this.Deliverables[i].status
            };
            newDeliverables.push(deliv);
        }
        this.httpService.post("/bpd-proj/bpd/delivAgentDeatil/delivAgentDeatils",newDeliverables)
        .subscribe(data => {
            if ("1" == data.code) { //操作成功
                this.msgService.showSuccess('Opration Succeed!');
                this.growLife = 5000;
            } else { //操作失败
                this.msgService.showError('Opration Failed!');
                this.growLife = 5000;
            }
            //获取操作信息
            this.msgs = this.msgService.msgs;
        });
        this.setStatus = false;
        // var sign = 0;
        // this.setStatus = false;
        // for(let i=0;i<this.DeliverablesTable.length;i++){
        //     if(this.DeliverablesTable[i].fileName==null||this.DeliverablesTable[i].fileName==undefined){
        //         sign += 1;
        //     }
        // }
        // var uploadStatus = 0;
        // if(sign==0){
        //     uploadStatus = 1;
        // }
        // this.httpService.post("/bpd-proj/bpd/delivAgent/update",{
        //     // "uploadStatus":uploadStatus,
        //     "adProjectCode":this.elseAdProjectCode,
        //     "deptId":this.elseDeptId,
        //     "pqrrMilestoneName":this.elsePqrrMilestoneName
        // }).subscribe(data => {

        // })
    }


    // meeting 里的函数
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
        }
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
          }
        // if(this.dayData.length==0){
        //     this.msgService.showInfo('No meeting!');
        //     this.msgs = this.msgService.msgs;
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
// -----------------------------------------------scorecard 代办
// 请求scorecard弹框中的数据
requestscoreBoxData(pqrrMilestone,adProjectCode){
    this.httpService.post("/bpd-proj/bpd/programScorecardStatus/getVList",{
        "rgbStauts": 0,
        "pqrrMilestone": pqrrMilestone,            
        "adProjectCode": adProjectCode,           
        "owner": this.ls.get('user'),
        "dataSource": 'FeedBack'
    }).subscribe(data => {
        if(data.length) {
            for(let i = 0; i < data.length; i++) {
              data[i].id = i + 1;
            }
        }
        this.scoreData = data;
    })
}
requestscoreBoxData1(pqrrMilestone,adProjectCode){
    this.httpService.post("/bpd-proj/bpd/programScorecardStatus/getVList",{
        "pqrrMilestone": pqrrMilestone,            
        "adProjectCode": adProjectCode,           
        "createUser": this.ls.get('user')
    }).subscribe(data => {
        if(data.length) {
            for(let i = 0; i < data.length; i++) {
              data[i].id = i + 1;
            }
        }
        this.scoreData = data;
    })
}
upward(){
    this.event.emit(this.changeLength);
}
// 弹框提交
handScoreBox(){
    // if(this.scorecardStatus == "feedback"){
    //     this.requestFeedbackScorecard();
    // }
    // else if(this.scorecardStatus == "prepare"){
    //     this.requestPrepareScorecard();
    // }
    // else{
    //     this.requestApprovalScorecard();
    // }
    if(this.scorecardStatus == "prepare"){
        this.httpService.post("/bpd-proj/bpd/programScorecard/update",{
            // "emailDate": this.intervalDay,
            "adProjectCode": this.val2,	
            "pqrrMilestone":  this.val1,
            "subject":this.subject,
            "freezedStatus":"1"
        }).subscribe(data => {
            if ("1" == data.code) { 
                this.msgService.showSuccess('Opration Succeed!');
                this.growLife = 5000;
                this.requestPrepareScorecard();
            } 
            else if("2" == data.code){
                this.msgService.showInfo(data.businessData); 
                this.growLife = 300000;
            }
            else { 
                this.msgService.showError('Opration Failed!');
                this.growLife = 5000;
            }
            this.msgs = this.msgService.msgs;
        })
    }
    else if(this.scorecardStatus == "feedback"){
        // this.indexId1 = [];
        // this.indexName = [];
        // for(let i=0;i<this.scoreData.length;i++){
        //     this.indexId1.push(this.scoreData[i].indexId);
        //     this.indexName.push(this.scoreData[i].indexName);
        // }
        // let indexs = this.indexId1.join(',');
        // let indexNames = this.indexName.join(',')
        this.httpService.post("/bpd-proj/bpd/programScorecardStatus/updateRgb",{
            "adProjectCode": this.val2,	
            "pqrrMilestone":  this.val1,
            // "indexId": indexs,
            // "createUser": indexNames,
            // "pm": this.createUser,
            // "updateUser": this.updateUser,
            // "rgbStauts": 1
        }).subscribe(data => {
            if ("1" == data.code) { 
                this.msgService.showSuccess('Opration Succeed!');
                this.growLife = 5000;
                this.requestFeedbackScorecard();
            }
            else if("2" == data.code){
                this.msgService.showInfo(data.businessData);
                this.growLife = 300000;
            } 
            else{
                this.msgService.showError('Opration Failed'); 
                this.growLife = 5000;
            }
            this.msgs = this.msgService.msgs;
        })
    }
    this.scoreBox = false;
}
//   Scorecard中的第二列点击事件
openScore(val){
    this.mileStone = val.pqrrMilestoneName;
    this.planDate = val.planDate;
    this.intervalDay = val.emailDate;
    this.val1 = val.pqrrMilestone;
    this.val2 = val.adProjectCode;
    this.subject = val.subject;
    this.createUser = val.createUser;
    this.updateUser = val.programCode+' MY '+val.modelYear+'的'+val.pqrrMilestoneName;
    this.scoreTitle = "Distribution " + val.pqrrMilestoneName + " Scorecard";
    if(this.scorecardStatus == "feedback"){
        this.requestscoreBoxData(val.pqrrMilestone,val.adProjectCode);
    }
    if(this.scorecardStatus == "prepare"){
        this.requestscoreBoxData1(val.pqrrMilestone,val.adProjectCode);
    }
    this.scoreBox = true;
}
// 请求下拉框数据
requestDropdownData(){
    if(this.scorecardStatus == "feedback"){
        this.httpService.post("/bpd-proj/bpd/programScorecardStatus/getProgramCodes",{
            "rgbStauts": 1,
            "owner": this.ls.get('user')
        }).subscribe(data => {
            this.prCode = data;
            this.prCode.unshift(
                {label:"All",value:null}
            );
        })
    };
    if(this.scorecardStatus == "prepare"){
        this.httpService.post("/bpd-proj/bpd/programScorecardStatus/getProgramCodes",{
            "createUser": this.ls.get('user')
        }).subscribe(data => {
            this.prCode = data;
            this.prCode.unshift({label:"All",value:null});
        })
    }
}
// 请求prepare scorecard
requestPrepareScorecard(){
    let len = this.scorecardTable.length;
    this.httpService.post("/bpd-proj/bpd/programScorecardStatus/lists2",{
        "statusVolume": this.selectedScoreStatus, 
        "createUser": this.ls.get("user"),		
        "programCode": this.selectedPrCode, 
        "page":{
            "rows":this.paginatorRow,
            "page":this.paginatorPage
        }
    }).subscribe(data => {
        this.totalRecord = data.total;
        this.scorecardTable = data.rows;
        if(this.scorecardTable.length){
            for(let i=0;i<this.scorecardTable.length;i++){
                this.scorecardTable[i].id = i+1;
            }
        };
        if(this.scorecardTable.length != len){
            this.changeLength = true;
            this.event.emit(this.changeLength);
        }
        else{
            this.changeLength = false;
        }
    })
}
// Approval scorecard
// requestApprovalScorecard(){
//     this.httpService.post("/bpd-proj/bpd/programScorecardStatus/getCso",{
//         "page":{
//             "row":this.paginatorRow,
//             "page":this.paginatorPage
//         }
//     }).subscribe(data => {
//         console.log(data);
//     })
// }
// 请求feedback scorecard
requestFeedbackScorecard(){
    let len = this.scorecardTable.length;
    this.httpService.post("/bpd-proj/bpd/programScorecardStatus/lists",{
		"rgbStauts": 1,      
        "statusVolume": this.selectedScoreStatus,
        "programCode": this.selectedPrCode,
        "owner": this.ls.get('user'),				
        "page":{
            "row":this.paginatorRow,
            "page":this.paginatorPage
        }
    }).subscribe(data => {
        this.totalRecord = data.total;
        this.scorecardTable = data.rows;
        for(let i = 0;i < this.scorecardTable.length;i++) {
            this.scorecardTable[i].id = i + 1;
        }
        if(this.scorecardTable.length != len){
            this.changeLength = true;
            this.event.emit(this.changeLength);
        }
        else{
            this.changeLength = false;
        }
    })
}
// 分页事件
paginate(e){
    this.paginatorPage = e.page + 1;
    this.paginatorRow = e.rows;
    if(this.scorecardStatus == "feedback"){
        this.requestFeedbackScorecard();
    }
    else if(this.scorecardStatus == "prepare"){
        this.requestPrepareScorecard();
    }
    // else{
    //     this.requestApprovalScorecard();
    // }
}
// 模糊查询
checkScorecard(){
    this.paginatorPage = 1;
    this.paginatorRow = 10;
    if(this.scorecardStatus == "feedback"){
        this.requestFeedbackScorecard();
    }
    else if(this.scorecardStatus == "prepare"){
        this.requestPrepareScorecard();
    }
    // else{
    //     this.requestApprovalScorecard();
    // }
}
// scorecard 修改事件
changeScorecard(value){
    this.dataSource = value.dataSource;
    this.elsemetrics = value.indexName;
    this.elsegroup = value.metricGroup;
    this.elsedepartment = value.deptName;
    this.elseownerName = value.ownerName;
    this.elsetarget = value.proposedTarget;
    this.elseStatus = value.statusVolume;
    this.dataType = value.dataType;
    this.indexId = value.indexId;
    this.targetVolume = value.targetVolume;
    this.adProjectCode = value.adProjectCode;
    this.pqrrMilestone = value.pqrrMilestone;
    this.targetVolumex = value.targetVolume;
    this.roleCodes = value.roleCode;
    this.requestThreeTable();
    this.boxOfscoreBox = true;
}
// 请求三层弹框里的表数据
requestThreeTable(){
    this.httpService.post("/bpd-proj/bpd/programScorecardSubstatus/getVList",{
        "indexId": this.indexId,
		"adProjectCode": this.adProjectCode,
        "pqrrMilestone": this.pqrrMilestone
    }).subscribe(data => {
        this.changeTable = data;
    })
}
// 三层弹框里的修改
editStatus(value){
    this.addJudge = false;
    this.proposedVolume = value.proposedVolume;
    this.subjectName = value.subjectName;
    this.subjectElse = value.subjectName;
    this.subTargetElse = value.subtargetVolume;
    this.statusElse = value.substatusVolume;
    this.boxInBox = true;
}

handChangeBox(){
    var somethingForSwitch;
    if(this.scorecardStatus == 'feedback'){
        if(this.dataType == 3){
            let year = new Date(this.elseStatus).getFullYear();
            let month = new Date(this.elseStatus).getMonth();
            let date = new Date(this.elseStatus).getDate();
            this.elseStatus = year+'-'+month+'-'+date;
        }
        if(this.changeTable.length){
            somethingForSwitch = {
                // "rgbStauts": 1,
                "indexId": this.indexId,
                "adProjectCode": this.adProjectCode,
                "pqrrMilestone": this.pqrrMilestone
            }
        }
        else{
            somethingForSwitch = {
                // "rgbStauts": 1,
                "indexId": this.indexId,
                "statusVolume": this.elseStatus,
                "adProjectCode": this.adProjectCode,
                "pqrrMilestone": this.pqrrMilestone
            }
        }
    };
    if(this.scorecardStatus == 'prepare'){
        if(this.elseownerName == null){
            this.elseownerCode = null;
        };
        if(this.dataType == 3){
            let year = new Date(this.targetVolumex).getFullYear();
            let month = new Date(this.targetVolumex).getMonth()+1;
            let date = new Date(this.targetVolumex).getDate();
            let month1,date1;
            if(month<10){
                month1 = "0"+month;
            }
            else{
                month1 = month;
            }
            if(date<10){
                date1 = "0"+date;
            }
            else{
                date1 = date;
            }
            this.targetVolumex = year+'-'+month1+'-'+date1;
        }
        if(this.changeTable.length){
            somethingForSwitch = {
                "indexId": this.indexId,
                // "statusVolume": this.elseStatus,
                "adProjectCode": this.adProjectCode,
                "pqrrMilestone": this.pqrrMilestone,
                "owner": this.elseownerCode
            }
        }
        else{
            somethingForSwitch = {
                "indexId": this.indexId,
                // "statusVolume": this.elseStatus,
                "adProjectCode": this.adProjectCode,
                "pqrrMilestone": this.pqrrMilestone,
                "owner": this.elseownerCode,
                "targetVolume":this.targetVolumex
            }
        }
    }
    this.httpService.post("/bpd-proj/bpd/programScorecardStatus/update",somethingForSwitch
    ).subscribe(data => {
        if ("1" == data.code) { //操作成功
            this.msgService.showSuccess('Opration Succeed!');
            this.growLife = 5000;
            if(this.scorecardStatus == "feedback"){
                this.requestscoreBoxData(this.val1,this.val2);
            };
            if(this.scorecardStatus == "prepare"){
                this.requestscoreBoxData1(this.val1,this.val2);
            }
        } else { //操作失败
            this.msgService.showError('Opration Failed!');
            this.growLife = 5000;
        }
        this.msgs = this.msgService.msgs;
    })
    this.boxOfscoreBox = false;
}
handChangeStatu(){
    var somethingForStatus;
    if(this.scorecardStatus == 'prepare'){
        somethingForStatus = {
            "indexId": this.indexId,
            "adProjectCode": this.adProjectCode,
            "subjectName": this.subjectElse,
            "pqrrMilestone": this.pqrrMilestone,
            "subtargetVolume":this.subTargetElse
        }
    }
    else{
        somethingForStatus = {
            "substatusVolume": this.statusElse,
            "indexId": this.indexId,
            "adProjectCode": this.adProjectCode,
            "subjectName": this.subjectName,
            "pqrrMilestone": this.pqrrMilestone
        } 
    }
    if(this.addJudge){
        this.httpService.post("/bpd-proj/bpd/programScorecardSubstatus/add",somethingForStatus
    ).subscribe(data => {
        if ("1" == data.code) { 
            this.msgService.showSuccess('Opration Succeed!');
            this.growLife = 5000;
            this.requestThreeTable();
        } else { 
            this.msgService.showError(data.businessData);
            this.growLife = 300000;
        }
        this.msgs = this.msgService.msgs;
    })
    }
    else{
        this.httpService.post("/bpd-proj/bpd/programScorecardSubstatus/update",somethingForStatus
    ).subscribe(data => {
        if ("1" == data.code) { 
            this.msgService.showSuccess('Opration Succeed!');
            this.growLife = 5000;
            this.requestThreeTable();
        } else { 
            this.msgService.showError(data.businessData);
            this.growLife = 300000;
        }
        this.msgs = this.msgService.msgs;
    })
    }
    this.boxInBox = false;
}
// 删除
deleteStatus(val){
    var somethingForStatus1;
    if(this.scorecardStatus == 'prepare'){
        somethingForStatus1 = {
            "indexId": this.indexId,
            "adProjectCode": this.adProjectCode,
            "subjectName": val.subjectName,
            "pqrrMilestone": this.pqrrMilestone
            // "subtargetValue":this.subTargetElse
        }
    }
    else{
        somethingForStatus1 = {
            "proposedVolume": this.statusElse,
            "indexId": this.indexId,
            "adProjectCode": this.adProjectCode,
            "subjectName": this.subjectName,
            "pqrrMilestone": this.pqrrMilestone
        } 
    }
    this.httpService.post("/bpd-proj/bpd/programScorecardSubstatus/delete",somethingForStatus1
    ).subscribe(data => {
        if ("1" == data.code) { 
            this.msgService.showSuccess('Opration Succeed!');
            this.growLife = 5000;
            this.requestThreeTable();
        } else { 
            this.msgService.showError(data.businessData);
            this.growLife = 300000;
        }
        this.msgs = this.msgService.msgs;
    })
    this.boxInBox = false;
}
//  Scorecard里的弹框 中的修改弹框中增加按钮点击
addStatu(){
    this.addJudge = true;
    this.subjectElse = null;
    if(this.scorecardStatus == 'prepare'){
        this.subTargetElse = null;
    }
    else{
        this.statusElse = null;
    }
    this.boxInBox = true;
}
// -------------------------search user 弹框相关事件
getUser() {
    this.searchUser = true;
    this.httpService.post("/bpd-proj/bpd/user/getVPetUser", {
        "page": {
            "page": 1,
            "rows": 10
        },
        "departmentName" : this.dialogDepartment,
        "userName": this.dialogUserName,
        "userCode":this.adProjectCode,
        "roleCodes":this.roleCodes
    })
    .subscribe(data1 => {
        this.managerData=[];
        let data = data1.rows;
        this.managerDataLen = data1.total;
        for(let i = 0; i < data.length; i++) {
            data[i].id = i + 1;
        }
        for(let i = 0; i < 10; i++) {
            if(!data[i]) {
                this.managerData.push({
                    'ip': i
                })
            } else {
                this.managerData.push(data[i])
            }
        }
    })
}

managerPaginate(e) {
    this.httpService.post("/bpd-proj/bpd/user/getVPetUser",{
        "page": {
            "page": e.page + 1,
            "rows": e.rows
        },
        "departmentName" : this.dialogDepartment,
        "userName": this.dialogUserName,
        "userCode":this.adProjectCode,
        "roleCodes":this.roleCodes
    })
    .subscribe(data1 => {
        let data = data1.rows;
        this.managerDataLen = data1.total;
        this.managerDataRows = e.rows;
        this.managerDataFirst = e.first;
        this.managerData = [];
        for(let i = 0; i < data.length; i++) {
            data[i].id = i + 1;
        }
        for(let i = 0; i < e.rows; i++) {
            if(!data[i]) {
                this.managerData.push({
                    "ip": i+1
                })
            } else {
                this.managerData.push(data[i])
            }
        }
    })
}
lookClickEnterSearch($event) {
    if ($event.key === "Enter") {
        this.lookClick();
    }
}
lookClick() {
    let e = {page: 0, first: 0, rows: "10"};
    this.managerPaginate(e);
}
dbclick(e) {
    this.elseownerName = e.data.userName;
    this.elseownerCode = e.data.userCode;
    this.searchUser = false;
}
// pqrr commit delivable 上传下载
gotoService(value){
    this.delivAgentId1 = value;
    this.files = true;
    this.attId = Math.random()*10+'/'+Math.random()+'/'+Math.random()*100;
    console.log(this.attId);
    // this.bussinessId1 = this.bussinessId+'/'+value;
}
removeName(val1,val2,val3){
    let timeStamp = new Date().getTime();
    this.httpService.get("/bpd-proj/bpd/att/delete?"+timeStamp+"&attIds="+val2)
    .subscribe(data => {
        if(data.code == 1){
            // this.DeliverablesTable[val1].attId = null;
            // this.DeliverablesTable[val1].fileName = null;
            this.httpService.post("/bpd-proj/bpd/delivAgent/update",{
                    "uploadStatus":0,
                    "delivAgentId":val3,
                    "adProjectCode":this.elseAdProjectCode,
                    "pqrrMilestoneName":this.elsePqrrMilestoneName
                }).subscribe(data => {
        
                })
            this.requestDeliverablesTable();
            this.msgService.showSuccess('Opration Succeed!');
            this.growLife = 5000;
        }
        else{
            this.msgService.showError('Opration Failed!');
            this.growLife = 5000;
        }
        this.msgs = this.msgService.msgs;
    })
}
exportFile(value){
    this.httpService.get("/bpd-proj/bpd/att/downloadFiles?attIds="+value)
    .subscribe(data => {
        if(data['code'] == 0) {
            this.msgService.showInfo("Can not find file!");
            this.growLife = 300000;
            this.msgs = this.msgService.msgs; 
        } else {
            let token = window.sessionStorage.getItem("access_token");
            let url: string = "/bpd-proj/bpd/att/downloadFiles?attIds="+value + '&_=' + Number(new Date());
            if (token) {
                let realToken = token.substr(1, token.length - 2)
                url = url + "&accessToken=" + realToken;
            }
            window.location.href = url;
        }
    })

}

public timeSheetListCount($event) {
    console.log($event);
    this.timeSheetCount = $event;
}
public scoreCardListCount($event) {
    console.log($event);
    this.scoreCardCount = $event;
}
public nodListCount($event) {
    console.log($event);
    this.nodCount = $event;
}

/**
 * 刷新页面
 * 
 * @param {any} $event 
 * @memberof vehicleManagementComponent
 */
public refreshFlag($event) {
    console.log("vehicle-management");
    this.refreshAgent.emit($event);
}
}
