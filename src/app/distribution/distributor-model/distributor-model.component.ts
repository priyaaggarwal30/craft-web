import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { DatabaseService } from 'src/_services/DatabaseService';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DialogComponent } from 'src/app/dialog.component';

@Component({
  selector: 'app-distributor-model',
  templateUrl: './distributor-model.component.html',
  styleUrls: ['./distributor-model.component.scss']
})
export class DistributorModelComponent implements OnInit {
  
  
  
  empData: any = [];
  contact_arr: any = {

  };
  data2: any = {
    designation : '',
  };
  googleData:string;
  lat=0.00000;
  long=0.00000;
  latlong:any=[];
  dbID:any;
  userData:any;
    userId:any;
  
  showErr: boolean = false;
  today_date: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public serve: DatabaseService,
    public rout: Router,
    public dialog2: MatDialog,
    public alert : DialogComponent,
    private dialogRef: MatDialogRef<DistributorModelComponent>,
    public Toastr: ToastrManager) {
      console.log(data);
      this.today_date = new Date();
      console.log(this.today_date);
      
      
      if (data.type == 'addDbContact' || data.type == 'addLeadContact') {
        this.data2.name = '';
        this.data2.mobile = '';
        this.data2.whatsapp_no = '';
        this.data2.email = '';
        this.data2.dob = '';
        this.data2.doa = '';
        this.data2.designation = '';
      }
      
      if (data.type == 'updateDBSecContact') {
        if (data.updateData.doa == '0000-00-00') {
          data.updateData.doa = '';
        }
        if (data.updateData.dob == '0000-00-00') {
          data.updateData.dob = '';
        }
      }
      
      if(data.type == 'updateGoogleLocation'){
        console.log(data);
        this.dbID=data.id;
        this.googleData=data.address+', '+data.city+', '+data.district+', '+data.state+', '+data.country+', '+data.pincode;
        console.log(this.googleData);
        
      }
      this.userData = JSON.parse(localStorage.getItem('st_user'));
      console.log(this.userData);
      this.userId=this.userData['data']['id'];
      
    }
    
    ngOnInit() { }
    
    
    
    
    addSecContact() {
      
      
      const requestData = {
        dr_id: this.data.id,
        contact_arr: this.empData,
        uid:this.userId
      };
      
      console.log(requestData);
      if(this.data.type == 'addDbContact'){
        this.serve.fetchData(requestData, "Distributors/distributors_contact_add").subscribe((result => {
          this.dialog2.closeAll();
        }))
      }
      else if(this.data.type == 'addLeadContact'){
        console.log(requestData);
        console.log("in lead update"); 
        this.serve.fetchData(requestData, "Distributors/distributors_contact_add").subscribe((result => {
          this.dialog2.closeAll();
        }))
      }
    }
    
    add_data() {
      this.showErr = false;
      
      console.log(this.data);
      if ((this.data2.doa) && (this.data2.dob)) {
        console.log(this.data2.dob + "<" + this.data2.doa);
        if ((this.data2.dob) < (this.data2.doa)) {
          if (this.data2.doa > this.today_date) {
            this.Toastr.errorToastr("DOA should be less than today's Date");
          }
          else if (this.data2.dob > this.today_date) {
            this.Toastr.errorToastr("DOB should be less than today's Date");
          }
          else {
            this.data2.doa = moment(this.data2.doa).format('YYYY-MM-DD');
            this.data2.dob = moment(this.data2.dob).format('YYYY-MM-DD');
            this.empData.push({
              contact_person: this.data2.name,
              mobile_no: this.data2.mobile,
              whatsapp_no: this.data2.whatsapp_no,
              email: this.data2.email,
              designation:this.data2.designation,
              dob: this.data2.dob,
              doa: this.data2.doa,
            });
            console.log(this.empData);
            this.data2.name = undefined;
            this.data2.mobile = undefined;
            this.data2.whatsapp_no = '';
            this.data2.email = '';
            this.data2.designation = '';
            this.data2.dob = '';
            this.data2.doa = '';
            console.log(this.empData.length);
          }
        }
        else {
          this.Toastr.errorToastr("DOA should be less than DOB");
        }
        
        
        
        
      }
      else if (this.data2.doa) {
        if (this.data2.doa > this.today_date) {
          this.Toastr.errorToastr("DOA should be less than today's Date");
        }
        else {
          this.data2.doa = moment(this.data2.doa).format('YYYY-MM-DD');
          this.data2.dob = moment(this.data2.dob).format('YYYY-MM-DD');
          this.empData.push({
            contact_person: this.data2.name,
            mobile_no: this.data2.mobile,
            whatsapp_no: this.data2.whatsapp_no,
            email: this.data2.email,
            designation:this.data2.designation,
            dob: this.data2.dob,
            doa: this.data2.doa,
          });
          console.log(this.empData);
          this.data2.name = undefined;
          this.data2.mobile = undefined;
          this.data2.whatsapp_no = '';
          this.data2.email = '';
          this.data2.designation = '';
          this.data2.dob = '';
          this.data2.doa = '';
          console.log(this.empData.length);
          
        }
      }
      
      else if (this.data2.dob) {
        if (this.data2.dob > this.today_date) {
          this.Toastr.errorToastr("DOB should be less than today's Date");
        }
        else {
          this.data2.doa = moment(this.data2.doa).format('YYYY-MM-DD');
          this.data2.dob = moment(this.data2.dob).format('YYYY-MM-DD');
          this.empData.push({
            contact_person: this.data2.name,
            mobile_no: this.data2.mobile,
            whatsapp_no: this.data2.whatsapp_no,
            designation:this.data2.designation,
            email: this.data2.email,
            dob: this.data2.dob,
            doa: this.data2.doa,
          });
          console.log(this.empData);
          this.data2.name = undefined;
          this.data2.mobile = undefined;
          this.data2.whatsapp_no = '';
          this.data2.email = '';
          this.data2.designation ='';
          this.data2.dob = '';
          this.data2.doa = '';
          console.log(this.empData.length);
          
        }
      }
      else {
        this.data2.doa = moment(this.data2.doa).format('YYYY-MM-DD');
        this.data2.dob = moment(this.data2.dob).format('YYYY-MM-DD');
        this.empData.push({
          contact_person: this.data2.name,
          mobile_no: this.data2.mobile,
          whatsapp_no: this.data2.whatsapp_no,
          email: this.data2.email,
          designation:this.data2.designation,
          dob: this.data2.dob,
          doa: this.data2.doa,
        });
        console.log(this.empData);
        this.data2.name = undefined;
        this.data2.mobile = undefined;
        this.data2.whatsapp_no = '';
        this.data2.email = '';
        this.data2.designation = '';
        this.data2.dob = '';
        this.data2.doa = '';
        console.log(this.empData.length);
      }
    }
    
    
    deleteContactDetail(arrayIndex) {
      
      if (this.empData.length < 2) {
        this.showErr = true;
      }
      
      console.log(arrayIndex);
      this.empData.splice(arrayIndex, 1);
      console.log(this.empData);
    }
    
    
    updateContactDetail() {
      // console.log(this.data.updateData);
      
      this.data.updateData.doa = moment(this.data.updateData.doa).format('YYYY-MM-DD');
      this.data.updateData.dob = moment(this.data.updateData.dob).format('YYYY-MM-DD');
      this.serve.fetchData(this.data.updateData, "Distributors/distributors_contact_update").subscribe((result => {
        if(result['distributors_contact_update'] == 'success'){
          this.dialog2.closeAll();
        }
        else{
          this.alert.error("Something went Wrong")
        }
      }))
    }
    
    getlocation:any=[];
    getLatLong(){
      console.log(this.googleData);
      
      this.serve.fetchData({address:this.googleData}, "Distributors/getlocation").subscribe((result => {
        console.log(result);
        this.getlocation=result['getlocation'];
        this.lat=this.getlocation.lat;
        this.long=this.getlocation.lng;
      }))
      
    }
    
    
    updategoogleLocation(){
      
      
      this.serve.fetchData({id:this.dbID,lat:this.lat,lng:this.long}, "Distributors/update_location").subscribe((result => {
        console.log(result);
        this.dialogRef.close();
      }))
      
      //  this.latlong.lat=this.lat;
      //  this.latlong.long=this.long;
      //  console.log(this.latlong);
      //  this.dialogRef.close(this.latlong); // this line is just for testing purpose [not use in real project]
    }
    
  }
  
  
  
  
  
  
  
  