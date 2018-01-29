import {Component,OnInit} from '@angular/core';
import {Validators,FormControl,FormGroup,FormBuilder} from '@angular/forms';
import {Message,SelectItem} from 'primeng/primeng';
import {LocalStorage} from './local.storage';
import { HttpDataService } from '../../service/http.service';
import { MessageService } from '../../service/message.service';
import { DataManageService } from '../../service/dataManage.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: "work-portal",
    templateUrl: './workPortal.html',
    providers: [DataManageService]
})
export class WorkPortal {

    public msgs: any;

    // msgs: Message[] = [];

    // userform: FormGroup;

    // submitted: boolean;

    // genders: SelectItem[];

    // description: string;

    // constructor(private fb: FormBuilder) {}

    // ngOnInit() {
    //     this.userform = this.fb.group({
    //         'firstname': new FormControl('', Validators.required),
    //         'lastname': new FormControl('', Validators.required),
    //         'password': new FormControl('', Validators.compose([Validators.required, Validators.minLength(6)])),
    //         'description': new FormControl(''),
    //         'gender': new FormControl('', Validators.required)
    //     });

    //     this.genders = [];
    //     this.genders.push({label:'Select Gender', value:''});
    //     this.genders.push({label:'Male', value:'Male'});
    //     this.genders.push({label:'Female', value:'Female'});
    // }

    // onSubmit(value: string) {
    //     this.submitted = true;
    //     this.msgs = [];
    //     this.msgs.push({severity:'info', summary:'Success', detail:'Form Submitted'});
    // }
    url:any;
    users:any[];
    selectedUser:any;
    cache:any;
    programs:any;
    selectedProgram:any;
    // searchUser:any;
    public searchUser: boolean = false;
    
    public dialogDepartment: string = null;

    public dialogUserName: string = null;

    public managerData: any = [];

    public managerDataRows: any = '10';

    public managerDataFirst: any = 0;

        public managerDataLen: number;
        InvestmentUser:any;
    constructor(private ls: LocalStorage,private service: HttpDataService,private msgservice: MessageService,private route: ActivatedRoute,private router: Router, private dataManageService: DataManageService){
    } 
    get(): void {
        // 读取LocalStorage
        this.cache = this.ls.getObject("logincache") ; 
    }
    set(): void { 
        // 写入LocalStorage
        this.ls.setObject("logincache",this.cache) ;
    }
    ngOnInit(){
        this.programs = [
            {label:'投资项目管理', value:2},
            {label:'整车项目管理', value:1}
        ];
        this.selectedProgram = this.programs[0].value;
        // this.url = "/pages/investment-portal";
        
    };
    selectedUrl(){
        if(this.selectedProgram == 1){
            let token = window.sessionStorage.getItem("access_token");
            let url: string = "/#/pages/program-portal" + '?&_=' + Number(new Date());
            if (token) {
                let realToken = token.substr(1, token.length - 2)
                url = url + "&accessToken=" + realToken;
            }
            window.location.href = url;
        }
        else{
            let token = window.sessionStorage.getItem("access_token");
            let url: string = "/#/pages/investment-portal" + '?&_=' + Number(new Date());
            if (token) {
                let realToken = token.substr(1, token.length - 2)
                url = url + "&accessToken=" + realToken;
            }
            window.location.href = url;
        }
    }

    gotoEnterLogIn($event) {
        if ($event.key === "Enter") {
            this.goto();
        }
    }

    goto(){
        if(this.InvestmentUser) {
            this.service.get('/bpd-proj/bpd/initUser?userCode=' + this.InvestmentUser + '&' + Number(new Date()))
            .subscribe(data => {
                if(data.userCode) {
                    this.ls.set('userInformation', JSON.stringify(data));
                    this.ls.set('userName',data.userName);
                    this.ls.set('user',data.userCode);
                    this.ls.set('isEnglish',"1");
                    this.getmenuSignList();
                } else {
                    this.msgservice.showInfo("User Unvilable");
                    this.msgs = this.msgservice.msgs;
                    alert("User Unvilable");
                    return;
                }
            })
        }
    }

    public getmenuSignList() {
        this.service.get('/bpd-proj/bpd/menuPermission/getMenuSignList?userCode=' + this.InvestmentUser + '&' + Number(new Date()))
        .subscribe(data => {
            this.ls.set('authorityData', JSON.stringify(data));
            this.getMenuTree();
        })
    }

    public getMenuTree() {
        // this.service.get("data/menu.json")
        this.service.get("/bpd-proj/bpd/menu/getPermMenuTree?" + Number(new Date()) + "&userCode=" + this.InvestmentUser)
        .subscribe(success =>{
            if(success.length) {
                let menusTwo = [];
                let menusOne = [];
                for (let i  = 0; i < success.length; i++) {
                    if (i < 7) {
                        menusOne.push(success[i]);
                    }
                    if (success.length > 7 && i >= success.length - 7) {
                        menusTwo.push(success[i]);
                    }
                }
                window.localStorage.setItem("menus", JSON.stringify(success));
                window.localStorage.setItem("menusTwo",JSON.stringify(menusTwo));
                window.localStorage.setItem("menusOne",JSON.stringify(menusOne));
                // QA
                window.location.href = "#/pages/" + JSON.parse(window.localStorage.getItem("menusOne"))[0].routerLink;
                // 开发
                // window.location.href = "/bpd-proj/index.html#/pages/" + JSON.parse(window.localStorage.getItem("menusOne"))[0].routerLink;
                window.location.reload();
            } else {
                alert("No Menu Tree");
                return;
            }
        });
    }

    public getUser() {
		this.searchUser = true;
		this.service.post("/bpd-proj/bpd/user/getVList", {
			"page": {
                "page": 1,
                "rows": 10
            },
            "departmentName" : this.dialogDepartment,
			"userName": this.dialogUserName
		})
        .subscribe(data1 => {
        	let data = data1.rows;
        	this.managerDataLen = data1.total;
            for(let i = 0; i < data.length; i++) {
        		data[i].id = i + 1;
        	}
        	for(let i = 0; i < 10; i++) {
        		if(!data[i]) {
        			this.managerData.push({
        				'ip': i
        			})
        		} else {
        			this.managerData.push(data[i])
        		}
        	}
        })
	}

    public managerPaginate(e) {
		this.service.post("/bpd-proj/bpd/user/getVList",{
    		"page": {
                "page": e.page + 1,
                "rows": e.rows
            },
            "departmentName" : this.dialogDepartment,
			"userName": this.dialogUserName
    	})
    	.subscribe(data1 => {
    		let data = data1.rows;
			this.managerDataLen = data1.total;
            this.managerDataRows = e.rows;
            this.managerDataFirst = e.first;
			this.managerData = [];
			for(let i = 0; i < data.length; i++) {
	            data[i].id = i + 1;
	        }
	        for(let i = 0; i < e.rows; i++) {
	            if(!data[i]) {
	                this.managerData.push({
	                    "ip": i+1
	                })
	            } else {
	                this.managerData.push(data[i])
	            }
	        }
    	})
    }
    
    public lookClickEnterSearch($event) {
        if ($event.key === "Enter") {
            this.lookClick();
        }
    }

    public lookClick() {
		let e = {page: 0, first: 0, rows: "10"};
        this.managerPaginate(e);
	}
    public dbclick(e) {
		this.InvestmentUser = e.data.userName;
		this.selectedUser = e.data.userCode;
		this.searchUser = false;
	}

}
