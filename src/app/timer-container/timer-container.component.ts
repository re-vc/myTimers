import { Component, OnInit } from '@angular/core';
import { TimerService } from '../timer.service';
import { Timer } from '../models/timer.model'; // Import Timer interface if defined in a separate file

@Component({
  selector: 'app-timer-container',
  templateUrl: './timer-container.component.html',
  styleUrls: ['./timer-container.component.scss']
})
export class TimerContainerComponent implements OnInit {
  timers!: Timer[];
  newTimerName: string = '';
  newTimerDuration: number = 180;
  newTimerLoop: boolean = true;

  constructor(private timerService: TimerService) {}

  ngOnInit(): void {
    this.timerService.getTimers().subscribe(timers => this.timers = timers);
  }

  addTimer(name: string, duration: number, loop: boolean): void {
    if (name && duration > 0) {
      this.timerService.addTimer(name, duration, loop);
      this.newTimerName = '';
      this.newTimerDuration = 180;
      this.newTimerLoop = true;
    }
  }

  onTimerDelete(timerName: string): void {
    this.timerService.removeTimer(timerName);
  }
}
