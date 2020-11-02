export interface ISpan {
	id?: string|number;
	label: string;
	cities: ICity[];
	cities_text?: string;
	compare_label?: any;
	compare_cities?: any;
	max_rating?: number;
	gmap_settings?: any;
}

export interface ICity {
	label: string;
	gps: IGps;
}

export interface IGps {
	lat: number;
	lng: number;
}

export interface IKeyValue {
	key: string;
	value: any;
}
