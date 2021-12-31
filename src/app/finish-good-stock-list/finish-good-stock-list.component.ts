import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from '../dialog.component';
import { sessionStorage } from 'src/app/localstorage.service';
import { ThrowStmt } from '@angular/compiler';


@Component({
  selector: 'app-finish-good-stock-list',
  templateUrl: './finish-good-stock-list.component.html',
  styleUrls: ['./finish-good-stock-list.component.scss']
})
export class FinishGoodStockListComponent implements OnInit {
  production_data:any=[];
  data:any={};
  organizaton_data:any=[];
  state_data:any=[]
  exp_loader:any;

  constructor(public serve:DatabaseService, public session:sessionStorage,public dialog: DialogComponent,) { 
    this.get_production_data();
  }
  
  ngOnInit() {
    this.organization_list();
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

      this.serve.fetchData({'id':this.data.organization, },"Organization/assignstate").subscribe((result=>
        {
          console.log(result);
          this.state_data=result;
          console.log(this.state_data);
          if(this.state_data){

            this.data.state=this.state_data[0].state_name;
            this.get_production_data();
          }
          
        }))

    }
  
  get_production_data(){
    // this.data.date_created = moment(this.data.date_created).format('YYYY-MM-DD');
    console.log("raw_material_list method calls");

    this.serve.fetchData({'data' : this.data},"Organization/FG_list").subscribe((result=>{

      console.log(result);
      this.production_data=result;
    })
    )
    
  }
  
  delete_production_data(production_id){
    console.log("delete_production_data method calls");
    console.log("production_id ="+ production_id);
    
    
    this.dialog.delete('Production Data !').then((result) => {
      if (result) {
        this.serve.fetchData({'id':production_id,},"Organization/product_delete").subscribe((result=>{
          console.log(result);
          this.get_production_data();
          
        })
        )
      }
    });
    
  }
  exportAsXLSX(){
    this.exp_loader = true;
      this.serve.fetchData({'data':this.data},"Organization/FG_list_excel")
      .subscribe(resp=>{
        console.log(resp);
        if(resp['msg']=='Success'){

        this.exp_loader = false;
        document.location.href = 'http://phpstack-83335-2231038.cloudwaysapps.com/api/uploads/Finish_Good_Stock.csv';

        }
      })

  }

  
}
