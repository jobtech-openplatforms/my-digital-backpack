import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CVCategoryType } from '../../../datatypes/CVCategoryType';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent implements OnInit {

  sectionTypes = [];

  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit() {
    this.sectionTypes = [
      {
        type: CVCategoryType.gigWork,
        title: 'Gig platform',
        info: 'Add a workplatform you have/had a profile on.',
        image: ''
      },
      {
        type: CVCategoryType.reviews,
        title: 'Recommendations',
        info: 'Add a rating / review where someone have praised your awsomeness',
        image: ''
      },
      {
        type: CVCategoryType.certificate,
        title: 'Achievements/badges',
        info: 'Add badges/achievements that you have earned from gig platforms',
        image: ''
      },
      {
        type: CVCategoryType.educations,
        title: 'Education',
        info: 'Add any formal education.',
        image: ''
      },
      {
        type: CVCategoryType.employments,
        title: 'Employments',
        info: 'Add companies that you have been employed by.',
        image: ''
      }
    ];
  }

  onConfirm = (type) => {
    this.activeModal.close(type);
  }

  onCancel() {
    this.activeModal.dismiss();
  }

}
