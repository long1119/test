import {Routes, RouterModule}  from '@angular/router';
import { DeliverableBill } from './deliverableBill.component';


const routes: Routes = [
  {
    path: '', component : DeliverableBill
  }
];

export const routing = RouterModule.forChild(routes);