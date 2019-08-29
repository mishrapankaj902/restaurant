import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { UserService } from "../_services/user.service";
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private _router: Router, private _userService: UserService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
      
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        return this._userService.verify().map(
            data => {
                if (data.auth == true) {
                    // logged in so return true
                    return true;
                }
                // error when verify so redirect to login page with the return url
                this._router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
                return false;
            },
            error => {
                // error when verify so redirect to login page with the return url
                this._router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
                return false;
            }).catch((e: any) => Observable.throw(this.handleError(e, state)));
    }

    handleError(error: Response, state: RouterStateSnapshot) {
        debugger;
        if (error.status == 500 || error.status==0) {
            this._router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        } else {
            alert(error);
            return Observable.throw(error);
        }
    }
}