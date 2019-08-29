import { Component, OnInit, ViewEncapsulation, AfterViewInit, Input } from '@angular/core';
import { Helpers } from '../../../../helpers';
import { ScriptLoaderService } from '../../../../_services/script-loader.service';
import { ModalDismissReasons, NgbDateStruct, NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { OfferService } from '../../../../common/services/offer.service'
import { Offer } from '../../../../common/models/offer'
import { RestaurantService } from '../../../../common/services/restaurant.service'
import { ProductService } from '../../../../common/services/product.service'
import { DaterangepickerConfig } from 'ng2-daterangepicker';

@Component({
    selector: 'app-offers',
    templateUrl: "./offers.component.html",
    encapsulation: ViewEncapsulation.None
})
export class OffersComponent implements OnInit {
    SelectedOffer: any;
    ErrorModel: any;
    Offers: any;
    offerModel: Offer;
    modalReference: NgbModalRef;
    public modalClose: string;
    Restaurants: any;
    Products: any;
    date: any;
    settings: any;
    fileToUpload: FileList = null;
    frmData: FormData;
    @Input() OfferImages: any;
    SelectedRestaurant: any;
    rangeDates: Date[];
    public daterange: any = {};
    public options: any = {
        alwaysShowCalendars: false,
        timePicker:true
    };
    DateModel: any;
    constructor(private _script: ScriptLoaderService,
        private _offerService: OfferService,
        private formBuilder: FormBuilder,
        private _productService: ProductService,
        private _restaurantService: RestaurantService,
        private modalService: NgbModal, private daterangepickerOptions: DaterangepickerConfig) {

        this.daterangepickerOptions.settings = {
            alwaysShowCalendars: false
        };

        this.daterangepickerOptions.skipCSS = true;
    }

    ngOnInit() {
        this.loadOffers();

        this._script.loadScripts('body', [
            'assets/vendors/base/vendors.bundle.js',
            'assets/demo/default/base/scripts.bundle.js'], true).then(() => {
                Helpers.setLoading(false);
            });

        this.loadRestaurantData();
        this.loadProductData();
    }
    public selectedDate(value: any, datepicker?: any) {
        datepicker.start = value.start;
        datepicker.end = value.end;
        this.daterange.start = value.start;
        this.daterange.end = value.end;
        this.daterange.label = value.label;

        this.offerModel.StartDate = this.daterange.start._d;
        this.offerModel.EndDate = this.daterange.end._d;
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

    modalOpen(content, id) {
        this.ErrorModel = null;
        this.OfferImages = [];
        if (id != '') {
            this.SelectedOffer = this.Offers.filter(offer => offer.Offer._id === id)[0];
            this._offerService.getImages(id).subscribe(
                data => {
                    this.OfferImages = data.data;
                    this.offerModel = new Offer();
                    this.offerModel = this.SelectedOffer.Offer;
                    this.DateModel = this.offerModel.StartDate + " - " + this.offerModel.EndDate;
                    this.modalReference = this.modalService.open(content);
                    this.modalReference.result.then((result) => {
                        this.modalClose = `Closed with: ${result}`;
                    }, (reason) => {
                        this.modalClose = `Dismissed ${this.modalDismissReason(reason)}`;
                    });
                    Helpers.setLoading(false);
                },
                error => {
                    this.offerModel = new Offer();
                    this.offerModel = this.SelectedOffer.Offer;
                    this.DateModel = this.offerModel.StartDate + " - " + this.offerModel.EndDate;
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
        else {
            this.offerModel = new Offer();
            this.offerModel.RestaurantId = this.SelectedRestaurant.Restaurant._id;
            this.offerModel.ProductId = "0";
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
        if (this.offerModel._id != undefined && this.offerModel._id != '' && this.offerModel._id != null) {
            this._offerService.update(this.offerModel).subscribe(
                data => {
                    Helpers.setLoading(false);
                    this.loadOffers();
                    if (this.fileToUpload != null)
                        if (this.fileToUpload.length > 0)
                            this.saveFile(this.frmData, this.offerModel._id)
                    this.modalReference.close();
                    this.ErrorModel = null;
                },
                error => {
                    Helpers.setLoading(false);
                    this.modalDismissReason(ModalDismissReasons.ESC)
                });
        }
        else {
            this._offerService.add(this.offerModel).subscribe(
                data => {
                    Helpers.setLoading(false);
                    this.loadOffers();
                    if (this.fileToUpload != null)
                        if (this.fileToUpload.length > 0)
                            this.saveFile(this.frmData, data.data._id)
                    this.modalReference.close();
                    this.ErrorModel = null;

                },
                error => {
                    Helpers.setLoading(false);
                    this.modalDismissReason(ModalDismissReasons.ESC)
                });
        }
    }

    delete(id: any) {
        if (confirm("Are you sure you want to delete ?")) {
            this._offerService.delete(id).subscribe(
                data => {
                    Helpers.setLoading(false);
                    this.loadOffers();
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
        this.ErrorModel = {};
        if (this.offerModel.StartDate == null || this.offerModel.StartDate == undefined || this.offerModel.EndDate == null || this.offerModel.EndDate == undefined) {
            result = false;
            this.ErrorModel.Date = "Date field is Required";
        }

        if (this.offerModel.Title == "" || this.offerModel.Title == null || this.offerModel.Title == undefined) {
            result = false;
            this.ErrorModel.Title = "Offer Title is Required";
        }
        if (this.offerModel.ProductId == "0" || this.offerModel.ProductId == "" || this.offerModel.ProductId == null || this.offerModel.ProductId == undefined) {
            result = false;
            this.ErrorModel.Product = "Product is Required";
        }
        if (this.offerModel.RestaurantId == "0" || this.offerModel.RestaurantId == "" || this.offerModel.RestaurantId == null || this.offerModel.RestaurantId == undefined) {
            result = false;
            this.ErrorModel.Restaurant = "Restaurant is Required";
        }
        return result;
    }

    loadRestaurantData() {
        Helpers.setLoading(true);
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this._restaurantService.getRestaurantDrp().subscribe(
            data => {
                this.Restaurants = data.data;

                Helpers.setLoading(false);
            },
            error => {
                Helpers.setLoading(false);
            });

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

    numberOnly(event): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;

    }

    deleteImage(id: any) {
        if (confirm("Are you sure you want to delete image?")) {
            Helpers.setLoading(true);
            this._offerService.deleteImage(id).subscribe(
                data => {
                    this._offerService.getImages(this.offerModel._id).subscribe(
                        data => {
                            this.OfferImages = data.data;
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
        this._offerService.postFile(files, id).subscribe(
            data => {
                Helpers.setLoading(false);
                this.fileToUpload = null;
            },
            error => {
                this.fileToUpload = null;
                Helpers.setLoading(false);
                this.modalDismissReason(ModalDismissReasons.ESC)
            });


    }

    ngAfterViewInit() {
        this._script.loadScripts('app-offers',
            ['assets/vendors/custom/datatables/datatables.bundle.js',
                'assets/demo/default/custom/crud/datatables/basic/basic.js']);

    }
}
