import { TestBed } from '@angular/core/testing';

import { MonumentRestServiceService } from './monument-rest-service.service';

describe('MonumentRestServiceService', () => {
  let service: MonumentRestServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MonumentRestServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
