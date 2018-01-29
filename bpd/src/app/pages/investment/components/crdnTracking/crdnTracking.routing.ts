import {Routes, RouterModule}  from '@angular/router';
import { CrdnTracking } from './crdnTracking.component';


const routes: Routes = [
  {
    path: '', component : CrdnTracking
  }
];

export const routing = RouterModule.forChild(routes);