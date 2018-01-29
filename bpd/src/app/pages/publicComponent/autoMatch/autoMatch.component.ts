import {
    Component,
    OnChanges,
    Input,
    Output,
    SimpleChanges
} from '@angular/core';

import {
    Message
} from 'primeng/primeng';

import "style-loader!./autoMatch.scss";

import {
    DataManageService
} from '../../service/dataManage.service';
import {
    HttpDataService
} from '../../service/http.service';
import {
    MessageService
} from '../../service/message.service';

@Component({
    selector: "auto-match",
    templateUrl: "./autoMatch.html"
})

export class AutoMatch {

    constructor(private httpService: HttpDataService, private dataManageService: DataManageService, private messageService: MessageService) {

    }

    ngOnChanges() {

    }

}