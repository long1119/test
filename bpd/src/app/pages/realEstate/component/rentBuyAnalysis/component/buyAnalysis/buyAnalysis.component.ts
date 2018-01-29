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
import 'style-loader!./buyAnalysis.scss';
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
// import { window } from 'rxjs/operator/window';
// import { BaseDataModule } from '../../baseData.module';

@Component({
    selector: 'buy-analysis',
    templateUrl: './buyAnalysis.html',
})
export class BuyAnalysis {

    public buyAnalysisData: any[];
    public buyAnalysisList: any[];
    public localStorageAuthority: Boolean;
    public indexList: any[];

    constructor(private httpService: HttpDataService, private messageService: MessageService, private dataManageService: DataManageService) {
        this.buyAnalysisList = [];
        // for (let i = 1; i <= 50; i++) {
        //     this.buyAnalysisList.push("Y" + i);
        // }
        this.buyAnalysisData = [];
    }

    ngOnInit() {
        this.httpService.get('/bpd-proj/bpd/analysisDetails/getHead')
        .subscribe(data => {
            this.buyAnalysisList = data;
        })
        this.httpService.get('/bpd-proj/bpd/analysisDetails/getDistinct?' + Number(new Date()) + "&indexGroupCode=1")
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
            "indexGroupCode": "1"
        })
            .subscribe(data => {
                if (data["01Land"]) {
                    for (let i = 0; i < listData.length; i++) {
                        let index = listData[i].substr(2 ,listData[i].length - 1);
                        data[listData[i]].index = index;
                        if (i === listData.length - 1) {
                            console.log(index);
                        }
                        this.buyAnalysisData.push(data[listData[i]]); 
                    }
                    // data["Land"]["index"] = "Land";
                    // this.buyAnalysisData.push(data["Land"]);
                    // data["DepreciationTaxBenefit(Land)"]["index"] = "DepreciationTaxBenefit(Land)";
                    // this.buyAnalysisData.push(data["DepreciationTaxBenefit(Land)"]);
                    // data["B&UInvestment"]["index"] = "B&UInvestment";
                    // this.buyAnalysisData.push(data["B&UInvestment"]);
                    // data["DepreciationTaxBenefit(Buildings)"]["index"] = "DepreciationTaxBenefit(Buildings)";
                    // this.buyAnalysisData.push(data["DepreciationTaxBenefit(Buildings)"]);
                    // data["OtherInvestment"]["index"] = "OtherInvestment";
                    // this.buyAnalysisData.push(data["OtherInvestment"]);
                    // data["DepreciationTaxBenefit(Others)"]["index"] = "DepreciationTaxBenefit(Others)";
                    // this.buyAnalysisData.push(data["DepreciationTaxBenefit(Others)"]);
                    // data["LongtermExpense"]["index"] = "LongtermExpense";
                    // this.buyAnalysisData.push(data["LongtermExpense"]);
                    // data["TaxDeductibilityofExpenses"]["index"] = "TaxDeductibilityofExpenses";
                    // this.buyAnalysisData.push(data["TaxDeductibilityofExpenses"]);
                    // data["RealEstateTax(building)"]["index"] = "RealEstateTax(building)";
                    // this.buyAnalysisData.push(data["RealEstateTax(building)"]);
                    // data["LandUsageTax"]["index"] = "LandUsageTax";
                    // this.buyAnalysisData.push(data["LandUsageTax"]);
                    // data["ResidualValue"]["index"] = "ResidualValue";
                    // this.buyAnalysisData.push(data["ResidualValue"]);
                    // data["GovernmentFinancialreturn"]["index"] = "GovernmentFinancialreturn";
                    // this.buyAnalysisData.push(data["GovernmentFinancialreturn"])
                    // data["Cashflow(RMB)"]["index"] = "Cashflow(RMB)";
                    // this.buyAnalysisData.push(data["Cashflow(RMB)"]);
                    // data["PVfactor"]["index"] = "PVfactor";
                    // this.buyAnalysisData.push(data["PVfactor"]);
                    // data["PVCashflow(RMB)"]["index"] = "PVCashflow(RMB)";
                    // this.buyAnalysisData.push(data["PVCashflow(RMB)"]);
                    // data["NPVfor50(RMB)"]["index"] = "NPVfor50(RMB)";
                    // this.buyAnalysisData.push(data["NPVfor50(RMB)"]);
                    // data["NPVfor25(RMB)"]["index"] = "NPVfor25(RMB)";
                    // this.buyAnalysisData.push(data["NPVfor25(RMB)"]);
                }
            })
    }

    /**
     * 导出事件
     * 
     * @memberof BuyAnalysis
     */
    exportAnalysisClick() {
        // console.log(this.buyAnalysisData);
        let token = window.sessionStorage.getItem("access_token");
        let url: string = "/bpd-proj/bpd/analysisDetails/exportExcel?" + Number(new Date())  + "&indexGroupCode=1" + '&_=' + Number(new Date());
        if (token) {
            let realToken = token.substr(1, token.length - 2)
            url = url + "&accessToken=" + realToken;
        }
        window.location.href = url;
    }
}