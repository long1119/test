import { Injectable } from '@angular/core';
import { GlobalState } from '../../global.state';
import { CallbackFunction } from 'tapable';

@Injectable()
export class DeleteComfirmService{
    constructor(private _state: GlobalState){}
    public confirm(callback: CallbackFunction): void {
    	this._state.notifyDataChanged('deleteConfirm', {
            callback: callback
    	});
    }
}
