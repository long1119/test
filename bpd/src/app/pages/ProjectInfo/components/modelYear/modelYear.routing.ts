import {Routes, RouterModule}  from '@angular/router';
import { ModelYear } from './modelYear.component';


const routes: Routes = [
  {
    path: '', component : ModelYear
  }
];

export const routing = RouterModule.forChild(routes);