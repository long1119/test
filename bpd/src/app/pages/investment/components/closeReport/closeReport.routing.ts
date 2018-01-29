import {Routes, RouterModule}  from '@angular/router';
import { closeReportComponent } from './closeReport.component';


const routes: Routes = [
  {
    path: '', component : closeReportComponent
  }
];

export const routing = RouterModule.forChild(routes);