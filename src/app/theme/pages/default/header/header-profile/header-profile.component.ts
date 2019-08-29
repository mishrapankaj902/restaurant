import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef, ViewEncapsulation  } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { UserService } from '../../../../../auth/_services/user.service';
import { AlertService } from '../../../../../auth/_services/alert.service';
import { User, Subscription } from "../../../../../auth/_models/index";
import { AlertComponent } from '../../../../../auth/_directives/alert.component';
import * as _ from 'lodash';

@Component({
    selector: "app-header-profile",
    templateUrl: "./header-profile.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class HeaderProfileComponent implements OnInit {
  
  UserModel: User;
  SubscriptionModel: Subscription;
  initialSubscription: any;
  newSubscription: any;
  display: any;
  subscriptionArr = [];
  amount: any;

  @ViewChild('alertUpdate',
    { read: ViewContainerRef }) alertUpdate: ViewContainerRef;

  constructor(
    private _userService: UserService,
    private _alertService: AlertService,
    private cfr: ComponentFactoryResolver)
    {
    
    }
  ngOnInit() {
      this.UserModel = new User();
      this.SubscriptionModel = new Subscription()
      this.display = "none";
      Helpers.setLoading(false);
      this.getUserProfile();
      this.subscriptionArr =[
        { value: "bronze", label: "Bronze", id: 1, amount :"free"},
        { value: "silver", label: "Silver", id: 2, amount: 100 },
        { value: "gold", label: "Gold", id: 3, amount: 125 }
      ]
  }
  findId(val) {
    var result = { value: "bronze", label: "Bronze", id: 1, amount: "free" };
    _.find(this.subscriptionArr, function (o) {
      if (o.value == val) {
        result = o;
      }
    });
    return result;
  }
  getUserProfile() {
      Helpers.setLoading(true);
      let currentUser = JSON.parse(localStorage.getItem('currentUser'));
      this._userService.getById(currentUser.data._id).subscribe(
          data => {
              Helpers.setLoading(false);
              this.UserModel._id = currentUser.data._id;
              this.UserModel.FirstName = data.data.FirstName
              this.UserModel.LastName= data.data.LastName;
              this.UserModel.EmailAddress = data.data.EmailAddress;
              this.UserModel.FireBaseId = data.data.FireBaseId;
              this.UserModel.Subscription = data.data.Subscription;
              let result = this.findId(data.data.Subscription);
              this.initialSubscription = this.newSubscription  = result.id;
              this.amount = result.amount;
          },
          error => {
              Helpers.setLoading(false);
          });

  }

  filterChange(val) {
    let result = this.findId(val);
    this.newSubscription = result.id;
    this.amount = result.amount;
    this.UserModel.Subscription = val;
  }

  pay() {
    this.saveChange();
    this.display = 'none'; //set none css after close dialog
  }

  closeModalDialog() {
    this.display = 'none'; //set none css after close dialog
  }
  saveChange() {
    this._userService.update(this.UserModel).subscribe(
      data => {
        let result = this.findId(this.UserModel.Subscription);
        this.initialSubscription = result.id;
        this.amount = result.amount;
        Helpers.setLoading(false);
        this.showAlert('alertUpdate');
        this._alertService.success("Profile Updated Successfully.");
      },
      error => {
        Helpers.setLoading(false);
      });
  }
  showAlert(target) {
    this[target].clear();
    let factory = this.cfr.resolveComponentFactory(AlertComponent);
    let ref = this[target].createComponent(factory);
    ref.changeDetectorRef.detectChanges();
  }
  onSubmit() {
    Helpers.setLoading(true);
    
    if (this.initialSubscription < this.newSubscription && (this.newSubscription != 1)) {
      Helpers.setLoading(false);
      this.display = 'block';
    } else {
      this.saveChange();
    }

  }

}
