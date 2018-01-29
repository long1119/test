import {
    Routes,
    RouterModule 
} from '@angular/router'

import {
    ScheduleAnalysis
} from './scheduleAnalysis.component';

const routes: Routes = [{
    path: '',
    component: ScheduleAnalysis 
}]

export const routing = RouterModule.forChild(routes);