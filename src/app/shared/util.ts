import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
    providedIn: 'root'
})
export class UtilityService{

    constructor(private snackBar:MatSnackBar){}

    public openSnackBar(message: string) {
        this.snackBar.open(message, "Ok", {
          duration: 5000,
          horizontalPosition: "right",
          verticalPosition: "top",
          panelClass: ["failure-snackbar"],
        });
      }
}