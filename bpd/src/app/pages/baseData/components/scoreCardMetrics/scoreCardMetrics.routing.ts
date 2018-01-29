import {
    Routes,
    RouterModule
} from '@angular/router';

import {
    ScoreCardMetrics
} from './scoreCardMetrics.component';

const routes: Routes = [
    {
        path: '',
        component: ScoreCardMetrics 
    }    
]

export const routing = RouterModule.forChild(routes)
