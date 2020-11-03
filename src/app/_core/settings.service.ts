import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class SettingsService {
	private localStorageKey = 'TRdex-settings';

	constructor() { }

	getAppStorage(key: string, def: any = null) {
		const storage = JSON.parse(localStorage.getItem(this.localStorageKey));
		return storage && storage[key] ? storage[key] : def;
	}

	setAppStorage(key: string, value: any) {
		let storage = JSON.parse(localStorage.getItem(this.localStorageKey));
		storage = storage ? storage : {};
		storage[key] = value;
		localStorage.setItem(this.localStorageKey, JSON.stringify(storage));
		return storage[key];
	}

	deleteAppStorage(key: string, value: any) {
		const storage = JSON.parse(localStorage.getItem(this.localStorageKey));
		if (storage) {
			delete storage[key];
			localStorage.setItem(this.localStorageKey, JSON.stringify(storage));
		}
	}

	clearAppStorage() {
		localStorage.removeItem(this.localStorageKey);
	}
}
