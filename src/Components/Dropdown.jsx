import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SchemaDropdown({
  options = [],
  placeholder = "Add schema to segment",
  onSelect,
  selectedoption = null,
  remove = () => {},
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(selectedoption);
  const dropdownRef = useRef(null);

  // Sync with external selectedoption
  useEffect(() => {
    setSelected(selectedoption);
  }, [selectedoption]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option, prev) => {
    setSelected(option);
    setIsOpen(false);
    if (onSelect) onSelect(option, prev);
  };

  const handleRemove = () => {
    // Call parent remove to delete the entire dropdown
    remove(selected);
  };

  return (
    <div
      className="my-3 flex items-center relative w-full max-w-sm"
      ref={dropdownRef}
    >
      {selected?.type === "Group Traits" ? (
        <span
          className="w-3 h-3 rounded-full mr-2"
          style={{ backgroundColor: "red" }}
        ></span>
      ) : selected?.type === "User Traits" ? (
        <span
          className="w-3 h-3 rounded-full mr-2"
          style={{ backgroundColor: "green" }}
        ></span>
      ) : (
        <span
          className="w-3 h-3 rounded-full mr-2"
          style={{ backgroundColor: "gray" }}
        ></span>
      )}

    
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 flex justify-between items-center hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-teal-500"
      >
        <span
          className={`${
            selected?.label ? "text-gray-800" : "text-gray-500"
          } truncate`}
        >
          {selected?.label || placeholder}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Remove Button */}
      <button
        onClick={handleRemove}
        className="ml-2 text-gray-600 hover:text-red-500 font-bold px-2 py-1 bg-gray-100 rounded-md"
      >
        –
      </button>

      {/* Dropdown List */}
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10"
          >
            {options.length > 0 ? (
              options.map((option, index) => (
                <li
                  key={index}
                  onClick={() => handleSelect(option, selected?.label)}
                  className="px-3 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-700 cursor-pointer text-sm"
                >
                  {option.label}
                </li>
              ))
            ) : (
              <li className="px-3 py-2 text-gray-500 text-sm">
                No schemas available
              </li>
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
