import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { sessionStorage } from 'src/app/localstorage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';


@Component({
  selector: 'app-add-purchase-order',
  templateUrl: './add-purchase-order.component.html',
  styleUrls: ['./add-purchase-order.component.scss']
})
export class AddPurchaseOrderComponent implements OnInit {
  order_detail:any={};
  item_detail:any={};
  vendor_data:any=[];
  organizaton_data:any=[];
  state_list:any=[];
  masurement_list:any=[];
  selected_state:any=[];
  multiple_state:any=[];
  item_list:any=[];
  amount:any=[];
  item_array:any=[];
  total:number=0;
  login_data:any=[];
  total_qty=0;
  total_amount=0;
  item_data:any={};
  id:any = 0
  tmp_product_List : any =[]
  pendingOrder: any = {};

  constructor(public serve: DatabaseService, public session: sessionStorage, private router: Router, public route: ActivatedRoute, public alert: ToastrManager) {
    
    this.login_data = this.session.getSession();  
    this.login_data = this.login_data.value;
    this.login_data = this.login_data.data;
    console.log(this.login_data);
    this.pendingOrder.total_pending_qty = 0;

    this.route.params.subscribe( params => {
      console.log(params);
      this.id = params.id;
      console.log(this.id);
    });
    if(this.id != 0){
      this.get_purchase_detail_for_update()
      
    }
    
  }
  
  ngOnInit() {
    this.vendor_list();
    this.organization_list();
    this.measurement_of_item()
  }
  
  vendor_list()
  {
    this.serve.fetchData({},"Organization/vendor_list").subscribe((result=>
      {
        console.log(result);
        this.vendor_data=result;
        console.log(this.vendor_data);
      }))
    }
    
    organization_list(){
      this.serve.fetchData({},"Organization/organization_list").subscribe((result=>
        {
          console.log(result);
          this.organizaton_data=result; 
        }))
      }
      
      assign_state()
      {
        console.log(this.multiple_state);
        this.selected_state=this.multiple_state['_pendingValue']
        console.log(this.selected_state);
      }
      
      state(id)
      {
        console.log(id);
        
        this.serve.fetchData({'id':id},"Organization/assignstate").subscribe((result=>
          {
            console.log(result);
            this.state_list=result;
            console.log(this.state_list);
            
          }))
        }
        
        vendor_dealing_item(id)
        {
          this.serve.fetchData({'id':id},"Organization/deal_item").subscribe((result=>
            {
              console.log(result);
              this.item_list=result;
              this.tmp_product_List = this.item_list;
              console.log(this.item_list);
              
            }))
          }
          measurement_of_item()
          {
            this.serve.fetchData({},"Organization/measurement_list").subscribe((result=>
              {
                console.log(result);
                this.masurement_list=result;
                console.log(this.masurement_list);
                
              }))
            }
            
            convert_int(val){
              console.log(val);
              
              return parseInt(val);
              this.total=val;
            }
            
            temp(tmp_item_data){
              
              console.log(tmp_item_data);
              this.item_data=tmp_item_data
              console.log(this.item_data);

              
            }
            
            get_po_pending_item(id)
            {
              this.pendingOrder = {};

              this.serve.fetchData({id:id}, "Organization/GET_PENDING_PO_ITEM").subscribe((result => {
                console.log(result);
                this.pendingOrder = result['data'];
              }))
            }
            
            calculate_amount()
            {
              console.log(this.item_array);
              this.pendingOrder.total_pending_qty = 0;
              
              let index= this.item_array.findIndex(row=>row.raw_id==this.item_data.raw_id && row.state==this.item_detail.state_name)           
              console.log(index);
              if(index!=-1)
              {
                this.item_array[index].qty=(this.item_array[index].qty+this.item_detail.qty)
                console.log(this.item_array[index].qty);
                this.item_array[index].amount=parseFloat(this.item_array[index].amount)+(this.item_detail.qty*this.item_detail.price);
                console.log(this.item_array[index].amount);
                
              }
              else
              {
                this.item_array.push({
                  raw_id:this.item_data.raw_id,
                  item_code:this.item_data.item_code,
                  item_name:this.item_data.item_name,
                  price:this.item_detail.price,
                  qty:this.item_detail.qty,
                  amount:this.item_detail.amount,
                  state:this.item_detail.state_name,
                  lead_time:this.item_data.lead_time,
                  brand:this.item_data.brand,
                  unit_of_measurement:this.item_data.unit_of_measurment
                })
                console.log(this.item_array);
                
              }
              
              this.total_qty=0;
              this.total_amount=0;
              
              for(let i=0;i<=this.item_array.length;i++)
              {
                this.total_qty= parseInt(this.item_array[i].qty)+(this.total_qty);
                this.total_amount=parseFloat(this.item_array[i].amount)+(this.total_amount)
                this.item_detail={};
              }
              console.log(this.item_array);
            }
            
            delete_item(index)
            {
              this.item_array.splice(index,1)
              this.total_qty=0;
              this.total_amount=0;
              
              for(let i=0;i<=this.item_array.length;i++)
              {
                this.total_qty= parseInt(this.item_array[i].qty)+(this.total_qty);
                this.total_amount=parseFloat(this.item_array[i].amount)+(this.total_amount)
                
              }
              
            }
            
            
            
            submit()
            {
              
              if (this.item_array.length==0)
              {
                this.alert.errorToastr("No, any item added for purchase order.");
                
                return;
              }
              
              console.log(this.item_data);
              this.serve.fetchData({'item_detail':this.item_array,'vendor_data':this.order_detail,'uid':this.login_data.id,'total_qty':this.total_qty,'total_amount':this.total_amount},"Organization/add_purchase_order").subscribe((result=>
                {
                  console.log(result);
                  window.history.go(-1)
                }))
                
              }
              
              back()
              {
                window.history.go(-1)
              }
              
              get_purchase_detail_for_update(){
                
                this.serve.fetchData({'id':this.id},"Organization/purchase_order_detail").subscribe((result=>
                  {
                    console.log(result);
                    this.order_detail=result;
                    console.log(this.order_detail);
                    
                    this.order_detail={
                      
                      'vendor':result['vendor_id'],
                      'organization':result['org_id'],
                      
                    }
                    this.item_array = result['order_item'].map(val => { return val})
                    console.log(this.item_array);
                    
                  }))
                  
                  
                }
                
                tmpsearch: any = {};
                filter_dr(search) {
                  console.log("filter_dr method calls", search);
                  console.log(this.tmp_product_List);
                  this.item_list = [];
                  for (var i = 0; i < this.tmp_product_List.length; i++) {
                    search = search.toLowerCase();
                    const filterSearchBrand = this.tmp_product_List[i]['brand'].toLowerCase(); ''
                    const filterSearchCategory = this.tmp_product_List[i]['category'].toLowerCase(); ''
                    const filterSearcStockType = this.tmp_product_List[i]['item_name'].toLowerCase(); ''
                    const unit_of_measurment = this.tmp_product_List[i]['unit_of_measurment'].toLowerCase(); ''
                    if (filterSearchBrand.includes(search) || unit_of_measurment.includes(search)|| filterSearchCategory.includes(search) || filterSearcStockType.includes(search)) {
                      this.item_list.push(this.tmp_product_List[i]);
                    }
                  }
                }
                
                
                
              }
              