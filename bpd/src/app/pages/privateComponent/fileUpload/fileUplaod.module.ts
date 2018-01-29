import { NgModule }      from '@angular/core';
import { ButtonModule } from 'primeng/primeng';

import { FileUpload } from './fileUpload.component';


@NgModule({
  imports: [
    ButtonModule,
  ],
  declarations: [
    FileUpload
  ]
  // providers: [
  //   BugetTemplate
  // ]
})
export class FileUploadModule {
    
}