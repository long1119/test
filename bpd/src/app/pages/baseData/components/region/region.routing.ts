import {
  Routes,
  RouterModule
} from '@angular/router';
import {
  Region
} from './region.component';
import {
  RegionCode
} from './components/regionCode/regionCode.component';
import {
  RegionParameter
} from './components/regionParameter/regionParameter.component';
import {
  RegionTemplate
} from './components/regionTemplate/regionTemplate.component';


const routes: Routes = [{
  path: '',
  component: Region,
  // children: [
  //   {
  //     path: '',
  //     redirectTo: "region-code",
  //     pathMatch: "full"
  //   },
  //   {
  //     path: 'region-code',
  //     component: RegionCode
  //   },{
  //     path: "region-template",
  //     component: RegionTemplate
  //   },{
  //     path: "region-parameter",
  //     component: RegionParameter
  //   }
  // ]
}];

export const routing = RouterModule.forChild(routes);