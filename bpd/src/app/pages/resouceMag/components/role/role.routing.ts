import {Routes, RouterModule}  from '@angular/router';
import { Role } from './role.component';


const routes: Routes = [
  {
    path: '', component : Role
  }
];

export const routing = RouterModule.forChild(routes);