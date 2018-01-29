import {Routes, RouterModule}  from '@angular/router';
import { ProjectType }          from './projectType.component';
import { ProjectParameter } from './components/perojectParameter/projectParameter.component';
import { ProjectCategory } from './components/projectCategory/projectCategory.component';
import { ProjectLevel } from './components/projectLevel/projectLevel.component';

const routes: Routes = [
  {
    path: '', component : ProjectType,
    // children: [
    //   {
    //     path: "" ,redirectTo: "project-category", pathMatch: "full"
    //   },
    //   {
    //     path: "project-category", component: ProjectCategory
    //   },
    //   {
    //     path: "project-level", component: ProjectLevel
    //   },
    //   {
    //     path: "project-parameter", component: ProjectParameter
    //   }
    // ]
  }
];

export const routing = RouterModule.forChild(routes);