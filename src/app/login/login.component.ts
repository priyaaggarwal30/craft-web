import { Component, OnInit } from '@angular/core';
import { slideToRight } from '../router-animation/router-animation.component';
import { DatabaseService } from 'src/_services/DatabaseService';
import { Router, ActivatedRoute } from '@angular/router';
import { sessionStorage } from '../localstorage.service';
import { DialogComponent } from '../dialog.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  animations: [slideToRight()]
})
export class LoginComponent implements OnInit {
  
  data:any=[];
  peraluser:any={};
  st_user: any = {};
  nexturl:any;
  channel_partner:boolean = false;
  cp_otp:any;
  
  constructor(public serve:DatabaseService,public rout:Router,public session:sessionStorage,public dialog:DialogComponent,private route: ActivatedRoute, private router: Router) { }
  
  ngOnInit() {
  }
  
  login()
  {
    // this.session.setSession(this.data['username'],this.data['password']);
    
    let value={"username":this.data['username'],"password":this.data['password']}
    this.serve.fetchData(value,"login/submitnew").subscribe((data:any) => {
      console.log(data);
      
      if(data.data.type == '1'  && data.data.lead_type == 'Dr')
      {
        this.channel_partner = true;

        this.st_user = data;
        
        this.cp_otp =  Math.floor(100000 + Math.random() * 900000);
        
        let value={"mobile":this.st_user.data.mobile,"otp":this.cp_otp}
        
        this.serve.fetchData(value,"login/verify_otp").subscribe((data:any) => 
        {
          console.log(data);
          
        });
        
      }
      else
      {
        this.channel_partner = false;
        
        if(data['message']=='Success')
        {
          this.dialog.success("LogIn","Success");
          this.st_user = data;
          console.log(this.st_user);
          this.st_user.data.access_level = "1";
          this.st_user.st_log = true;
          localStorage.setItem('st_user',JSON.stringify(this.st_user) );
          
          
          if(this.st_user.data.view_dashboard == '1')
          {   
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
            this.router.navigate([this.nexturl]);
          }
          else if(this.st_user.data.view_leads == '1')
          {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/lead-list';
            this.router.navigate([this.nexturl]);
          }
          else if(this.st_user.data.view_lead_channel_partner == '1')
          {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/lead-list';
            this.router.navigate([this.nexturl]);
          }
          else if(this.st_user.data.view_lead_dealer == '1')
          {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/dealer-lead-list';
            this.router.navigate([this.nexturl]);
          }
          else if(this.st_user.data.view_distribution_n_w == '1')
          {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/distribution-list';
            this.router.navigate([this.nexturl]);
          }
          else if(this.st_user.data.view_dist_n_w_channel_partner == '1')
          {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/distribution-list';
            this.router.navigate([this.nexturl]);
          }
          else if(this.st_user.data.view_dist_n_w_direct_dealer == '1')
          {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/direct-dealer';
            this.router.navigate([this.nexturl]);
          }
          else if(this.st_user.data.view_dist_n_w_dealer == '1')
          {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/dealer';
            this.router.navigate([this.nexturl]);
          }
          else if(this.st_user.data.view_orders == '1')
          {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/order-list';
            this.router.navigate([this.nexturl]);
          }
          else if(this.st_user.data.view_orders_primary == '1')
          {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/order-list';
            this.router.navigate([this.nexturl]);
          }
          else if(this.st_user.data.view_orders_secondary == '1')
          {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/secondary-order-list';
            this.router.navigate([this.nexturl]);
          }
          else if(this.st_user.data.view_orders_direct == '1')
          {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/direct-order';
            this.router.navigate([this.nexturl]);
          }
          else if(this.st_user.data.view_attendence == '1')
          {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/attendance';
            this.router.navigate([this.nexturl]);
          }
          else if(this.st_user.data.view_check_in == '1')
          {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/checkin';
            this.router.navigate([this.nexturl]);
          }
          else if(this.st_user.data.view_qr_code == '1')
          {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/qr-code-list';
            this.router.navigate([this.nexturl]);
          }
          else if(this.st_user.data.view_plumbing_man == '1')
          {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/plumber-lead-list';
            this.router.navigate([this.nexturl]);
          }
          else if(this.st_user.data.view_consumer == '1')
          {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/consumer-lead-list';
            this.router.navigate([this.nexturl]);
          }
          else if(this.st_user.data.view_banner == '1')
          {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/banner-banner-list';
            this.router.navigate([this.nexturl]);
          }
          else if(this.st_user.data.view_leaves == '1')
          {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/leave-list';
            this.router.navigate([this.nexturl]);
          }
          else if(this.st_user.data.view_travel_plan == '1')
          {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/travel-list';
            this.router.navigate([this.nexturl]);
          }
          else if(this.st_user.data.view_redeem_request == '1')
          {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/redeem-request-list';
            this.router.navigate([this.nexturl]);
          }
          else if(this.st_user.data.view_products == '1')
          {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/product-list';
            this.router.navigate([this.nexturl]);
          }
          else if(this.st_user.data.view_users == '1')
          {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/sale-user-list';
            this.router.navigate([this.nexturl]);
          }
          else if(this.st_user.data.view_discount == '1')
          {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/discount-list';
            this.router.navigate([this.nexturl]);
          }
          else if(this.st_user.data.view_category_master == '1')
          {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/categorymaster';
            this.router.navigate([this.nexturl]);
          }
          else if(this.st_user.data.view_scheme_master == '1')
          {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/schememaster';
            this.router.navigate([this.nexturl]);
          }
          else if(this.st_user.data.view_report == '1')
          {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/dwr';
            this.router.navigate([this.nexturl]);
          }
          else if(this.st_user.data.view_user_location_report == '1')
          {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/live_track';
            this.router.navigate([this.nexturl]);
          }
          else if(this.st_user.data.view_daily_work_report == '1')
          {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/dwr';
            this.router.navigate([this.nexturl]);
          }
          else if(this.st_user.data.view_monthly_work_report == '1')
          {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/monthly-dwr';
            this.router.navigate([this.nexturl]);
          }
          else if(this.st_user.data.view_primary_target_report == '1')
          {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/target-report/1';
            this.router.navigate([this.nexturl]);
          }
          else if(this.st_user.data.view_c_p_sales_report == '1')
          {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/distriutor-sales-report';
            this.router.navigate([this.nexturl]);
          }
          else if(this.st_user.data.view_primary_secondary_report == '1')
          {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/primary-vs-secondary';
            this.router.navigate([this.nexturl]);
          }
          else if(this.st_user.data.view_product_category_report == '1')
          {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/product-wise-report';
            this.router.navigate([this.nexturl]);
          }
          else if(this.st_user.data.view_secondary_target_report == '1')
          {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/target-report/2';
            this.router.navigate([this.nexturl]);
          }
          else
          {
            this.router.navigate(['/distribution-detail/'+data['data'].id]);
          }
        }
        else
        {
          this.dialog.error("Incorrect UserName or Password");
        }
      }
      
    },error=>{
      console.log(error);
    });
  }
  
  
  submit_otp()
  {
    if(this.cp_otp == this.data.otp)
    {
      this.dialog.success("LogIn","Success");
      console.log(this.st_user);
      this.st_user.data.access_level = "2";
      this.st_user.st_log = true;
      localStorage.setItem('st_user',JSON.stringify(this.st_user));
      
      this.router.navigate(['/distribution-detail/'+this.st_user['data'].id]);
    }
    else
    {
      this.dialog.error("Incorrect Otp");
    }
  }
  
  
}
