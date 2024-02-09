import { TestBed } from '@angular/core/testing';

import { TicketRestServiceService } from './ticket-rest-service.service';

describe('TicketRestServiceService', () => {
  let service: TicketRestServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TicketRestServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
