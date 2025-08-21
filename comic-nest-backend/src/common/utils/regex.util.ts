export class RegexUtil {
  static isValidMobileNumber(phone: string): boolean {
    const regex = /^\+\d{1,4}\d{10}$/;
    return regex.test(phone);
  }
}
