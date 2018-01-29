import {Routes, RouterModule}  from '@angular/router';
import { ProgramInfo } from './programInfo.component';


const routes: Routes = [
  {
    path: '', component : ProgramInfo
  }
];

export const routing = RouterModule.forChild(routes);