import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

const STORAGE_KEY = 'oil-stations:favoritos';

/**
 * Gasolineras favoritas guardadas en localStorage: no hace falta backend ni
 * login, es una preferencia puramente del navegador de cada usuario.
 */
@Injectable({
  providedIn: 'root'
})
export class FavoritesService {

  private readonly favoriteIds = new Set<string>(this.readFromStorage());

  private readonly changes = new Subject<void>();
  /** Emite cada vez que se añade o quita un favorito, para que la UI (p.ej. el contador del menú) se mantenga al día. */
  readonly changes$: Observable<void> = this.changes.asObservable();

  private readFromStorage(): string[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      // localStorage puede no estar disponible (modo privado, cuota llena...); no es crítico.
      return [];
    }
  }

  private persist(){
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...this.favoriteIds]));
    } catch {
      // Igual que arriba: si no se puede guardar, la sesión actual sigue funcionando en memoria.
    }
  }

  isFavorite(id: string): boolean {
    return this.favoriteIds.has(id);
  }

  /** Alterna el estado y devuelve el nuevo valor (true = ahora es favorita). */
  toggle(id: string): boolean {
    if(this.favoriteIds.has(id)){
      this.favoriteIds.delete(id);
    }else{
      this.favoriteIds.add(id);
    }
    this.persist();
    this.changes.next();
    return this.isFavorite(id);
  }

  getAll(): string[] {
    return [...this.favoriteIds];
  }

}
