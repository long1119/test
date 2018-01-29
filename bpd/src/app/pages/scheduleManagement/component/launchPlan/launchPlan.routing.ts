import {
    Routes,
    RouterModule 
} from '@angular/router'

import {
    LaunchPlan
} from './launchPlan.component';

const routes: Routes = [{
    path: '',
    component: LaunchPlan 
}]

export const routing = RouterModule.forChild(routes);