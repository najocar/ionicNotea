import { Component, inject } from '@angular/core';
import { LoadingController } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Note } from '../model/note';
import { NoteService } from '../services/note.service';
import { UIService } from '../services/ui.service';
import { Camera, CameraResultType } from '@capacitor/camera';
import { compass, image, star } from 'ionicons/icons'
import { addIcons, } from 'ionicons';
import { Geolocation, Position } from '@capacitor/geolocation';
import * as L from 'leaflet';
import { icon } from 'leaflet';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [ExploreContainerComponent, FormsModule, ReactiveFormsModule, IonicModule],
})
export class Tab1Page {
  public form!: FormGroup;
  private formB = inject(FormBuilder)
  private noteS = inject(NoteService);
  private UIS = inject(UIService);
  public loadingS = inject(LoadingController);
  private myLoading!: HTMLIonLoadingElement;

  public imageElement: string = '';
  public position: number[] = [];

  constructor() {
    addIcons({ star, image, compass })
    this.form = this.formB.group({
      title: ['', [Validators.required, Validators.minLength(4)]],
      description: [''],
      datePicker: [new Date(Date.now()).toISOString()]
    });
  }

  public async saveNote(): Promise<void> {
    if (!this.form.valid) return;
    let note: Note = {
      title: this.form.get("title")?.value,
      description: this.form.get("description")?.value,
      date: this.form.get("datePicker")?.value,
      img: this.imageElement,
    }

    console.log(this.imageElement);

    await this.UIS.showLoading();

    try {
      await this.noteS.addNote(note);
      this.resetForm();
      await this.UIS.showToast("Nota introducida correctamente", "success");
    } catch (error) {
      await this.UIS.showToast("Error al insertar la nota", "danger");
    } finally {
      await this.UIS.hideLoading();
    }
  }

  public takePick = async () => {
    const image = await Camera.getPhoto({
      quality: 50,
      allowEditing: true,
      resultType: CameraResultType.Base64
    })

    if (image.base64String) {
      this.imageElement = image.base64String;
    }
  }

  private resetForm() {
    this.form.reset();
    this.imageElement = '';
    this.position = [];
    console.log(this.position);

    this.form.addControl('datePicker', new Date(Date.now()).toISOString());
  }

  public printCurrentPosition = async () => {
    const coordinates = (await Geolocation.getCurrentPosition()).coords;
    this.position = [coordinates.latitude, coordinates.longitude];

    console.log('Current position:', this.position[1]);


    console.log('Current position:');


    let map = L.map('map').setView([this.position[0], this.position[1]], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    let marker = L.marker([coordinates.latitude, coordinates.longitude]).addTo(map);


  };


}
