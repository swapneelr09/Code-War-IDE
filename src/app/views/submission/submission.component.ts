import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '../../api.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.css']
})
export class SubmissionComponent implements OnInit {
    isVisible = false
    @Input() data : any
    code : any
    constructor(private api : ApiService, private cookieService : CookieService) { }
  
    ngOnInit() {
      
    }
    
    showModal(index){
      this.isVisible = true
      this.code = this.data[index]['code']
    }

    closeModal(){
      this.isVisible = false
    }
}
