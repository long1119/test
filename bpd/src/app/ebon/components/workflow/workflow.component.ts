/**
 * Created by G on 2017/5/8.
 */
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Message } from 'primeng/primeng';
import { Observable } from 'rxjs/Rx';
import { MessageService } from '../../../pages/service/message.service';
import 'style-loader!./workflow.scss';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { HttpDataService } from '../../../../app/pages/service/http.service';

@Component({
    selector: 'workflow',
    templateUrl: './workflow.html',
    providers: [HttpDataService]
})

export class WorkFLowComponent {

  @Output()
  private listCountOut = new EventEmitter();
  @Output()
  public refreshFlag = new EventEmitter();
  @Input()
  private wfType: any;
  public currentUser: string;
  private wfTypeInfo: string;
  private dialogMessage: string;
  private rejectData: any = {};
  private rejectDialog: Boolean = false;
  public freshFlag: Boolean = true;
  
  /*流程信息*/
  private  auditSuggestion: AuditSuggestion = new AuditSuggestion();
  /*请求edit返回json数据*/
  private  auditForm = {currentOpinion:{
    comments:{},
    isAgree:{},
    status:{},
  }};
  /*待办数据*/
  private dataRows: any = [];
  /*已办数据*/
  private finishdataRows;
  /*我发起的审批*/
  private procinstdataRows;

  /*构建下一步数据*/
  private nextData;
  /*选择哪些流程分支*/
  private includeTasks: string[] = [];
  private processCtxParameter;
  // 改变状态
  private status: any;
  private code: string;

  public msgs: Message[];
  public growLife: number = 5000;
  public dialogProjectName: string;
  public dialogDescription: string;

    constructor(
      private http: Http,
      private messageService: MessageService,
      private httpService: HttpDataService ){
    }
    ngOnInit() {
      this.getMyTaskList();
      this.currentUser = window.localStorage.getItem("user");
      // this.getMyFinishList();
    }

    ngOnChanges(changes: SimpleChanges) {
      if (this.wfType === "timeSheet") {
        this.wfTypeInfo = "Timesheet";
      } else if (this.wfType === "nod") {
        this.wfTypeInfo = "NOD"
      } else if (this.wfType === "scorecard") {
        this.wfTypeInfo = "Scorecard";
      }
    }

    getMyFinishList(){
      // console.log(this.wfType);
      // console.log(this.auditForm['activityId'])
      this.http.get(`/bpd-proj/workflow/manage/getFinishedList.action`)
        .subscribe(success => {
          // console.log(this.auditForm);
          this.finishdataRows = success.json().rows;
          // console.log(this.dataRows);
        }, error => {
        });
    }

    getMyTaskList(){
     
      if (typeof(this.wfType) === "string") {
        this.http.get(`/bpd-proj/workflow/manage/getTaskList.action?wfType=${this.wfType}`)
          .subscribe(success => {
            this.dataRows = success.json().rows;
            this.listCountOut.emit(success.json().rows.length + 1);
          }, error => {
          });
      } else if (this.wfType[0] && typeof(this.wfType[0]) === "string") {
          for (let i = 0; i < this.wfType.length; i++) {
            this.http.get(`/bpd-proj/workflow/manage/getTaskList.action?wfType=${this.wfType[i]}`)
              .subscribe(success => {
              this.dataRows = this.dataRows.concat(success.json().rows);
              }, error => {
              });
          }
      }
    }



  /**
   * 提交审批
   */
  audit(): void{
    if (!this.auditSuggestion.comments && this.auditSuggestion.isAgree != "1"){
      this.messageService.showInfo('Please Insert Your Observation!');
      this.msgs = this.messageService.msgs;
      this.growLife = 5000;
      return;
    }
    // console.log(this.auditForm['id']);
    // console.log('------------');
    // console.log('获取ID');    
    // console.log('判断----')
    this.auditForm.currentOpinion.comments = this.auditSuggestion.comments;
    this.auditForm.currentOpinion.isAgree = this.auditSuggestion.isAgree;
    /*流程终止！*/
    // if (this.auditSuggestion.isAgree === '2'){
    //
    //   this.endProcess(this.auditForm['processInstanceId']);
    // } else {
    //   this.wfsp(this.auditForm);
    // }

    this.wfsp(this.auditForm);
  }
  /**
   * 终止流程
   * 
   * @memberof WorkFLowComponent
   */
  reject(event) {
    this.rejectData = event;
    this.rejectDialog = true;
  }

  rejectYes() {
//  + "&taskId=" + this.rejectData['taskId']
    let url: string = "/bpd-proj/bpd/masterTimeSheet/endProcess";
    let data: string = "ids=" + this.rejectData['procInstId'] + '&businessId=' +  this.rejectData['wfBusinessId'] + '&type=' + this.wfType + "&comments=" + encodeURI(this.dialogDescription)
    this.httpService.get(url + '?' + data)
      .subscribe(data => {
        if (data.code == 1) {
          this.getMyTaskList();
          this.display = false;
          this.growLife = 5000;
          this.messageService.showSuccess("Reject!");
          this.rejectDialog = false;
        } else {
          this.growLife = 5000;
          this.messageService.showError("Operate Failed!");
        }
        this.msgs = this.messageService.msgs;
      })
  }

