import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {VisitService} from "../../../../../service/visit-service";
import {finalize} from "rxjs";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-reject-visit-modal',
  templateUrl: './reject-visit-modal.component.html',
  styleUrls: ['./reject-visit-modal.component.css']
})
export class RejectVisitModalComponent implements OnInit {
  public visitId: number | null = null;
  public isLoading: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private visitService: VisitService,
              private toastrService: ToastrService,
              private dialogRef: MatDialogRef<RejectVisitModalComponent>) { }

  ngOnInit(): void {
    this.visitId = this.data.visitId;
  }

  public confirm(): void {
    this.isLoading = true;
    this.visitService.rejectVisit(this.visitId!)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: () => {
          this.toastrService.success("Successfully rejected visit!");
          this.dialogRef.close(true);
        },
        error: () => this.toastrService.error("An error occurred during rejecting visit!")
      })
  }
}
