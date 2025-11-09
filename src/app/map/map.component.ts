import { Component, OnDestroy, OnInit } from '@angular/core';
import * as maplib from 'maplibre-gl';
import { PinService } from '../services/pin.service';
import { Pin } from '../models/pin.model';

@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent implements OnInit, OnDestroy {
  private map!: maplib.Map;

  constructor(private pinService: PinService) {}

  ngOnInit(): void {
    // Initializing the map with the center in Stuttgart
    this.map = new maplib.Map({
      container: 'map',
      style: {
        version: 8,
        sources: {
          osm: {
            type: 'raster',
            tiles: [
              'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
              'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
              'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
            ],
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
      },
      center: [9.1829, 48.7758],
      zoom: 12,
    });

    this.map.addControl(new maplib.NavigationControl(), 'top-right');
  }

  ngOnDestroy(): void {
    this.map.remove();
  }
}
