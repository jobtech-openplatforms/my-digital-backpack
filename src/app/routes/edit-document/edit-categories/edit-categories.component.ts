import { Component, OnInit, Input } from '@angular/core';
import { CVCategoryCollection } from '../../../datatypes/CVCategoryCollection';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertModalComponent } from '../../../components/alert-modal/alert-modal.component';

@Component({
  selector: 'app-edit-categories',
  templateUrl: './edit-categories.component.html',
  styleUrls: ['./edit-categories.component.css']
})
export class EditCategoriesComponent implements OnInit {
  @Input()
  public categories: CVCategoryCollection[];

  constructor(private modal: NgbModal, private activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  onUp(category) {
    const index = this.categories.indexOf(category);
    if (index > 0) {
      this.categories.splice(index, 1);
      this.categories.splice(index - 1, 0, category);
    }
  }

  onDown(category) {
    const index = this.categories.indexOf(category);
    if (index < this.categories.length - 1) {
      this.categories.splice(index, 1);
      this.categories.splice(index + 1, 0, category);
    }
  }

  onDelete(category) {
    const alertModalRef = this.modal.open(AlertModalComponent);
    const alertModalInstance = <AlertModalComponent>alertModalRef.componentInstance;
    alertModalInstance.title = 'Really delete?';
    alertModalInstance.message =
      'All data added to this section will be removed.';
    alertModalInstance.confirmLabel = 'Continue';
    alertModalInstance.dismissLabel = 'Cancel';
    alertModalRef.result.then(() => {
      const index = this.categories.indexOf(category);
      this.categories.splice(index, 1); // TODO: make datasources as deleted
    }, () => { });
  }

  onConfirm = () => {
    this.activeModal.close({ type: 'Save' });
  }

}
