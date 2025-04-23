"use client";

import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import { useState, useRef } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { motion } from "framer-motion";
import { FaMapMarkerAlt } from "react-icons/fa";
import ReactDOMServer from "react-dom/server";
import { toast } from "react-toastify";

const customMarkerIcon = new L.DivIcon({
    html: ReactDOMServer.renderToString(
        <FaMapMarkerAlt className="text-red-500 text-3xl animate-bounce" />
    ),
    className: "custom-marker-icon",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
});

interface MapPickerProps {
    onLocationSelect: (lat: number, lng: number, place: string) => void;
}

export default function MapPicker({ onLocationSelect }: MapPickerProps) {
    const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
    const [search, setSearch] = useState<string>("");
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const mapRef = useRef<any>(null);

    async function fetchPlaceName(lat: number, lng: number) {
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const data = await res.json();
            const displayName = data.display_name || `Unnamed Location (Lat: ${lat}, Lng: ${lng})`;
            return displayName;
        } catch (error) {
            console.error("Reverse Geocoding Error:", error);
            return `Unnamed Location (Lat: ${lat}, Lng: ${lng})`;
        }
    }

    async function handleLocationSelect(lat: number, lng: number) {
        const place = await fetchPlaceName(lat, lng);
        setPosition({ lat, lng });
        onLocationSelect(lat, lng, place); // Pass place name along with coordinates
    }

    function LocationMarker() {
        const map = useMap(); // Get map instance from hook

        mapRef.current = map; // Store map instance in ref

        useMapEvents({
            async click(e) {
                const place = await fetchPlaceName(e.latlng.lat, e.latlng.lng);
                setPosition(e.latlng);
                onLocationSelect(e.latlng.lat, e.latlng.lng, place);
                map.flyTo(e.latlng, map.getZoom());
            },
        });

        return position ? <Marker position={position} icon={customMarkerIcon} /> : null;
    }

    async function handleSearch() {
        if (!search) {
            toast.error("Please enter a location.");
            return;
        }

        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${search}`);
            const data = await res.json();

            if (data.length > 0) {
                setSuggestions(data);
            } else {
                toast.error("Location not found!");
            }
        } catch (error) {
            console.error("Search Error:", error);
            toast.error("Something went wrong!");
        }
    }

    function selectLocation(lat: number, lng: number, name: string) {
        const latLng = { lat, lng };
        setPosition(latLng);
        onLocationSelect(lat, lng, name);
        setSuggestions([]);
        setSearch("");

        if (mapRef.current) {
            const currentCenter = mapRef.current.getCenter();
            if (currentCenter.lat !== lat || currentCenter.lng !== lng) {
                mapRef.current.flyTo(latLng, 11);
            }
        }
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
            <div className="mb-2 flex flex-col gap-2">
                <div className="flex items-center flex-col gap-2 lg:flex-row lg:gap-0">
                    <input
                        type="text"
                        placeholder="Search Location"
                        className="w-full px-4 py-2 text-black border rounded-md outline-none shadow-sm focus:ring focus:ring-blue-400"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                handleSearch();
                            }
                        }}
                    />
                    <button
                        className="bg-blue-500 text-white px-4 py-2 w-full rounded-md ml-0 lg:ml-2 lg:w-auto"
                        type="button"
                        onClick={handleSearch}
                    >
                        Search
                    </button>
                </div>

                {suggestions.length > 0 && (
                    <div className="bg-white shadow-lg border rounded-md max-h-48 overflow-y-auto">
                        {suggestions.map((suggestion, index) => (
                            <div
                                key={index}
                                className="p-2 cursor-pointer hover:bg-blue-800 text-black hover:text-white"
                                onClick={() =>
                                    selectLocation(parseFloat(suggestion.lat), parseFloat(suggestion.lon), suggestion?.display_name)
                                }
                            >
                                {suggestion.display_name}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="rounded-lg overflow-hidden">
                <MapContainer
                    center={[25.286135350000002, 87.13042293057262]}
                    zoom={11}
                    className="w-full h-[400px]"
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <LocationMarker />
                </MapContainer>
            </div>
        </motion.div>
    );
}
