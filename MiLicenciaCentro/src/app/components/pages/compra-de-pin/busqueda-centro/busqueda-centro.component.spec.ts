import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedaCentroComponent } from './busqueda-centro.component';

describe('BusquedaCentroComponent', () => {
  let component: BusquedaCentroComponent;
  let fixture: ComponentFixture<BusquedaCentroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusquedaCentroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusquedaCentroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
