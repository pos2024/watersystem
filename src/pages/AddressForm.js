import React, { useState } from "react";
import Select from "react-select";

// List of Barangays in Balungao, Pangasinan
const barangays = [
  { value: "Angayan Norte", label: "Angayan Norte" },
  { value: "Angayan Sur", label: "Angayan Sur" },
  { value: "Capulaan", label: "Capulaan" },
  { value: "Esmeralda", label: "Esmeralda" },
  { value: "Kita-kita", label: "Kita-kita" },
  { value: "Mabini", label: "Mabini" },
  { value: "Mauban", label: "Mauban" },
  { value: "Poblacion", label: "Poblacion" },
  { value: "Pugaro", label: "Pugaro" },
  { value: "Rajal", label: "Rajal" },
  { value: "San Andres", label: "San Andres" },
  { value: "San Aurelio 1st", label: "San Aurelio 1st" },
  { value: "San Aurelio 2nd", label: "San Aurelio 2nd" },
  { value: "San Aurelio 3rd", label: "San Aurelio 3rd" },
  { value: "San Joaquin", label: "San Joaquin" },
  { value: "San Julian", label: "San Julian" },
  { value: "San Leon", label: "San Leon" },
  { value: "San Marcelino", label: "San Marcelino" },
  { value: "San Miguel", label: "San Miguel" },
  { value: "San Raymundo", label: "San Raymundo" },
];

const AddressForm = () => {
  const [houseNumber, setHouseNumber] = useState("");
  const [selectedBarangay, setSelectedBarangay] = useState(null);
  const [fullAddress, setFullAddress] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!houseNumber || !selectedBarangay) {
      alert("Please fill in all the fields.");
      return;
    }

    // Combine the values to create a full address
    const address = `${houseNumber}, ${selectedBarangay.label}, Balungao, Pangasinan`;
    setFullAddress(address);
    alert("Address submitted: " + address);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Enter Your Address</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* House Number */}
        <div>
          <label className="block text-lg font-semibold">House Number</label>
          <input
            type="text"
            value={houseNumber}
            onChange={(e) => setHouseNumber(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="Enter house number"
            required
          />
        </div>

        {/* Barangay Dropdown */}
        <div>
          <label className="block text-lg font-semibold">Barangay</label>
          <Select
            options={barangays}
            value={selectedBarangay}
            onChange={setSelectedBarangay}
            placeholder="Select Barangay"
            className="w-full"
            required
          />
        </div>

        {/* Municipality (Balungao) */}
        <div>
          <label className="block text-lg font-semibold">Municipality</label>
          <input
            type="text"
            value="Balungao"
            disabled
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>

        {/* Province (Pangasinan) */}
        <div>
          <label className="block text-lg font-semibold">Province</label>
          <input
            type="text"
            value="Pangasinan"
            disabled
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>

        {/* Submit Button */}
        <div className="mt-4">
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </form>

      {/* Display the full address after submission */}
      {fullAddress && (
        <div className="mt-6 p-4 border bg-gray-100">
          <h2 className="text-xl font-semibold">Your Full Address</h2>
          <p>{fullAddress}</p>
        </div>
      )}
    </div>
  );
};

export default AddressForm;
