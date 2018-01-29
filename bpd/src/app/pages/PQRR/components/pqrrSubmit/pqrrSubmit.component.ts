import { Component, OnInit } from '@angular/core';
import 'style-loader!./pqrrSubmit.scss';
import { SelectItem, TreeNode, MenuItem } from 'primeng/primeng';
import { HttpDataService } from '../../../service/http.service';
import { MessageService } from '../../../service/message.service';

@Component({
  selector: 'pqrr-submit',
  templateUrl: './pqrrSubmit.html',
  providers: [HttpDataService, MessageService]
})
export class PqrrSubmit implements OnInit{

    public msgs: any;

    public growLife: number = 5000;

    public gridStore: any = [{'id':1,'programCode':'edf31223','elementName':'fdsfff','deptName':'rrrr','roleName':'里斯','status':'upload'}];

    public gridStoreLen: number;

    public gridStoreRows: any = '10';

    public gridStoreFirst: any = 0;

    public programCodeSerchStore: any = [];

    public programCodeSerch: string = null;

    public PQRRSerchStore: any = [];

    public PQRRSerch: string = null;

    public display: boolean = false;

    public titleStr: string = '';

    public deliverableStore: any = [{'id':1,'elementId':'100234','deliverableName':'Develop Program Contract','deptName':'PE','status':'green'}];

    public statusDropdownStore: any = [{'label':'绿色','value':'green'},{'label':'黄色','value':'yellow'},{'label':'红色','value':'red'}];

    public downUploadStore: any = [{'tplName':'PQRR Deliverable .ppt','deliverName':'SGM201 CSO PQRR Deliverable-VLE.ppt'}]

	constructor(private service: HttpDataService, private msgservice: MessageService) {
	}
    
    ngOnInit() {
        this.service.post("/bpd-proj/",{
            "page": {
                "page": 1,
                "rows": 10
            }
        })
        .subscribe(data1 => {
            this.getMainAjax(data1);
        })
    }

    public getMainAjax(data1) {
        let data = data1.rows;
        this.gridStoreLen = data1.total;
        this.gridStore = [];
        for(let i = 0; i < 10; i++) {
            if(!data[i]) {
                this.gridStore.push({
                    "ip": i
                })
            } else {
                this.gridStore.push(data[i])
            }
        }
    }

    public paginate(e) {    // 分页
        this.service.post("/bpd-proj/",{
            "page": {
                "page": e.page + 1,
                "rows": e.rows
            }
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
                        "ip": i+1
                    })
                } else {
                    this.gridStore.push(data[i])
                }
            }
        })
    }

    public LookUpBtn() {    //  模糊查询

    }

    public editBtn(item) {
        this.titleStr = item.elementName;
        // this.deliverableStore
        this.statusDropdownStore = [
            {
                'label':'绿色','value':'green'
            },
            {
                'label':'黄色','value':'yellow'
            },
            {
                'label':'红色','value':'red'
            }
        ]
        this.display = true;
    }

    public dialogSaveBtn() {   //  保存
        this.display = false;
    }

    public dialogCancelBtn() {   //   取消
        this.display = false;
    }

    public downloadBtn(item) {    // 模版下载

    }

    public uploadBtn(item) {
        
    }

};