import {
    Routes,
    RouterModule
} from '@angular/router';

import {
    Nod
} from './nod.component';

const routes: Routes = [
    {
        path: '',
        component: Nod 
    }    
]

export const routing = RouterModule.forChild(routes)
