import {
    Routes,
    RouterModule
} from '@angular/router';
import {
    InvestmentLog
} from './investmentLog.component';

const routes: Routes = [
    {
        path: '', 
        component: InvestmentLog
    }
]

export const routing = RouterModule.forChild(routes);