import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiaThemeComponent } from './actia-theme.component';

describe('ActiaThemeComponent', () => {
  let component: ActiaThemeComponent;
  let fixture: ComponentFixture<ActiaThemeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActiaThemeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActiaThemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
