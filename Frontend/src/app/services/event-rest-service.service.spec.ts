import { TestBed } from '@angular/core/testing';

import { EventRestServiceService } from './event-rest-service.service';

describe('EventRestServiceService', () => {
  let service: EventRestServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventRestServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
