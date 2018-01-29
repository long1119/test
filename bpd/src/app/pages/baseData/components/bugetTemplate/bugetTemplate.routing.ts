import {Routes, RouterModule}  from '@angular/router';
import { BugetTemplate }          from './bugetTemplate.component';


const routes: Routes = [
  {
    path: '', component : BugetTemplate
  }
];

export const routing = RouterModule.forChild(routes);