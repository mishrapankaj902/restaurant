import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import { RestaurantTips } from '../models/restaurant-tips'
import { RestaurantSpendure } from '../models/restaurant-spendure'
import { RestaurantGrowth } from '../models/restaurant-growth'
import {AppSettings} from '../../appsettings'

@Injectable()
export class DashboardService {
    
    apiURL = AppSettings.API_ENDPOINT;
    constructor(private http: Http) {
    }
    getAverageTipsByRestaurant(id: any,currentMonth:any) {
        return this.http.get(this.apiURL + '/api/restaurant/' + id + '/tips/month/' + currentMonth, this.jwt()).map((response: Response) => response.json());
    }
    getAverageTipsByRestaurantdate(id: any, date: any) {
        return this.http.get(this.apiURL + '/api/restaurant/' + id + '/tips/' + date, this.jwt()).map((response: Response) => response.json());
    }
    getAverageTipsByRestaurantRange(id: any, startDate: any, enddate:any) {
        return this.http.get(this.apiURL + '/api/restaurant/' + id + '/tips/' + startDate + '/' + enddate, this.jwt()).map((response: Response) => response.json());
    }
    getRestaurantTips() {
        return this.http.get(this.apiURL + '/api/restauranttips', this.jwt()).map((response: Response) => response.json());
    }
    getAverageTipsYear(id: any, year: any) {
        return this.http.get(this.apiURL + '/api/restaurant/' + id + '/tipsyear/' + year, this.jwt()).map((response: Response) => response.json());
    }
    updateTips(menu: RestaurantTips) {
        return this.http.put(this.apiURL + '/api/restauranttips', menu, this.jwt()).map((response: Response) => response.json());
    }

    addTips(menu: RestaurantTips) {
        return this.http.post(this.apiURL + '/api/restauranttips', menu, this.jwt()).map((response: Response) => response.json());
    }

    deleteTips(id: any) {
        return this.http.delete(this.apiURL + '/api/restauranttips/' + id, this.jwt()).map((response: Response) => response.json());
    }

    ///Spendure
    getSpendureByRestaurant(id: any, date: any) {
        return this.http.get(this.apiURL + '/api/restaurant/' + id + '/spendure/' + date, this.jwt()).map((response: Response) => response.json());
    }
    getSpendureByRestaurantRange(id: any, startDate: any, enddate: any) {
        return this.http.get(this.apiURL + '/api/restaurant/' + id + '/spendure/' + startDate + '/' + enddate, this.jwt()).map((response: Response) => response.json());
    }
    getSpendureByRestaurantMonth(id: any, currentMonth: any) {
        return this.http.get(this.apiURL + '/api/restaurant/' + id + '/spendure/month/' + currentMonth, this.jwt()).map((response: Response) => response.json());
    }
    getAverageSpendureYear(id: any, year: any) {
        return this.http.get(this.apiURL + '/api/restaurant/' + id + '/spendureyear/' + year, this.jwt()).map((response: Response) => response.json());
    }
    addSpendure(spendure: RestaurantSpendure) {
        return this.http.post(this.apiURL + '/api/restaurantspendure', spendure, this.jwt()).map((response: Response) => response.json());
    }
    updateSpendure(spendure: RestaurantSpendure) {
        return this.http.put(this.apiURL + '/api/restaurantspendure', spendure, this.jwt()).map((response: Response) => response.json());
    }
    /// end Spendure

    ///Growth
    getgrowthByRestaurant(id: any, date: any) {
        return this.http.get(this.apiURL + '/api/restaurant/' + id + '/growth/' + date, this.jwt()).map((response: Response) => response.json());
    }
    getgrowthByRestaurantRange(id: any, startDate: any, enddate: any) {
        return this.http.get(this.apiURL + '/api/restaurant/' + id + '/growth/' + startDate + '/' + enddate, this.jwt()).map((response: Response) => response.json());
    }
    getgrowthByRestaurantMonth(id: any, currentMonth: any) {
        return this.http.get(this.apiURL + '/api/restaurant/' + id + '/growth/month/' + currentMonth, this.jwt()).map((response: Response) => response.json());
    }
    getAveragegrowthYear(id: any, year: any) {
        return this.http.get(this.apiURL + '/api/restaurant/' + id + '/growthyear/' + year, this.jwt()).map((response: Response) => response.json());
    }
    addgrowth(growth: RestaurantGrowth) {
        return this.http.post(this.apiURL + '/api/restaurantgrowth', growth, this.jwt()).map((response: Response) => response.json());
    }
    updategrowth(growth: RestaurantGrowth) {
        return this.http.put(this.apiURL + '/api/restaurantgrowth', growth, this.jwt()).map((response: Response) => response.json());
    }
    ///end Growth


    ///Reviews

    getReviewsByRestaurant(id: any,stars:any) {
        return this.http.get(this.apiURL + '/api/restaurant/' + id + '/review/stars/' + stars, this.jwt()).map((response: Response) => response.json());
    }
    ///End Reviews


    private jwt() {
        // create authorization header with jwt token
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            let headers = new Headers({ 'x-access-token': currentUser.token, 'content-type': 'application/json' });
            return new RequestOptions({ headers: headers });
        }
    }

}
