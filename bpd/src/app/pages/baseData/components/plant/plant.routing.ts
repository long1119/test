import {Routes, RouterModule}  from '@angular/router';
import { Plant }          from './plant.component';


const routes: Routes = [
  {
    path: '', component : Plant
  }
];

export const routing = RouterModule.forChild(routes);