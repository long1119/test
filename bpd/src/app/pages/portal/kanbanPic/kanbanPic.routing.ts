import {Routes, RouterModule}  from '@angular/router';
import { KanbanPic } from './kanbanPic.component';


const routes: Routes = [
  {
    path: '', component : KanbanPic
  }
];

export const routing = RouterModule.forChild(routes);