  rejectNo () {
    this.rejectDialog = false;
  }
  /**
   * 审批流程
   */
  wfsp(_auditForm){

    // let params = new URLSearchParams();
    // params.set('id',                _auditForm.id);
    // params.set('processDefKey',     _auditForm.processDefKey);
    // params.set('formUrl',           _auditForm.formUrl);
    // params.set('title',             _auditForm.title);
    // params.set('draftId',           _auditForm.draftId);
    // params.set('processInstanceId', _auditForm.processInstanceId);
    // params.set('businessKey',       _auditForm.id);
    // params.set('businessId',        _auditForm.businessId);
    // params.set('obsId',             _auditForm.obsId);
    // params.set('projId',            _auditForm.projId);
    let params: any;
    params = {
      id: _auditForm.id,
      processDefKey: _auditForm.processDefKey,
      formUrl: _auditForm.formUrl,
      title: _auditForm.title,
      draftId: _auditForm.draftId,
      processInstanceId: _auditForm.processInstanceId,
      businessId: _auditForm.businessId,
      businessKey: _auditForm.businessKey,
      obsId: _auditForm.obsId,
      projId: _auditForm.projId,
      currnentOptin: null
    }
    if (_auditForm.processInstanceId){
      // params.set('currentOpinion.comments',      _auditForm.currentOpinion.comments);
      // params.set('currentOpinion.isAgree',       _auditForm.currentOpinion.isAgree);
      // params.set('currentOpinion.id',            _auditForm.currentOpinion.id);
      // params.set('currentOpinion.activityDefId', _auditForm.currentOpinion.activityDefId);
      // params.set('currentOpinion.taskId',        _auditForm.currentOpinion.taskId);
      // params.set('currentOpinion.userId',        _auditForm.currentOpinion.userId);
      params.currentOpinion = {
        comments: _auditForm.currentOpinion.comments,
        isAgree: _auditForm.currentOpinion.isAgree,
        id: _auditForm.currentOpinion.id,
        activityDefId: _auditForm.currentOpinion.activityDefId,
        taskId: _auditForm.currentOpinion.taskId,
        userId: _auditForm.currentOpinion.userId
      }
    }

    this.wfsave(_auditForm.controllerUrl, params, (success) => {
      this.freshFlag = !this.freshFlag;
      let result = success.json();
      this.processCtxParameter = {
        businessKey : result.poId,
        processDefKey : _auditForm.processDefKey,
        taskId : _auditForm.taskId,
        processDefinitionId : _auditForm.processDefinitionId,
        poServiceSpringBeanName : 'procObjService',
        variables : []
      }
      for(let  _name in result){
          this.processCtxParameter.variables.push({
              name: _name,
              value: result[_name]
          });
      }
      // console.log(this.auditForm['variables']);
      if (this.auditForm['variables']){
        for(let index in this.auditForm['variables']){
          // console.log(index);
          this.processCtxParameter.variables.push(
            this.auditForm['variables'][index]
          );
        }
      }


      /*请求下一步审批节点信息。*/
      this.wfTurnNext(this.processCtxParameter, success => {
        this.nextData = success.json();
        this.nextDisplay = true;
      }, error => {});
    }, error => {});
  }





  private display: boolean = false;
  public nextDisplay: boolean = false;
  public pictureDisplay: boolean = false;

  public showDialog(auditItem): void {
    console.log(auditItem.createUserCode, this.currentUser);
    if (this.wfType === "timeSheet") {
      this.dialogMessage = (auditItem.modelYearName ? auditItem.modelYearName + "-" : "") + auditItem.startTime;
    } else if (this.wfType === "nod") {
      this.dialogMessage = "NOD";
    } else if (this.wfType === "scorecard") {
      this.dialogMessage = "Scorecard";
    }
    let url = `/bpd-proj${auditItem['formUrl']}?processDefKey=${auditItem['procDefKey']}&businessKey=${auditItem['businessId']}&taskId=${auditItem['taskId']}`

    this.sjWorkbenchGetItemList(url,
      (success) => {
        this.auditForm = success.json();
        let token = window.sessionStorage.getItem("access_token");
        this.auditForm['processPicUrl'] = `/bpd-proj/workflow/trace/traceProcessInstance.action?processInstanceId=${this.auditForm['processInstanceId']}&_=`+new Date();
        if (token) {
            let realToken = token.substr(1, token.length - 2)
            this.auditForm['processPicUrl'] = this.auditForm['processPicUrl'] + "&accessToken=" + realToken;
        }
        this.display = true;
      }, (error) => {
           console.log('error');
      }
    );
  }


