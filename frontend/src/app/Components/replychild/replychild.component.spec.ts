import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplychildComponent } from './replychild.component';

describe('ReplychildComponent', () => {
  let component: ReplychildComponent;
  let fixture: ComponentFixture<ReplychildComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReplychildComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReplychildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
