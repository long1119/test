import {
    Routes,
    RouterModule
} from '@angular/router';

import {
    DetailReport
} from './detailReport.component';

const routes: Routes = [
    {
        path: '',
        component: DetailReport 
    }    
]

export const routing = RouterModule.forChild(routes);
