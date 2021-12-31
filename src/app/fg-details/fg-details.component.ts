import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from 'src/_services/DatabaseService';

@Component({
  selector: 'app-fg-details',
  templateUrl: './fg-details.component.html',
  styleUrls: ['./fg-details.component.scss']
})
export class FGDETAILSComponent implements OnInit {

  data : any = {};
  FG_DETAIL : any = {};

  constructor(public serve: DatabaseService, public route: ActivatedRoute) {

    this.route.params.subscribe(params => {
      console.log(params);
      this.data.product_id = params.id;
      this.data.org_id = params.org_id;
      this.data.state = params.state;
     
      this.GET_FG_TRANSACTION_DETAILS();

    });
  }

  ngOnInit() {
  }


  GET_FG_TRANSACTION_DETAILS() {
    this.serve.fetchData(this.data, "Organization/FG_stock_details").subscribe((result => {
      console.log(result);
      this.FG_DETAIL = result['finish_good_stock'];
      console.log(this.FG_DETAIL);
    }))
  }

  back() {
    window.history.go(-1)
  }



}
