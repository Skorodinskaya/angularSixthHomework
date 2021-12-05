import {Component, OnInit} from '@angular/core';
import {DataTransferService} from "../../services";
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  email: string;
  isAdmin: boolean;

  constructor(private transferService:DataTransferService, private router:Router) {
  }

  ngOnInit(): void {
    this.transferService.currentUserSubject.subscribe(value => {
      if(value) {
        this.email = value.email;
        this.isAdmin = value.is_staff;
      }
    })
  }

  toAdmin():void {
    this.router.navigate(['admin'])
  }
}
