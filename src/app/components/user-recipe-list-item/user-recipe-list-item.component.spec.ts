import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRecipeListItemComponent } from './user-recipe-list-item.component';

describe('UserRecipeListItemComponent', () => {
  let component: UserRecipeListItemComponent;
  let fixture: ComponentFixture<UserRecipeListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserRecipeListItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserRecipeListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
