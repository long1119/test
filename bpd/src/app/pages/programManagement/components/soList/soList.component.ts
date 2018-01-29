import {
    Component,
    OnInit
} from '@angular/core';

import {
    SelectItem,
    Message,
} from 'primeng/primeng';

import 'style-loader!./soList.scss';

import {
    DataManageService
} from '../../../service/dataManage.service';
import {
    HttpDataService
} from '../../../service/http.service';
import {
    MessageService
} from '../../../service/message.service';
import {
    RefreshMenuService
} from '../../../service/refreshMenu.service';

@Component({
    selector: 'sq-list',
    templateUrl: './soList.html',
    providers: [RefreshMenuService]
})

export class SoList {

    // 页面表格数据
    public soListData: any[];
    public messageData: any[];

    public namePlateOption: SelectItem[];
    public selectedNamePlate: string;
    public brandOption: SelectItem[];
    public selectedBrand: string;
    // public listTypeOption: SelectItem[];
    public selectedListType: number;
    public selectedVpps: string;
    public vppsOption: SelectItem[];
    public selectedModelYear: string;
    public modelYearOption: SelectItem[];
    public dialogRpo: string;
    public growMessage: Message[];
    public growLife: number = 5000;

    public messageDialog: Boolean;
    public addDialog: Boolean;

    // 分页信息
    public soListPaginatorTotal: number;
    private soListPaginatorRow: number;
    private soListPainatorPage: number;
    public soListFontFirst: number;
    public localStorageAuthority: Boolean;

    constructor(private httpServce: HttpDataService, private messageService: MessageService, private dataManageService: DataManageService, private refreshMenuService: RefreshMenuService) {
        // 刷新菜单默认选中项
        let flag = this.dataManageService.getUuId()
        this.refreshMenuService.refreshMenu(flag);
        // 上传框数据初始化
        // this.listTypeOption = [
        //     {
        //         label: "Local",
        //         value: 1
        //     },
        //     {
        //         label: "Groble",
        //         value: 0
        //     }
        // ]
        this.selectedListType = 0;
        // 表格数据初始化
        this.soListPaginatorRow = 10;
        this.soListPainatorPage = 1;
        this.soListFontFirst = 0;
        // 页面数据初始化
        this.dialogRpo = "";
    }

    ngOnInit() {
        this.tableOnInit(this.soListPainatorPage, this.soListPaginatorRow);
        // 页面下拉框数据获取
        this.localStorageAuthority = this.dataManageService.buttonAuthority("Maintain S O List");
    }

    private getNamePlateBrandCombobox() {
        this.httpServce.get('/bpd-proj/bpd/soList/getNameplateBrandCombobox')
            .subscribe(data => {
                if (!!data.length && data[0] != null) {
                    data.unshift({
                        label: "ALL",
                        value: null
                    });
                    this.namePlateOption = data;
                    this.selectedNamePlate = data[0].value;
                } else {
                    this.namePlateOption = [];
                    this.selectedNamePlate = "";
                }
            })
    }

    private getBrandCombobox() {
        this.httpServce.get('/bpd-proj/bpd/soList/getBrandCombobox')
            .subscribe(data => {
                if (!!data.length && data[0] != null) {
                    data.unshift({
                        label: "ALL",
                        value: null
                    });
                    this.brandOption = data;
                    this.selectedBrand = data[0].value;
                } else {
                    this.brandOption = [];
                    this.selectedBrand = "";
                }
            })
    }

    private getModelYearCombobox() {
        this.httpServce.get("/bpd-proj/bpd/soList/getModelYearCombobox")
            .subscribe(data => {
                if (data.length != 0 && data[0] != null) {
                    data.unshift({
                        label: "ALL",
                        value: null
                    });
                    this.modelYearOption = data;
                    this.selectedModelYear = data[0].value;
                } else {
                    this.modelYearOption = [];
                    this.selectedModelYear = "";
                }
            })
    }

