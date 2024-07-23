export class Order {
  constructor(
    public orderId: string,
    public userEmail: string,
    public totalItems: number,
    public totalPrice: number,
    public paymentMethod: string,
    public productTitles: string[],
    public productImages: string[],
    public productPrices: number[],
    public productQuantities: number[],
    public orderDate: Date) {}
}
