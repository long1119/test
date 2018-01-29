import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule } from '@angular/forms';
import { routing } from './kanbanConfig.routing'

import { KanbanConfig } from './kanbanConfig.component';
import { ButtonModule, DataTableModule, DialogModule, DropdownModule, TabViewModule, RadioButtonModule, PaginatorModule, CheckboxModule, GrowlModule, ConfirmDialogModule } from 'primeng/primeng';
import { HttpDataService } from '../../service/http.service';
import { PagesModule } from '../../pages.module';



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
    PagesModule,
    ConfirmDialogModule
  ],
  declarations: [
    KanbanConfig
  ]
})
export class KanbanConfigModule {}