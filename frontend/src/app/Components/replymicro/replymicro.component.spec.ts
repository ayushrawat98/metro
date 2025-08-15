import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplymicroComponent } from './replymicro.component';

describe('ReplymicroComponent', () => {
  let component: ReplymicroComponent;
  let fixture: ComponentFixture<ReplymicroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReplymicroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReplymicroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
