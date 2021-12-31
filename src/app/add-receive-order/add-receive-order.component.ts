import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { sessionStorage } from 'src/app/localstorage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogComponent } from '../dialog.component';
import { ToastrManager } from 'ng6-toastr-notifications';


@Component({
  selector: 'app-add-receive-order',
  templateUrl: './add-receive-order.component.html',
  styleUrls: ['./add-receive-order.component.scss']
})
export class AddReceiveOrderComponent implements OnInit {
  loader:any;
  data:any={};
  urls:any=[];
  selectedFile:any=[];
  item_list:any=[];
  vendor_data:any=[];
  invoice_item=[];
  login_data:any=[];
  vendor_id:{};
  item_data:any={};
  item_name:any={}
  order_id:any=[];
  receive_data:any=[];
  formData=new FormData();
  today_date: Date;
  receiving_detail=[];
  
  
  constructor(public serve:DatabaseService,public session:sessionStorage,private router: Router,public route:ActivatedRoute,public dialog:DialogComponent,public toast: ToastrManager) { 
    this.today_date = new Date();
    this.login_data = this.session.getSession();  
    this.login_data = this.login_data.value;
    this.login_data = this.login_data.data;
    console.log(this.login_data);
    
    console.log(this.route);
    console.log(this.route.queryParams);
    this.order_id=this.route.queryParams['_value']
    console.log(this.order_id);
    
    this.route.params.subscribe( params => {
      console.log(params);
      
    });
  }
  
  ngOnInit() {
    this.vendor_list();
    this.receive_detail()
  }
  insertImage(data)
  {
    let files = data.target.files;
    if (files) 
    {
      for (let file of files) 
      {
        let reader = new FileReader();
        reader.onload = (e: any) => 
        {
          this.urls.push(e.target.result);
        }
        reader.readAsDataURL(file);
      }
    }
    
    for(var i=0; i<data.target.files.length; i++)
    {
      this.selectedFile.push(data.target.files[i]);
    }
  }
  delete_img(index:any)
  {
    this.urls.splice(index,1)
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
    
    vendor_dealing_item(id)
    {
      
      this.serve.fetchData({'id':id},"Organization/deal_item").subscribe((result=>
        {
          this.vendor_id=id;
          console.log(result);
          this.item_list=result;
          console.log(this.item_list);
          
        }))
      }
      
      temp(item_name)
      {
        console.log(item_name);
        this.item_name=item_name
        console.log(this.item_name);
        
        
      }
      
      
      temp_qty(index_of_receive_data:any=0){
        console.log(index_of_receive_data);
        console.log(this.receive_data['order_item'][index_of_receive_data]);
        
        if(parseInt(this.receive_data['order_item'][index_of_receive_data].receive_qty)> parseInt(this.receive_data['order_item'][index_of_receive_data].pending_qty)){
          console.log("in if");
          this.receive_data['order_item'][index_of_receive_data].receive_qty=this.receive_data['order_item'][index_of_receive_data].pending_qty;
          console.log(this.receive_data['order_item'][index_of_receive_data]);
        }
        
        else{
          console.log("in else");
        }
        
      }
      
      id:any=[]
      
      save()
      {
        if(this.urls.length==''){
          this.toast.errorToastr("Please Upload Image");
        }
        else{

          this.invoice_item = [];
          console.log(this.receive_data);

          let count = 0;
          
          for(let index = 0; index <this.receive_data['order_item'].length;index++){

            if( this.receive_data['order_item'][index]['receive_qty'] && this.receive_data['order_item'][index]['receive_qty']!= '' && this.receive_data['order_item'][index]['receive_qty'] != '0')
            {
              console.log(this.receive_data['order_item'][index]);
              this.receive_data['order_item'][index]['pending_qty'] = this.conInt(this.receive_data['order_item'][index]['pending_qty']) - this.conInt(this.receive_data['order_item'][index]['receive_qty']) 
              this.receive_data['order_item'][index]['total_received_qty'] = this.conInt(this.receive_data['order_item'][index]['received_qty']) + this.conInt(this.receive_data['order_item'][index]['receive_qty']) 
              this.invoice_item.push(this.receive_data['order_item'][index])
            }
            else{
              console.log(this.receive_data['order_item'][index]);

              count++;
            }
            
          }

          
          if (count == this.receive_data['order_item'].length)
          {
            this.dialog.error("Please enter  atleast 1 Product receive Quantity...");

            return;
          }
          else{
            console.log(this.receive_data['order_item'].length);

            console.log("count=>" + count);
            
            
          }
          
          console.log(this.invoice_item);  
          this.receive_data['order_item']
          
          
          this.serve.fetchData({'created_by':this.login_data.id,'porder_id':this.order_id.id,'vendor_id':this.receive_data.vendor_id,'invoice_date':this.data.invoice_date,'invoice_no':this.data.invoice_no,'invoice_amount':this.data.invoice_amount,'item_array':this.invoice_item},"Organization/add_recieved_order").subscribe((result=>
            {
              console.log(result);
              
              this.id = result;
              
              for(var i=0; i<this.selectedFile.length; i++)
              {
                this.formData.append("image"+i,this.selectedFile[i],this.selectedFile[i].name);
              }
              this.formData.append('id',this.id);
              if(this.selectedFile && this.selectedFile.length > 0)
              {
                this.loader = true;
                this.serve.upload_image(this.formData,"Organization/insert_image").subscribe((resp)=>
                {
                  console.log(resp);
                  
                  setTimeout(() => {
                    this.loader = false;
                    
                    window.history.go(-1)

                  }, 2000);

                });
              } 
              
              
            }))
  
        }

          
        }
        
        receive_detail(){
          
          this.serve.fetchData({'id':this.order_id.id},"Organization/purchase_order_detail").subscribe((result=>
            {           
              console.log(result);
              this.receive_data=result;
              console.log(this.receive_data);
              this.receiving_detail=result['order_item'];
              console.log(this.receiving_detail);
              
            }))
            
          }
          
          view_receive_list(){
            this.router.navigate(['/receive-order-list'],{ queryParams:{'id' : this.order_id.id}});
            
          }
          
          delete_receive_order(index){
            this.invoice_item.splice(index,1)
            
          }
          
          conInt(value : any = ''){
            console.log('value = '+value);
            return parseInt(value);
            
          }
          
        }
        