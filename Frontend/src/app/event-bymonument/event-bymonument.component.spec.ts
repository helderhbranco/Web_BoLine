import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventBymonumentComponent } from './event-bymonument.component';

describe('EventBymonumentComponent', () => {
  let component: EventBymonumentComponent;
  let fixture: ComponentFixture<EventBymonumentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventBymonumentComponent]
    });
    fixture = TestBed.createComponent(EventBymonumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
