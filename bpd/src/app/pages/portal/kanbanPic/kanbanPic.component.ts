import { Component, OnInit } from '@angular/core';
import 'style-loader!./kanbanPic.scss';
import { SelectItem } from 'primeng/primeng';
import { HttpDataService } from '../../service/http.service';
import { MessageService } from '../../service/message.service';

@Component({
  selector: 'kanban-pic',
  templateUrl: './kanbanPic.html',
  providers: [HttpDataService, MessageService]
})
export class KanbanPic implements OnInit{

	public gridStore: any = [];

	public thisYear: number = new Date().getFullYear();

	public showHeader: boolean = false;


	constructor(private service: HttpDataService, private msgservice: MessageService) {

	}
    
    ngOnInit() {
    	this.service.post("/bpd-proj/bpd/vehicleProject/getKanBanPlanDateList",{})
    	.subscribe(data => {
    		let newData: any = [];
    		for(let i=0; i<data.length; i++) {
    			if(data[i].keyMilestone.length) {
    				newData.push(data[i])
    			}
    		}
    		for(let i=0; i<newData.length; i++) {
    			for(let j=0; j<newData[i].keyMilestone.length; j++) {
    				newData[i].keyMilestone[j].realTimeMs = new Date(newData[i].keyMilestone[j].realTime).getTime();
    			}
    			newData[i].keyMilestone.sort(this.compare('realTimeMs'))
    		}
    		this.gridStore = newData;
    		for(let i=0; i<this.gridStore.length; i++) {
	    		if(this.gridStore[i].brandName == "Chevrolet") {
	    			this.gridStore[i].brandUrl = "assets/img/xuefulan.jpg";
	    		} else if(this.gridStore[i].brandName == "Buick") {
					this.gridStore[i].brandUrl = "assets/img/bieke.jpg";
	    		} else {
	    			this.gridStore[i].brandUrl = "assets/img/kaidilake.jpg";
	    		}
	    		for(let j=0; j<this.gridStore[i].keyMilestone.length; j++) {
	    			let number = this.gridStore[i].keyMilestone[j].time.split("-");
			    	let X = (number[0]-this.thisYear)*800 + (number[1]-1)*200 + (number[2]-1)*50;
			    	let AFI = document.createElement("div");
			    	let AFIDIV = document.createElement("div");
			    	let AFITime = document.createElement("div");
			    	let AFIEngine = document.createElement("div");
			    	let AFISPAN = document.createElement("span");
			    	AFI.className = "AFI";
			    	AFIDIV.className = "AFIDIV";
			    	AFISPAN.className = "AFISPAN";
			    	AFITime.className = "AFITime";
			    	AFIEngine.className = "AFIEngine";
			    	AFI.appendChild(AFISPAN);
			    	AFI.appendChild(AFIDIV);
			    	AFI.appendChild(AFITime);
			    	AFI.appendChild(AFIEngine);
			    	AFI.style.backgroundColor = this.gridStore[i].keyMilestone[j].color;
			    	if(!!window["ActiveXObject"] || "ActiveXObject" in window) {
			    		AFI.style.top = (90 + i*70) + "px";
			    	} else {
			    		AFI.style.top = (90 + i*70) + "px";
			    	}
			    	AFI.style.left = (415 + X) + "px";
			    	AFIDIV.style.backgroundColor = this.gridStore[i].keyMilestone[j].color;
			    	AFISPAN.innerHTML = this.gridStore[i].keyMilestone[j].name;
			    	AFITime.innerHTML = this.transformDate(this.gridStore[i].keyMilestone[j].realTime) ? this.transformDate(this.gridStore[i].keyMilestone[j].realTime) : "";
			    	AFIEngine.innerText = this.gridStore[i].keyMilestone[j].engine ? this.gridStore[i].keyMilestone[j].engine : "";
			    	if(AFIEngine.innerText.length > 10) {
			    		AFIEngine.style.webkitTransform = 'scale(0.7)';
			    		AFIEngine.style.lineHeight = '12px';
			    	} else {
			    		AFIEngine.style.webkitTransform = 'scale(0.9)';
			    		AFIEngine.style.top = "30px";
			    	}
			    	document.getElementById("girdDiv").appendChild(AFI);
	    		}
	    		if(this.gridStore[i].keyMilestone.length == 0) {
	    			continue;
	    		}
	    		let LINE = document.createElement("div");
	    		let LINETIME = this.gridStore[i].keyMilestone[0].time.split("-");
	    		let LINELEFT = (LINETIME[0]-this.thisYear)*800 + (LINETIME[1]-1)*200 + (LINETIME[2]-1)*50;
	    		let LINELAST = this.gridStore[i].keyMilestone[this.gridStore[i].keyMilestone.length-1].time.split("-");
	    		let LINEWIDTH = (LINELAST[0]-this.thisYear)*800 + (LINELAST[1]-1)*200 + (LINELAST[2]-1)*50;
	    		LINE.className = "line";
	    		if(!!window["ActiveXObject"] || "ActiveXObject" in window) {
		    		LINE.style.top = (101 + i*70) + "px";
		    	} else {
		    		LINE.style.top = (101 + i*70) + "px";
		    	}
		    	LINE.style.left = (415 + LINELEFT) + "px";
		    	LINE.style.width = (LINEWIDTH - LINELEFT) + "px";
		    	document.getElementById("girdDiv").appendChild(LINE);
		    }
	    	let that = this;
			document.getElementById("girdDiv").addEventListener('scroll',function(){
				if(document.getElementById("girdDiv").scrollTop >= 0.0001) {
					that.showHeader = true;
				} else {
					that.showHeader = false;
				}
			},false);
			document.getElementById("girdDiv").addEventListener('scroll',function(){
				if(that.showHeader) {
					if(document.getElementById("girdDiv").scrollLeft >= 0.0001) {
						document.getElementById("mainHeader").style.marginLeft = -(document.getElementById("girdDiv").scrollLeft) + "px";
					} else {
						document.getElementById("mainHeader").style.marginLeft = "0px";
					}
				}
			},false);
	    
		})
    }

    public compare(property){
	    return function(a,b){
	        var value1 = a[property];
	        var value2 = b[property];
	        return value1 - value2;
	    }
	}

	public transformDate(value) {
		if(!value) {
			return;
		}
		let ENameArr = ["Jan","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep.","Oct.","Nov.","Dec."];
		let str: string = "";
		let month = Number(value.split("-")[1]);
		let day = Number(value.split("-")[2]) >= 10 ? Number(value.split("-")[2]).toString() : '0'+Number(value.split("-")[2]).toString();
		str = ENameArr[month] + " " + day;
		return str;
	}

	public download() {
		let token = window.sessionStorage.getItem("access_token");
        let url: string = "/bpd-proj/bpd/vehicleProject/exportExcel2018?" + Number(new Date());
        if (token) {
            let realToken = token.substr(1, token.length - 2)
            url = url + "&accessToken=" + realToken;
        }
        window.location.href = url;
	}
};