import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from 'src/_services/DatabaseService';
import { MatDialog } from '@angular/material';
import { sessionStorage } from '../localstorage.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
})
export class NavigationComponent implements OnInit {
  count:any=[];
  distactive: boolean=false;
  ordersactive: boolean=false;
  masteractive: boolean=false;
  reportactive: boolean=false;
  leadactive: boolean=false;
  targetactive:boolean=false;
  stockactive:boolean=false;
  login_data:any={};
  constructor(public route:ActivatedRoute,public serve:DatabaseService,public dialog: MatDialog ,private renderer: Renderer2,public session:sessionStorage) { 
    this.login_data = this.session.getSession();
    this.login_data = this.login_data.value;
    this.login_data = this.login_data.data;
    console.log(this.login_data);
    this.serve.count_list();
    console.log(this.serve.counterArray);
    
    
  }
  ngOnInit() {
    this.count_data();
    
  }
  
  status:boolean = false;
  
  toggleDropdown(value) 
  {
    console.log(value);
    if(value==1)
    {
      
      if(this.distactive==false){
        this.distactive=true;
        this.ordersactive=false;
        this.leadactive=false;
        this.masteractive=false;
        this.reportactive=false;
      }else{
        this.distactive=false;
        this.ordersactive=false;
        this.leadactive=false;
        this.reportactive=false;
        
      }
      
      // this.renderer.removeClass(event.target, 'active');
      // this.renderer.removeClass(document.body, 'active');
    }
    else if(value==4)
    {
      
      if(this.leadactive==false){
        this.leadactive=true;
        this.ordersactive=false;
        this.distactive=false;
        this.masteractive=false;
        this.reportactive=false;
        
      }else{
        this.leadactive=false;
        this.ordersactive=false;
        this.distactive=false;
        this.masteractive=false;
        this.reportactive=false;

      }
      
      // this.renderer.removeClass(event.target, 'active');
      // this.renderer.removeClass(document.body, 'active');
    }
    else if(value==2)
    {
      if(this.ordersactive==false){
        this.distactive=false;
        this.ordersactive=true;
        this.leadactive=false;
        this.masteractive=false;
        this.reportactive=false;

      }else{
        this.leadactive=false;
        this.ordersactive=false;
        this.distactive=false;
        this.masteractive=false;
        this.reportactive=false;

      }
      // this.renderer.removeClass(event.target, 'active');
      // this.renderer.removeClass(document.body, 'active');
    }
    else if(value==3)
    {
      if(this.masteractive==false){
        this.distactive=false;
        this.ordersactive=false;
        this.leadactive=false;
        this.masteractive=true;
        this.reportactive=false;
        this.stockactive=false

      }else{
        this.leadactive=false;
        this.ordersactive=false;
        this.distactive=false;
        this.masteractive=false;
        this.reportactive=false;
        this.stockactive=false;

      }
      // this.renderer.removeClass(event.target, 'active');
      // this.renderer.removeClass(document.body, 'active');
    }
    else if(value==5)
    {
      if(this.reportactive==false){
        this.reportactive=true;
        this.distactive=false;
        this.ordersactive=false;
        this.leadactive=false;
        this.masteractive=false;

      }else{
        this.reportactive=false;
        this.leadactive=false;
        this.ordersactive=false;
        this.distactive=false;
        this.masteractive=false;

      }
      // this.renderer.removeClass(event.target, 'active');
      // this.renderer.removeClass(document.body, 'active');
    }
    else if(value==6)
    {
      if(this.stockactive==false){  
        this.stockactive=true;
        this.reportactive=false;
        this.distactive=false;
        this.ordersactive=false;
        this.leadactive=false;
        this.masteractive=false;

      }else{
        this.stockactive=false
        this.reportactive=false;
        this.leadactive=false;
        this.ordersactive=false;
        this.distactive=false;
        this.masteractive=false;

      }
      // this.renderer.removeClass(event.target, 'active');
      // this.renderer.removeClass(document.body, 'active');
    }
    else{
      this.distactive=false;
      this.ordersactive=false;
      this.masteractive=false;
      this.leadactive=false;
      this.reportactive=false;
      this.targetactive=false;
      this.stockactive=false;
      
    }
    // this.status = !this.status;
    
    // if(this.status) {
    //   this.renderer.addClass(event.target, 'active');
    //   this.renderer.removeClass(document.body, 'active');
    // }
    // else {
    //   this.renderer.removeClass(event.target, 'active');
    //   // this.renderer.removeClass(document.body, 'active');
    // }
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
  count_data(){
    console.log('test');
    this.serve.fetchData({},"Attendance/count_data").subscribe((result=>{
      console.log(result);
      this.count=result;
    }))
  }
  
  
}
