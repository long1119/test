import {
    Component,
    OnInit
} from '@angular/core';
import {
    CommonModule
} from '@angular/common';
import {
    FormsModule
} from '@angular/forms';
import 'style-loader!./rentalAnalysis.scss';
import {
    SelectItem,
    Message
} from 'primeng/primeng';
import {
    HttpDataService
} from '../../../../../service/http.service';
import {
    MessageService
} from '../../../../../service/message.service';
import {
    DataManageService
} from '../../../../../service/dataManage.service';

// import { BaseDataModule } from '../../baseData.module';

@Component({
    selector: 'rental-analysis',
    templateUrl: './rentalAnalysis.html',
})
export class RentalAnalysis {

    public rentalAnalysisData: any[];
    public rentalAnalysisList: any[];
    public localStorageAuthority: Boolean;
    public indexList: any[];
    constructor(private httpService: HttpDataService, private messageService: MessageService, private dataManageService: DataManageService) {
        this.rentalAnalysisList = [];
        // for (let i = 1; i <= 50; i++) {
        //     this.rentalAnalysisList.push("Y" + i);
        // }
        this.rentalAnalysisData = [];
    }

    ngOnInit() {
        this.httpService.get('/bpd-proj/bpd/analysisDetails/getHead')
        .subscribe(data => {
            this.rentalAnalysisList = data;
        })
        this.httpService.get('/bpd-proj/bpd/analysisDetails/getDistinct?' + Number(new Date()) + "&indexGroupCode=0")
        .subscribe(data => {
            this.indexList = data;
            this.tableOnInit(data);
        })
        this.localStorageAuthority = this.dataManageService.buttonAuthority("Maintain Rent Property Ledger");
    }

    /**
     * [tableOnInit description]
     */
    private tableOnInit(data: any[] = this.indexList) {
        let listData = data;
        this.httpService.post('/bpd-proj/bpd/analysisDetails/getCalculationResult', {
            "indexGroupCode": "0"
        })
            .subscribe(data => {
                if (data["22Unit Rent price"]) {
                    for (let i = 0; i < listData.length; i++) {
                        let index = listData[i].substr(2 ,listData[i].length - 1);
                        console.log(index);
                        data[listData[i]].index = index;
                        this.rentalAnalysisData.push(data[listData[i]]); 
                    }
                    // data["UnitRentprice"]["index"] = "UnitRentprice";
                    // this.rentalAnalysisData.push(data["UnitRentprice"]);
                    // data["RentalExpense"]["index"] = "RentalExpense";
                    // this.rentalAnalysisData.push(data["RentalExpense"]);
                    // data["LongtermExpense"]["index"] = "LongtermExpense";
                    // this.rentalAnalysisData.push(data["LongtermExpense"]);
                    // data["OtherInvestment"]["index"] = "OtherInvestment";
                    // this.rentalAnalysisData.push(data["OtherInvestment"]);
                    // data["RealEstateTax(Rental)"]["index"] = "RealEstateTax(Rental)";
                    // this.rentalAnalysisData.push(data["RealEstateTax(Rental)"]);
                    // data["DepreciationTaxBenefit(Others)"]["index"] = "DepreciationTaxBenefit(Others)";
                    // this.rentalAnalysisData.push(data["DepreciationTaxBenefit(Others)"]);
                    // data["TaxDeductibilityofExpense"]["index"] = "TaxDeductibilityofExpense";
                    // this.rentalAnalysisData.push(data["TaxDeductibilityofExpense"]);
                    // data["Cashflow(RMB)"]["index"] = "Cashflow(RMB)";
                    // this.rentalAnalysisData.push(data["Cashflow(RMB)"]);
                    // data["PVfactor"]["index"] = "PVfactor";
                    // this.rentalAnalysisData.push(data["PVfactor"]);
                    // data["PVCashflow(RMB)"]["index"] = "PVCashflow(RMB)";
                    // this.rentalAnalysisData.push(data["PVCashflow(RMB)"]);
                    // data["NPVfor50(RMB)"]["index"] = "NPVfor50(RMB)";
                    // this.rentalAnalysisData.push(data["NPVfor50(RMB)"]);
                    // data["NPVfor25(RMB)"]["index"] = "NPVfor25(RMB)";
                    // this.rentalAnalysisData.push(data["NPVfor25(RMB)"]);
                }  
            })
    }

    /**
     * 导出事件
     * 
     * @memberof rentalAnalysis
     */
    exportAnalysisClick() {
        let token = window.sessionStorage.getItem("access_token");
        let url: string = "/bpd-proj/bpd/analysisDetails/exportExcel?" + Number(new Date())  +  "&indexGroupCode=0" + '&_=' + Number(new Date());
        if (token) {
            let realToken = token.substr(1, token.length - 2)
            url = url + "&accessToken=" + realToken;
        }
        window.location.href = url;
    }
}
