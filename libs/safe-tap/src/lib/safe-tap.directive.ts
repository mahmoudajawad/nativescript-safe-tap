import { Directive, Input, NgZone, ViewContainerRef } from '@angular/core';
import {
  isAndroid,
  isIOS,
  TapGestureEventData,
  TouchGestureEventData,
} from '@nativescript/core';
import { Subject } from 'rxjs';

// [REF] https://github.com/NativeScript/NativeScript/issues/9630

// eslint-disable-next-line @angular-eslint/directive-selector
@Directive({ selector: '[safeTap]' })
export class SafeTapDirective {
  @Input() safeTap!: Subject<{
    $event: TouchGestureEventData | TapGestureEventData;
    extras: Record<string, unknown>;
  }>;
  @Input() eventExtras: Record<string, unknown> = {};

  touchStarted = -1;

  constructor(private container: ViewContainerRef, private zone: NgZone) {
    // Since this is ios-only issue, only apply the workaround if using ios, for android implement regular tap event
    if (isIOS) {
      this.container.element.nativeElement.addEventListener(
        'touch',
        ($event: TouchGestureEventData) => {
          this.zone.run(() => {
            this.touch($event);
          });
        }
      );
    } else if (isAndroid) {
      this.container.element.nativeElement.addEventListener(
        'tap',
        ($event: TapGestureEventData) => {
          this.zone.run(() => {
            this.safeTap.next({ $event, extras: this.eventExtras });
          });
        }
      );
    }
  }

  touch($event: TouchGestureEventData): void {
    if ($event.action == 'down') {
      this.touchStarted = new Date().getTime();
    } else if ($event.action == 'up') {
      if (this.touchStarted != -1) {
        const touchDuration = new Date().getTime() - this.touchStarted;
        if (touchDuration > 30 && touchDuration < 160) {
          this.safeTap.next({ $event, extras: this.eventExtras });
        }
      }
    } else {
      this.touchStarted = -1;
    }
  }
}
