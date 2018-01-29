import { Component, OnInit } from '@angular/core';
import 'style-loader!./analysisReport.scss';
import { SelectItem, TreeNode, MenuItem } from 'primeng/primeng';
import { HttpDataService } from '../../../service/http.service';
import { MessageService } from '../../../service/message.service';

@Component({
  selector: 'analysis-report',
  templateUrl: './analysisReport.html',
  providers: [HttpDataService, MessageService]
})
export class AnalysisReport implements OnInit{

   public msgs: any;

   public growLife: number = 5000;

   public emptyStore: any = [{id:'-'},{id:'-'},{id:'-'},{id:'-'},{id:'-'},{id:'-'},{id:'-'},{id:'-'},{id:'-'},{id:'-'}];

   public haveData: boolean = false;

   public display: boolean = false;

   public groupValueStore: any = [{label:'Select',value:null},{label:'Customer',value:'Customer'},{label:'Finance',value:'Finance'}];

   public groupValue: string = null;

   public metrixStore: any = [{id:1},{id:1},{id:1},{id:1},{id:1},{id:1},{id:1},{id:1},{id:1},{id:1},{id:1},{id:1}];

   public metrixSelectedStore: any = [];

   public allowConfirm: boolean = false;

   public v1Store: any = [];

   public v1: string = null;

   public v2Store: any = [];

   public v2: string = null;

   public v: any = [{label:'第一次会议',value:1},{label:'第二次会议',value:2},{label:'第三次会议',value:3},{label:'第四次会议',value:4}]

	constructor(private service: HttpDataService, private msgservice: MessageService) {
	}
    
  ngOnInit() {
    console.log(this.v)
  }

  public SelectProgramBtn() {
    this.display = true;
    this.service.post("/bpd-proj/bpd/scordcardMetrix/getVList",{})
    .subscribe(data => {
      if(data.length < 10) {
        let _length = 10 - data.length;
        for(let i=0; i<data.length; i++) {
          data[i].id = i+1;
        }
        for(let i=0; i<_length; i++) {
          data.push({
            ip: i
          })
        }
        this.metrixStore = data;
      } else {
        for(let i=0; i<data.length; i++) {
          data[i].id = i+1;
        }
        this.metrixStore = data;
      }
    })
    this.service.post("/bpd-proj/bpd/boardScorecard/getAnalysisCombobox",{})
    .subscribe(data => {
      if(data.length < 2) {
        this.allowConfirm = false;
        return;
      }
      this.v = data;
      this.v1Store = [];
      this.v2Store = [];
      let arr = [];
      for(let i=0; i<this.v.length; i++) {
        arr.push(this.v[i].value);
        this.v1Store.push(this.v[i]);
        this.v2Store.push(this.v[i]);
      }
      this.v1 = this.v1Store[0].value;
      this.v2Store.splice(0,1);
      this.v1Store.splice(1,1);
      this.v2 = this.v2Store[0].value;
      this.allowConfirm = true;
    })
  }

  public groupValueChange(e) {
    this.service.post("/bpd-proj/bpd/scordcardMetrix/getVList",{
      metricGroup: e.value
    })
    .subscribe(data => {
      if(data.length < 10) {
        let _length = 10 - data.length;
        for(let i=0; i<data.length; i++) {
          data[i].id = i+1;
        }
        for(let i=0; i<_length; i++) {
          data.push({
            ip: i
          })
        }
        this.metrixStore = data;
      } else {
        for(let i=0; i<data.length; i++) {
          data[i].id = i+1;
        }
        this.metrixStore = data;
      }
    })
  }

  public v1Change(e) {
    this.v2Store = [];
    let arr = [];
    for(let i=0; i<this.v.length; i++) {
      arr.push(this.v[i].value);
      this.v2Store.push(this.v[i]);
    }
    this.v2Store.splice(arr.indexOf(e.value),1);
    if(this.v2 == e.value) {
      this.v2 = this.v2Store[0].value;
    }
  }

  public v2Change(e) {
    this.v1Store = [];
    let arr = [];
    for(let i=0; i<this.v.length; i++) {
      arr.push(this.v[i].value);
      this.v1Store.push(this.v[i]);
    }
    this.v1Store.splice(arr.indexOf(e.value),1);
    if(this.v1 == e.value) {
      this.v1 = this.v1Store[0].value;
    }
  }

  public title1Store: any = [];

  public title2Store: any = [];

  public contentStore: any = [];

  public contentValueStore: any = [];

  public saveBtn() {
    this.display = false;
    this.haveData = true;
    let indexIds:any = [];
    for(let i=0; i<this.metrixSelectedStore.length; i++) {
      indexIds.push(this.metrixSelectedStore[i].indexId)
    }
    this.service.get("/bpd-proj/bpd/boardScorecard/getAnalysisFragaryInfo?indexIds="+indexIds.join(",")+"&version1="+this.v1+"&version2="+this.v2)
    .subscribe(data => {
      this.title1Store = data['Table level one'];
      this.title2Store = data['Table level two'];
      this.service.get("/bpd-proj/bpd/boardScorecard/getAnalysisReport?version1="+this.v1+"&version2="+this.v2+"&indexIds="+indexIds.join(",")+"&"+Number(new Date()))
      .subscribe(data => {
        this.contentStore = data;
        let arr = [];
        for(let i=0; i<this.title1Store.length; i++) {
          for(let j=0; j<5; j++) {
            arr.push(this.title1Store[i] + this.title2Store[j])
          }
        }
        arr.unshift('Program');
        this.contentValueStore = arr;
      })
    })
  }

  public cancelBtn() {
    this.display = false;
  }

  public exportProgramBtn() {
    let indexIds:any = [];
    for(let i=0; i<this.metrixSelectedStore.length; i++) {
      indexIds.push(this.metrixSelectedStore[i].indexId)
    }
    let token = window.sessionStorage.getItem("access_token");
    let url: string = "/bpd-proj/bpd/boardScorecard/exportExcel?version1="+this.v1+"&version2="+this.v2+"&indexIds="+indexIds.join(",") + "&_=" + Number(new Date());
    if (token) {
        let realToken = token.substr(1, token.length - 2)
        url = url + "&accessToken=" + realToken;
    }
    window.location.href = url;
  }
};