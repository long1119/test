import {
  NgModule
} from '@angular/core';
import {
  CommonModule
} from '@angular/common';
import {
  FormsModule
} from '@angular/forms';
import {
  routing
} from './investmentParamenters.routing'
import {
  ButtonModule,
  ListboxModule,
  DataTableModule,
  DropdownModule,
  DialogModule,
  GrowlModule
} from 'primeng/primeng';

import {
  InvestmentParamenters
} from './investmentParamenters.component';
import {
  ProgramParameter
} from './components/programParameter/programParameter.component';

import {
  HttpDataService
} from '../../../service/http.service';
import {
  MessageService
} from '../../../service/message.service';
import {
  DataManageService
} from '../../../service/dataManage.service';
import {
  DeleteComfirmService
} from '../../../service/deleteDialog.service';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    routing,
    DialogModule,
    DropdownModule,
    DataTableModule,
    ListboxModule,
    ButtonModule,
    GrowlModule
  ],
  declarations: [
    InvestmentParamenters,
    ProgramParameter
  ],
  providers: [
    HttpDataService,
    MessageService,
    DataManageService,
    DeleteComfirmService
  ]
})
export class InvestmentParamentersModule {}