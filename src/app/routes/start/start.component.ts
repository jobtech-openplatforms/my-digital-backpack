import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService, AuthenticatedUser } from '../../services/authentification.service';
import { ServerDataService } from '../../services/server-data.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {

  constructor() { }

  ngOnInit() {

  }


}
