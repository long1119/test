import {
    Routes,
    RouterModule
} from '@angular/router';
import {
    PreviousEsimation
} from './previousEsitmation.component';

const routes: Routes = [{
    path: "",
    component: PreviousEsimation
}]

export const routing = RouterModule.forChild(routes);