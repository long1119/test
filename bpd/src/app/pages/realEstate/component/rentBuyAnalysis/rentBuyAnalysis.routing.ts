import {
    Routes,
    RouterModule
} from '@angular/router';
import {
    RentBuyAnalysis
} from './rentBuyAnalysis.component';


const routes: Routes = [{
    path: '',
    component: RentBuyAnalysis
}];

export const routing = RouterModule.forChild(routes);