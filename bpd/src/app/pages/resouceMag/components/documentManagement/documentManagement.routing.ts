import {Routes, RouterModule}  from '@angular/router';
import { DocumentManagement } from './documentManagement.component';


const routes: Routes = [
  {
    path: '', component : DocumentManagement
  }
];

export const routing = RouterModule.forChild(routes);