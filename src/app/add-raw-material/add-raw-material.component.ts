import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { sessionStorage } from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';



@Component({
  selector: 'app-add-raw-material',
  templateUrl: './add-raw-material.component.html',
  styleUrls: ['./add-raw-material.component.scss']
})
export class AddRawMaterialComponent implements OnInit {
  loader:any;
  data:any={};
  raw_maerial:any=[];
  login_data:any=[];
  brand_data
  
  constructor(public serve:DatabaseService, public session:sessionStorage,public toast: ToastrManager ) {
    
    this.login_data = this.session.getSession();  
    this.login_data = this.login_data.value;
    this.login_data = this.login_data.data;
    console.log(this.login_data);
    
  }
  
  ngOnInit() {
    this.material();
    this.brand();
  }

  brand(){

    this.serve.fetchData({},"Organization/brandlist").subscribe((result=>{
      console.log(result);
      this.brand_data=result;
      console.log(this.brand_data);
      
      
    })
    )

  }
  
  submit(){
    this.serve.fetchData({'raw_material':this.data,'uid':this.login_data.id},"Organization/add_raw_material").subscribe((result=>{
      console.log(result);
      if(result==true)
      { 
        this.toast.successToastr('Raw Material Successfully Added')

        window.history.go(-1);        
      }

      else if(result=='No data Inserted'){

        this.toast.errorToastr("Item Code Already Exist");

      }
      
    }
    ))
    
  }
  
  material(){
    
    this.serve.fetchData({},"Organization/measurement_list").subscribe((result=>{
      console.log(result);
      this.raw_maerial=result;
    }
    ))
    
  }

  back()
  {
    window.history.go(-1)
  }
  
  
}
