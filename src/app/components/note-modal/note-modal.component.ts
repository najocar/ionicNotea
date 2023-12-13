import { Component, Input, OnInit, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ModalController } from '@ionic/angular/standalone';
import { Note } from 'src/app/model/note';
import { NoteService } from 'src/app/services/note.service';
import { UIService } from 'src/app/services/ui.service';
import { ParamModalComponent } from '../param-modal/param-modal.component';

@Component({
  selector: 'app-note-modal',
  templateUrl: './note-modal.component.html',
  styleUrls: ['./note-modal.component.scss'],
  standalone: true,
  imports: [ IonicModule, ],
})
export class NoteModalComponent  implements OnInit {

  private UIS = inject(UIService);

  @Input() nota!: Note;
  
  public paramSend!:Note;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {}

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  sendImg(){
    this.paramSend = {
      title: this.nota.title,
      date: this.nota.date,
      img: this.nota.img,
    }
    this.openModal(ParamModalComponent)
  }

  sendLoc(){
    this.paramSend = {
      title: this.nota.title,
      date: this.nota.date,
      position: this.nota.position
    }
    this.openModal(ParamModalComponent)
  }

  async openModal(modalSet:any) {
    this.UIS.openModal(this.nota, modalSet);
  }

}
