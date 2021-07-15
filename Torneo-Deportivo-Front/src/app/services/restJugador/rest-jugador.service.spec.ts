import { TestBed } from '@angular/core/testing';

import { RestJugadorService } from './rest-jugador.service';

describe('RestJugadorService', () => {
  let service: RestJugadorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RestJugadorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
