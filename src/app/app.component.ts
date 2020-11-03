import { Component } from '@angular/core';
import { SettingsService } from './_core/settings.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	title = 'TRdexV2';
	darkTheme = null;

	constructor(
		private settingsService: SettingsService
	) {
		this.darkTheme = this.settingsService.getAppStorage('dark-theme', false);
	}
}
