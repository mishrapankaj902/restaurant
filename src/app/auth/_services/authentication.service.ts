import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import "rxjs/add/operator/map";
import { AppSettings } from '../../appsettings';

@Injectable()
export class AuthenticationService {
    apiURL = AppSettings.API_ENDPOINT;
    constructor(private http: Http) {
    }

    options() {
        const headers = new Headers({
            'content-type': 'application/json'
        });
        const options = new RequestOptions({ headers: headers });

        return options;
    }

    //login(email: string, password: string) {
    //    return this.http.post('/api/authenticate', JSON.stringify({ email: email, password: password }))
    //        .map((response: Response) => {
    //            // login successful if there's a jwt token in the response
    //            let user = response.json();
    //            if (user && user.token) {
    //                // store user details and jwt token in local storage to keep user logged in between page refreshes
    //                localStorage.setItem('currentUser', JSON.stringify(user));
    //            }
    //        });
    //}

    login(email: string, password: string) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
       // let options = new RequestOptions({ headers: headers });
        let body = { EmailAddress: email, Password: password };

        return this.http.post(this.apiURL + '/api/user/login', body, this.options())
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                let user = response.json();
                if (user && user.data.EmailAddress) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }
            });
            //.map((response: Response) => function (response){
            //    // login successful if there's a jwt token in the response
            //    let user = response.json();
            //    if (user && user.data.EmailAddress) {
            //        // store user details and jwt token in local storage to keep user logged in between page refreshes
            //        localStorage.setItem('currentUser', JSON.stringify(user));
            //    }

            //    return response.json();
            //});
  }
    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        localStorage.removeItem('SelectedRestaurant')
    }
}
