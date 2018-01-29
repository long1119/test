import {Routes, RouterModule}  from '@angular/router';
import { PqrrSubmit } from './pqrrSubmit.component';


const routes: Routes = [
  {
    path: '', component : PqrrSubmit
  }
];

export const routing = RouterModule.forChild(routes);