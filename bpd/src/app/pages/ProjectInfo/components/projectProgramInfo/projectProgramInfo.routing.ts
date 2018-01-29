import {Routes, RouterModule}  from '@angular/router';
import { ProjectProgramInfo } from './projectProgramInfo.component';


const routes: Routes = [
  {
    path: '', component : ProjectProgramInfo
  }
];

export const routing = RouterModule.forChild(routes);