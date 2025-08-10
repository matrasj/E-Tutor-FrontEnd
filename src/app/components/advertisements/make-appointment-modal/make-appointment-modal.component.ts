import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {AdvertisementPayloadResponseModel} from "../../../model/advertisement/advertisement-payload-response-model";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {VisitPayloadModel} from "../../../model/visit/visit-payload-model";
import {AuthService} from "../../../service/auth-service";
import {VisitService} from "../../../service/visit-service";
import {finalize} from "rxjs";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-make-appointment-modal',
  templateUrl: './make-appointment-modal.component.html',
  styleUrls: ['./make-appointment-modal.component.css']
})
export class MakeAppointmentModalComponent implements OnInit {
  public advertisement: AdvertisementPayloadResponseModel | null = null;
  public appointmentFormGroup: FormGroup | null = null;
  public isLoading: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<MakeAppointmentModalComponent>,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private visitService: VisitService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.advertisement = this.data?.advertisement ?? null;

    this.appointmentFormGroup = this.formBuilder.group({
      message: this.formBuilder.group({
        visitContent: new FormControl<string>(''),
        visitDate: new FormControl<any>(null),
        visitTime: new FormControl<string>('')
      })
    });
  }

  get messageGroup(): FormGroup | null {
    return this.appointmentFormGroup?.get('message') as FormGroup;
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }

  onSubmit(): void {
    if (!this.appointmentFormGroup) return;

    const mg = this.messageGroup!;
    const content = mg.get('visitContent')?.value ?? '';
    const dateVal = mg.get('visitDate')?.value ?? null;
    const timeVal = mg.get('visitTime')?.value ?? '';

    const payload = {
      advertisementId: this.advertisement?.id ?? 0,
      purpose: content,
      visitDate: dateVal,
      visitTime: timeVal,
      authorId: this.authService.getCurrentUser().id
    } as VisitPayloadModel;

    this.visitService.makeAppointment(payload)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: () => {
          this.toastrService.success('Successfully made request for appointment');
          this.dialogRef.close({ success: true, data: payload });
        },
        error: () => this.toastrService.error('An error occurred during fetching data')
      });
  }
}
