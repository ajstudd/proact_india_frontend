import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { FaMapMarkerAlt } from "react-icons/fa";
import ReactDOMServer from 'react-dom/server';

// Dynamically import MapContainer with SSR disabled
const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(mod => mod.Popup), { ssr: false });

interface MapModalProps {
    isOpen: boolean;
    onClose: () => void;
    location: { lat: number; lng: number; place: string };
}

export const MapModal: React.FC<MapModalProps> = ({ isOpen, onClose, location }) => {
    // If the modal isn't open, don't render anything
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.9 }}
                        className="bg-white rounded-lg p-4 w-full max-w-4xl max-h-[90vh] relative"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold">Project Location</h3>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <FiX />
                            </button>
                        </div>

                        <div className="h-[60vh] rounded-lg overflow-hidden">
                            <MapContainerWithMarker location={location} />
                        </div>

                        <div className="mt-4 text-center text-gray-600">
                            {location.place}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// Create a separate component for the map to ensure Leaflet code runs only on client side
const MapContainerWithMarker = ({ location }: { location: { lat: number; lng: number; place: string } }) => {
    // Custom icon will be created only on client side within this component
    const customIcon = useMemo(() => {
        // Import Leaflet dynamically to avoid server-side rendering issues
        const L = require('leaflet');

        return new L.DivIcon({
            html: ReactDOMServer.renderToString(
                <FaMapMarkerAlt className="text-red-500 text-3xl animate-bounce" />
            ),
            className: "custom-marker-icon",
            iconSize: [30, 30],
            iconAnchor: [15, 30],
        });
    }, []);

    return (
        <MapContainer
            center={[location.lat, location.lng]}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[location.lat, location.lng]} icon={customIcon}>
                <Popup>
                    {location.place}
                </Popup>
            </Marker>
        </MapContainer>
    );
};

export default MapModal;
