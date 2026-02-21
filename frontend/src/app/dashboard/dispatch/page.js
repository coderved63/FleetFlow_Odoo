'use client';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { MapPin, Truck, User as UserIcon, Calculator, ChevronRight, CheckCircle2, History } from 'lucide-react';

const INDIAN_CITIES = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Kolkata', 'Pune', 
    'Jaipur', 'Surat', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 
    'Visakhapatnam', 'Patna', 'Vadodara', 'Ghaziabad'
];

// Mock distance calculator (in a real app, this would call Google Maps API or similar)
const calculateDistance = (origin, destination) => {
    if (!origin || !destination) return 0;
    // Simple hash-based distance for demo
    const dist = (origin.length + destination.length) * 15;
    return dist;
};

export default function TripDispatcherPage() {
    const { user, token } = useAuthStore();
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Form States
    const [formData, setFormData] = useState({
        cargoWeight: '',
        vehicleId: '',
        driverId: '',
        origin: 'Mumbai',
        destination: 'Pune',
        fuelPricePerKm: '',
        manualDistance: '',
    });

    const [availableVehicles, setAvailableVehicles] = useState([]);
    const [availableDrivers, setAvailableDrivers] = useState([]);
    const [calculatedStats, setCalculatedStats] = useState({
        distance: 0,
        totalCost: 0
    });

    // Completion State
    const [completingTrip, setCompletingTrip] = useState(null);
    const [endOdometer, setEndOdometer] = useState('');

    useEffect(() => {
        fetchTrips();
    }, []);

    const fetchTrips = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/trips', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setTrips(data);
        } catch (err) {
            setError('Failed to fetch trips');
        } finally {
            setLoading(false);
        }
    };

    // Filter Vehicles when Cargo Weight changes
    useEffect(() => {
        if (formData.cargoWeight > 0) {
            fetchVehicles(formData.cargoWeight);
        } else {
            setAvailableVehicles([]);
        }
    }, [formData.cargoWeight]);

    const fetchVehicles = async (weight) => {
        try {
            const res = await fetch(`http://localhost:5000/api/trips/filter-vehicles?cargoWeight=${weight}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setAvailableVehicles(data);
        } catch (err) {
            console.error(err);
        }
    };

    // Filter Drivers when Vehicle changes
    useEffect(() => {
        if (formData.vehicleId) {
            const vehicle = availableVehicles.find(v => v.id === parseInt(formData.vehicleId));
            if (vehicle) fetchDrivers(vehicle.type);
        } else {
            setAvailableDrivers([]);
        }
    }, [formData.vehicleId]);

    const fetchDrivers = async (type) => {
        try {
            const res = await fetch(`http://localhost:5000/api/trips/filter-drivers?vehicleType=${type}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setAvailableDrivers(data);
        } catch (err) {
            console.error(err);
        }
    };

    // Live Calculations
    useEffect(() => {
        const distance = calculateDistance(formData.origin, formData.destination);
        const fuelCost = parseFloat(formData.fuelPricePerKm || 0);
        
        // Update manual distance default if it's empty
        if (!formData.manualDistance) {
            setCalculatedStats({
                distance,
                totalCost: distance * fuelCost
            });
        } else {
            const mDist = parseFloat(formData.manualDistance);
            setCalculatedStats({
                distance: mDist,
                totalCost: mDist * fuelCost
            });
        }
    }, [formData.origin, formData.destination, formData.fuelPricePerKm, formData.manualDistance]);

    const handleDispatch = async () => {
        if (!formData.vehicleId || !formData.driverId || !formData.fuelPricePerKm) {
            alert('Please fill all required fields');
            return;
        }

        const finalDistance = formData.manualDistance ? parseFloat(formData.manualDistance) : calculatedStats.distance;

        try {
            const res = await fetch('http://localhost:5000/api/trips', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    estimatedDistance: finalDistance,
                    estimatedFuelPricePerKm: formData.fuelPricePerKm,
                    estimatedTripPrice: finalDistance * parseFloat(formData.fuelPricePerKm)
                })
            });

            if (res.ok) {
                fetchTrips();
                setFormData({
                    cargoWeight: '',
                    vehicleId: '',
                    driverId: '',
                    origin: 'Mumbai',
                    destination: 'Pune',
                    fuelPricePerKm: '',
                    manualDistance: '',
                });
                alert('Trip Dispatched Successfully!');
            }
        } catch (err) {
            alert('Failed to dispatch trip');
        }
    };

    const handleCompleteTrip = async () => {
        if (!endOdometer || parseFloat(endOdometer) <= completingTrip.startOdometer) {
            alert('Invalid odometer reading');
            return;
        }

        try {
            const res = await fetch(`http://localhost:5000/api/trips/${completingTrip.id}/complete`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    endOdometer,
                    actualFuelCostPerKm: completingTrip.estimatedFuelPricePerKm // Using estimated for actual fuel cost per km for now
                })
            });

            if (res.ok) {
                fetchTrips();
                setCompletingTrip(null);
                setEndOdometer('');
                alert('Trip Completed and Odometer Updated!');
            }
        } catch (err) {
            alert('Failed to complete trip');
        }
    };

    if (loading) return <div className="p-8 text-neutral-400">Loading Dispatcher...</div>;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-neutral-100">
            {/* Top Bar: Reference UI Search and Filters */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-neutral-900 border border-neutral-800 p-4 rounded-xl shadow-sm">
                <div className="w-full md:w-1/2">
                    <input
                        type="text"
                        placeholder="Search bar ......."
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto justify-end">
                    <button className="px-4 py-2 border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm font-medium transition-colors">Group by</button>
                    <button className="px-4 py-2 border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm font-medium transition-colors">Filter</button>
                    <button className="px-4 py-2 border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm font-medium transition-colors">Sort by...</button>
                </div>
            </div>

            {/* Trip Status Table - Matching Reference UI */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-center border-collapse">
                    <thead>
                        <tr className="border-b border-neutral-800 text-sm">
                            <th className="p-4 font-medium text-pink-500 border-r border-neutral-800 w-[15%]">Trip ID</th>
                            <th className="p-4 font-medium text-pink-500 border-r border-neutral-800 w-[15%]">Fleet Type</th>
                            <th className="p-4 font-medium text-pink-500 border-r border-neutral-800">Origin</th>
                            <th className="p-4 font-medium text-pink-500 border-r border-neutral-800">Destination</th>
                            <th className="p-4 font-medium text-pink-500">Status</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {trips.length > 0 ? trips.map((t) => (
                            <tr key={t.id} className="border-b border-neutral-800/50 hover:bg-neutral-800/30 transition-colors cursor-pointer" onClick={() => t.status === 'Dispatched' && setCompletingTrip(t)}>
                                <td className="p-4 border-r border-neutral-800 text-red-500 font-semibold">{t.tripId}</td>
                                <td className="p-4 border-r border-neutral-800 text-red-500 font-semibold">{t.vehicle?.type}</td>
                                <td className="p-4 border-r border-neutral-800 text-red-500 font-semibold">{t.origin}</td>
                                <td className="p-4 border-r border-neutral-800 text-red-500 font-semibold">{t.destination}</td>
                                <td className="p-4 text-red-500 font-semibold underline underline-offset-4 decoration-red-500/50">
                                    {t.status}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-neutral-500 font-medium">No trips active.</td>
                            </tr>
                        )}
                        {/* Fill empty rows to match reference sketch style */}
                        {[...Array(Math.max(0, 5 - trips.length))].map((_, i) => (
                            <tr key={`empty-${i}`} className="border-b border-neutral-800/30 last:border-0">
                                <td className="p-4 border-r border-neutral-800 text-neutral-600">•</td>
                                <td className="p-4 border-r border-neutral-800 text-neutral-600">•</td>
                                <td className="p-4 border-r border-neutral-800 text-neutral-600">•</td>
                                <td className="p-4 border-r border-neutral-800 text-neutral-600">•</td>
                                <td className="p-4 text-neutral-600">•</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal for Completing Trip */}
            {completingTrip && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <History className="text-emerald-500" size={20} />
                                Complete Trip {completingTrip.tripId}
                            </h3>
                            <button onClick={() => setCompletingTrip(null)} className="text-neutral-500 hover:text-white transition-colors">✕</button>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs text-neutral-500 mb-1.5 uppercase tracking-wider">Starting Odometer</label>
                                <div className="bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-neutral-300">
                                    {completingTrip.startOdometer} km
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs text-neutral-500 mb-1.5 uppercase tracking-wider">Current Odometer Reading</label>
                                <input 
                                    type="number" 
                                    value={endOdometer}
                                    onChange={(e) => setEndOdometer(e.target.value)}
                                    placeholder="Enter current reading..."
                                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                                />
                            </div>
                            {endOdometer && (
                                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-neutral-400">Actual Distance:</span>
                                        <span className="text-emerald-400 font-bold">{parseFloat(endOdometer) - completingTrip.startOdometer} km</span>
                                    </div>
                                    <div className="flex justify-between text-sm pt-2 border-t border-emerald-500/10">
                                        <span className="text-neutral-400">Est. Fuel Consumption:</span>
                                        <span className="text-emerald-400 font-bold">₹{(parseFloat(endOdometer) - completingTrip.startOdometer) * completingTrip.estimatedFuelPricePerKm}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <button 
                            onClick={handleCompleteTrip}
                            className="w-full mt-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-600/20 active:scale-[0.98]"
                        >
                            Mark as Completed
                        </button>
                    </div>
                </div>
            )}

            {/* New Trip Form - Modified to match reference UI but with real logic */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-sm">
                <div className="mb-8 flex items-center justify-between">
                    <span className="px-4 py-1.5 border border-emerald-500/50 text-emerald-400 rounded-lg text-sm font-bold bg-emerald-500/5">
                        New Trip Form
                    </span>
                    {calculatedStats.distance > 0 && (
                        <div className="flex items-center gap-4 text-sm">
                            <span className="text-neutral-500">Approx Distance: <b className="text-blue-400">{calculatedStats.distance} km</b></span>
                            <span className="text-neutral-500">Est. Cost: <b className="text-emerald-400">₹{calculatedStats.totalCost}</b></span>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                    {/* Cargo Weight First to Filter Vehicles */}
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <label className="text-neutral-400 text-sm whitespace-nowrap w-40">Cargo Weight (Kg):</label>
                        <input 
                            type="number" 
                            value={formData.cargoWeight}
                            onChange={(e) => setFormData({...formData, cargoWeight: e.target.value})}
                            className="flex-1 bg-neutral-950 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors" 
                            placeholder="Enter load in kg..."
                        />
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <label className="text-neutral-400 text-sm whitespace-nowrap w-40">Select Vehicle:</label>
                        <select 
                            value={formData.vehicleId}
                            onChange={(e) => setFormData({...formData, vehicleId: e.target.value})}
                            disabled={!formData.cargoWeight}
                            className="flex-1 bg-neutral-950 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-all disabled:opacity-50"
                        >
                            <option value="">{formData.cargoWeight ? 'Choose Vehicle...' : 'Enter weight first'}</option>
                            {availableVehicles.map(v => (
                                <option key={v.id} value={v.id}>{v.name} ({v.type}) - Cap: {v.maxLoadCapacity}kg</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <label className="text-neutral-400 text-sm whitespace-nowrap w-40">Select Driver:</label>
                        <select 
                            value={formData.driverId}
                            onChange={(e) => setFormData({...formData, driverId: e.target.value})}
                            disabled={!formData.vehicleId}
                            className="flex-1 bg-neutral-950 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-all disabled:opacity-50"
                        >
                            <option value="">{formData.vehicleId ? 'Choose Driver...' : 'Select vehicle first'}</option>
                            {availableDrivers.map(d => (
                                <option key={d.id} value={d.id}>{d.name} (License: {d.license?.licenseNo})</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <label className="text-neutral-400 text-sm whitespace-nowrap w-40">Origin Address:</label>
                        <select 
                            value={formData.origin}
                            onChange={(e) => setFormData({...formData, origin: e.target.value})}
                            className="flex-1 bg-neutral-950 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                        >
                            {INDIAN_CITIES.map(c => <option key={`origin-${c}`} value={c}>{c}</option>)}
                        </select>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <label className="text-neutral-400 text-sm whitespace-nowrap w-40">Destination:</label>
                        <select 
                            value={formData.destination}
                            onChange={(e) => setFormData({...formData, destination: e.target.value})}
                            className="flex-1 bg-neutral-950 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                        >
                            {INDIAN_CITIES.map(c => <option key={`dest-${c}`} value={c}>{c}</option>)}
                        </select>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <label className="text-neutral-400 text-sm whitespace-nowrap w-40">Manual Distance (Km):</label>
                        <input 
                            type="number" 
                            step="0.1"
                            value={formData.manualDistance}
                            onChange={(e) => setFormData({...formData, manualDistance: e.target.value})}
                            className="flex-1 bg-neutral-950 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors border-dashed border-blue-500/30" 
                            placeholder={`Auto: ${calculatedStats.distance} km`}
                        />
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <label className="text-neutral-400 text-sm whitespace-nowrap w-40">Est. Fuel Cost (₹/km):</label>
                        <input 
                            type="number" 
                            step="0.01"
                            value={formData.fuelPricePerKm}
                            onChange={(e) => setFormData({...formData, fuelPricePerKm: e.target.value})}
                            className="flex-1 bg-neutral-950 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors" 
                            placeholder="e.g. 15.50"
                        />
                    </div>
                </div>

                <div className="mt-10 flex justify-start border-t border-neutral-800 pt-8">
                    <button 
                        onClick={handleDispatch}
                        className="group flex items-center gap-3 px-8 py-3.5 border border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white rounded-xl text-sm font-bold transition-all active:scale-[0.98] shadow-lg shadow-emerald-500/10"
                    >
                        Confirm & Dispatch Trip
                        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
}
