import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingPathListComponent } from './training-path-list.component';

describe('TrainingPathListComponent', () => {
  let component: TrainingPathListComponent;
  let fixture: ComponentFixture<TrainingPathListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainingPathListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainingPathListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
