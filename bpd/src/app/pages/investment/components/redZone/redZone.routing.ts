import {Routes, RouterModule}  from '@angular/router';
import { RedZone } from './redZone.component';


const routes: Routes = [
  {
    path: '', component : RedZone
  }
];

export const routing = RouterModule.forChild(routes);