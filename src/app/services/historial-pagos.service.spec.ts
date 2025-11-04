import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HistorialPagosService } from './historial-pagos.service';

describe('HistorialPagosService', () => {
  let service: HistorialPagosService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(HistorialPagosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
