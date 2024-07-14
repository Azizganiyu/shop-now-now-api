import { ApiProperty } from '@nestjs/swagger';
import { ApiResponseDto } from 'src/modules/misc/responses/api-response.dto';
import {
  DescriptorResponse,
  DescriptorResponseWithcategoryId,
} from './product-descriptor-response';

class ProductDataResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  ingredient: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  packSize: number;

  @ApiProperty()
  strength: number;

  @ApiProperty()
  costPrice: number;

  @ApiProperty()
  sellingPrice: number;

  @ApiProperty()
  stock: number;

  @ApiProperty()
  categoryId: string;

  @ApiProperty()
  category: DescriptorResponse;

  @ApiProperty()
  packUnitId: string;

  @ApiProperty()
  packUnit: DescriptorResponse;

  @ApiProperty()
  presentationId: string;

  @ApiProperty()
  image: string;

  @ApiProperty()
  presentation: DescriptorResponse;

  @ApiProperty()
  strengthUnitId: string;

  @ApiProperty()
  strengthUnit: DescriptorResponse;

  @ApiProperty()
  manufacturerId: string;

  @ApiProperty()
  manufacturer: DescriptorResponse;

  @ApiProperty()
  subCategoryId: string;

  @ApiProperty()
  subCategory: DescriptorResponseWithcategoryId;

  @ApiProperty()
  status: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class ProductResponse extends ApiResponseDto {
  @ApiProperty({ type: ProductDataResponse })
  data: ProductDataResponse;
}

export class ProductResponseAll extends ApiResponseDto {
  @ApiProperty({ type: ProductDataResponse, isArray: true })
  data: ProductDataResponse[];
}
