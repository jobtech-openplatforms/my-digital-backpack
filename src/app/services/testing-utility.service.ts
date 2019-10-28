import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentification.service';
import { ServerDataService } from './server-data.service';

@Injectable({
  providedIn: 'root'
})
export class TestingUtilityService {

  constructor(private auth: AuthenticationService, private serverData: ServerDataService) {
    window['testing'] = this; // makes service accessable from outside testing framework
  }
}
