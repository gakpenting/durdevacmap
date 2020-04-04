import { Component, OnInit ,Inject} from '@angular/core';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
export interface DialogData {
  title: string;
  description: string;
  decision:boolean;
}
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) { }

  ngOnInit(): void {
  }
  onNoClick(value: boolean): void {
    value=false
    
    this.dialogRef.close();
  }
  onYes(value:boolean): boolean {
    value=true
    return value;
  }
}
