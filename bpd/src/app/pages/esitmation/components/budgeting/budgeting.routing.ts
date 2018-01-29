import {Routes, RouterModule}  from '@angular/router';
import { Budgeting } from './budgeting.component';


const routes: Routes = [
  {
    path: '', component : Budgeting
  }
];

export const routing = RouterModule.forChild(routes);