import {Routes, RouterModule}  from '@angular/router';
import { ProjectMember } from './projectMember.component';


const routes: Routes = [
  {
    path: '', component : ProjectMember
  }
];

export const routing = RouterModule.forChild(routes);