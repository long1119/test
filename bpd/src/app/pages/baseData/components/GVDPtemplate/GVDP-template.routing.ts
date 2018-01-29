import {Routes, RouterModule}  from '@angular/router';
import {GvdpTemplate} from "./GVDP-template.component";

const routes: Routes = [
  {
    path: '', component : GvdpTemplate
  }
];

export const routing = RouterModule.forChild(routes);