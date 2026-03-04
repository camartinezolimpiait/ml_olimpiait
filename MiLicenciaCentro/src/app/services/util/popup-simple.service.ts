import { Injectable } from '@angular/core';
import { PopupSimpleComponent } from '../../components/common/popup-simple/popup-simple/popup-simple.component'


@Injectable({
  providedIn: 'root'
})
export class PopupSimpleService {

  private modals: PopupSimpleComponent[] = [];

  constructor() { }

  add(modal: PopupSimpleComponent) {
    // ensure component has a unique id attribute
    if (!modal.id || this.modals.find(x => x.id === modal.id)) {
      throw new Error('modal must have a unique id attribute');
    }

    // add modal to array of active modals
    this.modals.push(modal);
  }

  remove(modal: PopupSimpleComponent) {
    // remove modal from array of active modals
    this.modals = this.modals.filter(x => x === modal);
  }
  open(id: string) {
    // open modal specified by id
    const modal = this.modals.find(x => x.id === id);

    if (!modal) {
      throw new Error(`modal '${id}' not found`);
    }

    modal.open();
  }

  close() {
    // close the modal that is currently open
    const modal = this.modals.find(x => x.isOpen);
    modal?.close();
  }
}
