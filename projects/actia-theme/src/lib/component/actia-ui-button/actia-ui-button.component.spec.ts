import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiaUiButtonComponent } from './actia-ui-button.component';

describe('ActiaUiButtonComponent', () => {
  let component: ActiaUiButtonComponent;
  let fixture: ComponentFixture<ActiaUiButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActiaUiButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActiaUiButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
