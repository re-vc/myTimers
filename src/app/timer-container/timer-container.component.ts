import { Component, OnInit } from '@angular/core';
import { TimerService } from '../timer.service';
import { Timer } from '../models/timer.model';

@Component({
  selector: 'app-timer-container',
  templateUrl: './timer-container.component.html',
  styleUrls: ['./timer-container.component.scss']
})
export class TimerContainerComponent implements OnInit {
  timers!: Timer[];
  newTimerName: string = '';
  newTimerDuration: number | null = null; // Allow null for resetting to show placeholder
  newTimerLoop: boolean = false;

  constructor(private timerService: TimerService) { }

  ngOnInit(): void {
    this.timerService.getTimers().subscribe((timers: Timer[]) => {
      this.timers = timers;
    });
  }

  toggleLoop() {
    this.newTimerLoop = !this.newTimerLoop;
  }

  addTimer(name: string, duration: number | null, loop: boolean): void {
    if (name && duration != null && duration > 0) {
      this.timerService.addTimer(name, duration, loop);
      this.newTimerName = '';
      this.newTimerDuration = null;
      this.newTimerLoop = false;
    }
  }

  onTimerDelete(timerName: string): void {
    this.timerService.removeTimer(timerName);
  }
}
