import { Component } from '@angular/core';
import { Dialogs, TouchGestureEventData } from '@nativescript/core';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { setStatusBarColor } from '../../../utils';

@Component({
  moduleId: module.id,
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  _iterator = new Array(16).fill(undefined);

  touch$$: Subject<{
    $event: TouchGestureEventData;
    extras: Record<string, unknown>;
  }> = new Subject();

  constructor() {
    this.touch$$.pipe(
      tap((event) => {
        this.tapped(event.extras.i as number);
      })
    ).subscribe();
  }

  ngOnInit() {
    setStatusBarColor('dark', '#97d9e9');
  }

  tapped(i: number): void {
    Dialogs.alert(`You got me at ${i}!`);
  }

}
