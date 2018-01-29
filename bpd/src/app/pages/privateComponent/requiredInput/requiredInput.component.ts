import {Component,Input,Output,OnInit,EventEmitter} from '@angular/core';
import 'style-loader!./requiredInput.scss';


@Component({
    selector: 'required-input',
    template: `<input pInputText class="inputStyle" id="inputId" maxlength="maxlength" required ng-required="true" />`
})

export class RequiredInput {
    @Input() maxlength: number;
    @Input() minlength: number;
    @Input() required: Boolean;
    @Input() inputStyle: string;
    @Input() inputId: string;
    @Input() inputModel;
 }