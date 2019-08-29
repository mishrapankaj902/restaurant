import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import {AppSettings} from '../../appsettings'

@Injectable()
export class MenuCategoryService {
    apiURL = AppSettings.API_ENDPOINT;
    constructor(private http: Http) {
    }

    getAllMenuCategory() {
        return this.http.get(this.apiURL + '/api/menucategory', this.jwt()).map((response: Response) => response.json());
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
