import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { DatabaseService } from 'src/_services/DatabaseService';
import { _localeFactory } from '@angular/core/src/application_module';
import { Router } from '@angular/router';
import { DialogComponent } from 'src/app/dialog.component';
import * as moment from 'moment';


@Component({
  selector: 'app-add-lead',
  templateUrl: './add-lead.component.html',
  animations: [slideToTop()]

})
export class AddLeadComponent implements OnInit {

  tmp_list: any = [];
  data: any = {};
  contact_person: any = {};
  state_list: any = [];
  temp_state_list=[];
  city_area_list:any=[];
  tmp_city_list=[];
  countryList: any = [];
  district_list: any = [];
  temp_district_list=[];
  city_list: any = [];
  pinCode_list: any = [];
  mobileNoCheck: any = false;
  gstCheck: any = false;
  type:'';
  company_name='';
  name='';
  mobile='';
  source='';
  status='';
  category='';
  state='';
  district='';
  cityArea='';
  pincode='';
  city='';
  today_date: any;
  type_list:any=[];
  search1:any={};
  empdata:any=[];
  data1:any={};
  district_name:any;
  state_name:any;
  city_name:any;
  userData:any;
  userId:any;
  
  constructor(public serve: DatabaseService, public rout: Router, public dialog: DialogComponent) {
    
    this.today_date = new Date();
    
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    console.log(this.userData);
    this.userId=this.userData['data']['id'];
    // this.getStateList();
    this.salesUserLIst();
    // this.getCountryList();
    this.data.assignUser = [];
    this.getStateList();
    this. get_type_list();
  }

  ngOnInit() {
  }


  pinCheck: any = [];
  userCheck: any = [];
  id: any = [];
  loader: boolean;

  //submit function
  submitDetail() {
    console.log("in submit function");
    console.log(this.data);
    // console.log(this.data.secondary_no.length);
    // return;
    this.id = this.data.dr_type;
    console.log(this.id);
    // this.loader = true;
    console.log(this.data.assignUser);
    // if(this.data.assignUser.length==0){
    //   this.userCheck = true;
    //   console.log('in 0  function');  
    //   return
    // }


    this.data.date_of_anniversary = moment(this.data.date_of_anniversary).format('YYYY-MM-DD');
    this.data.date_of_birth = moment(this.data.date_of_birth).format('YYYY-MM-DD');

    // if (this.data.assignUser.length == !0) {
    if (true) {

      this.serve.fetchData({ 'data': this.data,'con':this.empdata,'uid':this.userId }, "Lead/addNewLead").subscribe((result => {
        console.log(result);

        if (result['status'] == 'Success') {
          console.log('in if codition');

          //timeout function
          setTimeout(() => {
            this.loader = false;

          }, 700);

          //success dialog box
          this.dialog.success_att("DataSave", "Success");
          this.userCheck = false;

          //routing
          this.rout.navigate(['/lead-list/' + this.id]);
        }

        else {
          console.log('in else condtion');
          console.log(result['error']['message']);
          this.dialog.error(result['error']['message']);
        }
      }))
    }
    else {
      this.userCheck = true;
    }
  }


  //user assing function
  user_assign_check(index) {
    this.userCheck = false;
    this.data.assignUser = [];

    console.log(index);
    this.data.assignUser.push({ id: this.asmList[index]['id'], name: this.asmList[index]['name'] });
    console.log(this.data.assignUser);
    console.log(this.data.assignUser.length);
  }

  active: any = {};

