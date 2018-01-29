import {
    Component,
    OnInit,
    Output,
    EventEmitter,
    Input,
    OnChanges,
    SimpleChanges
} from '@angular/core';

import {
    HttpDataService
} from '../../../../service/http.service';
import {
    DataManageService
} from '../../../../service/dataManage.service';

@Component({
    selector: "devlibables-work-flow",
    templateUrl: "./devlibablesWorkFlow.html",
    styleUrls: [
        './devlibablesWorkFlow.scss'
    ]
})

export class DevlibablesWorkFlow {

    constructor(private httpService: HttpDataService, private dataManageService: DataManageService) {

    }

    ngOnInit() {

    }
}
