import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ISpan, ICity } from './interfaces';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class SpansService {
	constructor(
		private firestore: AngularFirestore
	) { }

	/** ISpan getter & setter */
	getSpan(id: string | number): Observable<ISpan> {
		return new Observable((observer) => {
			this.firestore.doc<ISpan>('spans/' + id).valueChanges().subscribe(
				(data) => {
					if (data) {
						data.id = id;
						observer.next(data);
						observer.complete();
					} else {
						observer.error();
						observer.complete();
					}
				},
				(data) => {
					observer.error();
					observer.complete();
				}
			);
		});
	}
	getSpans(): Observable<any[]> {
		return this.firestore.collection<ISpan>('spans').valueChanges({ idField: 'id' });
	}
	createSpan(span: ISpan): Observable<ISpan> {
		return new Observable((observer) => {
			this.firestore.collection<ISpan>('spans').add(span)
				.then((data) => {
					span.id = data.id;
					observer.next(span);
					observer.complete();
				})
				.catch(() => {
					observer.error(span);
					observer.complete();
				});
		});
	}
	updateSpan(span: ISpan): Observable<ISpan> {
		return new Observable((observer) => {
			this.firestore.doc('spans/' + span.id).update(span)
				.then(() => {
					observer.next(span);
					observer.complete();
				})
				.catch(() => {
					observer.error(span);
					observer.complete();
				});
		});
	}
	deleteSpan(spanId: number|string): Observable<boolean> {
		return new Observable((observer) => {
			this.firestore.doc('spans/' + spanId).delete()
				.then(() => {
					observer.next(true);
					observer.complete();
				}).catch(() => {
					observer.error();
					observer.complete();
				});
		});
	}

	private getMapImageUrl(span: ISpan): string {
		return 'http://osm-static-maps.herokuapp.com/?' +
			'height=400&' +
			'width=700&' +
			'maxZoom=13&' +
			'tileserverUrl=' + encodeURIComponent(
				'https://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png?' +
				'apikey=0641388541ea4213970158b52f4aaedd'
			) + '&' +
			'geojson=' + encodeURIComponent(JSON.stringify([
				{
					type: 'FeatureCollection',
					features: span.cities.map((city: ICity) => {
						return {
							type: 'Feature',
							geometry: {
								type: 'Point',
								coordinates: [
									city.gps.lng,
									city.gps.lat
								]
							}
						};
					})
				}
			]));
	}
}
