import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { routing } from './investmentProperty.routing';
import { MessageService } from '../../../service/message.service';
import { ListboxModule, ButtonModule, DataTableModule, DialogModule, DropdownModule, GrowlModule, TabViewModule } from 'primeng/primeng';
import { InvestmentProperty } from './investmentProperty.component';
import { PropertyGroup } from './components/propertyGroup/propertyGroup.component';
import { InvestmentPropertyService } from './investmentProperty.service';
import { DataManageService } from '../../../service/dataManage.service';
import { DeleteComfirmService } from '../../../service/deleteDialog.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    routing,
    DialogModule,
    DataTableModule,
    ButtonModule,
    ListboxModule,
    DropdownModule,
    GrowlModule,
    TabViewModule 
  ],

  declarations: [
    InvestmentProperty,
    PropertyGroup
  ],

  providers: [
    InvestmentPropertyService,
    MessageService,
    DataManageService,
    DeleteComfirmService 
  ]
})
export class InvestmentPropertyModule {}