import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from '../dialog.component';
import { sessionStorage } from 'src/app/localstorage.service';
import * as moment from 'moment';



@Component({
  selector: 'app-product-master-list',
  templateUrl: './product-master-list.component.html',
  styleUrls: ['./product-master-list.component.scss']
})
export class ProductMasterListComponent implements OnInit {
  
  production_data:any=[];
  data:any={};
  organizaton_data:any=[];
  state_data:any=[];
  loader = false;
  constructor(public serve:DatabaseService, public session:sessionStorage,public dialog: DialogComponent,) { 
    this.get_production_data();
  }
  
  ngOnInit() {
    // this.organization_list()
  }

  organization_list()
  {
    
    this.serve.fetchData({},"Organization/organization_list").subscribe((result=>
      {
        console.log(result);
        this.organizaton_data=result;
        if(this.organizaton_data){
          this.data.organization=this.organizaton_data[0].id;
          console.log(this.data.organization);
          this.state_list();
        
        }
        
      }))
      
    }

    state_list(){

      this.serve.fetchData({'id':this.data.organization},"Organization/assignstate").subscribe((result=>
        {
          console.log(result);
          this.state_data=result;
          console.log(this.state_data);
          if(this.state_data){

            this.data.state=this.state_data[0].state_name
            this.get_production_data()
          }
          
         
          
        }))

    }
  
  get_production_data(){
    this.loader = true;
    // this.data.date_created = moment(this.data.date_created).format('YYYY-MM-DD');
    console.log("raw_material_list method calls");
    this.serve.fetchData({'data':this.data},"Organization/product_list").subscribe((result=>{
      console.log(result);
      this.loader = false;
      this.production_data=result;
    })
    )
    
  }
  
  delete_production_data(production_id){
    console.log("delete_production_data method calls");
    console.log("production_id ="+ production_id);
    
    
    this.dialog.delete('Production Data !').then((result) => {
      if (result) {
        this.serve.fetchData({'id':production_id},"Organization/product_delete").subscribe((result=>{
          console.log(result);
          this.get_production_data();
          
        })
        )
      }
    });
    
    
    
  }
  
}
