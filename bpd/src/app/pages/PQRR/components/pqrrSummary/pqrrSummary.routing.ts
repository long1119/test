import {Routes, RouterModule}  from '@angular/router';
import { PqrrSummary } from './pqrrSummary.component';


const routes: Routes = [
  {
    path: '', component : PqrrSummary
  }
];

export const routing = RouterModule.forChild(routes);