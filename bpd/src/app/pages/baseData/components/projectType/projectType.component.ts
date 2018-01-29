import {
    Component,
    OnInit
} from '@angular/core';
import {
    HttpDataService
} from '../../../service/http.service';
import {
    DataManageService
} from '../../../service/dataManage.service';
import 'style-loader!./projectType.scss';
import {
    SelectItem
} from 'primeng/primeng';
import {
    Router
} from '@angular/router';


@Component({
    selector: 'project-type',
    templateUrl: './projectType.html',
})
export class ProjectType {

    addDialog: Boolean = false;
    editDialog: Boolean = false;

    dialogCode: any;
    dialogDescription: any;
    dialogComment: any;
    selectedPropertyGroup: any;
    selectedCapitalExpense: any;


    investmentData: any[];
    selectedInvestment: any;
    investments: any = {};

    propertyGroup: SelectItem[];

    selectedIndex: number;
    selectedData: any = {};
    projectType: any;
    projectTypeName: any;

    projectParameter: Boolean = false;
    projectLevel: Boolean = false;
    projectCategory: Boolean = true;
    arTemplateUpLoad: Boolean = false;
    programUpload: Boolean = false;
    arFlag: Boolean = false;
    vehicleFlag: Boolean = false;
    facilityFlag: Boolean = false;
    realFacilityFlag: Boolean = false;
    invesatmentFlag: Boolean = false;
    categorySelected: Boolean;
    regionSelected: Boolean;
    levelSelected: Boolean;
    arTemplateSelected: Boolean;
    facilityTempalteSelected: Boolean;
    public localStorageAuthority: Boolean;


    constructor(private router: Router, private service: HttpDataService, private dataManageService: DataManageService) {
        this.facilityFlag = true;
    }

    // levelClick() {
    //     this.projectParameter = false;
    //     this.projectLevel = true;
    //     this.projectCategory = false;
    // }
    // parameterClick() {
    //     this.projectParameter = true;
    //     this.projectLevel = false;
    //     this.projectCategory = false;
    // }
    // categoryClick() {
    //     this.projectParameter = false;
    //     this.projectLevel = false;
    //     this.projectCategory = true;
    // }

    changeTab($event) {
        let innerText = $event.originalEvent.srcElement.innerText;
        switch (innerText.trim()) {
            case "Project Category":
                this.projectParameter = false;
                this.projectLevel = false;
                this.projectCategory = true;
                this.arTemplateUpLoad = false;
                this.programUpload = false;
                this.categorySelected = true;
                this.regionSelected = false;
                this.levelSelected = false;
                this.facilityTempalteSelected = false;
                this.arTemplateSelected = false;
                break;
            case "Project Level":
                this.projectParameter = false;
                this.projectLevel = true;
                this.projectCategory = false;
                this.arTemplateUpLoad = false;
                this.programUpload = false;
                this.categorySelected = false;
                this.regionSelected = false;
                this.levelSelected = true;
                this.facilityTempalteSelected = false;
                this.arTemplateSelected = false;
                break;
            case "Investment Parameter":
                this.projectParameter = true;
                this.projectLevel = false;
                this.projectCategory = false;
                this.arTemplateUpLoad = false;
                this.programUpload = false;
                this.categorySelected = false;
                this.regionSelected = true;
                this.levelSelected = false;
                this.facilityTempalteSelected = false;
                this.arTemplateSelected = false;
                break;
            case "AR Template Upload":
                this.projectParameter = false;
                this.projectLevel = false;
                this.projectCategory = false;
                this.arTemplateUpLoad = true;
                this.programUpload = false;
                this.categorySelected = false;
                this.regionSelected = false;
                this.levelSelected = false;
                this.facilityTempalteSelected = false;
                this.arTemplateSelected = true;
                break;
            case "PT Reference Info":
                this.projectParameter = false;
                this.projectLevel = false;
                this.projectCategory = false;
                this.arTemplateUpLoad = false;
                this.programUpload = true;
                this.categorySelected = false;
                this.regionSelected = false;
                this.levelSelected = false;
                this.facilityTempalteSelected = true;
                this.arTemplateSelected = false;
                break;
        }
    }



