import {
    Routes,
    RouterModule
} from '@angular/router';
import {
    RentalRecord
} from './rentalRecord.component';


const routes: Routes = [{
    path: '',
    component: RentalRecord
}];

export const routing = RouterModule.forChild(routes);