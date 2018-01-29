import {
    Component,
    OnInit,
    Input,
    OnChanges,
    SimpleChanges
} from '@angular/core';

import {
    SelectItem,
    Message
} from 'primeng/primeng';

import {
    MessageService
} from '../../../../../service/message.service';
import {
    HttpDataService
} from '../../../../../service/http.service';

import 'style-loader!./timeSheetFiles.scss';

@Component({
    selector: 'time-sheet-files',
    templateUrl: './timeSheetFiles.html'
})

export class TimeSheetFiles {

}