import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TimerContainerComponent } from './timer-container/timer-container.component';

const routes: Routes = [
  {component: TimerContainerComponent, path: ""}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
