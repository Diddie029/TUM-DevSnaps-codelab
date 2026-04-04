import { TestBed } from '@angular/core/testing';

import { Snap } from './snap';

describe('Snap', () => {
  let service: Snap;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Snap);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