    /**
     * 初始化时查询方法
     */
    ngOnInit() {
        this.service.post("/bpd-proj/bpd/projectType/getList", {})
            .subscribe(data => {
                this.investmentData = data;
                if (data.length != 0) {
                    // for (let i = 0; i < data.length; i++) {
                    //     if (data[i].projectType === "100") {
                    //         data.splice(i, 1);
                    //     }
                    // }
                    this.selectedInvestment = data[0];
                    this.projectType = data[0].projectType;
                    if (data[0].projectType === "110") {
                        this.projectLevel = false;
                        this.categorySelected = true;
                        this.projectParameter = false;
                        this.facilityFlag = false;
                        this.arFlag = false;
                        this.projectCategory = true;
                        this.invesatmentFlag = false;
                        this.regionSelected = false;
                        this.levelSelected = false;
                        this.facilityTempalteSelected = false;
                        this.arTemplateSelected = false;
                        this.realFacilityFlag = false;
                        this.vehicleFlag = false;
                    }
                    this.projectTypeName = data[0].projectTypeName;
                }
            });
        this.localStorageAuthority = this.dataManageService.buttonAuthority("Maintain Project Type");
    }

    handleRowClick(event) {

        let projectType = this.projectType = event.data.projectType;
        this.projectTypeName = event.data.projectTypeName;
        // this.projLevelService.getVlist();
        if (projectType == "200") {
            this.invesatmentFlag = false;
            this.projectParameter = false;
            this.projectLevel = false;
            this.projectCategory = true;
            this.arFlag = false;
            this.facilityFlag = false;
            this.realFacilityFlag = true;
            this.vehicleFlag = false;
            this.categorySelected = true;
            this.regionSelected = false;
            this.levelSelected = false;
            this.facilityTempalteSelected = false;
            this.arTemplateSelected = false;
        } else if (projectType == "300") {
            this.arFlag = true;
            this.projectLevel = false;
            this.vehicleFlag = false;
            this.projectParameter = true;
            this.projectCategory = false;
            this.invesatmentFlag = false;
            this.categorySelected = false;
            this.regionSelected = true;
            this.levelSelected = false;
            this.facilityTempalteSelected = false;
            this.arTemplateSelected = false;
            this.facilityFlag = false;
            this.realFacilityFlag = true;
        } else if (projectType == "100") {
            this.projectLevel = false;
            this.vehicleFlag = false;
            this.categorySelected = true;
            this.projectParameter = false;
            this.arFlag = false;
            this.projectCategory = true;
            this.invesatmentFlag = false;
            this.regionSelected = false;
            this.levelSelected = false;
            this.facilityTempalteSelected = false;
            this.arTemplateSelected = false;
            this.facilityFlag = true;
            this.realFacilityFlag = false;
        } else if (projectType == "120") {
            this.projectLevel = false;
            this.vehicleFlag = false;
            this.categorySelected = true;
            this.projectParameter = false;
            this.facilityFlag = false;
            this.arFlag = false;
            this.projectCategory = true;
            this.invesatmentFlag = false;
            this.regionSelected = false;
            this.levelSelected = false;
            this.facilityTempalteSelected = false;
            this.arTemplateSelected = false;
            this.realFacilityFlag = false;
        } else {
            this.projectLevel = false;
            this.categorySelected = true;
            this.projectParameter = false;
            this.facilityFlag = false;
            this.arFlag = false;
            this.projectCategory = true;
            this.invesatmentFlag = false;
            this.regionSelected = false;
            this.levelSelected = false;
            this.facilityTempalteSelected = false;
            this.arTemplateSelected = false;
            this.realFacilityFlag = false;
            this.vehicleFlag = false;
        }
    }
};