import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaCitasCeaComponent } from './consulta-citas-cea.component';

describe('ConsultaCitasCeaComponent', () => {
  let component: ConsultaCitasCeaComponent;
  let fixture: ComponentFixture<ConsultaCitasCeaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultaCitasCeaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaCitasCeaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
