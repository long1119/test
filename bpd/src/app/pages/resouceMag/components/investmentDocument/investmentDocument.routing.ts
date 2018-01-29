import {Routes, RouterModule}  from '@angular/router';
import { InvestmentDocument } from './investmentDocument.component';


const routes: Routes = [
  {
    path: '', component : InvestmentDocument
  }
];

export const routing = RouterModule.forChild(routes);