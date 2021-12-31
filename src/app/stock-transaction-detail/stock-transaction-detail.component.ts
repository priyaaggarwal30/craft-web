import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from 'src/_services/DatabaseService';

@Component({
  selector: 'app-stock-transaction-detail',
  templateUrl: './stock-transaction-detail.component.html',
  styleUrls: ['./stock-transaction-detail.component.scss']
})
export class StockTransactionDetailComponent implements OnInit {
  id:any=0;
  stock_detail:any={};

  constructor(public serve:DatabaseService,public route:ActivatedRoute) { 
    this.route.params.subscribe( params => {
      console.log(params);
      this.id = params.id;
      console.log(this.id);
     
      
    });
  }

  ngOnInit() {
    this.raw_material_stock()
    
  }

  raw_material_stock(){
    this.serve.fetchData({'id':this.id},"Organization/raw_material_stock_TXN").subscribe((result=>
      {
        console.log(result);
        this.stock_detail=result;
        console.log(this.stock_detail);
      }))
  }

  back(){
    window.history.go(-1)
  }



}
