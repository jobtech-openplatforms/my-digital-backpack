import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthenticationService } from '../../services/authentification.service';
import ImageTools from '../../utils/ImageTools';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-image-upload-form-input',
  templateUrl: './image-upload-form-input.component.html',
  styleUrls: ['./image-upload-form-input.component.css']
})
export class ImageUploadFormInputComponent implements OnInit {
  @Input()
  url;

  @Input()
  value: '';

  @Input()
  propName: '';

  @Input()
  data: { imageSize?: number, imageName?: string } = {};

  @Input()
  public imageSize;

  @Input()
  public imageName;

  @Output()
  change = new EventEmitter<{ propName: string, value: string, form: string }>();

  public uploadStatus: '' | 'Resizing' | 'Uploading' | 'Completed' = '';
  public uploadPercent;
  public downloadURL;

  constructor(private authService: AuthenticationService, private afStorage: AngularFireStorage) { }

  ngOnInit() {
    this.url = this.url || this.value;
    this.imageSize = this.imageSize || this.data.imageSize || 256;
    this.imageName = this.imageName || this.data.imageName || 'unnamed';
  }

  public clearImage() {
    this.url = this.value = '';
    this.change.next({ propName: this.propName, value: this.url, form: '' });
  }

  public upload(event) {
    const authenticatedUser = this.authService.currentUserId;
    if (authenticatedUser === '') {
      console.error('You need to be logged in to do upload a profile image');
      return;
    }
    if (event.target.files.length === 0) {
      return;
    }

    this.uploadStatus = 'Resizing';
    ImageTools.resize(event.target.files[0], {
      width: this.imageSize, // maximum width
      height: this.imageSize // maximum height
    }, (blob, didItResize) => {
      if (didItResize) {
        this.uploadStatus = 'Uploading';
        // window.URL.createObjectURL(blob);
        const file = blob;
        let filePath = this.imageName;
        filePath = filePath.replace('[TIMECODE]', '' + Date.now());
        const fileRef = this.afStorage.ref(filePath);
        const task = this.afStorage.upload(filePath, file);

        this.uploadPercent = task.percentageChanges();
        task.snapshotChanges().pipe(
          finalize(() => {
            this.downloadURL = fileRef.getDownloadURL().subscribe((url) => {
              this.url = url;
              this.change.next({ propName: this.propName, value: this.url, form: '' });
            });
            this.uploadStatus = 'Completed';
          })
        )
          .subscribe();
      }
    });
  }

}
