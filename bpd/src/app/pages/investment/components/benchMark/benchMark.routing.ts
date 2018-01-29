import {Routes, RouterModule}  from '@angular/router';
import { BenchMark } from './benchMark.component';


const routes: Routes = [
  {
    path: '', component : BenchMark
  }
];

export const routing = RouterModule.forChild(routes);