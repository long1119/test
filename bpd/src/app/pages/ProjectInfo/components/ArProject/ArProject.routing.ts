import {
  Routes,
  RouterModule
} from '@angular/router';
import {
  ArProejct
} from './ArProject.component';


const routes: Routes = [{
  path: '',
  component: ArProejct
}];

export const routing = RouterModule.forChild(routes);