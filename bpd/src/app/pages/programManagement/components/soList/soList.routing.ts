import {
    Routes,
    RouterModule
} from '@angular/router';

import {
    SoList
} from './soList.component';

const routes: Routes = [
    {
        path: '',
        component: SoList 
    }    
]

export const routing = RouterModule.forChild(routes);
