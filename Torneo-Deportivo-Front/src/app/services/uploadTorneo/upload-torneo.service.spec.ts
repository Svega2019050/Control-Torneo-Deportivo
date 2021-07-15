import { TestBed } from '@angular/core/testing';

import { UploadTorneoService } from './upload-torneo.service';

describe('UploadTorneoService', () => {
  let service: UploadTorneoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UploadTorneoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
