import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { DatabaseService } from 'src/_services/DatabaseService'
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';

@Component({
    selector: 'app-add-distribution',
    templateUrl: './add-distribution.component.html',
    animations: [slideToTop()],
    providers: [DatePipe],
})
export class AddDistributionComponent implements OnInit {

    state_list: any = [];
    countryList: any = [];
    district_list: any = [];
    city_list: any = [];
    city_area_list:any=[];
    pinCode_list: any = [];
    data: any = {};
    contact_person = {};
    asmList: any = [];
    assignUserList = [];
    assignUserId = [];
    dr_type: any;
    brand_list: any = [];
    temp_state_list=[];
    temp_district_list=[];
    tmp_city_list=[];

    options: string[] = ['One', 'Two', 'Three'];
    filteredOptions: Observable<string[]>;
    searchMoviesCtrl = new FormControl();
    rsm: any = [];
    ass_user: any = [];
    brand: any = [];
    tmp_drlist: any = [];
    drlist: any = [];
    tmpsearchdr: any = {};

    filter_data: any;
    isLoading = false;
    errorMsg: string;
    active: any = {};
    submit: any = true;
    exist: boolean = false;
    tmp_userList: any = [];
    search: any = {};
    tmpsearch: any = {};
    ass_dist: any = [];
    myDate: Date;
    userData:any;
    userId:any;

    constructor(
        public serve: DatabaseService,
        public rout: Router,
        public route: ActivatedRoute,
        private http: HttpClient) {
        this.route.params.subscribe(params => {
            console.log(params);
            this.dr_type = params.type;
            console.log(this.dr_type);
            this.myDate = new Date();


        });
        // this.getStateList();
        this.salesUserLIst();
        this.getCountryList();
        this.getStateList();
        this.getBrandList();
        this.distributorList();

        this.data.country="INDIA";
        // this.data.doa
        this.userData = JSON.parse(localStorage.getItem('st_user'));
        console.log(this.userData);
        this.userId=this.userData['data']['id'];

    }

    ngOnInit() {
        this.searchMoviesCtrl.valueChanges.pipe(debounceTime(500), tap(() => {
            this.errorMsg = "";
            this.filter_data = [];
            this.isLoading = true;
            console.log("DD");
        }),
            switchMap(value => this.http.post(this.serve.dbUrl + "cp_suggestive/get_result", { 'value': value }).pipe(finalize(() => {
                this.isLoading = false
            })))).subscribe(data => {
                console.log(data);

                if (data['res'] == undefined) {
                    this.errorMsg = data['Error'];
                    this.filter_data = [];
                } else {
                    this.errorMsg = "";
                    this.filter_data = data['res'];
                }

                console.log(this.filter_data);
            });
    }

    toggleterritory(key, action) {
        if (action == 'open') {
            this.active[key] = true;
        }
        if (action == 'close') {
            this.active[key] = false;
        }
        // this.salesUserLIst();
    }

