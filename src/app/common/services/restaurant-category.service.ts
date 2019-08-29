import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import { RestaurantCategory } from "../models/restaurant-category";
import {AppSettings} from '../../appsettings'

@Injectable()
export class RestaurantCategoryService {
    
    apiURL = AppSettings.API_ENDPOINT;
    constructor(private http: Http) {
    }

    getAllRestaurantCategory() {
        return this.http.get(this.apiURL + '/api/restaurantcategory', this.jwt()).map((response: Response) => response.json());
    }

    update(menu: RestaurantCategory) {
        return this.http.put(this.apiURL + '/api/restaurantcategory', menu, this.jwt()).map((response: Response) => response.json());
    }

    add(menu: RestaurantCategory) {
        return this.http.post(this.apiURL + '/api/restaurantcategory', menu, this.jwt()).map((response: Response) => response.json());
    }

    delete(id: any) {
        return this.http.delete(this.apiURL + '/api/restaurantcategory/' + id, this.jwt()).map((response: Response) => response.json());
    }

  getRestaurantsByCatId(catId: any,userId:any) {
    return this.http.get(this.apiURL + '/api/restaurant/categoryId/' + catId + '/user/' + userId, this.jwt()).map((response: Response) => response.json());
    }
    private jwt() {
        // create authorization header with jwt token
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            let headers = new Headers({ 'x-access-token': currentUser.token, 'content-type': 'application/json' });
            return new RequestOptions({ headers: headers });
        }
    }

}
