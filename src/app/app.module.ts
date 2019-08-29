import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ThemeComponent } from './theme/theme.component';
import { LayoutModule } from './theme/layouts/layout.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ScriptLoaderService } from './_services/script-loader.service';
import { ThemeRoutingModule } from './theme/theme-routing.module';
import { AuthModule } from './auth/auth.module';
import { MenuService } from './common/services/menu.service';
import { ProductService } from './common/services/product.service';
import { RestaurantService } from './common/services/restaurant.service';
import { MenuCategoryService } from './common/services/menucategory.service';
import { RestaurantCategoryService } from './common/services/restaurant-category.service';
import { OfferService } from './common/services/offer.service';
import { TableService } from './common/services/table.service';
import { RestaurantGoalsService } from './common/services/restaurant-goals.service';
import { DashboardService } from './common/services/dashboard.service';

@NgModule({
  declarations: [
    ThemeComponent,
    AppComponent
  ],
  imports: [
    LayoutModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ThemeRoutingModule,
    AuthModule,
    BrowserAnimationsModule,
  ],
  providers: [ScriptLoaderService,
    MenuService,
    MenuCategoryService,
    RestaurantService,
    ProductService,
    RestaurantCategoryService, RestaurantGoalsService, DashboardService,
    OfferService, TableService],
  bootstrap: [AppComponent]
})
export class AppModule { }
