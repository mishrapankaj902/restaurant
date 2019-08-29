import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { OffersComponent } from './offers.component';
import { LayoutModule } from '../../../layouts/layout.module';
import { DefaultComponent } from '../default.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularDateTimePickerModule } from 'angular2-datetimepicker';
import { Daterangepicker } from 'ng2-daterangepicker';

const routes: Routes = [
    {
        "path": "",
        "component": DefaultComponent,
        "children": [
            {
                "path": "",
                "component": OffersComponent
            }
        ]
    }
];
@NgModule({
    imports: [
        CommonModule, RouterModule.forChild(routes), LayoutModule, NgbModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        AngularDateTimePickerModule,
        Daterangepicker
    ], exports: [
        RouterModule, AngularDateTimePickerModule
    ], declarations: [
        OffersComponent
    ]
})
export class OffersModule {



}