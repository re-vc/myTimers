import { Component, Input, Output, OnInit, EventEmitter, HostListener } from '@angular/core';
import { TimerService } from '../timer.service';
import { Timer } from '../models/timer.model';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit {
  @Input() timerName!: string;
  @Input() duration!: number;
  @Input() loop!: boolean;

  remainingTime!: number;
  isActive: boolean = false;

  isLargeScreen: boolean = window.innerWidth > 768;

  @Output() delete = new EventEmitter<string>();

  constructor(private timerService: TimerService) { }

  ngOnInit(): void {
    this.remainingTime = this.duration;
    this.timerService.getTimers().subscribe((timers: Timer[]) => {
      const currentTimer = timers.find((timer: Timer) => timer.name === this.timerName);
      if (currentTimer) {
        this.remainingTime = currentTimer.remaining;
        this.isActive = currentTimer.isActive;
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isLargeScreen = window.innerWidth > 768;
  }

  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formattedMinutes = minutes.toString().padStart(hours > 0 ? 2 : 1, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

    return hours > 0
      ? `${hours}:${formattedMinutes}:${formattedSeconds}`
      : `${formattedMinutes}:${formattedSeconds}`;
  }

  onDelete(): void {
    this.delete.emit(this.timerName);
  }

  start(): void {
    this.timerService.startTimer(this.timerName);
  }

  stop(): void {
    this.timerService.stopTimer(this.timerName);
  }

  reset(): void {
    this.timerService.resetTimer(this.timerName);
  }
}
