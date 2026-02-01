declare module '*.jpg';
declare module '*.png';

declare module '@paystack/inline-js' {
  interface PaystackInlineOptions {
    key: string;
    email: string;
    amount: number;
    ref?: string;
    metadata?: Record<string, any>;
    callback: (response: { reference: string }) => void;
    onClose?: () => void;
  }

  export default class PaystackPop {
    constructor(options?: PaystackInlineOptions);
    openIframe(): void;
    resumeTransaction(access_code: string): void;
  }
}