    DOBError: boolean = false;
    DOAError: boolean = false;
    submitDetail() {
        console.log(this.data);
        


        if ((this.data.doa) && (this.data.dob)) {
            if ((this.data.doa < this.myDate) && (this.data.dob < this.myDate)) {
                this.DOBError = false;
                this.DOAError = false;
                if (this.data.dob < this.data.doa) {
                    this.data.brand = this.brand;
                    this.data.company_name = this.searchMoviesCtrl.value;
                    this.data.sales_executive = this.ass_user;
                    // this.data.distributors = this.ass_dist;

                    if (this.submit && !this.exist) {
                        console.log(this.data);
                        
                        this.data.doa = moment(this.data.doa).format('YYYY-MM-DD');
                        this.data.dob = moment(this.data.dob).format('YYYY-MM-DD');
                        this.serve.fetchData({ "data": this.data, 'type': this.dr_type ,'uid':this.userId}, "Distributors/distributors_add").subscribe((result => {
                            // if(this.dr_type==1)
                            // {
                            //     this.rout.navigate(['/distribution-detail/'+result['distributors_add']['last_id']]);
                            // }
                            if (this.dr_type == 1) {
                                this.rout.navigate(['/distribution-list']);
                            }
                            if (this.dr_type == 3) {
                                this.rout.navigate(['/dealer']);
                            }
                            if (this.dr_type == 7) {
                                this.rout.navigate(['/direct-dealer']);
                            }
                        }));
                        this.submit = false;
                    }

                }
            }
            else {
                this.DOBError = true;
                this.DOAError = true;
            }
        }


        else if (this.data.doa) {
            if (this.data.doa < this.myDate) {
                this.DOAError = false;
                this.data.brand = this.brand;
                this.data.company_name = this.searchMoviesCtrl.value;
                this.data.sales_executive = this.ass_user;
                // this.data.distributors = this.ass_dist;

                if (this.submit && !this.exist) {
                    this.data.doa = moment(this.data.doa).format('YYYY-MM-DD');
                    this.data.dob = moment(this.data.dob).format('YYYY-MM-DD');
                    this.serve.fetchData({ "data": this.data, 'type': this.dr_type }, "Distributors/distributors_add").subscribe((result => {
                        // if(this.dr_type==1)
                        // {
                        //     this.rout.navigate(['/distribution-detail/'+result['distributors_add']['last_id']]);
                        // }
                        if (this.dr_type == 1) {
                            this.rout.navigate(['/distribution-list']);
                        }
                        if (this.dr_type == 3) {
                            this.rout.navigate(['/dealer']);
                        }
                        if (this.dr_type == 7) {
                            this.rout.navigate(['/direct-dealer']);
                        }
                    }));
                    this.submit = false;
                }
            }
            else {

                this.DOAError = true;
            }
        }


        else if (this.data.dob) {
            if (this.data.dob < this.myDate) {
                this.DOBError = false;
                this.data.brand = this.brand;
                this.data.company_name = this.searchMoviesCtrl.value;
                this.data.sales_executive = this.ass_user;
                // this.data.distributors = this.ass_dist;

                if (this.submit && !this.exist) {
                    this.data.doa = moment(this.data.doa).format('YYYY-MM-DD');
                    this.data.dob = moment(this.data.dob).format('YYYY-MM-DD');
                    this.serve.fetchData({ "data": this.data, 'type': this.dr_type }, "Distributors/distributors_add").subscribe((result => {
                        // if(this.dr_type==1)
                        // {
                        //     this.rout.navigate(['/distribution-detail/'+result['distributors_add']['last_id']]);
                        // }
                        if (this.dr_type == 1) {
                            this.rout.navigate(['/distribution-list']);
                        }
                        if (this.dr_type == 3) {
                            this.rout.navigate(['/dealer']);
                        }
                        if (this.dr_type == 7) {
                            this.rout.navigate(['/direct-dealer']);
                        }
                    }));
                    this.submit = false;
                }
            }
            else {
                this.DOBError = true;

            }
        }

        else {
            this.data.brand = this.brand;
            this.data.company_name = this.searchMoviesCtrl.value;
            this.data.sales_executive = this.ass_user;
            // this.data.distributors = this.ass_dist;

            if (this.submit && !this.exist) {
                this.serve.fetchData({ "data": this.data, 'type': this.dr_type }, "Distributors/distributors_add").subscribe((result => {
                    // if(this.dr_type==1)
                    // {
                    //     this.rout.navigate(['/distribution-detail/'+result['distributors_add']['last_id']]);
                    // }
                    if (this.dr_type == 1) {
                        this.rout.navigate(['/distribution-list']);
                    }
                    if (this.dr_type == 3) {
                        this.rout.navigate(['/dealer']);
                    }
                    if (this.dr_type == 7) {
                        this.rout.navigate(['/direct-dealer']);
                    }
                }));
                this.submit = false;
            }
        }
    }


   

    MobileNumber(event: any) {
        const pattern = /[0-9\+\-\ ]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (event.keyCode != 8 && !pattern.test(inputChar)) { event.preventDefault(); }

    }

    check_number() {
        if (this.data.mobile.length == 10) {
            this.serve.fetchData({ "mobile": this.data.mobile }, "Distributors/check_dr").subscribe((result => {
                if (result['exists']) {
                    this.exist = true;
                }
                else {
                    this.exist = false;
                }
            }))
        }
    }

    salesUserLIst() {
        this.serve.fetchData({'access_level':2}, "User/sales_user_list").subscribe((result => {
            this.asmList = result['sales_user_list'];
            this.tmp_userList = this.asmList;
        }))
    }

    getItemsList(search) {
        this.asmList = [];
        console.log(this.asmList);
        for (var i = 0; i < this.tmp_userList.length; i++) {
            search = search.toLowerCase();
            this.tmpsearch = this.tmp_userList[i]['name'].toLowerCase();
            if (this.tmpsearch.includes(search)) {
                this.asmList.push(this.tmp_userList[i]);
            }
        }
    }

    assign_to_distributor(id, index, e) {
        if (e.checked) {
            this.assignUserId.push(id);
            this.assignUserList.push(this.asmList[index]);
        }
        else {
            var index_val = index;
            for (var j = 0; j < this.assignUserId.length; j++) {
                if (this.asmList[index].id == this.assignUserId[j]) {
                    this.assignUserId.splice(j, 1);
                    this.removeUser(j);
                }
            }
        }
    }

    removeUser(index) {
        this.assignUserList.splice(index, 1);
    }

    getCountryList() {
        this.serve.fetchData(0, "User/country_list").subscribe((response => {
            console.log(response);
            this.countryList = response['query']['country_name'];
        }));
    }

    getStateList() {
        this.serve.fetchData(0, "User/state_user_list").subscribe((response => {
            console.log(response);
            this.state_list = response['query']['state_name'];
            this.temp_state_list = response['query']['state_name'];

        }));
    }

