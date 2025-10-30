import React, { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SchemaDropdown from "./Components/Dropdown";
import { schemaOptions } from "./dropdownValues";
import axios from "axios";

export default function SegmentDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [segmentName, setSegmentName] = useState("");
  const [schemaOption, setSchemaOption] = useState(schemaOptions);

  const [selectedSchema, setSelectedSchema] = useState();
  const [AllselectedSchema, setALLSelectedSchema] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  //  available options filter
  const availableOptions = useMemo(() => {
    return schemaOption.filter(
      (opt) => !AllselectedSchema.some((sel) => sel.label === opt.label)
    );
  }, [schemaOption, AllselectedSchema]);

  //  Add new schema handler
  const HandleAddNewSegment = useCallback(() => {
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
  }, [selectedSchema, AllselectedSchema, schemaOption]);

  //  Handle schema selection change
  const HandleSelectedSchema = useCallback(
    (option, prev) => {
      const prevSelected = AllselectedSchema.filter(
        (ele) => ele.label === prev
      );
      const newSelected = AllselectedSchema.filter(
        (ele) => ele.label !== prev
      );
      const newSchemaOptions = schemaOption.filter(
        (ele) => ele.label !== option.label
      );

      setALLSelectedSchema([...newSelected, option]);
      setSchemaOption([...newSchemaOptions, ...prevSelected]);
      setSelectedSchema(null);
    },
    [AllselectedSchema, schemaOption]
  );

  // Handle schema remove -------
  const HandleRemoveDropdown = useCallback((removedItem) => {
    if (!removedItem) return;
    setALLSelectedSchema((prev) =>
      prev.filter((ele) => ele.label !== removedItem.label)
    );
    setSchemaOption((prev) => [...prev, removedItem]);
  }, []);

  // Reset form ----------------
  const resetForm = useCallback(() => {
    setIsOpen(false);
    setSelectedSchema(null);
    setALLSelectedSchema([]);
    setSegmentName("");
  }, []);

  // Save segment to API ----------------
  const saveSegment =() => {
    if (!segmentName) return alert("Enter the segment name");
    if (AllselectedSchema.length === 0)
      return alert("Please select at least one schema");

    setIsSaving(true);
    axios
      .post(
        "https://webhook.site/3c7b87ef-95f0-4006-961d-af70a9703178",
        {
          segment_name: segmentName,
          schema: AllselectedSchema,
        }
      )
      .then((res) => {
        console.log("Sent successfully", res);
        alert("Segment saved successfully!");
        resetForm();
      })
      .catch((err) => console.error(err))
      .finally(() => setIsSaving(false));
  }

  return (
    <div className="relative min-h-screen items-center justify-center bg-gray-100">
      {/* Header */}
      <div className="w-full items-center justify-between px-4 py-3 border-b bg-teal-600 text-white">
        <h2 className="text-lg font-semibold">≺ View Audience</h2>
      </div>

      {/* Open Drawer Button */}
      <div className="m-20">
        <button
          onClick={() => setIsOpen(true)}
          className="px-6 py-2 border cursor-pointer border-white text-white bg-gray-500 hover:bg-gray-600 transition rounded"
        >
          Save Segment
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={resetForm}
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
                  <h2 className="text-lg font-semibold">≺ Saving Segment</h2>
                </div>

                {/* Content */}
                <main className="flex-1 p-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Enter the Name of the Segment
                    </label>
                    <input
                      onChange={(e) => setSegmentName(e.target.value)}
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

                    {/* Selected Schemas */}
                    {AllselectedSchema.length > 0 && (
                      <div className="my-8 border-2 px-2 border-blue-600 rounded-md">
                        {AllselectedSchema.map((ele) => (
                          <SchemaDropdown
                            key={ele.label}
                            options={availableOptions}
                            onSelect={HandleSelectedSchema}
                            selectedoption={ele}
                            remove={HandleRemoveDropdown}
                          />
                        ))}
                      </div>
                    )}

                    {/* New Schema Dropdown */}
                    <div className="px-2">
                      <SchemaDropdown
                        options={availableOptions}
                        onSelect={setSelectedSchema}
                        selectedoption={selectedSchema}
                      />
                    </div>

                    <button
                      onClick={HandleAddNewSegment}
                      className="text-teal-600 font-medium text-sm hover:underline focus:outline-none cursor-pointer"
                    >
                      + Add new schema
                    </button>
                  </div>
                </main>

                {/* Footer */}
                <footer className="w-full flex justify-start items-center gap-3 bg-gray-50 p-4 rounded-b-lg border-t border-gray-200">
                  <button
                    onClick={saveSegment}
                    disabled={isSaving || !segmentName || AllselectedSchema.length === 0}
                    className={`px-4 py-2 rounded font-medium transition-colors duration-200 ${
                      isSaving || !segmentName || AllselectedSchema.length === 0
                        ? "bg-emerald-400 cursor-not-allowed opacity-70 text-white"
                        : "bg-emerald-600 hover:bg-emerald-700 text-white"
                    }`}
                  >
                    {isSaving ? "Saving..." : "Save the Segment"}
                  </button>
                  <button
                    onClick={resetForm}
                    className="bg-white cursor-pointer text-pink-600 border border-gray-200 hover:bg-gray-100 font-medium px-4 py-2 rounded transition-colors duration-200"
                  >
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
