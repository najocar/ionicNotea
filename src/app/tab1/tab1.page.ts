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
import { addIcons,  } from 'ionicons';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [ ExploreContainerComponent, FormsModule, ReactiveFormsModule, IonicModule],
})
export class Tab1Page {
  public form!: FormGroup;
  private formB = inject(FormBuilder)
  private noteS = inject(NoteService);
  private UIS = inject(UIService);
  public loadingS = inject(LoadingController);
  private myLoading!:HTMLIonLoadingElement;


  constructor() {
    addIcons({star, image, compass})
    this.form = this.formB.group({
      title: ['', [Validators.required, Validators.minLength(4)]],
      description: ['']
    });
  }

  public async saveNote(): Promise<void> {
    if(!this.form.valid) return;
    let note: Note = {
      title: this.form.get("title")?.value,
      description: this.form.get("description")?.value,
      date: Date.now().toLocaleString()
    }
    await this.UIS.showLoading();

    try{
      await this.noteS.addNote(note);
      this.form.reset();
      await this.UIS.showToast("Nota introducida correctamente", "success");
    }catch(error){
      await this.UIS.showToast("Error al insertar la nota", "danger");
    }finally{
      await this.UIS.hideLoading();
    }
  }

  public takePick = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri
    })
  }
}
