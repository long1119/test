import {Component,OnInit} from '@angular/core';
import 'style-loader!./summary-report.scss';
import {Message} from 'primeng/primeng';
import {SelectItem} from 'primeng/primeng';
import {HttpDataService} from '../../../service/http.service';
import {MessageService} from "../../../service/message.service";
import {LocalStorage} from "../../../portal/workPortal/local.storage";


@Component({
    selector: 'summary-report',
    templateUrl: './summary-report.html',
})
export class summaryReportComponent {
    msgs: Message[];
    public growLife: number = 5000;
    // 主表变量
    summaryReportTable:any[] = [];
    showSummaryReport:boolean = false;
    flag1: any;
    flag2: any;
    // select Users 弹框中的变量
    showUsers:boolean = false;
    department:any;
    userName:any;
    totalRecord:number;
    paginatorPage:number;
    paginatorRow:number;
    userTable:any[];
    selectedItems:any[] = [];
    // selectedUsers:any[] = [];
    // selectedUserCodes:any[]=[];
    // 主表增加，修改弹框中的变量
    presender:any;
    sime:any;
    supportingDep:any;
    // reportDate:any;
    presenders:any[] = [];  //汇报人
    presenderCodes:any[] = [];
    presenders1:any;
    attendees:any[] = [];  // 出席人
    attendeeCodes:any[] = [];
    attendees1:any;
    departments:any[] = [];  // 出席部门
    departmentCodes:any[] = [];
    departments1:any;
    subject:any;
    meetingDate:any;
    season:any;
    report:any;
    // Season:any;
    year:any;
    Qseason:any;
    checkProgram:any;
    items:any[];
    flag:any;
    summaryId:any;
    switch:string;
    //select department 弹框中的变量 
    DepartmentTable:any[];
    selectedDepartments:any[]=[];
    showDepartments:boolean = false;
    types:any[];
    selectedType:any;
    stepOne:boolean = true;
    stepTwo:boolean = false;
    view:boolean = true;
    // ---------------------
    item:any;
    decisionId:any;
    showItems:boolean = false;
    val:any;
    // -----------------next 图1变量
    metrixGroups:any[]=[];
    selectedGroup:any;
    table1:any[]=[];
    table2:any[]=[];
    table3:any[]=[];
    title:any[];
    title1:any[]=[];
    title2:any[]=[];
    parentDate:any;
    
    public yearRange: string;

    powerOfModify:any;     //权限判断变量
    scoreMeetings:any[] = [];   //加于2017/12/2
    selectedMeeting:any;
    deleteSure:boolean = false;

    // new add 2018/1/9
    keyPoints:any;
    roadblocks:any;
    Risks:any;
    constructor(private httpService: HttpDataService, private msgService: MessageService,private ls: LocalStorage) {
        // 日期年份设置
        let currentYear = new Date().getFullYear();
        this.yearRange = "" + (Number(currentYear) - 10) + ":" + (Number(currentYear) + 50);
    }
    ngOnInit() {
        this.powerOfModify = JSON.parse(this.ls.get('authorityData'))['Maintain Scorecard Summary Report'];
        this.types = [
            {label:"Metrix Status",value:1},
            {label:"Metrix Status By Bar Chart",value:2},
            {label:"Bubble Chart",value:3},
        ]
        this.selectedType = 1;
        this.paginatorPage = 1;
        this.paginatorRow = 10;
        this.metrixGroups = [
            {label:"All",value:1},
            {label:"Customer",value:2},
            {label:"Finance",value:3}
        ]
        this.selectedGroup = 1;
        let year = new Date().getFullYear();
        let first = year+"第一次董事会";
        let second = year+"第二次董事会";
        let third = year+"第三次董事会";
        this.scoreMeetings = [
            {label:first,value:first},
            {label:second,value:second},
            {label:third,value:third},
        ];
        this.selectedMeeting = this.scoreMeetings[0].value;
        this.requestMainData();
    }

