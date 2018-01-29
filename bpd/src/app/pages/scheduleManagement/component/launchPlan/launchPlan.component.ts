import {
    Component,
    OnInit
} from '@angular/core';

import 'style-loader!./launchPlan.scss';

import {
    SelectItem,
    Message
} from 'primeng/primeng';

import {
    MessageService
} from '../../../service/message.service';
import {
    HttpDataService
} from '../../../service/http.service';
import {
    DataManageService
} from '../../../service/dataManage.service'

@Component({
    selector: 'launch-plan',
    templateUrl: './launchPlan.html'
})

export class LaunchPlan {

    // 页面表格数据
    public launchPlanData: any[];

    // 分页信息
    public launchPlanPaginatorTotal: number;
    public launchPlanPaginatorPage: number;
    public launchPlanPaginatorRow: number;

    public selectedLaunchPlan: any;
    
    // 页面双向绑定信息
    public changeAdProjectCode: string;

    constructor(private httpService: HttpDataService, private messageService: MessageService, private dataManageService: DataManageService) {
        // 分页信息初始化
        this.launchPlanPaginatorPage = 1;
        this.launchPlanPaginatorRow = 10;
    }

    ngOnInit() {
       this.tableOnInit(this.launchPlanPaginatorPage, this.launchPlanPaginatorRow);
    }

    private tableOnInit(page: number, row: number) {
        this.httpService.post('/bpd-proj/bpd/vehicleProject/getVListTwo', {
            page: {
                page: page,
                rows: row
            },
            launchPlanFlag: "1"
        })
            .subscribe(data => {
                let setArr = new Set();
                data.rows.forEach(element => {
                    setArr.add(element);
                });
                // new Set(data);
                this.launchPlanPaginatorTotal = data.total;
                this.launchPlanData = this.dataManageService.addEmptyPaginatorTableData(data, 10);
                if (data.rows.length != 0)  {
                    this.changeAdProjectCode = data.rows[0].adProjectCode;
                    this.selectedLaunchPlan = data.rows[0];
                }
            })
    }

    /**
     * 分页变更函数
     * 
     * @param {any} $event 
     * @memberof LaunchPlan
     */
    public launchPlanPaginate($event) {
        this.launchPlanPaginatorRow = $event.rows;
        this.launchPlanPaginatorPage = $event.page + 1; 
        this.tableOnInit($event.page + 1, $event.rows);
    }

    onRowClick($event) {
       this.changeAdProjectCode = $event.data.adProjectCode;
    }
}