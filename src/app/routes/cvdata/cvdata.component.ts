import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CvdataService } from '../../services/cvdata.service';
import { HeaderService } from '../../components/header/header.service';

@Component({
  selector: 'app-cvdata',
  templateUrl: './cvdata.component.html',
  styleUrls: ['./cvdata.component.css']
})
export class CvdataComponent implements OnInit {

  constructor(
    private readonly _cvDataService: CvdataService,
    private readonly _activatedRoute: ActivatedRoute,
    private header: HeaderService
  ) { }

  ngOnInit() {
    this.header.showHeader = false;

    this._activatedRoute.fragment.subscribe(fragment => {

      if (fragment != null) {
        const splittedFragment = fragment.split('&');

        const accessTokenPair = splittedFragment.find(fp => fp.startsWith('access_token='));
        if (accessTokenPair != null) {
          // this is callback from authentication against CVData
          const accessToken = accessTokenPair.split('=')[1];
          this._cvDataService.setToken(accessToken);
        }
      }
    });

    this._activatedRoute.queryParamMap.subscribe(paramMap => {
      if (paramMap.has('platform_id')) {
        const platformId = paramMap.get('platform_id');
        this._cvDataService.setPlatformConnectionDone(platformId);
      }
    });
  }
}