    calendarChange($event){
        if(this.meetingDate){
            let y = new Date(this.meetingDate).getFullYear();
            let m = new Date(this.meetingDate).getMonth();
            this.year = y;
            if(m>=0&&m<3){
                this.season = y+"年第一季度";
                this.Qseason = "Q1";
            }
            else if(m>=3&&m<6){
                this.season = y+"年第二季度";
                this.Qseason = "Q2";
            }
            else if(m>=6&&m<9){
                this.season = y+"年第三季度";
                this.Qseason = "Q3";
            }
            else{
                this.season = y+"年第四季度";
                this.Qseason = "Q4";
            };
        }
    }
    // ---------------------------主表里的事件
    // 主表增加事件
    addReport(){
        this.selectedMeeting = this.scoreMeetings[0].value;
        this.keyPoints = null;
        this.roadblocks = null; 
        this.Risks = null;
        this.items = [];
        this.summaryId = "";
        this.subject = "";
        this.meetingDate = "";
        this.season = "";
        this.presenders = [];
        this.presenderCodes = [];
        this.attendees = [];
        this.attendeeCodes = [];
        this.departments = [];
        this.departmentCodes = [];
        this.report = "";
        // this.Season = "";
        this.year = "";
        this.Qseason = "";
        this.checkProgram = "";
        this.switch = "add"
        this.stepOne = true;
        this.stepTwo = false;
        this.showSummaryReport = true;
    }
    viewReport(value){
        this.meetingDate = value.reportDate;
        this.selectedMeeting = value.reportSeason;
        this.showSummaryReport = true;
        this.requestSummaryProgram();
        if(this.selectedType == 1){
            this.requestTableOne();
        }
        else if(this.selectedType == 2){
            this.requestTableTwo();
        }
        else{
            this.requestTableThree();
        }
        this.stepOne = false;
        this.stepTwo = true;
        this.view = false;
    }
    // 请求人员
    requestPeoples(){
        this.presenders = [];
        this.presenderCodes = [];
        this.attendees = [];
        this.attendeeCodes = [];
        this.departments = [];
        this.departmentCodes = [];
        this.httpService.post("/bpd-proj/bpd/scorecardUser/getList",{
            "summaryId": this.summaryId,
            "flag":"0"
        }).subscribe(data => {
            if(data.length){
                for(let i=0;data.length;i++){
                    this.presenders.push(data[i].userName);
                    this.presenderCodes.push(data[i].userCode);
                }
            }
        });
        this.httpService.post("/bpd-proj/bpd/scorecardUser/getList",{
            "summaryId": this.summaryId,
            "flag":"1"
        }).subscribe(data => {
            if(data.length){
                for(let i=0;data.length;i++){
                    this.attendees.push(data[i].userName);
                    this.attendeeCodes.push(data[i].userCode);
                }
            }
        });
        this.httpService.post("/bpd-proj/bpd/scorecardDept/getList",{
            "summaryId":this.summaryId
        }).subscribe(data => {
            if(data.length){
                for(let i=0;data.length;i++){
                    this.departments.push(data[i].deptName);
                    this.departmentCodes.push(data[i].deptId);
                 }
            }
        })
    }
    // 查询summary的Program串
    requestSummaryProgram(){
        this.httpService.post("/bpd-proj/bpd/vehicleProject/getVListProgram",{
            "reportSeason":this.selectedMeeting
        }).subscribe(data => {
            this.title = [];
            if(data.length == 0){
                this.checkProgram = "There is no program";
            };
            if(data.length){
                let opp = [];
                for(let i=0;i<data.length;i++){
                    this.title.push(data[i].adProjectCode);
                    opp.push(data[i].programCode);
                }
                if(opp.length == 0){
                    this.checkProgram = "There is no program";
                }
                this.checkProgram = opp.join(",");
            }
        })
    }
    // 导出事件
    export(){
        let timeStamp = Date.now();
        let token = window.sessionStorage.getItem("access_token");
        // adProjectCodes=" + codes + "&elementNames=" + names + '&
        let url: string ="/bpd-proj/bpd/programScorecard/exportExcel?"+timeStamp+"&reportSeason="+this.selectedMeeting+"&summaryId="+this.summaryId;
        if (token) {
            let realToken = token.substr(1, token.length - 2)
            url = url + "&accessToken=" + realToken;
        }
        window.location.href = url;
    }
    // 修改事件
    change(value){
        this.keyPoints = value.keyPoints;
        this.roadblocks = value.roadblocks;
        this.Risks = value.risks;
        this.summaryId = value.summaryId;
        this.subject = value.subject;
        this.meetingDate = value.reportDate;
        // this.season = value.reportSeason;
        this.selectedMeeting = value.reportSeason;
        // this.presenders1 = this.presenders.join();
        // this.attendees1 = this.attendees.join();
        // this.departments1 = this.departments.join();
        this.report = value.reportPrograms;
        this.year = new Date(value.reportDate).getFullYear();
        this.checkProgram = value.reviewPrograms;
        let mm = new Date(value.reportDate).getMonth();
        if(mm>=0&&mm<3){
            this.Qseason = "Q1";
        }
        else if(mm>=3&&mm<6){
            this.Qseason = "Q2";
        }
        else if(mm>=6&&mm<9){
            this.Qseason = "Q3";
        }
        else{
            this.Qseason = "Q4";
        }
        this.requestPeoples();
        this.requestItem();
        this.switch = "modify"
        this.stepOne = true;
        this.stepTwo = false;
        this.showSummaryReport = true;
    }
    // 删除事件
    remove(value){
        this.deleteSure = true;
        this.summaryId = value;
        // let timeStamp = new Date().getTime();
        // this.httpService.get("/bpd-proj/bpd/scorecardSummary/deleteById?"+timeStamp+"&summaryId="+value)
        // .subscribe(data => {
        //     if(data.code == 1){
        //         this.msgService.showSuccess('Opration succeed!');
        //         this.requestMainData();
        //     }
        //     else{
        //         this.msgService.showError('Opration failed!');
        //     }
        //     this.msgs = this.msgService.msgs;
        // })
    }
    sureDelete(){
        let timeStamp = new Date().getTime();
        this.httpService.get("/bpd-proj/bpd/scorecardSummary/deleteById?"+timeStamp+"&summaryId="+this.summaryId)
        .subscribe(data => {
            if(data.code == 1){
                this.msgService.showSuccess('Opration succeed!');
                this.growLife = 5000;
                this.requestMainData();
            }
            else{
                this.msgService.showError('Opration failed!');
                this.growLife = 5000;
            }
            this.msgs = this.msgService.msgs;
        });
        this.deleteSure = false;
    }
    // 请求主表数据
    requestMainData(){
        this.httpService.post("/bpd-proj/bpd/scorecardSummary/getList",{

        }).subscribe(data => {
            this.summaryReportTable = data;
        })
    }
    // 下一步里的切换图表
    changePicture(){
        if(this.selectedType==1){
            this.requestTableOne();
        }
        else if(this.selectedType==2){
            this.requestTableTwo();
        }
        else{
            this.requestTableThree();
        }
    }
    // -------------------------------主表增加修改弹框中的事件
    // 查询项目
    readProgram(){
        this.requestSummaryProgram();
    }
    // item表增加事件
    addItem(){
        this.item = "";
        this.showItems = true;
    }
    // 删除人员
    remove1(e){
        this.presenders.splice(e,1);
        this.presenderCodes.splice(e,1);
    }
     // 删除人员
     remove2(e){
        this.attendees.splice(e,1);
        this.attendeeCodes.splice(e,1);
    }
     // 删除人员
     remove3(e){
        this.departments.splice(e,1);
        this.departmentCodes.splice(e,1);
    }
    // 选择汇报人员
    selectOne(){
        // this.department = "";
        // this.userName = "";
        this.paginatorPage = 1;
        this.paginatorRow = 10;
        this.flag = 0;
        this.selectedItems = [];
        this.val = this.presenderCodes;
        this.requestUsers();
        this.showUsers = true;
        this.department = null;
        this.userName = null;
    }
     // 选择出席人员
    selectTwo(){
        this.paginatorPage = 1;
        this.paginatorRow = 10;
        this.flag = 1;
        this.selectedItems = [];
        this.val = this.attendeeCodes;
        this.requestUsers();
        this.showUsers = true;
        this.department = null;
        this.userName = null;
    }
    // 选择出席部门
    selectThree(){
        this.selectedDepartments = [];
        var key;
        if(this.departmentCodes.length == 0){
            key = {};
        }else{
            key = {
                "depts":this.departmentCodes  
            }
        }   
        this.httpService.post("/bpd-proj/bpd/dept/getList",key)
        .subscribe(data => {
            this.DepartmentTable = data;
        })
        this.showDepartments = true;
    }
    // next 点击事件
    nextStep(){
        // this.handPresenter();
        // this.handAttendee();
        // this.handDepartment();
        this.requestSummaryProgram();
        let y = new Date(this.meetingDate).getFullYear();
        let m = new Date(this.meetingDate).getMonth();
        let d = new Date(this.meetingDate).getDate();
        let reportDate = y+'-'+(m+1)+'-'+d;
        if(this.switch == "add"){
            this.presenders1 = this.presenders.join();
            this.attendees1 = this.attendees.join();
            this.departments1 = this.departments.join();
            this.httpService.post("/bpd-proj/bpd/scorecardSummary/insert",{
                "subject":this.subject,
                "reportDate":reportDate,
                // "reportSeason":this.season,
                "keyPoints":this.keyPoints,  // new add 2018/1/9
                "risks":this.Risks,     // new add 2018/1/9
                "roadblocks":this.roadblocks,   // new add 2018/1/9
                "reportSeason":this.selectedMeeting,
                "presender":this.presenders1,    
                "sime":this.attendees1,       
                "supportingDep":this.departments1,
                "reportPrograms":this.report,
                "presenderCode":this.presenderCodes,
                "simeCode":this.attendeeCodes,
                "deptCode":this.departmentCodes,
                "item":this.items,
                "reviewPrograms":this.checkProgram,            //  ?????????????????
            }).subscribe(data => {
                if(data.code == 1){
                    this.msgService.showSuccess('Opration succeed!');
                    this.growLife = 5000;
                    this.requestMainData();
                }
                else{
                    this.msgService.showError('Opration failed!');
                    this.growLife = 5000;
                }
                this.msgs = this.msgService.msgs;
            })
        }
        else{
            this.httpService.post("/bpd-proj/bpd/scorecardSummary/update",{
                "summaryId":this.summaryId,
                "subject":this.subject,
                "reportDate":reportDate,
                "keyPoints":this.keyPoints,  // new add 2018/1/9
                "risks":this.Risks,     // new add 2018/1/9
                "roadblocks":this.roadblocks,   // new add 2018/1/9
                "reportSeason":this.selectedMeeting,
                "presender":this.presenders1,
                "sime":this.attendees1,
                "supportingDep":this.departments1,
                "reportPrograms":this.report,
                "presenderCode":this.presenderCodes,
                "simeCode":this.attendeeCodes,
                "deptCode":this.departmentCodes,
                "item":this.items,
                "reviewPrograms":this.checkProgram
            }).subscribe( data => {
                if(data.code == 1){
                    this.msgService.showSuccess('Opration succeed!');
                    this.growLife = 5000;
                    this.requestMainData();
                }
                else{
                    this.msgService.showError('Opration failed!');
                    this.growLife = 5000;
                }
                this.msgs = this.msgService.msgs;
            })
        };
        if(this.selectedType == 1){
            this.requestTableOne();
        }
        else if(this.selectedType == 2){
            this.requestTableTwo();
        }
        else{
            this.requestTableThree();
        }
        this.stepOne = false;
        this.stepTwo = true;
    }
    // -----------------------------select Users弹框中的事件
    // 查询users
    requestUsers(){
        this.httpService.post("/bpd-proj/bpd/user/getVList",{
            "userCodes":this.val,                    
            "page":{"page":this.paginatorPage,"rows":this.paginatorRow},
            "departmentName":this.department,  
            "userName":this.userName 
        }).subscribe(data => {
            this.totalRecord = data.total;
            this.userTable = data.rows;
        })
    }

