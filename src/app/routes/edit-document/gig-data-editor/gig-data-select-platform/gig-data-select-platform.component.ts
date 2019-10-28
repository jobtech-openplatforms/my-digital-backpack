import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { GigPlatformInfo } from '../../../../datatypes/GigPlatformInfo';

@Component({
  selector: 'app-gig-data-select-platform',
  templateUrl: './gig-data-select-platform.component.html',
  styleUrls: ['./gig-data-select-platform.component.css']
})
export class GigDataSelectPlatformComponent implements OnInit, OnChanges {

  @Input()
  platforms: GigPlatformInfo[];
  // platforms$: Observable<CVDataGigPlatformInfo[]>;

  @Output()
  selected = new EventEmitter<GigPlatformInfo>();

  @Input()
  alreadyAddedPlatforms = [];

  filteredPlatforms = [];

  searchPhrase = '';

  cvDataAuthorizeUrl: string = null;

  // platforms: CVDataGigPlatformInfo[];

  constructor() { }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.platforms) {
      this.updatePlatforms();
    }
  }

  onChangeSearch(value) {
    this.searchPhrase = value;
    this.updatePlatforms();
  }

  updatePlatforms() {
    this.filteredPlatforms = [];
    for (let i = 0; i < this.platforms.length; i++) {
      const platform = this.platforms[i];
      if (this.alreadyAddedPlatforms.indexOf(platform.id) !== -1) { // filter already added platforms
        continue;
      }
      if (this.searchPhrase.length > 0) { // apply search filter
        const lcSearch = this.searchPhrase.toLowerCase();
        const lcName = platform.organization.name.toLowerCase();
        if (lcName.indexOf(lcSearch) !== 0) {
          continue;
        }
      }
      this.filteredPlatforms.push(platform);
    }
    console.log(this.filteredPlatforms);

    function sortOnName(a, b) {
      return a.organization.name.toLowerCase().localeCompare(b.organization.name.toLowerCase());
    }
    this.filteredPlatforms.sort(sortOnName);
  }

  onAddCustomPlatform() {
    const newPlatformData = new GigPlatformInfo();
    newPlatformData.id = 'custom';
    newPlatformData.connectionType = 'UserCreated';
    this.onSelectDataSource(newPlatformData);
  }

  onSelectDataSource(platform: GigPlatformInfo) {
    this.selected.emit(JSON.parse(JSON.stringify(platform)));
  }

}
