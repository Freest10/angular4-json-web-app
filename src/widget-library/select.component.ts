import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { JsonSchemaFormService } from '../json-schema-form.service';
import { ShareWidgetMethodsService }    from '../share/share-widgets-methods.service';


@Component({
  selector: 'select-widget',
  template: `
    <div
      [class]="options?.htmlClass">
      <label *ngIf="options?.title"
        [attr.for]="'control' + layoutNode?._id"
        [class]="options?.labelHtmlClass"
        [style.display]="options?.notitle ? 'none' : ''"
        [innerHTML]="options?.title"></label>
      <select
        [id]="'control' + layoutNode?._id"
        [attr.readonly]="options?.readonly ? 'readonly' : null"
        [attr.required]="options?.required"
        [class]="options?.fieldHtmlClass"
        [disabled]="controlDisabled"
        [(ngModel)]="(controlValue?.value) ? controlValue?.value : controlValue"
        [name]="controlName"
        (change)="updateValue($event)">
        <option *ngFor="let selectItem of selectList"
                     [value]="selectItem.value"
        >{{selectItem.text}}</option>
      </select>
      <error-messages-widget [control]="this"></error-messages-widget>
    </div>`,
})
export class SelectComponent implements OnInit {
  formControl: AbstractControl;
  controlName: string;
  controlValue: any;
  controlDisabled: boolean = false;
  options: any;
  selectList: any[] = [];
  @Input() layoutNode: any;

  constructor(
    private jsf: JsonSchemaFormService,
    private swm: ShareWidgetMethodsService
  ) { }

  ngOnInit() {
    this.options = this.layoutNode.options;
    this.jsf.initializeControl(this);
    this.swm.setSelectList(this);
  }

  updateValue(event) {
    let value = event.target.value;
    if(this.layoutNode.valueType == "object"){
      let valueObject = null;
      if(value !== null) valueObject = this.getObjectByValueFromSelectList(value);
      this.jsf.updateValue(this, valueObject);
    }else {
      this.jsf.updateValue(this, value);
    }
  }

  getObjectByValueFromSelectList(value){
    let valueObject = {};
    this.selectList.forEach((listOfSelect)=>{
      if(listOfSelect["value"] == value){
        valueObject = listOfSelect;
        return false;
      }
    })
    return valueObject;
  }
}
