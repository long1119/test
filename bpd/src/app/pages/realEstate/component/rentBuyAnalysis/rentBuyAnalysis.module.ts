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
    PagesModule
} from '../../../pages.module';

import {
    RentBuyAnalysis
} from './rentBuyAnalysis.component';
import {
    BuildingCostAndOthers
} from './component/buildingCostAndOthers/buildingCostAndOthers.component';
import {
    BuyAnalysis
} from './component/buyAnalysis/buyAnalysis.component';
import {
    RentalAnalysis
} from './component/rentalAnalysis/rentalAnalysis.component';
import {
    RentalExpense
} from './component/rentalExpense/rentalExpense.component';
import {
    routing
} from './rentBuyAnalysis.routing';
import {
    ListboxModule,
    ButtonModule,
    DataTableModule,
    DialogModule,
    GrowlModule,
    DropdownModule,
    PaginatorModule,
    TabViewModule,
    PanelModule
} from 'primeng/primeng';

import {
    MessageService
} from '../../../service/message.service';
import {
    HttpDataService
} from '../../../service/http.service';
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
        ListboxModule,
        ButtonModule,
        DataTableModule,
        DialogModule,
        GrowlModule,
        DropdownModule,
        PaginatorModule,
        TabViewModule,
        PanelModule,
        PagesModule
    ],
    declarations: [
        RentBuyAnalysis,
        BuildingCostAndOthers,
        BuyAnalysis,
        RentalAnalysis,
        RentalExpense
    ],
    providers: [
        MessageService,
        HttpDataService,
        DeleteComfirmService,
        DataManageService
    ]
})
export class RentBuyAnalysisModule {}