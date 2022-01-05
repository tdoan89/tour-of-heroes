import { Component, OnInit } from '@angular/core';
import { HeroService } from '../hero.service';
import { Hero } from '../hero';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css'],
})
export class HeroesComponent implements OnInit {
  heroes: Hero[] = [];
  // selectedHero?: Hero;

  constructor(private heroService: HeroService) {}

  ngOnInit() {
    this.heroService.getHeroes().subscribe((heroes) => {
      this.heroes = heroes;
    });
  }

  add(heroName: string): void {
    heroName = heroName.trim();
    if (!heroName) {
      return;
    } else {
      this.heroService
        .addHero({ name: heroName } as Hero)
        .subscribe((addedHero) => this.heroes.push(addedHero));
    }
  }

  delete(hero: Hero): void {
    this.heroService.deleteHero(hero.id).subscribe((deletedHero) => {
      this.heroes = this.heroes.filter((h) => h.id !== hero.id);
    });
  }
  // onSelect(hero: Hero) {
  //   this.selectedHero = hero;
  //   this.MessageService.add(`HeroesComponent: Selected hero id=${hero.id}`);
  // }
}
