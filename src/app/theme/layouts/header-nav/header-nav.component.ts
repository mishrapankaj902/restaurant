import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Helpers } from '../../../helpers';

declare let mLayout: any;
@Component({
    selector: "app-header-nav",
    templateUrl: "./header-nav.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class HeaderNavComponent implements OnInit, AfterViewInit {

    UserName: any;
    EmailAddress: any;
    constructor() {

    }
    ngOnInit() {
      let currentUser = JSON.parse(localStorage.getItem('currentUser'));
     let SelectedRestaurant = JSON.parse(localStorage.getItem('SelectedRestaurant'));
      $('#selectedRestaurantName').text(SelectedRestaurant.Restaurant.Name);
        if (currentUser != null)
            if (currentUser.data != null) {
                this.UserName = currentUser.data.FirstName + " " + currentUser.data.LastName;
                this.EmailAddress = currentUser.data.EmailAddress;
            }
    }
    ngAfterViewInit() {

        mLayout.initHeader();

    }

}
