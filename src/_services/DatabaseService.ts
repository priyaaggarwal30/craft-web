import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Location } from '@angular/common';
import { retry } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { DialogComponent } from 'src/app/dialog.component';
import { Observable } from 'rxjs';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { componentRefresh } from '@angular/core/src/render3/instructions';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({ providedIn: 'root' })
export class DatabaseService implements OnInit {

    // myurl = 'http://phpstack-83335-1495813.cloudwaysapps.com/api/';
    myurl = 'http://phpstack-83335-2231038.cloudwaysapps.com/';
    myurl2 ='http://phpstack-83335-2231038.cloudwaysapps.com/api/';
    tempUrl = 'http://phpstack-83335-2231038.cloudwaysapps.com/api/index.php/'
    


    header: any = new HttpHeaders();
    data: any;
    myProduct: any = {};
    peraluser: any = {};
    tmp;
    detail: any = {};
    counterArray:any={};


    orderFilterPrimary: any = {}
    orderFilterSecondary: any = {}
    dealerListSearch: any = {}
    directDealerListSearch: any = {}
    distributorListSearch: any = {}
    

    dburl2 = "http://phpstack-83335-2231038.cloudwaysapps.com/api/"
    myimgurl = "http://phpstack-83335-2231038.cloudwaysapps.com/";
    myimgurl2 = "http://phpstack-83335-2231038.cloudwaysapps.com/";
    dbUrl = "http://phpstack-83335-2231038.cloudwaysapps.com/api/index.php/";

    constructor(public http: HttpClient,public location: Location,
        public dialog: DialogComponent,
        private router: Router,
        public route: ActivatedRoute,) { }

    can_active: any = "";
    LogInCheck(username, password) {
        this.data = { username, password };
        return this.http.post(this.dbUrl + "/login/submitnew/", JSON.stringify(this.data), { headers: this.header });

    }

