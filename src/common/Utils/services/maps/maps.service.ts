import { BadRequestException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class MapService {
  constructor(private readonly http: HttpService) {}

  async geocoding(address: string) {
    const cleanAddress = address.trim();
    const response = await this.http.axiosRef.get(
      'https://api.opencagedata.com/geocode/v1/json',
      {
        params: {
          q: cleanAddress, 
          key: process.env.MAPS_API as string,
          language: 'en',
          region: 'eg',
        },
      },
    );

    const { results, status } = response.data;

    if (!results || results.length === 0 || status.code !== 200) {
      throw new BadRequestException(
        `Invalid address: ${status?.message || 'unknown error'}`,
      );
    }

    const result = results[0];
    return {
      formattedAddress: result.formatted,
      lat: result.geometry.lat,
      lng: result.geometry.lng,
    };
  }
}
