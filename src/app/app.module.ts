import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StudentsMapComponent } from './students-map/students-map.component';
import { GoogleChartsModule } from 'angular-google-charts';

@NgModule({
  declarations: [
    AppComponent,
    StudentsMapComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    GoogleChartsModule.forRoot('AIzaSyDE_e0o4jemUk46JdzGlLoToLwelDbpwdA'),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
