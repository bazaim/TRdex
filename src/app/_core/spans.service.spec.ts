import { TestBed } from '@angular/core/testing';

import { SpansService } from './spans.service';

describe('SpansService', () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it('should be created', () => {
		const service: SpansService = TestBed.inject(SpansService);
		expect(service).toBeTruthy();
	});
});
