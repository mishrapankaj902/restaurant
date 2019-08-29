import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import { Table } from "../models/table";
import { AppSettings } from '../../appsettings'

@Injectable()
export class TableService {

    apiURL = AppSettings.API_ENDPOINT;
    constructor(private http: Http) {
    }

    getAllTable() {
        return this.http.get(this.apiURL + '/api/table', this.jwt()).map((response: Response) => response.json());
    }

    getTableTypes() {
        return this.http.get(this.apiURL + '/api/table/type', this.jwt()).map((response: Response) => response.json());
    }

  getAllTableByRestaurant(id: any) {
        return this.http.get(this.apiURL + '/api/restaurant/' + id + '/table', this.jwt()).map((response: Response) => response.json());
    }

    update(table: Table) {
        return this.http.put(this.apiURL + '/api/table', table, this.jwt()).map((response: Response) => response.json());
    }

    updateStatus(table: Table) {
        return this.http.put(this.apiURL + '/api/table/updatestatus', table, this.jwt()).map((response: Response) => response.json());
    }

    add(table: Table) {
        return this.http.post(this.apiURL + '/api/table', table, this.jwt()).map((response: Response) => response.json());
    }

    delete(id: any) {
        return this.http.delete(this.apiURL + '/api/table/' + id, this.jwt()).map((response: Response) => response.json());
    }

  getReservedTableByRestaurantId(id: any) {
  
        return this.http.get(this.apiURL + '/api/restaurant/' + id+'/tableReservation', this.jwt()).map((response: Response) => response.json());
    }

    updateReservedTable(reservedTable: any) {
        return this.http.put(this.apiURL + '/api/tableReservation', reservedTable, this.jwt()).map((response: Response) => response.json());
    }
    
    getUserOrderByUser(userId: any, restaurantId: any) {
        return this.http.get(this.apiURL + '/api/Order/user/' + userId + '/restaurant/' + restaurantId, this.jwt()).map((response: Response) => response.json());
    }
    getUserOrderByUserTable(userId: any, tableid: any, restaurantId: any, reservationCode:any) {
        return this.http.get(this.apiURL + '/api/Order/user/' + userId + '/tableid/' + tableid + '/restaurant/' + restaurantId + '/code/'+reservationCode, this.jwt()).map((response: Response) => response.json());
    }
    getRemainingTable(restaurantId: any, tableStatus: any) {
      return this.http.get(this.apiURL + '/api/table/' + restaurantId + '/status/' + tableStatus, this.jwt()).map((response: Response) => response.json());
    }

    getUserOrderByRestaurant(restaurantId: any) {
        return this.http.get(this.apiURL + '/api/restaurant/' + restaurantId + '/Order', this.jwt()).map((response: Response) => response.json());
    }
 
    updateOrderStatus(reservedTable: any) {
        return this.http.put(this.apiURL + '/api/order/updatestatus', reservedTable, this.jwt()).map((response: Response) => response.json());
    }

    addTableReservation(table: any) {
        return this.http.post(this.apiURL + '/api/tableReservation', table, this.jwt()).map((response: Response) => response.json());
    }
    updateTableReservation(table: any) {
        return this.http.put(this.apiURL + '/api/tableReservation', table, this.jwt()).map((response: Response) => response.json());
    }

    updateOrderItemStatus(reservedTable: any) {
        return this.http.put(this.apiURL + '/api/order/updateitemstatus', reservedTable, this.jwt()).map((response: Response) => response.json());
    }

    sendEmail(userDetail:any) {
      return this.http.post(this.apiURL + '/api/sendMail', userDetail, this.jwt()).map((response: Response) =>
      response.json());
    }

    private jwt() {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            let headers = new Headers({ 'x-access-token': currentUser.token, 'content-type': 'application/json' });
            return new RequestOptions({ headers: headers });
        }
    }

}
