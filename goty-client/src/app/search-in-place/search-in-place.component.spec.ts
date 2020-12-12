import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchInPlaceComponent } from './search-in-place.component';

describe('SearchInPlaceComponent', () => {
  let component: SearchInPlaceComponent;
  let fixture: ComponentFixture<SearchInPlaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchInPlaceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchInPlaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
