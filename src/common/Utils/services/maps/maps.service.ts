import { BadRequestException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class MapService {
  constructor(private readonly http: HttpService) {}

  async geocoding(address: string) {
    const response = await this.http.axiosRef.get(
      'https://maps.googleapis.com/maps/api/geocode/json',
      {
        params: {
          address,
          key: process.env.MAPS_API,
        },
      },
    );

    const result = response.data.results[0];

    if (!result) {
      throw new BadRequestException('Invalid address');
    }
    return {
      formattedAddress: result.formatted_address,
      lat: result.geometry.location.lat,
      lng: result.geometry.location.lng,
    };
  }
}
