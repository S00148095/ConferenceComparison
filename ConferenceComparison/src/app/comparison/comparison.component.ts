import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from '../service/http.service';
import { game } from '../game';

@Component({
  selector: 'app-comparison',
  templateUrl: './comparison.component.html',
  styleUrls: ['./comparison.component.css']
})
export class ComparisonComponent implements OnInit {
  team1: string;
  team2: string;
  team1Games: game[];
  team2Games: game[];
  t1W: number = 0;
  t1L: number = 0;
  t1D: number = 0;
  t1BP: number = 0;
  t1P: number = 0;
  t2W: number = 0;
  t2L: number = 0;
  t2D: number = 0;
  t2BP: number = 0;
  t2P: number = 0;
  t1Pincompat: number = 0;
  t2Pincompat: number = 0;
  comparableFixtures: string[] = [];
  incomparableFixturesT1: string[] = [];
  incomparableFixturesT2: string[] = [];
  fixturesNotPlayedT1: game[] = [];
  fixturesNotPlayedT2: game[] = [];
  hasLoaded: boolean = false;
  teams: string[] = ["Benetton Rugby", "Cardiff Blues", "Connacht Rugby", "Dragons", "Edinburgh Rugby", "Glasgow Warriors", "Leinster Rugby", "Munster Rugby", "Ospreys", "Scarlets", "Southern Kings", "Toyota Cheetahs", "Ulster Rugby", "Zebre Rugby Club"];
  places: string[] = ["Home", "Away"]
  possibleGames: game[] = [];
  constructor(private router: Router, private route: ActivatedRoute, private service: HttpService) {
    this.teams.forEach(element => {
      this.places.forEach(place => {
        var temp = new game;
        temp.BP = 0;
        temp.Location = place;
        temp.Opposition=element;
        temp.Result="";
        temp.Score="";
        this.possibleGames.push(temp);
      });
    });
  }

  GetDetails(competition) {
    this.service.getTeamGames(competition, this.team1).subscribe(val => {
      this.team1Games = val;
      if (this.hasLoaded) this.CalcFixtures()
      else this.hasLoaded = true;
    });
    this.service.getTeamGames(competition, this.team2).subscribe(val => {
      this.team2Games = val;
      if (this.hasLoaded) this.CalcFixtures()
      else this.hasLoaded = true;
    });
  }
  CalcFixtures() {
    this.team1Games.forEach(element => {
      if (this.team2Games.find(g => g.Opposition == element.Opposition && g.Location == element.Location)) {
        if (!this.comparableFixtures.includes(element.Opposition + " (" + element.Location + ")")) {
          this.comparableFixtures.push(element.Opposition + " (" + element.Location + ")");
        }
        this.AddPoints(element, 1);
      }
      else {
        if (!this.incomparableFixturesT1.includes(element.Opposition + " (" + element.Location + ")")) {
          this.incomparableFixturesT1.push(element.Opposition + " (" + element.Location + ")");
          switch (element.Result) {
            case "Win":
              this.t1Pincompat += 4;
              break;
            case "Draw":
              this.t1Pincompat += 2;
              break;
          }
          this.t1Pincompat+=element.BP;
        }
      }
    });
    this.team2Games.forEach(element => {
      if (this.team1Games.find(g => g.Opposition == element.Opposition && g.Location == element.Location)) {
        if (!this.comparableFixtures.includes(element.Opposition + " (" + element.Location + ")")) {
          this.comparableFixtures.push(element.Opposition + " (" + element.Location + ")");         
        }
        this.AddPoints(element, 2);
      }
      else {
        if (!this.incomparableFixturesT2.includes(element.Opposition + " (" + element.Location + ")")) {
          this.incomparableFixturesT2.push(element.Opposition + " (" + element.Location + ")");
          switch (element.Result) {
            case "Win":
              this.t2Pincompat += 4;
              break;
            case "Draw":
              this.t2Pincompat += 2;
              break;
          }
          this.t2Pincompat+=element.BP;
        }
      }
    });
    this.possibleGames.forEach(element => {
      if(this.team1Games.filter(g => g.Opposition===element.Opposition&&g.Location===element.Location).length==0&&element.Opposition!=this.team1){
          this.fixturesNotPlayedT1.push(element);
      }
      if(this.team2Games.filter(g => g.Opposition===element.Opposition&&g.Location===element.Location).length==0&&element.Opposition!=this.team2){
        this.fixturesNotPlayedT2.push(element);
    }
    });
    this.comparableFixtures.sort();
    this.incomparableFixturesT1.sort();
    this.incomparableFixturesT2.sort();
    this.fixturesNotPlayedT1.sort();
    this.fixturesNotPlayedT2.sort();
  }
  AddPoints(game: game, team: number) {
    if (team == 1) {
      switch (game.Result) {
        case "Win":
          this.t1W++;
          this.t1P += 4;
          break;
        case "Loss":
          this.t1L++;
          break;
        case "Draw":
          this.t1D++;
          this.t1P += 2;
          break;
      }
      this.t1BP += game.BP;
      this.t1P += game.BP;
    }
    else if (team == 2) {
      switch (game.Result) {
        case "Win":
          this.t2W++;
          this.t2P += 4;
          break;
        case "Loss":
          this.t2L++;
          break;
        case "Draw":
          this.t2D++;
          this.t2P += 2;
          break;
      }
      this.t2BP += game.BP;
      this.t2P += game.BP;
    }
  }
  ngOnInit() {
    this.route.queryParams.subscribe(
      params => {
        if (params["competition"] && params["team1"]) {
          this.team1 = params["team1"];
          this.team2 = params["team2"];
          this.GetDetails(params["competition"]);
        }
      });
  }

}
