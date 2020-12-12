import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameOfTheYearComponent } from './game-of-the-year.component';

describe('GameOfTheYearComponent', () => {
  let component: GameOfTheYearComponent;
  let fixture: ComponentFixture<GameOfTheYearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameOfTheYearComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameOfTheYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
