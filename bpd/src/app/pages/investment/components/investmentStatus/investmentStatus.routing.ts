import {Routes, RouterModule}  from '@angular/router';
import { investmentStatusComponent } from './investmentStatus.component';


const routes: Routes = [
  {
    path: '', component : investmentStatusComponent
  }
];

export const routing = RouterModule.forChild(routes);