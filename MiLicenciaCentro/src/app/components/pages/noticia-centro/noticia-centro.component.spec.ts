import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticiaCentroComponent } from './noticia-centro.component';

describe('NoticiaCentroComponent', () => {
  let component: NoticiaCentroComponent;
  let fixture: ComponentFixture<NoticiaCentroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoticiaCentroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticiaCentroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
