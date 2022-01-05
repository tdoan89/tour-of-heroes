import { Component, OnInit } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css']
})
export class HeroSearchComponent implements OnInit {

  heroes$: Observable<Hero[]>;
  private searchTerms = new Subject<string>();

  constructor(
    private heroService: HeroService
  ) { }

  ngOnInit(): void {
    this.heroes$ = this.searchTerms.pipe(
      // wait 500ms after each keystroke before processing term 
      debounceTime(500),

      // ignore new term if identical to last term
      distinctUntilChanged(),

      // switch to new search observable each tim the term changes 
      switchMap((term: string) => this.heroService.searchHeroes(term))
    )
  }

  // Push a search term into observable stream
  search(term: string): void {
    this.searchTerms.next(term);
  }



}