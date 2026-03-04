import { Component, ViewEncapsulation, ElementRef, Input, OnInit } from '@angular/core';
import { PopupSimpleService } from '../../../../services/util/popup-simple.service';

@Component({
  selector: 'app-popup-simple',
  templateUrl: './popup-simple.component.html',
  styleUrls: ['./popup-simple.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class PopupSimpleComponent implements OnInit {

  @Input() id?: string;
  isOpen = false;
  private readonly element: any;

  constructor(protected popupSimpleService: PopupSimpleService, private readonly el: ElementRef) { this.element = el.nativeElement; }

  ngOnInit(): void {

    this.element.style.display = 'none';
    this.popupSimpleService.add(this);
    this.element.addEventListener('click', (el: any) => {
      if (el.target.className === 'popup-modal') {
        this.close();
      }
    });
    this.open();
  }

  ngOnDestroy() {
    // remove self from modal service
    this.popupSimpleService.remove(this);
    // remove modal element from html
    this.element.remove();
  }

  open() {
    this.element.style.display = 'block';
    this.element.classList.add('popup-modal');
    document.body.classList.add('popup-modal-open');
    this.isOpen = true;
  }

  close() {
    this.element.style.display = 'none';
    this.element.classList.remove('popup-modal');
    document.body.classList.remove('popup-modal-open');
    this.isOpen = false;
  }
}
