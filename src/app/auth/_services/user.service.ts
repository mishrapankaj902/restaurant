import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import {AppSettings} from '../../appsettings'
import { User } from "../_models/index";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class UserService {
   // apiURL = "http://localhost:3000";
    apiURL = AppSettings.API_ENDPOINT;
    constructor(private http: Http) {
    }

    verify() {
        return this.http.get(this.apiURL + '/api/verifyUser', this.jwt()).map((response: Response) => response.json());
    }

    forgotPassword(email: string) {
        return this.http.get(this.apiURL + '/api/forgotpassword/' + email, this.jwt()).map((response: Response) => response.json());
    }

    getAll() {
        return this.http.get(this.apiURL + '/api/user', this.jwt()).map((response: Response) => response.json());
    }

    getById(id: string) {
        return this.http.get(this.apiURL + '/api/user/' + id, this.jwt()).map((response: Response) => response.json());
    }

  create(user: User) {
      let headers = new Headers({'content-type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      return this.http.post(this.apiURL + '/api/user/register', user, options).map((response: Response) => response.json());
    }

  update(user: User) {
        return this.http.put(this.apiURL + '/api/user', user, this.jwt()).map((response: Response) => response.json());
    }

    delete(id: number) {
        return this.http.delete(this.apiURL + '/api/user/' + id, this.jwt()).map((response: Response) => response.json());
    }

    getCustomers() {
        return this.http.get(this.apiURL + '/api/user/customer', this.jwt()).map((response: Response) => response.json());
    }

    getByUUId(id: string) {
        return this.http.get(this.apiURL + '/api/user/byuuid/' + id, this.jwt()).map((response: Response) => response.json());
    }
    updatePassword(user: any) {
        return this.http.post(this.apiURL + '/api/user/updatepassword', user, this.jwt()).map((response: Response) => response.json());
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
