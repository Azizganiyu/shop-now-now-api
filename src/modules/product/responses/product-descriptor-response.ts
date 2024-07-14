import { ApiProperty } from '@nestjs/swagger';
import { ApiResponseDto } from 'src/modules/misc/responses/api-response.dto';

export class DescriptorResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  status: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class DescriptorResponseWithcategoryId extends DescriptorResponse {
  @ApiProperty()
  categoryId: string;
}

class DataDescriptorResponse extends ApiResponseDto {
  @ApiProperty({ type: DescriptorResponse })
  data: DescriptorResponse;
}

class DataDescriptorResponseAll extends ApiResponseDto {
  @ApiProperty({ type: DescriptorResponse, isArray: true })
  data: DescriptorResponse[];
}

export class ProductCategoryResponse extends DataDescriptorResponse {}
export class ProductSubCategoryResponse extends ApiResponseDto {
  @ApiProperty({ type: DescriptorResponseWithcategoryId })
  data: DescriptorResponseWithcategoryId;
}
export class ProductPresentationResponse extends DataDescriptorResponse {}
export class ProductManufacturerResponse extends DataDescriptorResponse {}
export class ProductStrengthUnitResponse extends DataDescriptorResponse {}
export class ProductPackUnitResponse extends DataDescriptorResponse {}

export class ProductCategoryResponseAll extends DataDescriptorResponseAll {}
export class ProductSubCategoryResponseAll extends ApiResponseDto {
  @ApiProperty({ type: DescriptorResponseWithcategoryId, isArray: true })
  data: DescriptorResponseWithcategoryId[];
}
export class ProductPresentationResponseAll extends DataDescriptorResponseAll {}
export class ProductManufacturerResponseAll extends DataDescriptorResponseAll {}
export class ProductStrengthUnitResponseAll extends DataDescriptorResponseAll {}
export class ProductPackUnitResponseAll extends DataDescriptorResponseAll {}
