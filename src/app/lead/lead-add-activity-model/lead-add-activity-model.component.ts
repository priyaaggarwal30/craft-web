import { Component, Inject, OnInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { DialogComponent } from 'src/app/dialog.component';

@Component({
  selector: 'app-lead-add-activity-model',
  templateUrl: './lead-add-activity-model.component.html'
})

export class LeadAddActivityModelComponent implements OnInit {

  tmpsearch: any = {};
  activity: any = {};
  userCheck: any = [];
  dr_id: any;
  company_name: any = {};
  asmList: any = [];
  today_date: any = [];
  loader: any;
  userData:any;
  userId:any;
  userName:any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public serve: DatabaseService,
    public rout: Router,
    public dialog: DialogComponent,
    public dialog2: MatDialog


  ) {
    console.log(data);
    console.log(data['type']);
    this.activity.leadType = data['type'];
    this.activity.dr_id = data['id'];
    this.activity.company_name = data['company_name'];
    console.log(this.activity.company_name);
    console.log(this.activity.dr_id);
    this.activity.user_id;
    this.salesUserLIst();
    this.data.user_id;

    this.today_date = new Date().toISOString().slice(0, 10);
    console.log(this.today_date);
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    console.log(this.userData);
    this.userId=this.userData['data']['id'];
    this.userName=this.userData['data']['name'];


  }

  ngOnInit() {
  }

  submitActivity() {
    console.log("submit befor api hitfunction");
    this.loader =true;

    // this.userCheck = true;
    if (!this.activity.user_id && this.activity.isFollowup) {
      this.userCheck = true;
      return
    }
    console.log(this.activity);
    this.activity.followUp_date = moment(this.activity.followUp_date).format('MM/DD/YYYY');
    console.log(this.activity.followUp_date);
    this.userCheck = false;
    this.activity.uid = this.userId;
    this.activity.userName = this.userName;

    this.serve.fetchData({ 'data': this.activity }, "Lead/addActivity/").subscribe((result => {
      console.log(result);
      if (result['status'] == 'Success') {
        console.log('in success function');
        this.dialog2.closeAll();
        this.dialog2.closeAll();
       
        setTimeout(() => {
          this.loader = false;
        }, 700);
      }
      else {
        console.log('in failed function');
        console.log(result['error']['message']);
        this.dialog.error(result['error']['message']);
      }
    }))

  }

  user_assign_check(index) {
    this.userCheck = false;

    this.activity.user_id = [];

    console.log(index);
    this.activity.user_id = this.asmList[index]['id'];
    console.log(this.activity.user_id);
    console.log(this.activity.user_id.length);
  }

  user_id: any = [];

  salesUserLIst() {
    this.serve.fetchData(0, "User/sales_user_list").subscribe((result => {
      console.log(result);
      this.asmList = result['sales_user_list'];
      console.log(this.user_id);
    }))

  }
}