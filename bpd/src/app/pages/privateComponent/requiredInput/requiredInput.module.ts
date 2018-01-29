import { NgModule }      from '@angular/core';
import { ButtonModule } from 'primeng/primeng';

import { RequiredInput } from './requiredInput.component';


@NgModule({
  imports: [
    ButtonModule,
  ],
  declarations: [
    RequiredInput
  ]
  // providers: [
  //   BugetTemplate
  // ]
})
export class RequiredInputModule {
    
}