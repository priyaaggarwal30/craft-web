import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { sessionStorage } from 'src/app/localstorage.service';
import { DialogComponent } from '../dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators'


@Component({
  selector: 'app-add-product-master',
  templateUrl: './add-product-master.component.html',
  styleUrls: ['./add-product-master.component.scss']
})
export class AddProductMasterComponent implements OnInit {
  
  production_data:any={}
  unit_of_measurement_data: any=[];
  raw_material_data: any=[];
  temp_selected_raw_material_data:any={};
  selected_raw_material_data:any=[];
  loader: any;
  login_data:any={}
  id: any = '0';
  multiple_state:any=[];
  state_list:any=[];
  urls:any=[];
  selectedFile:any=[];
  formData:any=new FormData();
  category_data:any=[];
  brand_data:any=[];
  image_id:any={};
  image:any=[];
  
  
  constructor(public serve:DatabaseService, public session:sessionStorage,public dialog: DialogComponent,public route: ActivatedRoute,private router: Router) { 
    
    
    this.route.params.subscribe(params => {
      console.log(params);
      this.id = params.id;
      console.log(this.id);
      this.id != '0' ? this.get_production_detail_for_update():'';
      
    });
    
    
    this.get_unit_of_measurement();
    this.raw_material_list();
    this.session.getSession().subscribe(session_data=>{
      console.log(session_data);
      this.login_data = session_data['data']
      console.log(this.login_data);
      console.log(this.login_data.id);
    });  
    
    
  }
  
  ngOnInit() {
    this.state();
    this.category();
    this.brand();
  }


  state()
  {     
    this.serve.fetchData({},"Organization/state_list").subscribe((result=>
      {
        console.log(result);
        this.state_list=result;
        console.log(this.state_list);
        
      }))

  }

  
  
  get_unit_of_measurement(){
    
    console.log("get_unit_of_measurement method calls");
    
    this.serve.fetchData({},"Organization/measurement_list").subscribe((result=>{
      console.log(result);
      this.unit_of_measurement_data=result;
    }
    ))
    
  }
  
  tmp_raw_material_data:any =[];

  raw_material_list(){
    
    console.log("raw_material_list method calls");
    this.serve.fetchData({},"Organization/raw_material_list").subscribe((result=>{
      console.log(result);
      this.raw_material_data = result;
      this.tmp_raw_material_data = result;
    })
    )
    
  }
  
  add_raw_material_into_array(){
    console.log("add_raw_material_into_array method calls");
    console.log(this.temp_selected_raw_material_data);
    console.log(this.selected_raw_material_data);
    
    let index = this.selected_raw_material_data.findIndex(row => row.raw_id == this.temp_selected_raw_material_data.raw_id);
    console.log(index);

    if(index!= -1){

      this.selected_raw_material_data[index]['raw_material_qty'] = parseInt(this.selected_raw_material_data[index]['raw_material_qty']) + parseInt(this.temp_selected_raw_material_data['raw_material_qty'])

    }

    else{

      this.selected_raw_material_data.push(this.temp_selected_raw_material_data)

    }

    this.temp_selected_raw_material_data={}
    console.log(this.selected_raw_material_data);
 
    
  }
  
  delete_raw_material_data(index){
    
    console.log("delete_raw_material_data method calls");
    
    console.log("index = "+index);
    
    this.selected_raw_material_data.splice(index,1)
  }

  insertImage(event) {
    console.log(event);

    let files = event.target.files;
    console.log(files);
    if (files) {
      for (let file of files) {
        let reader = new FileReader();
        
        reader.onload = (e: any) => {
          console.log(e);
          
          this.urls.push(e.target.result);
          console.log(e);
          
        }
        reader.readAsDataURL(file);
      }
    }
    console.log(this.urls);

    for (var i = 0; i < event.target.files.length; i++) {
      this.selectedFile.push(event.target.files[i]);
    }
    console.log(this.selectedFile);

  }

 
  
