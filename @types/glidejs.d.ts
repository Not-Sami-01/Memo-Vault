declare module '@glidejs/glide' {
  export default class Glide {
    constructor(selector: string, options?: any);
    mount(): void;
    destroy(): void;
  }
}
