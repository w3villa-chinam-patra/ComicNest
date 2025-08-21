export class TimeUtil {
  static getCurrentISOString(): string {
    return new Date().toISOString();
  }

  static addMinutesToISOString(minutes: number, baseTime?: string): string {
    const date = baseTime ? new Date(baseTime) : new Date();
    date.setMinutes(date.getMinutes() + minutes);
    return date.toISOString();
  }

  static isTimeExpired(expiresAt: string): boolean {
    const now = new Date();
    const expiration = new Date(expiresAt);
    return expiration.getTime() <= now.getTime(); // expired if expiresAt <= now
  }

  static isAfter(time1: string, time2: string): boolean {
    return new Date(time1).getTime() > new Date(time2).getTime();
  }

  static isBefore(time1: string, time2: string): boolean {
    return new Date(time1).getTime() < new Date(time2).getTime();
  }

  static getAbsoluteDifferenceInMinutes(time1: string, time2: string): number {
    const date1 = new Date(time1);
    const date2 = new Date(time2);
    const diffMs = Math.abs(date1.getTime() - date2.getTime());
    return Math.floor(diffMs / 60000); // 60000 ms = 1 minute
  }
}
