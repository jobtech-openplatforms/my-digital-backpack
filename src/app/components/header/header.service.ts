import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  public showHeader = true;
  public backRoute = '';
  public pageTitle = '';
  public showSharing = false;
  public showLoggedInUser = true;

  constructor() { }
}
