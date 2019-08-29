import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef,ViewEncapsulation, AfterViewInit, Input } from '@angular/core';
import { Helpers } from '../../../../helpers';
import { ScriptLoaderService } from '../../../../_services/script-loader.service';
import {MenuService} from '../../../../common/services/menu.service'
import { ModalDismissReasons, NgbDateStruct, NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder } from "@angular/forms";
import {ProductService} from '../../../../common/services/product.service'
import {RestaurantService} from '../../../../common/services/restaurant.service'
import {MenuCategoryService} from '../../../../common/services/menucategory.service'
import {MenuModel} from '../../../../common/models/menumodel'
import { OfferService } from '../../../../common/services/offer.service'
import { TableService } from '../../../../common/services/table.service'

@Component({
    selector: 'app-menu',
    templateUrl: "./menu.component.html",
    changeDetection: ChangeDetectionStrategy.Default,
    encapsulation: ViewEncapsulation.None,
})
export class MenuComponent implements OnInit {
    @Input()
	  ErrorModel: any;
    Menues: any;
    MenuCategories: any;
    Products: any;
    Restaurants: any;
    public modalClose: string;
    SelectedMenu: any;
    menuModel: MenuModel;
    modalReference: NgbModalRef;
    fileToUpload: FileList = null;
    frmData: FormData;
    @Input() MenuImages: any;
    @Input() FilteredMenues: any;
    SelectedRestaurant: any;
    Offers: any;
    CurrentDate: Date = new Date();
    RestaurantOrders: any;
    dietaryFormArray: any;
    selectedDietaryArray: any;
    constructor(public _menuService: MenuService,
        private cd: ChangeDetectorRef,
        private _script: ScriptLoaderService,
        private _productService: ProductService,
        private _restaurantService: RestaurantService,
        private _menuCategoryService: MenuCategoryService,
        private formBuilder: FormBuilder,
        private modalService: NgbModal,
        private _offerService: OfferService,
        private _tableService: TableService) {

    }

    ngOnInit() {
      this.RestaurantOrders = [];
      this.selectedDietaryArray = [];
        this.GetRestaurantOrders();
        this.loadMenuData();
        this.loadOffers();
        this.loadMenuCategoryData();
        this.loadRestaurantData();
        this.loadProductData();
        this.getDietaryType();
        this.frmData = new FormData();
    }

    loadOffers() {
        if (localStorage.getItem('SelectedRestaurant') != "undefined")
            this.SelectedRestaurant = JSON.parse(localStorage.getItem('SelectedRestaurant'));
        if (this.SelectedRestaurant != null) {
            Helpers.setLoading(true);
            this._offerService.getAllofferByRestaurant(this.SelectedRestaurant.Restaurant._id).subscribe(
                data => {
                    this.Offers = data.data;
                    Helpers.setLoading(false);
                },
                error => {
                    Helpers.setLoading(false);
                });
        }
    }

    loadMenuData() {
        this.Menues = null;
        if (localStorage.getItem('SelectedRestaurant') != "undefined")
            this.SelectedRestaurant = JSON.parse(localStorage.getItem('SelectedRestaurant'));
        if (this.SelectedRestaurant != null) {
            Helpers.setLoading(true);
            let currentUser = JSON.parse(localStorage.getItem('currentUser'));
            this._menuService.getAllMenuByRestaurant(this.SelectedRestaurant.Restaurant._id).subscribe(
                data => {
                    this.Menues = data.data;
                  this.FilteredMenues = this.Menues.filter(menu => menu.MenuCategory.Name == "Drinks");
                  console.log("this.FilteredMenues");
                  console.log(this.FilteredMenues);
                    this.cd.detectChanges();
                    this.cd.markForCheck()
                    Helpers.setLoading(false);
                },
                error => {
                    Helpers.setLoading(false);
                });

        }
    }

    loadProductData() {
        Helpers.setLoading(true);
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this._productService.getAllProduct().subscribe(
            data => {
                this.Products = data.data;

                Helpers.setLoading(false);
            },
            error => {
                Helpers.setLoading(false);
            });

    }


    loadRestaurantData() {
        Helpers.setLoading(true);
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this._restaurantService.getAllRestaurant().subscribe(
            data => {
                this.Restaurants = data.data;

                Helpers.setLoading(false);
            },
            error => {
                Helpers.setLoading(false);
            });

    }


