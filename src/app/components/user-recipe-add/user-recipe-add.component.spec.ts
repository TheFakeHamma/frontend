import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRecipeAddComponent } from './user-recipe-add.component';

describe('UserRecipeAddComponent', () => {
  let component: UserRecipeAddComponent;
  let fixture: ComponentFixture<UserRecipeAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserRecipeAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserRecipeAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
