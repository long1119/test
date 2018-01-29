import {Routes, RouterModule}  from '@angular/router';
import { CostBook } from './costBook.component';


const routes: Routes = [
  {
    path: '', component : CostBook
  }
];

export const routing = RouterModule.forChild(routes);