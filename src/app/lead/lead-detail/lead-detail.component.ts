import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from 'src/_services/DatabaseService'; 
import { MatDialog } from '@angular/material';
import { EditleadComponent } from 'src/app/editlead/editlead.component';
import { DialogComponent } from 'src/app/dialog.component';
import { Location } from '@angular/common';
import { LeadAddFollowupModelComponent } from '../lead-add-followup-model/lead-add-followup-model.component';
import { LeadAddActivityModelComponent } from '../lead-add-activity-model/lead-add-activity-model.component';
import { QuotationDetailModalComponent } from '../quotation-detail-modal/quotation-detail-modal.component';
import { DistributorModelComponent } from '../../distribution/distributor-model/distributor-model.component';
import { ImageModuleComponent } from '../../image-module/image-module.component';



@Component({
  selector: 'app-lead-detail',
  templateUrl: './lead-detail.component.html',
  styles: ['agm-map { height: 300px; }'],
  animations: [slideToTop()]
})
export class LeadDetailComponent implements OnInit {
  
  latitude=20.5937;
  longitude=78.9629;
  mapType = 'roadmap';
  zoom=3;
  asmList: any = [];
  assignUserList: any = [];
  assignUser: any = [];
  
  lead_id: any;
  active: any = {};
  
  lead_detail: any = [];
  sales_executive_update: any;
  search: any = {};
  tmpsearch: any = {};
  loader: any;
  rsm: any = [];
  ass_user: any = [];
  tmp_userList: any = [];
  tabActiveType: any = {};
  data_not_found = false;
  activity_list: any = [];
  followup_list: any = [];
  quotation_list: any = [];
  userCheck: any = false;
  secContactDetail: any = [];
  userData:any;
  userId:any;
  userName:any;

  
  
  constructor(
    public route: ActivatedRoute,
    public serve: DatabaseService,
    public router: Router,
    public dialog: MatDialog,
    public alert: DialogComponent,
    private _location: Location,) {
      
      this.route.params.subscribe(params => {
        console.log(params);
        this.lead_id = params.id;
        console.log(this.lead_id);
        
      });
      this.userData = JSON.parse(localStorage.getItem('st_user'));
      console.log(this.userData);
      this.userId=this.userData['data']['id'];
      this.leadDetail();
      
      this.tabActive('tab1');
      
    }
    
    
    backToList() {
      this._location.back();
    }
    
    tabActive(tab: any) {
      this.tabActiveType = {};
      this.tabActiveType[tab] = true;
    }
    
    
    ngOnInit() {
    }
    
    
    
    leadDetail() {
      console.log('test Funcation');
      this.loader = 1;
      this.serve.fetchData({ 'dr_id': this.lead_id }, "Lead/getLeadDetail").subscribe((result => {
        console.log(result);
        console.log(result['result']);
        this.lead_detail = result['result'];
        this.assignUserList = result['result']['assign_user'];
        this.secContactDetail = result['result']['contactPerson'];
        console.log(this.assignUserList);
        this.latitude=parseFloat(result['result']['lat']);
        this.longitude=parseFloat(result['result']['lng']);
        console.log(this.latitude);
        console.log(this.longitude);
        this.zoom=15;
        setTimeout(() => {
          this.loader = '';
          this.salesUserLIst();
          
        }, 700);
      }))
    }
    
    
    
    salesUserLIst() {
      
      this.asmList = [];
      this.rsm = [];
      this.serve.fetchData(0, "User/sales_user_list").subscribe((result => {
        console.log(result);
        this.asmList = result['sales_user_list'];
        this.tmp_userList = this.asmList;
        console.log(this.rsm);
        
        
        for (let i = 0; i < this.asmList.length; i++) {
          
          for (let j = 0; j < this.assignUserList.length; j++) {
            
            if (this.asmList[i].id == this.assignUserList[j]['id']) {
              this.asmList[i].check = true;
              this.rsm.push(this.asmList[i].id);
              console.log(this.rsm);
            }
          }
          console.log(this.rsm);
          
        }
      }))
    }
    
