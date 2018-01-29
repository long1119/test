import {
  Routes,
  RouterModule
} from '@angular/router';
import {
  InvestmentPortal
} from './investmentPortal.component';


const routes: Routes = [{
  path: '',
  component: InvestmentPortal
}];

export const routing = RouterModule.forChild(routes);