  import { Component, inject } from '@angular/core';
  import { ExploreContainerComponent } from '../explore-container/explore-container.component';
  import { NoteService } from '../services/note.service';
  import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

  @Component({
    selector: 'app-tab2',
    templateUrl: 'tab2.page.html',
    styleUrls: ['tab2.page.scss'],
    standalone: true,
    imports: [IonicModule, ExploreContainerComponent, CommonModule]
  })
  export class Tab2Page {
    public noteS = inject(NoteService);

    constructor() {}

    ionViewDidEnter(){
      this.noteS.readAll()
    }

    editNote(){

    }

    deleteNote(){

    }

  }
