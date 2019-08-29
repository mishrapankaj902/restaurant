export class MenuModel {
    _id: String;
    Name: String;
    MenuCategoryId: String;
    ProductId: String;
    RestaurantId: String;
    CreatedDate: Date;
    ModifiedDate: Date;
    Description: String;
    PriceDelivery: Number;
    CostExcelTax: Number;
    TaxLevel: String;
    TaxLevelTakeAway: String;
    TaxLevelDelivery: String;
    Barcode: String;
    ReductionAmount: Number;
	  DiscountEvent:String;
    RunTimeEventDate: String;
    RunTimeEventTime: String;
    RecurreningEvent: String;
    DietaryType: Array<String>;
}
