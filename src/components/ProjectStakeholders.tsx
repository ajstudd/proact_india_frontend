import React from "react";
import { FiUser, FiUsers, FiCheck } from "react-icons/fi";
import { MdAccountBalance } from "react-icons/md";

interface StakeholderInfo {
    _id: string;
    name: string;
    id: string;
}

interface ProjectStakeholdersProps {
    contractor: StakeholderInfo;
    government: StakeholderInfo;
}

const ProjectStakeholders: React.FC<ProjectStakeholdersProps> = ({
    contractor,
    government,
}) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">Project Stakeholders</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contractor Information */}
                <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                        <div className="p-3 bg-amber-100 rounded-full mr-3">
                            <FiUsers className="text-amber-600 text-xl" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-800">Contractor</h4>
                            <p className="text-gray-600 text-sm">Project Implementation</p>
                        </div>
                    </div>
                    <div className="ml-2">
                        <p className="text-gray-800 font-medium">{contractor.name}</p>
                        <p className="text-gray-500 text-sm mt-1">ID: {contractor.id.substring(0, 8)}...</p>
                        <div className="mt-2 flex items-center text-xs text-green-600">
                            <FiCheck className="mr-1" /> Verified Contractor
                        </div>
                    </div>
                </div>

                {/* Government Authority Information */}
                <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                        <div className="p-3 bg-blue-100 rounded-full mr-3">
                            <MdAccountBalance className="text-blue-600 text-xl" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-800">Government Authority</h4>
                            <p className="text-gray-600 text-sm">Project Oversight</p>
                        </div>
                    </div>
                    <div className="ml-2">
                        <p className="text-gray-800 font-medium">{government.name}</p>
                        <p className="text-gray-500 text-sm mt-1">ID: {government.id.substring(0, 8)}...</p>
                        <div className="mt-2 flex items-center text-xs text-blue-600">
                            <FiCheck className="mr-1" /> Verified Authority
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectStakeholders;
