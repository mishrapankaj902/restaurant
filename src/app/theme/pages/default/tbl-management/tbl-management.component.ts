import { Component, OnInit, ViewEncapsulation, AfterViewInit, Input } from '@angular/core';
import { Helpers } from '../../../../helpers';
import { ScriptLoaderService } from '../../../../_services/script-loader.service';
import { ModalDismissReasons, NgbDateStruct, NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { TableService } from '../../../../common/services/table.service'
import { Table } from '../../../../common/models/table'
import { RestaurantService } from '../../../../common/services/restaurant.service'
import { DashboardService } from '../../../../common/services/dashboard.service'
import { RestaurantTips } from '../../../../common/models/restaurant-tips'
import { RestaurantSpendure } from '../../../../common/models/restaurant-spendure'

declare var $: any
@Component({
    selector: 'app-tbl-management',
    templateUrl: "./tbl-management.component.html",
    encapsulation: ViewEncapsulation.None
})
export class TblManagementComponent implements OnInit {
    modalReference: NgbModalRef;
    public modalClose: string;
    tableModel: Table;
    Restaurants: any;
    SelectedRestaurant: any;
    tableTypes: any;
    ErrorModel: any;
    Tables: any;
    VacantTables: any;
    SelectedTable: any;
    ReservedTables: any;
    VacantCount: number;
    AllCount: number;
    PaymentUser: any;
    UserOrders: any;
    RestaurantOrders: any;
    RestaurantTipAmnt: any;
    restaurantTipsModel: RestaurantTips;
    restaurantSpendureModel: RestaurantSpendure;
    totalPayment: any;
    RecievedOrders: any;
    OrdersTotalBill: any;
    billtype: any;
    tableCount: any;
    seatsOption:any
    show: any;
    constructor(private _script: ScriptLoaderService,
        private formBuilder: FormBuilder,
        private modalService: NgbModal,
        private _tableService: TableService,
        private _restaurantService: RestaurantService,
        private _dashboardService: DashboardService) { }

      ngOnInit() {
        this.show = true;
        this.ReservedTables = [];
        this.RestaurantOrders = [];
        this.RecievedOrders = [];
        this.OrdersTotalBill = 0;
        this.RestaurantTipAmnt = 0;
        this.billtype = "";
        this.loadTables();
        this._script.loadScripts('body', [
            'assets/vendors/base/vendors.bundle.js',
          'assets/demo/default/base/scripts.bundle.js',
          'assets/demo/default/custom/components/portlets/customdrag.js'], true).then(() => {
                Helpers.setLoading(false);
            });
        this.PaymentUser = {};
        this.loadRestaurantData();
        this.loadTableType();
        this.loadReservedTables();
        this.GetRestaurantOrders();
        this.totalPayment = 500;
        this.seatsOption = [{ id: 1, value: "2", label: "2 - Person" }, { id: 2, value: "3", label: "3 - Person" }, { id: 3, value: "4", label: "4 - Person" },
          { id: 4, value: "5", label: "5 - Person" }, { id: 5, value: "6", label: "6 - Person" }];
     
    }

  delete(id: any) {
        if (confirm("Are you sure you want to delete ?")) {
            Helpers.setLoading(true);
            this._tableService.delete(id).subscribe(
                data => {
                    Helpers.setLoading(false);
                    this.loadTables();
                },
                error => {
                    Helpers.setLoading(false);
                });
        }
    }

    loadReservedTables() {
        Helpers.setLoading(true);
        if (localStorage.getItem('SelectedRestaurant') != "undefined")
            this.SelectedRestaurant = JSON.parse(localStorage.getItem('SelectedRestaurant'));
        if (this.SelectedRestaurant != null) {
            this._tableService.getReservedTableByRestaurantId(this.SelectedRestaurant.Restaurant._id).subscribe(
                data => {
                  this.ReservedTables = data.data;
                    Helpers.setLoading(false);
                },
                error => {
                    Helpers.setLoading(false);
                });
        }
    }

    getTableName(id) {
        if (this.Tables != undefined) {
            var table = this.Tables.filter(table => table._id === id)[0];
            if (table != null && table != undefined)
                return table.Name;
        }
    }

    ReAssign(id, assignedTable) {
        var previousTblId = assignedTable.TableId;
        Helpers.setLoading(true);
      assignedTable.TableId = id;
        this._tableService.updateReservedTable(assignedTable).subscribe(
            data => {
                this.tableModel = new Table();
                this.tableModel._id = previousTblId;
                this.tableModel.TableStatus = "Vacant";
                this._tableService.updateStatus(this.tableModel).subscribe(
                    data => {
                        this.loadTables();
                        this.loadReservedTables()
                        Helpers.setLoading(false);
                    },
                    error => {
                        Helpers.setLoading(false);
                    });
            },
            error => {
                Helpers.setLoading(false);
            });
    }


    loadTableType() {
        Helpers.setLoading(true);
        this._tableService.getTableTypes().subscribe(
            data => {
                this.tableTypes = data.data;

                Helpers.setLoading(false);
            },
            error => {
                Helpers.setLoading(false);
            });

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


    loadTables() {
        if (localStorage.getItem('SelectedRestaurant') != "undefined")
            this.SelectedRestaurant = JSON.parse(localStorage.getItem('SelectedRestaurant'));
        if (this.SelectedRestaurant != null) {
            Helpers.setLoading(true);
            this._tableService.getAllTableByRestaurant(this.SelectedRestaurant.Restaurant._id).subscribe(
                data => {
                  this.Tables = data.data;

                  this.VacantTables = this.Tables.filter(table => table.TableStatus === 'Vacant');
                  this.AllCount = this.Tables.length;
                  this.VacantCount = this.VacantTables.length;

                  Helpers.setLoading(false);
                },
                error => {
                    Helpers.setLoading(false);
                });
        }
    }

    modalOpen(content, id) {
        if (id != '') {
            this.SelectedTable = this.Tables.filter(table => table._id === id)[0];

            if (this.SelectedTable != null) {
                this.tableModel = new Table()
                this.tableModel = this.SelectedTable;

                this.modalReference = this.modalService.open(content);
                this.modalReference.result.then((result) => {
                    this.modalClose = `Closed with: ${result}`;
                }, (reason) => {
                    this.modalClose = `Dismissed ${this.modalDismissReason(reason)}`;
                });
                Helpers.setLoading(false);

            } else {
                this.tableModel = new Table()
                this.tableModel.RestaurantId = this.SelectedRestaurant.Restaurant._id;
                this.tableModel.TableType = "0";
                this.tableModel.Seats = "2";
                this.tableModel.Name = "Table 1";
                this.modalReference = this.modalService.open(content);
                this.modalReference.result.then((result) => {
                    this.modalClose = `Closed with: ${result}`;
                }, (reason) => {
                    this.modalClose = `Dismissed ${this.modalDismissReason(reason)}`;
                });
                Helpers.setLoading(false);
            }
        }
        else {
            this.tableModel = new Table()
            this.tableModel.RestaurantId = this.SelectedRestaurant.Restaurant._id;
            this.tableModel.Seats = "2";
            this.tableModel.TableType = "0";
            this.tableModel.Name = "Table 1";
            this.modalReference = this.modalService.open(content);
            this.modalReference.result.then((result) => {
                this.modalClose = `Closed with: ${result}`;
            }, (reason) => {
                this.modalClose = `Dismissed ${this.modalDismissReason(reason)}`;
            });
            Helpers.setLoading(false);
      }
     
    }

    onSubmit() {
        var selectedRestaurant = this.Restaurants.filter(rest => rest._id === this.tableModel.RestaurantId)[0];
        if (selectedRestaurant != null)
            this.tableModel.RestaurantName = selectedRestaurant.Name;

        Helpers.setLoading(true);
        if (this.tableModel._id != undefined && this.tableModel._id != '' && this.tableModel._id != null) {
            this._tableService.update(this.tableModel).subscribe(
                data => {
                    Helpers.setLoading(false);
                    this.loadTables();
                    this.modalReference.close();
                    this.ErrorModel = null;
                },
                error => {
                    Helpers.setLoading(false);
                    this.modalDismissReason(ModalDismissReasons.ESC)
                });
        }
        else {
            this.tableModel.TableStatus = "Vacant";
            this._tableService.add(this.tableModel).subscribe(
                data => {
                    Helpers.setLoading(false);
                    this.loadTables();
                    this.modalReference.close();
                    this.ErrorModel = null;

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
        if (this.tableModel.Name == "" || this.tableModel.Name == null || this.tableModel.Name == undefined) {
            result = false;
            this.ErrorModel.Name = "Name Title is Required";
        }
        if (this.tableModel.TableType == "0" || this.tableModel.TableType == "" || this.tableModel.TableType == null || this.tableModel.TableType == undefined) {
            result = false;
            this.ErrorModel.TableType = "TableType is Required";
        }
        if (this.tableModel.RestaurantId == "0" || this.tableModel.RestaurantId == "" || this.tableModel.RestaurantId == null || this.tableModel.RestaurantId == undefined) {
            result = false;
            this.ErrorModel.Restaurant = "Restaurant is Required";
        }
        return result;
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
  
    GetCode(id) {
        this.show = true;
        this.PaymentUser = {};
        if (this.ReservedTables != undefined) {
            var data = this.ReservedTables.filter(rest => rest._id === id)[0];
            if (data != null) {
              this.PaymentUser = data;
            }
        }
    }

    GetUserOrders(ReservationCode) {
        Helpers.setLoading(true);
        this.UserOrders = {};
        //this._tableService.getUserOrderByUser(this.PaymentUser.UserId, this.PaymentUser.RestaurantId).subscribe(
        //    data => {
        //        debugger;
        //        document.getElementById("openModalButton").click();
        //        var totalBill = 0;
        //        this.RestaurantTipAmnt = 0;
        //        var totalOrders = data.data;
        //        this.RecievedOrders = totalOrders.filter(order => order.OrderStatus === 'Received');
        //        this.UserOrders = data.data[2];    // Need to change 
        //        this.RecievedOrders.forEach(function (value) {
        //            var perOrdertotal = 0;
        //            value.OrderDetails.OrderdItems.forEach(function (order) {
        //                debugger;
        //                var price = order.ProductQty * order.ProductPrice.$numberDecimal;
        //                totalBill = totalBill + price;
        //                perOrdertotal = perOrdertotal + price;

        //            })
        //            value.OrderExtras.forEach(function (extra) {
        //                debugger;
        //                var priceextra = extra.ProductQty * extra.ProductPrice.$numberDecimal;
        //                totalBill = totalBill + priceextra;
        //                perOrdertotal = perOrdertotal + priceextra;

        //            })
        //            value.TotalPrice.$numberDecimal = perOrdertotal;
        //            value.Tips = 0;
        //        })
        //        this.OrdersTotalBill = totalBill;
        //        Helpers.setLoading(false);
        //    },
        //    error => {
        //        Helpers.setLoading(false);
        //    });
        this._tableService.getUserOrderByUserTable(this.PaymentUser.UserId, this.PaymentUser.TableId, this.PaymentUser.RestaurantId, ReservationCode).subscribe(
            data => {
                document.getElementById("openModalButton").click();
                var totalBill = 0;
                this.billtype = 'Single';
                this.RestaurantTipAmnt = 0;
                var totalOrders = data.data;
                this.RecievedOrders = totalOrders.filter(order => order.OrderStatus === 'Received');
                this.UserOrders = data.data[2];    // Need to change 
                this.RecievedOrders.forEach(function (value) {
                    var perOrdertotal = 0;
                    value.OrderDetails.OrderdItems.forEach(function (order) {
                        var price = order.ProductQty * order.ProductPrice.$numberDecimal;
                        totalBill = totalBill + price;
                        perOrdertotal = perOrdertotal + price;

                    })
                    value.OrderExtras.forEach(function (extra) {
                        var priceextra = extra.ProductQty * extra.ProductPrice.$numberDecimal;
                        totalBill = totalBill + priceextra;
                        perOrdertotal = perOrdertotal + priceextra;

                    })
                    value.TotalPrice.$numberDecimal = perOrdertotal;
                    value.Tips = 0;
                })
                this.OrdersTotalBill = totalBill;
                Helpers.setLoading(false);
            },
            error => {
                Helpers.setLoading(false);
            });
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

    ChangeTableStatus(id: any) {
        this.tableModel = new Table();
        this.tableModel._id = id;
        this.tableModel.TableStatus = "Vacant";
        this._tableService.updateStatus(this.tableModel).subscribe(
            data => {
                this.loadTables();
                Helpers.setLoading(false);
            },
            error => {
                Helpers.setLoading(false);
            });
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
  checkComplete(userId, recievedOrders) {
    //alert("TableId: " + this.PaymentUser.TableId);
        var singleSave = 0;
        var tipAmnt = 0;
        Helpers.setLoading(true);
        recievedOrders.forEach(function (value) {
            var orderId = value._id;
            if (singleSave == 0)
            {
                /// Add/update Tips
                // if (this.restaurantTipsModel == null) {
                this.restaurantTipsModel = new RestaurantTips();
                // }
                if (this.billtype == 'Single') {
                    tipAmnt = this.RestaurantTipAmnt;
                }
                else {
                    tipAmnt = value.Tips;
                }

                var todayDate = new Date();
                var currentMonth = todayDate.getMonth() + 1;
                //Note: 1=January, 2=February etc.
                this.restaurantTipsModel.Month = currentMonth;
                this.restaurantTipsModel.RestaurantId =this.SelectedRestaurant.Restaurant._id;
                this.restaurantTipsModel.TipAmount = tipAmnt;
                this.restaurantTipsModel.GivenByUserId = userId;

                this.restaurantTipsModel.OrderId = orderId;
                this.restaurantTipsModel.TableId = this.PaymentUser.TableId;
              
                if (this.restaurantTipsModel._id != undefined && this.restaurantTipsModel._id != '' && this.restaurantTipsModel._id != null) {
                    this._dashboardService.updateTips(this.restaurantTipsModel).subscribe(
                        data => {
                            Helpers.setLoading(false);
                            this.modalReference.close();

                        },
                        error => {
                            Helpers.setLoading(false);
                            // this.modalDismissReason(ModalDismissReasons.ESC)
                        });
                }
                else {
                    this._dashboardService.addTips(this.restaurantTipsModel).subscribe(
                        data => {
                            Helpers.setLoading(false);
                            this.modalReference.close();
                        },
                        error => {
                            Helpers.setLoading(false);
                            // this.modalDismissReason(ModalDismissReasons.ESC)
                        });
                }
            /// Add/update Tips
            }
            if (this.billtype == 'Single') {
                singleSave = 1;
            }
            else {
                singleSave = 0;
            }
           

            ///Add Update Spendure
            //if (this.restaurantSpendureModel == null) {
            this.restaurantSpendureModel = new RestaurantSpendure();
            //}
            var totalPayment = 0;
            value.OrderDetails.OrderdItems.forEach(function (value2) {
                totalPayment = totalPayment + parseInt(value2.ProductPrice.$numberDecimal);
            });
            value.OrderExtras.forEach(function (value3) {
                totalPayment = totalPayment + parseInt(value3.ProductPrice.$numberDecimal);
            });
            this.restaurantSpendureModel.RestaurantId = this.SelectedRestaurant.Restaurant._id;
            this.restaurantSpendureModel.Amount = totalPayment;
            this.restaurantSpendureModel.UserId = userId;
            this.restaurantSpendureModel.OrderId = orderId;
            this.restaurantSpendureModel.Status = 'Paid';
            if (this.restaurantSpendureModel._id != undefined && this.restaurantSpendureModel._id != '' && this.restaurantSpendureModel._id != null) {
                this._dashboardService.updateSpendure(this.restaurantSpendureModel).subscribe(
                    data => {
                        debugger;
                        Helpers.setLoading(false);
                        this.modalReference.close();

                    },
                    error => {
                        Helpers.setLoading(false);
                        // this.modalDismissReason(ModalDismissReasons.ESC)
                    });
            }
            else {
                this._dashboardService.addSpendure(this.restaurantSpendureModel).subscribe(
                    data => {
                        Helpers.setLoading(false);
                        this.modalReference.close();
                    },
                    error => {
                        Helpers.setLoading(false);
                        // this.modalDismissReason(ModalDismissReasons.ESC)
                    });
            }

            ///Add Update Spendure

        }.bind(this));
    }
  ConvertToFloat(val) {
      return parseFloat(val);
  }
  ngAfterViewInit() {
      this._script.loadScripts('app-tbl-management',
          ['assets/vendors/custom/jquery-ui/jquery-ui.bundle.js',
              'assets/demo/default/custom/components/portlets/draggable.js']);

  }
  closeModalPopup(id) {
    $("#" + id).modal("hide");
    setTimeout(function () {
      if ($('.modal').hasClass('show')) {
        $('body').addClass('modal-open');
      }
    }, 500); 
  }

  getVacantTable() {
    if (localStorage.getItem('SelectedRestaurant') != "undefined")
      this.SelectedRestaurant = JSON.parse(localStorage.getItem('SelectedRestaurant'));

    if (this.SelectedRestaurant != null) {
      Helpers.setLoading(true);
      this._tableService.getRemainingTable(this.SelectedRestaurant.Restaurant._id, "Vacant").subscribe(
        data => {
          this.tableCount = data.data.length;
          Helpers.setLoading(false);
        },
        error => {
          Helpers.setLoading(false);
        });
    }
  }

  sendNotification() {
    this._tableService.sendEmail(this.PaymentUser).subscribe(
      data => {
        this.show = false;
      },
      error => {
        this.show = true;
      });
  }

  //(change) = "onChange($event)"
  changeTableType(event) {
    var val = event.target.value ? (event.target.value).toLowerCase() : "";
    if (val.indexOf("square") > 0) {
      this.seatsOption = [{ id: 1, value: "2", label: "2 - Person" }];
    } else {
      this.seatsOption = [{ id: 1, value: "2", label: "2 - Person" }, { id: 2, value: "3", label: "3 - Person" }, { id: 3, value: "4", label: "4 - Person" },
      { id: 4, value: "5", label: "5 - Person" }, { id: 5, value: "6", label: "6 - Person" }];
    }
  }
}
