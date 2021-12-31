import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { Router, ActivatedRoute } from '@angular/router';
import { DatabaseService } from 'src/_services/DatabaseService'
import { DialogComponent } from 'src/app/dialog.component';

@Component({
  selector: 'app-add-discount',
  templateUrl: './add-discount.component.html',
  animations: [slideToTop()]
})
export class AddDiscountComponent implements OnInit {

  detail:any={};
  discount_id;

  constructor(
              public rout:Router,
              public serve:DatabaseService,
              public route:ActivatedRoute,
              public dialog:DialogComponent) 
  {
    
    this.route.params.subscribe( params => 
    {
      this.discount_id = params.id;
      console.log(this.discount_id);
      
      });

      if(this.discount_id != 0)
      {
        this.getDiscountData(this.discount_id)
      }
      // this.discountDetail(this.discount_id);
    // this.addDiscount();
   }

  ngOnInit() 
  {
    // this.detail=this.serve.get_data()
    // console.log(this.detail);  

  }

  MobileNumber(event: any) 
  {
    console.log(event);
    
    const pattern = /[0-9\+\-\.\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) 
    {event.preventDefault(); }
   }

   getDiscountData(id)
   {
      this.serve.fetchData({'id':id},"Discount/discount_data").subscribe((result=>
      {
          console.log(result);
          this.detail=result['discount_detail'];
      }))
   }

    submitDiscount()
    {
      this.serve.fetchData(this.detail,"Discount/add_update_discount").subscribe((result=>
      {
            console.log(result)
            if(result)
            {
              this.dialog.success("Discount","Success");
              this.rout.navigate(['/discount-list'])
            }
      }))
    }



  // discountDetail(id)
  // {
  //   console.log(id);
  //   let value={"id":id}
  //   this.serve.fetchData(value,"Discount/discount_detail").subscribe((result=>{
  //     console.log(result);
  //     this.detail=result['discount_detail'];
  //     // this.serve.setdiscountdata(result);
  //     // this.rout.navigate(['/add-discount/'+id]);
      
  //   }))
    
  // }

  // addDiscount()
  // {
  //   let value={"detail":this.detail,"id":this.detail['id']}
  //   this.serve.fetchData(value,"Discount/update_discount_detail").subscribe((result=>{
  //     console.log(result)
  //     if(result){
  //       this.rout.navigate(['/discount-list'])
  //     }
      
  //   }))
    
  // }

}
