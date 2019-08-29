import { NgModule } from '@angular/core';
import { ThemeComponent } from './theme.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from "../auth/_guards/auth.guard";

const routes: Routes = [
    {
        "path": "",
        "component": ThemeComponent,
        "canActivate": [AuthGuard],
        "children": [
            {
                "path": "index",
                "loadChildren": ".\/pages\/default\/index\/index.module#IndexModule"
            },
            {
                "path": "menu",
                "loadChildren": ".\/pages\/default\/menu\/menu.module#MenuModule"
            },
            {
                "path": "restaurantCategory",
                "loadChildren": ".\/pages\/default\/restaurant-category\/restaurant-category.module#RestaurantCategoryModule"
            },
            {
                "path": "tblManagement",
                "loadChildren": ".\/pages\/default\/tbl-management\/tbl-management.module#TblManagementModule"
            },
            {
                "path": "offer",
                "loadChildren": ".\/pages\/default\/offers\/offers.module#OffersModule"
            },
            {
                "path": "reservations",
                "loadChildren": ".\/pages\/default\/reservations\/reservations.module#ReservationsModule"
            },
            {
                "path": "liveorders",
                "loadChildren": ".\/pages\/default\/live-orders\/live-orders.module#LiveOrdersModule"
            },
            {
                "path": "header\/profile",
                "loadChildren": ".\/pages\/default\/header\/header-profile\/header-profile.module#HeaderProfileModule"
            },
            {
                "path": "404",
                "loadChildren": ".\/pages\/default\/not-found\/not-found.module#NotFoundModule"
            },
            {
                "path": "",
                "redirectTo": "index",
                "pathMatch": "full"
            }
        ]
    },
    {
        "path": "**",
        "redirectTo": "404",
        "pathMatch": "full"
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ThemeRoutingModule { }