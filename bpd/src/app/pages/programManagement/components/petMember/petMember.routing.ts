import {
    Routes,
    RouterModule
  } from '@angular/router';
  import {
    PetMember
  } from './petMember.component';
  
  
  const routes: Routes = [{
    path: '',
    component: PetMember
  }];
  
  export const routing = RouterModule.forChild(routes);