import { Component, Output, EventEmitter } from '@angular/core';
import 'style-loader!./fileUpload';

@Component ({
    selector: "file-upload",
    template: `<button pButton type="button" (click)="fileUploadClick($event)" label="Project Category"></button>`,
})

export class FileUpload {
    fileLink

    @Output() filesOut = new EventEmitter();

    fileUploadClick ($event) {
        console.log($event.target)
    }
}