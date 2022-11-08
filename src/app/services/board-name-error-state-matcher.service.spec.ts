import { TestBed } from '@angular/core/testing';

import { BoardNameErrorStateMatcherService } from './board-name-error-state-matcher.service';

describe('BoardNameErrorStateMatcherService', () => {
  let service: BoardNameErrorStateMatcherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BoardNameErrorStateMatcherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
