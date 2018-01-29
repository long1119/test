import {
    Routes,
    RouterModule
} from '@angular/router';
import {
    SystemLog
} from './systemLog.component';

const routes: Routes = [
    {
        path: '', 
        component: SystemLog
    }
]

export const routing = RouterModule.forChild(routes);