import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component'; 
@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  @Input() dimana
  @Input() laye
  @Input() menuStatus
  @Output() dimanaChange = new EventEmitter<string>();
  @Output() menuChange = new EventEmitter<boolean>();
  @Output() layeChange = new EventEmitter<any>();
  @Output() removeLayeChange = new EventEmitter<any>();
  public upload : any[]=[] 
  toggleMenu():void{
    this.menuChange.emit(!this.menuStatus)
      }
  constructor(public dialog: MatDialog) { }
  back():void{
    this.dimanaChange.emit("list")
  }
  remove():void{
    const ini=this
    this.openDialog("Remove Location","are you sure you want to remove location?").then(a=>{
      if(a){
        ini.removeLayeChange.emit(ini.laye)
        ini.laye.layer.remove()
        ini.back()
      }
    })
    
  }
  add():void{
    const ini=this
    this.openDialog("Save Location","are you sure you want to save location?").then(a=>{
      if(a){
        ini.layeChange.emit(ini.laye)
        ini.back()
      }
    })
    
  }
  removeUpload(index: number):void{
    
this.laye.upload.slice(index,1)
  }
  async openDialog(title:string,description:string): Promise<boolean> {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      data: {title, description,decision:false}
    });

   const result=await dialogRef.afterClosed().toPromise();
   if(result){
     return result
   }else{
     return false
   }
  }

  ngOnInit(): void {
  }

}
