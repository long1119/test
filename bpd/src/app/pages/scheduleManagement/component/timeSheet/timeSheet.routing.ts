import {
    Routes,
    RouterModule 
} from '@angular/router'

import {
    TimeSheet
} from './timeSheet.component';

const routes: Routes = [{
    path: '',
    component: TimeSheet 
}]

export const routing = RouterModule.forChild(routes);