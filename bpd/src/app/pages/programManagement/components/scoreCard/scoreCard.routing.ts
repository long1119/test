import {Routes, RouterModule}  from '@angular/router';
import { ScoreCard } from './scoreCard.component';


const routes: Routes = [
  {
    path: '', component : ScoreCard
  }
];

export const routing = RouterModule.forChild(routes);