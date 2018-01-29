import {Routes, RouterModule}  from '@angular/router';
import { PowerTrainProject } from './powerTrainProject.component';


const routes: Routes = [
  {
    path: '', component : PowerTrainProject
  }
];

export const routing = RouterModule.forChild(routes);