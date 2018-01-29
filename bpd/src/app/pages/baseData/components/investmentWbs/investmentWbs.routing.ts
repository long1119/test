import {Routes, RouterModule}  from '@angular/router';
import { InvestmentWbs }          from './investmentWbs.component';


const routes: Routes = [
  {
    path: '', component : InvestmentWbs
  }
];

export const routing = RouterModule.forChild(routes);