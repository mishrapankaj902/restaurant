import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ReservationsComponent } from './reservations.component';
import { LayoutModule } from '../../../layouts/layout.module';
import { DefaultComponent } from '../default.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularDateTimePickerModule } from 'angular2-datetimepicker';

const routes: Routes = [
    {
        "path": "",
        "component": DefaultComponent,
        "children": [
            {
                "path": "",
                "component": ReservationsComponent
            }
        ]
    }
];
@NgModule({
    imports: [
        CommonModule, RouterModule.forChild(routes), LayoutModule, NgbModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        AngularDateTimePickerModule
    ], exports: [
        RouterModule, AngularDateTimePickerModule
    ], declarations: [
        ReservationsComponent
    ]
})
export class ReservationsModule {



}