import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {IUser} from "../interfaces";

@Injectable({
  providedIn: 'root'
})
export class DataTransferService {

  currentUserSubject = new BehaviorSubject<IUser | null>(null)
}
