import { Component, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ModalController } from '@ionic/angular/standalone';
import * as L from 'leaflet';
import { Note } from 'src/app/model/note';

@Component({
  selector: 'app-param-modal',
  templateUrl: './param-modal.component.html',
  styleUrls: ['./param-modal.component.scss'],
  standalone: true,
  imports: [ IonicModule, ],
})
export class ParamModalComponent  implements OnInit {

  @Input() nota!: Note;
  

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    if(this.nota.position){
      this.showMap();
    }
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  showMap(){
    setTimeout(() =>{
      if(this.nota.position){
        let map = L.map('map').setView([this.nota.position[0], this.nota.position[1]], 15);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
        }).addTo(map);
    
        let marker = L.marker([this.nota.position[0], this.nota.position[1]]).addTo(map);
      }

    },100)
  }

}
