import { Component, OnInit, Renderer2 } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService'
import { Router, ActivatedRoute } from '@angular/router';
import { DialogComponent } from '../dialog.component';
import {MatDialog} from '@angular/material';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepicker} from '@angular/material/datepicker';
import * as _moment from 'moment';
import * as moment from 'moment';
// import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
// import { Label } from 'ng2-charts';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
// import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label } from 'ng2-charts';
import { sessionStorage } from '../localstorage.service';
import { FormControl } from '@angular/forms';
import { Moment } from 'moment';

// import * as CanvasJS from './canvasjs.min';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  count:any={};
  orderdata:any=[];
  top_cards:any;
  latest_orders:any;
  latest_checkin:any;
  exec_Info:any;
  counter_Info:any;
  today_date:any;
  end_request:any=[];
  data:any={};
  data_not_found:boolean=false;
  loader:any;
  brandData:any=[];
  stateData:any=[];
  order_data:any=[];
  show_data:any=[];
  dataset:any=[];
  dataset1:any=[];
  dataset2:any=[];
  category_data:any=[];
  login_data:any={};
  exec_Info_month: any;
  today:any;
  sixMonthsAgo:any;
  brandsize:any=[];
  checkin:any=[];
  order:any=[]
  statewise:any=[]
  rawdata:any=[]
  
  public barChartLabels: Label = [];
  public barChartLabels1: Label = [];
  public barChartLegend = true;
  public barChartType: ChartType = 'bar'; 
  public barChartType1: ChartType = 'line'; 
  public barChartData: ChartDataSets[] = [];
  public barChartData1: ChartDataSets[] = [];
  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: { xAxes: [{
      ticks: {
        fontColor: '#2c2c2c', // X-Axis font color
        fontStyle: 'bold',    // X-Axis font style 
      },
    }], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };
  
  
  
  constructor(private router: Router,public route:ActivatedRoute,public serve:DatabaseService,public dialog: MatDialog ,private renderer: Renderer2,public session:sessionStorage) { 
    this.count_data();
    this.brand_list();
    this.state_list();
    this.category();
    this.latestCheckin();
    this.latestOrder();
    this.Statewiseproduction();
    this.rawMaterialData(); 
  }
  
  ngOnInit() {
    this.session.getSession()
    .subscribe(resp=>{
      console.log(resp);
      this.login_data = resp.data;
      if(this.login_data.type == '1' && this.login_data.lead_type == 'Dr' )
      {
        this.renderer.addClass(document.body, 'chanel-patner');
      }
      else
      {
        this.renderer.removeClass(document.body, 'chanel-patner');
      }
    })
    
    
  }
  
  
  
  date = new FormControl(moment());
  
  
  
  chosenYearHandler(normalizedYear: Moment) {
    console.log(this.date);
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
  }
  
  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);
    datepicker.close();
  }
  
  status:boolean = false;
  toggleDropdown() {
    this.status = !this.status;
    
    if(this.status) {
      this.renderer.addClass(event.target, 'active');
      this.renderer.removeClass(document.body, 'active');
    }
    else {
      this.renderer.removeClass(event.target, 'active');
      // this.renderer.removeClass(document.body, 'active');
    }
  }
  
  toggleHeader() {
    console.log(this.status);
    this.status = !this.status;
    if(!this.status) {
      this.renderer.addClass(document.body, 'nav-active');
    }
    else {
      this.renderer.removeClass(document.body, 'nav-active');
    }
  }
  
  status1:boolean = false;
  toggleNav() {
    this.status1 = !this.status1;
    if(this.status1) {
      this.renderer.addClass(document.body, 'active');
    }
    else {
      this.renderer.removeClass(document.body, 'active');
    }
  }
  
  count_data()
  {
    console.log('test');
    this.serve.fetchData({},"Dashboard/dashboard_count").subscribe((result=>{
      console.log(result);
      this.count=result;
      console.log(this.count);
      
    }))
  }
  
  tmp:any=[];
  user_list:any=[];
  
  
  
  
  brand_list(){
    this.serve.fetchData({},"Organization/brandlist").subscribe((result=>{
      console.log(result);
      this.brandData=result;
      this.data.brand= this.brandData[0]['brand_name'];
      this.data.brand_name=this.brandData[0]['brand_name']
      
      if(this.data.brand= this.brandData[0]['brand_name']){
        this.order_dashboard();
        
      }
      else if(this.data.brand_name=this.brandData[0]['brand_name']){
        this.sizedata();
        this.salesData()
        
      }
      
      
      
      
      
      
      
    }))
  }
  state_list(){
    this.serve.fetchData({},"Dashboard/statelist").subscribe((result=>{
      console.log(result);
      this.stateData=result['stateList'];
      this.data.state=this.stateData[6]['state_name'];
      this.data.state_name=this.stateData[6]['state_name']
      this.data.states_name=this.stateData[6]['state_name']
      if(this.data.state=this.stateData[6]['state_name']){
        
        this.order_dashboard();
      }
      else if(this.data.state_name=this.stateData[6]['state_name']){
        this.sizedata();
        this.salesData()
        
      }
      
      
      
    }))
  }
  
  category(){
    
    this.serve.fetchData({},"Organization/categoryList").subscribe((result=>{
      console.log(result);
      this.category_data=result;
      console.log(this.category_data);
      if(this.data.category=this.category_data[0]['category_name']){
        this.sizedata();
        this.salesData();
      }
      
    })
    )
    
  }
  
  
  sizedata(){
    this.serve.fetchData({'state':this.data.state_name,'category':this.data.category,'brand':this.data.brand_name},"Organization/GET_PRODUCT_SIZE").subscribe(result=>{
      console.log(result);
      this.brandsize= result['data'];
      this.data.size= this.brandsize[0]['size']
      
      this.salesData()
      
    })
  }
  
  
  linedata:any=[];
  linelabel:any=[];
  
  
  
  salesData(){
    
    this.serve.fetchData({'state':this.data.state_name,'brand':this.data.brand_name,'category':this.data.category,'size':this.data.size},"Dashboard/order_trend").subscribe(result=>{
      console.log(result);
      this.linedata=result['count'];      
      this.linelabel=result['date'];
      
      console.log(this.linedata);
      console.log(this.linelabel);
      
      this.barChartLabels1 = this.linelabel;
      this.barChartType1 = 'line';
      this.barChartLegend = true;
      this.barChartData1 = [{ data: this.linedata, label: 'Sale Order' },];
      
    })
    
  }
  
  
  order_dashboard( )
  {
    
    this.show_data=[];
    this.dataset=[];
    this.dataset1=[];
    this.dataset2=[];
    
    
    this.serve.fetchData({'state':this.data.state,'brand':this.data.brand},"Dashboard/pending_vs_stock").subscribe((result=>
      {
        console.log(result);
        this.orderdata=result['productinfo'];
        console.log(this.orderdata);
        for(let i=0;i<this.orderdata.length;i++)
        {
          
          this.show_data.push(this.orderdata[i].label);
          
          this.dataset.push(this.orderdata[i].pending_qty);
          this.dataset1.push(this.orderdata[i].current_stock)
          this.dataset2.push(this.orderdata[i].under_processing_stock)
          
          
        }
        
        
        console.log(this.show_data);
        console.log(this.dataset);
        console.log(this.dataset1);
        console.log(this.dataset2);
        
        this.barChartLabels = this.show_data;
        this.barChartType = 'bar';
        this.barChartLegend = true;
        this.barChartData = [{ data: this.dataset, label: 'Pending Order' },
        { data: this.dataset1, label: 'Current Stock', stack:'a' },
        { data: this.dataset2, label: 'Under Production' , stack:'a' }];
        
      }));
      
    }
    
    
    latestCheckin(){
      this.serve.fetchData({},"Dashboard/GET_LATEST_CHECKIN").subscribe(result=>{
        console.log(result);
        this.checkin=result['data']
        
        
      })
    }
    latestOrder(){
      this.serve.fetchData({},"Dashboard/GET_LATEST_ORDER").subscribe(result=>{
        console.log(result);
        this.order=result['data'];
        console.log(this.order);
        
        
        
      })
    }
    Statewiseproduction(){
      this.serve.fetchData({'state': this.data.states_name},"Dashboard/state_wise_production").subscribe(result=>{
        console.log(result);    
        this.statewise= result['stateList'];
         
      })
    }
    rawMaterialData(){
      
      this.serve.fetchData({},"Dashboard/GET_RAW_MATERIAL_SHORT_STOCK").subscribe(result=>{
        console.log(result);
        this.rawdata=result['data'];
       
        
      })
    }
    
    gotocustomerpage(){
      console.log("ssssssssss");
      
      this.router.navigate(['direct-dealer'])
    }
    
    gotoattendencepage(){
      this.router.navigate(['attendence'])
      
    }
    gotocheckinpage(){
      this.router.navigate(['checkin'])
    }
    gotovendorpage(){
      this.router.navigate(['vendor-list'])
      
    }
    gotoorderpage(){
      this.router.navigate(['order-list'])
      
    }
    gotoPurchaseorderpage(){
      this.router.navigate(['purchase-order-list'])
      
    }
  }
  
  