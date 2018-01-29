import { Injectable } from '@angular/core';
import { GlobalState } from '../../../global.state';


@Injectable()
export class WorkFlowStartService{

    constructor(private _state: GlobalState){}
    public start(procDefKey, businessId, variables, callback): void {
      console.log("审批流程的start");
    	console.log('workservice:start[' + procDefKey + ',' + businessId + ']');
    	this._state.notifyDataChanged('workflow.start', {
    		procDefKey: procDefKey,
        businessId: businessId,
        variables: variables,
        callback: callback
    	});
    }
}
