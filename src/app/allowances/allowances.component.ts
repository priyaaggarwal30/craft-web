import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ActivatedRoute,Router } from '@angular/router';
import { Location } from '@angular/common'



@Component({
  selector: 'app-allowances',
  templateUrl: './allowances.component.html',
  styleUrls: ['./allowances.component.scss']
})
export class AllowancesComponent implements OnInit {
  
  userRoleData:any=[];
  allowanceData:any=[];
  loader:any;
  backButton: boolean = false;
  
  
  constructor(public serve:DatabaseService,public navparams: ActivatedRoute,public location: Location) 
  { 
    this.get_designation();
    console.log(this.navparams['params']['_value']);
    console.log(this.navparams['params']['_value']['from']);
    
    if(this.navparams['params']['_value']['from'] == 'expense-detail'){
      console.log("in nav if");
      this.backButton = true;
      
    }
    
  }
  
  ngOnInit() 
  {
  }
  
  get_designation()
  {
    this.serve.fetchData({},"Allowance/sales_type").subscribe((response=>
      {
        this.userRoleData = response['sales'];
        console.log(this.userRoleData);
        
      }));
      
      this.get_allowance();
      
    }
    
    get_allowance()
    {
      this.loader=1;
      this.serve.fetchData({},"Allowance/getAllowanceData").subscribe((response=>
        {
          console.log(response);
          this.allowanceData = response['allowance'];
          console.log(this.allowanceData);  
          for(var i=0; i<this.userRoleData.length; i++)
          {
            const index = this.allowanceData.findIndex(row => ((row.user_id).toString()) == this.userRoleData[i].user_id);
            if(index != -1){
              console.log(this.userRoleData[i]['user_id'] , this.allowanceData[index]['user_id']);
              this.userRoleData[i]['id'] = this.allowanceData[index]['id'];
              this.userRoleData[i]['flight'] = this.allowanceData[index]['flight'];
              this.userRoleData[i]['trainSleeperClass'] = this.allowanceData[index]['trainSC'];
              this.userRoleData[i]['train3Tier'] = this.allowanceData[index]['train3Tier'];
              this.userRoleData[i]['train2Tier'] = this.allowanceData[index]['train2Tier'];
              this.userRoleData[i]['busAC'] = this.allowanceData[index]['busAC'];
              this.userRoleData[i]['busNonAC'] = this.allowanceData[index]['busNonAC'];
              this.userRoleData[i]['auto'] = this.allowanceData[index]['auto'];
              this.userRoleData[i]['taxi'] = this.allowanceData[index]['taxi'];
              this.userRoleData[i]['car'] = this.allowanceData[index]['car'];
              this.userRoleData[i]['bike'] = this.allowanceData[index]['bike'];
              this.userRoleData[i]['hotel'] = this.allowanceData[index]['hotel'];
              this.userRoleData[i]['food'] = this.allowanceData[index]['food'];
            }
            else{
              console.log("in else");
              console.log(index);
            }
            
          }
          
          console.log(this.userRoleData);
          setTimeout (() => {
            this.loader='';
            
          }, 1000);
          
        }));
      }
      
      updateAllowance()
      {
        console.log(this.userRoleData); 
        this.serve.fetchData({'data':this.userRoleData},"Allowance/update_allowance").subscribe((response=>
          {
            console.log(response);  
            this.get_allowance();
            
          })); 
        }
        
        
        back(): void {
          console.log("location back method calls");
          console.log(this.location);
          this.location.back()
        }
        
      }
      