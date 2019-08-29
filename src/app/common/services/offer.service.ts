import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import { Offer } from "../models/offer";
import { AppSettings } from '../../appsettings'

@Injectable()
export class OfferService {

    apiURL = AppSettings.API_ENDPOINT;
    constructor(private http: Http) {
    }

    getAlloffer() {
        return this.http.get(this.apiURL + '/api/offer', this.jwt()).map((response: Response) => response.json());
    }

    getAllofferByRestaurant(id: any) {
        return this.http.get(this.apiURL + '/api/restaurant/' + id + '/offer', this.jwt()).map((response: Response) => response.json());
    }

    update(menu: Offer) {
        return this.http.put(this.apiURL + '/api/offer', menu, this.jwt()).map((response: Response) => response.json());
    }

    add(menu: Offer) {
        return this.http.post(this.apiURL + '/api/offer', menu, this.jwt()).map((response: Response) => response.json());
    }

    delete(id: any) {
        return this.http.delete(this.apiURL + '/api/offer/' + id, this.jwt()).map((response: Response) => response.json());
    }

    postFile(fileToUpload: FormData, id: any) {
        //const formData: FormData = new FormData();
        //formData.append('ImageFile', fileToUpload);
        return this.http.post(this.apiURL + '/api/upload/Offer/' + id + "/image", fileToUpload).map((response: Response) => response.json());
    }

    getImages(id: any) {
        return this.http.get(this.apiURL + '/api/images/' + id + "/Offer", this.jwt()).map((response: Response) => response.json());
    }

    deleteImage(id: any) {
        return this.http.delete(this.apiURL + '/api/image/' + id, this.jwt()).map((response: Response) => response.json());
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
