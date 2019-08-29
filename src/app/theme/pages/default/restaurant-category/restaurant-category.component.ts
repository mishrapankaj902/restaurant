import { Component, OnInit, ViewEncapsulation, AfterViewInit, Input } from '@angular/core';
import { Helpers } from '../../../../helpers';
import { ScriptLoaderService } from '../../../../_services/script-loader.service';
import { ModalDismissReasons, NgbDateStruct, NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import {FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import {RestaurantCategoryService} from '../../../../common/services/restaurant-category.service'
import {RestaurantCategory} from '../../../../common/models/restaurant-category'

@Component({
  selector: 'app-restaurant-category',
  templateUrl: "./restaurant-category.component.html",
  encapsulation: ViewEncapsulation.None
})
export class RestaurantCategoryComponent implements OnInit {
    ErrorModel: any;
    RestaurantCategories: any;
    restaurantCategoryModel: RestaurantCategory;
    modalReference: NgbModalRef;
    public modalClose: string;
    SelectedRestaurantCategory: any;
    myform: FormGroup;

    constructor(private _script: ScriptLoaderService,
        private _restaurantCategoryService: RestaurantCategoryService,
        private formBuilder: FormBuilder,
        private modalService: NgbModal) {

    }

    ngOnInit() {
        this.loadRestaurantCategoryData();
        this._script.loadScripts('body', [
            'assets/vendors/base/vendors.bundle.js',
            'assets/demo/default/base/scripts.bundle.js'], true).then(() => {
                Helpers.setLoading(false);
            });

        this.myform = new FormGroup({
            name: new FormControl('', Validators.required),
        });
  }



    loadRestaurantCategoryData() {
        Helpers.setLoading(true);
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this._restaurantCategoryService.getAllRestaurantCategory().subscribe(
            data => {
                this.RestaurantCategories = data.data;
                Helpers.setLoading(false);
            },
            error => {
                Helpers.setLoading(false);
            });

    }


    modalOpen(content, id) {
		this.ErrorModel=null;
        if (id != '') {
            this.SelectedRestaurantCategory = this.RestaurantCategories.filter(menu => menu._id === id)[0];
            if (this.SelectedRestaurantCategory != null) {
                this.restaurantCategoryModel = new RestaurantCategory();
                this.restaurantCategoryModel._id = this.SelectedRestaurantCategory._id;
                this.restaurantCategoryModel.Name = this.SelectedRestaurantCategory.Name;
                this.restaurantCategoryModel.Description = this.SelectedRestaurantCategory.Description;
            }
        }
        else {
            this.restaurantCategoryModel = new RestaurantCategory();
        }
        this.modalReference = this.modalService.open(content);

        this.modalReference.result.then((result) => {
            this.modalClose = `Closed with: ${result}`;
        }, (reason) => {
            this.modalClose = `Dismissed ${this.modalDismissReason(reason)}`;
        });
    }

    private modalDismissReason(reason: any): string {		
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }

    onSubmit() {
        
        Helpers.setLoading(true);
        if (this.restaurantCategoryModel._id != undefined && this.restaurantCategoryModel._id != '' && this.restaurantCategoryModel._id != null) {
            this._restaurantCategoryService.update(this.restaurantCategoryModel).subscribe(
                data => {
                    Helpers.setLoading(false);
                    this.loadRestaurantCategoryData();
                    this.modalReference.close();
					this.ErrorModel=null;
                },
                error => {
                    Helpers.setLoading(false);
                    this.modalDismissReason(ModalDismissReasons.ESC)
                });
        }
        else {
            this._restaurantCategoryService.add(this.restaurantCategoryModel).subscribe(
                data => {
                    Helpers.setLoading(false);
                    this.loadRestaurantCategoryData();
                    this.modalReference.close();
					this.ErrorModel=null;
                },
                error => {
                    Helpers.setLoading(false);
                    this.modalDismissReason(ModalDismissReasons.ESC)
                });
        }
    }

    delete(id: any) {
        if (confirm("Are you sure you want to delete ?")) {
            this._restaurantCategoryService.delete(id).subscribe(
                data => {
                    Helpers.setLoading(false);
                    this.loadRestaurantCategoryData();
                    this.modalReference.close();
                },
                error => {
                    Helpers.setLoading(false);
                    this.modalDismissReason(ModalDismissReasons.ESC)
                });
        }
    }

    handleFormSubmit() {
        var result = true;
		    this.ErrorModel=null;
        if (this.restaurantCategoryModel.Name == "" || this.restaurantCategoryModel.Name == null || this.restaurantCategoryModel.Name == undefined)
        {
            result = false;
            this.ErrorModel={Name: "Category Name is Required"}
        }
        return result;
    }

    ngAfterViewInit() {
        this._script.loadScripts('app-menu',
            ['assets/vendors/custom/datatables/datatables.bundle.js',
                'assets/demo/default/custom/crud/datatables/basic/basic.js']);

  }
  getRestaurantsByCatId(catId) {
    Helpers.setLoading(true);
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this._restaurantCategoryService.getRestaurantsByCatId(catId, currentUser.data._id).subscribe(
      data => {
        Helpers.setLoading(false);
      },
      error => {
        Helpers.setLoading(false);
      });

  }

}
