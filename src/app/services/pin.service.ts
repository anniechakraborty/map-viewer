import { Injectable } from '@angular/core';
import { Pin } from '../models/pin.model';

@Injectable({
  providedIn: 'root'
})
export class PinService {
  private pins: Pin[] = [];

  addPin(pin: Pin): void {
    this.pins.push(pin);
    localStorage.setItem('pins', JSON.stringify(this.pins));
  }

  getPins(): Pin[] {
    const stored = localStorage.getItem('pins');
    this.pins = stored ? JSON.parse(stored) : [];
    return this.pins;
  }
}
