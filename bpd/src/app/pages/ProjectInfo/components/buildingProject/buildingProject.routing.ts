import {Routes, RouterModule}  from '@angular/router';
import { BuildingProject } from './buildingProject.component';


const routes: Routes = [
  {
    path: '', component : BuildingProject
  }
];

export const routing = RouterModule.forChild(routes);