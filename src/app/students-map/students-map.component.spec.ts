import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentsMapComponent } from './students-map.component';

describe('StudentsMapComponent', () => {
  let component: StudentsMapComponent;
  let fixture: ComponentFixture<StudentsMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentsMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentsMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
