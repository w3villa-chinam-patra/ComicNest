import { appConstants, errorMessages } from '../constants';

export class RandomNumberUtil {
  static generateRandomNumber(digits: number) {
    if (digits <= appConstants.TRUTHY_FALSY_VALUES.ZERO) {
      throw new Error(errorMessages.MUST_BE_GREATER_THAN_ZERO.message);
    }

    const min = Math.pow(
      appConstants.DECIMAL_RADIX,
      digits - appConstants.TRUTHY_FALSY_VALUES.ONE,
    );
    const max =
      Math.pow(appConstants.DECIMAL_RADIX, digits) -
      appConstants.TRUTHY_FALSY_VALUES.ONE;

    const random =
      Math.floor(
        Math.random() * (max - min + appConstants.TRUTHY_FALSY_VALUES.ONE),
      ) + min;
    return random.toString();
  }
}
