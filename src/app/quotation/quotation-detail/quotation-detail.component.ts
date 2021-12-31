import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ActivatedRoute } from '@angular/router';
import { DialogComponent } from 'src/app/dialog.component';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { QuotationDetailModalComponent } from 'src/app/lead/quotation-detail-modal/quotation-detail-modal.component';
import html2canvas from 'html2canvas';
import * as jspdf from 'jspdf'; 
import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';

var quotation_id: any;


@Component({
  selector: 'app-quotation-detail',
  templateUrl: './quotation-detail.component.html',
  styleUrls: ['./quotation-detail.component.scss']
})
export class QuotationDetailComponent implements OnInit {
  
  product_list: any;
  data: any = {};
  quotationDetailList: any = [];
  quotationItem: any = [];
  quotation_id: any;
  productCode: null;
  productSize: any;
  productName: any;
  trimurtiBillingAddress:any;
  noTrimurtiBillingAddress:boolean=false;
  selectedTrimurtiBillingAddressID:any;
  selectedTrimurtiBillingAddressDetail:any;
  c_shipping_addr:any;
  c_billing_addr:any;
  c_shipping_city : any = '';
  c_shipping_state : any = '';
  c_shipping_country : any = '';
  c_billing_city:any = '';
  c_billing_state:any = '';
  c_billing_country:any = '';
  
  item: any = [];
  totalQty: number;
  totalAmount: number;
  tempTotalAmount: number = 0;
  tempGSTTotal: number = 0;
  tempGrandTotal: number = 0;
  
  tempTotalQty: number = 0;
  info = {};
  st: any = {};
  showReason: boolean = false;
  showSave: boolean = false;
  showEdit: boolean = true;
  rejectReason = false;
  quotationStatus='';
  tNc='';
  loader=false;
  hsn_code: any = '';
  showDivpdf: boolean = false;
  imgFile:any=[];
  
  
  constructor(private _location: Location, public rout: Router,public dialog: MatDialog, public alert: DialogComponent, public serve: DatabaseService, public route: ActivatedRoute, public toast: ToastrManager) {
    this.getProduct();
    this.data.product = null;
    console.log("url = "+this.serve.myurl);
    
    this.route.params.subscribe(params => {
      console.log(params);
      this.quotation_id = params.id;
      quotation_id = this.quotation_id;
      console.log(this.quotation_id);
      this.quotationDetail();
      
      
      
    });
    console.log(this.showDivpdf);

    
  }
  
  ngOnInit() {
  }
  
  
  back() {
    this._location.back();
    
  }
  
  getProduct() {
    
    this.serve.fetchData(0, "Product/product_list").subscribe((response => {
      console.log(response);
      this.product_list = response['product_list'];
      console.log(this.product_list);
      
    }));
  }
  
  
  quotationDetail() {
    this.quotationDetailList = '';
    this.quotationItem = []
    console.log('in quotation detail function');
    
    this.serve.fetchData(0, "Lead/getQuotationDetail/" + this.quotation_id).subscribe((result => {
      console.log(result);
      this.quotationDetailList = result['data'];
      this.quotationItem = this.quotationDetailList['quotation_item'];
      this.quotationStatus=this.quotationDetailList['quotation_status'];
      this.getTrimurtiBillingAddress()
      this.selectedTrimurtiBillingAddressID=this.quotationDetailList['company_address_id'];
      this.selectedTrimurtiBillingAddressDetail=this.quotationDetailList['address'];
      this.c_shipping_addr=this.quotationDetailList['customer_shipping'];
      this.c_billing_addr=this.quotationDetailList['customer_billing'];
      
      this.c_billing_country=this.quotationDetailList['c_billing_country'] && this.quotationDetailList['c_billing_country'] != '' ? this.quotationDetailList['c_billing_country'] : '--' ;
      this.c_billing_city=this.quotationDetailList['c_billing_city'] && this.quotationDetailList['c_billing_city'] != '' ? this.quotationDetailList['c_billing_city'] : '--' ;
      this.c_billing_state=this.quotationDetailList['c_billing_state'] && this.quotationDetailList['c_billing_state'] != '' ? this.quotationDetailList['c_billing_state'] : '--' ;
      this.c_shipping_country=this.quotationDetailList['c_shipping_country'] && this.quotationDetailList['c_shipping_country'] != '' ? this.quotationDetailList['c_shipping_country'] : '--' ;
      this.c_shipping_city=this.quotationDetailList['c_shipping_city'] && this.quotationDetailList['c_shipping_city'] != '' ? this.quotationDetailList['c_shipping_city'] : '--' ;
      this.c_shipping_state=this.quotationDetailList['c_shipping_state'] && this.quotationDetailList['c_shipping_state'] != '' ? this.quotationDetailList['c_shipping_state'] : '--' ;
      
      this.tNc = this.quotationDetailList['term_condition'];
      console.log(this.quotationStatus);
      this.totalQty = parseInt(this.quotationDetailList.item_count);
      this.totalAmount = parseInt(this.quotationDetailList.item_total);
      this.tempGSTTotal = parseInt(this.quotationDetailList.gst_amount);
      this.tempGrandTotal = parseInt(this.quotationDetailList.grand_total);
      
      console.log(this.quotationDetailList);
      console.log(this.quotationDetailList['quotation_item']);
      
    }))
  }
  
