import {
  Routes,
  RouterModule
} from '@angular/router';
import {
  WorkPortal
} from './workPortal.component';


const routes: Routes = [{
  path: '',
  component: WorkPortal
}];

export const routing = RouterModule.forChild(routes);