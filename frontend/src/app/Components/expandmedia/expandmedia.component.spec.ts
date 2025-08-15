import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpandmediaComponent } from './expandmedia.component';

describe('ExpandmediaComponent', () => {
  let component: ExpandmediaComponent;
  let fixture: ComponentFixture<ExpandmediaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpandmediaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpandmediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
