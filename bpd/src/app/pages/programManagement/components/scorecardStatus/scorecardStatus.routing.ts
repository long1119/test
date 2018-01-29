import {Routes, RouterModule}  from '@angular/router';
import { ScorecardStatus } from './scorecardStatus.component';


const routes: Routes = [
  {
    path: '', component : ScorecardStatus
  }
];

export const routing = RouterModule.forChild(routes);