import {Routes, RouterModule}  from '@angular/router';
import { Crdn } from './crdn.component';


const routes: Routes = [
  {
    path: '', component : Crdn
  }
];

export const routing = RouterModule.forChild(routes);