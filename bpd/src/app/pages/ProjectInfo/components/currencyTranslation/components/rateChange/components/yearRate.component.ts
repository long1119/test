import {
    Component,
    OnInit,
    Input,
    OnChanges,
    SimpleChanges,
    Output,
    EventEmitter
} from '@angular/core';

import 'style-loader!./yearRate.scss';

import {
    SelectItem,
    Message
} from 'primeng/primeng';

import {
    HttpDataService
} from '../../../../../../service/http.service';

import {
    MessageService
} from '../../../../../../service/message.service';
import {
    DataManageService
} from '../../../../../../service/dataManage.service';


@Component({
    selector: 'year-rate',
    templateUrl: './yearRate.html'
})

export class YearRate {

    @Input()
    yearEditableListData: any[];
    @Input()
    rateChangeEditableData: any[];
    @Output()
    editedDataOut = new EventEmitter();
    yearListData: any[];
    rateChangeData: any[];
    public localStorageAuthority: Boolean;

    constructor(private messageService: MessageService, private httpService: HttpDataService, private dataManageService: DataManageService) {

    }

    ngOnInit() {
        this.localStorageAuthority = this.dataManageService.buttonAuthority("Maintain FX&cashflow");
        this.editedDataOut.emit(this.rateChangeData);
    }

    ngOnChanges(changes: SimpleChanges) {
        console.log(this.yearEditableListData);
        this.rateChangeData = this.rateChangeEditableData;
        this.yearListData = this.yearEditableListData;
    }

    rateChange($event) {
        this.editedDataOut.emit(this.rateChangeData);
    }
}