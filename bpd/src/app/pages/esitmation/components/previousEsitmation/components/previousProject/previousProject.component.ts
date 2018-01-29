import {
    Component,
    OnInit,
    Input,
    OnChanges,
    SimpleChanges
} from '@angular/core';
import {
    SelectItem,
    Message
} from 'primeng/primeng';

import 'style-loader!./previousProject.scss';

import {
    MessageService
} from '../../../../../service/message.service';
import {
    HttpDataService
} from '../../../../../service/http.service';
import {
    DataManageService
} from '../../../../../service/dataManage.service';
import {
    DeleteComfirmService
} from '../../../../../service/deleteDialog.service';

@Component({
    selector: 'previous-project',
    templateUrl: './previousProject.html'
})

export class PreviousProject {
    baseData: any[];
    msgs: Message[];
    public growLife: number = 5000;

    categoryData: any[];
    selectedCategory: any[] = [];
    dialogInvestment: string;
    dialogDescription: string;
    dialogComment: string;

    selectedIdx: number;
    selectedData: any;

    addDialog: Boolean = false;
    editDialog: Boolean = false;
    deleteDialog: Boolean = false;

    @Input() changeProjectCode: string;
    public localStorageAuthority: Boolean;

    constructor(private messageService: MessageService, private httpService: HttpDataService, private dataManageService: DataManageService, private deleteService: DeleteComfirmService) {

    }

    ngOnInit() {
        this.httpService.post('/bpd-proj/bpd/regionCategory/getVList', {})
            .subscribe(data => {
                this.categoryData = data;
            })
        this.baseData = this.dataManageService.addEmptyOnInitTableData(10);
        this.localStorageAuthority = this.dataManageService.buttonAuthority("Maintain Advance Estimation");
    }

    ngOnChanges(changes: SimpleChanges) {
        if (!!this.changeProjectCode) {
            this.httpService.post('/bpd-proj/bpd/projectEstimation/getVList', {
                "projectId": this.changeProjectCode,
            })
                .subscribe(data => {
                    this.baseData = this.dataManageService.addEmptyTableData(data, 10);
                })
        }
    }

    addClick() {
        // this.selectedCategory = this.categoryOption[0].value;
        this.selectedCategory = [];
        this.dialogInvestment = "";
        this.dialogDescription = "";
        this.dialogComment = "";
        this.addDialog = true;
    }

    addSave() {
        let categoryList: any = [];
        for (let i = 0; i < this.selectedCategory.length; i++) {
            categoryList.push(this.selectedCategory[i].regionCategoryCode)
        }
        categoryList = categoryList.join(",");
        console.log(categoryList);
        this.httpService.post('/bpd-proj/bpd/projectEstimation/insert', {
            "projectId": this.changeProjectCode,
            "regionCatCodes": categoryList,
            "investment": this.dialogInvestment,
            "estimationDescription": this.dialogDescription,
            "estimateComment": this.dialogComment
        })
            .subscribe(data => {
                if ("1" == data.code) { //操作成功
                    this.messageService.showSuccess('Operation succeeded!');
                    this.growLife = 5000;
                } else { //操作失败
                    this.growLife = 5000;
                    this.messageService.showError('Operation failed!');
                }
                //获取操作信息
                this.msgs = this.messageService.msgs;
                this.httpService.post('/bpd-proj/bpd/projectEstimation/getVList', {
                    "projectId": this.changeProjectCode,

                })
                    .subscribe(data => {
                        this.baseData = this.dataManageService.addEmptyTableData(data, 10);
                    })
            })
        this.addDialog = false;
    }

    addCancle() {

        this.addDialog = false;
    }

    editClick(idx, data) {
        this.selectedData = data;
        this.selectedCategory = [];
        this.dialogInvestment = data.investment;
        this.dialogDescription = data.estimationDescription;
        this.dialogComment = data.estimateComment;
        this.httpService.get('/bpd-proj/bpd/projectEstimation/getDtoById?' + Number(new Date()) + '&projectEstimationCode=' + data.projectEstimationCode)
            .subscribe(data => {
                let arr: string[] = data.regionCategoryCode.split('/');
                if (arr.length != 0) {
                    for (let i = 0; i < arr.length; i++) {
                        for (let j = 0; j < this.categoryData.length; j++) {
                            if (arr[i] === this.categoryData[j].regionCategoryCode) {
                                this.selectedCategory.push(this.categoryData[j]);
                            }
                        }
                    }
                }
            })
        this.editDialog = true;
    }

