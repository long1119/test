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
    selector: "user-select",
    templateUrl: "./userSelect.html",
    styleUrls: [
        './userSelect.scss'
    ]
})

export class UserSelect {
    public dialogDepartment: string;
    public dialogUserName: string;
    public dialogEmployeeCode: string;    

    baseData: any[];
    public selectedManagerData: any[];

    @Input() roleCode: string;
    @Input() multiple: Boolean = false;
    @Input() refreshFlag: Boolean;

    @Output() selectUserNameOut = new EventEmitter();
    @Output() selectUserCodeOut = new EventEmitter();

    // paginator
    public paginatorTotal: number;
    public paginatorPage: number; 
    public paginatorRow: number;
    public fontFirst: number;
    
    constructor(private httpService: HttpDataService, private dataManageService: DataManageService) {
        // data oninit
        this.paginatorTotal = 0;
        this.paginatorPage = 1;
        this.paginatorRow = 10;
        this.fontFirst = 0;
    }

    ngOnChanges(changes: SimpleChanges) {
        // console.log(this.roleCode);
        this.httpService.post("/bpd-proj/bpd/user/userRole/getVList", {
            "roleCode" : this.roleCode,
            "page": {
                "page": this.paginatorPage,
                "rows": this.paginatorRow
            }
         })
            .subscribe(data => {
                this.baseData = this.dataManageService.addEmptyPaginatorTableData(data, 10);
                this.paginatorTotal = data.total;
            })
        this.selectedManagerData = [];
    }

    ngOnInit() {
       this.lookClick();
    }

    paginate($event) {
        this.paginatorPage = $event.page + 1;
        this.paginatorRow = $event.rows;
        this.fontFirst = $event.first;
        this.httpService.post("/bpd-proj/bpd/user/userRole/getVList", {
            "userName": this.dialogUserName,
            "employeeCode": this.dialogEmployeeCode,
            "departmentName": this.dialogDepartment,
            "roleCode": this.roleCode,
            "page": {
                "page": $event.page + 1,
                "rows": $event.rows 
            }
        })
        .subscribe(data => {
            this.paginatorTotal = data.total;
            this.baseData = this.dataManageService.addEmptyPaginatorTableData(data, 10);
        })
    }

    onDialogRowClick($event) {
        // console.log($event);
        // this.selectUserNameOut.emit($event.data.userName);
        // this.selectUserCodeOut.emit($event.data.userCode);
    }

    onDialogRowDblClick($event) {
        this.selectUserNameOut.emit($event.data.userName);
        this.selectUserCodeOut.emit($event.data.userCode);
    }


    lookClickEnterSearch($event) {
        if ($event.key === "Enter") {
            this.lookClick();
        }
    }

    lookClick() {
        let page = {
            page: 0,
            rows: 10,
            first: 0
        }
        this.paginate(page);
    }
}