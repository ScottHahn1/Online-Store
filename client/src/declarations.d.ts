declare module '*.jpg';
declare module '*.png';

declare module '@paystack/inline-js' {
  export default class PaystackPop {
    constructor(options?: PaystackInlineOptions);
    openIframe(): void;
    resumeTransaction(access_code: string): void;
  }
}