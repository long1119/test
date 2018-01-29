import {Routes, RouterModule}  from '@angular/router';
import { InvestmentParamenters }          from './investmentParamenters.component';


const routes: Routes = [
  {
    path: '', component : InvestmentParamenters
  }
];

export const routing = RouterModule.forChild(routes);