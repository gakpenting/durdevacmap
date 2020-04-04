import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component'; 
import downloadjs from 'downloadjs'
@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  @Input() dimana
  @Input() menuStatus
  @Input() detai
  @Output() dimanaChange = new EventEmitter<string>();
  @Output() menuChange = new EventEmitter<boolean>();
  @Output() removeLayeChange = new EventEmitter<any>();
  @Output() editChange = new EventEmitter<number>();
  constructor(public dialog: MatDialog) { }
  edit(index:number):void{
    this.editChange.emit(index)
    this.dimanaChange.emit("edit")
  }
  downloadFile(base:string,name:string):void{
    downloadjs(base.replace(/"/g,""),name)
      }

  remove():void{
    const ini=this
    this.openDialog("Remove Location","are you sure you want to remove location?").then(a=>{
      if(a){
        ini.removeLayeChange.emit(ini.detai)
        ini.detai.layer.remove()
        ini.back()
      }
    })
  }
  toggleMenu():void{
    
    this.menuChange.emit(!this.menuStatus)
      }
  back():void{

    this.dimanaChange.emit("list")
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
