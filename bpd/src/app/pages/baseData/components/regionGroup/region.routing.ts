import {
  Routes,
  RouterModule
} from '@angular/router';
import {
  RegionGroup
} from './regionGroup.component';


const routes: Routes = [{
  path: '',
  component: RegionGroup
//   children: [
//     {
//       path: '',
//       redirectTo: "region-code",
//       pathMatch: "full"
//     }
//   ]
}];

export const routing = RouterModule.forChild(routes);