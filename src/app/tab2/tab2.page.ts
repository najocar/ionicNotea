import { Component, ViewChild, inject } from '@angular/core';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { NoteService } from '../services/note.service';
import { CommonModule } from '@angular/common';
import { IonList, IonicModule } from '@ionic/angular';
import { Note } from '../model/note';
import { ModalController } from '@ionic/angular';
import { EditModalComponent } from '../components/edit-modal/edit-modal.component';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule, ExploreContainerComponent, CommonModule]
})
export class Tab2Page {
  public noteS = inject(NoteService);
  public modalController = inject(ModalController);

  @ViewChild('lista') lista!: IonList;

  constructor() { }

  ionViewDidEnter() {
    this.noteS.readAll()
  }

  editNote() {

  }

  deleteNote(note: Note) {
    try {
      this.noteS.deleteNote(note);
      this.lista.closeSlidingItems();
    } catch {

    }
  }

  onItemSlide(event: any, note: Note) {
    const swipeDirection = event.detail.side;

    if (swipeDirection === "start") {
      this.openModal(note);
      // this.editNote();
    } else if (swipeDirection === "end") {
      this.deleteNote(note);
    }
  }

  async openModal(note: Note) {
    const modal = await this.modalController.create({
      component: EditModalComponent,
      componentProps: {
        // Puedes pasar propiedades al modal si es necesario
        nota: note
      },
      cssClass: 'editModal',
    });
    this.lista.closeSlidingItems();
    await modal.present();
  }
}
