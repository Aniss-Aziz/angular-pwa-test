import { TestBed } from '@angular/core/testing';

import { ActiaThemeService } from './actia-theme.service';

describe('ActiaThemeService', () => {
  let service: ActiaThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActiaThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
