import { Injectable } from '@nestjs/common';
import { BMIType, CalculateBmiDto } from '../dto/calculate-bmi.dto';

@Injectable()
export class BmiService {
  calculateBmi(dto: CalculateBmiDto): { bmi: number; category: BMIType } {
    const { height, weight } = dto;

    // BMI Formula: weight (kg) / (height (m)^2)
    const bmi = weight / (height / 100) ** 2;

    // Determine BMI Category
    let category: BMIType;
    if (bmi < 18.5) {
      category = BMIType.underweight;
    } else if (bmi >= 18.5 && bmi < 24.9) {
      category = BMIType.normal;
    } else if (bmi >= 25 && bmi < 29.9) {
      category = BMIType.overweight;
    } else {
      category = BMIType.obesity;
    }

    if (dto.sendEmail) {
      // send mail
    }

    return { bmi: parseFloat(bmi.toFixed(2)), category };
  }
}