    editSave() {
        let categoryList: any = [];
        for (let i = 0; i < this.selectedCategory.length; i++) {
            categoryList.push(this.selectedCategory[i].regionCategoryCode)
        }
        categoryList = categoryList.join(",");
        console.log(categoryList);
        this.httpService.post('/bpd-proj/bpd/projectEstimation/update', {
            "projectId": this.changeProjectCode,
            "regionCatCodes": categoryList,
            "investment": this.dialogInvestment,
            "estimationDescription": this.dialogDescription,
            "estimateComment": this.dialogComment,
            "projectEstimationCode": this.selectedData.projectEstimationCode
        })
            .subscribe(data => {
                if ("1" == data.code) { //操作成功
                    this.messageService.showSuccess('Operation succeeded!');
                    this.growLife = 5000;
                } else { //操作失败
                    this.messageService.showError('Operation failed!');
                    this.growLife = 5000;
                }
                //获取操作信息
                this.msgs = this.messageService.msgs;
                this.httpService.post('/bpd-proj/bpd/projectEstimation/getVList', {
                    "projectId": this.changeProjectCode,

                })
                    .subscribe(data => {
                        this.baseData = this.dataManageService.addEmptyTableData(data, 10);
                    })
            })
        this.editDialog = false;

    }

    editCancle() {
        this.dialogInvestment = "";
        this.dialogDescription = "";
        this.dialogComment = "";
        this.editDialog = false;
    }

    deleteClick(idx, data) {
        this.selectedData = data;
        // this.deleteDialog = true;
        this.deleteService.confirm(() => {
            let timeStamp = new Date();
            this.httpService.get('/bpd-proj/bpd/projectEstimation/delete?' + timeStamp.getTime() + '&projectEstimationCode=' + this.selectedData.projectEstimationCode)
                .subscribe(data => {
                    if ("1" == data.code) { //操作成功
                        this.messageService.showSuccess('Operation succeeded!');
                        this.growLife = 5000;
                    } else { //操作失败
                        this.messageService.showError('Operation failed!');
                        this.growLife = 5000;
                    }
                    //获取操作信息
                    this.msgs = this.messageService.msgs;
                    this.httpService.post('/bpd-proj/bpd/projectEstimation/getVList', {
                        "projectId": this.changeProjectCode,

                    })
                        .subscribe(data => {
                            this.baseData = this.dataManageService.addEmptyTableData(data, 10);
                        })
                })
        })
    }

    deleteYes() {
        let timeStamp = new Date();
        this.httpService.get('/bpd-proj/bpd/projectEstimation/delete?' + timeStamp.getTime() + '&projectEstimationCode=' + this.selectedData.projectEstimationCode)
            .subscribe(data => {
                if ("1" == data.code) { //操作成功
                    this.messageService.showSuccess('Operation succeeded!');
                    this.growLife = 5000;
                } else { //操作失败
                    this.messageService.showError('Operation failed!');
                    this.growLife = 5000;
                }
                //获取操作信息
                this.msgs = this.messageService.msgs;
                this.httpService.post('/bpd-proj/bpd/projectEstimation/getVList', {
                    "projectId": this.changeProjectCode,

                })
                    .subscribe(data => {
                        this.baseData = this.dataManageService.addEmptyTableData(data, 10);
                    })
            })
        this.deleteDialog = false;
    }

    deleteNo() {
        this.deleteDialog = false;
    }

    exportClick() {
        let timeStamp = new Date();
        let token = window.sessionStorage.getItem("access_token");
        let url: string = '/bpd-proj/bpd/projectEstimation/exportExcel?' + timeStamp.getTime() + '&projectId=' + this.changeProjectCode;
        if (token) {
            let realToken = token.substr(1, token.length - 2)
            url = url + "&accessToken=" + realToken;
        }
        window.location.href = url;
    }
}