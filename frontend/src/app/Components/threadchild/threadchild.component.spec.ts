import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreadchildComponent } from './threadchild.component';

describe('ThreadchildComponent', () => {
  let component: ThreadchildComponent;
  let fixture: ComponentFixture<ThreadchildComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThreadchildComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThreadchildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
