import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { DevUIModule } from 'ng-devui';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { MainComponent } from './main/main.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterationComponent } from './auth/registeration/registeration.component';
import { PostsComponent } from './main/posts/posts.component';


const appRoutes: Routes = [
  {path: 'auth', component: AuthComponent},
  {path: 'main', component: MainComponent},
  {path: 'profile', component: ProfileComponent},
  {path: '', redirectTo: '/auth', pathMatch: 'full'},
  {path: '**', component: AuthComponent}
];


@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    MainComponent,
    ProfileComponent,
    RegisterationComponent,
    PostsComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    RouterModule.forRoot(appRoutes, {useHash: true}),
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    DevUIModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
