import { Component, OnInit, OnDestroy } from '@angular/core';
import * as stringSimilarity from 'string-similarity';
import { ISpan, ICity } from '../_core/interfaces';
import { SpansService } from '../_core/spans.service';
import { AuthService } from '../_core/auth.service';
import { Spans } from '../_core/span.data';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
	search = '';
	datas: ISpan[] = [];
	datasFiltered: ISpan[] = [];
	onlyTopSearch = false;
	topSearchLevel = .75;
	loading = true;
	isLogged = false;

	constructor(
		public spansService: SpansService,
		private authService: AuthService
	) {
		/** create */
		// this.datas = Spans;
		// console.log(this.datas);
		// this.datas.map((span) => this.spansService.createSpan(span).subscribe());

		/** delete */
		// const sub = this.spansService.getSpans().subscribe((data: ISpan[]) => {
		// 	sub.unsubscribe();
		// 	console.log(data);
		// 	this.datas = data;
		// 	this.datas.map((span) => this.spansService.deleteSpan(span.id).subscribe());
		// });

		/** default */
		this.spansService.getSpans().subscribe((data: ISpan[]) => {
			this.datas = [...data];
			this.doSearch();
			this.loading = false;
		});
	}

	ngOnInit(): void {
		this.authService.userChange.subscribe((data) => {
			this.isLogged = data;
		});
	}

	ngOnDestroy(): void { }

	inputChange(ev) {
		this.search = ev.target.value;
		this.doSearch();
	}
	inputClear() {
		this.search = '';
		this.doSearch();
	}

	private doSearch(): void {
		this.onlyTopSearch = false;
		this.datasFiltered = [...this.datas];

		if (this.search.length && this.datasFiltered.length) {
			this.datasFiltered = this.datasFiltered
				.map((value: ISpan) => {
					value.compare_label = stringSimilarity.findBestMatch(
						this.sanitize(this.search).toLowerCase(),
						[this.sanitize(value.label).toLowerCase()]
					);
					value.compare_cities = stringSimilarity.findBestMatch(
						this.sanitize(this.search).toLowerCase(),
						value.cities.map((city) => this.sanitize(city.label).toLowerCase())
					);
					value.max_rating = (value.compare_label.bestMatch.rating > value.compare_cities.bestMatch.rating)
						? value.compare_label.bestMatch.rating
						: value.compare_cities.bestMatch.rating;

					return value;
				})
				.sort((a: ISpan, b: ISpan) => b.max_rating - a.max_rating);

			this.onlyTopSearch = this.datasFiltered[0].max_rating >= this.topSearchLevel;
		} else if (this.datasFiltered.length) {
			this.datasFiltered.sort((a: ISpan, b: ISpan) => a.label.localeCompare(b.label));
		}

		this.datasFiltered = this.datasFiltered
			.map((value: ISpan) => {
				value.cities_text = this.displayCitisList(value);
				return value;
			});
	}
	hasHighlightCity(span: ISpan): boolean {
		if (!this.search.length) {
			return false;
		}
		for (const index in span.cities) {
			if (span.cities[index]
				&& span.compare_cities && span.compare_cities.ratings[index]
				&& span.compare_cities.bestMatch.rating > 0.1
				&& span.compare_cities.ratings[index].rating >= span.compare_cities.bestMatch.rating * 0.9) {
				return true;
			}
		}

		return false;
	}

	displayCitisList(span: ISpan): string {
		if (!span.cities) {
			return '';
		}
		if (this.hasHighlightCity(span)) {
			const value = [];
			span.cities.map((a, index) => {
				if (span.compare_cities && span.compare_cities.ratings[index]
					&& span.compare_cities.bestMatch.rating > 0.1
					&& span.compare_cities.ratings[index].rating >= span.compare_cities.bestMatch.rating * 0.9) {
					value.push('<strong>' + a.label + '</strong>');
				}
				return a;
			});
			span.cities.map((a, index) => {
				if (!(span.compare_cities && span.compare_cities.ratings[index]
					&& span.compare_cities.bestMatch.rating > 0.1
					&& span.compare_cities.ratings[index].rating >= span.compare_cities.bestMatch.rating * 0.9)) {
					value.push(a.label);
				}
				return a;
			});
			return value.join(', ');
		}

		return span.cities.map(a => a.label).join(', ');
	}

	sanitize(str): string {
		return str.replace(/[^a-zA-Z0-9]/g, '');
	}
}
