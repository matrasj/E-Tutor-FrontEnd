import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {VisitService} from "../../../../../service/visit-service";
import {finalize} from "rxjs";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-approve-visit-modal',
  templateUrl: './approve-visit-modal.component.html',
  styleUrls: ['./approve-visit-modal.component.css']
})
export class ApproveVisitModalComponent implements OnInit {
  public visitId: number | null = null;
  public isLoading: boolean = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private visitService: VisitService,
              private toastrService: ToastrService,
              private dialogRef: MatDialogRef<ApproveVisitModalComponent>) { }

  ngOnInit(): void {
    this.visitId = this.data.visitId;
  }

  public confirm(): void {
    this.isLoading = true;
    this.visitService.approveVisit(this.visitId!)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: () => {
          this.toastrService.success("Successfully approved visit!");
          this.dialogRef.close(true);
        },
        error: () => this.toastrService.error("An error occurred during approving visit!")
      })
  }
}
