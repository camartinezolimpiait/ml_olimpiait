import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmarOtpDaviplataComponent } from './confirmar-otp-daviplata.component';

describe('ConfirmarOtpDaviplataComponent', () => {
  let component: ConfirmarOtpDaviplataComponent;
  let fixture: ComponentFixture<ConfirmarOtpDaviplataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmarOtpDaviplataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmarOtpDaviplataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
