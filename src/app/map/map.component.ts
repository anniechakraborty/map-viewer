import { Component, OnDestroy, OnInit } from '@angular/core';
import * as maplib from 'maplibre-gl';
import { NgFor, KeyValuePipe } from '@angular/common';
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
    Terrain: [
      'https://tile.opentopomap.org/{z}/{x}/{y}.png',
    ],
    Watercolor: [
      'https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
    ],
  };

  currentStyleName = 'Standard';

  constructor(private pinService: PinService) {}

  ngOnInit(): void {
    this.initializeMap(this.mapStyles[this.currentStyleName]);

    // Initializing the map with the center in Stuttgart
    // this.map = new maplib.Map({
    //   container: 'map',
    //   style: {
    //     version: 8,
    //     sources: {
    //       osm: {
    //         type: 'raster',
    //         tiles: [
    //           'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
    //           'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
    //           'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
    //         ],
    //         tileSize: 256,
    //         attribution:
    //           '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    //       },
    //     },
    //     layers: [
    //       {
    //         id: 'osm',
    //         type: 'raster',
    //         source: 'osm',
    //         minzoom: 0,
    //         maxzoom: 19,
    //       },
    //     ],
    //   },
    //   center: [9.1829, 48.7758],
    //   zoom: 12,
    // });

    // this.map.addControl(new maplib.NavigationControl(), 'top-right');
  }

  private initializeMap(tiles: string[]): void {
    this.map = new maplib.Map({
      container: 'map',
      style: this.createStyle(tiles),
      center: [9.1829, 48.7758],
      zoom: 12,
    });

    this.map.addControl(new maplib.NavigationControl(), 'top-right');
  }

  private createStyle(tiles: string[]): maplib.StyleSpecification {
    return {
      version: 8 as 8, // <-- this is key (literal type, not just a number)
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
    } as maplib.StyleSpecification; // <-- tell TypeScript explicitly
  }

  changeView(styleName: string): void {
    if (!this.mapStyles[styleName]) return;
    this.currentStyleName = styleName;

    // Change the style dynamically
    const newStyle = this.createStyle(this.mapStyles[styleName]);
    this.map.setStyle(newStyle);
  }

  ngOnDestroy(): void {
    this.map.remove();
  }
}
