import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpcionesCentroComponent } from './opciones-centro.component';

describe('OpcionesCentroComponent', () => {
  let component: OpcionesCentroComponent;
  let fixture: ComponentFixture<OpcionesCentroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpcionesCentroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpcionesCentroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
