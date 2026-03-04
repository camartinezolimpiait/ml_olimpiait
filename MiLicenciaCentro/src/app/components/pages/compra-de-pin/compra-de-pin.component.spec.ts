import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompraDePinComponent } from './compra-de-pin.component';

describe('CompraDePinComponent', () => {
  let component: CompraDePinComponent;
  let fixture: ComponentFixture<CompraDePinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompraDePinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompraDePinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
