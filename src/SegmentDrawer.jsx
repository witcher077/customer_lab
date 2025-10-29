import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SchemaDropdown from "./Components/Dropdown";
import { schemaOptions } from "./dropdownValues";
import axios from 'axios';


export default function SegmentDrawer() {
    const [isOpen, setIsOpen] = useState(false);
    const [segmentName, setSegmentName] = useState('');
    const [schemaOption, setSchemaOption] = useState(schemaOptions);

    const [selectedSchema, setSelectedSchema] = useState();
    const [AllselectedSchema, setALLSelectedSchema] = useState([]);

    const HandleSeleteSchema = (option) => {
        setSelectedSchema(option);
    };

    const saveSegment = () => {
        if (segmentName) {
            if (AllselectedSchema.length > 0) {
                const data = {
                    "segment_name": segmentName,
                    "schema": AllselectedSchema
                }

                axios.post("https://webhook.site/3c7b87ef-95f0-4006-961d-af70a9703178", data)
                    .then(res => console.log("Sent successfully", res))
                    .catch(err => console.error(err));

            } else alert("Please select atlest one Schema")
        }
        else alert("Enter the segment Name")
    };


    const HandleSelectedSchema = (option, prev) => {
        const prevSelected = AllselectedSchema.filter((ele) => ele.label === prev);
        const newSelected = AllselectedSchema.filter((ele) => ele.label !== prev);
        const newSchemaOptions = schemaOption.filter(
            (ele) => ele.label !== option.label
        );

        setALLSelectedSchema([...newSelected, option]);
        setSchemaOption([...newSchemaOptions, ...prevSelected]);
        setSelectedSchema(null);
    };

    const HandleAddNewSegment = () => {
        if (selectedSchema) {
            const updatedSelected = [
                ...AllselectedSchema,
                selectedSchema,
            ].filter(
                (value, index, self) =>
                    index === self.findIndex((t) => t.label === value.label)
            );

            const updatedSchemaOptions = schemaOption.filter(
                (ele) => !updatedSelected.some((selected) => selected.label === ele.label)
            );

            setALLSelectedSchema(updatedSelected);
            setSchemaOption(updatedSchemaOptions);
            setSelectedSchema(null);
        }
    };

    //  Remove dropdown entirely when "-" is clicked
    const HandleRemoveDropdown = (removedItem) => {
        if (!removedItem) return;
        setALLSelectedSchema((prev) =>
            prev.filter((ele) => ele.label !== removedItem.label)
        );
        setSchemaOption((prev) => [...prev, removedItem]); // add back to available list
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-gray-100">
            {/* Button to open drawer */}
            <button
                onClick={() => setIsOpen(true)}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg shadow hover:bg-teal-700"
            >
                Save Segment
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                        />

                        <motion.div
                            className="fixed right-0 top-0 h-full w-full sm:w-[500px] bg-white shadow-xl flex flex-col"
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        >
                            <div className="min-h-screen flex flex-col bg-white overflow-y-scroll">
                                {/* Header */}
                                <div className="flex items-center justify-between px-4 py-3 border-b bg-teal-600 text-white">
                                    <h2 className="text-lg font-semibold">Saving Segment</h2>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="text-white hover:text-gray-200 text-xl font-bold"
                                    >
                                        ×
                                    </button>
                                </div>

                                {/* Content */}
                                <main className="flex-1 p-6">
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">
                                            Enter the Name of the Segment
                                        </label>
                                        <input onChange={(e) => setSegmentName(e.target.value)}
                                            value={segmentName}
                                            type="text"
                                            placeholder="Name of the segment"
                                            className="w-full border rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        />
                                        <p className="text-gray-600 text-sm">
                                            To save your segment, you need to add the schemas to build
                                            the query.
                                        </p>
                                        <div className="mt-4 flex items-center gap-4 text-sm">
                                            <div className="flex items-center gap-1">
                                                <span className="w-3 h-3 rounded-full bg-green-500" />
                                                User Traits
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <span className="w-3 h-3 rounded-full bg-pink-500" />
                                                Group Traits
                                            </div>
                                        </div>

                                        {/* Dropdown section */}
                                        {AllselectedSchema.length > 0 && (
                                            <div className="my-8 border-2 px-2 border-blue-600 rounded-md">
                                                {AllselectedSchema.map((ele) => (
                                                    <SchemaDropdown
                                                        key={ele.label}
                                                        options={schemaOption}
                                                        onSelect={HandleSelectedSchema}
                                                        selectedoption={ele}
                                                        remove={HandleRemoveDropdown}
                                                    />
                                                ))}
                                            </div>
                                        )}

                                        <div className="px-2">
                                            <SchemaDropdown
                                                options={schemaOption}
                                                onSelect={HandleSeleteSchema}
                                                selectedoption={selectedSchema}
                                            />
                                        </div>

                                        <button
                                            onClick={HandleAddNewSegment}
                                            className="text-teal-600 font-medium text-sm hover:underline focus:outline-none"
                                        >
                                            + Add new schema
                                        </button>
                                    </div>
                                </main>

                                {/* Footer */}
                                <footer className="w-full flex justify-start items-center gap-3 bg-gray-50 p-4 rounded-b-lg border-t border-gray-200">
                                    <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2 rounded transition-colors duration-200" onClick={saveSegment}>
                                        Save the Segment
                                    </button>
                                    <button className="bg-white text-pink-600 border border-gray-200 hover:bg-gray-100 font-medium px-4 py-2 rounded transition-colors duration-200">
                                        Cancel
                                    </button>
                                </footer>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
