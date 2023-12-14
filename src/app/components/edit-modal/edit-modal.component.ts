import { Component, Input, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular/standalone';
import { Note } from 'src/app/model/note';
import { NoteService } from 'src/app/services/note.service';
import { UIService } from 'src/app/services/ui.service';
import { ParamModalComponent } from '../param-modal/param-modal.component';

@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, ReactiveFormsModule]
})
export class EditModalComponent {
  public form!: FormGroup;
  private formB = inject(FormBuilder)
  private noteS = inject(NoteService);
  private UIS = inject(UIService);
  public loadingS = inject(LoadingController);

  @Input() nota!: Note;

  public paramSend!:Note;

  constructor(private modalCtrl: ModalController) { }
  
  ngOnInit(){
  
    this.form = this.formB.group({
      title: [this.nota.title],
      description: [this.nota.description]
    })
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    if(this.nota){
      this.updateNote();
    }
    return this.modalCtrl.dismiss(this.nota, 'confirm');
  }

  public async updateNote(): Promise<void> {
    if(!this.form.valid) return;
    this.nota.title = this.form.get("title")?.value;
    this.nota.description = this.form.get("description")?.value;

    await this.UIS.showLoading();

    try{
      await this.noteS.updateNote(this.nota);
      this.form.reset();
      await this.UIS.showToast("Nota actualizada correctamente", "success");
    }catch(error){
      await this.UIS.showToast("Error al actualizar la nota", "danger");
    }finally{
      await this.UIS.hideLoading();
    }
  }

  sendImg(){
    this.paramSend = {
      title: this.form.get("title")?.value,
      date: this.form.get("description")?.value,
      img: this.nota.img,
    }
    this.openModal(ParamModalComponent)
  }

  sendLoc(){
    this.paramSend = {
      title: this.form.get("title")?.value,
      date: this.form.get("description")?.value,
      position: this.nota.position,
    }
    this.openModal(ParamModalComponent)
  }

  removeImg(){
    this.nota.img = '';
  }

  removeLoc(){
    this.nota.position = [];
  }

  async openModal(modalSet:any) {
    this.UIS.openModal(this.paramSend, modalSet);
  }

}
