import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {HomeComponent} from './Posts Feed/home/home.component';
import {AuthService as AuthGuard} from './shared/services/auth.service';
import {RegisterComponent} from './register/register.component';
import {AddPostComponent} from './Posts Feed/add-post/add-post.component';
import {ProfileComponent} from './Posts Feed/profile/profile.component';
import {NotAllowedComponent} from './Posts Feed/not-allowed/not-allowed.component';
import {User404Component} from './Posts Feed/user404/user404.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {EventsComponent} from './events/events.component';
import {QuizComponent} from './quiz/quiz.component';
import {ResourcesComponent} from './resources/resources.component';

const routes: Routes = [
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  {path: 'events', component: EventsComponent, canActivate: [AuthGuard]},
  {path: 'quiz', component: QuizComponent, canActivate: [AuthGuard]},
  {path: 'resources', component: ResourcesComponent, canActivate: [AuthGuard]},
  {path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  {path: 'profile/404', component: User404Component},
  {path: 'profile/:uid', component: ProfileComponent},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: '', component: LoginComponent},
  {path: '**', component: NotAllowedComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
