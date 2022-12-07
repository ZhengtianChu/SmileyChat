import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RegisterationService } from './registeration.service';

describe('RegisterationService', () => {
  let service: RegisterationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(RegisterationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