    loadMenuCategoryData() {
        Helpers.setLoading(true);
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this._menuCategoryService.getAllMenuCategory().subscribe(
            data => {
                this.MenuCategories = data.data;
                Helpers.setLoading(false);
            },
            error => {
                Helpers.setLoading(false);
            });

    }

    modalOpen(content, id) {
		this.ErrorModel=null;
        this.MenuImages = null;
        this.fileToUpload = null;
        this.frmData = new FormData();
        if (id != '') {
            this.SelectedMenu = this.Menues.filter(menu => menu.Menu._id === id)[0];
            if (this.SelectedMenu != null) {
                this._menuService.getImages(id).subscribe(
                    data => {
                        this.MenuImages = data.data;
                        this.menuModel = new MenuModel();
                        this.menuModel = this.SelectedMenu.Menu;

                        this.modalReference = this.modalService.open(content);

                        this.modalReference.result.then((result) => {
                            this.modalClose = `Closed with: ${result}`;
                        }, (reason) => {
                            this.modalClose = `Dismissed ${this.modalDismissReason(reason)}`;
                        });
                        Helpers.setLoading(false);
                    },
                    error => {
                        this.menuModel = new MenuModel();
                        this.menuModel = this.SelectedMenu.Menu;

                        
                        this.modalDismissReason(ModalDismissReasons.ESC)
                        this.modalReference = this.modalService.open(content);

                        this.modalReference.result.then((result) => {
                            this.modalClose = `Closed with: ${result}`;
                        }, (reason) => {
                            this.modalClose = `Dismissed ${this.modalDismissReason(reason)}`;
                            });

                        Helpers.setLoading(false);
                    });
            }
        }
        else {
            this.menuModel = new MenuModel();
            this.menuModel.MenuCategoryId = '0';
            this.menuModel.ProductId = '0';
            this.menuModel.RestaurantId = this.SelectedRestaurant.Restaurant._id;

            this.modalReference = this.modalService.open(content);

            this.modalReference.result.then((result) => {
                this.modalClose = `Closed with: ${result}`;
            }, (reason) => {
                this.modalClose = `Dismissed ${this.modalDismissReason(reason)}`;
            });
        }       
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
        if (this.menuModel._id != undefined && this.menuModel._id != '' && this.menuModel._id != null) {
            this._menuService.update(this.menuModel).subscribe(
                data => {
                    Helpers.setLoading(false);

                    if (this.fileToUpload != null)
                        if (this.fileToUpload.length > 0)
                            this.saveFile(this.frmData, this.menuModel._id)

                    this.loadMenuData();
                    this.modalReference.close();
                },
                error => {
                    Helpers.setLoading(false);
                    this.modalDismissReason(ModalDismissReasons.ESC)
                });
        }
        else {
            this._menuService.add(this.menuModel).subscribe(
                data => {
                    Helpers.setLoading(false);
                    if (this.fileToUpload != null)
                        if (this.fileToUpload.length > 0)
                            this.saveFile(this.frmData, data.data._id)
                    this.loadMenuData();
                    this.modalReference.close();
                },
                error => {
                    Helpers.setLoading(false);
                    this.modalDismissReason(ModalDismissReasons.ESC)
                });
        }
    }

    delete(id: any) {
        if (confirm("Are you sure you want to delete ?")) {
        Helpers.setLoading(true);
        this._menuService.delete(id).subscribe(
            data => {
                Helpers.setLoading(false);
                this.loadMenuData();
                this.modalReference.close();
            },
            error => {
                Helpers.setLoading(false);
                this.modalDismissReason(ModalDismissReasons.ESC)
            });
     }
    }

    deleteImage(id: any) {
        if (confirm("Are you sure you want to delete image?")) {
            Helpers.setLoading(true);
            this._menuService.deleteImage(id).subscribe(
                data => {
                    this._menuService.getImages(this.menuModel._id).subscribe(
                        data => {
                            this.MenuImages = data.data;
                            Helpers.setLoading(false);
                        },
                        error => {
                            Helpers.setLoading(false);
                        });
                },
                error => {
                    Helpers.setLoading(false);
                    this.modalDismissReason(ModalDismissReasons.ESC)
                });
        }
    }

    handleFileInput(files: FileList) {
        this.fileToUpload = null;
        this.frmData = new FormData();
        this.fileToUpload = files;
        for (var i = 0; i < files.length; i++) {
            this.frmData.append("ImageFile", files[i]);
        }
    }