    getDistrict() {
        this.serve.fetchData(this.data.state, "User/district_user_list").subscribe((response => {
            // console.log(response);
            this.district_list = response['query']['district_name'];
            this.temp_district_list = response['query']['district_name'];

        }));

        this.data.district='';
        this.data.city='';
        this.data.pincode='';
        this.data.cityArea='';

    }

    getCityList() {
        let value = { "state": this.data.state, "district": this.data.district }
        this.serve.fetchData(value, "User/city_user_list").subscribe((response => {
            console.log(response);
            this.city_list = response['query']['city'];
            this.tmp_city_list = response['query']['city'];

            

        }));

        this.serve.fetchData(value, "User/area_user_list").subscribe((response => {
            console.log(response);
            
            this.city_area_list = response['query']['area'];

        }));
    }

    

    getPinCodeList() {
        let value = { "state": this.data.state, "district": this.data.district, "city": this.data.city }
        this.serve.fetchData(value, "User/pincode_user_list").subscribe((response => {
            console.log(response);
            this.pinCode_list = response['query']['pincode'];
        }));
    }

    user_assign_check(value, index, event) {
        console.log(this.asmList);
        
        if (event.checked) {
            if (this.rsm.indexOf(this.asmList[index]['id']) === -1) {
                console.log("in check");
                this.rsm.push(value);
            }
        }
        else {
            for (var j = 0; j < this.asmList.length; j++) {
                if (this.asmList[index]['id'] == this.rsm[j]) {
                    this.rsm.splice(j, 1);
                }
            }
        }

        this.ass_user = this.rsm
    }

    getBrandList() {
        this.serve.fetchData(0, "/Product/product_brand_list/").subscribe((result) => {
            console.log(result);
            this.brand_list = result;
            // this.product_brand=this.brand_list;
        });
    }

    product_Brand(value, index, event) {
        if (event.checked) {
            this.brand.push(value);
        }
        else {
            for (var j = 0; j < this.brand_list.length; j++) {
                if (this.brand_list[index]['brand_name'] == this.brand[j]) {
                    this.brand.splice(j, 1);
                }
            }
        }
    }

    distributorList() {
        this.serve.fetchData('', "Distributors/distributorsList").subscribe((result => {

            this.drlist = result;

            this.tmp_drlist = this.drlist;
            console.log(this.drlist);
        }))
    }

    filter_state(state_name){
        console.log("filter_state method calls");
        console.log(state_name);
        console.log(this.temp_state_list);
        this.tmpsearch='';
        this.state_list = [];
        for (var i = 0; i < this.temp_state_list.length; i++) {
          state_name = state_name.toLowerCase();
          this.tmpsearch = this.temp_state_list[i].toLowerCase();
          if (this.tmpsearch.includes(state_name)) {
            this.state_list.push(this.temp_state_list[i]);
          }
        }
      }
      
      filter_district(district_name){
        console.log("filter_district method calls");
        console.log(district_name);
        console.log(this.temp_state_list);
        this.tmpsearch='';
        this.district_list = [];
        for (var i = 0; i < this.temp_district_list.length; i++) {
          district_name = district_name.toLowerCase();
          this.tmpsearch = this.temp_district_list[i].toLowerCase();
          if (this.tmpsearch.includes(district_name)) {
            this.district_list.push(this.temp_district_list[i]);
          }
        }
      }
      filter_city(city_name){
        console.log("filter_city method calls");
        console.log(city_name);
        console.log(this.tmp_city_list);
        this.tmpsearch='';
        this.city_list = [];
        for (var i = 0; i < this.tmp_city_list.length; i++) {
          city_name = city_name.toLowerCase();
          this.tmpsearch = this.tmp_city_list[i].toLowerCase();
          if (this.tmpsearch.includes(city_name)) {
            this.city_list.push(this.tmp_city_list[i]);
          }
        }
      }
    // getDistributorSearch(search) {
    //     this.drlist = [];
    //     for (var i = 0; i < this.tmp_drlist.length; i++) {
    //         search = search.toLowerCase();
    //         this.tmpsearchdr = this.tmp_drlist[i]['company_name'].toLowerCase();
    //         if (this.tmpsearchdr.includes(search)) {
    //             this.drlist.push(this.tmp_drlist[i]);
    //         }
    //     }

    //     for (let i = 0; i < this.ass_dist.length; i++) {
    //         let index = this.drlist.findIndex(row => row.id == this.ass_dist[i])
    //         if (index != -1) {
    //             this.drlist[index].check = true;
    //         }
    //     }
    // }


    
    // distributor_assign_check(value, index, event) {
    //     if (event.checked) {
    //         this.ass_dist.push(value);
    //     }
    //     else {
    //         for (var j = 0; j < this.drlist.length; j++) {
    //             if (this.drlist[index]['id'] == this.ass_dist[j]) {
    //                 this.ass_dist.splice(j, 1);
    //             }


    //         }
    //     }

    // }


}
