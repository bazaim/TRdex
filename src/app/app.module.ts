import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { FormComponent } from './form/form.component';
import { AboutComponent } from './about/about.component';

@NgModule({
	declarations: [
		AppComponent,
		HeaderComponent,
		HomeComponent,
		LoginComponent,
		FormComponent,
		AboutComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		ReactiveFormsModule,
		AngularFireModule.initializeApp(environment.firebaseConfig),
		AngularFirestoreModule.enablePersistence(),
		AngularFireDatabaseModule,
		AppRoutingModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
