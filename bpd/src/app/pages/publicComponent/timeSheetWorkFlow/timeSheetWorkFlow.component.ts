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
} from '../../service/http.service';
import {
    DataManageService
} from '../../service/dataManage.service';

@Component({
    selector: "time-sheet-work-flow",
    templateUrl: "./timeSheetWorkFlow.html",
    styleUrls: [
        './timeSheetWorkFlow.scss'
    ]
})

export class TimeSheetWorkFlow {
    @Input() auditForm: any;
    public selectedTimeSheet: Boolean;
    public selectedFiles: Boolean;
    public selectedDevlibable: Boolean;

    constructor(private dataManageService: DataManageService, private httpService: HttpDataService) {
        this.selectedDevlibable = false;
        this.selectedTimeSheet = true;
        this.selectedFiles = false;
    }

    ngOnInit() {
    }

    /**
     * tab页签切换事件
     * 
     * @param {any} $event 
     * @memberof TimeSheetWorkFlow
     */
    changeTab($event) {
        switch ($event.index) {
            case 0:
                this.selectedDevlibable = false;
                this.selectedTimeSheet = true;
                this.selectedFiles = false;
                break;
                // case 1:
                //     this.selectedDevlibable = false;
                //     this.selectedTimeSheet = true;
                //     this.selectedFiles = false;
                //     break;
            case 1:
                this.selectedDevlibable = false;
                this.selectedTimeSheet = true;
                this.selectedFiles = false;
                break;
        }
    }
}