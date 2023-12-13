import { Component, ComponentRef, Injectable, inject } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { ActionSheetController, ModalController } from '@ionic/angular/standalone';
import { Note } from '../model/note';

@Injectable({
  providedIn: 'root'
})
export class UIService {
  private loadingC = inject(LoadingController);
  private toastC = inject(ToastController);
  private actionSC = inject(ActionSheetController)
  private loadingElement!: HTMLIonLoadingElement | undefined;
  public modalController = inject(ModalController);

  constructor() { }

  showLoading(msg?: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      if (this.loadingElement && this.loadingElement.isOpen) {
        resolve();
      } else {
        this.loadingElement = await this.loadingC.create({ message: msg });
        this.loadingElement.present();
        resolve();
      }
    })
  }

  async hideLoading(): Promise<void> {
    if (!this.loadingElement) return;
    await this.loadingElement.dismiss();
    this.loadingElement = undefined;
  }

  async showToast(msg: string, color: string = "primary", duration: number = 3000,
    position: "top" | "bottom" | "middle" = "bottom",): Promise<void> {
    let toast: HTMLIonToastElement = await this.toastC.create({
      message: msg,
      duration: duration,
      position: position,
      color: color,
      translucent: true,
      positionAnchor: "footerTab"
    });
    toast.present();
  }

  async confirmation(): Promise<String | undefined> {
    const actionSheet = await this.actionSC.create({
      header: 'Are you sure?',
      buttons: [
        {
          text: 'Yes',
          role: 'confirm',
        },
        {
          text: 'No',
          role: 'cancel',
        },
      ],
    });

    actionSheet.present();

    const { role } = await actionSheet.onWillDismiss();

    return role;
  }

  async openModal(note: Note, modalSet:any) {
    const modal = await this.modalController.create({
      component: modalSet,
      componentProps: {
        // Puedes pasar propiedades al modal si es necesario
        nota: note
      },
      cssClass: 'editModal',
    });
    await modal.present();
  }

  async openModalparam(param: any, type:string, modalSet:any) {
    const modal = await this.modalController.create({
      component: modalSet,
      componentProps: {
        // Puedes pasar propiedades al modal si es necesario
        param: param,
        type: type
      },
      cssClass: 'editModal',
    });
    await modal.present();
  }
}
