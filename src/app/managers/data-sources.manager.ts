import { Injectable } from '@angular/core';
import { DataSourceType } from '../datatypes/DataSourceType';
import { DataSourceAuthType } from '../datatypes/DataSourceAuthType';
import { OrganizationData } from '../datatypes/OrganizationData';
import { Observable, Subject } from 'rxjs';
import { CvdataService } from '../services/cvdata.service';
import { PlatformService } from '../services/platform.service';
import { take } from 'rxjs/operators';
import { GigPlatformInfo } from '../datatypes/GigPlatformInfo';

@Injectable({
    providedIn: 'root'
})
export class DataSourcesManager {

    constructor(private readonly _cvDataService: CvdataService,
        private readonly _platformService: PlatformService) {

    }

    getAvailablePlatforms(platformIdsToExclude: string[] = null): Observable<GigPlatformInfo[]> {
        const result = new Subject<GigPlatformInfo[]>();

        if (platformIdsToExclude == null) {
            platformIdsToExclude = [];
        }

        // get local defined platforms
        const platformInfos: GigPlatformInfo[] = [];
        const platforms = this._platformService.getPlatforms();
        platforms.forEach(platform => {
            platformInfos.push({
                id: platform.id,
                externalPlatformId: platform.externalPlatformId,
                dataType: DataSourceType.GigPlatform,
                authType: DataSourceAuthType.EmailValidation,
                connectionType: 'ManuallyUpdated',
                organization: <OrganizationData>{
                    id: platform.id,
                    name: platform.name,
                    description: platform.description,
                    country: platform.country,
                    type: platform.type,
                    logo: platform.logo
                }
            });
        });
        setTimeout(() => {
            result.next(platformInfos);
        }, 0);


        // ask platform service for which live connections are available
        this._cvDataService.getAvailablePlatforms().pipe(take(1)).subscribe(livePlatforms => {
            livePlatforms.forEach(livePlatformInfo => {
                const platform = platformInfos.find((p: GigPlatformInfo) => p.externalPlatformId === livePlatformInfo.id);
                console.log(livePlatformInfo, platform);
                if (platform) {
                    platform.externalPlatformId = livePlatformInfo.id;
                    platform.authType = livePlatformInfo.authMechanism;
                    platform.connectionType = livePlatformInfo.isManual ? 'ManuallyUpdated' : 'Live';
                }

            }, error => {
                console.log(error);
                result.error(error);
            });
            result.next(platformInfos);
            result.complete();
        });

        return result;
    }
}
