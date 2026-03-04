import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaPinComponent } from './consulta-pin.component';

describe('ConsultaPinComponent', () => {
  let component: ConsultaPinComponent;
  let fixture: ComponentFixture<ConsultaPinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultaPinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaPinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
