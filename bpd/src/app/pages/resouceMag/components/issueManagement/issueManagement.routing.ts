import {Routes, RouterModule}  from '@angular/router';
import { IssueManagement } from './issueManagement.component';


const routes: Routes = [
  {
    path: '', component : IssueManagement
  }
];

export const routing = RouterModule.forChild(routes);