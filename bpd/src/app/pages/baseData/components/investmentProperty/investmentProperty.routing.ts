import {Routes, RouterModule}  from '@angular/router';
import { InvestmentProperty }          from './investmentProperty.component';
import { PropertyGroup } from './components/propertyGroup/propertyGroup.component';


const routes: Routes = [
  {
    path: '', component : InvestmentProperty,
    // children: [
    //   { path: '', redirectTo: 'property-group', pathMatch: 'full' },
    //   { path: 'property-group', component: propertyGroup}
    // ]
  }
];

export const routing = RouterModule.forChild(routes);