  toggleterritory(key, action) {
    console.log(action);
    console.log(key);

    if (action == 'open') { this.active[key] = true; }
    if (action == 'close') { this.active[key] = false; }

    console.log(this.active);
    this.salesUserLIst();
    // key = '';
  }
  MobileNumber(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) { event.preventDefault(); }
  }
  search: any = {};
  tmpsearch: any = {};
  getItemsList(search) {
    console.log(search);

    this.asmList = [];
    for (var i = 0; i < this.tmp_userList.length; i++) {
      search = search.toLowerCase();
      this.tmpsearch = this.tmp_userList[i]['name'].toLowerCase();
      if (this.tmpsearch.includes(search)) {
        this.asmList.push(this.tmp_userList[i]);
      }
    }
    console.log(this.asmList);

  }

  leng: any = [];
  get_type_list(){
   
    
      this.serve.fetchData('',"Lead/lead_type_list")
      .subscribe(resp=>{
        console.log(resp);
        this.type_list=resp['lead_type'];
        console.log(this.type_list);
      })
    }
  getStateCountry(pin) {
    console.log(pin);
    this.leng = pin.length;
    console.log(this.leng);
    this.data.state = '';
    this.data.district = '';
    this.data.city = '';
    this.pinCheck = false;
    if (this.leng == 6) {
      this.serve.fetchData('', "Lead/getAddress/" + pin).subscribe((result => {
        console.log(result);
        console.log(result['status']);

        if (result['status'] == 'Success') {
          this.data.state = result['data']['state_name'];
          this.data.district = result['data']['district_name'];
          this.data.city = result['data']['city'];
          this.getCityList();
        }
        else {
          console.log('in else condtion');
          this.pinCheck = true;
        }
      }))
    }

    
  }
  deleteContactDetail(arrayIndex) {
      
    console.log(arrayIndex);
    this.empdata.splice(arrayIndex, 1);
    console.log(this.empdata);
  }


  //get country,city and state through pincode function 
  // getStateCountry(pin) {
  //   console.log(pin);
  //   this.leng = pin.length;
  //   console.log(this.leng);
  //   this.data.state = '';
  //   this.data.district = '';
  //   this.data.city = '';
  //   this.pinCheck = false;
  //   if (this.leng == 6) {
  //     this.serve.fetchData('', "Lead/getAddress/" + pin).subscribe((result => {
  //       console.log(result);
  //       console.log(result['status']);

  //       if (result['status'] == 'Success') {
  //         this.data.state = result['data']['state_name'];
  //         this.data.district = result['data']['district_name'];
  //         this.data.city = result['data']['city'];
  //       }
  //       else {
  //         console.log('in else condtion');
  //         this.pinCheck = true;
  //       }
  //     }))
  //   }
  // }


  check_gst(gstLength) {
    console.log(gstLength);
    this.gstCheck = true;
    if (gstLength.length == 16 || gstLength.length == 0) {
      this.gstCheck = false;
    }
  }



  checkSecondaryMobile(secondaryMobileNo) {
    console.log(secondaryMobileNo);
    this.mobileNoCheck = true;
    if (secondaryMobileNo.length == 10 || secondaryMobileNo.length == 0) {
      this.mobileNoCheck = false;
    }
  }


  tmp_userList: any = [];

  asmList: any = [];
  assignUserList: any = [];
  assignUser: any = [];
  
add_data()
{
  this.empdata.push({
    contact_person: this.search1.contact_name,
    mobile_no: this.search1.contact_mobile,
    whatsapp_no: this.search1.whatsapp_no,
    email: this.search1.contact_email,
    designation:this.search1.designation,
  });
  console.log(this.empdata);
  this.search1.contact_name='';
  this.search1.contact_mobile='';
  this.search1.contact_email='';
  this.search1.designation='';
  this.search1.whatsapp_no='';

}
  salesUserLIst() {
    this.serve.fetchData(0, "User/sales_user_list").subscribe((result => {
      console.log(result);
      this.asmList = result['sales_user_list'];
      this.tmp_userList = this.asmList;
      console.log(this.assignUserList[0]);


      for (let i = 0; i < this.asmList.length; i++) {

        for (let j = 0; j < this.assignUserList.length; j++) {
          if (this.asmList[i].id == this.assignUserList[j]) {
            this.asmList[i].check = true;
            this.assignUser.push(this.asmList[i]);
            console.log(this.asmList[i].check);

          }
        }

      }
      console.log(this.assignUser);
    }))

  }

  removeContact(index) {
    this.tmp_list.splice(index, 1);
  }
  rsm: any = [];
  ass_user: any = [];

  getStateList() {
    this.serve.fetchData(0, "User/state_user_list").subscribe((response => {
        console.log(response);
        this.state_list = response['query']['state_name'];
        this.temp_state_list= response['query']['state_name'];
        console.log( this.temp_state_list);
        
    }));
}

  getDistrict() {
    this.serve.fetchData(this.data.state, "User/district_user_list").subscribe((response => {
        // console.log(response);
        this.district_list = response['query']['district_name'];
        this.temp_district_list = response['query']['district_name'];

    }));
}

getPinCodeList() {
  let value = { "state": this.data.state, "district": this.data.district, "city": this.data.city }
  this.serve.fetchData(value, "User/pincode_user_list").subscribe((response => {
      console.log(response);
      this.pinCode_list = response['query']['pincode'];
  }));
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

test(){
  console.log("data.dr_type = "+this.data.dr_type);
}
}
