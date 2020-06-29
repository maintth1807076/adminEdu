import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditScheduleComponent } from './create-edit-schedule.component';

describe('CreateEditScheduleComponent', () => {
  let component: CreateEditScheduleComponent;
  let fixture: ComponentFixture<CreateEditScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEditScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
