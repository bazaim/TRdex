import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from './../../environments/environment';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	private userSource = new BehaviorSubject<boolean>(false);
	public userChange = this.userSource.asObservable();
	private user: any = null;

	constructor(
		public auth: AngularFireAuth,
		private router: Router
	) {
		this.auth.user.subscribe(data => this.setUser(data));
		this.auth.onAuthStateChanged(data => this.setUser(data));
	}

	private setUser(user) {
		if (!!user !== this.isLogged()) {
			this.user = user;
			this.userSource.next(this.isLogged());
			this.router.navigate(['/']);
		}
	}

	getUser() {
		return this.user;
	}

	isLogged() {
		return !environment.login || !!this.user;
	}

	signIn(email: string, password: string) {
		return this.auth.signInWithEmailAndPassword(email, password);
	}

	signOut() {
		return this.auth.signOut();
	}
}
