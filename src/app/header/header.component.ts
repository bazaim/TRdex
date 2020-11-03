import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from '../_core/auth.service';
import { SettingsService } from '../_core/settings.service';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
	@Input() darkTheme = false;
	@Output() darkThemeChange = new EventEmitter<boolean>();

	showDropdown = false;
	isLogged = false;
	user = null;

	constructor(
		private authService: AuthService,
		private settingsService: SettingsService
	) {}

	ngOnInit() {
		this.authService.userChange.subscribe((data) => {
			this.isLogged = data;
		});
	}

	signOut() {
		this.authService.signOut();
		this.showDropdown = false;
	}

	toggleTheme(value: boolean = null) {
		this.darkTheme = value ?? !this.darkTheme;
		this.settingsService.setAppStorage('dark-theme', this.darkTheme);
		this.darkThemeChange.emit(this.darkTheme);
	}
}
