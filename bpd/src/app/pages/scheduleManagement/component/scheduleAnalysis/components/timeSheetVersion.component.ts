import {
    Component,
    OnInit,
    OnChanges,
    Input,
    SimpleChanges
} from '@angular/core';

import 'style-loader!./timeSheetVersion.scss';

import {
    DataManageService
} from '../../../../service/dataManage.service';
import {
    HttpDataService
} from '../../../../service/http.service';
import {
    MessageService
} from '../../../../service/message.service';

import {
    SelectItem,
    Message
} from 'primeng/primeng';

@Component({
    selector: 'time-sheet-version',
    templateUrl: './timeSheetVersion.html'
})

export class TimeSheetVersion {

    // tableData
    public versionData: any[] = [];
    public elementData: any[] = [];
    public selectedVersionData: any[] = [];
    public headLists: any[] = [];
    private timingIds: string;
    // dialog
    public versionComparisionDialog: Boolean = false;
    public localStorageAuthority: Boolean;

    @Input() changeAdProjectCode: string;

    constructor(private httpService: HttpDataService, private messageService: MessageService, private dataManageService: DataManageService) {

    }

    ngOnInit() {
        this.localStorageAuthority = this.dataManageService.buttonAuthority("Maintain Budget Template");
    }

    ngOnChanges(changes: SimpleChanges) {
        this.httpService.get('/bpd-proj/bpd/masterTimeSheet/getList?' + Number(new Date()) + '&adProjectCode=' + this.changeAdProjectCode)
            .subscribe(data => {
                this.versionData = data;
            })
    }


    /**
     * show comparision dialog
     * 
     * @memberof TimeSheetVersion
     */
    public comparisionClick() {
        let timingIds: any = [];
        for (let i = 0; i < this.selectedVersionData.length; i++) {
            timingIds.push(this.selectedVersionData[i].timingId);
        }
        // console.log(timingIds);
        this.timingIds = timingIds = timingIds.join(",");
        // 获取表头
        this.httpService.post('/bpd-proj/bpd/masterTimeSheetDate/getVersionComparisionHeardMap?', {
            timingIds: timingIds
        })
            .subscribe(data => {
                this.headLists = data;
            })
        this.httpService.post('/bpd-proj/bpd/masterTimeSheetDate/versionComparision?', {
            timingIds: timingIds
        })
            .subscribe(data => {
                this.elementData = this.dataManageService.addEmptyTableData(data, 10);
            })
        this.selectedVersionData = [];
        this.versionComparisionDialog = true;
    }

    /**
     * hide comparision dialog
     * 
     * @memberof TimeSheetVersion
     */
    public versionComparisionCancel() {
        this.versionComparisionDialog = false;
    }

    public exportVersionData() {
        let token = window.sessionStorage.getItem("access_token");
        // timingIds=" + this.timingIds + '&
        this.httpService.post('/bpd-proj/bpd/masterTimeSheetDate/versionComparisionSession', {
            timingIds: this.timingIds
        })
            .subscribe(data => {
                let url: string = "/bpd-proj/bpd/masterTimeSheetDate/exportVersionComparision?sessionKey=" + data + "&_=" + Number(new Date());
                if (token) {
                    let realToken = token.substr(1, token.length - 2)
                    url = url + "&accessToken=" + realToken;
                }
                window.location.href = url;
            })

        this.timingIds = "";
    }
}