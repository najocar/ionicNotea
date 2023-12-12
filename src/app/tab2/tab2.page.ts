import { Component, OnDestroy, ViewChild, inject } from '@angular/core';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { NoteService } from '../services/note.service';
import { CommonModule } from '@angular/common';
import { IonList, IonicModule } from '@ionic/angular';
import { Note } from '../model/note';
import { ModalController } from '@ionic/angular';
import { EditModalComponent } from '../components/edit-modal/edit-modal.component';
import { UIService } from '../services/ui.service';
import { Subscription } from 'rxjs';
import { NoteModalComponent } from '../components/note-modal/note-modal.component';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule, ExploreContainerComponent, CommonModule]
})
export class Tab2Page implements OnDestroy {
  public noteS = inject(NoteService);
  public modalController = inject(ModalController);
  private UIS = inject(UIService);
  private suscription!:Subscription;

  public notesList:Note[] = [];

  @ViewChild('lista') lista!: IonList;

  constructor() { }

  ionViewDidEnter() {
    this.suscription = this.noteS.readAll().subscribe(value => {
      if(value){
        this.notesList = value
      }  
    })
  }

  ngOnDestroy(){
    this.suscription.unsubscribe();
  }

  editNote() {

  }

  async deleteNote(note: Note) {
    if(await this.UIS.confirmation()==='confirm'){
      try {
        this.noteS.deleteNote(note);
        this.lista.closeSlidingItems();
      } catch {
  
      }
    }else{
      this.lista.closeSlidingItems();
    }
    
  }

  onItemSlide(event: any, note: Note) {
    const swipeDirection = event.detail.side;

    if (swipeDirection === "start") {
      this.openModal(note, EditModalComponent);
      // this.editNote();
    } else if (swipeDirection === "end") {
      this.deleteNote(note);
    }
  }

  async openModal(note: Note, modalSet:any) {
    this.UIS.openModal(note, modalSet);
    this.lista.closeSlidingItems();
  }

  // async openModal(note: Note, modalSet:any) {
  //   const modal = await this.modalController.create({
  //     component: EditModalComponent,
  //     componentProps: {
  //       // Puedes pasar propiedades al modal si es necesario
  //       nota: note
  //     },
  //     cssClass: 'editModal',
  //   });
  //   this.lista.closeSlidingItems();
  //   await modal.present();
  // }

  viewNote(note:Note){
    this.openModal(note, NoteModalComponent);
  }
}
