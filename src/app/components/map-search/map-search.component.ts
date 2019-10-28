import { Component, OnInit, Input, ViewChild, ElementRef, NgZone } from '@angular/core';
import { MapsAPILoader } from '@agm/core';

@Component({
  selector: 'app-map-search',
  templateUrl: './map-search.component.html',
  styleUrls: ['./map-search.component.css']
})
export class MapSearchComponent implements OnInit {
  @Input()
  public location;

  @ViewChild('locationSearch')
  public searchElementRef: ElementRef;

  public googleMapsData = {
    zoom: 4
  };

  constructor(private ngZone: NgZone, private mapsAPILoader: MapsAPILoader) { }

  ngOnInit() {
    // load Places Autocomplete
    this.mapsAPILoader.load().then((test) => {
      const google = <any>(<any>window).google;
      const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ['address']
      });

      console.log('autocomplete', autocomplete);
      const getLocation = () => {
        console.log('getLocation');
        this.ngZone.run(() => {
          // get the place result
          const place = autocomplete.getPlace();
          // verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          // set latitude, longitude and zoom
          this.location.latitude = place.geometry.location.lat();
          this.location.longitude = place.geometry.location.lng();

          const adress = place.formatted_address.split(', ');
          this.location.city = adress[1].replace(/\d+|^\s+|\s+$/g, ''); // remove numbers and spaces around city name
          this.location.country = adress.slice(2, 9).join(', ');
          console.log(this.location);

          console.log(place);

          this.googleMapsData.zoom = 12;
        });
      };

      autocomplete.addListener('place_changed', getLocation);

      if (this.location.city === '') {
        this.setCurrentPosition();
      }
    });
  }

  private setCurrentPosition() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.location.latitude = position.coords.latitude;
        this.location.longitude = position.coords.longitude;
        this.googleMapsData.zoom = 4;
      });
    }
  }

}
