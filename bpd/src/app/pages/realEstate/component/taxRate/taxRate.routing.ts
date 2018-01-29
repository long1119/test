import {
    Routes,
    RouterModule
} from '@angular/router';
import {
    TaxRate
} from './taxRate.component';


const routes: Routes = [{
    path: '',
    component: TaxRate
}];

export const routing = RouterModule.forChild(routes);