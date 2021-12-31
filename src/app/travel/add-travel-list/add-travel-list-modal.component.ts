import {  Component,  Inject,  OnInit} from '@angular/core';
import {  MatDialog,  MAT_DIALOG_DATA} from '@angular/material';
import {  FormControl } from '@angular/forms';
import {  DialogComponent} from 'src/app/dialog.component';
import {  DatabaseService} from 'src/_services/DatabaseService';
import {  sessionStorage} from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import * as moment from 'moment';



const now = new Date();

@Component({
  selector: 'add-travel-list-modal',
  templateUrl: './add-travel-list-modal.component.html',

})
export class addTravelListModal implements OnInit {


  travel_type_data: any = [];
  data1: any = {};
  loader: any;
  today_date: any;
  lists: any;
  max: any;
  result: any = [];
  logIN_user: any;
  showSave: boolean = true;
  state_list: any = [];
  district_list: any = [];
  city_list: any = [];
  drlist: any = [];
  salesUserList: any = [];
  searchText;
  search: any = {};
  city_list2: any = [];
  tmpsearch: any = {};
  salesUserList2: any=[];
  state_list2:any=[];
  district_list2:any=[];
  drlist2:any=[];
  today:Date;
  selectedArea: any;



  constructor(public serve: DatabaseService, @Inject(MAT_DIALOG_DATA) public data, public Toastr: ToastrManager, public session: sessionStorage, public dialog: MatDialog, public dialog1: DialogComponent) {

    this.today_date = new Date().toISOString().slice(0, 10);
    console.log(this.today_date);
    this.logIN_user = JSON.parse(localStorage.getItem('st_user'));
    // this.data1.select_provision="testProvision";
    this.lists = new FormControl();
    this.get_sales_user_list();
    console.log(this.lists);
    this.today=new Date();


  }

  ngOnInit() {
    this.data1.date_to = '';
    this.data1.date_from = '';



  }


  get_sales_user_list() {

    this.serve.fetchData({ 'access_level': 2 }, "User/sales_user_list").subscribe((result => {
      this.salesUserList = result['sales_user_list'];
      this.salesUserList2 = this.salesUserList;
      console.log(this.salesUserList);
    }))
    this.data1.travel_type = '';
    this.data1.distributor = '';
    this.data1.status_remark = '';
    this.data1.state = '';
    this.data1.district = '';
    console.log(this.lists);
    this.selectedArea='';
   
    console.log("list in get sales user" + this.lists);
  }

  get_sales_user_List(search) {
    this.tmpsearch='';
    this.salesUserList = [];
    for (var i = 0; i < this.salesUserList2.length; i++) {
      search = search.toLowerCase();
      this.tmpsearch = this.salesUserList2[i]['name'].toLowerCase();
      if (this.tmpsearch.includes(search)) {
        this.salesUserList.push(this.salesUserList2[i]);
      }
    }
  }
  // get_types() {
  //   this.serve.fetchData({'travel_type': this.data1.travel_type}, "API").subscribe((result => {
  //     console.log(result);
  //     this.travel_type_data = result;
  //     console.log(this.travel_type_data);
  //   }))
  // }


  distributorList() {
    this.serve.fetchData('', "Distributors/distributorsList").subscribe((result => {
      this.drlist = result;
      this.drlist2=this.drlist;
      console.log(this.drlist);
    }))
    this.search.sales_user='';
  }

  searchDistributor(search) {
    this.tmpsearch='';
    this.drlist = [];
    for (var i = 0; i < this.drlist2.length; i++) {
      search = search.toLowerCase();
      this.tmpsearch = this.drlist2[i]['company_name'].toLowerCase();
      if (this.tmpsearch.includes(search)) {
        this.drlist.push(this.drlist2[i]);
      }
    }
    this.search.sales_user='';
  }


  datavar: any = [];

