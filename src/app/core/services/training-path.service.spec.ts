import { TestBed } from '@angular/core/testing';

import { TrainingPathService } from './training-path.service';

describe('TrainingPathService', () => {
  let service: TrainingPathService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrainingPathService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
