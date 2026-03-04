import { TestBed } from '@angular/core/testing';

import { PopupSimpleService } from './popup-simple.service';

describe('PopupSimpleService', () => {
  let service: PopupSimpleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PopupSimpleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
