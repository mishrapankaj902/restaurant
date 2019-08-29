import { Component, OnInit, ViewEncapsulation, AfterViewInit, Input } from '@angular/core';
import { Helpers } from '../../../../helpers';
import { ScriptLoaderService } from '../../../../_services/script-loader.service';
import { ModalDismissReasons, NgbDateStruct, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { TableService } from '../../../../common/services/table.service';
import { Table } from '../../../../common/models/table';
import { RestaurantService } from '../../../../common/services/restaurant.service';



@Component({
  selector: 'app-live-orders',
  templateUrl: './live-orders.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class LiveOrdersComponent implements OnInit {
  RestaurantOrders: any;
  SelectedRestaurant: any;
  selectPopover;
  selectOrder = {};
  _currentPopover: any;
  popover: any;
  constructor(private _tableService: TableService) { }

  ngOnInit() {
    this.RestaurantOrders = [];
    this.selectPopover = [];
    this.popover = [];
    this.GetRestaurantOrders();
  }

  GetRestaurantOrders() {
    if (localStorage.getItem('SelectedRestaurant') !== 'undefined') {
      this.SelectedRestaurant = JSON.parse(localStorage.getItem('SelectedRestaurant'));
    }
    if (this.SelectedRestaurant != null) {
      Helpers.setLoading(true);
      this.RestaurantOrders = [];
      this._tableService.getUserOrderByRestaurant(this.SelectedRestaurant.Restaurant._id).subscribe(
        data => {
          this.selectPopover = [];
          this.popover = [];
          const orders = [];
          this.selectOrder = {};
          // Need to change This

          data.data.forEach(function (value) {
            value.OrderDetails.OrderdItems.forEach(function (order) {
              orders.push({
                ReservationId: value._id, Order: order, RestaurnatName: value.RestaurantName,
                OrderStatus: order.ItemStatus
              });
            });
          });
          this.RestaurantOrders = orders;
          console.log(this.RestaurantOrders);
          Helpers.setLoading(false);
        },
        error => {
          Helpers.setLoading(false);
        });
    }
  }

  updateReservationStatus(order, status) {
    Helpers.setLoading(true);
    const orderData = { _id: order.ReservationId, OrderStatus: status, ItemId: order.Order._id };
    this._tableService.updateOrderItemStatus(orderData).subscribe(
      data => {
        this.GetRestaurantOrders();
      },
      error => {
        Helpers.setLoading(false);
      });
  }

  togglePopover(pop: any, index: number, order) {
    this.selectOrder = order;
    if (this.selectPopover.length > 0) {
      this.selectPopover.forEach((element, i: number) => {
        this.selectPopover[i] = false;
      });
      if (this.selectPopover[index] === undefined) {
        this.selectPopover[index] = true;
      } else {
        this.selectPopover[index] = !this.selectPopover[index];
      }
    } else {
      this.selectPopover[index] = true;
    }
    this.popover[index] = pop;
    this.hideShowPopover();
  }

  hideShowPopover() {
    this.selectPopover.forEach((element, index) => {
      if (element) {
        this.popover[index].open();
      } else {
        this.popover[index].close();
      }
    });
  }

  onTap(i) {
    if (this.RestaurantOrders[i].tap === undefined) {
      this.RestaurantOrders[i].tap = 1;
    } else if (this.RestaurantOrders[i].tap < 2) {
      this.RestaurantOrders[i].tap = this.RestaurantOrders[i].tap + 1;
    }
    if (!!this.RestaurantOrders[i].tap) {
      const status = this.RestaurantOrders[i].OrderStatus;
      if (this.RestaurantOrders[i].tap === 2) {
        if (status === 'Received') {
          this.updateReservationStatus(this.RestaurantOrders[i] , 'Prepared');
          this.RestaurantOrders[i].OrderStatus = 'Prepared';
        }
        if (status === 'Prepared') {
          this.updateReservationStatus(this.RestaurantOrders[i] , 'Serving');
          this.RestaurantOrders[i].OrderStatus = 'Serving';
        }
        if (status === 'Serving') {
          this.updateReservationStatus(this.RestaurantOrders[i] , 'done');
        }
      }
    }

  }


  changeStatus(status) {
    this.updateReservationStatus(this.selectOrder, status);
  }
}
