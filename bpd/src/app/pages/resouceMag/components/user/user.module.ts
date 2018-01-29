import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule } from '@angular/forms';
import { routing } from './user.routing'

import { User } from './user.component';
import { ButtonModule, DataTableModule, DialogModule, DropdownModule, TabViewModule, RadioButtonModule, PaginatorModule, CheckboxModule, GrowlModule } from 'primeng/primeng';
import { HttpDataService } from '../../../service/http.service';
import { PagesModule } from '../../../pages.module';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    routing,
    ButtonModule,
    DataTableModule,
    DialogModule,
    DropdownModule,
    TabViewModule,
    RadioButtonModule,
    PaginatorModule,
    CheckboxModule,
    GrowlModule,
    PagesModule
    
  ],
  declarations: [
    User
  ]
})
export class UserModule {}