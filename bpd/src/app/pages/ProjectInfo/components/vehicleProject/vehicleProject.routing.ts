import {Routes, RouterModule}  from '@angular/router';
import { VehicleProject } from './vehicleProject.component';


const routes: Routes = [
  {
    path: '', component : VehicleProject
  }
];

export const routing = RouterModule.forChild(routes);