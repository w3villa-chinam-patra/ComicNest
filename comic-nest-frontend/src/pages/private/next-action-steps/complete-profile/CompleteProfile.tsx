import { useState } from "react";
import axios from "axios";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import MapAutoCenter from "./MapAutoCenter";
import { appConstants } from "../../../../constants";
import { updateProfile } from "../../../../api/user.api";
import { useAuth } from "../../../../contexts/AuthContext";
import toast from "react-hot-toast";

const OPEN_CAGE_API_KEY = import.meta.env.VITE_OPENCAGE_API_KEY; // Store key in .env

const defaultLatLng: [number, number] = [20.5937, 78.9629]; // India center

const CompleteProfile = () => {
  const { user, setUser } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [address, setAddress] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [latlng, setLatlng] = useState<[number, number]>(defaultLatLng);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(
    appConstants.TRUTHY_FALSY_VALUES.FALSE
  );
  const [isSubmitLoading, setIsSubmitLoading] = useState(
    appConstants.TRUTHY_FALSY_VALUES.FALSE
  );

  const handleSearchChange = async (value: string) => {
    setAddress(value);
    if (value.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoadingSuggestions(true);
    try {
      const res = await axios.get(
        "https://api.opencagedata.com/geocode/v1/json",
        {
          params: {
            key: OPEN_CAGE_API_KEY,
            q: value,
            limit: 5,
            countrycode: "in",
          },
        }
      );

      const results = res.data.results.map((item: any) => item.formatted);
      setSuggestions(results);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const handleSelectAddress = async (selected: string) => {
    setAddress(selected);
    setSuggestions([]);
    setIsLoadingSuggestions(true);
    try {
      const res = await axios.get(
        "https://api.opencagedata.com/geocode/v1/json",
        {
          params: {
            key: OPEN_CAGE_API_KEY,
            q: selected,
            limit: 1,
          },
        }
      );

      const loc = res.data.results[0].geometry;
      setLatlng([loc.lat, loc.lng]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const markerIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitLoading(appConstants.TRUTHY_FALSY_VALUES.TRUE);
      const response = await updateProfile({
        ...user,
        firstName,
        lastName,
        username,
        address,
        latitude: latlng[0],
        longitude: latlng[1],
      });
      if (response.isSuccess) {
        toast.success(response.message);
        setUser(null);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      const err = error as Error;
      toast.error(err.message);
    } finally {
      setIsSubmitLoading(appConstants.TRUTHY_FALSY_VALUES.FALSE);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto text-white space-y-6 p-6 bg-neutral-900 rounded-md">
      <h2 className="text-2xl font-bold text-center">Complete Your Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextInput
          label="First Name"
          value={firstName}
          onChange={setFirstName}
        />
        <TextInput label="Last Name" value={lastName} onChange={setLastName} />
        <TextInput label="Username" value={username} onChange={setUsername} />

        <div>
          <label className="font-medium">Address</label>
          <div className="relative">
            <input
              value={address}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Type an address"
              className="w-full mt-2 px-3 py-2 text-gray-300 bg-transparent outline-none border border-neutral-600 focus:border-amber-600 shadow-sm rounded-lg"
            />
            {isLoadingSuggestions && (
              <AiOutlineLoading3Quarters className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 animate-spin" />
            )}
          </div>
          {suggestions.length > 0 && (
            <ul className="bg-neutral-800 border border-neutral-600 rounded-md mt-1 max-h-48 overflow-y-auto z-50 relative">
              {suggestions.map((sug, i) => (
                <li
                  key={i}
                  className="p-2 hover:bg-neutral-700 cursor-pointer text-sm"
                  onClick={() => handleSelectAddress(sug)}
                >
                  {sug}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-4 h-[300px] rounded-md overflow-hidden border border-neutral-700">
          <MapContainer
            center={latlng}
            zoom={14}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={latlng} icon={markerIcon} />
            <MapAutoCenter latlng={latlng} />
          </MapContainer>
        </div>

        <button
          type="submit"
          disabled={isSubmitLoading}
          className={`w-full flex justify-center items-center gap-2 cursor-pointer px-4 py-2 text-white font-medium ${
            isSubmitLoading ? "bg-amber-500" : "bg-amber-600"
          } hover:bg-amber-500 active:bg-amber-600 rounded-lg duration-150`}
        >
          Submit
          {isSubmitLoading ? (
            <AiOutlineLoading3Quarters className="animate-spin" />
          ) : (
            ""
          )}
        </button>
      </form>
    </div>
  );
};

const TextInput = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) => (
  <div>
    <label className="font-medium">{label}</label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required
      className="w-full mt-2 px-3 py-2 text-gray-300 bg-transparent outline-none border border-neutral-600 focus:border-amber-600 shadow-sm rounded-lg"
    />
  </div>
);

export default CompleteProfile;
