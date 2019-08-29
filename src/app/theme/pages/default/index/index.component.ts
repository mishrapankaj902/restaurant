import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Helpers } from '../../../../helpers';
import { ScriptLoaderService } from '../../../../_services/script-loader.service';
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { ModalDismissReasons, NgbDateStruct, NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { RestaurantGoalsService } from '../../../../common/services/restaurant-goals.service'
import { RestaurantGoals } from '../../../../common/models/restaurant-goals'
import { DashboardService } from '../../../../common/services/dashboard.service'
import { Chart } from 'chart.js/src/chart.js';


@Component({
    selector: "app-index",
    templateUrl: "./index.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class IndexComponent implements OnInit, AfterViewInit {

    modalReference: NgbModalRef;
    restaurantGoalsModel: RestaurantGoals;
    public modalClose: string;
    totalRevenue: any;
    revenuePercent: any;
    cashierPercent: any;
    customerPercent: any;
    SelectedRestaurant: any;
    revenueGoalfromModel: any;
    revenueGoal: any;
    averageTip: any;
    averageSpendure: any;
    chart = [];
    tipsLabel: any;
    spendureLabel: any;
    growthLabel: any;
    totalVisitor: any;
    reviews = [];
    rating: any;
    allReviews = [];
    cusomterNumber : any;
    growthRevenue: any;
    customerThisMonth: any;
    customerGoal: any;
    constructor(private _script: ScriptLoaderService,
        private _restaurantGoalsService: RestaurantGoalsService,
        private _dashboardService: DashboardService,
        private modalService: NgbModal) {

    }
    ngOnInit() {

        this.totalRevenue = 0;
        this.revenuePercent = 0;
        this.cashierPercent = 0;
        this.customerPercent = 0;
        this.customerGoal = 0;
        this.cusomterNumber = 0;
        this.growthRevenue = 0;
        this.customerThisMonth = 0;
        this.restaurantGoalsModel = new RestaurantGoals();
        this.loadSpendurethisMonthGoal();
        this.loadGoals();
        this.averageTip = 0;
        this.averageSpendure = 0;
        this.totalVisitor = 0;
        this.spendureLabel = "Today";
        this.growthLabel = "Today";
        this.tipsLabel = "Today";
        var todayDate = new Date();
        this.loadTipsToday(todayDate);
        this.loadTipsThisyear();
        this.loadSpendureChart();
        this.loadGrowthChart()
        var startDate = this.getFormattedDate(todayDate);
        this.loadSpendureBydate(new Date(startDate), todayDate);
        this.loadGrowthBydate(new Date(startDate), todayDate);
        this.totalVisitorPerDay();
        this.rating = 5;
        this.loadReviewsByRestaurant(5);

        //this.revenuePercent = (this.revenueGoal / this.totalRevenue) * 100;
    }

    loadGoals() {
        var todayDate = new Date();
        var currentMonth = todayDate.getMonth() + 1;
        if (localStorage.getItem('SelectedRestaurant') != "undefined")
            this.SelectedRestaurant = JSON.parse(localStorage.getItem('SelectedRestaurant'));
        if (this.SelectedRestaurant != null) {
            Helpers.setLoading(true);
            this._restaurantGoalsService.getGoalsByRestaurant(this.SelectedRestaurant.Restaurant._id, currentMonth).subscribe(
                data => {
                    if (data.data.length > 0) {
                        this.restaurantGoalsModel = data.data[0];
                        debugger;
                        this.revenueGoal = this.restaurantGoalsModel.RevenueGoal;
                        if (this.totalRevenue != 0) {
                            this.revenuePercent = (this.totalRevenue/this.revenueGoal) * 100;
                            this.revenuePercent = this.revenuePercent.toFixed(2);
                        }
                        else {
                            this.revenuePercent = 0;
                        }
                        this.customerGoal = this.restaurantGoalsModel.CustomerGoal;
                        if (this.customerThisMonth != 0) {
                            this.customerPercent = (this.customerThisMonth/this.customerGoal ) * 100;
                            this.customerPercent = this.revenuePercent.toFixed(2);
                        }
                        else {
                            this.customerPercent = 0;
                        }

                    }
                    else {
                        this.restaurantGoalsModel = new RestaurantGoals();
                        this.restaurantGoalsModel.RevenueGoal = 0;
                        this.restaurantGoalsModel.CashierGoal = 0;
                        this.restaurantGoalsModel.CustomerGoal = 0;
                    }
                    Helpers.setLoading(false);
                },
                error => {
                    Helpers.setLoading(false);
                });
        }
    }
    loadSpendurethisMonthGoal() {

        var todayDate = new Date();
        var currentMonth = todayDate.getMonth() + 1;
        if (localStorage.getItem('SelectedRestaurant') != "undefined")
            this.SelectedRestaurant = JSON.parse(localStorage.getItem('SelectedRestaurant'));
        if (this.SelectedRestaurant != null) {
            Helpers.setLoading(true);
            this._dashboardService.getSpendureByRestaurantMonth(this.SelectedRestaurant.Restaurant._id, currentMonth).subscribe(
                data => {
                    
                    var result = data.data;
                    var total = result.length;
                    this.customerThisMonth = total;
                    var daysArray = [];
                    var spendureAmnt = 0;
                    for (var index in result) {
                        spendureAmnt = spendureAmnt + result[index].Amount;
                    };
                    

                    if (spendureAmnt != 0) {
                        this.totalRevenue = spendureAmnt;

                    }
                    else {
                        this.totalRevenue = 0;

                    }
                    daysArray = this.sumSameMetrics(result);
                    var label = [];
                    var dataset = [];
                    for (var index in daysArray) {
                        label.push(daysArray[index][0]);
                        dataset.push(daysArray[index][1]);
                    };
                    var canvas = <HTMLCanvasElement>document.getElementById("m_chart_revenue");
                    var e = canvas.getContext("2d"), t = e.createLinearGradient(0, 0, 0, 240); t.addColorStop(0, Chart.helpers.color("#d1f1ec").alpha(1).rgbString()), t.addColorStop(1, Chart.helpers.color("#d1f1ec").alpha(.3).rgbString());
                    this.chart = new Chart('m_chart_revenue', {
                        type: "bar",
                        data: {
                            labels: label,
                            datasets: [
                                {
                                    backgroundColor: "#34bfa3",
                                    data: dataset
                                }
                                //,
                                //{
                                //    backgroundColor: "#f3f3fb",
                                //    data: [15, 20, 25, 30, 25, 20, 15, 20, 25, 30, 25, 20, 15, 10, 15, 20]
                                //}
                            ]
                        },
                        options: {
                            title: { display: !1 },
                            tooltips: {
                                intersect: !1,
                                mode: "nearest",
                                xPadding: 10,
                                yPadding: 10,
                                caretPadding: 10
                            },
                            legend: {
                                display: !1
                            },
                            responsive: !0,
                            maintainAspectRatio: !1,
                            barRadius: 4,
                            scales: {
                                xAxes: [{ display: 1, gridLines: !1, stacked: !0 }], yAxes: [{ display: 1, stacked: !0, gridLines: !1 }]
                            },
                            layout: { padding: { left: 0, right: 0, top: 0, bottom: 0 } }
                        }
                    });
                    Helpers.setLoading(false);
                },
                error => {
                    Helpers.setLoading(false);
                });
        }
    }

    sumSameMetrics(arr) {
        var sameMetrics = [];
        for (var i = 0; i < arr.length; i++) {
            if (sameMetrics.indexOf(arr[i].day) < 0) {
                sameMetrics.push(arr[i].day);
            }
        }
        sameMetrics = sameMetrics.map(a => [a, 0]);
        for (i = 0; i < arr.length; i++) {
            for (var j = 0; j < sameMetrics.length; j++) {
                if (arr[i].day === sameMetrics[j][0]) {
                    sameMetrics[j][1] += arr[i].Amount;
                }
            }
        }
        return sameMetrics;
    }

    ngAfterViewInit() {
        this._script.loadScripts('app-index',
            ['assets/app/js/dashboard.js']);

    }
    modalOpen(content, id) {

        //if (this.restaurantGoalsModel != null) {

        //}
        //else {
        //    this.restaurantGoalsModel = new RestaurantGoals();
        //}
        if (this.restaurantGoalsModel == null) {
            this.restaurantGoalsModel = new RestaurantGoals();
        }

        if (localStorage.getItem('SelectedRestaurant') != "undefined")
            this.SelectedRestaurant = JSON.parse(localStorage.getItem('SelectedRestaurant'));

        this.modalReference = this.modalService.open(content);
    }
    onSubmit() {

        Helpers.setLoading(true);
        var todayDate = new Date();
        var currentMonth = todayDate.getMonth() + 1;
        //Note: 1=January, 2=February etc.
        this.restaurantGoalsModel.Month = currentMonth;
        this.restaurantGoalsModel.RestaurantId = this.SelectedRestaurant.Restaurant._id;
        //this.revenuePercent = (this.revenueGoal / this.totalRevenue) * 100;

        if (this.restaurantGoalsModel._id != undefined && this.restaurantGoalsModel._id != '' && this.restaurantGoalsModel._id != null) {
            this._restaurantGoalsService.update(this.restaurantGoalsModel).subscribe(
                data => {
                    Helpers.setLoading(false);
                    this.modalReference.close();

                    this.revenueGoalfromModel = this.restaurantGoalsModel.RevenueGoal;
                    this.revenuePercent = (this.revenueGoalfromModel / this.totalRevenue) * 100;
                },
                error => {
                    Helpers.setLoading(false);
                    // this.modalDismissReason(ModalDismissReasons.ESC)
                });
        }
        else {
            this._restaurantGoalsService.add(this.restaurantGoalsModel).subscribe(
                data => {
                    Helpers.setLoading(false);
                    this.modalReference.close();
                    this.revenuePercent = (this.revenueGoal / this.totalRevenue) * 100;
                },
                error => {
                    Helpers.setLoading(false);
                    // this.modalDismissReason(ModalDismissReasons.ESC)
                });
        }
    }
    handleFormSubmit() {
        var result = true;
        return result;
    }
    loadTipsBydate(startDate, enddate) {

        if (localStorage.getItem('SelectedRestaurant') != "undefined")
            this.SelectedRestaurant = JSON.parse(localStorage.getItem('SelectedRestaurant'));
        if (this.SelectedRestaurant != null) {
            Helpers.setLoading(true);
            this._dashboardService.getAverageTipsByRestaurantRange(this.SelectedRestaurant.Restaurant._id, startDate, enddate).subscribe(
                data => {

                    var result = data.data;
                    var total = result.length;
                    var tipAmnt = 0;
                    for (var index in result) {
                        tipAmnt = tipAmnt + result[index].TipAmount;
                    }
                    if (tipAmnt != 0) {
                        var average = tipAmnt / total;
                        this.averageTip = average.toFixed(2);
                    }
                    else {
                        this.averageTip = 0;
                    }
                    Helpers.setLoading(false);
                },
                error => {

                    Helpers.setLoading(false);
                });
        }
    }
    loadTipsToday(todayDate) {
        if (localStorage.getItem('SelectedRestaurant') != "undefined")
            this.SelectedRestaurant = JSON.parse(localStorage.getItem('SelectedRestaurant'));
        if (this.SelectedRestaurant != null) {
            Helpers.setLoading(true);
            this._dashboardService.getAverageTipsByRestaurantdate(this.SelectedRestaurant.Restaurant._id, todayDate).subscribe(
                data => {

                    var result = data.data;
                    var total = result.length;
                    var tipAmnt = 0;
                    for (var index in result) {
                        tipAmnt = tipAmnt + result[index].TipAmount;
                    }
                    if (tipAmnt != 0) {
                        var average = tipAmnt / total;
                        this.averageTip = average.toFixed(2);
                    }
                    else {
                        this.averageTip = 0;
                    }
                    Helpers.setLoading(false);
                },
                error => {
                    Helpers.setLoading(false);
                });
        }
    }
    loadTipsthisMonth() {
        var todayDate = new Date();
        var currentMonth = todayDate.getMonth() + 1;
        if (localStorage.getItem('SelectedRestaurant') != "undefined")
            this.SelectedRestaurant = JSON.parse(localStorage.getItem('SelectedRestaurant'));
        if (this.SelectedRestaurant != null) {
            Helpers.setLoading(true);
            this._dashboardService.getAverageTipsByRestaurant(this.SelectedRestaurant.Restaurant._id, currentMonth).subscribe(
                data => {

                    var result = data.data;
                    var total = result.length;
                    var tipAmnt = 0;
                    for (var index in result) {
                        tipAmnt = tipAmnt + result[index].TipAmount;
                    }
                    if (tipAmnt != 0) {
                        var average = tipAmnt / total;
                        this.averageTip = average.toFixed(2);
                    }
                    else {
                        this.averageTip = 0;
                    }
                    Helpers.setLoading(false);
                },
                error => {
                    Helpers.setLoading(false);
                });
        }
    }

    loadTipsThisyear() {
        var todayDate = new Date();
        var year = todayDate.getFullYear();

        if (localStorage.getItem('SelectedRestaurant') != "undefined")
            this.SelectedRestaurant = JSON.parse(localStorage.getItem('SelectedRestaurant'));
        if (this.SelectedRestaurant != null) {
            Helpers.setLoading(true);
            this._dashboardService.getAverageTipsYear(this.SelectedRestaurant.Restaurant._id, year).subscribe(
                data => {

                    var result = data.data;
                    var jan = 0, feb = 0, mar = 0, apr = 0, may = 0, jun = 0, jul = 0, aug = 0, sep = 0, oct = 0, nov = 0, dec = 0;
                    var janCount = 0, febCount = 0, marCount = 0, aprCount = 0, mayCount = 0, junCount = 0, julCount = 0, augCount = 0, sepCount = 0, octCount = 0, novCount = 0, decCount = 0;
                    result.forEach(function (value) {

                        var month = value.Month;
                        switch (month) {
                            case 1: {
                                jan = jan + parseInt(value.TipAmount);
                                janCount = janCount + 1;
                                break;
                            }
                            case 2: {
                                feb = feb + parseInt(value.TipAmount);
                                febCount = febCount + 1;
                                break;
                            }
                            case 3: {
                                mar = mar + parseInt(value.TipAmount);
                                marCount = marCount + 1;
                                break;
                            }
                            case 4: {
                                apr = apr + parseInt(value.TipAmount);
                                aprCount = aprCount + 1;
                                break;
                            }
                            case 5: {
                                may = may + parseInt(value.TipAmount);
                                mayCount = mayCount + 1;
                                break;
                            }
                            case 6: {
                                jun = jun + parseInt(value.TipAmount);
                                junCount = junCount + 1;
                                break;
                            }
                            case 7: {
                                jul = jul + parseInt(value.TipAmount);
                                julCount = julCount + 1
                                break;
                            }
                            case 8: {
                                aug = aug + parseInt(value.TipAmount);
                                augCount = augCount + 1;
                                break;
                            }
                            case 9: {
                                sep = sep + parseInt(value.TipAmount);
                                sepCount = sepCount + 1;
                                break;
                            }
                            case 10: {
                                oct = oct + parseInt(value.TipAmount);
                                octCount = octCount + 1;
                                break;
                            }
                            case 11: {
                                nov = nov + parseInt(value.TipAmount);
                                novCount = novCount + 1;
                                break;
                            }
                            case 12: {
                                dec = dec + parseInt(value.TipAmount);
                                decCount = decCount + 1;
                                break;
                            }
                            default: {
                                console.log("Invalid choice");
                                break;
                            }
                        }
                    });
                    
                    if (jan != 0)
                        jan = jan / janCount;
                    if (feb != 0)
                        feb = feb / febCount;
                    if (mar != 0)
                        mar = mar / marCount;
                    if (apr != 0)
                        apr = apr / aprCount;
                    if (may != 0)
                        may = may / mayCount;
                    if (jun != 0)
                        jun = jun / junCount;
                    if (jul != 0)
                        jul = jul / julCount;
                    if (aug != 0)
                        aug = aug / augCount;
                    if (sep != 0)
                        sep = sep / sepCount;
                    if (oct != 0)
                        oct = oct / octCount;
                    if (nov != 0)
                        nov = nov / novCount;
                    if (dec != 0)
                    dec = dec / decCount;
                  var canvas = <HTMLCanvasElement>document.getElementById("m_chart_tips");
                  var e = canvas.getContext("2d"), t = e.createLinearGradient(0, 0, 0, 240);

                  t.addColorStop(0, Chart.helpers.color("#d1f1ec").alpha(1).rgbString()), t.addColorStop(1, Chart.helpers.color("#d1f1ec").alpha(.3).rgbString());
                    this.chart = new Chart('m_chart_tips', {
                        type: "line", data: {
                            labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                            datasets: [{
                                label: "Tips", backgroundColor: t, borderColor: "#34bfa3", pointBackgroundColor: Chart.helpers.color("#000000").alpha(0).rgbString(), pointBorderColor: Chart.helpers.color("#000000").alpha(0).rgbString(), pointHoverBackgroundColor: "#f4516c", pointHoverBorderColor: Chart.helpers.color("#000000").alpha(.1).rgbString(),
                                data: [jan.toFixed(2), feb.toFixed(2), mar.toFixed(2), apr.toFixed(2), may.toFixed(2), jun.toFixed(2), jul.toFixed(2), aug.toFixed(2), sep.toFixed(2), oct.toFixed(2), nov.toFixed(2), dec.toFixed(2)]
                            }]
                      }, options: { title: { display: !1 }, tooltips: { mode: "nearest", intersect: !1, position: "nearest", xPadding: 10, yPadding: 10, caretPadding: 10 }, legend: { display: !1 }, responsive: !0, maintainAspectRatio: !1, scales: { xAxes: [{ display: 1, gridLines: 1, scaleLabel: { display: !0, labelString: "Month" } }], yAxes: [{ display: 1, gridLines: 1, scaleLabel: { display: !0, labelString: "Euro" }, ticks: { beginAtZero: !0 } }] }, elements: { line: { tension: 1e-7 }, point: { radius: 4, borderWidth: 12 } }, layout: { padding: { left: 0, right: 0, top: 10, bottom: 0 } } }
                    });
                    Helpers.setLoading(false);
                },
                error => {
                    Helpers.setLoading(false);
                });
        }
    }
    getAverageTip(day) {
        switch (day) {
            case 'today': {
                var todayDate = new Date();
                //this.loadTipsToday(todayDate);
                var startDate = this.getFormattedDate(todayDate);
                this.loadTipsBydate(startDate, todayDate);
                this.tipsLabel = "Today";
                //statements; 
                break;
            }
            case 'yesterday': {
                //var ystday = new Date();
                //ystday.setDate(ystday.getDate() - 1);
                //this.loadTipsToday(ystday);
                var ystday = new Date();
                var year = ystday.getFullYear();
                var month = (ystday.getMonth()).toString();
                month = month.length > 1 ? month : '0' + month;
                var day2 = ystday.getDate().toString();
                day2 = day2.length > 1 ? day2 : '0' + day2;

                ystday = new Date(year, parseInt(month), parseInt(day2) - 1, 0, 0, 0, 0);
                var ystdayend = new Date(year, parseInt(month), parseInt(day2) - 1, 23, 59, 0, 0);

                this.loadTipsBydate(ystday, ystdayend);
                this.tipsLabel = "Yesterday";
                //statements;
                break;
            }
            case 'last7': {
                var todayDate = new Date();
                var last7 = new Date();
                last7.setDate(last7.getDate() - 7);
                this.loadTipsBydate(last7, todayDate);
                this.tipsLabel = "Last 7 Days";
                break;
            }
            case 'last30': {
                var todayDate = new Date();
                var last30 = new Date();
                last30.setDate(last30.getDate() - 30);
                this.loadTipsBydate(last30, todayDate);
                this.tipsLabel = "Last 30 Days";
                break;
            }
            case 'thismonth': {
                this.loadTipsthisMonth();
                this.tipsLabel = "This Month";
                break;
            }
            default: {
                var todayDate = new Date();
                this.loadTipsBydate(todayDate, "");
                this.tipsLabel = "Today";
                break;
            }
        }
    };
    ///spendure
    loadSpendureToday(todayDate) {
        if (localStorage.getItem('SelectedRestaurant') != "undefined")
            this.SelectedRestaurant = JSON.parse(localStorage.getItem('SelectedRestaurant'));
        if (this.SelectedRestaurant != null) {
            Helpers.setLoading(true);
            this._dashboardService.getSpendureByRestaurant(this.SelectedRestaurant.Restaurant._id, todayDate).subscribe(
                data => {

                    var result = data.data;
                    var total = result.length;
                    var spendureAmnt = 0;
                    for (var index in result) {
                        spendureAmnt = spendureAmnt + result[index].Amount;
                    }
                    if (spendureAmnt != 0) {
                        var average = spendureAmnt / total;
                        this.averageSpendure = average.toFixed(2);
                    }
                    else {
                        this.averageSpendure = 0;
                    }
                    Helpers.setLoading(false);
                },
                error => {
                    Helpers.setLoading(false);
                });
        }
    }

    loadSpendureBydate(startDate, enddate) {

        if (localStorage.getItem('SelectedRestaurant') != "undefined")
            this.SelectedRestaurant = JSON.parse(localStorage.getItem('SelectedRestaurant'));
        if (this.SelectedRestaurant != null) {
            Helpers.setLoading(true);
            this._dashboardService.getSpendureByRestaurantRange(this.SelectedRestaurant.Restaurant._id, startDate, enddate).subscribe(
                data => {

                    var result = data.data;
                    var total = result.length;
                    var spendureAmnt = 0;
                    for (var index in result) {
                        spendureAmnt = spendureAmnt + result[index].Amount;
                    }
                    if (spendureAmnt != 0) {
                        var average = spendureAmnt / total;
                        this.averageSpendure = average.toFixed(2);
                    }
                    else {
                        this.averageSpendure = 0;
                    }
                    Helpers.setLoading(false);
                },
                error => {
                    Helpers.setLoading(false);
                });
        }
    }

    loadSpendurethisMonth() {

        var todayDate = new Date();
        var currentMonth = todayDate.getMonth() + 1;
        if (localStorage.getItem('SelectedRestaurant') != "undefined")
            this.SelectedRestaurant = JSON.parse(localStorage.getItem('SelectedRestaurant'));
        if (this.SelectedRestaurant != null) {
            Helpers.setLoading(true);
            this._dashboardService.getSpendureByRestaurantMonth(this.SelectedRestaurant.Restaurant._id, currentMonth).subscribe(
                data => {

                    var result = data.data;
                    var total = result.length;
                    var spendureAmnt = 0;
                    for (var index in result) {
                        spendureAmnt = spendureAmnt + result[index].Amount;
                    }
                    if (spendureAmnt != 0) {
                        var average = spendureAmnt / total;
                        this.averageSpendure = average.toFixed(2);
                    }
                    else {
                        this.totalRevenue = 0;
                        this.averageSpendure = 0;
                    }
                    Helpers.setLoading(false);
                },
                error => {
                    Helpers.setLoading(false);
                });
        }
    }

    getFormattedDate(date) {
        var year = date.getFullYear();
        var month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;
        var day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;
        return year + '-' + month + '-' + day;
    }


    getAverageSpendure(day) {
        switch (day) {
            case 'today': {
                var todayDate = new Date();
                var startDate = this.getFormattedDate(todayDate);
                this.loadSpendureBydate(new Date(startDate), todayDate);
                //statements;
                this.spendureLabel = "Today";
                break;
            }
            case 'yesterday': {
                var ystday = new Date();
                var year = ystday.getFullYear();
                var month = (ystday.getMonth()).toString();
                month = month.length > 1 ? month : '0' + month;
                var day2 = ystday.getDate().toString();
                day2 = day2.length > 1 ? day2 : '0' + day2;

                ystday = new Date(year, parseInt(month), parseInt(day2) - 1, 0, 0, 0, 0);
                var ystdayend = new Date(year, parseInt(month), parseInt(day2) - 1, 23, 59, 0, 0);

                //ystday.setDate(ystday.getDate() - 1);
                this.loadSpendureBydate(ystday, ystdayend);
                //statements; 
                this.spendureLabel = "Yesterday";
                break;
            }
            case 'last7': {
                var todayDate = new Date();
                var last7 = new Date();
                last7.setDate(last7.getDate() - 7);
                this.loadSpendureBydate(last7, todayDate);
                this.spendureLabel = "Last 7 Days";
                break;
            }
            case 'last30': {
                var todayDate = new Date();
                var last30 = new Date();
                last30.setDate(last30.getDate() - 30);
                this.loadSpendureBydate(last30, todayDate);
                this.spendureLabel = "Last 30 Days";
                break;
            }
            case 'thismonth': {
                this.loadSpendurethisMonth();
                this.spendureLabel = "This Month";
                break;
            }
            default: {
                var todayDate = new Date();
                var startDate = this.getFormattedDate(todayDate);
                this.loadSpendureBydate(new Date(startDate), todayDate);
                this.spendureLabel = "Today";
                break;
            }
        }
    };

    loadSpendureChart() {
        var todayDate = new Date();
        var year = todayDate.getFullYear();

        if (localStorage.getItem('SelectedRestaurant') != "undefined")
            this.SelectedRestaurant = JSON.parse(localStorage.getItem('SelectedRestaurant'));
        if (this.SelectedRestaurant != null) {
            Helpers.setLoading(true);
            this._dashboardService.getAverageSpendureYear(this.SelectedRestaurant.Restaurant._id, year).subscribe(
                data => {

                    var result = data.data;
                    var jan = 0, feb = 0, mar = 0, apr = 0, may = 0, jun = 0, jul = 0, aug = 0, sep = 0, oct = 0, nov = 0, dec = 0;
                    var janCount = 0, febCount = 0, marCount = 0, aprCount = 0, mayCount = 0, junCount = 0, julCount = 0, augCount = 0, sepCount = 0, octCount = 0, novCount = 0, decCount = 0;
                    result.forEach(function (value) {

                        var month = value.Month;
                        switch (month) {
                            case 1: {
                                jan = jan + value.Amount;
                                janCount = janCount + 1;
                                break;
                            }
                            case 2: {
                                feb = feb + value.Amount;
                                febCount = febCount + 1;
                                break;
                            }
                            case 3: {
                                mar = mar + value.Amount;
                                marCount = marCount + 1;
                                break;
                            }
                            case 4: {
                                apr = apr + value.Amount;
                                aprCount = aprCount + 1;
                                break;
                            }
                            case 5: {
                                may = may + value.Amount;
                                mayCount = mayCount + 1;
                                break;
                            }
                            case 6: {
                                jun = jun + value.Amount;
                                junCount = junCount + 1;
                                break;
                            }
                            case 7: {
                                jul = jul + value.Amount;
                                julCount = julCount + 1
                                break;
                            }
                            case 8: {
                                aug = aug + value.Amount;
                                augCount = augCount + 1;
                                break;
                            }
                            case 9: {
                                sep = sep + value.Amount;
                                sepCount = sepCount + 1;
                                break;
                            }
                            case 10: {
                                oct = oct + value.Amount;
                                octCount = octCount + 1;
                                break;
                            }
                            case 11: {
                                nov = nov + value.Amount;
                                novCount = novCount + 1;
                                break;
                            }
                            case 12: {
                                dec = dec + value.Amount;
                                decCount = decCount + 1;
                                break;
                            }
                            default: {
                                console.log("Invalid choice");
                                break;
                            }
                        }
                    });
                    if (jan != 0)
                        jan = jan / janCount;
                    if (feb != 0)
                        feb = feb / febCount;
                    if (mar != 0)
                        mar = mar / marCount;
                    if (apr != 0)
                        apr = apr / aprCount;
                    if (may != 0)
                        may = may / mayCount;
                    if (jun != 0)
                        jun = jun / junCount;
                    if (jul != 0)
                        jul = jul / julCount;
                    if (aug != 0)
                        aug = aug / augCount;
                    if (sep != 0)
                        sep = sep / sepCount;
                    if (oct != 0)
                        oct = oct / octCount;
                    if (nov != 0)
                        nov = nov / novCount;
                    if (dec != 0)
                        dec = dec / decCount;
                    var canvas = <HTMLCanvasElement>document.getElementById("m_chart_spendure");
                    var e = canvas.getContext("2d"), t = e.createLinearGradient(0, 0, 0, 240); t.addColorStop(0, Chart.helpers.color("#d1f1ec").alpha(1).rgbString()), t.addColorStop(1, Chart.helpers.color("#d1f1ec").alpha(.3).rgbString());
                    this.chart = new Chart('m_chart_spendure', {
                        type: "line", data: {
                            labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                            datasets: [{
                                label: "Spendure", backgroundColor: t, borderColor: "#34bfa3", pointBackgroundColor: Chart.helpers.color("#000000").alpha(0).rgbString(), pointBorderColor: Chart.helpers.color("#000000").alpha(0).rgbString(), pointHoverBackgroundColor: "#f4516c", pointHoverBorderColor: Chart.helpers.color("#000000").alpha(.1).rgbString(),
                                data: [jan.toFixed(2), feb.toFixed(2), mar.toFixed(2), apr.toFixed(2), may.toFixed(2), jun.toFixed(2), jul.toFixed(2), aug.toFixed(2), sep.toFixed(2), oct.toFixed(2), nov.toFixed(2), dec.toFixed(2)]
                            }]
                        }, options: { title: { display: !1 }, tooltips: { mode: "nearest", intersect: !1, position: "nearest", xPadding: 10, yPadding: 10, caretPadding: 10 }, legend: { display: !1 }, responsive: !0, maintainAspectRatio: !1, scales: { xAxes: [{ display: 1, gridLines: 1, scaleLabel: { display: !0, labelString: "Month" } }], yAxes: [{ display: 1, gridLines: 1, scaleLabel: { display: !0, labelString: "Euro" }, ticks: { beginAtZero: !0 } }] }, elements: { line: { tension: 1e-7 }, point: { radius: 4, borderWidth: 12 } }, layout: { padding: { left: 0, right: 0, top: 10, bottom: 0 } } }
                    });
                    Helpers.setLoading(false);
                },
                error => {
                    Helpers.setLoading(false);
                });
        }
    }
    /// end spendure

    ///Growth
    loadGrowthChart() {
        var todayDate = new Date();
        var year = todayDate.getFullYear();

        if (localStorage.getItem('SelectedRestaurant') != "undefined")
            this.SelectedRestaurant = JSON.parse(localStorage.getItem('SelectedRestaurant'));
        if (this.SelectedRestaurant != null) {
            Helpers.setLoading(true);
            this._dashboardService.getAverageSpendureYear(this.SelectedRestaurant.Restaurant._id, year).subscribe(
                data => {

                    var result = data.data;
                    var jan = 0, feb = 0, mar = 0, apr = 0, may = 0, jun = 0, jul = 0, aug = 0, sep = 0, oct = 0, nov = 0, dec = 0;
                    var janCount = 0, febCount = 0, marCount = 0, aprCount = 0, mayCount = 0, junCount = 0, julCount = 0, augCount = 0, sepCount = 0, octCount = 0, novCount = 0, decCount = 0;
                    result.forEach(function (value) {

                        var month = value.Month;
                        switch (month) {
                            case 1: {
                                jan = jan + value.Amount;
                                janCount = janCount + 1;
                                break;
                            }
                            case 2: {
                                feb = feb + value.Amount;
                                febCount = febCount + 1;
                                break;
                            }
                            case 3: {
                                mar = mar + value.Amount;
                                marCount = marCount + 1;
                                break;
                            }
                            case 4: {
                                apr = apr + value.Amount;
                                aprCount = aprCount + 1;
                                break;
                            }
                            case 5: {
                                may = may + value.Amount;
                                mayCount = mayCount + 1;
                                break;
                            }
                            case 6: {
                                jun = jun + value.Amount;
                                junCount = junCount + 1;
                                break;
                            }
                            case 7: {
                                jul = jul + value.Amount;
                                julCount = julCount + 1
                                break;
                            }
                            case 8: {
                                aug = aug + value.Amount;
                                augCount = augCount + 1;
                                break;
                            }
                            case 9: {
                                sep = sep + value.Amount;
                                sepCount = sepCount + 1;
                                break;
                            }
                            case 10: {
                                oct = oct + value.Amount;
                                octCount = octCount + 1;
                                break;
                            }
                            case 11: {
                                nov = nov + value.Amount;
                                novCount = novCount + 1;
                                break;
                            }
                            case 12: {
                                dec = dec + value.Amount;
                                decCount = decCount + 1;
                                break;
                            }
                            default: {
                                console.log("Invalid choice");
                                break;
                            }
                        }
                    });
                    if (jan != 0)
                        jan = jan / janCount;
                    if (feb != 0)
                        feb = feb / febCount;
                    if (mar != 0)
                        mar = mar / marCount;
                    if (apr != 0)
                        apr = apr / aprCount;
                    if (may != 0)
                        may = may / mayCount;
                    if (jun != 0)
                        jun = jun / junCount;
                    if (jul != 0)
                        jul = jul / julCount;
                    if (aug != 0)
                        aug = aug / augCount;
                    if (sep != 0)
                        sep = sep / sepCount;
                    if (oct != 0)
                        oct = oct / octCount;
                    if (nov != 0)
                        nov = nov / novCount;
                    if (dec != 0)
                        dec = dec / decCount;
                    
                    var canvas = <HTMLCanvasElement>document.getElementById("m_chart_growth_stats");
                    var e = canvas.getContext("2d"), t = e.createLinearGradient(0, 0, 0, 240);
                    t.addColorStop(0, Chart.helpers.color("#ffefce").alpha(1).rgbString()), t.addColorStop(1, Chart.helpers.color("#ffefce").alpha(.3).rgbString());
                    var a = {
                        type: "line", data: {
                            labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October","November","December"],
                            datasets: [
                                {
                                    label: "Customers", backgroundColor: "#716ACA", borderColor: "#716ACA", pointBackgroundColor: Chart.helpers.color("#000000").alpha(0).rgbString(), pointBorderColor: Chart.helpers.color("#000000").alpha(0).rgbString(), pointHoverBackgroundColor: "#f4516c", pointHoverBorderColor: Chart.helpers.color("#000000").alpha(.1).rgbString(),
                                    data: [janCount, febCount, marCount, aprCount, mayCount, junCount, julCount, augCount, sepCount, octCount, novCount, decCount]
                                },
                                {
                                    label: "Revenue", backgroundColor: "#00C5DC", borderColor: "#00C5DC", pointBackgroundColor: Chart.helpers.color("#000000").alpha(0).rgbString(), pointBorderColor: Chart.helpers.color("#000000").alpha(0).rgbString(), pointHoverBackgroundColor: "#f4516c", pointHoverBorderColor: Chart.helpers.color("#000000").alpha(.1).rgbString(),
                                    data: [jan.toFixed(2), feb.toFixed(2), mar.toFixed(2), apr.toFixed(2), may.toFixed(2), jun.toFixed(2), jul.toFixed(2), aug.toFixed(2), sep.toFixed(2), oct.toFixed(2), nov.toFixed(2), dec.toFixed(2)]
                                }]
                        }, options: { title: { display: !1 }, tooltips: { mode: "nearest", intersect: !1, position: "nearest", xPadding: 10, yPadding: 10, caretPadding: 10 }, legend: { display: !1 }, responsive: !0, maintainAspectRatio: !1, scales: { xAxes: [{ display: 1, gridLines: !1, scaleLabel: { display: !0, labelString: "Month" } }], yAxes: [{ stacked: !0, display: 1, gridLines: !1, scaleLabel: { display: !0, labelString: "Value" }, ticks: { beginAtZero: !0 } }] }, elements: { line: { tension: 1e-7 }, point: { radius: 4, borderWidth: 12 } }, layout: { padding: { left: 0, right: 0, top: 10, bottom: 0 } } }
                    }; new Chart(e, a)

                    Helpers.setLoading(false);
                },
                error => {
                    Helpers.setLoading(false);
                });
        }
    }
    loadGrowthBydate(startDate, enddate) {

        if (localStorage.getItem('SelectedRestaurant') != "undefined")
            this.SelectedRestaurant = JSON.parse(localStorage.getItem('SelectedRestaurant'));
        if (this.SelectedRestaurant != null) {
            Helpers.setLoading(true);
            this._dashboardService.getSpendureByRestaurantRange(this.SelectedRestaurant.Restaurant._id, startDate, enddate).subscribe(
                data => {
                    var result = data.data;
                    var total = result.length;
                    this.cusomterNumber = total;
                    var spendureAmnt = 0;
                    for (var index in result) {
                        spendureAmnt = spendureAmnt + result[index].Amount;
                    }
                    if (spendureAmnt != 0) {
                       
                        this.growthRevenue = spendureAmnt.toFixed(2);
                    }
                    else {
                        this.growthRevenue = 0;
                    }
                    Helpers.setLoading(false);
                },
                error => {
                    Helpers.setLoading(false);
                });
        }
    }
    loadGrowththisMonth() {

        var todayDate = new Date();
        var currentMonth = todayDate.getMonth() + 1;
        if (localStorage.getItem('SelectedRestaurant') != "undefined")
            this.SelectedRestaurant = JSON.parse(localStorage.getItem('SelectedRestaurant'));
        if (this.SelectedRestaurant != null) {
            Helpers.setLoading(true);
            this._dashboardService.getSpendureByRestaurantMonth(this.SelectedRestaurant.Restaurant._id, currentMonth).subscribe(
                data => {

                    var result = data.data;
                    var total = result.length;
                    this.cusomterNumber = total;
                    var spendureAmnt = 0;
                    for (var index in result) {
                        spendureAmnt = spendureAmnt + result[index].Amount;
                    }
                    if (spendureAmnt != 0) {

                        this.growthRevenue = spendureAmnt.toFixed(2);
                    }
                    else {
                        this.growthRevenue = 0;
                    }
                    Helpers.setLoading(false);
                },
                error => {
                    Helpers.setLoading(false);
                });
        }
    }
    getAverageGrowth(day) {
        switch (day) {
            case 'today': {
                var todayDate = new Date();
                var startDate = this.getFormattedDate(todayDate);
                this.loadGrowthBydate(new Date(startDate), todayDate);
                //statements;
                this.growthLabel = "Today";
                break;
            }
            case 'yesterday': {
                var ystday = new Date();
                var year = ystday.getFullYear();
                var month = (ystday.getMonth()).toString();
                month = month.length > 1 ? month : '0' + month;
                var day2 = ystday.getDate().toString();
                day2 = day2.length > 1 ? day2 : '0' + day2;

                ystday = new Date(year, parseInt(month), parseInt(day2) - 1, 0, 0, 0, 0);
                var ystdayend = new Date(year, parseInt(month), parseInt(day2) - 1, 23, 59, 0, 0);

                //ystday.setDate(ystday.getDate() - 1);
                this.loadGrowthBydate(ystday, ystdayend);
                //statements; 
                this.growthLabel = "Yesterday";
                break;
            }
            case 'last7': {
                var todayDate = new Date();
                var last7 = new Date();
                last7.setDate(last7.getDate() - 7);
                this.loadGrowthBydate(last7, todayDate);
                this.growthLabel = "Last 7 Days";
                break;
            }
            case 'last30': {
                var todayDate = new Date();
                var last30 = new Date();
                last30.setDate(last30.getDate() - 30);
                this.loadGrowthBydate(last30, todayDate);
                this.growthLabel = "Last 30 Days";
                break;
            }
            case 'thismonth': {
                this.loadGrowththisMonth();
                this.growthLabel = "This Month";
                break;
            }
            default: {
                var todayDate = new Date();
                var startDate = this.getFormattedDate(todayDate);
                this.loadGrowthBydate(new Date(startDate), todayDate);
                this.growthLabel = "Today";
                break;
            }
        }
    };
    //todo
    loadgrowthBydate(startDate, enddate) {

        if (localStorage.getItem('SelectedRestaurant') != "undefined")
            this.SelectedRestaurant = JSON.parse(localStorage.getItem('SelectedRestaurant'));
        if (this.SelectedRestaurant != null) {
            Helpers.setLoading(true);
            this._dashboardService.getSpendureByRestaurantRange(this.SelectedRestaurant.Restaurant._id, startDate, enddate).subscribe(
                data => {

                    var result = data.data;
                    var total = result.length;
                    var spendureAmnt = 0;
                    for (var index in result) {
                        spendureAmnt = spendureAmnt + result[index].Amount;
                    }
                    if (spendureAmnt != 0) {
                        var average = spendureAmnt / total;
                        this.averageSpendure = average.toFixed(2);
                    }
                    else {
                        this.averageSpendure = 0;
                    }
                    Helpers.setLoading(false);
                },
                error => {
                    Helpers.setLoading(false);
                });
        }
    }

    ///End Growth

    ///Reviews
    loadReviewsByRestaurant(stars) {
        this.reviews = [];
        this.rating = stars;
        if (localStorage.getItem('SelectedRestaurant') != "undefined")
            this.SelectedRestaurant = JSON.parse(localStorage.getItem('SelectedRestaurant'));
        if (this.SelectedRestaurant != null) {
            Helpers.setLoading(true);
            this._dashboardService.getReviewsByRestaurant(this.SelectedRestaurant.Restaurant._id, stars).subscribe(
                data => {
                    
                    var result = data.data;
                    this.reviews = result;
                    Helpers.setLoading(false);
                },
                error => {
                    Helpers.setLoading(false);
                });
        }
    }
    showAllReview() {
        this.allReviews = [];
        var stars = -1;
        if (localStorage.getItem('SelectedRestaurant') != "undefined")
            this.SelectedRestaurant = JSON.parse(localStorage.getItem('SelectedRestaurant'));
        if (this.SelectedRestaurant != null) {
            Helpers.setLoading(true);
            this._dashboardService.getReviewsByRestaurant(this.SelectedRestaurant.Restaurant._id, stars).subscribe(
                data => {
                    
                    var result = data.data;
                    this.allReviews = result;
                    Helpers.setLoading(false);
                },
                error => {
                    Helpers.setLoading(false);
                });
        }
    }
    ///End Reviews
    totalVisitorPerDay() {

        var startDate = new Date();
        // var startDate = this.getFormattedDate(todayDate);


        var year = startDate.getFullYear();
        var month = (startDate.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;
        var day2 = startDate.getDate().toString();
        day2 = day2.length > 1 ? day2 : '0' + day2;

        startDate = new Date(year, parseInt(month), parseInt(day2), 0, 0, 0, 0);


        var endDate = new Date();
        if (localStorage.getItem('SelectedRestaurant') != "undefined")
            this.SelectedRestaurant = JSON.parse(localStorage.getItem('SelectedRestaurant'));
        if (this.SelectedRestaurant != null) {
            Helpers.setLoading(true);
            this._dashboardService.getSpendureByRestaurantRange(this.SelectedRestaurant.Restaurant._id, new Date(startDate), endDate).subscribe(
              data => {
               
                var result = data.data;
                    this.totalVisitor = result.length;

                    Helpers.setLoading(false);
                },
                error => {
                    Helpers.setLoading(false);
                });
        }
    }
}
