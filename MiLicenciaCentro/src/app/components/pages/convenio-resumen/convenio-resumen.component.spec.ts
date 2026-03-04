import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConvenioResumenComponent } from './convenio-resumen.component';

describe('ConvenioResumenComponent', () => {
  let component: ConvenioResumenComponent;
  let fixture: ComponentFixture<ConvenioResumenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConvenioResumenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConvenioResumenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
