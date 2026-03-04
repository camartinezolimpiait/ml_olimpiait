import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmarOperacionComponent } from './confirmar-operacion.component';

describe('ConfirmarOperacionComponent', () => {
  let component: ConfirmarOperacionComponent;
  let fixture: ComponentFixture<ConfirmarOperacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmarOperacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmarOperacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