    saveFile(files: FormData, id: any) {
        this._menuService.postFile(files, id).subscribe(
            data => {
                Helpers.setLoading(false);
                //this.loadMenuData();
                //this.modalReference.close();
                this.fileToUpload = null;
            },
            error => {
                this.fileToUpload = null;
                Helpers.setLoading(false);
                this.modalDismissReason(ModalDismissReasons.ESC)
            });


    }

    handleFormSubmit() {
      var result = true;
		  this.ErrorModel={};
      if (this.menuModel.Name == "" || this.menuModel.Name == null || this.menuModel.Name == undefined)
      {
          result = false;
          this.ErrorModel.Name= "Menu Name is Required";
      }else{
			    this.ErrorModel.Name="";
		  }
		
		  if (this.menuModel.MenuCategoryId == "0" || this.menuModel.MenuCategoryId == "" || this.menuModel.MenuCategoryId == null || this.menuModel.MenuCategoryId == undefined)
        {
            result = false;
            this.ErrorModel.MenuCategory= "Menu Category is Required";
        }else{
			      this.ErrorModel.MenuCategory="";
		    }
		
		  if (this.menuModel.ProductId == "0" || this.menuModel.ProductId == "" || this.menuModel.ProductId == null || this.menuModel.ProductId == undefined)
        {
            result = false;
            this.ErrorModel.Product= "Ingredient is Required";
        }else{
			      this.ErrorModel.Product="";
		    }
		
		  if (this.menuModel.RestaurantId == "0" || this.menuModel.RestaurantId == "" || this.menuModel.RestaurantId == null || this.menuModel.RestaurantId == undefined)
        {
            result = false;
            this.ErrorModel.Restaurant= "Restaurant is Required";
        }else{
			      this.ErrorModel.Restaurant="";
		    }
		
        return result;
    }

    filterMenu(category:any) {
        this.FilteredMenues = this.Menues.filter(menu => menu.MenuCategory.Name == category);
    }

    CloseModel() {
        this.modalReference.close();
    };

    getOfferRemainingDays(dtStart,dtEnd) {
        if (dtStart != null && dtEnd!=null) {
            var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
            var firstDate = new Date(dtStart);
            var secondDate = new Date(dtEnd);

            var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
            return diffDays;
        }
    }

    GetRestaurantOrders() {
        if (localStorage.getItem('SelectedRestaurant') != "undefined")
            this.SelectedRestaurant = JSON.parse(localStorage.getItem('SelectedRestaurant'));
        if (this.SelectedRestaurant != null) {
            Helpers.setLoading(true);
            this.RestaurantOrders = [];
            this._tableService.getUserOrderByRestaurant(this.SelectedRestaurant.Restaurant._id).subscribe(
                data => {

                    var orders = [];
                    // Need to change This 

                    data.data.forEach(function (value) {
                        value.OrderDetails.OrderdItems.forEach(function (order) {
                            orders.push({ ReservationId: value._id, Order: order, RestaurnatName: value.RestaurantName, OrderStatus: order.ItemStatus })
                        })
                    })
                    this.RestaurantOrders = orders;
                    Helpers.setLoading(false);
                },
                error => {
                    Helpers.setLoading(false);
                });
        }
    }

    updateReservationStatus(order, status) {
        Helpers.setLoading(true);
        var orderData = { _id: order.ReservationId, OrderStatus: status, ItemId: order.Order._id }
        this._tableService.updateOrderItemStatus(orderData).subscribe(
            data => {
                this.GetRestaurantOrders();
            },
            error => {
                Helpers.setLoading(false);
            });
    }

    ngAfterViewInit() {
        this._script.loadScripts('app-menu',
            ['assets/vendors/custom/datatables/datatables.bundle.js',
                'assets/demo/default/custom/crud/datatables/basic/basic.js']);

  }
  onChange(dietaryId: string, isChecked: boolean) {
    if (isChecked) {
      this.selectedDietaryArray.push(dietaryId);
      this.menuModel.DietaryType = this.selectedDietaryArray;
    } else {
      let index = this.selectedDietaryArray.indexOf(dietaryId);
      this.selectedDietaryArray.splice(index,1);
      this.menuModel.DietaryType = this.selectedDietaryArray;
    }
  }

  getDietaryType() {
    this._menuService.getAllDietaryType().subscribe(
      data => {
        this.dietaryFormArray = data.data;
        
      },
      error => {
        Helpers.setLoading(false);
      });
  }
}
