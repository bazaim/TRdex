import { TestBed } from '@angular/core/testing';

import { SpansService } from './spans.service';

describe('SpansService', () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it('should be created', () => {
		const service: SpansService = TestBed.get(SpansService);
		expect(service).toBeTruthy();
	});
});
