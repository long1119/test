import { Component, OnInit } from '@angular/core';
import 'style-loader!./kanbanConfig.scss';
import { SelectItem, ConfirmationService } from 'primeng/primeng';
import { HttpDataService } from '../../service/http.service';
import { MessageService } from '../../service/message.service';

@Component({
  selector: 'kanban-config',
  templateUrl: './kanbanConfig.html',
  providers: [HttpDataService, MessageService, ConfirmationService]
})
export class KanbanConfig implements OnInit{

	public gridStore: any = [];

    public gridStoreLen: number;

    public gridStorePage: any = 0;

    public gridStoreRows: any = '10';

    public gridStoreFirst: any = 0;

    public selectedStore: any = {};

    public msgs: any;

    public projectNameSearch: string = "";

    public addBtnShow: boolean = true;

	constructor(private service: HttpDataService, private confirmationService: ConfirmationService, private msgservice: MessageService) {

	}
    
    ngOnInit() {
    	let e = {page: 0, first: 0, rows: "10"};
        this.paginate(e);
    }

    public paginate(e) {
        let observable = this.service.post("/bpd-proj/bpd/vehicleProject/getKanBanList", {
            "page": {
                "page": e.page + 1,
                "rows": e.rows
            },
            "programCode1": this.programCodeSearch,
            "projectName": this.projectNameSearch
        })
        .subscribe(data1 => {
            let data = data1.rows;
            this.gridStoreLen = data1.total;
            this.gridStoreRows = e.rows;
            this.gridStoreFirst = e.first;
            this.gridStorePage = e.page;
            this.gridStore = [];
            if(data.length) {
               this.selectedStore = data[0];
               this.service.post("/bpd-proj/bpd/vehicleProject/getKanbanInvert",{
                   programId: this.selectedStore.programId
               })
               .subscribe(data => {
                   if(data) {
                       if(this.selectedStore.parentFlag == 1) {
                           this.addBtnShow = true;
                       } else {
                           this.addBtnShow = false;
                       }
                   } else {
                       this.addBtnShow = true;
                   }
               })
               let event = {page: 0, first: 0, rows: "10"};
               this.sonPaginate(event);
            }
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

    public sonGridStore: any = [];
    public sonGridStoreLen: number;
    public sonGridStoreRows: any = '10';
    public sonGridStoreFirst: any = 0;

    public gridRowClick(e) {
        this.selectedStore = e.data;
        this.service.post("/bpd-proj/bpd/vehicleProject/getKanbanInvert",{
           programId: this.selectedStore.programId
        })
        .subscribe(data => {
           if(data) {
               if(this.selectedStore.parentFlag == 1) {
                   this.addBtnShow = true;
               } else {
                   this.addBtnShow = false;
               }
           } else {
               this.addBtnShow = true;
           }
        })
        if(e.data.id) {
           let event = {page: 0, first: 0, rows: "10"};
            this.sonPaginate(event); 
        } else {
            this.sonGridStore = [];
        }
    }

    public sonPaginate(e) {
        let observable = this.service.post("/bpd-proj/bpd/vehicleProject/getVList", {
            "page": {
                "page": e.page + 1,
                "rows": e.rows
            },
            "priorProjectCode": this.selectedStore.adProjectCode
        })
        .subscribe(data1 => {
            let data = data1.rows;
            this.sonGridStoreLen = data1.total;
            this.sonGridStoreRows = e.rows;
            this.sonGridStoreFirst = e.first;
            this.sonGridStore = [];
            for(let i = 0; i < data.length; i++) {
                data[i].id = i + 1;
            }
            for(let i = 0; i < e.rows; i++) {
                if(!data[i]) {
                    this.sonGridStore.push({
                        'ip': i
                    })
                } else {
                    this.sonGridStore.push(data[i])
                }
            }
        });
    }

    public display: boolean = false;
    public isSave: boolean = true;
    public projectNameStore: any = [];
    public projectNameValue: string = "";
    public engineValueStore: any = [];
    public engineValue: string = "";
    public decription: string = "";
    public programCodeValue: string = "";
    public categoryValue: string = "";
    public classificationValue: string = "";
    public selectedSonStore: any = {};
    public addBtn() {
        this.service.post("/bpd-proj/bpd/vehicleProject/getKanBanList",{
            "page": {
                "page": 1,
                "rows": 100000
            },
            "kanBanFlag": "1",
            "programCode": this.selectedStore.programCode,
            "adProjectCode": this.selectedStore.adProjectCode,
        })
        .subscribe(data1 => {
            let data = data1.rows;
            this.projectNameStore = [];
            for(let i=0; i<data.length; i++) {
                if(data[i].adProjectCode != this.selectedStore.priorProjectCode) {
                    this.projectNameStore.push({
                        label: data[i].projectName,
                        value: data[i].projectName
                    })
                }
            }
            if(data.length && this.projectNameStore.length) {
                this.selectedSonStore = data[0];
                this.projectNameValue = this.projectNameStore[0].value;
                this.programCodeValue = data[0].programCode;
                this.categoryValue = data[0].categoryName;
                this.classificationValue = data[0].levelName;
                this.service.post("/bpd-proj/bpd/ptLineup/getList",{
                    "page": {
                        "page": 1,
                        "rows": 100000
                    },
                    "adProjectCode": data[0].adProjectCode
                })
                .subscribe(data1 => {
                    let data = data1.rows;
                    this.engineValueStore = [];
                    for(let i=0; i<data.length; i++) {
                        this.engineValueStore.push({
                            label: data[i].engine,
                            value: data[i].engine
                        })
                    }
                    this.engineValue = data.length ? this.engineValueStore[0].value : null;
                })
            } else {
                this.selectedSonStore = {};
                this.projectNameValue = null;
                this.programCodeValue = null;
                this.categoryValue = null;
                this.classificationValue = null;
                this.engineValue = null;
                this.engineValueStore = [];
            }
        })
        this.decription = "";
        this.display = true;
        this.isSave = true;
    }

    public selectionChange(e) {
        let observable = this.service.post("/bpd-proj/bpd/vehicleProject/getKanBanList", {
            "page": {
                "page": 1,
                "rows": 10000
            }
        })
        .subscribe(data1 => {
            let data = data1.rows;
            let mainGrid = data;

            let arr = mainGrid.filter(function(item){
                return item.projectName === e.value;
            });
            this.selectedSonStore = arr[0];
            this.programCodeValue = arr[0].programCode;
            this.categoryValue = arr[0].categoryName;
            this.classificationValue = arr[0].levelName;
            this.service.post("/bpd-proj/bpd/ptLineup/getList",{
                "page": {
                    "page": 1,
                    "rows": 100000
                },
                "adProjectCode": arr[0].adProjectCode
            })
            .subscribe(data1 => {
                let data = data1.rows;
                this.engineValueStore = [];
                for(let i=0; i<data.length; i++) {
                    this.engineValueStore.push({
                        label: data[i].engine,
                        value: data[i].engine
                    })
                }
                this.engineValue = data.length ? this.engineValueStore[0].value : null;
            })
        });
    }

    public editBtn(item) {
        this.selectedSonStore = item;
        this.projectNameValue = item.projectName;
        this.programCodeValue = item.programCode;
        this.categoryValue = item.categoryName;
        this.classificationValue = item.levelName;
        this.service.post("/bpd-proj/bpd/ptLineup/getList",{
            "page": {
                "page": 1,
                "rows": 100000
            },
            "adProjectCode": item.adProjectCode
        })
        .subscribe(data1 => {
            let data = data1.rows;
            this.engineValueStore = [];
            for(let i=0; i<data.length; i++) {
                this.engineValueStore.push({
                    label: data[i].engine,
                    value: data[i].engine
                })
            }
            this.engineValue = item.engine ? item.engine : (data.length ? data[0].engine : null);
        })
        this.decription = item.descripition;
        this.display = true;
        this.isSave = false;
    }

    public addSaveBtn() {
        this.service.post("/bpd-proj/bpd/vehicleProject/updateEasy",{
            adProjectCode: this.selectedSonStore.adProjectCode,
            priorProjectCode: this.selectedStore.adProjectCode,
            descripition: this.decription,
            engine: this.engineValue
        })
        .subscribe(data => {
            if(data['code'] == 1) {
                this.msgservice.showSuccess("Success");
                this.msgs = this.msgservice.msgs;
                let event = {page: 0, first: 0, rows: "10"};
                this.sonPaginate(event);
                let e = {
                    page: this.gridStorePage, 
                    first: this.gridStoreFirst, 
                    rows: this.gridStoreRows,
                    pageCount: Math.ceil(this.gridStoreLen/this.gridStoreRows)
                }
                this.paginate(e);
                this.display = false;
            } else if(data['code'] == 2){
                this.msgservice.showInfo("Operation Error!");
                this.msgs = this.msgservice.msgs;
            } else {
                this.msgservice.showError("Operation Error!");
                this.msgs = this.msgservice.msgs;
            }
        })
    }

    public editSaveBtn() {
        console.log('edit')
    }

    public programCodeSearch: string = "";

    public enterSearch($event) { //回车模糊查询
        if ($event.key === "Enter") {
            this.lookUpBtn();
        }
    }

    public lookUpBtn() {    // 第二步模糊查询
        let e = {
            page: 0, 
            first: 0, 
            rows: "10"
        }
        this.paginate(e);
    }

    public delBtn(item) {
        this.confirmationService.confirm({
          message: 'Do You Want To Delete This Record?',
          header: 'Delete Confirmation',
          icon: 'fa fa-trash',
          accept: () => {
            this.service.post("/bpd-proj/bpd/vehicleProject/updateEasy",{
                adProjectCode: item.adProjectCode,
                priorProjectCode: "0",
                engine: "",
                descripition: ""
            })
            .subscribe(data => {
                if(data['code'] == 1) {
                    this.msgservice.showSuccess("Success");
                    this.msgs = this.msgservice.msgs;
                    let event = {page: 0, first: 0, rows: "10"};
                    this.sonPaginate(event);
                    let e = {
                        page: this.gridStorePage, 
                        first: this.gridStoreFirst, 
                        rows: this.gridStoreRows,
                        pageCount: Math.ceil(this.gridStoreLen/this.gridStoreRows)
                    }
                    this.paginate(e);
                } else if(data['code'] == 2){
                    this.msgservice.showInfo("Operation Error!");
                    this.msgs = this.msgservice.msgs;
                } else {
                    this.msgservice.showError("Operation Error!");
                    this.msgs = this.msgservice.msgs;
                }
            })
          }
        });
    }
};