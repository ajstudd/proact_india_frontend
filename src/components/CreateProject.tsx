"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dynamic from "next/dynamic";
import { useCreateProjectMutation, useUploadFileMutation } from "@services"; // RTK API hooks for project and file upload
import { useSearchContractorsQuery } from "@services"; // Import the contractor search hook
const MapPicker = dynamic(() => import("./MapPicker"), { ssr: false });

interface CreateProjectFormProps {
    onSuccess?: () => void;
}

interface Contractor {
    _id: string;
    name: string;
    email?: string;
    phone?: string;
    photo?: string;
    contractorLicense?: string;
}

export default function CreateProjectForm({ onSuccess }: CreateProjectFormProps) {
    const router = useRouter();
    const [createProject] = useCreateProjectMutation();
    const [uploadFile] = useUploadFileMutation();

    const [title, setTitle] = useState("");
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [bannerUrl, setBannerUrl] = useState("");
    const [associatedProfiles, setAssociatedProfiles] = useState<Array<{ name: string; role: string }>>([]);
    const [descriptionText, setDescriptionText] = useState("");
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [pdfUrl, setPdfUrl] = useState("");
    const [location, setLocation] = useState<{ lat: number; lng: number; place: string } | null>(null);
    const [budget, setBudget] = useState<number>(0);

    // Contractor search related state
    const [contractorSearchQuery, setContractorSearchQuery] = useState("");
    const [contractor, setContractor] = useState("");
    const [selectedContractor, setSelectedContractor] = useState<Contractor | null>(null);
    const [showContractorDropdown, setShowContractorDropdown] = useState(false);

    // Use the search contractors query
    const { data: contractorSearchResults, isLoading: isSearchingContractors } = useSearchContractorsQuery(
        { query: contractorSearchQuery },
        { skip: contractorSearchQuery.length < 2 } // Only search when input has at least 2 characters
    );

    // Clear the dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Don't close if clicking on the dropdown items
            const dropdownElement = document.getElementById('contractor-dropdown');
            const inputElement = document.getElementById('contractor-search');

            if (
                dropdownElement &&
                !dropdownElement.contains(event.target as Node) &&
                inputElement &&
                !inputElement.contains(event.target as Node)
            ) {
                setShowContractorDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside as EventListener);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside as EventListener);
        };
    }, []);

    const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setBannerFile(e.target.files[0]);
            const previewUrl = URL.createObjectURL(e.target.files[0]);
            setBannerUrl(previewUrl);
        }
    };

    const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPdfFile(e.target.files[0]);
        }
    };

    const handleContractorSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setContractorSearchQuery(query);
        setShowContractorDropdown(query.length >= 2);

        // If input is cleared, also clear selected contractor
        if (!query) {
            setSelectedContractor(null);
            setContractor("");
        }
    };

    const selectContractor = (selectedUser: Contractor, e?: React.MouseEvent) => {
        // Prevent event propagation
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }

        setSelectedContractor(selectedUser);
        setContractor(selectedUser._id);
        setContractorSearchQuery(selectedUser.name);
        setShowContractorDropdown(false);
    };

    const handleProjectSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", descriptionText);
            formData.append("budget", budget.toString());
            formData.append("contractor", contractor);
            // formData.append("government", government);

            if (location) {
                formData.append("location[lat]", location.lat.toString());
                formData.append("location[lng]", location.lng.toString());
                formData.append("location[place]", location.place);
            }

            if (bannerFile) {
                formData.append("banner", bannerFile);
            }

            if (pdfFile) {
                formData.append("pdf", pdfFile);
            }

            await createProject(formData).unwrap();
            toast.success("Project created successfully!");

            // Call the onSuccess callback if provided
            if (onSuccess) {
                onSuccess();
            } else {
                router.push("/home");
            }

            // Reset form
            setTitle("");
            setBannerFile(null);
            setBannerUrl("");
            setAssociatedProfiles([]);
            setDescriptionText("");
            setPdfFile(null);
            setPdfUrl("");
            setLocation(null);
            setBudget(0);
            setContractor("");
            setContractorSearchQuery("");
            setSelectedContractor(null);
            // setGovernment("");

        } catch (error: any) {
            toast.error(error.data?.message || "Failed to create project");
        }
    };

    return (
        <motion.div
            className="min-h-screen bg-gray-900 rounded-lg text-white p-6 flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <h1 className="text-3xl font-bold mb-6">Create New Project</h1>
            <form className="w-full max-w-2xl space-y-6" onSubmit={handleProjectSubmit}>
                <div className="flex flex-col">
                    <label className="mb-2 font-semibold">Project Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter project title"
                        className="w-full p-2 text-black rounded-md"
                        required
                    />
                </div>

                <div className="flex flex-col">
                    <label className="mb-2 font-semibold">Banner Image</label>
                    <input type="file" accept="image/*" onChange={handleBannerChange} className="text-white" />
                    {bannerUrl && <img src={bannerUrl} alt="Banner Preview" className="mt-4 rounded-md shadow-md" />}
                </div>

                <div>
                    <label className="block mb-2 font-semibold">Project Description</label>
                    <textarea
                        placeholder="Enter project description"
                        className="w-full p-2 text-black rounded-md"
                        value={descriptionText}
                        onChange={(e) => setDescriptionText(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block mb-2 font-semibold">Upload PDF</label>
                    <input type="file" accept="application/pdf" onChange={handlePdfChange} className="text-white" />
                </div>

                <div className="flex flex-col">
                    <label className="mb-2 font-semibold">Budget</label>
                    <input
                        type="number"
                        value={budget}
                        onChange={(e) => setBudget(Number(e.target.value))}
                        placeholder="Enter project budget"
                        className="w-full p-2 text-black rounded-md"
                        required
                    />
                </div>

                <div className="flex flex-col">
                    <label className="mb-2 font-semibold">Contractor</label>
                    <div className="relative">
                        <input
                            id="contractor-search"
                            type="text"
                            value={contractorSearchQuery}
                            onChange={handleContractorSearch}
                            placeholder="Search for a contractor by name or ID"
                            className="w-full p-2 text-black rounded-md"
                            autoComplete="off"
                            onClick={() => {
                                if (contractorSearchQuery.length >= 2) {
                                    setShowContractorDropdown(true);
                                }
                            }}
                            disabled={!!selectedContractor}
                        />

                        {showContractorDropdown && contractorSearchResults && (
                            <div
                                id="contractor-dropdown"
                                className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
                            >
                                {isSearchingContractors && (
                                    <div className="p-2 text-gray-500">Searching...</div>
                                )}

                                {!isSearchingContractors && contractorSearchResults.users?.length === 0 && (
                                    <div className="p-2 text-gray-500">No contractors found</div>
                                )}

                                {contractorSearchResults?.users?.map((user) => (
                                    <div
                                        key={user._id}
                                        className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
                                        onClick={(e) => selectContractor(user, e)}
                                    >
                                        {user.photo && (
                                            <img
                                                src={user.photo}
                                                alt={user.name}
                                                className="w-8 h-8 rounded-full mr-2"
                                            />
                                        )}
                                        <div>
                                            <div className="font-medium text-black">{user.name}</div>
                                            <div className="text-xs text-gray-500">
                                                {user.email || user.phone || user.contractorLicense}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {selectedContractor && (
                        <div className="mt-2 p-3 bg-blue-900 rounded-md flex items-center">
                            {selectedContractor.photo && (
                                <img
                                    src={selectedContractor.photo}
                                    alt={selectedContractor.name}
                                    className="w-10 h-10 rounded-full mr-3"
                                />
                            )}
                            <div className="flex-1">
                                <div className="font-medium text-lg">{selectedContractor.name}</div>
                                <div className="text-sm text-gray-300">
                                    {selectedContractor.email && <div>{selectedContractor.email}</div>}
                                    {selectedContractor.phone && <div>{selectedContractor.phone}</div>}
                                    {selectedContractor.contractorLicense && <div>License: {selectedContractor.contractorLicense}</div>}
                                </div>
                            </div>
                            <button
                                type="button"
                                className="ml-2 bg-red-800 hover:bg-red-700 text-white p-1.5 rounded-full transition-colors"
                                onClick={() => {
                                    setSelectedContractor(null);
                                    setContractor("");
                                    setContractorSearchQuery("");
                                }}
                                title="Remove contractor"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>

                <div>
                    <label className="block mb-2 font-semibold">Project Location</label>
                    <div className="w-full rounded-md flex flex-col items-center justify-center">
                        <MapPicker onLocationSelect={(lat, lng, place) => setLocation({ lat, lng, place })} />
                        {location?.place && (
                            <div className="text-sm text-gray-400 mt-2 animate-fade-in">
                                Selected Location: {location.place}
                            </div>
                        )}
                        {location && !location.place && (
                            <input
                                type="text"
                                placeholder="Enter location name"
                                className="w-full p-2 mt-2 text-black rounded-md"
                                onChange={(e) => setLocation({ ...location, place: e.target.value })}
                            />
                        )}
                    </div>
                </div>

                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg transition-all">
                    Create Project
                </button>
            </form>
        </motion.div>
    );
}
