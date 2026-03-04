import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetodosRecaudoComponent } from './metodos-recaudo.component';

describe('MetodosRecaudoComponent', () => {
  let component: MetodosRecaudoComponent;
  let fixture: ComponentFixture<MetodosRecaudoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetodosRecaudoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetodosRecaudoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
