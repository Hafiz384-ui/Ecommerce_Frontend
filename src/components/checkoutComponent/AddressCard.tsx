import React, { useEffect } from "react";
import { MapPin, Phone, Trash2, Check } from "lucide-react";
import addressStore from "../../store/addressStore";

interface AddressCardProps {
  setAddress: (address: any) => void;
  selectedAddressId: string;
}

const AddressCard: React.FC<AddressCardProps> = ({
  setAddress,
  selectedAddressId,
}) => {
  const { addresses, fetchaddress, deleteaddress, loading } = addressStore();

  useEffect(() => {
    fetchaddress();
  }, []);

  // Auto-select first address if none selected
  useEffect(() => {
    if (!selectedAddressId && addresses && addresses.length > 0) {
      setAddress(addresses[0]);
    }
  }, [addresses, selectedAddressId, setAddress]);

  if (loading && (!addresses || addresses.length === 0)) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3 animate-pulse"
          >
            <div className="flex justify-between items-center">
              <div className="h-4 w-28 bg-slate-200 rounded" />
              <div className="h-5 w-14 bg-slate-200 rounded-full" />
            </div>
            <div className="h-3 w-40 bg-slate-200 rounded" />
            <div className="h-3 w-56 bg-slate-200 rounded" />
            <div className="h-9 w-full bg-slate-200 rounded-xl mt-4" />
          </div>
        ))}
      </div>
    );
  }

  if (!addresses || addresses.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
      {addresses.map((val) => {
        const isSelected = val._id === selectedAddressId;

        return (
          <div
            key={val._id}
            onClick={() => setAddress(val)}
            className={`relative rounded-2xl p-5 cursor-pointer transition-all duration-200 flex flex-col justify-between border ${
              isSelected
                ? "bg-white border-black shadow-md ring-2 ring-black/5"
                : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs"
            }`}
          >
            {/* Top Row: Name, Selection Badge, & Delete */}
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                      isSelected
                        ? "border-black bg-black text-white"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                    {val.fullName}
                  </h4>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {isSelected ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900 text-white">
                      Selected
                    </span>
                  ) : (
                    <button
                      type="button"
                      aria-label="Delete address"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteaddress(val._id);
                      }}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Address Details */}
              <div className="space-y-1.5 text-xs text-slate-600 mb-4 pl-6.5">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    <p className="font-medium text-slate-800">{val.address}</p>
                    <p>
                      {val.city}, {val.state} {val.zip}
                    </p>
                    <p className="text-slate-500">{val.country}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1 text-slate-500">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{val.phone}</span>
                </div>
              </div>
            </div>

            {/* Bottom Action */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                {isSelected ? "Delivering to this address" : "Click to select"}
              </span>
              <button
                type="button"
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-slate-100 text-slate-900"
                    : "bg-slate-900 text-white hover:bg-black"
                }`}
              >
                {isSelected ? "Active" : "Deliver Here"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AddressCard;