  details(details) {
    
    console.log(details);
    this.hsn_code = details.hsn;
    this.productSize = details.multi_products;
    console.log(this.productSize);
    for(let i=0;i<this.productSize.length;i++){
      this.productSize[i].price = this.productSize[i].product_mrp;
    }
    this.productName = details.product_name;
    this.data.hsn_code = this.hsn_code;
    
  }
  
  deleteItem(id, qty, amount,gst) {
    
    console.log(id);
    this.tempTotalAmount = 0
    this.tempTotalQty = 0
    if (this.quotationItem.length > 1) {
      this.info = '';
      console.log(qty);
      console.log(amount);
      this.tempTotalAmount = this.totalAmount - amount;
      this.tempTotalQty = this.totalQty - qty;
      this.tempGSTTotal = ((this.tempGSTTotal) - parseInt(gst));  
      this.tempGrandTotal = this.tempGSTTotal + this.tempTotalAmount;
      this.info = {  'grand_total': this.tempGrandTotal,'gst_amount': this.tempGSTTotal,'item_count': this.tempTotalQty, 'item_total': this.tempTotalAmount, 'quotation_id': parseInt(this.quotation_id) }
      
      
      
      this.alert.confirm('You will not be able to recover this Quotation Data!').then((result) => {
        if (result) {
          console.warn("greater than 1");
          this.serve.fetchData({ 'id': id, 'info': this.info }, "Lead/delete_quotation_item").subscribe((result => {
            console.log(result);
            if ((result['msg']) == ('Deleted')) {
              this.quotationDetail();
            }
            
          }))
        }
      });
    }
    
    else {
      this.alert.confirm('You will not be able to recover this Quotation !').then((result) => {
        if (result) {
          console.warn("equal to 1");
          this.serve.fetchData({ id: this.quotation_id }, "Lead/delete_quotation ").subscribe((result => {
            console.log(result);
            
            if ((result['msg']) == ('Deleted')) {
              this.rout.navigate(['/quotation']);
            }
          }))
        }
      });
    }
    
    
    
  }
  
  
  addItemList() {
    this.info = '';
    this.item.length = 0;
    this.tempTotalAmount = this.totalAmount;
    this.tempTotalQty = this.totalQty;
    for (let i = 0; i < this.productSize.length; i++) {
      
      if ((this.productSize[i].price) && (this.productSize[i].qty)) {
        this.productSize[i].amount = (this.productSize[i].price * this.productSize[i].qty);
        this.productSize[i].gst=  (parseInt(this.productSize[i].amount) * parseInt(this.data.gstPercentage) / 100);
        this.productSize[i].total_amount = parseInt(this.productSize[i].amount) + parseInt(this.productSize[i].gst);
        this.item.push({ "product_id": this.productSize[i].product_id, "product_size": this.productSize[i].product_size, "price": this.productSize[i].price, "qty": this.productSize[i].qty, "amount": this.productSize[i].amount,"total_amount": this.productSize[i].total_amount,"gst": this.productSize[i].gst,'gstPercentage':this.data.gstPercentage, "hsn_code": this.data.hsn_code, "product_name": this.productName })
        this.productSize[i].qty = '';
        this.productSize[i].price = '';
        this.productSize[i].amount = '';
        
      }
      else {
        console.warn("not add in array");
      }
    }
    this.productName = '';
    this.data.product = null;
    
    this.tempTotalAmount = 0;
    this.tempTotalQty = 0;
    this.tempGSTTotal = 0;
    this.tempGrandTotal = 0;
    
    console.log(this.item);
    
    for (let i = 0; i < this.item.length; i++) {
      this.tempTotalAmount = ((this.tempTotalAmount) + parseInt(this.item[i].amount));
      this.tempTotalQty = ((this.tempTotalQty) + parseInt(this.item[i].qty));
      this.tempGSTTotal = ((this.tempGSTTotal) + parseInt(this.item[i].gst));
      
    }
    
    this.tempGrandTotal = this.tempGSTTotal + this.tempTotalAmount;
    
    this.info = { 'item_count': this.tempTotalQty, 'grand_total': this.tempGrandTotal,'gst_amount': this.tempGSTTotal,'item_total': this.tempTotalAmount, 'quotation_id': parseInt(this.quotation_id), 'item': this.item }
    
    console.log(this.info);
    
    // this.info['item_count'] = this.tempTotalAmount;
    // this.info['item_total'] = this.tempTotalQty;
    // this.info.push(this.item)
    // this.info['quotation_id'] = this.quotation_id
    // console.log(this.info);
    
    if (this.item.length > 0) {
      this.serve.fetchData({ 'info': this.info }, "Lead/quotation_item_update").subscribe((result => {
        console.log(result);
      }))
      this.quotationDetail();
      
    }
    else {
      this.toast.errorToastr("Add Qty & Price");
      
    }
    
  }
  
  
  rejectCondition(status) {
    this.showEdit = false;
    this.showSave = true;
    console.log(status);
    if (status == "Reject") {
      console.log('in reject condition');
      this.showReason = true;
    }
  }
  
