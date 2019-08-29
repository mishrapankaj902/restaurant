import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import { Restaurant } from "../models/restaurant";
import {AppSettings} from '../../appsettings'

@Injectable()
export class RestaurantService {
    apiURL = AppSettings.API_ENDPOINT;
    constructor(private http: Http) {
    }

    getAllRestaurant() {
        return this.http.get(this.apiURL + '/api/restaurant', this.jwt()).map((response: Response) => response.json());
    }
    
    getRestaurantDrp() {
        return this.http.get(this.apiURL + '/api/get/restaurant', this.jwt()).map((response: Response) => response.json());
    }

    getAllRestaurantByUser(id: any) {
        return this.http.get(this.apiURL + '/api/restaurant/user/' + id, this.jwt()).map((response: Response) => response.json());
    }

    update(restaurant: Restaurant) {
        return this.http.put(this.apiURL + '/api/restaurant', restaurant, this.jwt()).map((response: Response) => response.json());
    }

  add(restaurant: Restaurant) {
    console.log("restaurant : " + JSON.stringify(restaurant));
        return this.http.post(this.apiURL + '/api/restaurant', restaurant, this.jwt()).map((response: Response) => response.json());
    }

    delete(id: any) {
        return this.http.delete(this.apiURL + '/api/restaurant/' + id, this.jwt()).map((response: Response) => response.json());
    }

    postFile(fileToUpload: FormData, id: any) {
        return this.http.post(this.apiURL + '/api/upload/Restaurant/' + id + "/image", fileToUpload).map((response: Response) => response.json());
    }

    getImages(id: any) {
        return this.http.get(this.apiURL + '/api/images/' + id + "/Restaurant", this.jwt()).map((response: Response) => response.json());
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
