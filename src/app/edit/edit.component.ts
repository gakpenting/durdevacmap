import { Component, OnInit,Input ,Output,EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component'; 
import downloadjs from 'downloadjs'
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  @Input() layers
  @Input() detai
  @Input() dimana
  @Input() menuStatus
  @Output() dimanaChange = new EventEmitter<string>();
  @Output() menuChange = new EventEmitter<boolean>();
  @Output() removeLayeChange = new EventEmitter<any>();
  @Output() layeChange = new EventEmitter<any>();
  @ViewChild("myFile") myFil: ElementRef;
  downloadFile(base:string,name:string):void{
downloadjs(base.replace(/"/g,""),name)
  }
  deleteUpload(index:number):void{
    const ini=this
    this.openDialog("Delete Upload","are you sure you want to delete file?").then(a=>{
      if(a){
        ini.detai.upload.splice(index,1)
        
      }
    })
  }
  toggleMenu():void{
    this.menuChange.emit(!this.menuStatus)
      }
  constructor(public dialog: MatDialog) { }
  fileChanged(value:any):void{
 
    const fileReader = new FileReader();
    const ini=this
    fileReader.onload = function (evt) {
      // Read out file contents as a Data URL
      var result = evt.target.result;
 
      try {
        ini.detai.upload.push({name:value.target.files[0].name,id:ini.detai.upload.length,src:JSON.stringify(result)})
          // localStorage.setItem("rhino", JSON.stringify(result));
      }
      catch (e) {
          console.log("Storage failed: " + e);
      }
  };
  // Load blob as Data URL
  fileReader.readAsDataURL(value.target.files[0]);
// console.log(value.target.files)
  }
  upload():void{
    
    this.myFil.nativeElement.click()
  }
  edit():void{
    
      const ini=this
      this.openDialog("Edit Location","are you sure you want to edit location?").then(a=>{
        if(a){
          ini.layeChange.emit(ini.detai)
          ini.back()
        }
      })
      
    
  }
  back():void{
        this.dimanaChange.emit("list")
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
