import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from '../dialog.component';
// import { Router } from '@angular/router';
// import { DialogComponent } from '../dialog.component';
import * as moment from 'moment';



@Component({
  selector: 'app-editlead',
  templateUrl: './editlead.component.html'
})
export class EditleadComponent implements OnInit {
  
  state_list: any = [];
  district_list: any = [];
  city_list: any = [];
  pinCode_list: any = [];
  countryList: any = [];
  lead_data: any = {};
  lead_data2: any = {};
  cityAreaList: any = [];
  lead_type_id:any;
  today_date: any;
  length: any = {};
  temp_state_list=[];
  temp_district_list=[];
  tmp_city_list=[];
  tmpsearch: any = {};
  change_lead='Others';
  constructor(@Inject(MAT_DIALOG_DATA) public data, public serve: DatabaseService, public dialog2: MatDialog, public dialog: DialogComponent) {
    this.today_date = new Date();
    console.log(data);
    console.log(data['type']);
    if (data['type'] == 'basic_information') {
      this.lead_data = JSON.parse(JSON.stringify(data['value']));
      this.lead_data.change_lead = this.lead_data.type;
      console.log(this.lead_data);
      this.lead_type_id = this.lead_data.type
      console.log(this.lead_type_id);
      
    }
    else {
      this.getStateList();
      this.getDistrict(data.value.state, 1);
      this.getCityAreaList(data.value.district, data.value.state, 1);
      this.getPinCodeList(data.value.state, data.value.district, data.value.city, 1);
      this.lead_data2 = JSON.parse(JSON.stringify(data['value']));
      console.log(this.lead_data2);
      this.lead_data2.cityArea = this.data.value.area;
      console.log(this.lead_data2);
      
    }
    
    
    
  }
  
  
  
  ngOnInit() {
  }
  
  no_vaild: any = false;
  
  editPincode(pin) {
    console.log(pin);
    this.length = pin.length;
    console.log(this.length);
    this.lead_data2.state = '';
    this.lead_data2.district = '';
    this.lead_data2.city = '';
    // this.no_vaild= false;
    
    
    if (this.length == 6) {
      console.log("Test Funcation");
      this.serve.fetchData('', "Lead/getAddress/" + pin).subscribe((result => {
        console.log(result);
        if (this['status'] = 'Success') {
          this.lead_data2.state = result['data']['state_name'];
          this.lead_data2.district = result['data']['district_name'];
          this.lead_data2.city = result['data']['city'];
          console.log(this.lead_data2.state);
          console.log(this.lead_data2.district);
          console.log(this.lead_data2.city);
          this.getCityAreaList(this.lead_data2.district, this.lead_data2.state, 2);
        }
        
        else {
          this.no_vaild = true;
        }
        
        // this.dialog.success("Save","Success");
      }))
    }
  }
  
  
  
  update() {
    console.log(this.data.value);
  }
  
  
  
  
  update_address() {
    
    
    console.log(this.lead_data2);
    this.lead_data2.area = this.lead_data2.cityArea;
    this.lead_data2.cityArea = '';
    console.log(this.lead_data2);
    
    this.serve.fetchData(this.lead_data2, "Lead/updateAddress").subscribe((result => {
      console.log(result);
      this.dialog2.closeAll();
      this.dialog.success("Save", "Success");
    }))
    
    
  }
  
  
  update_detail(data) {
    console.log(data);
    
    let leadData = {
      'dr_id': data['id'],
      'company_name': data['company_name'],
      'change_lead': data['change_lead'],
      'contractor_type':data['contractor_type'],
      'name': data['name'],
      'mobile_no': data['mobile'],
      'email_id': data['email'],
      'source': data['source'],
      'status': data['status'],
      'gst_no': data['gst'],
      'stage': data['stage'],
      'whatsapp_no': data['whatsapp_no'],
      'type': data['type'],
      'date_of_birth': moment(data['date_of_birth']).format('YYYY-MM-DD'),
      'date_of_anniversary': moment(data['date_of_anniversary']).format('YYYY-MM-DD'),
      'description': data['description'],
      
    }
    
    console.log(leadData);
    this.serve.fetchData({ data: leadData }, "Lead/leadDetailUpdate").subscribe((result => {
      console.log(result);
      this.dialog2.closeAll();
      this.serve.count_list();
      this.dialog.success("Save", "Success");
    }))
  }
  
