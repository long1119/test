import {Routes, RouterModule}  from '@angular/router';
import { PlantCode }          from './plantCode.component';


const routes: Routes = [
  {
    path: '', component : PlantCode
  }
];

export const routing = RouterModule.forChild(routes);