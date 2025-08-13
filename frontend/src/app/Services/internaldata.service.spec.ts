import { TestBed } from '@angular/core/testing';

import { InternaldataService } from './internaldata.service';

describe('InternaldataService', () => {
  let service: InternaldataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InternaldataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
