import {Routes, RouterModule}  from '@angular/router';
import { SharePage } from './sharePage.component';


const routes: Routes = [
  {
    path: '', component : SharePage
  }
];

export const routing = RouterModule.forChild(routes);