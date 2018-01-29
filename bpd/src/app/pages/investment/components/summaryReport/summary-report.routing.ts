import {Routes, RouterModule}  from '@angular/router';
import {summaryReportComponent} from "./summary-report.component";

const routes: Routes = [
  {
    path: '', component : summaryReportComponent
  }
];

export const routing = RouterModule.forChild(routes);