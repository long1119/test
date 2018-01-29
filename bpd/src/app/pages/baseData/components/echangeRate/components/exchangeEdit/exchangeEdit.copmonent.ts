import {
    Component,
    Input,
    OnInit,
    OnChanges,
    Output,
    EventEmitter,
    SimpleChanges
} from '@angular/core';
import 'style-loader!./exchangeEdit.scss';
import {
    Message,
    SelectItem
} from 'primeng/primeng';
import {
    HttpDataService
} from '../../../../../service/http.service';
import {
    MessageService
} from '../../../../../service/message.service';

@Component({
    selector: 'exchange-edit',
    templateUrl: './exchangeEdit.html'
})

export class ExchangeEdit {
    baseData: any[];
    listData: any[];
    @Input() changedCode: string;
    @Input() paginatorPage: number;
    @Input() paginatorRow: number;
    @Output() paginatorPageOut = new EventEmitter();
    @Output() paginatorRowOut = new EventEmitter();
    @Output() flagOut = new EventEmitter();
    importFlag: Boolean = true;
   

    msgs: Message[];

    constructor(private httpService: HttpDataService, private messageService: MessageService) {

    }

    ngOnChanges(changes: SimpleChanges) {
        console.log(this.changedCode);
    }

    ngOnInit() {
        this.httpService.post('/bpd-proj/bpd/exchangeYearRate/getYearRateList', {
            "exchangeRateId": this.changedCode
        })
            .subscribe(data => {
                this.listData = data.yearList;
            });
            this.httpService.post('/bpd-proj/bpd/exchangeRateInfo/getMap', {
                "exchangeRateId": this.changedCode
            })
            .subscribe(data => {
                this.baseData = data;
                console.log(data);
            });
    }

    flagClick() {
        this.importFlag = false;
        this.flagOut.emit(this.importFlag);
        this.paginatorPageOut.emit(this.paginatorPage);
        this.paginatorRowOut.emit(this.paginatorRow);
        console.log(this.importFlag);
    }

    public exportClick() {
        let token = window.sessionStorage.getItem("access_token");
        let url: string = "/bpd-proj/bpd/exchangeYearRate/exportExcel?" + Number(new Date()) + "&exchangeRateId=" + this.changedCode;
        if (token) {
            let realToken = token.substr(1, token.length - 2)
            url = url + "&accessToken=" + realToken;
        }
        window.location.href = url;
    }
}