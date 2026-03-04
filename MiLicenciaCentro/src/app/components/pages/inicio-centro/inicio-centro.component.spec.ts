import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioCentroComponent } from './inicio-centro.component';

describe('InicioCentroComponent', () => {
  let component: InicioCentroComponent;
  let fixture: ComponentFixture<InicioCentroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InicioCentroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InicioCentroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
