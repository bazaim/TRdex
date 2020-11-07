import { Component, OnInit } from '@angular/core';
import { ICity as ICityOriginal, ISpan } from '../_core/interfaces';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { SpansService } from '../_core/spans.service';

interface ICity extends ICityOriginal {
	open?: boolean;
}

@Component({
	selector: 'app-form',
	templateUrl: './form.component.html',
	styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
	formGroups: FormArray;
	form: FormGroup;
	datas: any[] = [];
	span: ISpan;
	loading = true;
	error = false;
	loadingTitle = 'Chargement...';

	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private spansService: SpansService
	) { }

	ngOnInit(): void {
		this.activatedRoute.params.subscribe(params => {
			if (params.id) {
				this.spansService.getSpan(params.id).subscribe(
					(span: ISpan) => {
						this.span = span;
						this.loading = false;
						this.initForm();
					},
					() => {
						this.loading = false;
						this.initForm();
					}
				);
			} else {
				this.loading = false;
				this.initForm();
			}
		});
	}

	private initForm() {
		this.datas = [];
		if (this.span) {
			this.datas = this.span.cities.map((city: ICity) => {
				return {
					city: city.label,
					latitude: city.gps.lat,
					longitude: city.gps.lng
				};
			});
			this.formGroups = new FormArray(this.span.cities.map((city: ICity) => this.createRow(city)));
		} else {
			this.formGroups = new FormArray([]);
		}
		this.form = new FormGroup({
			label: new FormControl(this.span ? this.span.label : '', [Validators.required]),
			cities: this.formGroups
		});
	}

	createRow(data?: ICity): FormGroup {
		const city = new FormControl(data?.label ?? '', [Validators.required]);
		const latitude = new FormControl(data?.gps?.lat ?? '');
		const longitude = new FormControl(data?.gps?.lng ?? '');

		return new FormGroup({
			city,
			latitude,
			longitude
		});
	}

	addRow() {
		this.formGroups.push(this.createRow());
		this.datas.push({
			city: '',
			latitude: '',
			longitude: ''
		});
	}

	removeRow(index: number) {
		this.datas.splice(index, 1);
		this.formGroups.removeAt(index);
	}

	submit(): void {
		if (this.form.invalid || !this.datas.length) {
			return void 0;
		}

		this.loadingTitle = (this.span) ? 'Sauvegarde...' : 'Création...';
		this.loading = true;

		if (this.span) {
			// update
			this.spansService.updateSpan({
				id: this.span.id,
				label: this.form.value.label,
				cities: this.form.value.cities.map((c) => {
					return {
						label: c.city,
						gps: {
							lat: c.latitude,
							lng: c.longitude
						}
					};
				})
			}).subscribe((span: ISpan) => {
				this.router.navigate(['']);
			});
		} else {
			// create
			this.spansService.createSpan({
				label: this.form.value.label,
				cities: this.form.value.cities.map((c) => {
					return {
						label: c.city,
						gps: {
							lat: c.latitude,
							lng: c.longitude
						}
					};
				})
			}).subscribe((span: ISpan) => {
				this.router.navigate(['']);
			});
		}
	}

	delete() {
		if (this.span) {
			this.loadingTitle = 'Suppression des données...';
			this.loading = true;
			this.spansService.deleteSpan(this.span.id).subscribe(
				() => {
					this.router.navigate(['']);
				},
				() => {
					this.loading = false;
					this.error = true;
				}
			);
		}
	}
}
