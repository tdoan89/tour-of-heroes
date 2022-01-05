import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Hero } from './hero';
import { MessageService } from './message.service';
// import { HEROES } from './mock-heroes';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  private heroesUrl = '/api/heroes'; // url to web api

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(
    private messageService: MessageService,
    private http: HttpClient
  ) {}

  /** Get heroes from the server */
  getHeroes(): Observable<Hero[]> {
    // let heroes = of(HEROES);
    // this.messageService.add('HeroService: fetched heroes');
    // return heroes;
    return this.http.get<Hero[]>(this.heroesUrl).pipe(
      tap((_) => this.log('fetched heroes')),
      catchError(this.handleError<Hero[]>('getHeroes', []))
    );
  }

  /** Get heroes by id, return 404 when none found */
  getHero(id: number): Observable<Hero> {
    // const hero = HEROES.find((h) => h.id === id);
    // this.messageService.add(`HeroService: fetch hero id=${id}`);
    // return of(hero);
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap((_) => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  /** Get heroes by id, return 'undefined' when not found */
  getHeroNo404(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/?id=${id}`;
    return this.http.get<Hero>(url).pipe(
      map((heroes) => heroes[0]),
      tap((h) => {
        const outcome = h ? 'fetched' : 'did not find';
        this.log(`${outcome} hero /w id=${id}`);
      }),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  /** GET heroes whose name contains searched term */
  searchHeroes(term: string): Observable<Hero[]> {
    term = term.trim();
    if (!term) {
      // If not search term, return empty array
      return of([]);
    } else {
      const searchUrl = `${this.heroesUrl}/?name=${term}`;
      return this.http.get<Hero[]>(searchUrl).pipe(
        tap((result) =>
          result.length
            ? this.log(`found ${result.length} heroes matching "${term}"`)
            : this.log(`no heroes matching "${term}"`)
        ),
        catchError(this.handleError<Hero[]>('searchHeroes', []))
      );
    }
  }

  /** POST: add a hero to the server */
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`add hero /w id=${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  /** PUT: update hero on the server */
  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((_) => this.log(`update hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  /** DELETE: delete a hero on the server */
  deleteHero(heroId: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${heroId}`;
    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ =>
        this.log(`terminated hero /w name=${heroId}`)
      ),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string): void {
    this.messageService.add(`HeroService: ${message}`);
  }
}
