import {
    Injectable
} from '@angular/core';
import {
    GlobalState
} from '../../global.state';

@Injectable()
export class RefreshMenuService {
    constructor(private _state: GlobalState) {
    }

    public refreshMenu(flag: String): any {
        console.log(flag);
        this._state.notifyDataChanged("refreshMenu", flag);
    }
}