  // getCountryList()
  // {
  //   console.log("addUser");
  //   this.serve.fetchData(0,"User/country_list").subscribe((response=>{
  //     console.log(response);  
  //     this.countryList=response['query']['country_name'];
  //     console.log(this.countryList);
  //   }));
  
  // }
  // getStateList(country_name, src)
  // {
  //   console.log("addUser");
  //   this.serve.fetchData(0,"User/state_user_list").subscribe((response=>{
  //     console.log(response);  
  //     this.state_list=response['query']['state_name'];
  //     // this.state_list=this.state
  //     console.log(this.state_list);
  
  
  //   }));
  
  // }
  //   getDistrict(state_name, src)
  //   {
  //     console.log(state_name);
  
  //     if(src == 2) {
  //       this.data.district = '';
  //       this.data.city = '';
  //       this.data.pincode = '';
  //     }
  //     this.serve.fetchData(state_name,"User/district_user_list").subscribe((response=>{
  //       // console.log(response);
  //       this.district_list=response['query']['district_name'];
  //       console.log(this.district_list);
  
  //     }));
  
  //   }
  MobileNumber(event: any) {
    console.log(event);
    
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) { event.preventDefault(); }
  }
  
  //   getCityList(district,state, src)
  //   {
  //     console.log(district);
  //     console.log(state);
  
  //     if(src == 2) {
  //       this.data.city = '';
  //       this.data.pincode = '';
  //     }
  
  //     let value={"state":state,"district":district}
  //     this.serve.fetchData(value,"User/city_user_list").subscribe((response=>{
  //       console.log(response);
  //       this.city_list=response['query']['city'];
  //       console.log(this.city_list);
  
  //     }));
  //   }
  
  getPinCodeList(state, district, city, src) {
    
    if (src == 2) {
      this.data.pincode = '';
    }
    
    console.log(district, state, city);
    let value = { "state": state, "district": district, "city": city }
    this.serve.fetchData(value, "User/pincode_user_list").subscribe((response => {
      console.log(response);
      this.pinCode_list = response['query']['pincode'];
      console.log(this.pinCode_list);
      
    }));
  }
  
  
  getStateList() {
    this.serve.fetchData(0, "User/state_user_list").subscribe((response => {
      console.log(response);
      this.state_list = response['query']['state_name'];
      this.temp_state_list = response['query']['state_name'];

      // this.state_list=this.state
      
    }));
    
  }
  
  
  getDistrict(state_name, src) {
    
    if (src == 2) {
      this.lead_data2.district = '';
      this.lead_data2.cityArea = '';
      this.lead_data2.city='';
      this.lead_data2.pincode='';
      console.log(this.lead_data2);
      
    }
    console.log(this.lead_data2);
    
    
    this.serve.fetchData(state_name, "User/district_user_list").subscribe((response => {
      console.log(response);
      this.district_list = response['query']['district_name'];
      this.temp_district_list = response['query']['district_name'];

      
    }));
  }
  
  getCityAreaList(district, state, src) {
    if (src == 2) {
      this.lead_data2.cityArea = '';
      this.lead_data2.city='';
      this.lead_data2.pincode='';
      
      
      
    }
    let value = { "state": state, "district": district }
    
    
    this.serve.fetchData(value, "User/city_user_list").subscribe((response => {
      console.log(response);
      this.city_list = response['query']['city'];
      this.tmp_city_list = response['query']['city'];

      
      
    }));
    
    this.serve.fetchData(value, "User/area_user_list").subscribe((response => {
      console.log(response);
      this.cityAreaList = response['query']['area'];
    }));
    
    
    
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
}
