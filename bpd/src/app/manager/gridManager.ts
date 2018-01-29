import { Http,Headers,RequestOptions } from '@angular/http';
/**
 * 通用表格管理 GridManager
 * @author ganyimeng
 */
export class GridManager{

  http:Http;

  urlMapping:{
    batchUpdateUrl:string,        //批量处理
    listUrl:string,               //获取全部的list
    pageUrl:string                //分页获取表格数据
  }

  editPermission:boolean = true;  //是否能够编辑表格
  originRows:any;                 //初始的rows
  dataRows:any = [];                   //用来构建表格的rows
  selectedRow:any;                //选择的单行
  selectedRows:any;               //选择的多行

  opStatus = {           //操作类型
    update:{ 'color':'orange', 'label':'更新'},
    create:{ 'color':'green',  'label':'创建'},
    delete:{ 'color':'red',    'label':'删除'}
  };

  /**
   * 构造函数
   * @param http
   * @param urlMapping
   */
  constructor(http: Http, urlMapping:any){
    this.http = http;
    this.urlMapping = urlMapping;
  }

  /***
   * 添加一行
   */
  add():void{
    this.dataRows.push({
      'rownum':this.dataRows.length+1,
      'op':'create'
    });
  }

  cbclick(row,field){
    row[field] = (row[field]=='0' || row[field]==null )?'1':'0';
    this.change(row)
  }

  change(row):void{
    let index:number  = this.dataRows.indexOf(row);                            //编辑的是第几行
    if(index <  this.originRows.length){
      let originRow = this.originRows.filter((val,i) => i==index)[0];          //获取数据行对应的原始行
      for(let prop in originRow){                                              //遍历原始行里面的属性，对比是否改变。
        if(originRow[prop]!=row[prop]){
          row['op'] = 'update';
          break;
        }
        row['op'] = '';
      }
    }
  }


  delete():void{
    if(!!this.selectedRow.id){
      this.selectedRow.op = 'delete';
    }else{
      let index:number  = this.dataRows.indexOf(this.selectedRow);
      this.dataRows = this.dataRows.filter((val,i) => i!=index);
    }
  }


  /**
   * 通用方法
   * 批量更新表格数据「create、update、delete」
   * @param rows
   * @param url
   * @param successFunc
   * @param errorFunc
   */
  batchUpdate(successFunc:((suc) => void),errorFunc:((eor)=> void)):void { //
    let body = JSON.stringify(this.dataRows);
    let headers = new Headers({'Content-Type':'application/json'});
    let options = new RequestOptions({headers:headers});
    this.http.post(this.urlMapping.batchUpdateUrl,body).subscribe(success=>{
      this.loadData(success=>{})
      successFunc && successFunc(success);
    },error=>{
      //errorFunc && errorFunc(error);
    });
  }


  /**
   * 通用方法
   * 获取表格数据
   * @param url
   * @param successFunc
   * @param errorFunc
   */
  loadData(successFunc?:((suc) => void),errorFunc?:((eor)=> void)): void {
    this.http.get(this.urlMapping.listUrl)
      .subscribe(success => {
        this.dataRows = success.json();
        this.originRows = success.json();
        for(let index in this.dataRows){
          this.dataRows[index]['op']='';
          this.dataRows[index]['rownum']=index+1;
        }
        successFunc && successFunc(success);
      }, error => {
        //errorFunc && errorFunc(error);
      });
  }
}
