import {Routes, RouterModule}  from '@angular/router';
import { ProjectScorecard } from './projectScorecard.component';


const routes: Routes = [
  {
    path: '', component : ProjectScorecard
  }
];

export const routing = RouterModule.forChild(routes);