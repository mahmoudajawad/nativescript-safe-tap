import { NgModule } from '@angular/core';
import { NativeScriptCommonModule } from '@nativescript/angular';
import { SafeTapDirective } from './safe-tap.directive';

@NgModule({
  imports: [NativeScriptCommonModule],
  declarations: [SafeTapDirective],
  exports: [SafeTapDirective],
})
export class SafeTapModule {}
