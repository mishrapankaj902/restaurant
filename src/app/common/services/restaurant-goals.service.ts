import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import { RestaurantGoals } from "../models/restaurant-goals";
import {AppSettings} from '../../appsettings'

@Injectable()
export class RestaurantGoalsService {
    
    apiURL = AppSettings.API_ENDPOINT;
    constructor(private http: Http) {
    }
    getGoalsByRestaurant(id: any,currentMonth:any) {
        return this.http.get(this.apiURL + '/api/restaurant/' + id + '/goals/' + currentMonth, this.jwt()).map((response: Response) => response.json());
    }
    getRestaurantGoals() {
        return this.http.get(this.apiURL + '/api/restaurantgoals', this.jwt()).map((response: Response) => response.json());
    }

    update(menu: RestaurantGoals) {
        return this.http.put(this.apiURL + '/api/restaurantgoals', menu, this.jwt()).map((response: Response) => response.json());
    }

    add(menu: RestaurantGoals) {
        return this.http.post(this.apiURL + '/api/restaurantgoals', menu, this.jwt()).map((response: Response) => response.json());
    }

    delete(id: any) {
        return this.http.delete(this.apiURL + '/api/restaurantgoals/' + id, this.jwt()).map((response: Response) => response.json());
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
