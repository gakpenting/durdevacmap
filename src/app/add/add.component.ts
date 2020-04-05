import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import downloadjs from 'downloadjs';
@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent implements OnInit {
  @Input() dimana;
  @Input() laye;
  @Input() menuStatus;
  @Output() dimanaChange = new EventEmitter<string>();
  @Output() menuChange = new EventEmitter<boolean>();
  @Output() layeChange = new EventEmitter<any>();
  @Output() removeLayeChange = new EventEmitter<any>();
  @ViewChild('myFile') myFil: ElementRef;
  public upload: any[] = [];

  downloadFile(base: string, name: string): void {
    downloadjs(base.replace(/"/g, ''), name);
  }
  uploads(): void {
    this.myFil.nativeElement.click();
  }
  fileChanged(value: any): void {
    const fileReader = new FileReader();
    const ini = this;
    fileReader.onload = function (evt) {
      // Read out file contents as a Data URL
      var result = evt.target.result;

      try {
        ini.laye.upload.push({
          name: value.target.files[0].name,
          id: ini.laye.upload.length,
          src: JSON.stringify(result),
        });
        // localStorage.setItem("rhino", JSON.stringify(result));
      } catch (e) {
        console.log('Storage failed: ' + e);
      }
    };
    // Load blob as Data URL
    fileReader.readAsDataURL(value.target.files[0]);
    // console.log(value.target.files)
  }
  toggleMenu(): void {
    this.menuChange.emit(!this.menuStatus);
  }
  constructor(public dialog: MatDialog) {}
  back(): void {
    this.dimanaChange.emit('list');
  }
  remove(): void {
    const ini = this;
    this.openDialog(
      'Remove Location',
      'are you sure you want to remove location?'
    ).then((a) => {
      if (a) {
        ini.removeLayeChange.emit(ini.laye);
        ini.laye.layer.remove();
        ini.back();
      }
    });
  }
  add(): void {
    const ini = this;
    this.openDialog(
      'Save Location',
      'are you sure you want to save location?'
    ).then((a) => {
      if (a) {
        ini.layeChange.emit(ini.laye);
        ini.back();
      }
    });
  }
  removeUpload(index: number): void {
    const ini = this;
    this.openDialog(
      'Delete Upload',
      'are you sure you want to delete file?'
    ).then((a) => {
      if (a) {
        ini.laye.upload.splice(index, 1);
      }
    });
  }
  async openDialog(title: string, description: string): Promise<boolean> {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      data: { title, description, decision: false },
    });

    const result = await dialogRef.afterClosed().toPromise();
    if (result) {
      return result;
    } else {
      return false;
    }
  }

  ngOnInit(): void {}
}
