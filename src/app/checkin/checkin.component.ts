import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService'
import { ActivatedRoute, Router } from '@angular/router';
import { DialogComponent } from '../dialog.component';
import * as moment from 'moment';
import { __values } from 'tslib';
import { DailyactivityComponent } from '../dailyactivity/dailyactivity.component';
import { MatDialog } from '@angular/material';
import { ImageModuleComponent } from '../image-module/image-module.component';
import { Location } from '@angular/common';



@Component({
  selector: 'app-checkin',
  templateUrl: './checkin.component.html',
  styleUrls: ['./checkin.component.scss']
})
export class CheckinComponent implements OnInit {
  start_attend_time: string;
  loader: any;
  data_not_found = false;
  data: any = {};
  checkins: any = [];
  show_today: boolean = true;
  count_1: any;
  count_2: any;
  skelton: any = {};
  today_date = new Date().toISOString().slice(0,10);
  filter_today_date=new Date();
  previous_date = new Date(this.filter_today_date);
  previous= new Date(this.previous_date.getFullYear(),this.previous_date.getMonth()-1,this.previous_date.getDate());
  searchData: any;
  backButton: boolean = false;
  start:any=0;
  count:any;
  total_page:any; 
  pagenumber:any;
  pagelimit: any = 50;
  tab:any;
  yesterday_date = new Date();
 

  constructor(public serve: DatabaseService, public navparams: ActivatedRoute,public location: Location, public route: Router, public dialog: DialogComponent,public dialog2: MatDialog) {
    
    console.log(this.navparams);
    console.log(this.navparams['params']['_value']['selectedUser']);
    this.searchData = (this.navparams['params']['_value']);
    console.log(this.searchData.selectedDate);
    console.log(this.today_date);
    this.tab=navparams['params']['_value']['tab'];
    console.log(this.tab);
    if(this.tab=='previous_month')
    {
      this.distributorList('get_all_checkin_new',2)

    }
    else if(this.tab=='yesterday')
    {
      this.distributorList('get_all_checkin_new',2);
    }
    else
    {
        this.distributorList('get_today_checkin_new',1);

    }
    
    
    console.log(this.searchData);
    if (this.searchData.selectedUser && this.searchData.selectedDate) {
      this.backButton = true;
      if(this.searchData.selectedDate == this.today_date){
        this.checkins = [];
        // this.data = {};
        this.data.user_name = this.searchData.selectedUser;
        this.distributorList('get_today_checkin_new',1);
      }
      else{
        this.checkins = [];
        this.data.user_name = this.searchData.selectedUser;
        this.data.date_created = this.searchData.selectedDate;
        this.distributorList('get_all_checkin_new',2);
      }
      console.log("in navparams");
      
    }
    
    
    
    
    
    console.log('gfvdb');
    this.skelton = new Array(10);
  }
  
  ngOnInit() {
    
  }
  
