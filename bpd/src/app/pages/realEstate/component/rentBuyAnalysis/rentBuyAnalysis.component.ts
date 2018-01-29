import {
    Component,
    OnInit
} from '@angular/core';
import {
    CommonModule
} from '@angular/common';
import {
    FormsModule
} from '@angular/forms';
import 'style-loader!./rentBuyAnalysis.scss';
import {
    SelectItem,
    Message
} from 'primeng/primeng';
import {
    HttpDataService
} from '../../../service/http.service';
import {
    MessageService
} from '../../../service/message.service';
import {
    DataManageService
} from '../../../service/dataManage.service';

// import { BaseDataModule } from '../../baseData.module';

@Component({
    selector: 'rent-buy-analysis',
    templateUrl: './rentBuyAnalysis.html',
})
export class RentBuyAnalysis {

    public selectedBuilding: Boolean;
    public selectedExpense: Boolean;
    public selectedBuy: Boolean;
    public selectedAnalysis: Boolean;

    constructor(private httpService: HttpDataService, private messageService: MessageService, private dataManageService: DataManageService) {
        this.selectedAnalysis = false;
        this.selectedBuy = false;
        this.selectedExpense = false;
        this.selectedBuilding = true    ;
    }

    ngOnInit() {

    }

    changeTab($event) {
        switch ($event.index) {
            case 0:
                this.selectedBuilding = true;
                this.selectedAnalysis = false;
                this.selectedBuy = false;
                this.selectedExpense = false;
                break;
            case 1:
                this.selectedExpense = true;
                this.selectedAnalysis = false;
                this.selectedBuy = false;
                this.selectedBuilding = false;
                break;
            case 2:
                this.selectedExpense = false;
                this.selectedAnalysis = false;
                this.selectedBuy = true;
                this.selectedExpense = false;
                break;
            case 3:
                this.selectedExpense = false;
                this.selectedAnalysis = true;
                this.selectedBuy = false;
                this.selectedExpense = false;
                break;
        }
    }
}