import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HeaderProfileComponent } from './header-profile.component';
import { LayoutModule } from '../../../../layouts/layout.module';
import { DefaultComponent } from '../../default.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


const routes: Routes = [
    {
        "path": "",
        "component": DefaultComponent,
        "children": [
            {
                "path": "",
                "component": HeaderProfileComponent
            }
        ]
    }
];

@NgModule({
    imports: [
      CommonModule, RouterModule.forChild(routes), LayoutModule, FormsModule
      //BrowserAnimationsModule, // required animations module
      //ToastrModule.forRoot() // ToastrModule added
    ], exports: [
        RouterModule
    ], declarations: [
        HeaderProfileComponent
    ]
})
export class HeaderProfileModule {

}
