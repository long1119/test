import {Routes, RouterModule}  from '@angular/router';
import { AnalysisReport } from './analysisReport.component';


const routes: Routes = [
  {
    path: '', component : AnalysisReport
  }
];

export const routing = RouterModule.forChild(routes);