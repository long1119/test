import {Component,OnInit} from '@angular/core';
import 'style-loader!./meeting.scss';
import {SelectItem, Message,ConfirmationService} from 'primeng/primeng';
import {Router} from "@angular/router";
import { MessageService} from '../../../service/message.service';
import {HttpDataService} from '../../../service/http.service';
import {
    DataManageService
} from '../../../service/dataManage.service';
import {
    DeleteComfirmService    
} from '../../../service/deleteDialog.service';
import {
    RefreshMenuService
} from '../../../service/refreshMenu.service';
import { create } from 'domain';
// import { window } from 'rxjs/operator/window';
@Component({
    selector: 'meeting',
    templateUrl: './meeting.html',
    providers: [RefreshMenuService,ConfirmationService]
  })
  export class meetingComponent {
    singleChange:boolean = false;
    selectedBoxelse:any[] = [];
    selectedBoxLabel:any[] = [];
    mutiProgram:any;
    programs:any[] = [];
    selectedProgram:any;
    meetingTopic:any;
    meetingTime:any;
    userTable:any[];
    selectUsers:boolean = false;
    msgs: Message[];
    meetingTable:any[] = [];
    petTable:any[];
    addAmeeting:boolean = false;
    display:boolean = false;
    flag1:boolean = false;
    flag2:boolean = false;
    flag3:boolean = false;
    header:any;
    add:boolean = false;
    add1:boolean = false;
    meetingId:any;
    // 增加会议弹框里的变量
    programCodes:any[] = [];
    meetingTopic1:any;
    programCode:any;
    meetingTime1:any;
    minute:number;
    venue:any;
    teleconferencing:any;
    meetingTopicTable:any[]=[];
    stepOne:boolean = false;
    stepTwo:boolean = false;
    footOne:boolean = false;
    footTwo:boolean = false;
    projectMemberTable:any[]=[];
    // 增加会议弹框里的 tab Attandance里的add 的变量
    projectMember:boolean = false;
    firstName:any;
    rolePosition:any;
    selectedValue:any;
    attendance:any;
    choosed:boolean;
    // modify:boolean = false;
    // 增加会议弹框里的 tab meeting topics里的add 的变量
    changeMeetingTopic:boolean = false;
    topicCategory2:any;
    topic2:any;
    time2:number;
    selectedDi2:any;
    presenter2:any;
    topicID:any;
    userCode2:any;
    // 增加会议主题变量
    topicCategory:any;
    topic:any;
    time:number;
    presenter:any;
    di:any[] = [];
    selectedDi:any;
    userCode1:any;
    // 增加meeting minus 变量
    topicCategory1:any;
    topic1:any;
    time1:number;
    presenter1:any;
    selectedDi1:any;
    decision:any;
    owner:any;
    date1:any;
    presenterName:any;
    ownerName:any;
    // 增加 issue 变量
    Issue:any;
    date2:any;
    decision1:any;
    owner1:any;
    date3:any;
    trackingForum:any;
    owner1Code:any;
    // selectedValues:any;
    selectedBox:any;
    checked:any;
    // tab 切换里的变量
    meetingTopics:any[] = [];
    topicId:any;
    minuteId:any;
    issueId:any;
    meetingMinutes:any[]=[];
    issueTrackingList:any[] = [];
    foolish:number = 0;
    // pet成员变量
    totalRecord:number;
    paginatorRow:number;  // 行数
    paginatorPage:number; // 页数
    userCode:any;
    department:any;
    userName:any;
    employeeId:any;
    // ====================================
    chooseFlag:number;
    column:number = 0;
    column1:any;
    minDate:any;
    minDate1:any;
    minDate2:any;
    compareTime:any;
    public yearRange: string;
    deleteSure:boolean = false;
    totalRecord1:number;
    paginatorRow1:number;  
    paginatorPage1:number; 
    totalRecord2:number;
    paginatorRow2:number;  
    paginatorPage2:number; 
    totalRecord3:number;
    paginatorRow3:number;  
    paginatorPage3:number; 
    totalRecord4:number;
    paginatorRow4:number;  
    paginatorPage4:number; 
    totalRecord5:number;
    paginatorRow5:number;  
    paginatorPage5:number; 
    max:number;
    createUser:any;
    newTime:any;
    tabFlag:boolean;   //new add 2018/1/10
    showPrograms:boolean = false;   //neew add 2018/1/12
    itemForProgramCode:any = "";  //new add 2018/1/20
    // ------------new add 2018/1/20
    growLife: number;
    response: any;
    bussinessId:any;
    file:boolean = false;
    attId:any;
    // -------------new add 2018/1/23
    remark:any;
    emailFlag:any;

    constructor(private httpService: HttpDataService, private msgService: MessageService, private dataManageService: DataManageService, private refreshMenuService: RefreshMenuService, private confirmationService: ConfirmationService, private deleteService: DeleteComfirmService) {
        // 刷新菜单默认选中项
        let flag = this.dataManageService.getUuId()
        this.refreshMenuService.refreshMenu(flag);
        // 日期年份设置
        let currentYear = new Date().getFullYear();
        this.yearRange = "" + (Number(currentYear) - 10) + ":" + (Number(currentYear) + 50);
    }
    ngOnInit(){
        this.createUser = window.localStorage.getItem("user");
        this.newTime = new Date();
        this.paginatorRow  = 10;
        this.paginatorPage = 1;
        this.paginatorPage1 = 1;
        this.paginatorRow1 = 10;
        this.paginatorPage2 = 1;
        this.paginatorRow2 = 10;
        this.paginatorPage3 = 1;
        this.paginatorRow3 = 10;
        this.paginatorPage4 = 1;
        this.paginatorRow4 = 10;
        this.paginatorPage5 = 1;
        this.paginatorRow5 = 10;
        // this.selectedDi = 'D';
        // this.selectedDi1 = 'D'
        // this.meetingTable = [
        //     {
        //         meetingTopic:"lllll"
        //     }
        // ];
        this.di = [
            {
                label:"D",
                value:"D"
            },
            {
                label:"I",
                value:"I"
            }
        ];
        // 会议模糊查询中的下拉框
        this.httpService.post("/bpd-proj/bpd/meeting/getProgramCombobox",{})
        .subscribe(data=>{
            this.programs = data;
            var one = {
                label:"All",
                value:""
            };
            this.programs.unshift(one);
            if(this.programs){
                this.selectedProgram = data[0].value;
                 // 查询会议
                 this.meeting();
                //  this.httpService.post("/bpd-proj/bpd/meeting/getList",{
                //     program:this.selectedProgram,
                //     meetingName:this.meetingTopic,
                //     meetingTime:this.meetingTime,
                //     "page":{ 
                //         "page": this.paginatorPage1,
                //         "rows": this.paginatorRow1
                //     }
                // }).subscribe(data =>{
                //     this.totalRecord1 = data.total;
                //     this.meetingTable = data.rows;
                //     if(this.meetingTable.length){
                //         for(let i=0;i<this.meetingTable.length;i++){
                //             let time = new Date(this.meetingTable[i].meetingTime.replace(/-/g,'/'));
                //             let y = time.getFullYear();
                //             let M = time.getMonth();
                //             let d = time.getDate();
                //             let h = time.getHours();
                //             let m = time.getMinutes();
                //             this.meetingTable[i].meetingTimeForCheck = new Date(y,M,d,h,m,0);
                //             this.meetingTable[i].programCode = this.meetingTable[i].programCode.slice(0,-1);
                //         }
                //     }
                //     this.meetingId = this.meetingTable[0].meetingId;
                //     this.tabFlag = (this.meetingTable[0].createUser==this.createUser)?true:false;
                //     this.checkMeetingTopic();
                // });
            }
        });
        this.getBoxData();
    }
    // 弹框请求事件
    getBoxData(){
        let timeStamp = Date.now();
        this.httpService.get("/bpd-proj//bpd/program/getAllProgramCombobox?"+timeStamp+"&programCode="+this.itemForProgramCode)
        .subscribe(data => {
            this.programCodes = data;
            // this.programCode = data[0].value;
        })
    }
    searchBoxData($event){
        if ($event.key === "Enter") {
            this.getBoxData();
        }
    }

    showProgramCodes(){
        this.showPrograms = true;

    }
    showDropdown(){
        if(this.singleChange){
            this.singleChange = false;
        }
        else{
            this.singleChange = true;
        }
    }
    showDropdown1(){
       this.singleChange = false;
    }
    showDropdown2(){
        this.singleChange = true;
    }
    // 打开增加会议弹框
    openAddMeeting(){
        this.emailFlag = false;
        this.mutiProgram = null;
        this.selectedBoxelse = [];
        this.minDate = new Date();
        this.meetingTopic1 = "";
        this.meetingTime1 = new Date();
        this.minute = null;
        // this.programCode = this.programCodes[0].value;
        this.venue = "";
        this.teleconferencing = "";
        this.stepOne = true;
        this.addAmeeting = true;
        this.footOne = true;
        this.stepTwo = false;
        this.footTwo = false;
        // this.getBoxData();
    }
    // check attendance
    checkAttendance(){
        this.httpService.post("/bpd-proj/bpd/attendance/getList",{
            meetingId:this.meetingId
        }).subscribe(data=>{
            this.projectMemberTable = data;
        })
    }
    // check meeting topics
    checkMeetingTopics(){
        this.httpService.post("/bpd-proj/bpd/meetingTopic/getList",{
            "meetingId":this.meetingId,
            "page":{ 
                "page": this.paginatorPage5,
                "rows": this.paginatorRow5
            }
        }).subscribe(data => {
            this.totalRecord5 = data.total;
            this.meetingTopicTable = data.rows;
        })
    }
    // add meeting 事件
    // addMeetingThing(){
    //     this.httpService.post("/bpd-proj/bpd/meeting/insert",{
    //         meetingId:this.meetingId,
    //         meetingName:this.meetingTopic1,
    //         program:this.programCode,
    //         meetingTime:this.meetingTime1,
    //         minutes:this.minute,
    //         venue:this.venue,
    //         teleconferencing:this.teleconferencing
    //     }).subscribe(data => {
    //         if(data.code == 1){
    //             this.msgService.showSuccess('Opration succeed!');
    //         }
    //         else{
    //             this.msgService.showError('Opration failed!');
    //         }
    //         this.msgs = this.msgService.msgs;
    //         this.meetingTable = data; 
    //     })
    // }
    // 时间转换
    timeChange(time){
        if(time){
            var myDate = new Date(time);
            time = myDate.getFullYear()+'-'+(myDate.getMonth()+1)+'-'+myDate.getDate()
            +' '+myDate.getHours()+':'+myDate.getMinutes()+':'+myDate.getSeconds();
            return time;
        }
    }
    // timeChange1(time){
    //     if(time){
    //         var myDate1 = new Date(time);
    //         time = myDate1.getFullYear()+'-'+(myDate1.getMonth()+1)+'-'+myDate1.getDate();
    //         return time;
    //     }
    // }
    // 增加会议
    confirmMeeting(){
        let meetingTime11 = this.timeChange(this.meetingTime1);
        this.httpService.post("/bpd-proj/bpd/meeting/insert",{
            // meetingId:this.meetingId,
            meetingName:this.meetingTopic1,
            // program:this.programCode,
            program:this.selectedBoxelse.join(","),
            meetingTime:meetingTime11,
            minutes:this.minute,
            venue:this.venue,
            teleconferencing:this.teleconferencing
        }).subscribe(data => {
            if(data.code == 1){
                this.meetingId = data.meetingId;
                this.msgService.showSuccess('Opration Succeed!');
                this.growLife = 5000;
                this.meetingId = data.meetingId;
                this.checkAttendance();
                this.stepOne = false;
                this.footOne = false;
                this.stepTwo = true;
                // this.footTwo = true;
                this.meeting();
            }
            else if(data.code == 2){
                this.msgService.showInfo('Meeting Time Must Greater Than Current Time!');
                this.growLife = 3000000;
            }
            else{
                this.msgService.showError('Opration Failed!');
                this.growLife = 5000;
            }
            this.msgs = this.msgService.msgs;
        })
        // this.checkAttendance();
        // this.stepOne = false;
        // this.footOne = false;
        // this.stepTwo = true;
        // this.footTwo = true;
        // this.checkPet();
    }
    handleChange1(e){
        if(e.index==0){
            this.checkAttendance();
        }
        else{
            this.checkMeetingTopics();
        }
    }
    // 查询pet成员
    checkPet(){
        this.httpService.post("/bpd-proj/bpd/user/getVList",{
            department:this.department,
            userName:this.userName,
            employeeCode:this.employeeId,
            "page": {
                "page": this.paginatorPage,
                "rows": this.paginatorRow
              }
        }).subscribe(data=>{
            this.totalRecord = data.total;
            this.userTable = data.rows;
        })
    }
    // 回车模糊查询
    checkUserEnterSearch($event) {
        if ($event.key === "Enter") {
            this.checkUsers();
        }
    }
    // pet成员模糊查询
    checkUsers(){
        this.paginatorPage = 1;
        this.paginatorRow = 10;
        this.checkPet();
    }
    // pet成员分页事件
    paginate($event){
        this.paginatorPage = $event.page + 1;
        this.paginatorRow = $event.rows;
        this.checkPet();
    }
    // 导入pet成员
    initialFromPet(){
        let timeStamp = new Date().getTime();
        this.httpService.get("/bpd-proj/bpd/attendance/batchAdd?"+timeStamp+"&meetingId="+this.meetingId)
        .subscribe(data=>{
            if(data.code == 1){
                this.msgService.showSuccess('Opration Succeed!');
                this.growLife = 5000;
                this.checkAttendance();
            }
            else if(data.code == 7){
                this.msgService.showInfo(data.msg);
                this.growLife = 3000000;
            }
            this.msgs = this.msgService.msgs;
        })
    }
    // 从pet成员选择
    choosePet(){
        this.chooseFlag = 1;
        this.checkPet();
        this.selectUsers = true;
    }
    choosePet1(){
        this.chooseFlag = 2;
        this.checkPet();
        this.selectUsers = true; 
    }
    choosePet2(){
        this.chooseFlag = 3;
        this.checkPet();
        this.selectUsers = true; 
    }
    choosePet3(){
        this.chooseFlag = 4;
        this.checkPet();
        this.selectUsers = true; 
    }
    choosePet4(){
        this.chooseFlag = 5;
        this.checkPet();
        this.selectUsers = true; 
    }
    choosePet5(){
        this.chooseFlag = 6;
        this.checkPet();
        this.selectUsers = true; 
    }
    // 双击选择
    // giveUser(val1,val2,val3){
    //     if(this.chooseFlag == 1){
    //         this.userCode1 = val2;
    //         this.presenter = val1;
    //     }
    //     else if(this.chooseFlag == 2){
    //         this.firstName = val1;
    //         this.userCode = val2;
    //         this.rolePosition = val3;
    //     }
    //     else if(this.chooseFlag == 3){
    //         this.presenter2 = val1;
    //         this.userCode2 = val2;
    //     }
    //     else if(this.chooseFlag == 4){
    //         this.presenter1 = val2;
    //         this.presenterName = val1;
    //     }
    //     else if(this.chooseFlag == 5){
    //         this.owner = val2;
    //         this.ownerName = val1;
    //     }
    //     else{
    //         this.owner1Code = val2;
    //         this.owner1 = val1;
    //     }
    //     this.selectUsers = false;
    // }
    giveUser(e){
        if(this.chooseFlag == 1){
            this.userCode1 = e.data.userCode;
            this.presenter = e.data.userName;
        }
        else if(this.chooseFlag == 2){
            this.firstName = e.data.userName;
            this.userCode = e.data.userCode;
            this.rolePosition = e.data.jobPosition;
        }
        else if(this.chooseFlag == 3){
            this.presenter2 = e.data.userName;
            this.userCode2 = e.data.userCode;
        }
        else if(this.chooseFlag == 4){
            this.presenter1 = e.data.userCode;
            this.presenterName = e.data.userName;
        }
        else if(this.chooseFlag == 5){
            this.owner = e.data.userCode;
            this.ownerName = e.data.userName;
        }
        else{
            this.owner1Code = e.data.userCode;
            this.owner1 = e.data.userName;
        }
        this.selectUsers = false;
    }
    // meeting tab切换Attandance里的add&modify 提交
    addProjectMember(){
        if(this.add1){
            this.httpService.post("/bpd-proj/bpd/attendance/insert",{
                meetingId:this.meetingId,
                sourceId:this.userCode,
                rolePosition:this.rolePosition,
                attendenceName:this.firstName,
                attend:this.selectedValue
            }).subscribe(data=>{
                if(data.code == 1){
                    this.msgService.showSuccess('Opration Succeed!');
                    this.growLife = 5000;
                    this.checkAttendance();
                }
                else{
                    this.msgService.showError('Opration Failed!');
                    this.growLife = 5000;
                }
                this.msgs = this.msgService.msgs;
            });
            this.add1 = false;
        }
        else{
            this.httpService.post("/bpd-proj/bpd/attendance/update",{
                attendenceId:this.attendance,
                meetingId:this.meetingId,
                sourceId:this.userCode,
                rolePosition:this.rolePosition,
                attendenceName:this.firstName,
                attend:this.selectedValue
            }).subscribe(data=>{
                if(data.code == 1){
                    this.msgService.showSuccess('Opration Succeed!');
                    this.growLife = 5000;
                    this.checkAttendance();
                }
                else{
                    this.msgService.showError('Opration Failed!');
                    this.growLife = 5000;
                }
                this.msgs = this.msgService.msgs;
            })
        }
        this.projectMember = false;
    }
    // meeting tab切换meeting topics里的add&modify 提交
    confirmMeetingTopic(){
        if(this.add1){
            this.httpService.post("/bpd-proj/bpd/meetingTopic/insert",{
                meetingId:this.meetingId,
                topicCategory:this.topicCategory2,
                theme:this.topic2,
                time:this.time2,
                di:this.selectedDi2,
                presenter:this.userCode2
            }).subscribe(data=>{
                if(data.code == 1){
                    this.msgService.showSuccess('Opration Succeed!');
                    this.growLife = 5000;
                    this.checkMeetingTopics();
                }
                else{
                    this.msgService.showError('Opration Failed!');
                    this.growLife = 5000;
                }
                this.msgs = this.msgService.msgs;
            })
            this.add1 = false;
        }
        else{
            this.httpService.post("/bpd-proj/bpd/meetingTopic/update",{
                topicId:this.topicID,
                topicCategory:this.topicCategory2,
                theme:this.topic2,
                time:this.time2,
                di:this.selectedDi2,
                presenter:this.userCode2
            }).subscribe(data=>{
                if(data.code == 1){
                    this.msgService.showSuccess('Opration Succeed!');
                    this.growLife = 5000;
                    this.checkMeetingTopics();
                }
                else{
                    this.msgService.showError('Opration Failed!');
                    this.growLife = 5000;
                }
                this.msgs = this.msgService.msgs;
            })
        }
        this.changeMeetingTopic = false;
    }
    // meeting tab切换Attandance里的修改事件
    modifyProjectMember(val){
        this.firstName = val.attendenceName;
        this.rolePosition = val.rolePosition;
        this.selectedValue = val.attend;
        this.attendance = val.attendenceId;
        this.header = "Modify Attendance";
        this.projectMember = true;
    }
    // meeting tab切换Attandance里的删除事件
    deleteProjectMember(value){
        this.confirmationService.confirm({
            message: 'Do You Want To Delete This Record?',
            header: 'Delete Confirmation',
            icon: 'fa fa-trash',
            accept: () => {
                let timeStamp = new Date().getTime();
                this.httpService.get("/bpd-proj/bpd/attendance/delete?"+timeStamp+"&attendenceId="+value,)
                .subscribe(data=>{
                    if(data.code == 1){
                        this.msgService.showSuccess('Opration Succeed!');
                        this.growLife = 5000;
                        this.checkAttendance();
                    }
                    else{
                        this.msgService.showError('Opration Failed!');
                        this.growLife = 5000;
                    }
                    this.msgs = this.msgService.msgs;
                })
            }
          });
    }
    // meeting tab切换meeting topics里的修改事件
    modifyMeetingTop(value){
        this.topicID = value.topicId;
        this.topicCategory2 = value.topicCategory;
        this.topic2 = value.theme;
        this.time2 = value.time;
        this.selectedDi2 = value.di;
        this.presenter2 = value.userName;
        this.userCode2 = value.presenter;
        this.header = "Modify Meeting Topic";
        this.changeMeetingTopic = true;
    }
    // meeting tab切换meeting topics里的删除事件
    deleteMeetingTop(value){
        this.confirmationService.confirm({
            message: 'Do You Want To Delete This Record?',
            header: 'Delete Confirmation',
            icon: 'fa fa-trash',
            accept: () => {
                let timeStamp = new Date().getTime();
                this.httpService.get("/bpd-proj/bpd/meetingTopic/delete?"+timeStamp+"&topicId="+value)
                .subscribe(data=>{
                    if(data.code == 1){
                        this.msgService.showSuccess('Opration Succeed!');
                        this.growLife = 5000;
                        this.checkMeetingTopics();
                    }
                    else{
                        this.msgService.showError('Opration Failed!');
                        this.growLife = 5000;
                    }
                    this.msgs = this.msgService.msgs;
                })
            }
          });
    }
    // 查询会议
    meeting(){
        if(this.meetingTime){
            var myDate = new Date(this.meetingTime);
            this.meetingTime = myDate.getFullYear()+'-'+(myDate.getMonth()+1)+'-'+myDate.getDate();
        }
        // this.httpService.post("/bpd-proj/bpd/meeting/getList",{
        //     "program":this.selectedProgram,
        //     "meetingName":this.meetingTopic,
        //     "meetingTime":this.meetingTime,
        //     "page":{ 
        //         "page": this.paginatorPage1,
        //         "rows": this.paginatorRow1
        //     }
        // }).subscribe(data =>{
        //     this.totalRecord1 = data.total;
        //     this.meetingTable = data.rows;
        //     if(this.meetingTable.length){
        //         for(let i=0;i<this.meetingTable.length;i++){
        //             let time = new Date(this.meetingTable[i].meetingTime.replace(/-/g,'/'));
        //             let y = time.getFullYear();
        //             let M = time.getMonth();
        //             let d = time.getDate();
        //             let h = time.getHours();
        //             let m = time.getMinutes();
        //             this.meetingTable[i].meetingTimeForCheck = new Date(y,M,d,h,m,0);
        //             this.meetingTable[i].programCode = this.meetingTable[i].programCode.slice(0,-1);
        //         }
        //     }
        // });
        this.httpService.post("/bpd-proj/bpd/meeting/getList",{
            "program":this.selectedProgram,
            "meetingName":this.meetingTopic,
            "meetingTime":this.meetingTime,
            "page":{ 
                "page": this.paginatorPage1,
                "rows": this.paginatorRow1
            }
        }).subscribe(data =>{
            this.totalRecord1 = data.total;
            this.meetingTable = data.rows;
            if(this.meetingTable.length){
                for(let i=0;i<this.meetingTable.length;i++){
                    let time = new Date(this.meetingTable[i].meetingTime.replace(/-/g,'/'));
                    let y = time.getFullYear();
                    let M = time.getMonth();
                    let d = time.getDate();
                    let h = time.getHours();
                    let m = time.getMinutes();
                    this.meetingTable[i].meetingTimeForCheck = new Date(y,M,d,h,m,0);
                    this.meetingTable[i].programCode = this.meetingTable[i].programCode.slice(0,-1);
                }
                this.meetingId = this.meetingTable[0].meetingId;
                this.tabFlag = (this.meetingTable[0].createUser==this.createUser)?true:false;
                this.column = 0;
                if(this.foolish == 0){
                    this.checkMeetingTopic();
                }
                else if(this.foolish == 1){
                    this.checkMeetingMinutes();
                }
                else{
                    this.checkMeetingIssue();
                }
            }
            else{
                this.meetingId = null;
                if(this.foolish == 0){
                    this.meetingTopics = [];
                }
                else if(this.foolish == 1){
                    this.meetingMinutes = [];
                }
                else{
                    this.issueTrackingList = [];
                }
            };
        });
    }
    // 查询会议分页
    paginate1(e){
        this.paginatorPage1 = e.page + 1;
        this.paginatorRow1 = e.rows;
        this.meeting();
    }


    paginate2(e){
        this.paginatorPage2 = e.page + 1;
        this.paginatorRow2 = e.rows;
    }
    paginate3(e){
        this.paginatorPage3 = e.page + 1;
        this.paginatorRow3 = e.rows;
    }
    paginate4(e){
        this.paginatorPage4 = e.page + 1;
        this.paginatorRow4 = e.rows;
    }
    paginate5(e){
        this.paginatorPage5 = e.page + 1;
        this.paginatorRow5 = e.rows;
    }
    // 回车查询
    checkMeetingEnterSearch($event) {
        if ($event.key === "Enter") {
            // this.checkMeeting();
            this.meeting();
        }
    }

    checkBoxData($event){
        if ($event.key === "Enter") {
            this.getBoxData();
        }
    }
    gotoView(){
        this.selectedBoxLabel = [];
        for(let i=0;i<this.programCodes.length;i++){
            if(this.selectedBoxelse.find((n)=> n==this.programCodes[i].value)){
                this.selectedBoxLabel.push(this.programCodes[i].label);
            }
        }
        this.mutiProgram = this.selectedBoxLabel.join(",")
    }
    // 会议模糊查询
    // checkMeeting(){
    //     if(this.meetingTime){
    //         var myDate = new Date(this.meetingTime);
    //         this.meetingTime = myDate.getFullYear()+'-'+(myDate.getMonth()+1)+'-'+myDate.getDate();
    //     };
    //     this.httpService.post("/bpd-proj/bpd/meeting/getList",{
    //         program:this.selectedProgram,
    //         meetingName:this.meetingTopic,
    //         meetingTime:this.meetingTime,
    //         "page":{ 
    //             "page": this.paginatorPage1,
    //             "rows": this.paginatorRow1
    //         }
    //     }).subscribe(data =>{
    //         this.totalRecord1 = data.total;
    //         this.meetingTable = data.rows;
    //         if(this.meetingTable.length){
    //             for(let i=0;i<this.meetingTable.length;i++){
    //                 let time = new Date(this.meetingTable[i].meetingTime.replace(/-/g,'/'));
    //                 let y = time.getFullYear();
    //                 let M = time.getMonth();
    //                 let d = time.getDate();
    //                 let h = time.getHours();
    //                 let m = time.getMinutes();
    //                 this.meetingTable[i].meetingTimeForCheck = new Date(y,M,d,h,m,0);
    //                 this.meetingTable[i].programCode = this.meetingTable[i].programCode.slice(0,-1);
    //             };
    //             this.meetingId = this.meetingTable[0].meetingId;
    //             if(this.foolish == 0){
    //                 this.checkMeetingTopic();
    //             }
    //             else if(this.foolish == 1){
    //                 this.checkMeetingMinutes();
    //             }
    //             else{
    //                 this.checkMeetingIssue();
    //             }
    //         }
    //         else{
    //             this.meetingId = null;
    //             if(this.foolish == 0){
    //                 this.meetingTopics = [];
    //             }
    //             else if(this.foolish == 1){
    //                 this.meetingMinutes = [];
    //             }
    //             else{
    //                 this.issueTrackingList = [];
    //             }
    //         };
    //     });
    // }
    // 修改会议
    editMeeting(value){
        // this.getBoxData();
        this.remark = value.description;
        this.emailFlag = (value.mailFlag=='1')?true:false;
        console.log(this.emailFlag);
        this.minDate = new Date();
        let newTime = value.meetingTime.replace(/-/g,"/");
        let newMeetingTime = new Date(newTime);
        this.addAmeeting = true;
        this.meetingId = value.meetingId;
        this.stepOne = true;
        this.footOne = false;
        this.stepTwo = true;
        this.footTwo = true;
        this.meetingTopic1 = value.meetingName;
        this.venue = value.venue;
        // this.meetingTime1 = new Date(value.meetingTime);
        this.meetingTime1 = newMeetingTime;
        this.minute = value.minutes;
        // this.programCode = value.program;
        this.selectedBoxelse = value.program.split(",");
        this.selectedBoxLabel = [];
        for(let i=0;i<this.programCodes.length;i++){
            if(this.selectedBoxelse.find((n)=> n==this.programCodes[i].value)){
                this.selectedBoxLabel.push(this.programCodes[i].label);
            }
        }
        this.mutiProgram = this.selectedBoxLabel.join(",")
        this.teleconferencing = value.teleconferencing;
        this.checkAttendance();
        this.checkMeetingTopics();
    }
    // 提交修改
    confirmMeeting1(){
        let meetingTime11 = this.timeChange(this.meetingTime1);
        this.httpService.post("/bpd-proj/bpd/meeting/update",{
            meetingId:this.meetingId,
            meetingName:this.meetingTopic1,
            program:this.selectedBoxelse.join(","),
            meetingTime:meetingTime11,
            minutes:this.minute,
            venue:this.venue,
            teleconferencing:this.teleconferencing,
            description:this.remark
        }).subscribe(data => {
            if(data.code == 1){
                this.msgService.showSuccess('Opration Succeed!');
                this.growLife = 5000;
                this.meeting();
            }
            else if(data.code == 2){
                this.msgService.showInfo('Meeting Has Started!');
                this.growLife = 3000000;
            }
            else{
                this.msgService.showError('Opration Failed!');
                this.growLife = 5000;
            }
            this.msgs = this.msgService.msgs;
        })
        this.addAmeeting = false;
    }
    // 发送会议邮件 
    notification(){
       this.httpService.post("/bpd-proj/bpd/meeting/mailNotification",{
           "meetingId":this.meetingId
       }).subscribe(data => {
        if(data.code == 1){
            this.msgService.showSuccess('Opration Succeed!');
            this.growLife = 5000;
            this.meeting();
        }
        else if(data.code == 2){
            this.msgService.showInfo('No Pet Member!');
            this.growLife = 3000000;
        }
        else{
            this.msgService.showError('Opration Failed!');
            this.growLife = 5000;
        }
        this.msgs = this.msgService.msgs;
       }) 
    }
    notification1(){
        this.httpService.post("/bpd-proj/bpd/minutes/mailNotification",{
            "meetingId":this.meetingId
        }).subscribe(data => {
         if(data.code == 1){
             this.msgService.showSuccess('Opration Succeed!');
             this.growLife = 5000;
         }
         else if(data.code == 2){
             this.msgService.showInfo('No Meeting Minutes!');
             this.growLife = 3000000;
         }
         else if (data.code == 3) {
             this.msgService.showInfo("Owner Can Not Empty!");
             this.growLife = 3000000;
         }
         else{
             this.msgService.showError('Opration Failed!');
             this.growLife = 5000;
         }
         this.msgs = this.msgService.msgs;
        }) 
    }
    notification2(){
        this.httpService.post("/bpd-proj/bpd/issueTracking/mailNotification",{
            "meetingId":this.meetingId
        }).subscribe(data => {
         if(data.code == 1){
             this.msgService.showSuccess('Opration Succeed!');
             this.growLife = 5000;
         }
         else if(data.code == 2){
             this.msgService.showInfo('No Meeting Issue Tracking List!');
             this.growLife = 3000000;
         }
         else if (data.code == 3) {
             this.msgService.showInfo("Owner Can Not Empty!");
             this.growLife = 3000000;
         }
         else{
             this.msgService.showError('Opration Failed!');
             this.growLife = 5000;
         }
         this.msgs = this.msgService.msgs;
        }) 
    }
    // 删除会议
    deleteMeeting(value){
       this.meetingId = value;
       this.confirmationService.confirm({
        message: 'Do You Want To Delete This Record?',
        header: 'Delete Confirmation',
        icon: 'fa fa-trash',
        accept: () => {
            let timeStamp = new Date().getTime();
            this.httpService.get("/bpd-proj/bpd/meeting/delete?"+timeStamp+"&meetingId="+this.meetingId)
            .subscribe(data => {
                if(data.code == 1){
                    this.msgService.showSuccess('Opration Succeed!');
                    this.growLife = 5000;
                    this.meeting();
                    // if(this.foolish == 0){
                    //     this.checkMeetingTopic();
                    // }
                    // else if(this.foolish == 1){
                    //     this.checkMeetingMinutes();
                    // }
                    // else{
                    //     this.checkMeetingIssue();
                    // }
                    // this.column = 1;
                    this.deleteSure = false;
                }
                else if(data.code == 2){
                    this.msgService.showInfo('Meeting Has Started!');
                    this.growLife = 3000000;
                }
                else{
                    this.msgService.showError('Opration Failed!');
                    this.growLife = 5000;
                }
                this.msgs = this.msgService.msgs;
            })
        }
      });
    }
   
    // 表格的行悬浮事件
    gotoCover(value) { 
        this.column1 = value;
        if (this.column1 == this.column) {
            this.column1 = -1;
        }
    }
    // 会议表的行点击事件 
    giveId(value1,value2,value3,value4,value5){
        this.tabFlag = (this.createUser==value5)?true:false;
        this.max = value4;
        this.compareTime = value3;
        this.column = value2;
        if (this.column1 == this.column) {
            this.column1 = -1;
        }
        this.meetingId = value1;
        if(this.foolish == 0){
            this.checkMeetingTopic();
        }
        else if(this.foolish == 1){
            this.checkMeetingMinutes();
        }
        else{
            this.checkMeetingIssue();
        }
        // this.checkMeetingTopic();
        // this.checkMeetingMinutes();
        // this.checkMeetingIssue();
    }
    // 查询会议主题
    checkMeetingTopic(){
        if(this.meetingId != null){
            this.httpService.post("/bpd-proj/bpd/meetingTopic/getList",{
                "meetingId":this.meetingId,
                "page":{ 
                    "page": this.paginatorPage2,
                    "rows": this.paginatorRow2
                }
            }).subscribe(data => {
                this.totalRecord2 = data.total;
                this.meetingTopics = data.rows;
            })
        }
        else{
            this.meetingTopics = [];
        }
    }
    // 增加会议主题事件
    addMeetingTopic(){
        this.httpService.post("/bpd-proj/bpd/meetingTopic/insert",{
            // topicId: '',
            topicCategory: this.topicCategory,
            theme:this.topic,
            di:this.selectedDi,
            meetingId:this.meetingId,
            presenter:this.userCode1,
            time:this.time
        }).subscribe(data => {
            if ("1" == data.code) { //操作成功
                this.msgService.showSuccess('Opration Succeed!');
                this.growLife = 5000;
                this.checkMeetingTopic();
            } else { //操作失败
                this.msgService.showError('Opration Failed!');
                this.growLife = 5000;
            }
            //获取操作信息
            this.msgs = this.msgService.msgs;
        })
    }
    openEditBox(value){
        this.add = false;
        this.topicId = value.topicId;
        this.topicCategory = value.topicCategory;
        this.topic = value.theme;
        this.time = value.time;
        this.presenter = value.userName;
        this.userCode1 = value.presenter;
        this.selectedDi = value.di;
        this.display = true;
        this.flag1 = true;
        this.flag2 = false;
        this.flag3 = false;
    }
    openEditBox1(value){
        this.add = false;
        this.minDate1 = new Date(this.compareTime);
        let newDate = null;
        if ( value.targetCloseDate != null) {
            let newTime = value.targetCloseDate.replace(/-/g,"/");
            newDate = new Date(newTime);
        }
        this.minuteId = value.minutesId;
        this.topicCategory1 = value.topicCategory;
        this.topic1 = value.topic;
        this.time1 = value.time;
        this.presenterName = value.presenterName;
        this.presenter1 = value.presenter;
        this.selectedDi1 = value.di;
        this.decision = value.decisionAction;
        this.ownerName = value.ownerName;
        this.owner = value.owner;
        // this.date1 = new Date(value.targetCloseDate);
        this.date1 = newDate;
        this.display = true;
        this.flag2 = true;
        this.flag1 = false;
        this.flag3 = false; 
    }
    openEditBox2(value){
        this.add = false;
        this.minDate2 = new Date();
        let newTime1 = value.issueDate.replace(/-/g,"/");
        let newDate1 = new Date(newTime1);
        let newTime2 = value.targetDate.replace(/-/g,"/");
        let newDate2 = new Date(newTime2);
        this.issueId = value.meetingTrackingId;
        this.Issue = value.item;
        // this.date2 = new Date(value.issueDate);
        this.date2 = newDate1;
        this.decision1 = value.decisionAction;
        this.owner1 = value.ownerName;
        // this.date3 = new Date(value.targetDate);
        this.date3 = newDate2;
        this.trackingForum = value.trackingForum;
        this.selectedBox = value.status;
        this.display = true;
        this.flag3 = true;
        this.flag1 = false;
        this.flag2 = false;
        if(this.selectedBox == 1){
            this.checked = true;
        }
        else{
            this.checked = false;
        }
    }
    // 修改会议主题
    modifyMeetingTopic(){
        this.httpService.post("/bpd-proj/bpd/meetingTopic/update",{
            topicId: this.topicId,
            topicCategory: this.topicCategory,
            theme:this.topic,
            di:this.selectedDi,
            meetingId:this.meetingId,
            presenter:this.userCode1,
            time:this.time
        }).subscribe(data => {
            if ("1" == data.code) { //操作成功
                this.msgService.showSuccess('Opration Succeed!');
                this.growLife = 5000;
                this.checkMeetingTopic();
            } else { //操作失败
                this.msgService.showError('Opration Failed!');
                this.growLife = 5000;
            }
            //获取操作信息
            this.msgs = this.msgService.msgs;
        })
    }
    // 删除会议主题
    deleteMeetingTopic(value){
        this.confirmationService.confirm({
            message: 'Do You Want To Delete This Record?',
            header: 'Delete Confirmation',
            icon: 'fa fa-trash',
            accept: () => {
                let timeStamp = new Date().getTime();
                this.httpService.get("/bpd-proj/bpd/meetingTopic/delete?"+timeStamp+"&topicId="+value)
                .subscribe(data => {
                    if ("1" == data.code) { //操作成功
                        this.msgService.showSuccess('Opration Succeed!');
                        this.growLife = 5000;
                        this.checkMeetingTopic();
                    } else { //操作失败
                        this.msgService.showError('Opration Failed!');
                        this.growLife = 5000;
                    }
                    //获取操作信息
                    this.msgs = this.msgService.msgs;
                })
            }
          });
    }
    // 查询会议minutes
    checkMeetingMinutes(){
        if(this.meetingId !=null){
            this.httpService.post("/bpd-proj/bpd/minutes/getList",{
                "meetingId":this.meetingId,
                "page":{ 
                    "page": this.paginatorPage3,
                    "rows": this.paginatorRow3
                }
            }).subscribe(data => {
                this.totalRecord3 = data.total;
                this.meetingMinutes = data.rows;
            })
        }
        else{
            this.meetingMinutes = [];
        }
    }
    // add 会议minutes
    addMeetingMinutes(){
        let date11 = this.timeChange(this.date1);
        this.httpService.post("/bpd-proj/bpd/minutes/insert",{
            meetingId:this.meetingId,
            time:this.time1,
            topicCategory:this.topicCategory1,
            topic:this.topic1,
            decisionAction:this.decision,
            owner:this.owner,
            presenter:this.presenter1,
            di:this.selectedDi1,
            targetCloseDate:date11
        }).subscribe(data => {
            if ("1" == data.code) { //操作成功
                this.msgService.showSuccess('Opration Succeed!');
                this.checkMeetingMinutes();
                this.growLife = 5000;
            } 
            else if("2" == data.code){
                this.growLife = 3000000;
                this.msgService.showInfo('Target Close Date Must Be Greater Than '+this.compareTime);
            }
            else { //操作失败
                this.msgService.showError('Opration Failed!');
                this.growLife = 5000;
            }
            //获取操作信息
            this.msgs = this.msgService.msgs;
        })
    }
    // 修改 会议minutes
    modifyMeetingMinutes(){
        let date11 = this.timeChange(this.date1);
        this.httpService.post("/bpd-proj/bpd/minutes/update",{
            meetingId:this.meetingId,
            minutesId:this.minuteId,
            time:this.time1,
            topicCategory:this.topicCategory1,
            topic:this.topic1,
            decisionAction:this.decision,
            owner:this.owner,
            presenter:this.presenter1,
            di:this.selectedDi1,
            targetCloseDate:date11
        }).subscribe(data => {
            if ("1" == data.code) { //操作成功
                this.msgService.showSuccess('Opration Succeed!');
                this.growLife = 5000;
                this.checkMeetingMinutes();
            }
            else if("2" == data.code){
                this.msgService.showInfo('Target Close Date Must Be Greater Than'+this.compareTime);
                this.growLife = 3000000;
            }
             else { //操作失败
                this.msgService.showError('Opration Failed!');
                this.growLife = 5000;
            }
            //获取操作信息
            this.msgs = this.msgService.msgs;
        })
    }
    // 删除会议minutes
    deleteMeetingMinutes(value){
        this.confirmationService.confirm({
            message: 'Do You Want To Delete This Record?',
            header: 'Delete Confirmation',
            icon: 'fa fa-trash',
            accept: () => {
                let timeStamp = new Date().getTime();
                this.httpService.get("/bpd-proj/bpd/minutes/delete?"+timeStamp+"&minutesId="+value)
                .subscribe(data => {
                    if ("1" == data.code) { //操作成功
                        this.msgService.showSuccess('Opration Succeed!');
                        this.growLife = 5000;
                        this.checkMeetingMinutes();
                    } else { //操作失败
                        this.msgService.showError('Opration Failed!');
                        this.growLife = 5000;
                    }
                    //获取操作信息
                    this.msgs = this.msgService.msgs;
                })
            }
          });
    }
    // 查询会议跟踪
    checkMeetingIssue(){
        if(this.meetingId != null){
            this.httpService.post("/bpd-proj/bpd/issueTracking/getList",{
                "meetingId":this.meetingId,
                "page":{ 
                    "page": this.paginatorPage4,
                    "rows": this.paginatorRow4
                }
            }).subscribe(data => {
                this.totalRecord4 = data.total;
                this.issueTrackingList = data.rows;
            })
        }
        else{
            this.issueTrackingList = [];
        }
    }
    // 增加会议跟踪
    addMeetingIssue(){
        let date22 = this.timeChange(this.date2);
        let date33 = this.timeChange(this.date3);
        if(this.checked == true){
            this.selectedBox = 1;
        }
        else{
            this.selectedBox = 0;
        };
        this.httpService.post("/bpd-proj/bpd/issueTracking/insert",{
            meetingId:this.meetingId,
            issueDate:date22,
            item:this.Issue,
            decisionAction:this.decision1,
            targetDate:date33,
            trackingForum:this.trackingForum,
            status:this.selectedBox,
            owner:this.owner1Code
        }).subscribe(data => {
            if ("1" == data.code) { //操作成功
                this.msgService.showSuccess('Opration Succeed!');
                this.growLife = 5000;
                this.checkMeetingIssue();
            } else if ("2" == data.code) {
                this.msgService.showInfo('Issue Date Can Not Less Than Current Date!');
                this.growLife = 3000000;
            } else if ("3" == data.code) {
                this.msgService.showInfo('Target Close Date Can Not Less Than Issue Date!');
                this.growLife = 3000000;
            } else { //操作失败
                this.msgService.showError('Opration Failed!');
                this.growLife = 5000;
            }
            //获取操作信息
            this.msgs = this.msgService.msgs;
        })
    }
    // 修改会议跟踪
    modifyMeetingIssue(){
        let date22 = this.timeChange(this.date2);
        let date33 = this.timeChange(this.date3);
        if(this.checked == true){
            this.selectedBox = 1;
        }
        else{
            this.selectedBox = 0;
        };
        this.httpService.post("/bpd-proj/bpd/issueTracking/update",{
            meetingTrackingId:this.issueId,
            issueDate:date22,
            item:this.Issue,
            decisionAction:this.decision1,
            targetDate:date33,
            trackingForum:this.trackingForum,
            status:this.selectedBox,
            owner:this.owner1Code
        }).subscribe(data => {
            if ("1" == data.code) { //操作成功
                this.msgService.showSuccess('Opration Succeed!');
                this.growLife = 5000;
                this.checkMeetingIssue();
            } else { //操作失败
                this.msgService.showError('Opration Failed!');
                this.growLife = 5000;
            }
            //获取操作信息
            this.msgs = this.msgService.msgs;
        })
    }

    // 删除会议跟踪
    deleteMeetingIssue(value){
        this.confirmationService.confirm({
            message: 'Do You Want To Delete This Record?',
            header: 'Delete Confirmation',
            icon: 'fa fa-trash',
            accept: () => {
                let timeStamp = new Date().getTime();
                this.httpService.get("/bpd-proj/bpd/issueTracking/delete?"+timeStamp+"&meetingTrackingId="+value)
                .subscribe(data => {
                    if ("1" == data.code) { //操作成功
                        this.msgService.showSuccess('Opration Succeed!');
                        this.growLife = 5000;
                        this.checkMeetingIssue();
                    } else { //操作失败
                        this.msgService.showError('Opration Failed!');
                        this.growLife = 5000;
                    }
                    //获取操作信息
                    this.msgs = this.msgService.msgs;
                }) 
            }
          });
    }
    // tab切换 增加会议主题
    addAmeetingTopic(){
        this.add = true;
        this.display = true;
        this.header = "Add Meeting Topic";
        this.flag1 = true;
        this.flag2 = false;
        this.flag3 = false;
        this.selectedDi = 'D';
        this.topicCategory = '';
        this.topic = '';
        this.time = null;
        this.presenter = '';
        this.userCode1 = '';
    }
     // tab切换 增加 meeting minutes
     addAmeetingMinutes(){
        this.minDate1 = new Date(this.compareTime);
        this.add = true;
        this.display = true;
        this.header = "Add Meeting Minutes";
        this.flag2 = true;
        this.flag1 = false;
        this.flag3 = false;
        this.selectedDi1 = 'D';
        this.topicCategory1 = '';
        this.topic1 = '';
        this.time1 = null;
        this.presenterName = '';
        this.decision = '';
        this.owner = '';
        this.date1 = new Date();
        this.ownerName = '';
    }
    // tab切换 增加 issue
    addIssue(){
      this.minDate2 = new Date();
      this.add = true;
      this.display = true;
      this.header = "Add Issue";
      this.flag3 = true;
      this.flag1 = false;
      this.flag2 = false;
      this.Issue = '';
      this.date2 = new Date();
      this.decision1 = '';
      this.owner1 = '';
      this.owner1Code = '';
    //   this.date3 = ' ';
      this.trackingForum = '';
      this.selectedBox = 0;
      this.checked = false;
    }
    // tab切换事件
    handleChange(e){
       this.foolish = e.index;
       if(e.index == 0){
         this.checkMeetingTopic();
       }
       else if(e.index == 1){
         this.checkMeetingMinutes();
       }
       else if(e.index == 2){
        this.checkMeetingIssue();
       }
    }
    // tab切换里提交增加或修改事件
    confirm(){
        if(this.flag1 == true){
            if(this.add == true){
                this.addMeetingTopic();
                this.add = false;
            }
            else{
                this.modifyMeetingTopic();
            }
            this.flag1 = false;
        }
        else if(this.flag2 == true){
            if(this.add == true){
                this.add = false;
                this.addMeetingMinutes();
            }
            else{
                this.modifyMeetingMinutes();
            }
            this.flag2 = false;
        }
        else if(this.flag3 = true){
            if(this.add == true){
                this.add = false;
                this.addMeetingIssue();
            }
            else{
                this.modifyMeetingIssue();
            }
        }
       this.display = false;
    }
    // meeting tab切换Attandance里的add
    openProjectMember(){
        this.add1 = true;
        this.firstName = "";
        this.rolePosition = "";
        this.selectedValue = "";
        this.header = "Add Attendance";
        this.projectMember = true;
    }
    // meeting tab切换meeting topics里的add
    openChangeMeetingTopic(){
        this.add1 = true;
        this.topicCategory2 = "";
        this.topic2 = "";
        this.time2 = 0;
        this.presenter2 = "";
        this.userCode2 = "";
        this.selectedDi2 = "D";
        this.header = "Add Meeting Topic";
        this.changeMeetingTopic = true;
    }

    // ------------------------------meeting minutes 上传附件     new add 2018/1/22
    exportFile(value){
        this.bussinessId = value;
        this.attId = this.dataManageService.getUuId();
        this.file = true;
    }
    onBasicUpload(e) {
        let response = eval('(' + e.xhr.response + ')');
        this.response = response;
        // this.fileName = e.files[0].name;
        if (response.code == "1") {
           let timeStamp = new Date().getTime();
           this.httpService.get("/bpd-proj/bpd/minutes/addAtt?"+timeStamp+"&attId="+this.attId+"&type=minutes&dirId=666")
           .subscribe(data => {
               if(data.code == 1){
                this.checkMeetingMinutes();
               
                this.msgService.showSuccess("Operation Success!");
                this.growLife = 5000;
                this.msgs = this.msgService.msgs;
               }
               else{
                this.msgService.showSuccess("Operation Failed!");
                this.growLife = 5000;
                this.msgs = this.msgService.msgs;
               }
           })
            this.file = false;
        } 
        else {
            this.growLife = 5000;
            this.msgService.showSuccess("Operation Failed!");
            this.msgs = this.msgService.msgs;
        }
    }

    xiazai(value){
        let token = window.sessionStorage.getItem("access_token");
        let url: string = "/bpd-proj/bpd/att/downloadFiles?attIds=" + value + "&_=" + Number(new Date());
        if (token) {
            let realToken = token.substr(1, token.length - 2)
            url = url + "&accessToken=" + realToken;
        }
        window.location.href = url;
    }
    removeFile(value){
        this.confirmationService.confirm({
            message: 'Do You Want To Delete This Record?',
            header: 'Delete Confirmation',
            icon: 'fa fa-trash',
            accept: () => {
                let timeStamp = new Date().getTime();
                this.httpService.get("/bpd-proj/bpd/att/delete?"+timeStamp+"&attIds="+value)
                .subscribe(data => {
                    if(data.code==1){
                        this.msgService.showSuccess('Opration Succeed!');
                        this.growLife = 5000;
                        this.checkMeetingMinutes();
                    }
                    else{
                        this.msgService.showError('Opration Failed!');
                        this.growLife = 5000;
                    }
                    this.msgs = this.msgService.msgs;
                });
            }
    })
    }
  }
