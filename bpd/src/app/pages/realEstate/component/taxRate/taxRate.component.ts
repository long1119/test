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
import 'style-loader!./taxRate.scss';
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
    selector: 'tax-rate',
    templateUrl: './taxRate.html',
})
export class TaxRate {

    constructor(private httpService: HttpDataService, private messageService: MessageService, private dataManageService: DataManageService) {

    }

    ngOnInit() {

    }
}