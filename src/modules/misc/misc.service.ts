import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { productData } from './product.data';
import { productImage } from './product.image';
import { HelperService } from 'src/utilities/helper.service';
import { ProductService } from '../product/product-services/product.service';
import { ProductCategoryService } from '../product/product-services/category.service';

@Injectable()
export class MiscService {
  private readonly googleApiKey; // Store API Key in .env

  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
    private helperService: HelperService,
    private productService: ProductService,
    private productCategoryService: ProductCategoryService,
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

  async uploadProducts() {
    const products = productData;
    const images = productImage;
    const categories = await this.productCategoryService.findAll(true);

    console.log('processing products...');
    const updatedProducts = products.map((product) => {
      let imageUrl = '';

      const matches = [];

      for (const image of images) {
        matches.push({
          match: this.helperService.checkMatch(product.item, image.image),
          image: image.image,
          product: product.item,
        });
      }

      const sortedMatches = matches.sort((a, b) => b.match - a.match);
      imageUrl = sortedMatches[0].image;
      const categoryMatches = [];

      for (const category of categories) {
        categoryMatches.push({
          match: this.helperService.checkMatch(product.category, category.name),
          category: category.name,
          categoryId: category.id,
        });
      }

      const sortedCategoryMatches = categoryMatches.sort(
        (a, b) => b.match - a.match,
      );
      const categoryId = sortedCategoryMatches[0].categoryId;

      return {
        ...product,
        categoryId,
        imageUrl,
      };
    });

    console.log('uploading products...');
    console.log(updatedProducts.length);
    let created = 0;
    const errors = [];
    for (const product of updatedProducts) {
      const payload = {
        name: product.item,
        image: `https://api.shopnownow.app/uploads/files/${product.imageUrl}`,
        categoryId: product.categoryId,
        sku: this.helperService.idFromName(product.item),
        stock: 100000000,
        costPrice: parseFloat(product.price.replace(/,/g, '')),
        sellingPrice: parseFloat(product.price.replace(/,/g, '')),
      };
      try {
        await this.productService.create(payload);
      } catch (error) {
        console.log(error);
        errors.push(payload);
      }
      created++;
      console.log(`created ${created} of ${updatedProducts.length}`);
    }
    console.log('Errors', errors.length, errors);
  }
}
