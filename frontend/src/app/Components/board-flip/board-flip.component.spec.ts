import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardFlipComponent } from './board-flip.component';

describe('BoardFlipComponent', () => {
  let component: BoardFlipComponent;
  let fixture: ComponentFixture<BoardFlipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardFlipComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoardFlipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
