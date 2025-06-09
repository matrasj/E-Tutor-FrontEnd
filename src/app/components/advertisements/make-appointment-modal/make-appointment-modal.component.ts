import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {AdvertisementPayloadResponseModel} from "../../../model/advertisement/advertisement-payload-response-model";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-make-appointment-modal',
  templateUrl: './make-appointment-modal.component.html',
  styleUrls: ['./make-appointment-modal.component.css']
})
export class MakeAppointmentModalComponent implements OnInit {
  public advertisement: AdvertisementPayloadResponseModel | null = null;
  public appointmentFormGroup: FormGroup | null = null;
  constructor(@Inject(MAT_DIALOG_DATA) public data : any,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.advertisement = this.data.advertisement;
    this.appointmentFormGroup = this.formBuilder.group({
      message : this.formBuilder.group({
        visitContent : new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]),
        visitDate : new FormControl('', [Validators.required, Validators.maxLength(5000)]),
        visitTime : new FormControl('', [Validators.required, Validators.maxLength(5000)]),
      })
    });
  }

}
