import { Component, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';
import { option } from '../option';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  competition:number;
  team1:string;
  team2:string;
  options:option[]=[{"Name":"Pro14","Teams":["Benetton Rugby","Cardiff Blues","Connacht Rugby","Dragons","Edinburgh Rugby","Glasgow Warriors","Leinster Rugby","Munster Rugby","Ospreys","Scarlets","Southern Kings","Toyota Cheetahs","Ulster Rugby","Zebre Rugby Club"]}]
  team1Options:string[];
  team2Options:string[];
  constructor(private router:Router) { }

  setTeams(val:number){
    switch(val){
      case 0:
      this.team1Options=this.options[this.competition].Teams;
      this.team2Options=this.options[this.competition].Teams;
      break;
      case 1:
      this.team2Options=this.options[this.competition].Teams.filter(
        t => t !== this.team1);
      break;
      case 2:
      this.team1Options=this.options[this.competition].Teams.filter(
        t => t !== this.team2);
      break;
    }
  }
  SendComparison(){    
    this.router.navigate(['/comparison'], { queryParams: { competition: this.options[this.competition].Name, team1: this.team1, team2: this.team2 } });
  }

  ngOnInit() {
  }
}
