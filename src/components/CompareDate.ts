export default class Helpers {
  private previousValue: any;

  constructor() {
      this.previousValue = null;
  }

  public compareValue(currentValue: any): boolean {
      if (this.previousValue !== null) {
          if (currentValue === this.previousValue) {
              return true;
          } else {
              this.previousValue = currentValue;
              return false;
          }
      }

      this.previousValue = currentValue;
      return false;
  }
}