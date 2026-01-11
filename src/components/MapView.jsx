/**
 * MapView
 * -------
 * Leaflet-based map component responsible for rendering:
 * - User-defined markers (start, via, end)
 * - A calculated route polyline
 * - A highlighted nearby attraction
 * - Click interaction for adding new markers
 */

import React from 'react';
import {
    MapContainer,
    TileLayer,
    Marker,
    Polyline,
    useMapEvents
} from 'react-leaflet';
import L from 'leaflet';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

/**
 * Default Leaflet marker icon.
 * Used for all user-defined markers (start, via, end).
 */
const defaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

/**
 * Highlight marker icon.
 * Used to visually emphasize a nearby attraction on the map.
 */
const highlightIcon = L.icon({
    iconUrl: 'img/marker-icon-red.png',
    shadowUrl: markerShadow,
    iconSize: [35, 55],
    iconAnchor: [12, 41]
});

/**
 * ClickHandler
 * ------------
 * Internal helper component that listens to map click events.
 * When marker placement mode is active, it forwards the clicked
 * coordinates to the parent component.
 *
 * @param {Object} props
 * @param {boolean} props.isSetMarkerMode - Whether marker placement is enabled
 * @param {'start'|'via'|'end'} props.markerType - Type of marker to add
 * @param {Function} props.onMarkerAdd - Callback to add a new marker
 */
function ClickHandler({ isSetMarkerMode, markerType, onMarkerAdd }) {
    useMapEvents({
        click(e) {
            if (!isSetMarkerMode) return;

            onMarkerAdd({
                lat: e.latlng.lat,
                lng: e.latlng.lng,
                type: markerType
            });
        }
    });

    // This component does not render any visible JSX
    return null;
}

/**
 * MapView Component
 * -----------------
 * Renders the interactive map including markers, route polyline,
 * and a highlighted attraction marker.
 *
 * @param {Object} props
 * @param {Array<{lat:number, lng:number, type:string}>} props.markers - User-defined markers
 * @param {Array<[number, number]>} props.polylineCoords - Route polyline coordinates
 * @param {boolean} props.isSetMarkerMode - Whether marker placement mode is active
 * @param {'start'|'via'|'end'} props.markerType - Current marker type to be placed
 * @param {Function} props.onMarkerAdd - Callback for adding markers
 * @param {Array} [props.nearbyAttractions] - Nearby attractions (optional)
 * @param {Object|null} [props.highlightAttraction] - Attraction to highlight on the map
 */
function MapView({
                     markers,
                     polylineCoords,
                     isSetMarkerMode,
                     markerType,
                     onMarkerAdd,
                     nearbyAttractions = [],
                     highlightAttraction = null
                 }) {
    return (
        <div style={{ height: '50vh', width: '100%' }}>
            <MapContainer
                center={[51.1657, 10.4515]} // Centered on Germany
                zoom={6}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution="© OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Handles click events for adding markers */}
                <ClickHandler
                    isSetMarkerMode={isSetMarkerMode}
                    markerType={markerType}
                    onMarkerAdd={onMarkerAdd}
                />

                {/* Render all user-defined markers */}
                {markers.map((m, idx) => (
                    <Marker
                        key={idx}
                        position={[m.lat, m.lng]}
                        icon={defaultIcon}
                    />
                ))}

                {/* Highlight a nearby attraction if available */}
                {highlightAttraction?.lat != null && highlightAttraction?.lon != null && (
                    <Marker
                        key={`highlight-${highlightAttraction.pageid ?? 'x'}`}
                        position={[highlightAttraction.lat, highlightAttraction.lon]}
                        icon={highlightIcon}
                    />
                )}

                {/* Render route polyline if available */}
                {polylineCoords.length > 0 && (
                    <Polyline
                        positions={polylineCoords}
                        color="blue"
                        weight={4}
                    />
                )}
            </MapContainer>
        </div>
    );
}

export default MapView;
