/// <reference path="auth/forgetpassword/forgetpassword.component.ts" />
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LogoutComponent } from "./auth/logout/logout.component";
import { ForgetpasswordComponent } from "./auth/forgetpassword/forgetpassword.component";

const routes: Routes = [
    { path: 'login', loadChildren: './auth/auth.module#AuthModule' },
    { path: 'logout', component: LogoutComponent },
    { path: '', redirectTo: 'index', pathMatch: 'full' },
    { path: 'forgetpassword/:id', component: ForgetpasswordComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }