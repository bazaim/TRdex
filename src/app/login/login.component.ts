import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { auth } from 'firebase/app';
import { AuthService } from '../_core/auth.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
	showPassword = false;
	form: FormGroup = null;
	loading = false;
	error = false;

	constructor(
		private formBuilder: FormBuilder,
		private authService: AuthService,
		private router: Router
	) { }

	ngOnInit() {
		this.form = this.formBuilder.group({
			email: new FormControl('', [Validators.required, Validators.email]),
			password: new FormControl('', Validators.required),
		});
	}

	login() {
		if (this.form.valid) {
			this.loading = true;
			this.error = false;
			this.authService.signIn(this.form.controls.email.value, this.form.controls.password.value)
				.then((data) => {
					this.loading = false;
				}).catch((data) => {
					this.loading = false;
					this.error = true;
				});
		}
	}
}