  distributorList(func_name,type,)
  {
    
    console.log(this.pagelimit);
    console.log(this.filter_today_date);
    console.log(this.previous);

    this.loader=1;
    console.log(Object.getOwnPropertyNames(this.data).length);
    
    if( Object.getOwnPropertyNames(this.data).length != 0)
    {
      console.log("yes");
      
      this.pagelimit = 0;
      this.checkins = [];
    }
  
    if(this.tab=='previous_month')
    {
      console.log("in previous block");
      
      this.data.date_to=this.filter_today_date;
      this.data.date_from=this.previous;
      // func_name='get_all_checkin_new';
      // type=2;

    }
    else if(this.tab=='yesterday')
    {
      console.log("in yesterday block");
      
      this.yesterday_date.setDate(this.yesterday_date.getDate() - 1);
      console.log( this.yesterday_date.toString());
      this.data.date_to=moment(this.yesterday_date).format('YYYY-MM-DD');
      this.data.date_from=moment(this.yesterday_date).format('YYYY-MM-DD');
    }
    else
    {
      
    
      console.log("in else block");
      // this.data.date_created=moment(this.data.date_created).format('YYYY-MM-DD');
      if(this.data.date_from)
      {
        this.data.date_from=moment(this.data.date_from).format('YYYY-MM-DD');
      }
      console.log(this.data.date_to);
      if(this.data.date_to)
      {
        this.data.date_to=moment(this.data.date_to).format('YYYY-MM-DD');
        console.log(this.data.date_to);
        
      }
    
    }
    
    this.serve.fetchData({'start':this.start,'pagelimit':this.pagelimit,'search':this.data},"Distributors/"+func_name)
    .subscribe(((result:any)=>{
      console.log(result);
      this.count=result['all_count'];
      this.total_page = Math.ceil(this.count/this.pagelimit);
      this.pagenumber = Math.ceil(this.start/this.pagelimit)+1;
      this.checkins = (result['result']);
      
      if(type == 1)
      {
        // this.count_1 = this.checkins.length;
        // this.count_2 = result.all_count;
        this.show_today = true;
      }
      else
      {
        // this.count_1 = result.all_count;
        // this.count_2 = this.checkins.length;
        this.show_today = false;
      }
      
      console.log(this.checkins);
      if(this.checkins.length ==0){
        this.data_not_found=true;
      } else {
        this.data_not_found=false;
      }
      setTimeout (() => {
        this.loader='';
        
      }, 100);
    }))
  }
  
  
  
  
  change_tab(fn_name, type) {
    this.checkins = [];
    this.data = {};
    this.distributorList(fn_name, type);
  }
  excel_data: any = [];
  exportAsXLSX(): void {
    for (let i = 0; i < this.checkins.length; i++) {
      this.excel_data.push({ 'Date': this.checkins[i].activity_date, 'Sales User': this.checkins[i].exec_name, Type: this.checkins[i].dr_type == 3 ? 'Dealer' : (this.checkins[i].dr_type == '' ? 'other' : 'Channel Partner'), 'Company Name': this.checkins[i].other_name == '' ? this.checkins[i].company_name : this.checkins[i].other_name, 'Check In': this.checkins[i].visit_start, 'Check Out': this.checkins[i].visit_end, 'Remark': this.checkins[i].description,'Order': this.checkins[i].isOrderExist,'Order Amount': this.checkins[i].order_total });
      
    }
    console.log(this.excel_data);
    this.serve.exportAsExcelFile(this.excel_data, 'Check IN  Sheet');
  }
  
  dailyModal(list)
  {
    
    const dialogRef = this.dialog2.open(DailyactivityComponent, {
      width: '768px',
      data:{
        list
      }});
      dialogRef.afterClosed().subscribe(result => {
        
      });
      
    }
    
    
    imageModel(start_meter_image)
    {
      const dialogRef = this.dialog2.open( ImageModuleComponent, {
        // width: '500px',
        data:{
          start_meter_image,
          // stop_meter_image,
        }});
        dialogRef.afterClosed().subscribe(result => {
          console.log(result);
          console.log('The dialog was closed');
          
        });
        
      }
      
      
      
      back(): void {
        console.log("location back method calss");
        console.log(this.location);
        this.location.back()
      }
      
      
      goTo( exec_name,company_name,activity_date,type ){
        console.log(exec_name);
        console.log(company_name);
        console.log(activity_date);
        console.log(type);
        
        if (type == 'primary_sale') {
          this.route.navigate(['/order-list', { 'selectedUser': exec_name,'selectedDate': activity_date,'company_name': company_name,'from':'checkin'}]);
        } 
        
        else if (type == 'secondary_sale') {
          this.route.navigate(['/secondary-order-list', { 'selectedUser': exec_name,'selectedDate': activity_date,'company_name': company_name,'from':'checkin'}]);
        } 
        
        else{
          
        }
        
        
        
      }
      
      refresh()
      {
        this.data={};
        this.distributorList('get_today_checkin_new',1);
        this.distributorList('get_all_checkin_new',2);

      }
    }
    