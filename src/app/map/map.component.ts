import { Component, OnDestroy, OnInit } from '@angular/core';
import * as maplib from 'maplibre-gl';
import { NgFor, KeyValuePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { PinDialogComponent } from '../pin-dialog/pin-dialog.component';
import { PinService } from '../services/pin.service';
import { Pin } from '../models/pin.model';

@Component({
  selector: 'app-map',
  imports: [NgFor, KeyValuePipe],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent implements OnInit, OnDestroy {
  private map!: maplib.Map;

  mapStyles: Record<string, string[]> = {
    Standard: [
      'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
      'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
      'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
    ],
    Humanitarian: [
      'https://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
      'https://b.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
      'https://c.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
    ],
    Toner: [
      'https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png',
    ],
    Terrain: ['https://tile.opentopomap.org/{z}/{x}/{y}.png'],
    Watercolor: [
      'https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
    ],
  };

  currentStyleName = 'Standard';

  constructor(private pinService: PinService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.initializeMap(this.mapStyles[this.currentStyleName]);
    this.map.on('click', (event) => {
      const clickedElement = event.originalEvent.target as HTMLElement;
      // checking if element is an exisitng marker or the map
      if (
        clickedElement.closest('.maplibregl-marker') ||
        clickedElement.closest('.maplibregl-popup')
      ) {
        return;
      }
      const lngLat = event.lngLat;
      this.openAddPinDialog(lngLat.lng, lngLat.lat);
    });
    this.pinService.getPins().forEach((pin) => this.addMarker(pin));
  }

  private initializeMap(tiles: string[]): void {
    this.map = new maplib.Map({
      container: 'map',
      style: this.createStyle(tiles),
      center: [9.1829, 48.7758], // Stuttgart coordinates
      zoom: 12,
    });

    this.map.addControl(new maplib.NavigationControl(), 'top-right');
  }

  private createStyle(tiles: string[]): maplib.StyleSpecification {
    return {
      version: 8 as 8,
      sources: {
        osm: {
          type: 'raster',
          tiles,
          tileSize: 256,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        },
      },
      layers: [
        {
          id: 'osm',
          type: 'raster',
          source: 'osm',
          minzoom: 0,
          maxzoom: 19,
        },
      ],
    } as maplib.StyleSpecification;
  }

  changeView(styleName: string): void {
    if (!this.mapStyles[styleName]) return;
    this.currentStyleName = styleName;

    // Change the style dynamically
    const newStyle = this.createStyle(this.mapStyles[styleName]);
    this.map.setStyle(newStyle);
  }

  private openAddPinDialog(lng: number, lat: number): void {
    const dialogRef = this.dialog.open(PinDialogComponent, {
      width: '400px',
      height: 'auto',
      maxWidth: '90vw',
      maxHeight: '90vh',
      panelClass: 'pindialog',
      data: { lng, lat },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const pin: Pin = {
          lng: result.lng,
          lat: result.lat,
          comment: result.comment,
          category: result.category,
          visited: result.visited,
        };
        this.pinService.addPin(pin);
        this.addMarker(pin);
      }
    });
  }

  private addMarker(pin: Pin): void {
    const popup = new maplib.Popup({ offset: 25 }).setHTML(`
      <div style='padding: 7px;'>
        <strong>${pin.category}</strong><br>
        ${pin.comment}<br>
        Visited? <strong>${pin.visited ? 'Yes' : 'Not yet'}</strong>
      </div>
      `);

    new maplib.Marker({ color: '#FF5733' })
      .setLngLat([pin.lng, pin.lat])
      .setPopup(popup)
      .addTo(this.map);
  }

  ngOnDestroy(): void {
    this.map.remove();
  }
}
