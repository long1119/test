import {Routes, RouterModule}  from '@angular/router';
import { prpoComponent } from './prpo.component';


const routes: Routes = [
  {
    path: '', component : prpoComponent
  }
];

export const routing = RouterModule.forChild(routes);