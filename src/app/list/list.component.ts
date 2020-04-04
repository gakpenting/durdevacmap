import { Component, OnInit ,Input,Output,EventEmitter} from '@angular/core';
import * as L from 'leaflet'

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  @Input() layers
  @Input() map
  @Input() dimana
  @Input() menuStatus
  @Input() feature
  @Output() dimanaChange = new EventEmitter<string>();
  @Output() menuChange = new EventEmitter<boolean>();
  @Output() detailChange = new EventEmitter<number>();
  constructor() { }
  setDefault():void{
    this.map.fitBounds(this.feature.getBounds())
  }
  toggleMenu():void{
this.menuChange.emit(!this.menuStatus)
  }
 
  focusLayer(layer: any,index: number): void{
    this.map.closePopup();
    layer.layer.openPopup()
    
      if(layer.type!=="marker"){
        this.map.fitBounds(layer.layer.getBounds());
        
      }else{
        
        const a=L.latLngBounds([layer.layer.getLatLng()]);
        this.map.fitBounds(a);
      }
    
      this.dimanaChange.emit("detail")
      this.detailChange.emit(index)
    
  }
  ngOnInit(): void {
  }

}
