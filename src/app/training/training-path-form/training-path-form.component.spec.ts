import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingPathFormComponent } from './training-path-form.component';

describe('TrainingPathFormComponent', () => {
  let component: TrainingPathFormComponent;
  let fixture: ComponentFixture<TrainingPathFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainingPathFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainingPathFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
