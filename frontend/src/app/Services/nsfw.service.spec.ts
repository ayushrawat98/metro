import { TestBed } from '@angular/core/testing';

import { NsfwService } from './nsfw.service';

describe('NsfwService', () => {
  let service: NsfwService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NsfwService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