    public exportAsExcelFile(json: any[], excelFileName: string): void {
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
        console.log('worksheet', worksheet);
        const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        // const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
        this.saveAsExcelFile(excelBuffer, excelFileName);
    }
    private saveAsExcelFile(buffer: any, fileName: string): void {
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE
        });
        FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
    }

    // counts:any={};
    // counterhit(counts){
    //     console.log(counts);
    //     this.counts=counts;
    //     // window.location.reload(NavigationComponent);
    // }



    fetchData(data: any, fn: any) {
        console.log(data);
        this.header.append('Content-Type', 'application/json');
        console.log(this.dbUrl + fn);
        return this.http.post(this.dbUrl + fn, JSON.stringify(data), { headers: this.header })
    }

    fetchData2(data: any, fn: any) {
        console.log(data);
        this.header.append('Content-Type', 'application/json');
        console.log(this.dburl2 + fn);
        return this.http.post(this.dburl2 + fn, JSON.stringify(data), { headers: this.header })
    }
    upload_image(val, fn_name) {
        console.log(val);
        return this.http.post(this.dbUrl + fn_name, val, { headers: this.header });

    }
    FileData(request_data: any, fn: any) {
        this.header.append('Content-Type', undefined);
        console.log(request_data);
        // return this.http.post(this.dbUrl + fn, request_data, { headers: this.header });
        return this.http.post(this.tempUrl + fn, request_data, { headers: this.header });

    }


    datauser: any = {};
    loading: any;

    customer_name: any;
    franchise_name: any;
    franchise_id;
    franchise_location;
    challans: any = [];

    

    ngOnInit() {
        // this._pushNotificationService.requestPermission();

    }



    private extractData(res: Response) {
        const body = res;
        return body || {};
    }
    auth_rqust(request_data: any, fn: any) {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.post(this.myurl + fn, request_data, { headers: headers });
    }








    post_rqst(request_data: any, fn: any): any {
        if (!this.chek_seission())
            return false;
        // this.noificaton();
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        headers = headers.set('Token', 'Bearer ' + this.datauser.token);
        return this.http.post(this.myurl + fn, JSON.stringify(request_data), { headers: headers }).
            pipe(
                retry(3),
                // retry a failed request up to 3 times
                // catchError(this.handleError) // then handle the error
            );
    }

    get_rqst(request_data: any, fn: any): any {
        if (!this.chek_seission())
            return false;
        this.noificaton();

        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        headers = headers.set('Token', 'Bearer ' + this.datauser.token);
        return this.http.post(this.dbUrl + fn, JSON.stringify(request_data), { headers: this.header })

            
    }



    get_rqst2(request_data: any, fn: any): any {
        

        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        headers = headers.set('Token', 'Bearer ' + this.datauser.token);
        return this.http.post(this.dbUrl + fn, JSON.stringify(request_data), { headers: this.header })

        // return this.http.get(this.myurl2 + fn, { headers: headers });
            
    }



    get_rqst3(request_data: any, fn: any): any {
        

        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        headers = headers.set('Token', 'Bearer ' + this.datauser.token);
        // return this.http.post(this.dbUrl + fn, JSON.stringify(request_data), { headers: this.header })

        return this.http.get(this.myurl2 + fn, { headers: headers });
            
    }




    login_get_rqst(request_data: any, fn: any): any {

        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.get(this.myurl + fn, { headers: headers }).
            pipe(
                retry(3),
                // retry a failed request up to 3 times
                // catchError(this.handleError ) ,
                // then handle the error
            );
    }


    insert_rqst(request_data: any, fn: any): any {
        if (!this.chek_seission())
            return false;
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        headers = headers.set('Token', 'Bearer ' + this.datauser.token);
        return this.http.post(this.myurl + fn, JSON.stringify(request_data), { headers: headers })

    }





    fileData(request_data: any, fn: any): any {

        //console.log( request_data );
        this.header.append('Content-Type', undefined);

        return this.http.post(this.myurl + fn, request_data, { headers: this.header })

    }




    public share_data: any;

    set_fn(val: any) {
        this.share_data = val;
    }

    get_fn() {
        return this.share_data;
    }



    chek_seission() {
        this.datauser = JSON.parse(localStorage.getItem('users')) || {};
        if (this.datauser.id) {
            return true;
        } else {
            this.dialog.error("You'r session logged out ! Please Login agian");
            // this.dialog.alert("info","Session Logged Out","You'r session logged out ! Please Login agian");
            this.router.navigate([''], { queryParams: { returnUrl: this.router.url } });
            return false;

        }

    }





    // crypto(val, mode:any = true){
    //     if(val) return new Crypto().transform( val, mode);
    //     else return '';
    // }

    // pickerFormat(val, format:any = 'Y-M-D'){
    //     if(val) return new DatePikerFormat().transform( val, format);
    // }

    goBack() {
        window.history.back();
    }


    noificaton_rqst(): any {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        headers = headers.set('Token', 'Bearer ' + this.datauser.token);
        return this.http.post(this.myurl + 'stockdata/getNotification', JSON.stringify({ 'login_id': this.datauser.id }), { headers: headers }).
            pipe(
                retry(3),
            );
    }

    notifications: any = [];
    all_notifications: any = [];
    noificaton() {
        this.noificaton_rqst().subscribe(d => {
            //console.log(d);
            this.all_notifications = d.notifications;
            if (d.notify.length > 0 && !this.offNotifiy) {
                this.offFlag = false;
                this.notifications = d.notify;
                this.sendNotify(0);
            }
        });
    }

    offFlag: any = false;
    offNotifiy: any = false;
    sendNotify(index) {
        if (this.offFlag) return;
        var e = this.notifications[index];
        //console.log(index);

        //console.log(e);
        if (!e) return;

        const title = e.title;
        let options = {
            body: e.message,
            icon: 'favicon.ico'
        }

        // this._pushNotificationService.create(title, options).subscribe((notif) => {
        //     if (notif.event.type === 'show') {
        //         //console.log('onshow');
        //         setTimeout(() => {
        //             notif.notification.close();
        //             this.sendNotify(++index);
        //             //console.log(index);

        //         }, 3000);
        //     }
        //     if (notif.event.type === 'click') {
        //         //console.log('click');
        //         this.offFlag = true;
        //         notif.notification.close();

        //     }
        //     if (notif.event.type === 'close') {
        //         //console.log('close');
        //     }
        // },
        // (err) => {
        //     //console.log(err);
        // });
    }







    numeric_Number(event: any) {
        const pattern = /[0-9\+\-\ ]/;
        let inputChar = String.fromCharCode(event.charCode);
        // //console.log(event.keyCode);
        if (event.keyCode != 8 && !pattern.test(inputChar)) {
            event.preventDefault();
        }
    }


    count_list() {
        this.http.get(this.dbUrl + "Attendance/count_data").subscribe(r => {
            if (r) {
                this.counterArray = r;
                console.log(this.counterArray);
            }
            else{
                console.log("counter Error in DatabaseService File");   
            }
        });
    }






}




