import {Component,OnInit,Input,Output,EventEmitter} from '@angular/core';
import 'style-loader!./selectPicture.scss';
@Component({
    selector: "selectPicture",
    templateUrl: './selectPicture.html'
})
export class selectPictureComponent{
    basic1:boolean = true;
    basic2:boolean = false;
    shezhi:boolean = false;
    @Output() event = new EventEmitter();
    @Input() selectedValue:any;
    radio:boolean = true;
    ngOnInit(){
        console.log(this.selectedValue);
        if(this.selectedValue != 0){
            this.basic1 = false;
            this.basic2 = true;
            this.radio = false;
        }
    }
     //选择status
     newlife(){
        this.selectedValue = 0;
        this.radio = true;
    }
    transform(){
        if(this.radio){
            this.radio = false;
        }
        else{
            this.radio = true;
        };
    }
    gotoParent(){
        this.event.emit(this.selectedValue);
    }
    putOn(){
        console.log(this.selectedValue);
        this.basic1=false;
        this.basic2=true;
        this.event.emit(this.shezhi);
    }
}