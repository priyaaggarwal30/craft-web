import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';

@Component({
  selector: 'app-stock-list',
  templateUrl: './stock-list.component.html',
  styleUrls: ['./stock-list.component.scss']
})
export class StockListComponent implements OnInit {
  skelton:any;
  loader:any;
  data_not_found:boolean=false;
  data:any={};
  stock_data:any=[]
  organizaton_data:any=[];
  exp_loader:any;
 
  constructor(public serve:DatabaseService) { 
  }

  ngOnInit() {
    
    this.organization_list()
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
          this.stock_list();
        }
        else if(this.organizaton_data.length==''||this.organizaton_data.length==null||this.organizaton_data.length==undefined){
          this.data_not_found=true

        }
        
      }))
      
    }

  stock_list(){

    this.serve.fetchData({'id':this.data.organization,'data':this.data},"Organization/raw_material_stock").subscribe((result=>
      {
        console.log(result);
        this.stock_data=result;
         if(this.stock_data.length==''||this.stock_data.length==null||this.stock_data.length==undefined){
          this.data_not_found=true
         }
      }))

  }

  exportAsXLSX(){
    this.exp_loader = true;
      this.serve.fetchData({'id':this.data.organization,'data':this.data},"Organization/raw_material_stock_excel")
      .subscribe(resp=>{
        console.log(resp);
        if(resp['msg']=='Success'){

        this.exp_loader = false;
        document.location.href = 'http://phpstack-83335-2231038.cloudwaysapps.com/api/uploads/Raw_Material_stock.csv';

        }
      })

  }

}
