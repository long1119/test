import { Component, OnInit } from '@angular/core';
import 'style-loader!./hrUserList.scss';
import { SelectItem } from 'primeng/primeng';
import { HttpDataService } from '../../../service/http.service';
import { MessageService } from '../../../service/message.service';

@Component({
  selector: 'hrUserList',
  templateUrl: './hrUserList.html',
  providers: [HttpDataService, MessageService]
})
export class HrUserList implements OnInit{

	public gridStore: any = [];

    public gridStoreLen: number;

    public gridStoreRows: any = '15';

    public gridStoreFirst: any = 0;

	public roleStore: any = [];

	public setStatusDisplay: boolean = false;

	public isChecked: boolean = false;

	public DepartmentSearch: string = null;

	public userNameSearch: string = null;

    public employeeSearch: string = null;

	public roleNameSearch: string = '';

	public roleCodes: string = '';

	public userCode: string = '';

	public roleCodeArr: any = [];

    public msgs: any;

    public growLife: number = 5000;

	constructor(private service: HttpDataService, private msgservice: MessageService) {

	}
    
    ngOnInit() {
    	let e = {page: 0, first: 0, rows: "15"};
        this.paginate(e);
    }



    public paginate(e) {
        let observable = this.service.post("/bpd-proj/bpd/user/getHrUserList", {
            "page": {
                "page": e.page + 1,
                "rows": e.rows
            },
            "departmentName": this.DepartmentSearch,
            "userName": this.userNameSearch,
            "employeeCode": this.employeeSearch
        })
        .subscribe(data1 => {
            let data = data1.rows;
            this.gridStoreLen = data1.total;
            this.gridStoreRows = e.rows;
            this.gridStoreFirst = e.first;
            this.gridStore = [];
            for(let i = 0; i < data.length; i++) {
                data[i].id = i + 1;
            }
            for(let i = 0; i < e.rows; i++) {
                if(!data[i]) {
                    this.gridStore.push({
                        'ip': i
                    })
                } else {
                    this.gridStore.push(data[i])
                }
            }
        });
    }

    public searchEnterSearch($event) {
        if ($event.key === "Enter") {
            this.search();
        }
    }
    
    public search() {
        let e = {page: 0, first: 0, rows: "15"};
        this.paginate(e);
    }
};