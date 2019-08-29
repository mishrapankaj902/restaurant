export class Restaurant {
    _id: String;
    Name: String;
    Address: String;
    City: String;
    Description: String;
    DisNationality: String;
    DishType: String;
    Images: [
        {
            Id: String,
            Path: String
        }
    ];
    Label: String;
    Lat: Number;
    Long: Number;
    Picture: String;
    Rating: Number;
    Reviews: [String];
    State: String;
    Tags: String;
    ThumbNail: String;
    Title: String;
    Zip: String;
    Price: Number;
    Email: String;
  RestaurantCategoryId: String;
  RestaurantCategoryName: String;
    StripeId: String;
    UserId: String;
    PhoneNumber: Number;
    CreatedDate: Date;
    ModifiedDate: Date;
    OpeningTime: String;
    ClosingTime: String;
    TotalSeats: Number;
    DietaryType: Array<String>;
}
