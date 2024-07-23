export class BuildingMaterial {
  constructor(
    public id: string,
    public title: string,
    public category: string,
    public description: string,
    public image: string,
    public productTypes: string[],
    public productImages: string[],
    public productPrices: number[],
    public quantity: number
  ) {}
}
