import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ServerDataService } from '../../services/server-data.service';
import { ActivatedRoute } from '@angular/router';
import { Utility } from '../../utils/Utility';
import { DataSourceType } from '../../datatypes/DataSourceType';
import { GigPlatformData } from '../../datatypes/GigPlatformData';
import { DataSourceConnectionData } from '../../datatypes/DataSourceConnectionData';
import { DynamicDataEditorModalComponent } from '../../components/dynamic-data-editor-modal/dynamic-data-editor-modal.component';
import {
  DynamicFormValueBoolean, DynamicFormValueText,
  DynamicFormCustom, DynamicFormValueTextarea,
  DynamicFormGroup, DynamicFormValueDate, DynamicFormValueNumber
} from '../../components/dynamic-form/dynamic-form.component';
import { ImageUploadFormInputComponent } from '../../components/image-upload-form-input/image-upload-form-input.component';

@Component({
  selector: 'app-edit-data-source',
  templateUrl: './edit-data-source.component.html',
  styleUrls: ['./edit-data-source.component.css']
})
export class EditDataSourceComponent implements OnInit {
  private documentId;
  private dataSourceData = new DataSourceConnectionData();

  constructor(
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private serverData: ServerDataService
  ) { }

  ngOnInit() {
    this.documentId = this.activatedRoute.snapshot.paramMap.get('dataSourceId');

    this.serverData.getDataSourceObs(this.documentId).subscribe((data) => {
      console.log(data);
      if (data === null) {
        return;
      }
      Utility.replaceObject(this.dataSourceData, data);

      if (this.dataSourceData.dataType === null) {
        this.dataSourceData.dataType = DataSourceType.GigPlatform;
      }

      let formValues;
      switch (this.dataSourceData.dataType) {
        case DataSourceType.GigPlatform:
          formValues = [
            <DynamicFormValueText>{
              name: 'Plattform',
              propName: 'aggregatedData.organization.name',
              type: 'text',
            },
            <DynamicFormCustom>{
              type: 'custom',
              component: ImageUploadFormInputComponent,
              name: 'Logotyp',
              propName: 'aggregatedData.organization.logo',
              enabled: false,
              data: { // TODO: make sure you can replace empty logo
                imageSize: 256,
                imageName: (<GigPlatformData>this.dataSourceData.aggregatedData).organization.logo
              }
            },
            <DynamicFormValueTextarea>{
              name: 'Beskrivning',
              propName: 'aggregatedData.organization.description',
              type: 'textarea'
            },
            <DynamicFormGroup>{
              type: 'group',
              class: 'input-columns',
              children: [
                <DynamicFormValueDate>{
                  name: 'Start',
                  propName: 'aggregatedData.startDate',
                  type: 'date',
                },
                <DynamicFormValueDate>{
                  name: 'End',
                  propName: 'aggregatedData.endDate',
                  type: 'date',
                }
              ]
            },
            <DynamicFormValueNumber>{
              name: 'No of gigs',
              propName: 'aggregatedData.noOfGigs',
              type: 'number',
              valueMin: 0,
              valueStep: 1
            }
          ];
          break;
        default:
          throw ({ error: 'Cannot create form for type ' + this.dataSourceData.dataType });
          break;
      }
      formValues.push(<DynamicFormValueBoolean>{
        name: 'Is Validated by source',
        propName: 'isValidated',
        type: 'boolean',
      });

      const modalRef = this.modalService.open(DynamicDataEditorModalComponent);
      const modelInstance = <DynamicDataEditorModalComponent>modalRef.componentInstance;
      modelInstance.data = this.dataSourceData;
      modelInstance.editorSettings = {
        title: 'Edit datasource',
        isNew: false,
        isDeleteEnabled: false,
        formValues: formValues
      };
      modalRef.result.then((result) => {
        if (result.type === 'Save') {
          this.serverData.saveDataSource(this.documentId, this.dataSourceData);
        }
      }, (error) => {
        console.log('cancel', error);
      });

    });
  }

}