    private getVppsCombobox() {
        this.httpServce.get("/bpd-proj/bpd/soList/getVppsCombobox")
            .subscribe(data => {
                if (data.length != 0 && data[0] != null) {
                    data.unshift({
                        label: "ALL",
                        value: ""
                    });
                    this.vppsOption = data;
                    this.selectedVpps = data[0].value;
                } else {
                    this.vppsOption = [];
                    this.selectedVpps = "";
                }
            })
    }

    private tableOnInit(page: number, row: number, namePlate: string = "", brand: string = "", vpps: string = "", rpo: string = "") {
        this.httpServce.post('/bpd-proj/bpd/soList/getVList', {
            page: {
                page: page,
                rows: row
            },
            nameplateBrand: namePlate,
            brand: brand,
            vpps: vpps,
            rpo: rpo
        })
            .subscribe(data => {
                this.soListPaginatorTotal = data.total;
                this.soListData = this.dataManageService.addEmptyPaginatorTableData(data, 10);
                this.getNamePlateBrandCombobox();
                this.getBrandCombobox();
                this.getVppsCombobox();
                this.getModelYearCombobox();
            })
    }

    private soListPaginate($event) {
        this.soListPainatorPage = $event.page + 1;
        this.soListPaginatorRow = $event.rows;
        this.soListFontFirst = $event.first;

        this.tableOnInit($event.page + 1, $event.rows, this.selectedNamePlate, this.selectedBrand, this.selectedVpps, this.dialogRpo);
    }

    /**
     * 上传弹窗展示事件
     * 
     * @memberof SoList
     */
    public addClick() {
        // this.selectedListType = this.listTypeOption[0].value;
        this.addDialog = true;
    }

    lookupEnterSearch($event) {
        if ($event.key === "Enter") {
            this.lookUpClick();
        }
    }

    /**
     * 模糊查询事件
     * 
     * @memberof SoList
     */
    public lookUpClick() {
        let page = {
            page: 0,
            rows: 10,
            first: 0
        }
        this.soListPaginate(page);
    }

    /**
     * 上传完成事件
     * 
     * @param {any} $event 
     * @memberof SoList
     */
    public onBasicUpload($event) {
        let response = eval('(' + $event.xhr.response + ')');
        this.getNamePlateBrandCombobox();
        this.getBrandCombobox();
        this.tableOnInit(this.soListPainatorPage, this.soListPaginatorRow, this.selectedNamePlate, this.selectedBrand, this.selectedVpps, this.dialogRpo);
        if (response.list.length !== 0) {
            //   错误信息展示
            this.messageData = response.list;
            this.messageDialog = true;
        } else {
            this.messageService.showSuccess("Operation Success!");
            this.growLife = 5000;
            this.growMessage = this.messageService.msgs;
        }
        this.addDialog = false;
    }

    /**
     * 上传文件选择事件
     * 
     * @param {any} $event 
     * @memberof SoList
     */
    public onBasicSelect($event) {

    }

    /**
     * 上传文件失败
     * 
     * @param {any} $event 
     * @memberof SoList
     */
    public onBasicUploadError($event) {
        // this.messageService.showError("Upload Failed!");
        // this.growMessage = this.messageService.msgs;
    }

    /**
     * 错误信息展示弹窗关闭
     */
    public messageDetermine() {
        this.messageDialog = false;
    }

    public messageVeto() {
        this.messageDialog = false;
    }

    public exportClick() {
        let token = window.sessionStorage.getItem("access_token");
        let url: string = "/bpd-proj/bpd/soList/exportExcel?brand=" + (this.selectedBrand || "") + "&namePlateBrand=" + (this.selectedNamePlate || "") + "&vpps=" + this.selectedVpps + "&rpo=" + this.dialogRpo + '&_=' + Number(new Date());
        if (token) {
            let realToken = token.substr(1, token.length - 2)
            url = url + "&accessToken=" + realToken;
        }
        window.location.href = url;
    }
}