  add_travel_plan() {
    // this.data1.id = this.data.id
    console.log(this.data1);
    this.data1.created_by = this.logIN_user.data.id;
    // console.log(this.data1.uid);
    this.data1.date_from = moment(this.data1.date_from).format('YYYY-MM-DD');
    this.data1.date_to = moment(this.data1.date_to).format('YYYY-MM-DD');
    console.log(this.data1);

    if (this.data1.travel_type == 'Area Visit') {
      console.log(this.lists);
      this.data1.date_created = this.today_date;
      this.data1.travel_list = this.lists['value'];

      for (let index = 0; index < this.lists['value'].length; index++) {

        this.datavar.push(this.lists['value'][index].area);
        console.log(this.datavar);
      }

      console.log(this.datavar);

      this.data1.area = this.datavar;
    }
    // this.data1.area = this.lists['value'].area;
    // this.data1.id='';
    console.log(this.data1);


    // -------------

    this.serve.fetchData(this.data1, "Travel/add_travelPlan").subscribe((result => {
      console.log(result);
      if ((result['msg']) == "exist") {
        this.Toastr.errorToastr("Travel Plan already exist to selected date");
      }
      else{
        console.log("close dialog box");
        
        this.dialog.closeAll();
      }
      setTimeout(() => {
        this.loader = '';
      }, 100);
    }))
  }



  tmp() {
    console.log(this.lists);
    console.log(this.lists['value']);
    this.selectedArea = this.lists['value'];
  }

  getStateList() {
    this.serve.fetchData(0, "User/state_user_list").subscribe((response => {
      console.log(response);
      this.state_list = response['query']['state_name'];
      this.state_list2=this.state_list;
    }));

    this.data1.distributor = '';
    this.data1.status_remark = '';
    this.data1.state = '';
    this.data1.district = '';
    this.lists['value']='';
    this.selectedArea='';
    this.search.sales_user='';
    // this.lists['_pendingValue']='';
    // this.lists='';
    console.log("list in get state");
    console.log(this.lists);
    this.get_sales_user_List('');
  }

  searchStateList(search) {
    this.tmpsearch='';
    this.state_list = [];
    for (var i = 0; i < this.state_list2.length; i++) {
      search = search.toLowerCase();
      this.tmpsearch = this.state_list2[i].toLowerCase();
      if (this.tmpsearch.includes(search)) {
        this.state_list.push(this.state_list2[i]);
      }
    }
    this.search.sales_user='';
  }

  getDistrict() {
    this.serve.fetchData(this.data1.state, "User/district_user_list").subscribe((response => {
      this.district_list = response['query']['district_name'];
      this.district_list2=this.district_list;
    }));

    this.data1.distributor = '';
    this.data1.status_remark = '';
    this.data1.district = '';
    console.log("list in get district");
    console.log(this.lists);
    this.lists['value']='';
    this.search.state_search='';
    this.searchStateList('');

    // this.lists['_pendingValue']='';
    // this.lists='';
  }
  searchDistrict(search) {
    this.tmpsearch='';
    this.district_list = [];
    for (var i = 0; i < this.district_list2.length; i++) {
      search = search.toLowerCase();
      this.tmpsearch = this.district_list2[i].toLowerCase();
      if (this.tmpsearch.includes(search)) {
        this.district_list.push(this.district_list2[i]);
      }
    }
    
  }


  getCityList() {
    let value = { "state": this.data1.state, "district": this.data1.district }
    this.serve.fetchData(value, "User/area_user_list").subscribe((response => {
      console.log(response);
      this.city_list = response['query']['area'];
      this.city_list2 = this.city_list;
      console.log(this.city_list);

    }));
    console.log("list in get city list");
    console.log(this.lists);
    this.lists['value']='';
    this.search.district_search='';

    
    // this.lists['_pendingValue']='';
    // this.lists='';
    this.search.district_search='';
    this.searchDistrict('');

  }



  // ----------------------  
  rsm: any = [];

  area_assign_check(value, index, event) {
    console.log(value);
    console.log(index);
    console.log(event);


    if (event.checked) {
      this.rsm.push(value);
    }
    else {
      for (var j = 0; j < this.city_list.length; j++) {
        if (this.city_list[index] == this.rsm[j]) {
          this.rsm.splice(j, 1);
        }
      }
    }
    this.selectedArea = this.rsm
  }


  getAreaList(search) {
    this.city_list = [];
    for (var i = 0; i < this.city_list2.length; i++) {
      search = search.toLowerCase();
      this.tmpsearch = this.city_list2[i].toLowerCase();
      if (this.tmpsearch.includes(search)) {
        this.city_list.push(this.city_list2[i]);
      }
    }
  }


}
