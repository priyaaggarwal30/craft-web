import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from '../dialog.component';
import { sessionStorage } from '../localstorage.service';

@Component({
  selector: 'app-add-production-plan',
  templateUrl: './add-production-plan.component.html',
  styleUrls: ['./add-production-plan.component.scss']
})
export class AddProductionPlanComponent implements OnInit {
  data:any={};
  organizaton_data:any=[];
  state_data:any=[]
  product_data:any=[]
  tmp_product_data:any=[];
  login_data : any = [];
  constructor(public serve: DatabaseService, private router: Router, public toast: ToastrManager, public dialog: DialogComponent, public session: sessionStorage) {
    this.session.getSession().subscribe(session_data => {
      console.log(session_data);
      this.login_data = session_data['data']
      console.log(this.login_data);
      console.log(this.login_data.id);
    });
  }
  
  loader = false;
  ngOnInit() {
    this.organization_list()
  }
  
  organization_list()
  {
    
    this.serve.fetchData({},"Organization/organization_list").subscribe((result=>
      {
        console.log(result);
        this.organizaton_data=result;
        
      }))
      
    }
    
    state_list(){
      
      this.serve.fetchData({'id':this.data.organization},"Organization/assignstate").subscribe((result=>
        {
          console.log(result);
          this.state_data=result;
          
        }))
        
      }
      
      finishGoodlist(){
        
        this.serve.fetchData({'state_name':this.data.state},"Organization/state_product").subscribe((result=>
          {
            console.log(result);
            this.product_data=result;
            this.tmp_product_data = result;
          }))
          
        }
        
        row_material = [];
        
        GET_MATERIAL_DESCRIPTION(id)
        {
          console.log("product_id=>"+id);
          this.serve.fetchData({ 'id': id, 'state': this.data.state, 'org_id': this.data.organization }, "Organization/product_material").subscribe((result => {
            console.log(result);
            this.row_material = result['data'];
          }))
          
        }
        
        product_plan = [];
        required_row_material = [];
        
        addtolist(){
          
          this.product_plan.push(JSON.parse(JSON.stringify(this.data)));
          
          for (let i = 0; i < this.row_material.length; i++) 
          {
            this.row_material[i]['required_qty'] = this.row_material[i]['qty'] * this.data.qty;
            
            let isMaterialExist = this.required_row_material.findIndex(row => row.raw_id == this.row_material[i]['raw_id'])
            
            if(isMaterialExist != -1)
            {
              this.required_row_material[isMaterialExist]['required_qty'] = this.required_row_material[isMaterialExist]['required_qty'] + this.row_material[i]['required_qty']
              if (this.row_material[i]['balance_stock'] < this.required_row_material[isMaterialExist]['required_qty'])
              {
                this.required_row_material[isMaterialExist]['stock_alert'] = 1;
              }
              else{
                this.required_row_material[isMaterialExist]['stock_alert'] = 0;
              }
            }
            else
            {
              this.required_row_material.push(this.row_material[i]);
              if (this.row_material[i]['balance_stock'] < this.required_row_material[this.required_row_material.length-1]['required_qty']) {
                this.required_row_material[this.required_row_material.length - 1]['stock_alert'] = 1;
              }
              else{
                this.required_row_material[this.required_row_material.length - 1]['stock_alert'] = 0;
              }
            }
            
          }
          
          this.data.qty = '';
          this.data.finish_good =undefined;
          this.data.size = '';
          
          console.log(this.required_row_material);
          
        }
        
        removeFG(index)
        {
          
          this.dialog.delete('Finish Good !').then((result) => {
            if (result) {
              let id = this.product_plan[index]['product_id'];
              
              this.serve.fetchData({ 'id': id, 'state': this.data.state, 'org_id': this.data.organization }, "Organization/product_material").subscribe((result => {
                console.log(result);
                
                let raw_material = result['data'];
                
                for (let i = 0; i < raw_material.length; i++)
                {
                  let isExist = this.required_row_material.findIndex(row=>row.raw_id == raw_material[i]['raw_id']);
                  
                  if(isExist != -1)
                  {
                    this.required_row_material[isExist]['required_qty'] = this.required_row_material[isExist]['required_qty'] - parseInt(raw_material[i]['qty']) * this.product_plan[index]['qty'];
                    
                    if (this.required_row_material[isExist]['balance_stock'] < this.required_row_material[isExist]['required_qty']) {
                      this.required_row_material[isExist]['stock_alert'] = 1;
                    }
                    else{
                      this.required_row_material[isExist]['stock_alert'] = 0;
                    }
                    
                    if (this.required_row_material[isExist]['required_qty']==0)
                    {
                      this.required_row_material.splice(isExist,1);
                    }
                  }
                }
                
                this.product_plan.splice(index,1);
                
              }))
              
            }
          });
          
        }
        
        SUBMIT_PRODUCTION_PLAN()
        {
          
          for (let i = 0; i < this.required_row_material.length; i++) {
            if (this.required_row_material[i]['stock_alert']==1){
              
              this.dialog.error("Current stock is not sufficient for the production of these Finish Goods.")
              return;
            }
          }
          
          this.loader = true;
          let data = {
            'org_id': this.data.organization,
            'state_name': this.data.state,
            'uid': this.login_data.id,
            'product_array': this.product_plan,
            'material_array': this.required_row_material
          }
          
          this.serve.fetchData(data, "Organization/add_Production_Plan").subscribe((result => {
            console.log(result);
            this.loader = false;
            
            if(result['msg']=='success')
            {
              this.toast.successToastr('Production Plan Successfully Added')
              window.history.go(-1);
            }
          }))
        }
        
        tmpsearch:any = {};
        
        filter_dr(search) {
          console.log("filter_dr method calls",search);
          console.log(this.tmp_product_data);
          this.product_data = [];
          for (var i = 0; i < this.tmp_product_data.length; i++) {
            search = search.toLowerCase();
            const filterSearchBrand = this.tmp_product_data[i]['brand'].toLowerCase(); ''
            const filterSearchCategory = this.tmp_product_data[i]['category'].toLowerCase();''
            const filterSearchproduct_slug = this.tmp_product_data[i]['product_slug'].toLowerCase(); ''
            if (filterSearchBrand.includes(search) || filterSearchCategory.includes(search) || filterSearchproduct_slug.includes(search)) {
              this.product_data.push(this.tmp_product_data[i]);
            }
          }
        }
        
      }
      