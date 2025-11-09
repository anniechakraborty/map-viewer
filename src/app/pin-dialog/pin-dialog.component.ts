import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pin-dialog',
  standalone: true,
  imports: [
    FormsModule, 
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    CommonModule
  ],
  templateUrl: './pin-dialog.component.html',
  styleUrls: ['./pin-dialog.component.scss']
})
export class PinDialogComponent {
  comment: string = '';
  category: string = 'Notes';
  visited: true | false = true;

  categories: string[] = [
    'Notes',
    'Hiking Spot',
    'Parking Space',
    'Work',
    'Home',
    'Travel Destinations',
    'Others',
  ];

  constructor(
    public dialogRef: MatDialogRef<PinDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { lng: number; lat: number }
  ) {}

  onSave(): void {
    if (!this.comment.trim() || !this.category.trim()) return;
    this.dialogRef.close({
      comment: this.comment,
      category: this.category,
      visited: this.visited === true,
      lng: this.data.lng,
      lat: this.data.lat,
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
