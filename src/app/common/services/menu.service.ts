import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import {AppSettings} from '../../appsettings'
import { MenuModel } from "../models/menumodel";

@Injectable()
export class MenuService {
    apiURL = AppSettings.API_ENDPOINT;
    constructor(private http: Http) {
    }

    getAllMenu() {
        return this.http.get(this.apiURL + '/api/menu', this.jwt()).map((response: Response) => response.json());
    }

    getAllMenuByRestaurant(id: any) {
        return this.http.get(this.apiURL + '/api/restaurant/' + id+'/menu', this.jwt()).map((response: Response) => response.json());
    }

    update(menu: MenuModel) {
        return this.http.put(this.apiURL + '/api/menu', menu, this.jwt()).map((response: Response) => response.json());
    }

    add(menu: MenuModel) {
        return this.http.post(this.apiURL + '/api/menu', menu, this.jwt()).map((response: Response) => response.json());
    }

    delete(id: any) {
        return this.http.delete(this.apiURL + '/api/menu/' + id, this.jwt()).map((response: Response) => response.json());
    }

    postFile(fileToUpload: FormData, id: any) {
        //const formData: FormData = new FormData();
        //formData.append('ImageFile', fileToUpload);
        return this.http.post(this.apiURL + '/api/upload/Menu/' + id + "/image", fileToUpload).map((response: Response) => response.json());
    }

    getImages(id: any) {
        return this.http.get(this.apiURL + '/api/images/' + id + "/Menu", this.jwt()).map((response: Response) => response.json());
    }

   deleteImage(id: any) {
       return this.http.delete(this.apiURL + '/api/image/' + id, this.jwt()).map((response: Response) => response.json());
    }

    getAllDietaryType() {
      return this.http.get(this.apiURL + '/api/dietaryRestrictions', this.jwt()).map((response: Response) => response.json());
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
