import {Routes, RouterModule}  from '@angular/router';
import { User } from './user.component';


const routes: Routes = [
  {
    path: '', component : User
  }
];

export const routing = RouterModule.forChild(routes);