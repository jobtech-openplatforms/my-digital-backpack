import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';

@Component({
  selector: 'app-dynamic-form-editor',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.css'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class DynamicFormComponent implements OnInit {
  public static formCounter = 0;

  @Input()
  target: any;

  @Input()
  values: Array<DynamicFormItemAny> = [];

  @Output()
  formChanged = new EventEmitter();

  private propTarget = { target: null, prop: '' };
  formId = 0;

  constructor() {
    DynamicFormComponent.formCounter++;
  }

  ngOnInit() {
    this.formId = DynamicFormComponent.formCounter;
  }

  onChangeFromObj = (obj) => {
    this.onChange(obj.propName, obj.value, obj.form);
  }

  onChange = (propName, value, form = null) => {
    if (propName) {
      // console.log(propName, value);
      this.setPropValue(propName, value);

    }
    this.formChanged.emit(form);
  }

  resolvePropPath(target, path) {
    const pathList = path.split('.');
    let propName = '';
    let childObject = target;
    for (let i = 0; i < pathList.length; i++) {
      if (i < pathList.length - 1) {
        childObject = childObject[pathList[i]];
      } else {
        propName = pathList[i];
      }
    }
    this.propTarget.target = childObject;
    this.propTarget.prop = propName;
    return this.propTarget;
  }

  getPropValueAsMonth(path) {
    const value = this.getPropValue(path);
    const date = new Date(value);
    const year = date.getFullYear();
    let month = '' + (date.getMonth() + 1);
    if (month.length < 2) {
      month = '0' + month;
    }
    if (date) {
      return year + '-' + month;
    }
  }

  getPropValue(path: string) {
    const propTarget = this.resolvePropPath(this.target, path);
    return propTarget.target[propTarget.prop];
  }

  setPropValue(path: string, value) {
    const propTarget = this.resolvePropPath(this.target, path);
    propTarget.target[propTarget.prop] = value;
  }
}


export class DynamicFormItemBase {
  type: 'custom' | 'separator' | 'group' | 'text' | 'textarea' | 'number' | 'boolean' | 'email' | 'location' | 'date' | 'month' | 'select';
  class?: string;
}

export class DynamicFormValueBase extends DynamicFormItemBase {
  name: string;
  placeholder?: string;
  defaultValue?: any;
  propName: string;
  required?: boolean;
}

export class DynamicFormItemAny extends DynamicFormValueBase {
  component?: string;
  data?: any;
  id?: string;
  children?: DynamicFormItemBase[];
  valueMin?: number;
  valueMax?: number;
  valueStep?: number;
  minLength?: number;
  maxLength?: number;
  options: Array<{ label: string, value: any }>;
}

export class DynamicFormSeparator extends DynamicFormItemBase {
  type: 'separator';
}

export class DynamicFormCustom extends DynamicFormItemBase {
  type: 'custom';
  component: any;
  data: any;
}

export class DynamicFormGroup extends DynamicFormItemBase {
  type: 'group';
  children: DynamicFormItemBase[];
}

export class DynamicFormValueNumber extends DynamicFormValueBase {
  type: 'number';
  valueMin?: number;
  valueMax?: number;
  valueStep?: number;
}

export class DynamicFormValueBoolean extends DynamicFormValueBase {
  type: 'boolean';
}

export class DynamicFormValueText extends DynamicFormValueBase {
  type: 'text';
  minLength?: number;
  maxLength?: number;
}

export class DynamicFormValueEmail extends DynamicFormValueBase {
  type: 'email';
}

export class DynamicFormValueTextarea extends DynamicFormValueBase {
  type: 'textarea';
  minLength?: number;
  maxLength?: number;
}

export class DynamicFormValueMonth extends DynamicFormValueBase {
  type: 'month';
}

export class DynamicFormValueDate extends DynamicFormValueBase {
  type: 'date';
}

export class DynamicFormValueSelect extends DynamicFormValueBase {
  type: 'select';
  options: Array<{ label: string, value: any }>;
}
