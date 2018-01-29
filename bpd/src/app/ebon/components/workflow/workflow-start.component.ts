/**
 * Created by G on 2017/5/8.
 */
import { Component } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'style-loader!./workflow.scss';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { GlobalState } from '../../../global.state';
import { Message } from 'primeng/primeng';
import { MessageService } from '../../../pages/service/message.service';
// import { BasicService } from '../../../pages/workplan-manage/components/workplan-declare/basicService';
@Component({
    selector: 'workflow-start',
    templateUrl: './workflow-start.html',
})

export class WorkFLowStartComponent {
  // 流程信息
  public  auditForm = {};
  public  nextData;
  public  includeTasks: string[] = [];
  public  processCtxParameter;
  private variables = [];
  public nextDisplay: boolean = false;
  private startParams;

  // 弹窗信息
  public msgs: Message[];
  public growLife: number;

  constructor(
    private http: Http ,
    private _state: GlobalState,
    private messageService: MessageService
    // private serve: BasicService,
  ){

    /*发起流程*/
    this._state.subscribe('workflow.start', (startParams) => {
        this.start(startParams);
        this.startParams = startParams;
    });
    
  }

  start(startParams): void{
      this.variables = startParams.variables;
    /*
       每个任务都配有自己的流程  this.taskDetail.taskWfKey
       var _processDefKey =`sgmwf`;
       var _formUrl = this.processDefkey;
       var _extJson="{businessId:'zzzz'}";
     */
    let extJson = "{businessId:'" + startParams.businessId + "'}";
    // tslint:disable-next-line:max-line-length
    let action = `/bpd-proj/wf/sgmwf/edit.action?processDefKey=${startParams.procDefKey}&extJson=${startParams.businessId}`; //&extJson=${extJson}`;
    this.sjWorkbenchGetItemList(action, (suc) => {
      // console.log(suc);
      let _auditForm = suc.json();
      this.wfsp(_auditForm);
    }, (eor) => {});
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
    let params: any = new FormData();
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
    // params.append('id',                _auditForm.id);
    // params.append('processDefKey',     _auditForm.processDefKey);
    // params.append('formUrl',           _auditForm.formUrl);
    // params.append('title',             _auditForm.title);
    // params.append('draftId',           _auditForm.draftId);
    // params.append('processInstanceId', _auditForm.processInstanceId);
    // params.append('businessKey',       _auditForm.id);
    // params.append('businessId',        _auditForm.businessId);
    // params.append('obsId',             _auditForm.obsId);
    // params.append('projId',            _auditForm.projId);
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
      // params.append('currentOpinion.comments',      _auditForm.currentOpinion.comments);
      // params.append('currentOpinion.isAgree',       _auditForm.currentOpinion.isAgree);
      // params.append('currentOpinion.id',            _auditForm.currentOpinion.id);
      // params.append('currentOpinion.activityDefId', _auditForm.currentOpinion.activityDefId);
      // params.append('currentOpinion.taskId',        _auditForm.currentOpinion.taskId);
      // params.append('currentOpinion.userId',        _auditForm.currentOpinion.userId);
    }
    this.wfsave(_auditForm.controllerUrl, params, (success) => {
      // console.log(success);
      let result = success.json();
      this.processCtxParameter = {
        businessKey : result.poId,
        processDefKey : _auditForm.processDefKey,
        taskId : _auditForm.taskId,
        processDefinitionId : _auditForm.processDefinitionId,
        poServiceSpringBeanName : 'procObjService',
        variables : []
      };
      // tslint:disable-next-line:forin
      for (let _name in result){
          this.processCtxParameter.variables.push({
              name: _name,
              value: result[_name]
          });
      }
      // console.log(this.auditForm['variables']);


      if (this.auditForm['variables']){
        // tslint:disable-next-line:forin
        for (let index in this.auditForm['variables']){
          // console.log(index);
          this.processCtxParameter.variables.push(
            this.auditForm['variables'][index]
          );
        }
      }


      if (this.variables){
        // tslint:disable-next-line:forin
        for (let index in this.variables){
          console.log(index);
          this.processCtxParameter.variables.push(
            this.variables[index]
          );
        }
      }


      /*请求下一步审批节点信息。*/
      this.wfTurnNext(this.processCtxParameter, (success1) => {
        console.log(success1);
        this.nextData = success1.json();
        console.log(this.nextData);
        this.nextDisplay = true;
        console.log(this.nextDisplay);
      }, error => {}); //wfTurnNext end

    }, error => {});  // wfsave end
  }


  // tslint:disable-next-line:member-ordering
  commit(){
    this.processCtxParameter.variables.push({name: 'includeTasks', value: this.includeTasks.toString()});
    this.wfCommit(this.processCtxParameter, (success) => {
      if (success._body){
        try{
          success.json();
          // alert('审批成功!');
          this.messageService.showSuccess('Approve Success!');
          this.msgs = this.messageService.msgs;
          this.growLife = 5000;
          this.nextDisplay = false;
          let  obj = {};
          this.startParams.callback(this.startParams['businessId']);
        }catch (e){
          // alert('审批失败!');
          this.messageService.showError('Approve Failed!');
          this.msgs = this.messageService.msgs;
          this.growLife = 5000;
        }
      }else{
        // alert('审批成功!');
        this.messageService.showSuccess('Approve Success!');
        this.msgs = this.messageService.msgs;
        this.growLife = 5000;
        this.startParams.callback(this.startParams['businessId']);
        this.nextDisplay = false;
      }

    }, (error) => {}); // wfCommit  end
  }


  sjWorkbenchGetItemList(action: string, successFunc: ((suc) => void), errorFunc: ((eor) => void)): void{


    let url = `${action}&mobileApp=1`;

    this.http.get(url).subscribe(success => {
        // tslint:disable-next-line:no-unused-expression
        successFunc && successFunc(success);
    }, error => {
    });
  }

  /**
   * 流程发起和保存
   * @param {[type]}        controllerUrl      [description]
   * @param {[type]}        URLSearchParamsStr [description]
   * @param {((suc)=>void)} successFunc        [description]
   * @param {((eor)=>void)} errorFunc          [description]
   */
  wfsave(controllerUrl, urlSearchParamsStr, successFunc: ((suc) => void), errorFunc: ((eor) => void)) {
    // 
    let url = `/bpd-proj/${controllerUrl}/save.action?mobileApp=1`;
    this.http.post(url, urlSearchParamsStr).subscribe(success => {
      // tslint:disable-next-line:no-unused-expression
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

}
