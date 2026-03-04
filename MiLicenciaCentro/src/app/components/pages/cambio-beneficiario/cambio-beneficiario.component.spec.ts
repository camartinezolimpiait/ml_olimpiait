import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CambioBeneficiarioComponent } from './cambio-beneficiario.component';

describe('AnulacionComponent', () => {
  let component: CambioBeneficiarioComponent;
  let fixture: ComponentFixture<CambioBeneficiarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CambioBeneficiarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CambioBeneficiarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
