import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreadwrapperComponent } from './threadwrapper.component';

describe('ThreadwrapperComponent', () => {
  let component: ThreadwrapperComponent;
  let fixture: ComponentFixture<ThreadwrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThreadwrapperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThreadwrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
