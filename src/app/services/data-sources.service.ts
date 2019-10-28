import { Injectable } from '@angular/core';
import { DataSourceType } from '../datatypes/DataSourceType';
import { GigPlatformData } from '../datatypes/GigPlatformData';
import { ServerDataService } from './server-data.service';

@Injectable({
  providedIn: 'root'
})
export class DataSourcesService {

  constructor(private serverData: ServerDataService) {
  }

  requestVerificationByEmail(userId, dataSourceId, email, profileUrl) {
    return new Promise((resolve, reject) => {
      const data = {
        type: 'ManualValidationRequest',
        data: {
          userId: userId,
          dataSourceId: dataSourceId,
          email: email,
          profileUrl: profileUrl
        }
      };
      this.serverData.createServerCommand(data);
      const emailValidationRequired = true;
      resolve(emailValidationRequired);
    });
  }

  checkIfEmailIsVerified() {

  }
}

export class GigDataAggregator {
  static aggregate(data: any): GigPlatformData {
    // TODO: work with actual gig data
    const gigData = new GigPlatformData();
    gigData.noOfGigs = 24;
    gigData.noOfRatings = Math.round(Math.random() * 50);
    gigData.averageRating.min = 1;
    gigData.averageRating.max = 5;
    gigData.averageRating.value = Math.round(30 + Math.random() * 20) / 10;
    gigData.percentageSuccessful = 0.82;
    gigData.startDate = '2017-03-12';
    gigData.endDate = '2018-11-22';
    return (gigData);
  }
}

export class SourceUpdateData {
  sourceId: string;
  sourceType: DataSourceType;
  time: number;
  data: any;
}