    // 回车键模糊查询
    checkupEnterSearch($event) {
        if ($event.key === "Enter") {
            this.checkUp();
        }
    }
    
    // 模糊查询
    checkUp(){
        this.paginatorPage = 1;
        this.paginatorRow = 10;
        this.requestUsers();
    }
     // 分页切换事件
    paginate(e) {
    this.paginatorPage = e.page + 1;
    this.paginatorRow = e.rows;
    this.requestUsers();
    }
    // 提交事件
    handOver(){
        if(this.flag == 0){
            for(let i=0;i<this.selectedItems.length;i++){
                let userName=this.selectedItems[i].userName;
                let userCode=this.selectedItems[i].userCode;
                this.presenders.push(userName);
                this.presenderCodes.push(userCode);
            };
        }
        else{
            for(let i=0;i<this.selectedItems.length;i++){
                let userName=this.selectedItems[i].userName;
                let userCode=this.selectedItems[i].userCode;
                this.attendees.push(userName);
                this.attendeeCodes.push(userCode);
            }
        }
        this.showUsers = false;
    }
    // presenter 提交
    handPresenter(){
        this.httpService.post("/bpd-proj/bpd/scorecardUser/insert",{
            "summaryId":this.summaryId,
            "users":this.presenderCodes,
            "flag":"0"
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
    }
    // attendee 提交
    handAttendee(){
        this.httpService.post("/bpd-proj/bpd/scorecardUser/insert",{
            "summaryId":this.summaryId,
            "users":this.attendeeCodes,
            "flag":"1"
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
    }
    // ------------------------select departments 弹框中的事件
    // department 提交
    handDepartment(){
        this.departments = this.departments.concat(this.selectedDepartments);
        this.httpService.post("/bpd-proj/bpd/scorecardDept/insert",{
            "summaryId":this.summaryId,
            "depts":this.departmentCodes
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
    }
    handChoose(){
        for(let i=0;i<this.selectedDepartments.length;i++){
            let userName = this.selectedDepartments[i].deptName;
            let userCode = this.selectedDepartments[i].deptId;
            this.departments.push(userName);
            this.departmentCodes.push(userCode);
        }
        this.showDepartments = false;
    }
    // ------------------------主表增加修改弹框中最下面的表格相关事件
    requestItem(){
        this.items = [];
        this.httpService.post("/bpd-proj/bpd/scorecardDecision/getList",{
            "summaryId":this.summaryId
        }).subscribe(data => {
            if(data.length>0){
                for(let i=0;i<data.length;i++){
                    this.items.push(data[i].item);
                }
            }
        })
    }
    handItem(){
        this.showItems = false;
        this.items.push(this.item);
        // this.httpService.post("/bpd-proj/bpd/scorecardDecision/insert",{
        //     "summaryId":this.summaryId,
        //     "item":this.item
        // }).subscribe(data => {
        //     if(data.code == 1){
        //         this.msgService.showSuccess('Opration succeed!');
        //         this.requestMainData();
        //     }
        //     else{
        //         this.msgService.showError('Opration failed!');
        //     }
        //     this.msgs = this.msgService.msgs;
        // })
    }
    removeItem(val){
        this.items.splice(val,1);
        // this.httpService.get("/bpd-proj/bpd/scorecardDecision/deleteById?decisionId="+val)
        // .subscribe(data => {
        //     if(data.code == 1){
        //         this.msgService.showSuccess('Opration succeed!');
        //         this.requestMainData();
        //     }
        //     else{
        //         this.msgService.showError('Opration failed!');
        //     }
        //     this.msgs = this.msgService.msgs;
        // })
    }
    // ---------------------------------------next 图一事件
    lastStep(){
        this.stepOne = true;
        this.stepTwo = false;
    }
    refresh(){

    }
    exportGraphic(){

    }
    changeChild(){
        
    }  
    requestTableOne(){
        this.title1 = [];
        this.title2 = [];
        this.table1 = [];
        this.table2 = [];
        // let reportDate = new Date(this.meetingDate).getFullYear()+'-'+(new Date(this.meetingDate).getMonth()+1)+'-'+new Date(this.meetingDate).getDate();
        this.httpService.post("/bpd-proj/bpd/programScorecard/getMap",{
            // "reportDate":reportDate
            "reportSeason":this.selectedMeeting
        }).subscribe(data => {
            this.title1.push(data[0]);
            this.title2.push(data[1]);
            for(let i=2;i<data.length;i++){
                if(data[i].group=="Customer"){
                    this.table1.push(data[i]);
                }
                if(data[i].group=="Finance"){
                    this.table2.push(data[i]);
                }
            }
        })
    }
    requestTableTwo(){
        // let reportDate = new Date(this.meetingDate).getFullYear()+'-'+(new Date(this.meetingDate).getMonth()+1)+'-'+new Date(this.meetingDate).getDate();
        this.httpService.post("/bpd-proj/bpd/programScorecard/getMap",{
            // "reportDate":reportDate
            "reportSeason":this.selectedMeeting
        }).subscribe(data => {
           this.table3 = data.slice(2);
           for(let i=0;i<this.table3.length;i++){
               for(let j=i;j<this.table3.length;j++){
                   if(this.table3[i].Gnum>this.table3[j].Gnum){
                       let opp = this.table3[i];
                       this.table3[i]=this.table3[j];
                       this.table3[j]=opp;
                   }
               }
           };
           for(let k=0;k<this.table3.length;k++){
               if(this.table3[k].tatolNum == 0){
                   this.table3.splice(k,1);
               }
           }
           console.log(this.table3);
        })
    } 
    requestTableThree(){
        // this.parentDate = new Date(this.meetingDate).getFullYear()+'-'+(new Date(this.meetingDate).getMonth()+1)+'-'+new Date(this.meetingDate).getDate(); //个位数前面未加0
        // console.log(this.parentDate);
        // this.parentDate = this.selectedMeeting;
        this.parentDate = {
            selectedMeeting:this.selectedMeeting,
            meetingDate:this.meetingDate
        }
    }
    // -------------------------------主表行点击，悬浮事件
    outTable() {
        this.flag2 = -1;
    }
    gotoClick(val){
        this.flag1 = val;
        this.flag2 = -1;
    }
    gotoCover(val) {
        this.flag2 = val;
        if (this.flag2 == this.flag1) {
            this.flag2 = -1;
        }
    }
}