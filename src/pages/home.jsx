/**
 * HomePage
 * --------
 * Main page component of the application.
 *
 * Responsibilities:
 * - Manage start, via, and end markers on a map
 * - Calculate and display a route using OSRM
 * - Fetch and show additional information for selected markers
 * - Display nearby attractions and highlight them on the map
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
    Page,
    Block,
    Button,
    List,
    ListItem,
    Navbar,
    BlockTitle,
    NavTitle,
    AccordionContent,
    CardHeader,
    CardContent,
    Card,
    ListInput,
    Toolbar,
    Link
} from 'framework7-react';
import MapView from '../components/MapView';
import getRouteInfo from '../js/routeInfo';

export default function HomePage() {
    /** Indicates whether the user is currently placing a marker on the map */
    const [isSetMarkerMode, setIsSetMarkerMode] = useState(false);

    /** Type of marker to be placed: 'start', 'via', or 'end' */
    const [markerType, setMarkerType] = useState('start');

    /** List of all markers placed on the map */
    const [markers, setMarkers] = useState([]);

    /** Polyline coordinates representing the calculated route */
    const [polylineCoords, setPolylineCoords] = useState([]);

    /** Controls visibility of the "add current position" popup */
    const [popupOpen, setPopupOpen] = useState(false);

    /** Currently selected marker for which information is shown */
    const [selectedInfoMarker, setSelectedInfoMarker] = useState(null);

    /** Additional route/location information fetched from external API */
    const [routeInfo, setRouteInfo] = useState(null);

    /** Loading state for route/location information */
    const [loadingInfo, setLoadingInfo] = useState(false);

    /** Attraction currently highlighted on the map */
    const [highlightAttraction, setHighlightAttraction] = useState(null);


    /**
     * Enables marker placement mode and sets the marker type.
     * @param {'start'|'via'|'end'} type
     */
    function toggleSetMarkerMode(type) {
        setMarkerType(type);
        setIsSetMarkerMode(true);
    }

    /**
     * Deletes a marker by its internal id (array index).
     * Also clears the selected marker if it was deleted.
     * @param {number} id
     */
    function deleteMarkerById(id) {
        setMarkers(prev => prev.filter((_, index) => index !== id));

        // If the deleted marker was currently selected, clear selection
        if (selectedInfoMarker?.id === id) {
            setSelectedInfoMarker(null);
        }
    }

    /**
     * Adds a new marker to the state.
     * Ensures only one start and one end marker exist.
     * @param {{lat:number, lng:number, type:string}} newMarker
     */
    function handleMarkerAdd(newMarker) {
        if (newMarker.type === 'start') {
            setMarkers(prev => [...prev.filter(m => m.type !== 'start'), newMarker]);
        } else if (newMarker.type === 'end') {
            setMarkers(prev => [...prev.filter(m => m.type !== 'end'), newMarker]);
        } else {
            setMarkers(prev => [...prev, newMarker]);
        }
        setIsSetMarkerMode(false);
    }

    /**
     * Markers converted for display purposes:
     * - Adds German labels
     * - Adds a stable id based on array index
     */
    const modifiedMarkers = useMemo(() =>
            markers.map((m, idx) => {
                if (m.type === 'start') return { ...m, convertedType: 'Startpunkt', id: idx };
                if (m.type === 'via') return { ...m, convertedType: 'Zwischenstopp', id: idx };
                if (m.type === 'end') return { ...m, convertedType: 'Zielpunkt', id: idx };
                return m;
            }),
        [markers]
    );

    // Sort markers: start -> via -> end
    modifiedMarkers.sort((a, b) => {
        const order = { start: 0, via: 1, end: 2 };
        return order[a.type] - order[b.type];
    });

    /**
     * Automatically select the first marker if none is selected.
     */
    useEffect(() => {
        if (!selectedInfoMarker && modifiedMarkers.length > 0) {
            setSelectedInfoMarker(modifiedMarkers[0]);
        }
    }, [modifiedMarkers]);

    /**
     * Deletes all markers and resets route and selection.
     */
    function deleteMarkers() {
        setMarkers([]);
        setPolylineCoords([]);
        setSelectedInfoMarker(null);
    }

    /**
     * Adds the user's current geolocation as a marker.
     * @param {'start'|'via'|'end'} type
     */
    async function handleAddCurrentPosition(type) {
        setPopupOpen(false);
        if (!navigator.geolocation) {
            alert('Geolocation wird nicht unterstützt');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const newMarker = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    type
                };
                handleMarkerAdd(newMarker);
            },
            () => {
                alert('Standort konnte nicht ermittelt werden');
            }
        );
    }

    /**
     * Calculates the route using the OSRM public API whenever markers change.
     */
    useEffect(() => {
        async function fetchRoute() {
            const start = markers.find(m => m.type === 'start');
            const end = markers.find(m => m.type === 'end');
            const vias = markers.filter(m => m.type === 'via');

            if (!start || !end) {
                setPolylineCoords([]);
                return;
            }

            const coordsList = [start, ...vias, end];
            const coordsStr = coordsList.map(m => `${m.lng},${m.lat}`).join(';');
            const url = `https://router.project-osrm.org/route/v1/driving/${coordsStr}?overview=full&geometries=geojson`;

            try {
                const res = await fetch(url);
                const data = await res.json();
                if (data.code === 'Ok' && data.routes.length > 0) {
                    const route = data.routes[0].geometry.coordinates
                        .map(([lng, lat]) => [lat, lng]);
                    setPolylineCoords(route);
                } else {
                    setPolylineCoords([]);
                }
            } catch (err) {
                console.error('Routing-Fehler:', err);
                setPolylineCoords([]);
            }
        }

        fetchRoute();
    }, [markers]);

    /**
     * Fetches additional information for the selected marker.
     */
    useEffect(() => {
        if (!selectedInfoMarker) {
            setRouteInfo(null);
            return;
        }

        (async () => {
            setLoadingInfo(true);
            try {
                const info = await getRouteInfo(selectedInfoMarker.lat, selectedInfoMarker.lng);
                setRouteInfo(info);
            } catch (e) {
                console.error('getRouteInfo failed:', e);
                setRouteInfo(null);
            } finally {
                setLoadingInfo(false);
            }
        })();
    }, [selectedInfoMarker]);

    /**
     * Clears highlighted attraction when marker selection changes.
     */
    useEffect(() => {
        setHighlightAttraction(null);
    }, [selectedInfoMarker]);

    return (
        <Page name="home">
            <Navbar style={{backgroundColor: '#eef', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'}}>
                <NavTitle style={{display: 'flex', height: '2em', alignItems: 'center'}}>Web Engineering II</NavTitle>
            </Navbar>
            <Block>
                <div className="grid grid-cols-2 medium-grid-cols-4 grid-gap">
                    <Button fill onClick={() => toggleSetMarkerMode('start')} disabled={isSetMarkerMode || markers.filter(m => m.type === 'start').length > 0}>Start setzen</Button>
                    <Button fill onClick={() => toggleSetMarkerMode('via')} disabled={isSetMarkerMode}>Zwischenstopp setzen</Button>
                    <Button fill onClick={() => toggleSetMarkerMode('end')} disabled={isSetMarkerMode || markers.filter(m => m.type === 'end').length > 0}>Ziel setzen</Button>
                    <Button fill onClick={() => setPopupOpen(true)} disabled={isSetMarkerMode}>Eigene Position setzen</Button>
                    {markers.length > 0 && <Button fill onClick={() => deleteMarkers()} color='red' disabled={isSetMarkerMode}>Alle Marker löschen</Button>}
                    {isSetMarkerMode && <Button fill color="red" onClick={() => setIsSetMarkerMode(false)}>Abbrechen</Button>}
                </div>
            </Block>


            <Card style={{boxShadow: '1px 1px 10px rgba(0, 0, 0, 0.2)', marginBottom: '10px'}}>
                {modifiedMarkers.length > 0 &&
                    <List accordionList accordionOpposite>
                        <ListItem accordionItem title="Marker">
                            <AccordionContent>
                                <List>
                                    {modifiedMarkers.map((m) => (
                                        <ListItem
                                            key={m.id}
                                            title={`${m.convertedType}: (${m.lat.toFixed(5)}, ${m.lng.toFixed(5)})`}
                                        >
                                            <Button
                                                slot="after"
                                                small
                                                fill
                                                color="red"
                                                onClick={(e) => {
                                                    e.stopPropagation(); // verhindert Accordion-Toggle
                                                    deleteMarkerById(m.id);
                                                }}
                                            >
                                                Löschen
                                            </Button>
                                        </ListItem>
                                    ))}
                                </List>
                            </AccordionContent>
                        </ListItem>
                    </List>}
            </Card>


            <Block>
                <MapView
                    markers={markers}
                    polylineCoords={polylineCoords}
                    isSetMarkerMode={isSetMarkerMode}
                    markerType={markerType}
                    onMarkerAdd={handleMarkerAdd}
                    nearbyAttractions={routeInfo?.nearbyAttractions ?? []}
                    highlightAttraction={highlightAttraction}
                />
            </Block>

            <List>
                {modifiedMarkers.length > 0 ?
                    <ListInput label="Ausgewählter Ort" type="select" name="selectedMarker" placeholder="Auswahl" onChange={(e) => {
                        const selectedId = e.target.value;
                        const marker = modifiedMarkers.find(m => m.id.toString() === selectedId);
                        setSelectedInfoMarker(marker);
                    }}>
                        {modifiedMarkers.map((m) => (
                            <option key={m.id} value={m.id}>
                                {`${m.convertedType}: (${m.lat.toFixed(5)}, ${m.lng.toFixed(5)})`}
                            </option>))}
                    </ListInput>
                    :
                    <Block>(Keine Marker gesetzt)</Block>
                }
            </List>

            {selectedInfoMarker && routeInfo &&
                <Card style={{boxShadow: '1px 1px 10px rgba(0, 0, 0, 0.2)'}}>
                    <CardHeader>
                        {routeInfo.streetName}
                    </CardHeader>
                    <CardContent>
                        {routeInfo.description}
                    </CardContent>
                </Card>}

            {selectedInfoMarker && routeInfo &&
                <Card style={{boxShadow: '1px 1px 10px rgba(0, 0, 0, 0.2)'}}>
                    <CardHeader>
                        In der Nähe
                    </CardHeader>
                    <CardContent>
                        <List>
                            {selectedInfoMarker && routeInfo.nearbyAttractions.length > 0 ? routeInfo.nearbyAttractions.map((attraction, index) => (
                                <ListItem accordionItem title={attraction.title} key={attraction.pageid ?? index} onClick={() => {setHighlightAttraction(attraction)}}>
                                    <AccordionContent>
                                        <Block>{attraction.extract}</Block>
                                    </AccordionContent>
                                </ListItem>
                            )) : <ListItem>Keine Attraktionen in der Nähe gefunden.</ListItem>}
                        </List>
                    </CardContent>
                </Card>}


            {popupOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }} onClick={() => setPopupOpen(false)}>
                    <div style={{
                        backgroundColor: 'white',
                        maxWidth: '400px',
                        width: '60%',
                        borderRadius: '16px',
                        padding: '20px',
                        boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)'
                    }} onClick={(e) => e.stopPropagation()}>
                        <h3 style={{marginTop: 0, marginBottom: 20, textAlign: 'center', fontSize: '18px', fontWeight: '600'}}>Eigene Position hinzufügen</h3>
                        <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                            <Button fill onClick={() => handleAddCurrentPosition('start')} style={{marginBottom: '5px'}}>Als Start</Button>
                            <Button fill onClick={() => handleAddCurrentPosition('via')} style={{marginBottom: '5px'}}>Als Zwischenstopp</Button>
                            <Button fill onClick={() => handleAddCurrentPosition('end')} style={{marginBottom: '10px'}}>Als Ziel</Button>
                            <Button onClick={() => setPopupOpen(false)}>Abbrechen</Button>
                        </div>
                    </div>
                </div>
            )}

            <Toolbar bottom>

                <Link href="/about" animate={false} ignoreCache={true}>Über uns</Link>
                <Link href="/impressum" animate={false} ignoreCache={true}>Impressum</Link>
                <Link href="/agb" animate={false} ignoreCache={true}>AGB & Datenschutzerklärung</Link>
            </Toolbar>
        </Page>
    );
}
