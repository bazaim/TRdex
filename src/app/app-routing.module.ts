import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { FormComponent } from './form/form.component';
import { AboutComponent } from './about/about.component';


const routes: Routes = [
	{ path: 'about', component: AboutComponent},
	{ path: 'span', component: FormComponent, canActivate: [AngularFireAuthGuard] },
	{ path: 'span/:id', component: FormComponent, canActivate: [AngularFireAuthGuard] },
	{ path: 'login', component: LoginComponent },
	{ path: '**', component: HomeComponent }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
