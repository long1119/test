import {
    Routes,
    RouterModule
} from '@angular/router';
import {
    LandPurchaseRecord
} from './landPurchaseRecord.component';


const routes: Routes = [{
    path: '',
    component: LandPurchaseRecord
}];

export const routing = RouterModule.forChild(routes);