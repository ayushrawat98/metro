import { TestBed } from '@angular/core/testing';

import { ExternaldataService } from './externaldata.service';

describe('ExternaldataService', () => {
  let service: ExternaldataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExternaldataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
