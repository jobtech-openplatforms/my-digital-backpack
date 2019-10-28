import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.css']
})
export class StarRatingComponent implements OnInit, OnChanges {

  @Input()
  noOfStars = 5;

  @Input()
  value = 5;

  starList = [];
  percentageString = '';

  constructor() { }

  ngOnInit() {

  }

  ngOnChanges() {
    this.starList = [];
    for (let i = 0; i < this.noOfStars; i++) {
      this.starList.push(i + 1);
    }

    this.percentageString = '' + Math.round((this.value / this.noOfStars) * 100) + '%';
  }

}
