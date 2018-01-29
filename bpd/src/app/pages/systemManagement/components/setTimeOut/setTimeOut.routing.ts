import {
    Routes,
    RouterModule
} from '@angular/router';
import {
    SetTimeOut
} from './setTimeOut.component';

const routes: Routes = [
    {
        path: '', 
        component: SetTimeOut
    }
]

export const routing = RouterModule.forChild(routes);