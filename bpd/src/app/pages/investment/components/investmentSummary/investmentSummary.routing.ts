import {Routes, RouterModule}  from '@angular/router';
import { investmentSummaryComponent } from './investmentSummary.component';


const routes: Routes = [
  {
    path: '', component : investmentSummaryComponent
  }
];

export const routing = RouterModule.forChild(routes);