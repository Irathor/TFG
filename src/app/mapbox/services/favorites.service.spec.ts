import { TestBed } from '@angular/core/testing';
import { FavoritesService } from './favorites.service';

describe('FavoritesService', () => {
  let service: FavoritesService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavoritesService);
  });

  it('no marca nada como favorito por defecto', () => {
    expect(service.isFavorite('123')).toBe(false);
    expect(service.getAll()).toEqual([]);
  });

  it('toggle añade y quita de favoritos, devolviendo el nuevo estado', () => {
    expect(service.toggle('123')).toBe(true);
    expect(service.isFavorite('123')).toBe(true);

    expect(service.toggle('123')).toBe(false);
    expect(service.isFavorite('123')).toBe(false);
  });

  it('persiste los favoritos entre instancias (localStorage)', () => {
    service.toggle('abc');

    const secondInstance = new FavoritesService();
    expect(secondInstance.isFavorite('abc')).toBe(true);
  });
});
