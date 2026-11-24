
import React, { useState } from 'react';
import "./DeliveryChecker.css";
// ==========================================
// DELIVERY CHECKER COMPONENT
// Purpose:
// 1. Customer ka 6-digit PIN code lena.
// 2. PIN code validate karna.
// 3. Delivery availability check karna.
// 4. Estimated delivery show karna.
// 5. COD availability show karna.
// ==========================================

function DeliveryChecker({
  onCheckDelivery,
  deliveryDays = 5
}) {

  // ==========================================
  // COMPONENT STATES
  // ==========================================

  const [pincode, setPincode] = useState('');
  const [loading, setLoading] = useState(false);
  const [deliveryResult, setDeliveryResult] = useState(null);
  const [error, setError] = useState('');

  // ==========================================
  // PINCODE INPUT HANDLER
  // Only six digits allowed.
  // ==========================================

  const handlePincodeChange = (event) => {

    const value = event.target.value.replace(/\D/g, '');

    if (value.length <= 6) {
      setPincode(value);
      setDeliveryResult(null);
      setError('');
    }
  };

  // ==========================================
  // DELIVERY CHECK HANDLER
  // ==========================================

  const handleCheckDelivery = async () => {

    setError('');
    setDeliveryResult(null);

    // Validate PIN code.
    if (!/^[1-9][0-9]{5}$/.test(pincode)) {
      setError('Please enter a valid 6-digit PIN code.');
      return;
    }

    setLoading(true);

    try {

      // Parent/backend callback if provided.
      if (onCheckDelivery) {

        const result = await onCheckDelivery(pincode);

        if (!result || typeof result.available !== 'boolean') {
          throw new Error('Delivery service returned an invalid response.');
        }

        setDeliveryResult(result);

      } else {

        // Demo mode only.
        // This does not confirm real delivery availability.
        const estimatedDate = new Date();

        estimatedDate.setDate(
          estimatedDate.getDate() + deliveryDays
        );

        setDeliveryResult({
          available: true,
          codAvailable: true,
          estimatedDelivery: estimatedDate.toLocaleDateString(
            'en-IN',
            {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            }
          ),
          message: 'Demo result: connect a delivery API for real availability.'
        });

      }

    } catch (err) {

      setError(
        err.message || 'Unable to check delivery. Please try again.'
      );

    } finally {

      setLoading(false);

    }
  };

  // ==========================================
  // MAIN DELIVERY CHECKER UI
  // ==========================================

  return (

    <div className="delivery-checker">

      {/* Heading */}
      <h4>Check Delivery Availability</h4>

      <p className="delivery-checker-subtitle">
        Enter your PIN code to check delivery options.
      </p>

      {/* Input and button */}
      <div className="delivery-input-group">

        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          placeholder="Enter 6-digit PIN code"
          value={pincode}
          onChange={handlePincodeChange}
          aria-label="Enter PIN code"
        />

        <button
          type="button"
          onClick={handleCheckDelivery}
          disabled={loading || pincode.length !== 6}
        >
          {loading ? 'Checking...' : 'Check'}
        </button>

      </div>

      {/* Error message */}
      {error && (

        <p className="delivery-error" role="alert">
          {error}
        </p>

      )}

      {/* Delivery result */}
      {deliveryResult && (

        <div
          className={
            deliveryResult.available
              ? 'delivery-result delivery-success'
              : 'delivery-result delivery-unavailable'
          }
          role="status"
        >

          {deliveryResult.available ? (

            <>
              <h4>✓ Delivery Available</h4>

              {deliveryResult.estimatedDelivery && (
                <p>
                  Estimated Delivery: {' '}
                  <strong>
                    {deliveryResult.estimatedDelivery}
                  </strong>
                </p>
              )}

              <p>
                Cash on Delivery: {' '}
                <strong>
                  {deliveryResult.codAvailable
                    ? 'Available'
                    : 'Not Available'}
                </strong>
              </p>
            </>

          ) : (

            <>
              <h4>Delivery Not Available</h4>

              <p>
                Sorry, delivery is not currently available at this PIN code.
              </p>
            </>

          )}

          {deliveryResult.message && (
            <p className="delivery-result-message">
              {deliveryResult.message}
            </p>
          )}

        </div>

      )}

    </div>
  );
}

// ==========================================
// EXPORT COMPONENT
// ==========================================

export default DeliveryChecker;
