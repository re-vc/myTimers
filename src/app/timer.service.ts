import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map, takeWhile, tap } from 'rxjs/operators';
import { timer as rxjsTimer } from 'rxjs';

interface Timer {
  name: string;
  duration: number;
  remaining: number;
  loop: boolean;
  isActive: boolean;
  subscription?: Subscription;
}

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  private timers: BehaviorSubject<Timer[]> = new BehaviorSubject<Timer[]>([]);

  constructor() {
    this.timers = new BehaviorSubject<Timer[]>(this.loadTimers());
  }

  getTimers(): Observable<Timer[]> {
    return this.timers.asObservable();
  }

  addTimer(name: string, duration: number, loop: boolean): void {
    const newTimer: Timer = { name, duration, remaining: duration, loop, isActive: false };
    const updatedTimers = [...this.timers.getValue(), newTimer];
    this.timers.next(updatedTimers);
    this.saveTimers(updatedTimers);
    this.sortTimers();
  }

  removeTimer(timerName: string): void {
    const updatedTimers = this.timers.getValue().filter(timer => timer.name !== timerName);
    this.timers.next(updatedTimers);
    this.saveTimers(updatedTimers);
  }

  startTimer(timerName: string): void {
    const updatedTimers = this.timers.getValue().map(timer => {
      if (timer.name === timerName) {
        timer.isActive = true;
        this.countdownTimer(timer);
      }
      return timer;
    });
    this.timers.next(updatedTimers);
    this.saveTimers(updatedTimers);
  }

  private countdownTimer(timer: Timer): void {
    if (timer.subscription) {
      timer.subscription.unsubscribe();
    }

    timer.remaining = timer.duration;
    timer.isActive = true;

    timer.subscription = rxjsTimer(0, 1000).pipe(
      takeWhile(() => timer.remaining >= 0 && timer.isActive),
      tap(() => {
        if (timer.remaining > 0) {
          timer.remaining--;
        }
        if (timer.remaining === 0) {
          if (timer.loop) {
            timer.remaining = timer.duration;
          } else {
            timer.isActive = false;
          }
        }
        this.sortTimers();
      })
    ).subscribe();
  }

  stopTimer(timerName: string): void {
    const updatedTimers = this.timers.getValue().map(timer => {
      if (timer.name === timerName) {
        timer.isActive = false;
        if (timer.subscription) {
          timer.subscription.unsubscribe();
        }
      }
      return timer;
    });
    this.timers.next(updatedTimers);
    this.saveTimers(updatedTimers);
  }

  resetTimer(timerName: string): void {
    const updatedTimers = this.timers.getValue().map(timer => {
      if (timer.name === timerName) {
        timer.remaining = timer.duration;
        timer.isActive = false;
        if (timer.subscription) {
          timer.subscription.unsubscribe();
        }
      }
      return timer;
    });
    this.timers.next(updatedTimers);
    this.saveTimers(updatedTimers);
  }

  private splitNameAndNumber(name: string): { text: string, number: number } {
    const match = name.match(/([^\d]+)\s*(\d*)/);
    return {
      text: match ? match[1] : name,
      number: match && match[2] ? parseInt(match[2], 10) : -1
    };
  }

  private compareNames(a: string, b: string): number {
    const splitA = this.splitNameAndNumber(a);
    const splitB = this.splitNameAndNumber(b);

    // First compare the textual part
    const textCompare = splitA.text.localeCompare(splitB.text);
    if (textCompare !== 0) {
      return textCompare;
    }

    // If textual parts are equal, compare the numerical part
    return splitA.number - splitB.number;
  }

  private sortTimers(): void {
    const sortedTimers = this.timers.getValue().sort((a, b) => {
      // First, compare by remaining time
      if (a.remaining !== b.remaining) {
        return a.remaining - b.remaining;
      }
      // Then, use compareNames for name comparison
      return this.compareNames(a.name, b.name);
    });
    this.timers.next(sortedTimers);
  }

  private sortBeforeEmit(timers: Timer[]): Timer[] {
    return timers.sort((a, b) => {
      if (a.remaining !== b.remaining) {
        return a.remaining - b.remaining;
      }
      // Use compareNames for name comparison
      return this.compareNames(a.name, b.name);
    });
  }

  private notifyCompletion(timerName: string): void {
    alert(`Timer '${timerName}' has completed!`);
  }

  private saveTimers(timers: Timer[]): void {
    localStorage.setItem('timers', JSON.stringify(timers));
  }

  private loadTimers(): Timer[] {
    const storedTimers = localStorage.getItem('timers');
    if (storedTimers) {
      let timers: Timer[] = JSON.parse(storedTimers).map((timer: Timer) => {
        return { ...timer, isActive: false, subscription: undefined };
      });
      // Sort timers after loading from storage
      timers = this.sortBeforeEmit(timers);
      return timers;
    }
    return [];
  }

}
