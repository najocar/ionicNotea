import { Component, OnDestroy, ViewChild, inject } from '@angular/core';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { NoteService } from '../services/note.service';
import { CommonModule } from '@angular/common';
import { IonList, IonicModule, Platform } from '@ionic/angular';
import { Note } from '../model/note';
import { ModalController } from '@ionic/angular';
import { EditModalComponent } from '../components/edit-modal/edit-modal.component';
import { UIService } from '../services/ui.service';
import { BehaviorSubject, Observable, Subscription, from, map, mergeMap, tap, toArray } from 'rxjs';
import { NoteModalComponent } from '../components/note-modal/note-modal.component';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonicModule, ExploreContainerComponent, CommonModule]
})
export class Tab1Page implements OnDestroy {
  public noteS = inject(NoteService);
  public modalController = inject(ModalController);
  private UIS = inject(UIService);
  private suscription!:Subscription;

  public notesList:Note[] = [];
  public _notes$:BehaviorSubject<Note[]> = new BehaviorSubject<Note[]>([]);
  private lastNote:Note|undefined=undefined;
  private notesPerPage:number = 12;
  public isInfiniteScrollAvailable:boolean = true;

  @ViewChild('lista') lista!: IonList;

  constructor(public platform:Platform) { }

  ionViewDidEnter() {
    this.suscription = this.noteS.readAll().subscribe(value => {
      if(value){
        this.notesList = value
      }  
    })
    this.lastNote = undefined;
    this.isInfiniteScrollAvailable = true;
    this.platform.ready().then(() => {
      this.notesPerPage=Math.round(this.platform.height()/50);
      this.loadNotes(true);
    });
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
        this._notes$.next([...this._notes$.getValue().filter(item => item !== note)])
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

  viewNote(note:Note){
    this.openModal(note, NoteModalComponent);
  }

  handleRefresh(event:any) {
    this.isInfiniteScrollAvailable=true;
    this.lastNote=undefined;
    this.loadNotes(true,event);
  }

  private convertPromiseToObservableFromFirebase(promise: Promise<any>): Observable<Note[]> {
    return from(promise).pipe(
      tap(d=>{
        
        if(d.docs && d.docs.length>=this.notesPerPage){
          this.lastNote=d.docs[d.docs.length-1];
        }else{
          this.lastNote=undefined;
        }
      }),
      mergeMap(d =>  d.docs),
      map(d => {
        return {key:(d as any).id,...(d as any).data()};
      }),
      toArray()
    );
  }

  loadNotes(fromFirst:boolean, event?:any){
    if(fromFirst==false && this.lastNote==undefined){
      this.isInfiniteScrollAvailable=false;
      event.target.complete();
      return;
    } 
    
    this.convertPromiseToObservableFromFirebase(this.noteS.readNext(this.lastNote,this.notesPerPage)).subscribe(d=>{
      event?.target.complete();
      if(fromFirst){
        this._notes$.next(d);
      }else{
        this._notes$.next([...this._notes$.getValue(),...d]);
      }
    })
    
  }

  loadMore(event: any) {
    this.loadNotes(false,event);
  }
}