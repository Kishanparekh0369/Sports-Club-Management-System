import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useOutletContext } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CalendarPlus, Clock, Building2, Trophy, AlertTriangle, CheckCircle } from 'lucide-react';
import MemberHeader from '../../components/layout/MemberHeader';
import FormInput from '../../components/forms/FormInput';
import FormSelect from '../../components/forms/FormSelect';
import FormTextarea from '../../components/forms/FormTextarea';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { sportService } from '../../services/sportService';
import { facilityService } from '../../services/facilityService';
import { bookingService } from '../../services/bookingService';
import { formatCurrency } from '../../utils/formatCurrency';
import { getErrorMessage } from '../../services/api';

const BookSport = () => {
  const { onToggleMobile } = useOutletContext();
  const location = useLocation();
  const navigate = useNavigate();

  const [sports, setSports] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const tomorrowStr = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    sport: '',
    facility: '',
    date: tomorrowStr,
    startTime: '10:00',
    endTime: '11:00',
    notes: ''
  });

  const [selectedSportObj, setSelectedSportObj] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sportsRes, facRes] = await Promise.all([
          sportService.getSports({ status: 'active' }),
          facilityService.getFacilities({ status: 'active' })
        ]);

        const sportsList = sportsRes.sports || [];
        const facList = facRes.facilities || [];
        setSports(sportsList);
        setFacilities(facList);

        // Pre-select sport if sportId was passed in query
        const searchParams = new URLSearchParams(location.search);
        const querySportId = searchParams.get('sportId');

        let initialSport = null;
        if (querySportId) {
          initialSport = sportsList.find((s) => s._id === querySportId);
        }
        if (!initialSport && sportsList.length > 0) {
          initialSport = sportsList[0];
        }

        if (initialSport) {
          setSelectedSportObj(initialSport);
          // Find matching facility for this sport
          const matchingFac = facList.find(
            (f) => (f.sport?._id || f.sport) === initialSport._id
          ) || facList[0];

          setFormData((prev) => ({
            ...prev,
            sport: initialSport._id,
            facility: matchingFac ? matchingFac._id : ''
          }));
        }
      } catch (err) {
        toast.error('Failed to initialize booking form');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location.search]);

  const handleSportChange = (e) => {
    const sportId = e.target.value;
    const sportObj = sports.find((s) => s._id === sportId);
    setSelectedSportObj(sportObj);

    // Auto-select a matching facility
    const matchingFac = facilities.find(
      (f) => (f.sport?._id || f.sport) === sportId
    ) || facilities[0];

    setFormData({
      ...formData,
      sport: sportId,
      facility: matchingFac ? matchingFac._id : ''
    });
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    if (!formData.sport || !formData.facility || !formData.date || !formData.startTime || !formData.endTime) {
      toast.warning('Please fill in all reservation fields.');
      return;
    }

    if (formData.startTime >= formData.endTime) {
      toast.error('Start time must be before end time.');
      return;
    }

    setSubmitting(true);
    try {
      await bookingService.createBooking(formData);
      toast.success('Court booking confirmed successfully!');
      navigate('/member/my-bookings');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <MemberHeader title="Book A Court" breadcrumb="Reservations" onToggleMobile={onToggleMobile} />
        <Loader fullScreen message="Loading venues and court availability..." />
      </>
    );
  }

  // Filter facilities that match selected sport
  const availableFacilities = facilities.filter(
    (f) => !f.sport || (f.sport?._id || f.sport) === formData.sport
  );

  return (
    <>
      <MemberHeader title="Reserve A Sport" breadcrumb="Book A Sport" onToggleMobile={onToggleMobile} />

      <div className="dashboard-content">
        <div className="row g-4 justify-content-center">
          <div className="col-lg-8">
            <div className="card-custom p-4 p-md-5 bg-white">
              <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom">
                <div className="p-3 bg-lime-subtle rounded-3 text-success">
                  <CalendarPlus size={28} />
                </div>
                <div>
                  <h4 className="font-heading fw-bold text-navy mb-0">Reserve Court Or Facility</h4>
                  <span className="text-muted small">
                    Real-time scheduling with automatic conflict-checking and instant validation
                  </span>
                </div>
              </div>

              <form onSubmit={handleBookingSubmit}>
                {/* Sport Selection */}
                <div className="mb-3">
                  <FormSelect
                    label="Sport Discipline"
                    name="sport"
                    required
                    value={formData.sport}
                    onChange={handleSportChange}
                    options={sports.map((s) => ({ label: `${s.name} (${formatCurrency(s.price)}/hr)`, value: s._id }))}
                  />
                </div>

                {/* Facility Selection */}
                <div className="mb-3">
                  <FormSelect
                    label="Assigned Court / Venue Facility"
                    name="facility"
                    required
                    value={formData.facility}
                    onChange={(e) => setFormData({ ...formData, facility: e.target.value })}
                    options={availableFacilities.map((f) => ({
                      label: `${f.name} (${f.courtNumber}) - Cap: ${f.capacity}`,
                      value: f._id
                    }))}
                  />
                </div>

                {/* Date & Time Slot */}
                <div className="row g-3 mb-3">
                  <div className="col-md-4">
                    <FormInput
                      label="Booking Date"
                      name="date"
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>

                  <div className="col-md-4">
                    <FormSelect
                      label="Start Time"
                      name="startTime"
                      required
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      options={[
                        { label: '06:00 AM', value: '06:00' },
                        { label: '07:00 AM', value: '07:00' },
                        { label: '08:00 AM', value: '08:00' },
                        { label: '09:00 AM', value: '09:00' },
                        { label: '10:00 AM', value: '10:00' },
                        { label: '11:00 AM', value: '11:00' },
                        { label: '12:00 PM', value: '12:00' },
                        { label: '01:00 PM', value: '13:00' },
                        { label: '02:00 PM', value: '14:00' },
                        { label: '03:00 PM', value: '15:00' },
                        { label: '04:00 PM', value: '16:00' },
                        { label: '05:00 PM', value: '17:00' },
                        { label: '06:00 PM', value: '18:00' },
                        { label: '07:00 PM', value: '19:00' },
                        { label: '08:00 PM', value: '20:00' },
                        { label: '09:00 PM', value: '21:00' }
                      ]}
                    />
                  </div>

                  <div className="col-md-4">
                    <FormSelect
                      label="End Time"
                      name="endTime"
                      required
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      options={[
                        { label: '07:00 AM', value: '07:00' },
                        { label: '08:00 AM', value: '08:00' },
                        { label: '09:00 AM', value: '09:00' },
                        { label: '10:00 AM', value: '10:00' },
                        { label: '11:00 AM', value: '11:00' },
                        { label: '12:00 PM', value: '12:00' },
                        { label: '01:00 PM', value: '13:00' },
                        { label: '02:00 PM', value: '14:00' },
                        { label: '03:00 PM', value: '15:00' },
                        { label: '04:00 PM', value: '16:00' },
                        { label: '05:00 PM', value: '17:00' },
                        { label: '06:00 PM', value: '18:00' },
                        { label: '07:00 PM', value: '19:00' },
                        { label: '08:00 PM', value: '20:00' },
                        { label: '09:00 PM', value: '21:00' },
                        { label: '10:00 PM', value: '22:00' }
                      ]}
                    />
                  </div>
                </div>

                <FormTextarea
                  label="Special Notes or Requests (Optional)"
                  name="notes"
                  rows={2}
                  placeholder="Need practice cones, ball bucket, or match balls..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />

                {/* Summary Box */}
                {selectedSportObj && (
                  <div className="p-3 bg-surface-subtle rounded-3 mb-4 d-flex justify-content-between align-items-center">
                    <div>
                      <span className="text-muted small">Standard Slot Price:</span>
                      <div className="fw-bold text-navy fs-5">
                        {formatCurrency(selectedSportObj.price)}
                      </div>
                    </div>
                    <span className="badge bg-success-subtle text-success py-1 px-3">
                      Included with Active Membership
                    </span>
                  </div>
                )}

                <Button
                  type="submit"
                  variant="lime"
                  className="w-100 py-3"
                  loading={submitting}
                >
                  Confirm & Reserve Court Slot
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookSport;