  editStatus() {
    console.log('edit function');
    this.showEdit = false;
    this.showSave = true;
  }
  
  saveStatus(status, reason) {
    this.loader = true;
    
    console.log(this.selectedTrimurtiBillingAddressID);
    console.log(this.c_shipping_addr);
    console.log(this.c_billing_addr);
    
    
    console.log('in save function');
    console.log(status);
    console.log(reason);
    
    this.showReason = true;
    this.showSave = false;
    this.st.quotation_id = this.quotation_id;
    this.st.status = status;
    this.st.reason = reason;
    this.st.company_address_id = this.selectedTrimurtiBillingAddressID;
    this.st.customer_shipping = this.c_shipping_addr;
    this.st.customer_billing = this.c_billing_addr;
    
    this.st.c_shipping_country = this.c_shipping_country;
    this.st.c_shipping_state = this.c_shipping_state;
    this.st.c_shipping_city = this.c_shipping_city;
    this.st.c_billing_country = this.c_billing_country;
    this.st.c_billing_state = this.c_billing_state;
    this.st.c_billing_city = this.c_billing_city;
    
    
    
    
    
    console.log(this.st);
    let data = { data: this.st };
    console.warn(data);
    
    if (status == "Reject" && !reason) {
      console.log('reason is blank');
      this.rejectReason = true;
      this.showSave = true;
      this.loader = false;
      return;
    }
    
    this.serve.fetchData(data, "Lead/updateQuotationStatus/").subscribe((result => {
      console.log(result);
      
      if (result['status'] == 'Success') {
        console.log('in success function');
        
        
        setTimeout(() => {
          this.loader = false;
        }, 500);
        this.rout.navigate(['/quotation']);
      }
      else {
        console.log('in failed function');
        console.log(result['error']['message']);
        this.alert.error(result['error']['message']);
        this.loader = false;
      }
    }))
  }
  
  
  quotationDialog() {
    console.log('quotation Dialog box function');
    
    
    const dialogRef = this.dialog.open(QuotationDetailModalComponent, {
      width: '550px',
      data: {
        id: this.quotation_id,
        termsNcondition:this.tNc,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.quotationDetail();
    });
  }
  
  
  // backend pdf print function
  onPrintPage() {
    
    // const printContents = document.getElementById('printData').innerHTML;
    // console.log(printContents);
    
    // const originalContents = document.body.innerHTML;
    // console.log(originalContents);
    
    
    // document.body.innerHTML = printContents;
    
    // window.print();
    
    // document.body.innerHTML = originalContents;
    
    // setTimeout(() => {
    
    //   $('#printData').hide();
    
    // }, 1000);
    
    
    // ----backend print ------
    
    console.log("onPrintPage method call");
    console.log(this.quotation_id);
    
    this.serve.fetchData({'id':this.quotation_id}, "Cron/getQuotationDetailPdf").subscribe((result) => {
      console.log(result);
      
      if(result=='success')
      {
        var url = this.serve.myurl+'api/uploads/QuotationPdf/'+this.quotation_id+'.pdf';
        window.open(url);
      }
      else{
        console.log("no data found");
      }
      
      
    })
    
  }
  
  
  // frontend pdf print function
  // exportPDF(){
  
  //   this.showDivpdf = true;
  
  //   setTimeout(() => {
  //     if(this.showDivpdf==true)
  //     {  
  
  
  //       var element = document.getElementById('component1');
  //       html2canvas(element).then(canvas=>{
  
  //         this.imgFile = canvas.toDataURL("image/jpeg", 1);
  //         let pdf=new jspdf('1','cm','a4');
  //         pdf.addImage(this.imgFile,'',0.7,0.7, 19.5,19,'FAST');
  //         pdf.save('ServiceReport.pdf');   
  //       });
  
  //     }
  //   }, 1000);
  //   setTimeout(() => {
  //     this.showDivpdf=false
  //   }, 1500);
  // }
  
  
  exportPDF(){
    
    this.showDivpdf = true;
    this.imgFile = []
    
    var imgWidth = 0; 
    var pageHeight = 0;  
    var imgHeight = 0;
    var heightLeft = 0;
    var position = 0;
    let pdf = null;
    var element : HTMLElement = null;
    
    setTimeout(() => {

      if(this.showDivpdf==true)
      {  
            element = document.getElementById('component1');

            htmlToImage.toPng(element).then(function (dataUrl) {

                  console.log(dataUrl);

                  const imgFile = dataUrl;
                  imgWidth = 200; 
                  pageHeight = 295;  
                  imgHeight = element.offsetHeight * imgWidth / element.offsetWidth;
                  heightLeft = imgHeight;
                  
                  pdf=new jspdf('p', 'mm');
                  position = 5;
                  console.log('image width 1 '+imgWidth)
                  console.log('image imgHeight 1 '+imgHeight)

                  pdf.addImage(imgFile,'PNG', 5,position, imgWidth, imgHeight);
                  heightLeft -= pageHeight;

                  while (heightLeft >= 0) {

                        position = heightLeft - imgHeight + 5;

                        pdf.addPage();
                        pdf.addImage(imgFile,'PNG', 5,position, imgWidth, imgHeight);
                        heightLeft -= pageHeight;
                  }

                  pdf.save('Quotation No. - '+quotation_id+'  .pdf');   
            });
        
            // html2canvas(element).then(canvas=>{

              
            //   this.imgFile = canvas.toDataURL();
            //   console.log('image file '+this.imgFile);
              
              
            //   imgWidth = 200; 
            //   pageHeight = 295;  
            //   imgHeight = canvas.height * imgWidth / canvas.width;
            //   heightLeft = imgHeight;
              
            //   pdf=new jspdf('p', 'mm');
            //   position = 5;
            //   console.log('image width 1 '+imgWidth)
            //   console.log('image imgHeight 1 '+imgHeight)
            //   console.log('image canvas.width 1 '+canvas.width)
            //   console.log('image canvas.height 1 '+canvas.height)
    
              
            //   pdf.addImage(this.imgFile,'PNG', 5,position, imgWidth, imgHeight);
            //   heightLeft -= pageHeight;
            //  let i=0;

            //   while (heightLeft >= 0) {
            //     position = heightLeft - imgHeight + 5;
            //     console.log('position'+i+' '+position)

            //     pdf.addPage();
            //     pdf.addImage(this.imgFile,'PNG', 5,position, imgWidth, imgHeight);
            //     heightLeft -= pageHeight;
            //     i++
            //   }
            //   pdf.save('Quotation No. - '+this.quotation_id+'  .pdf');   
            // });
        
      }

    }, 1000);

    setTimeout(() => {

       this.showDivpdf=false;
      // window.location.reload();
    }, 5000);
    
    
  }
  
  
  
  
  getTrimurtiBillingAddress(){
    console.log("getTrimurtiBillingAddress function call");
    this.serve.fetchData({ }, "Lead/company_address").subscribe((result) => {
      console.log(result);
      this.trimurtiBillingAddress = result['data'];
      if (this.trimurtiBillingAddress.length == 0) {
        this.noTrimurtiBillingAddress=true;
      }
      else {
        this.noTrimurtiBillingAddress=false;
      }
    })
  }
  
  
  conInt(val)
  {
    return parseInt(val)
  }
  
  show_error(type){
    if(type == 'gst_error_show'){
      this.toast.errorToastr("GST Percentage is mandatory and greater than 0");
      
    }
    else{
      this.toast.errorToastr("Something went wrong, Please try again !");
      
    }
  }

  con_float(val){
    return parseFloat (val).toFixed(2)
  }
  
}

