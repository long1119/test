import {Routes, RouterModule}  from '@angular/router';
import { HrUserList } from './hrUserList.component';


const routes: Routes = [
  {
    path: '', component : HrUserList
  }
];

export const routing = RouterModule.forChild(routes);