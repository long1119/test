import {Routes, RouterModule}  from '@angular/router';
import { EchangeRate }          from './echangeRate.component';


const routes: Routes = [
  {
    path: '', component : EchangeRate
  }
];

export const routing = RouterModule.forChild(routes);