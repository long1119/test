import {Routes, RouterModule}  from '@angular/router';
import { KanbanConfig } from './kanbanConfig.component';


const routes: Routes = [
  {
    path: '', component : KanbanConfig
  }
];

export const routing = RouterModule.forChild(routes);