  commit(){
    // console.log(this.auditForm['businessId'])
    this.processCtxParameter.variables.push({name: 'includeTasks', value: this.includeTasks.toString()});
    this.wfCommit(this.processCtxParameter, (success) => {
        // 刷新页面用
        this.refreshFlag.emit(this.freshFlag);
      if (success._body){
        try{
          // 原流程
          success.json();
          this.getMyTaskList();
          if (this.auditSuggestion.isAgree === "1") {
            this.messageService.showSuccess('Approved!');
          } else {
            this.messageService.showSuccess('Return!');
          }
          this.msgs = this.messageService.msgs;
          this.growLife = 5000;
          this.display = false;
          this.nextDisplay = false;
        }catch (e){
          this.messageService.showError('Approvced Failed!');
          this.msgs = this.messageService.msgs;
          this.growLife = 5000;
        }
      }else{
        this.getMyTaskList();
        if (this.auditSuggestion.isAgree === "1") {
            this.messageService.showSuccess('Approved!');
          } else {
            this.messageService.showSuccess('Return!');
          }
        this.msgs = this.messageService.msgs;
        this.growLife = 5000;
        this.display = false;
        this.nextDisplay = false;
      }

    }, (error) => {}); //wfCommit  end
  }


  sjWorkbenchGetItemList(action: string, successFunc: ((suc) => void), errorFunc: ((eor) => void)): void{
    let url = `${action}&mobileApp=1`;
    this.http.get(url).subscribe(success => {
        successFunc && successFunc(success);
    }, error => {
    });
  }

  endProcess(pinsId){
    let url = `/bpd-proj/workflow/manage/endProcess?&ids=${pinsId}&mobileApp=1`;
    this.http.get(url).subscribe(success => {
      // console.log(this.auditForm['businessId']);
      // console.log(success);
      this.messageService.showSuccess('Stop The Work Flow Success!');
      this.msgs = this.messageService.msgs;
      this.growLife = 5000;
      // 改变状态 start
      let obj = {};
      obj['id'] = this.auditForm['businessId'];
      obj['status'] = this.status = 3;
      this.http.post('/bpd-proj/app/workplan/update', obj).subscribe(res => {});
      // 改变状态 end
      this.getMyTaskList();
      this.display = false;
      this.nextDisplay = false;
    }, error => {

    });
  }

  // 改变状态
  changeState(){
    let url = '/bpd-proj/app/workplan/publish';
    let obj={};
    // obj['status']=2;
    obj['id']=this.auditForm['businessId'];
    this.http.post(url,obj).subscribe(res=>{
      // console.log(res);
      // console.log('----------------------');
      // console.log('流程结束')
    })
  }
  /**
   * 流程发起和保存
   * @param {[type]}        controllerUrl      [description]
   * @param {[type]}        URLSearchParamsStr [description]
   * @param {((suc)=>void)} successFunc        [description]
   * @param {((eor)=>void)} errorFunc          [description]
   */
  wfsave(controllerUrl, urlSearchParamsStr, successFunc: ((suc) => void), errorFunc: ((eor) => void)) {
    let url = `/bpd-proj/${controllerUrl}/save.action?mobileApp=1`;
    this.http.post(url, urlSearchParamsStr).subscribe(success => {
      successFunc && successFunc(success);
    }, error => {});
  }


  /**
   * 流程下一步
   * @param {[type]}        processCtxParameter [description]
   * @param {((suc)=>void)} successFunc         [description]
   * @param {((eor)=>void)} errorFunc           [description]
   */
  wfTurnNext(processCtxParameter, successFunc: ((suc) => void), errorFunc: ((eor) => void)) {
    // let url = `/ebon/workflow/ctx/turnNext.action?mobileApp=1&processCtxParameter=` + JSON.stringify(processCtxParameter);
    // this.http.get(url).subscribe(success => {
    //   successFunc && successFunc(success);
    // }, error => {});
    let url = `/bpd-proj/workflow/ctx/turnNext.action?mobileApp=1`;
    this.http.post(url, processCtxParameter).subscribe(success => {
      successFunc && successFunc(success);
    }, error => {});
  }

  /**
   * 流程提交
   * @param {[type]}        processInputCtx [description]
   * @param {((suc)=>void)} successFunc     [description]
   * @param {((eor)=>void)} errorFunc       [description]
   */
  wfCommit(processInputCtx, successFunc: ((suc) => void), errorFunc: ((eor) => void)) {
    // let url = `/ebon/workflow/ctx/commit.action?mobileApp=1&processInputCtx=` + JSON.stringify(processInputCtx);
    // this.http.get(url).subscribe(success => {
    //   successFunc && successFunc(success);
    // }, error => {});
    let url = `/bpd-proj/workflow/ctx/commit.action?mobileApp=1`;
    this.http.post(url, processInputCtx).subscribe(success => {
      successFunc && successFunc(success);
    }, error => {});
  }

  private extractData(res: Response) {
    let body = res.json();
    return body;
  }

  private showPicture() {
    this.pictureDisplay = true;
  }
}

class AuditSuggestion {
  isAgree: string = '1';
  comments: string;
}
