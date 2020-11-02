import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_core/auth.service';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
	showDropdown = false;
	isLogged = false;
	user = null;

	constructor(
		private authService: AuthService
	) { }

	ngOnInit() {
		this.authService.userChange.subscribe((data) => {
			this.isLogged = data;
		});
	}

	signOut() {
		this.authService.signOut();
		this.showDropdown = false;
	}
}