  save_production_data(){
    
    console.log("save_production_data method calls");
    
    this.loader = true;
    this.serve.fetchData({'production_data':this.production_data , 'raw_material':this.selected_raw_material_data,'uid':this.login_data.id, 'product_id':this.id }, "Organization/add_product").subscribe((result => {
      this.loader = false;
      console.log(result);
      this.dialog.success("Product", this.id == 0 ? 'Inserted' : 'Updated');
      this.back();
      this.image_id = result;
      console.log(this.selectedFile);
      
            
            for(var i=0; i<this.selectedFile.length; i++)
            {
              console.log('tessssssssssssss');
              
              this.formData.append("image"+i,this.selectedFile[i],this.selectedFile[i].name);
            }
            this.formData.append('id',this.image_id);
            if(this.selectedFile && this.selectedFile.length > 0)
            {
              console.log("image......");
              
              this.loader = true;
              this.serve.upload_image(this.formData,"Organization/insert_image_product").subscribe((resp)=>
              {
                this.loader = false;
                console.log(resp);
                if(resp)
                {
                  this.dialog.success("addproduct","Sent");
                  this.router.navigate(['/product-master-list']);
                }
                else 
                {
                  this.dialog.success("addproduct","Sent");
                  this.router.navigate(['/product-master-list']);
                }
              });
            } 
        
    }))
    
    
  }

  delete_img(index: any) {
    this.urls.splice(index, 1)
    this.selectedFile=[];
  }
  
  get_production_detail_for_update(){
    
    console.log("get_production_detail_for_update method calls");
    this.serve.fetchData({'id':this.id},"Organization/product_details").subscribe((result=>{
      console.log(result);
      this.production_data=result;
      
      
      this.production_data = {
        'item_code' : result['item_code'],
        'qty' : result['qty'],
        'selected_brand' : result['brand'],
        'selected_category' : result['category'],
        'size' : result['size'],
        'unit_of_measurement' : result['unit_of_measurement'],
        'state':result['state'],
        'stock_alert':result['stock_alert'],
        'mrp':result['mrp']
        
      }
      if(this.id!=0){

        this.urls=result['images'];
        console.log(this.urls );
      }
      
       
      
      this.selected_raw_material_data = result['raw_material'].map(val => { return val})
      console.log(this.selected_raw_material_data);

      
    }
    ))
    
  }
  
  delete_raw_material_data_from_database(raw_material_id){
    console.log("delete_raw_material_data_from_database method calls");
    console.log("raw_material_id ="+ raw_material_id);
    
    this.dialog.delete('Raw Material Data !').then((result) => {
      if (result) {
        this.serve.fetchData({'id':raw_material_id},"Organization/product_delete_item").subscribe((result=>{
          
          console.log(result);
          this.get_production_detail_for_update();
          
        })
        )
      }
    });
    
  }
  
  add_raw_material_data_from_database(){

    // let index= this.selected_raw_material_data.findIndex()

    this.selected_raw_material_data.push(this.temp_selected_raw_material_data)
    console.log(this.selected_raw_material_data);
    
    
    // console.log("add_raw_material_data_from_database method calls");
    // this.temp_selected_raw_material_data.production_id = this.id;
    // this.temp_selected_raw_material_data.uid = this.login_data.id;
    // console.log(this.temp_selected_raw_material_data);
    
    // this.serve.fetchData(this.temp_selected_raw_material_data,"Organization/product_add_item").subscribe((result=>{
    //   console.log(result);
    //   result == true ? this.temp_selected_raw_material_data = {} : '';
    //   this.get_production_detail_for_update();
      
    // }
    // ))
  }

  back(){
    window.history.go(-1);
  }

  category(){

    this.serve.fetchData({},"Organization/categoryList").subscribe((result=>{
      console.log(result);
      this.category_data=result;
      console.log(this.category_data);
      
      
    })
    )

  }
  brand(){

    this.serve.fetchData({},"Organization/brandlist").subscribe((result=>{
      console.log(result);
      this.brand_data=result;
      console.log(this.brand_data);
      
      
    })
    )

  }

  tmpsearch: any = {};
  filter_dr(search) {
    console.log("filter_dr method calls", search);
    console.log(this.tmp_raw_material_data);
    this.raw_material_data = [];
    for (var i = 0; i < this.tmp_raw_material_data.length; i++) {
      search = search.toLowerCase();
      const filterSearchBrand = this.tmp_raw_material_data[i]['brand'].toLowerCase();
      const filterSearchCategory = this.tmp_raw_material_data[i]['category'].toLowerCase();
      const filterSearchproduct_slug = this.tmp_raw_material_data[i]['item_name'].toLowerCase();
      const unit_of_measurment = this.tmp_raw_material_data[i]['unit_of_measurment'].toLowerCase();
      if (unit_of_measurment.includes(search) || filterSearchBrand.includes(search) || filterSearchCategory.includes(search) || filterSearchproduct_slug.includes(search)) {
        this.raw_material_data.push(this.tmp_raw_material_data[i]);
      }
    }
  }
  
  
 
}
