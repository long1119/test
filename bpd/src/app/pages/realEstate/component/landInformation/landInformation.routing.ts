import {
    Routes,
    RouterModule
} from '@angular/router';
import {
    LandInformation
} from './landInformation.component';


const routes: Routes = [{
    path: '',
    component: LandInformation
}];

export const routing = RouterModule.forChild(routes);