    editDilog(value, type) {
      console.log("hello");
      console.log(this.lead_detail);
      
      
      const dialogRef = this.dialog.open(EditleadComponent, {
        width: '768px',
        data: {
          value,
          type,
          id: this.lead_id
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
        
        console.log('The dialog was closed');
        this.leadDetail();
        
        
      });
    }
    
    editAddress(value, type) {
      console.log(this.lead_detail);
      console.log(value);
      
      
      const dialogRef = this.dialog.open(EditleadComponent, {
        width: '768px',
        data: {
          value,
          type,
          id: this.lead_id
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
        console.log('The dialog was closed');
        // this.userDetail();
        this.leadDetail();
        
      });
    }
    
    editContact(id, type) {
      console.log(id, type);
      
      const dialogRef = this.dialog.open(EditleadComponent, {
        width: '750px',
        data: {
          type,
          id
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
        console.log('The dialog was closed');
        this.leadDetail();
      });
    }
    
    addContact(id, type) {
      const dialogRef = this.dialog.open(EditleadComponent, {
        width: '750px',
        data: {
          type,
          id
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
        console.log('The dialog was closed');
        // this.userDetail();
        
      });
    }
    
    deleteContact() {
      this.alert.delete('Lead Data !').then((result) => {
        if (result) {
          console.log("sucess");
          
        }
      })
    }
    
    confirm_lead(id) {
      this.alert.confirm('').then((result) => {
        if (result) {
          // console.log(type);
          this.serve.fetchData(id, "Distributors/confirm_lead").subscribe((result => {
            console.log(result);
            if (this.lead_detail.type == 1) {
              this.router.navigate(['lead-list']);
            } else {
              this.router.navigate(['dealer-lead-list']);
              
            }
          }))
        }
      });
    }
    getItemsList(search)
    {
      console.log(search);
      
      this.asmList=[];
      for(var i=0;i<this.tmp_userList.length; i++)
      {
        search=search.toLowerCase();
        this.tmpsearch=this.tmp_userList[i]['name'].toLowerCase();
        if(this.tmpsearch.includes(search))
        {
          this.asmList.push(this.tmp_userList[i]);
        }
      }
      console.log(this.asmList);
      
    }
    
    
    
    update_assigned_sales_executive(sales_executive){
      this.sales_executive_update = sales_executive;
      console.log(sales_executive);
      
    }
    
    
    update_assigned_executive(exec_id)
    {
      console.log(this.ass_user);
      console.log(this.asmList)
      console.log(this.rsm);

      this.ass_user =  this.rsm
      
      
      this.serve.fetchData({'exec':this.ass_user, 'dr_id':this.lead_id, 'drType':this.lead_detail.type,'uid':this.userId},"Distributors/update_assigned_sales_executive").subscribe((result=>{
        console.log(result);
        this.asmList = this.tmp_userList;
        this.asmList.map((el)=>{ el.check = false});
        
        if(this.rsm)
        {
          for(var i=0;i<this.rsm.length;i++)
          {
            var index_val = this.asmList.map((el) => el.id).indexOf(this.rsm[i]);
            console.log(index_val);
            
            this.asmList[index_val].check = !this.asmList[index_val].check;
          }
        }
        console.log(this.asmList);
        
        
        this.leadDetail();
      }))
      this.sales_executive_update='';
      this.router.navigate(['/lead-detail/'+this.lead_id]);
      
    }
    
    product_Brand(value,index,event){
      console.log(value);
      
      if(event.checked)
      {
        if(this.rsm.indexOf(this.asmList[index]['id']) === -1)
        {
          this.rsm.push(value);
          console.log(this.rsm);
        }
      }
      else{
        for( var j=0;j<this.asmList.length;j++)
        {
          if(this.asmList[index]['id']==this.rsm[j])
          {
            this.rsm.splice(j,1);
          }
        }
        console.log(this.rsm);
      }
      this.ass_user =  this.rsm
    }
    
    toggleterritory(key,action)
    {
      console.log(action);
      console.log(key);
      
      if(action == 'open')
      { this.active[key] = true; }
      if(action == 'close')
      { this.active[key] = false;
      }
      // this.salesUserLIst()
      
      console.log(this.active);
      // this.salesUserLIst()
      
    }
    
    followupDialog(value, company_name, type) {
      console.log("hello");
      
      const dialogRef = this.dialog.open(LeadAddFollowupModelComponent, {
        width: '500px',
        data: {
          value, type, company_name, id: this.lead_id,
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        this.leadDetail();
        this.followupList();
        this.activityList();
        this.quotationList();
      });
    }
    
    activityDialog(value, company_name, type) {
      console.log("hello");
      
      const dialogRef = this.dialog.open(LeadAddActivityModelComponent, {
        width: '500px',
        data: {
          value, type, company_name, id: this.lead_id,
          
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        this.leadDetail();
        this.followupList();
        this.activityList();
        this.quotationList();
      });
    }
    
    
    quotationDialog(id) {
      console.log('quotation Dialog box function');
      console.log(id);
      
      const dialogRef = this.dialog.open(QuotationDetailModalComponent, {
        width: '768px',
        data: {
          id: id,
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        this.leadDetail();
        this.followupList();
        this.activityList();
        this.quotationList();
      });
    }
    
    
    // activity list
    activityList() {
      this.loader = true;
      console.log("lead list function call");
      // this.loader=true;
      this.activity_list = [];
      console.log(this.activity_list);
      
      var data = { 'dr_id': this.lead_id }
      
      this.serve.fetchData({ data: data }, "Lead/activityList").subscribe((result => {
        console.log(result);
        this.activity_list = result['data'];
        console.log(this.activity_list);
        
        
        setTimeout(() => {
          this.loader = false;
          
        }, 700);
        if (this.activity_list.length == 0) {
          this.data_not_found = true;
        } else {
          this.data_not_found = false;
        }
        
      }))
    }
    
    followupList() {
      this.loader = true;
      console.log("lead list function call");
      // this.loader=true;
      this.followup_list = [];
      console.log(this.followup_list);
      var data = { 'dr_id': this.lead_id }
      
      this.serve.fetchData({ data: data }, "Lead/followupList").subscribe((result => {
        console.log(result);
        this.followup_list = result['data'];
        console.log(this.followup_list);
        
        setTimeout(() => {
          this.loader = false;
          
        }, 700);
        if (this.followup_list.length == 0) {
          this.data_not_found = true;
        } else {
          this.data_not_found = false;
        }
        
      }))
    }
    
    quotationList() {
      this.loader = true;
      console.log("Quotation list function call");
      // this.loader=true;
      this.quotation_list = [];
      var data = { 'dr_id': this.lead_id }
      
      this.serve.fetchData({ data: data }, "Lead/quotationList").subscribe((result => {
        console.log(result);
        this.quotation_list = result['data'];
        console.log(this.quotation_list);
        
        setTimeout(() => {
          this.loader = false;
          
        }, 700);
        if (this.quotation_list.length == 0) {
          this.data_not_found = true;
        } else {
          this.data_not_found = false;
        }
        
      }))
    }
    
    
    convertLead(lead_id,type){
      
      this.alert.confirm('').then((result) => {
        if (result) {
          console.log('yes');
          if(type== '1' || type== '3'){
            this.serve.fetchData({'dr_id' : lead_id}, "lead/leadConversion").subscribe((result => {
              console.log(result);
              if(type == '1'){
                this.router.navigate(['lead-list/1']);
              }
              else
              {
                this.router.navigate(['lead-list/3']);
              }
              
              
            }))
          }
          
          else if(type=='951011'){
            this.serve.fetchData({'dr_id' : lead_id}, "lead/leadStatusUpdate").subscribe((result => {
              console.log(result);
              this.leadDetail();
            }))
            
          }
          
          
        }
      });
    }
    
    editcontactPerson(type) {
      const dialogRef = this.dialog.open(DistributorModelComponent, {
        width: '1000px',
        data: {
          id: this.lead_id,
          type
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        this.leadDetail();
        this.tabActive('tab1');
      });
    }
    
    
    updateSecContact(empData,type){
      console.log(empData);
      const dialogRef = this.dialog.open(DistributorModelComponent, {
        width: '750px',
        data: {
          id: this.lead_id,
          updateData:empData,
          type,
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        this.leadDetail();
        this.tabActive('tab1');
      });
    }
    
    
    deleteSecContact(id){
      
      console.log(id);
      
      this.alert.delete('Contact Data !').then((result) => {
        if(result){  
          this.serve.fetchData({"id": id}, "Distributors/distributors_contact_delete").subscribe((result => {
          }))
          this.leadDetail();
          this.tabActive('tab1');
        }
        this.leadDetail();
        this.tabActive('tab1');
      })
    }
    
    
    update_google_location(country, state, district, city, pincode , address, type){
      console.log(type);
      const dialogRef = this.dialog.open(DistributorModelComponent, {
        width:'500px',
        data: {
          id: this.lead_id,
          country,
          state,
          district,
          city,
          pincode,
          address,
          type,
        }
      });
      dialogRef.afterClosed().subscribe(latlong => {
        console.log(latlong);
        this.leadDetail();
        this.tabActive('tab1');
        
      })
    }
    
    
    imageModel(visiting_card_image)
    {
      const dialogRef = this.dialog.open( ImageModuleComponent, {
        // width: '500px',
        data:{
          visiting_card_image
        }});
        dialogRef.afterClosed().subscribe(result => {
          console.log(result);
          console.log('The dialog was closed');
          
        });
        
      }
      
      
    }