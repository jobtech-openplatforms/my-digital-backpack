import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { trigger, animate, style, group, animateChild, query, stagger, transition } from '@angular/animations';
import { CvdataService } from './services/cvdata.service';
import { TestingUtilityService } from './services/testing-utility.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('routerTransition', [
      transition('depth01 => depth02, depth02 => depth03, depth01 => depth03', [
        /* order */
        /* 1 */ query(':enter, :leave', style({ position: 'fixed', width: '100%', height: '100%' })
        , { optional: true }),
        /* 2 */ group([  // block executes in parallel
          query(':enter', [
            style({ transform: 'translateX(100%)' }),
            animate('0.3s ease-in-out', style({ transform: 'translateX(0%)' }))
          ], { optional: true }),
          query(':leave', [
            style({ transform: 'translateX(0%)' }),
            animate('0.3s ease-in-out', style({ transform: 'translateX(-100%)' }))
          ], { optional: true }),
        ])
      ]),
      transition('depth02 => depth01, depth03 => depth01, depth03 => depth02', [
        /* order */
        /* 1 */ query(':enter, :leave', style({ position: 'fixed', width: '100%', height: '100%' })
        , { optional: true }),
        /* 2 */ group([  // block executes in parallel
          query(':enter', [
            style({ transform: 'translateX(-100%)' }),
            animate('0.3s ease-in-out', style({ transform: 'translateX(0%)' }))
          ], { optional: true }),
          query(':leave', [
            style({ transform: 'translateX(0%)' }),
            animate('0.3s ease-in-out', style({ transform: 'translateX(100%)' }))
          ], { optional: true }),
        ])
      ])
    ])
  ]
})
export class AppComponent implements OnInit {
  title = 'app';

  cvDataAuthenticationActive = false;

  constructor(private readonly _cvDataService: CvdataService, private testUtilities: TestingUtilityService) { }

  ngOnInit(): void {
    this._cvDataService.showAuthentication.subscribe(shouldShowAuthentication => {
      this.cvDataAuthenticationActive = shouldShowAuthentication;
    });
  }

  getState(outlet) {
    return outlet.activatedRouteData.state;
  }
}
