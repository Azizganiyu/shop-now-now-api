import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MiscService {
  private readonly googleApiKey; // Store API Key in .env

  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.googleApiKey = this.configService.get<string>('google.apiKey');
    console.log(this.googleApiKey);
  }

  async searchLocation(query: string) {
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json`;

    try {
      const { data } = await firstValueFrom(
        this.httpService.get(url, {
          params: {
            input: query,
            key: this.googleApiKey,
            components: 'country:NG', // Restrict to Nigeria
          },
        }),
      );

      if (data.status !== 'OK') {
        throw new BadRequestException(
          data.error_message || 'Failed to fetch locations',
        );
      }

      // Filter results that mention Lagos to ensure they're in Lagos, Nigeria
      const filteredResults = data.predictions.filter((place: any) =>
        place.description.toLowerCase().includes('lagos'),
      );

      const results = await Promise.all(
        filteredResults.map(async (place: any) => {
          const details = await this.getPlaceDetails(place.place_id);
          return {
            description: place.description,
            lat: details.lat,
            lng: details.lng,
          };
        }),
      );

      return results;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error?.message ?? error);
    }
  }

  private async getPlaceDetails(placeId: string) {
    const url = `https://maps.googleapis.com/maps/api/place/details/json`;

    try {
      const { data } = await firstValueFrom(
        this.httpService.get(url, {
          params: {
            place_id: placeId,
            key: this.googleApiKey,
            fields: 'geometry',
          },
        }),
      );

      if (data.status !== 'OK') {
        throw new BadRequestException(
          data.error_message || 'Failed to fetch place details',
        );
      }

      return data.result.geometry.location;
    } catch (error) {
      throw new InternalServerErrorException(error?.message ?? error);
    }
  }
}
