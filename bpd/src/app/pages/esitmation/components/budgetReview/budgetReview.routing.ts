import {Routes, RouterModule}  from '@angular/router';
import { BudgetReview } from './budgetReview.component';


const routes: Routes = [
  {
    path: '', component : BudgetReview
  }
];

export const routing = RouterModule.forChild(routes);