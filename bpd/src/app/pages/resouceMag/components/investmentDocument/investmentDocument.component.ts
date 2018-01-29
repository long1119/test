import { Component, OnInit } from '@angular/core';
import 'style-loader!./investmentDocument.scss';
import { SelectItem, TreeNode, ConfirmationService } from 'primeng/primeng';
import { HttpDataService } from '../../../service/http.service';
import { MessageService } from '../../../service/message.service';
import { DataManageService } from '../../../service/dataManage.service';
import {
    RefreshMenuService
} from '../../../service/refreshMenu.service';

@Component({
  selector: 'investment-document',
  templateUrl: './investmentDocument.html',
  providers: [HttpDataService, MessageService, ConfirmationService, DataManageService, RefreshMenuService]
})
export class InvestmentDocument implements OnInit{

	  public gridStore: any = [];

    public gridStoreLen: number;

    public gridStoreRows: any = '15';

    public gridStoreFirst: any = 0;

    public gridStorePage: any = 0;

    public msgs: any;

    public growLife: number = 5000;

    public projectCodeSearch: string = "";

    public regionCategorySearch: string = "";

    public fileNameSearch: string = "";

    public tabIndex: number = 0;
 

	constructor(
    private service: HttpDataService, 
    private msgservice: MessageService,
    private confirmationService: ConfirmationService,
    private dataManageService: DataManageService,
    private refreshMenuService: RefreshMenuService
    ) {
        // 刷新菜单默认选中项
        let flag = this.dataManageService.getUuId()
        this.refreshMenuService.refreshMenu(flag);
	}
    
    ngOnInit() {
      let e = {
        page: 0, 
        first: 0, 
        rows: "15", 
        pageCount: 1
      }
      this.gridPaginate(e);
    }

    public handleChange(event) {
      this.tabIndex = event.index;
      this.projectCodeSearch = "";
      this.regionCategorySearch = "";
      this.fileNameSearch = "";
      let e = {
        page: 0, 
        first: 0, 
        rows: "15", 
        pageCount: 1
      }
      this.gridPaginate(e);
    }

    public gridPaginate(e) {
      this.service.post("/bpd-proj/bpd/invDoc/getInvDocList",{
        page: {
          page: Number(e.page) - (-1),
          rows: e.rows
        },
        sourceType: this.tabIndex ? "budgetProj" :"budgetRegion",
        projectCode: this.projectCodeSearch,
        regionCategoryName: this.regionCategorySearch,
        fileFullName: this.fileNameSearch
      })
      .subscribe(data1 => {
        this.gridStore = [];
        this.gridStoreLen = data1.total;
        this.gridStoreRows = e.rows;
        this.gridStoreFirst = Number(e.first);
        this.gridStorePage = e.page;
        let data = data1.rows
        if(data.length) {
          for(let i = 0; i < data.length; i++) {
            data[i].id = i + 1;
          }
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

    public searchEnterSearch($event) {
      if ($event.key === "Enter") {
        this.searchBtn();
      }
    }
    
    public searchBtn() {
      let e = {
        page: 0, 
        first: 0, 
        rows: "15", 
        pageCount: 1
      }
      this.gridPaginate(e);
    }

  // download file
  public fileClickBtn(item) {
    this.service.get("/bpd-proj/bpd/att/downloadFiles?attIds=" + item.attId)
    .subscribe(data => {
      if(data['code'] == 0) {
        this.msgservice.showInfo("Can Not Find File!");
        this.growLife = 300000;
        this.msgs = this.msgservice.msgs;
      } else {
        let token = window.sessionStorage.getItem("access_token");
        let url: string = "/bpd-proj/bpd/att/downloadFiles?attIds=" + item.attId + '&_=' + Number(new Date());
        if (token) {
          let realToken = token.substr(1, token.length - 2)
          url = url + "&accessToken=" + realToken;
        }
        window.location.href = url;
      }
    })
  }
};