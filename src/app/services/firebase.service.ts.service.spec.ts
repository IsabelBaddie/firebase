import { TestBed } from '@angular/core/testing';

import { FirebaseServiceTsService } from './firebase.service.ts.service';

describe('FirebaseServiceTsService', () => {
  let service: FirebaseServiceTsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaseServiceTsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
