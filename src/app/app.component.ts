import { Inject, AfterViewInit, Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import 'leaflet-draw';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  public home;
  public map;
  public laye;
  public dimana = 'list';
  layers: any[] = [];
  constructor(private http: HttpClient, public dialog: MatDialog) {}
  public menuStatus: boolean = false;
  ngAfterViewInit(): void {
    this.initMap();
  }

  async openDialog(): Promise<boolean> {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      data: {
        title: 'Add Location',
        description: 'are you sure you want to add location?',
        decision: false,
      },
    });

    const result = await dialogRef.afterClosed().toPromise();
    if (result) {
      return result;
    } else {
      return false;
    }
  }

  toggleMenu(): void {
    this.menuStatus = !this.menuStatus;
  }
  changeMenuStatus(value: boolean): void {
    this.menuStatus = value;
  }
  changeDimana(value: string): void {
    this.dimana = value;
  }
  changeRemoveLaye(value: any): void {
    this.layers.splice(value.id, 1);
    let y: any = localStorage.getItem('data');
    if (y) {
      y = JSON.parse(y);
      y = this.layers;
      localStorage.setItem(
        'data',
        JSON.stringify(y, this.getCircularReplacer())
      );
    }
    this.map.fitBounds(this.home.getBounds())
  }
  changeDetail(value:number):void{
    this.laye=this.layers[value]
  }
  changeLaye(value: any): void {
    this.layers[value.id] = value;
    this.layers[value.id].layer.bindPopup(value.title)
    this.layers[value.id].layer.on("click",(e:any)=>{
console.log(e)
    })
    
    let y: any = localStorage.getItem('data');
    if (y) {
      y = JSON.parse(y);
      y[value.id] = value;
      console.log(value)
      localStorage.setItem(
        'data',
        JSON.stringify(y, this.getCircularReplacer())
      );
    }
  }
  private initMap(): void {
    // credits: https://github.com/turban/Leaflet.Mask
    L.Mask = L.Polygon.extend({
      options: {
        stroke: false,
        color: '#333',
        fillOpacity: 0.5,
        clickable: true,

        outerBounds: new L.LatLngBounds([-90, -360], [90, 360]),
      },

      initialize: function (latLngs, options) {
        var outerBoundsLatLngs = [
          this.options.outerBounds.getSouthWest(),
          this.options.outerBounds.getNorthWest(),
          this.options.outerBounds.getNorthEast(),
          this.options.outerBounds.getSouthEast(),
        ];
        L.Polygon.prototype.initialize.call(
          this,
          [outerBoundsLatLngs, latLngs],
          options
        );
      },
    });
    L.mask = function (latLngs, options) {
      return new L.Mask(latLngs, options);
    };
    this.map = L.map('map', {
      center: [39.8282, -98.5795],
      zoom: 3,
    });

    this.http.get('assets/file.geojson').subscribe((json: any) => {
      let y:any = localStorage.getItem('data');
      if (y) {
        y = JSON.parse(y);
        y.forEach((a:any,indexY:number)=>{
if(a.type!=="marker"){
  let b=L[a.type](a.layer._latlngs).addTo(this.map)
  b.bindPopup(a.title)
  b.on("click",(e:any)=>{
    this.dimana="detail"
    this.menuStatus=true
    this.changeDetail(indexY)
    this.map.fitBounds(b.getBounds());
    
        })
  a.layer=b
  this.layers.push(a)
}else{
  let b=L[a.type](a.layer._latlng).addTo(this.map)
  b.bindPopup(a.title)
  b.on("click",(e:any)=>{
    this.dimana="detail"
    this.menuStatus=true
    this.changeDetail(indexY)
    const j=L.latLngBounds([b.getLatLng()]);
    this.map.fitBounds(j);
        })
  a.layer=b
  this.layers.push(a)
}
        })
      } 
      const k = json.features.filter(
        (a: any) => a.properties.name === 'Grad Đurđevac'
      );
      const l = json.features.filter(
        (a: any) => a.properties.name === 'Đurđevac'
      );

      var coordinates = k[0].geometry.coordinates[0];
      var latLngs = [];
      for (let i = 0; i < coordinates.length; i++) {
        latLngs.push(new L.LatLng(coordinates[i][1], coordinates[i][0]));
      }

      L.mask(latLngs).addTo(this.map);

      const feature = L.geoJSON(
        { type: 'FeatureCollection', features: k.splice(0, 1).concat(l[2]) },
        {
          style: {
            fill: true,
            weight: 2,
            opacity: 0.5,
            color: 'blue', //Outline color
            fillOpacity: 0,
          },
          onEachFeature: function (feature, layer) {
            // ini.layers.push({feature,layer})
            layer.bindPopup(feature.properties.name);
          },
        }
      ).addTo(this.map);
this.home=feature
      this.map.fitBounds(feature.getBounds());
      // this.map.fitBounds(bounds);
    });

    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );

    tiles.addTo(this.map);
    // Initialise the FeatureGroup to store editable layers
    var editableLayers = new L.FeatureGroup();
    this.map.addLayer(editableLayers);

    // define custom marker
    // var MyCustomMarker = L.Icon.extend({
    //   options: {
    //     shadowUrl: null,
    //     iconAnchor: new L.Point(12, 12),
    //     iconSize: new L.Point(24, 24),
    //     iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Information_icon4_orange.svg'
    //   }
    // });

    var drawPluginOptions = {
      // position: 'topl',
      draw: {
        polyline: {
          // shapeOptions: {
          //   color: '#f357a1',
          //   weight: 3,
          // },
        },
        polygon: {
          allowIntersection: false, // Restricts shapes to simple polygons
          drawError: {
            color: '#e1e100', // Color the shape will turn when intersects
            message:
              '<strong>Polygon draw does not allow intersections!<strong> (allowIntersection: false)', // Message that will show when intersect
          },
          // shapeOptions: {
          //   color: '#bada55',
          // },
        },
        circlemarker: false,
        circle: false, // Turns off this drawing tool
        rectangle: false,
        marker: true,
      },
      edit: false,
    };

    // Initialise the draw control and pass it the FeatureGroup of editable layers
    var drawControl = new L.Control.Draw(drawPluginOptions);
    this.map.addControl(drawControl);

    var editableLayers = new L.FeatureGroup();
    this.map.addLayer(editableLayers);
    const ini = this;
    this.map.on('draw:created', async function (e) {
      // console.log(e);
      
      editableLayers.addLayer(e.layer);
      const result = await ini.openDialog();
      if (result) {
        ini.dimana = 'add';
        ini.menuStatus = true;
        ini.layers.push({
          id: ini.layers.length,
          title: '',
          description: '',
          upload: [],
          layer: e.layer,
          type: e.layerType,
        });
        ini.laye = {
          id: ini.layers.length-1,
          title: '',
          description: '',
          upload: [],
          layer: e.layer,
          type: e.layerType,
        };
        let y: any = localStorage.getItem('data');
        if (y) {
          y = JSON.parse(y);
          y.push({
            id: ini.layers.length-1,
            title: '',
            description: '',
            upload: [],
            layer: e.layer,
            type: e.layerType,
          });
          localStorage.setItem(
            'data',
            JSON.stringify(y, ini.getCircularReplacer())
          );
        } else {
          localStorage.setItem(
            'data',
            JSON.stringify(ini.layers, ini.getCircularReplacer())
          );
        }
      } else {
        ini.menuStatus = false;
        ini.dimana = 'list';
        e.layer.remove();
      }
    });
  }
  getCircularReplacer(): any {
    const seen = new WeakSet();
    return (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return;
        }
        seen.add(value);
      }
      return value;
    };
  }
}
