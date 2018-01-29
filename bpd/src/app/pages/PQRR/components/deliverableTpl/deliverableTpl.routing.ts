import {Routes, RouterModule}  from '@angular/router';
import { DeliverableTpl } from './deliverableTpl.component';


const routes: Routes = [
  {
    path: '', component : DeliverableTpl
  }
];

export const routing = RouterModule.forChild(routes);