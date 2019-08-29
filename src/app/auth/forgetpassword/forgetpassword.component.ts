import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef, ViewEncapsulation, } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ScriptLoaderService } from '../../_services/script-loader.service';
import { AuthenticationService } from '../_services/authentication.service';
import { AlertService } from '../_services/alert.service';
import { UserService } from '../_services/user.service';
import { AlertComponent } from '../_directives/alert.component';
import { Helpers } from '../../helpers';

@Component({
    selector: 'app-forgetpassword',
    templateUrl: './forgetpassword.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class ForgetpasswordComponent implements OnInit {
    UUID: any;
    UserData: any;
    model: any = {};
    constructor(private _router: Router,private _script: ScriptLoaderService, private route: ActivatedRoute, public userService: UserService, private _alertService: AlertService,) {
        const routeParams= this.route.snapshot.params;
        this.UUID = routeParams.id;
        //alert(this.UUID);
        this.getUser();
    }

    ngOnInit() {
        this._script.loadScripts('body', [
            'assets/vendors/base/vendors.bundle.js',
            'assets/demo/default/base/scripts.bundle.js'], true).then(() => {
                Helpers.setLoading(false);
                this.handleSignInFormSubmit();
            });
    }

    handleSignInFormSubmit() {
        $('#m_login_signin_submit').click((e) => {
            let form = $(e.target).closest('form');
            form.validate({
                rules: {
                    confirmPassword: {
                        required: true
                    },
                    password: {
                        required: true,
                    },
                },
            });
            if (!form.valid()) {
                e.preventDefault();
                return;
            }
        });
    }

    getUser() {
        this.userService.getByUUId(this.UUID).subscribe(
            data => {
                debugger
                this.UserData = data.data
            },
            error => {
                debugger
            });
    }

    submit() {
        var sssss = this.model;
        var payload = { _id: this.UserData._id, Password: this.model.password };
        this.userService.updatePassword(payload).subscribe(
            data => {
                debugger;
                this._alertService.success(
                    'Thank you. Your password has been updated.',
                    true);
                this._router.navigate(['/login']);
            },
            error => {
                this._alertService.error(error);
            });
    }

}
