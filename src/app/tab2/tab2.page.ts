import { Component, OnDestroy, inject } from '@angular/core';
import { LoadingController } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Note } from '../model/note';
import { NoteService } from '../services/note.service';
import { UIService } from '../services/ui.service';
import { Camera, CameraResultType } from '@capacitor/camera';
import { compass, image, star, add } from 'ionicons/icons'
import { addIcons, } from 'ionicons';
import { Geolocation } from '@capacitor/geolocation';
import { ParamModalComponent } from '../components/param-modal/param-modal.component';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [ExploreContainerComponent, FormsModule, ReactiveFormsModule, IonicModule],
})
export class Tab2Page{
  public form!: FormGroup;
  private formB = inject(FormBuilder)
  private noteS = inject(NoteService);
  private UIS = inject(UIService);
  public loadingS = inject(LoadingController);
  private myLoading!: HTMLIonLoadingElement;

  public imageElement: string = '';
  public position: number[] = [];
  public paramSend!:Note;

  constructor() {
    addIcons({ star, image, compass, add, })
    this.form = this.formB.group({
      title: ['', [Validators.required, Validators.minLength(4)]],
      description: [''],
      datePicker: [new Date(Date.now()).toISOString()]
    });
  }

  // ionViewWillLeave() {
  //   this.resetForm();
  // }

  public async saveNote(): Promise<void> {
    if (!this.form.valid) return;
    let note: Note = {
      title: this.form.get("title")?.value,
      description: this.form.get("description")?.value,
      date: this.form.get("datePicker")?.value,
      img: this.imageElement,
      position: this.position,
    }

    await this.UIS.showLoading();

    try {
      await this.noteS.addNote(note);
      this.resetForm();
      await this.UIS.showToast("Nota introducida correctamente", "success");
    } catch (error) {
      if(this.imageElement.length/1024 >= 1500){
        await this.UIS.showToast("Tamaño imagen excedido", "danger");
      }else{
        await this.UIS.showToast("Error al insertar la nota", "danger");
      }
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

    this.form.controls['datePicker'].setValue(new Date(Date.now()).toISOString());
    // this.form.addControl('datePicker', new Date(Date.now()).toISOString());
  }

  public printCurrentPosition = async () => {
    const coordinates = (await Geolocation.getCurrentPosition()).coords;
    this.position = [coordinates.latitude, coordinates.longitude];
  };

  sendImg(){
    this.paramSend = {
      title: this.form.get("title")?.value,
      date: this.form.get("description")?.value,
      img: this.imageElement,
    }
    this.openModal(ParamModalComponent)
  }

  sendLoc(){
    this.paramSend = {
      title: this.form.get("title")?.value,
      date: this.form.get("description")?.value,
      position: this.position,
    }
    this.openModal(ParamModalComponent)
  }

  removeImg(){
    this.imageElement = '';
  }

  removeLoc(){
    this.position = [];
  }

  async openModal(modalSet:any) {
    this.UIS.openModal(this.paramSend, modalSet);
  }

}
