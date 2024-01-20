import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimerContainerComponent } from './timer-container.component';

describe('TimerContainerComponent', () => {
  let component: TimerContainerComponent;
  let fixture: ComponentFixture<TimerContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TimerContainerComponent]
    });
    fixture = TestBed.createComponent(TimerContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
