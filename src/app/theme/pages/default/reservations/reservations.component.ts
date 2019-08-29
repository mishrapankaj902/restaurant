import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Helpers } from '../../../../helpers';
import { ScriptLoaderService } from '../../../../_services/script-loader.service';
import 'fullcalendar';
import * as moment from 'moment'
import { TableService } from '../../../../common/services/table.service'
import { ModalDismissReasons, NgbDateStruct, NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { TableReservation } from '../../../../common/models/tableReservation'
import { RestaurantService } from '../../../../common/services/restaurant.service'
import { UserService } from '../../../../auth/_services/user.service'
import { DatePicker } from 'angular2-datetimepicker';
import * as $ from 'jquery'

declare let mApp: any;
@Component({
  selector: 'app-reservations',
  templateUrl: "./reservations.component.html",
  encapsulation: ViewEncapsulation.None
})
export class ReservationsComponent implements OnInit {
  RestaurantOrders: any;
  SelectedRestaurant: any;
  ReservedTables: any;
  newEvents: any;
  tableReservationModel: TableReservation;
  SelectedTable: any;
  modalReference: NgbModalRef;
  Tables: any;
  Restaurants: any;
  public modalClose: string;
  ErrorModel: any;
  Users: any;
  VacantTables: any;
  date: Date = new Date();
  settings = {
    format: 'dd-MM-yyyy hh:mm a',
    defaultOpen: false,
    closeOnSelect: true,
    timePicker: true,
  }
  constructor(private modalService: NgbModal,
    private _tableService: TableService,
    private _script: ScriptLoaderService,
    private _restaurantService: RestaurantService,
    private _userService: UserService) {

    DatePicker.prototype.ngOnInit = function () {
      this.settings = Object.assign(this.defaultSettings, this.settings);
      if (this.settings.defaultOpen) {
        this.popover = true;
      }
      this.date = new Date();
    };


  }

  ngOnInit() {
    this.loadRestaurantData();
    var e = moment().startOf("day"),
      t = e.format("YYYY-MM"),
      i = e.clone().subtract(1, "day").format("YYYY-MM-DD"),
      n = e.format("YYYY-MM-DD"),
      r = e.clone().add(1, "day").format("YYYY-MM-DD");

    $("#m_calendar").fullCalendar(
      {
        header:
          {
            left: "prev,next today",
            center: "title",
            right: "month,agendaWeek,agendaDay,listWeek"
          },
        editable: !0,
        eventLimit: !0,
        navLinks: !0,
        events: [],
        eventRender: function (e, t) {
          t.hasClass("fc-day-grid-event") ? (t.data("content", e.description),
            t.data("placement", "top")) : t.hasClass("fc-time-grid-event") ? t.find(".fc-title").append('<div class="fc-description">' + e.description + "</div>") : 0 !== t.find(".fc-list-item-title").length && t.find(".fc-list-item-title").append('<div class="fc-description">' + e.description + "</div>")
        },
        eventDrop: function (event, dayDelta, minuteDelta, allDay, revertFunc) {
          let tableId = event.tableId;
          let date = event.end._d;

          if (tableId) {
            this.tableReservationModel = new TableReservation()
            this.tableReservationModel._id = tableId;
            this.tableReservationModel.ModifiedDate = date;
            this.tableReservationModel.TableReservationDate = date;
            this._tableService.updateTableReservation(this.tableReservationModel).subscribe(
              data => {
                Helpers.setLoading(false);
              },
              error => {
                Helpers.setLoading(false);
              });
          }
        }.bind(this)
      });

    this.RestaurantOrders = [];
    this.GetRestaurantOrders();
    this.loadReservedTables();
    this.loadCustomers();
    this.loadTables();
  }

  ngAfterViewInit() {
    //this._script.loadScripts('app-reservations',
    //    ['assets/demo/default/custom/components/calendar/basic.js']);

  }

  onDateSelect(event: any) {

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

          Helpers.setLoading(false);
        },
        error => {
          Helpers.setLoading(false);
        });
    }
  }

  loadCustomers() {
    Helpers.setLoading(true);
    this._userService.getCustomers().subscribe(
      data => {
        this.Users = data.data;
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

  loadReservedTables() {
    Helpers.setLoading(true);
    if (localStorage.getItem('SelectedRestaurant') != "undefined")
      this.SelectedRestaurant = JSON.parse(localStorage.getItem('SelectedRestaurant'));
    if (this.SelectedRestaurant != null) {
      this._tableService.getReservedTableByRestaurantId(this.SelectedRestaurant.Restaurant._id).subscribe(
        data => {
          this.ReservedTables = data.data;
          var newEvents = [];
          if (this.ReservedTables != null) {
            this.ReservedTables.forEach(function (value) {
              var sdate = new Date(value.TableReservationDate);
              var sd = sdate.getDate();
              var sm = sdate.getMonth();
              var sy = sdate.getFullYear();
              var shr = sdate.getHours();
              var smin = sdate.getMinutes(); 
              var tableId = value._id;
              newEvents.push({
                title: value.FirstName + " " + value.LastName,
                start: new Date(sy, sm, sd, shr, smin),
                end: new Date(sy, sm, sd, shr, smin),
                description: value.RestaurantName,
                className: "body fc fc-event-border",
                allDay: false,
                tableId: tableId
              })
            });
          }

          $('#m_calendar').fullCalendar("removeEvents");
          $('#m_calendar').fullCalendar('addEventSource', newEvents)
          $('#m_calendar').fullCalendar('rerenderEvents')
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
        this.tableReservationModel = new TableReservation()
        this.tableReservationModel = this.SelectedTable;
        this.date = this.tableReservationModel.TableReservationDate;
        this.modalReference = this.modalService.open(content);
        this.modalReference.result.then((result) => {
          this.modalClose = `Closed with: ${result}`;
        }, (reason) => {
          this.modalClose = `Dismissed ${this.modalDismissReason(reason)}`;
        });
        Helpers.setLoading(false);

      } else {
        this.tableReservationModel = new TableReservation()
        this.tableReservationModel.RestaurantId = "0";
        this.tableReservationModel.UserId = "0";
        this.tableReservationModel.TableId = "0";
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
      this.tableReservationModel = new TableReservation()
      this.tableReservationModel.RestaurantId = this.SelectedRestaurant.Restaurant._id;
      this.tableReservationModel.UserId = "0";
      this.tableReservationModel.TableId = "0";
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
    if (this.handleFormSubmit()) {
      var selectedRestaurant = this.Restaurants.filter(rest => rest._id === this.tableReservationModel.RestaurantId)[0];
      if (selectedRestaurant != null)
        this.tableReservationModel.RestaurantName = selectedRestaurant.Name;

      var selectedUser = this.Users.filter(u => u._id === this.tableReservationModel.UserId)[0];
      if (selectedUser != null) {
        this.tableReservationModel.FirstName = selectedUser.FirstName;
        this.tableReservationModel.LastName = selectedUser.LastName;
      }
      Helpers.setLoading(true);
      if (this.tableReservationModel._id != undefined && this.tableReservationModel._id != '' && this.tableReservationModel._id != null) {
        this._tableService.updateTableReservation(this.tableReservationModel).subscribe(
          data => {
            Helpers.setLoading(false);
            this.loadTables();
            this.loadReservedTables();
            this.modalReference.close();

            this.ErrorModel = null;
          },
          error => {
            Helpers.setLoading(false);
            this.modalDismissReason(ModalDismissReasons.ESC)
          });
      }
      else {
        this._tableService.addTableReservation(this.tableReservationModel).subscribe(
          data => {
            this.loadTables();
            Helpers.setLoading(false);
            this.loadReservedTables();
            this.modalReference.close();
            this.ErrorModel = null;

          },
          error => {
            Helpers.setLoading(false);
            this.modalDismissReason(ModalDismissReasons.ESC)
          });
      }
    }
  }

  handleFormSubmit() {
    this.tableReservationModel.TableReservationDate = this.date;
    var result = true;
    this.ErrorModel = {};
    if (this.tableReservationModel.UserId == "0" || this.tableReservationModel.UserId == "" || this.tableReservationModel.UserId == null || this.tableReservationModel.UserId == undefined) {
      result = false;
      this.ErrorModel.User = "User is Required";
    }
    if (this.tableReservationModel.TableId == "0" || this.tableReservationModel.TableId == "" || this.tableReservationModel.TableId == null || this.tableReservationModel.TableId == undefined) {
      result = false;
      this.ErrorModel.Table = "Table is Required";
    }
    if (this.tableReservationModel.RestaurantId == "0" || this.tableReservationModel.RestaurantId == "" || this.tableReservationModel.RestaurantId == null || this.tableReservationModel.RestaurantId == undefined) {
      result = false;
      this.ErrorModel.Restaurant = "Restaurant is Required";
    }
    if (this.tableReservationModel.TableReservationQuantity == 0 || this.tableReservationModel.TableReservationQuantity == null || this.tableReservationModel.TableReservationQuantity == undefined) {
      result = false;
      this.ErrorModel.Quantity = "Quantity must be greater than 0";
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
}
