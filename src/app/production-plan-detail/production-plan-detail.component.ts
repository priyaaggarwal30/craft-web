import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { param } from 'jquery';
import { DatabaseService } from 'src/_services/DatabaseService';

@Component({
  selector: 'app-production-plan-detail',
  templateUrl: './production-plan-detail.component.html',
  styleUrls: ['./production-plan-detail.component.scss']
})
export class ProductionPlanDetailComponent implements OnInit {
  productionPlanData : any = {};
  login_data : any = {};
  loader = false
  constructor(public route: ActivatedRoute, public serve: DatabaseService) {

    this.route.params.subscribe(params => {
      console.log(params);
      if (params['id'])
      this.GET_PRODUCTION_PLAN_DETAIL(params['id'])
    });

   }

  ngOnInit() {
  }

  GET_PRODUCTION_PLAN_DETAIL(id)
  {
    this.loader = true;
    this.serve.fetchData({ 'id': id }, "Organization/production_plan_details").subscribe((result => {
      console.log(result);
      this.loader = false
      this.productionPlanData = result['production_plan_product'];
    }))

  }

  back() {
    window.history.go(-1);
  }

}
