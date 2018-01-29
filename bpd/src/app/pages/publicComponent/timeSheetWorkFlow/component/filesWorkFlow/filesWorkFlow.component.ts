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
    selector: "files-work-flow",
    templateUrl: "./filesWorkFlow.html",
    styleUrls: [
        './filesWorkFlow.scss'
    ]
})

export class FilesWorkFlow {

    constructor(private httpService: HttpDataService, private dataManageService: DataManageService) {

    }

    ngOnInit() {

    }
}
