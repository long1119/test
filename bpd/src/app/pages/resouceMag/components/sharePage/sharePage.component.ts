import { Component, OnInit } from '@angular/core';
import 'style-loader!./sharePage.scss';
import { SelectItem, TreeNode, ConfirmationService } from 'primeng/primeng';
import { HttpDataService } from '../../../service/http.service';
import { MessageService } from '../../../service/message.service';
import { DataManageService } from '../../../service/dataManage.service';
import {
    RefreshMenuService
} from '../../../service/refreshMenu.service';

@Component({
  selector: 'share-page',
  templateUrl: './sharePage.html',
  providers: [HttpDataService, MessageService, ConfirmationService, DataManageService, RefreshMenuService]
})
export class SharePage implements OnInit{

    public msgs: any;

    public shareFileStore: any = [];

    public shareFileNameSearch: string = "";

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
    	this.getShareFileGrid();
    }


  // share file download
  public shareFileClickBtn(item) {
    this.service.get("/bpd-proj/bpd/att/downloadFiles?attIds=" + item.attId)
    .subscribe(data => {
      if(data['code'] == 0) {
        this.msgservice.showInfo("Can not find file!");
        this.msgs = this.msgservice.msgs; 
      } else {
        let token = window.sessionStorage.getItem("access_token");
        let url: string = "/bpd-proj/bpd/att/downloadFiles?attIds=" + item.attId + "&_=" + Number(new Date());
        if (token) {
            let realToken = token.substr(1, token.length - 2)
            url = url + "&accessToken=" + realToken;
        }
        window.location.href = url;
      }
    }) 
  }  

  public shareFileEnterSearch($event) {
    if ($event.key === "Enter") {
      this.getShareFileGrid();
    }
  }

  // get share file grid

  public getShareFileGrid() {
    this.service.post('/bpd-proj/bpd/attShareUser/getVList', {
        userCode: window.localStorage.getItem("user"),
        fileFullName: this.shareFileNameSearch,
        sourceType: "doc"
    })
    .subscribe(data => {
        this.shareFileStore = [];
        if(data.length < 10) {
            for(let i = 0; i < 10; i++) {
                if(!data[i]) {
                    this.shareFileStore.push({
                        "ip": i+1
                    })
                } else {
                    data[i].id = i + 1;
                    this.shareFileStore.push(data[i])
                }
            }
        } else {
            for(let i = 0; i < data.length; i++) {
                data[i].id = i + 1;
                this.shareFileStore.push(data[i]);
            }
        }
    })
  }
};