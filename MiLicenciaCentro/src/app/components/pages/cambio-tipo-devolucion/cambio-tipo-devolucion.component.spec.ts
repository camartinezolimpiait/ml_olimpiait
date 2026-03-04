import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CambioTipoDevolucionComponent } from './cambio-tipo-devolucion.component';

describe('CambioTipoDevolucionComponent', () => {
  let component: CambioTipoDevolucionComponent;
  let fixture: ComponentFixture<CambioTipoDevolucionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CambioTipoDevolucionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CambioTipoDevolucionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
