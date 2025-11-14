import { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const DeliveryTracker = ({ orderId, trackingNumber }) => {
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [center, setCenter] = useState({ lat: 19.0760, lng: 72.8777 }); // Mumbai default

  useEffect(() => {
    if (orderId || trackingNumber) {
      fetchTracking();
    }
  }, [orderId, trackingNumber]);

  const fetchTracking = async () => {
    try {
      const endpoint = trackingNumber
        ? `${API_BASE_URL}/api/delivery-tracking/track/${trackingNumber}`
        : `${API_BASE_URL}/api/delivery-tracking/order/${orderId}`;
      
      const response = await axios.get(endpoint);
      setTracking(response.data);

      if (response.data.currentLocation?.latitude && response.data.currentLocation?.longitude) {
        setCenter({
          lat: response.data.currentLocation.latitude,
          lng: response.data.currentLocation.longitude,
        });
      }
    } catch (error) {
      console.error('Error fetching tracking:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse bg-gray-200 h-96 rounded-lg" />;
  }

  if (!tracking) {
    return <div className="p-4 text-center text-gray-500">Tracking information not available</div>;
  }

  const statusSteps = [
    { key: 'picked_up', label: 'Picked Up' },
    { key: 'in_transit', label: 'In Transit' },
    { key: 'out_for_delivery', label: 'Out for Delivery' },
    { key: 'delivered', label: 'Delivered' },
  ];

  const currentStepIndex = statusSteps.findIndex((step) => step.key === tracking.status);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-medium mb-4">Delivery Tracking</h3>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm text-gray-600">Tracking Number</p>
              <p className="font-medium">{tracking.trackingNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Courier</p>
              <p className="font-medium">{tracking.courierName}</p>
            </div>
          </div>

          {/* Status Timeline */}
          <div className="relative">
            {statusSteps.map((step, idx) => (
              <div key={step.key} className="flex items-center mb-4">
                <div className="flex flex-col items-center mr-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      idx <= currentStepIndex
                        ? 'bg-black text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {idx < currentStepIndex ? '✓' : idx + 1}
                  </div>
                  {idx < statusSteps.length - 1 && (
                    <div
                      className={`w-0.5 h-12 ${
                        idx < currentStepIndex ? 'bg-black' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
                <div className="flex-1">
                  <p
                    className={`font-medium ${
                      idx <= currentStepIndex ? 'text-black' : 'text-gray-400'
                    }`}
                  >
                    {step.label}
                  </p>
                  {tracking.logs
                    .filter((log) => log.status === step.key)
                    .slice(-1)
                    .map((log, logIdx) => (
                      <p key={logIdx} className="text-sm text-gray-500">
                        {new Date(log.timestamp).toLocaleString()}
                      </p>
                    ))}
                </div>
              </div>
            ))}
          </div>

          {tracking.estimatedDelivery && (
            <div className="mt-4 p-3 bg-blue-50 rounded">
              <p className="text-sm text-blue-900">
                <strong>Estimated Delivery:</strong>{' '}
                {new Date(tracking.estimatedDelivery).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Map */}
      {process.env.VITE_GOOGLE_MAPS_API_KEY && (
        <LoadScript googleMapsApiKey={process.env.VITE_GOOGLE_MAPS_API_KEY}>
          <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={12}>
            {tracking.currentLocation?.latitude && tracking.currentLocation?.longitude && (
              <Marker
                position={{
                  lat: tracking.currentLocation.latitude,
                  lng: tracking.currentLocation.longitude,
                }}
                label="Current Location"
              />
            )}
          </GoogleMap>
        </LoadScript>
      )}
    </div>
  );
};

export default DeliveryTracker;

