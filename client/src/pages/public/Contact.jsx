import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import PublicFooter from '../../components/layout/PublicFooter';
import FormInput from '../../components/forms/FormInput';
import FormTextarea from '../../components/forms/FormTextarea';
import Button from '../../components/common/Button';
import { contactService } from '../../services/contactService';
import { getErrorMessage } from '../../services/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Please provide your name';
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Please provide a valid email address';
    }
    if (!formData.subject.trim()) errs.subject = 'Please provide a subject';
    if (!formData.message.trim() || formData.message.length < 10) {
      errs.message = 'Message must be at least 10 characters long';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await contactService.submitContact(formData);
      setSubmitted(true);
      toast.success('Your message has been sent to our athletic directors!');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <PublicNavbar />

      <main className="flex-grow-1">
        {/* Banner */}
        <section className="bg-navy text-white py-5 text-center">
          <div className="container py-3">
            <span className="text-lime fw-bold text-uppercase small">Get In Touch</span>
            <h1 className="hero-title mt-2 mb-2">Connect With Our Team</h1>
            <p className="text-light fs-5 mx-auto" style={{ maxWidth: '640px' }}>
              Have inquiries regarding club membership, tournament entries, or private court bookings? We are here to assist.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-5" style={{ backgroundColor: '#f8fafc' }}>
          <div className="container py-3">
            <div className="row g-5">
              {/* Left Column: Form */}
              <div className="col-lg-7">
                <div className="card-custom p-4 p-md-5 bg-white">
                  <h3 className="font-heading fw-bold text-navy mb-2">Send Us A Message</h3>
                  <p className="text-muted small mb-4">
                    Fill out the form below and our club manager will reach back out within 24 hours.
                  </p>

                  {submitted && (
                    <div className="alert alert-success d-flex align-items-center gap-3 p-3 mb-4 rounded-3 border-0">
                      <CheckCircle2 size={24} className="text-success flex-shrink-0" />
                      <div>
                        <strong>Message Received!</strong> Thank you for contacting Elite Sports Club. A representative has been assigned to your inquiry.
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <FormInput
                          label="Full Name"
                          name="name"
                          required
                          placeholder="Your full name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          error={errors.name}
                        />
                      </div>
                      <div className="col-md-6">
                        <FormInput
                          label="Email Address"
                          name="email"
                          type="email"
                          required
                          placeholder="you@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          error={errors.email}
                        />
                      </div>
                    </div>

                    <div className="row g-3">
                      <div className="col-md-6">
                        <FormInput
                          label="Phone Number"
                          name="phone"
                          placeholder="+1 (555) 000-0000"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                      <div className="col-md-6">
                        <FormInput
                          label="Subject"
                          name="subject"
                          required
                          placeholder="e.g. Tennis Court Reservation Inquiry"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          error={errors.subject}
                        />
                      </div>
                    </div>

                    <FormTextarea
                      label="Your Message"
                      name="message"
                      required
                      rows={5}
                      placeholder="Please describe how we can assist you..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      error={errors.message}
                    />

                    <Button
                      type="submit"
                      variant="lime"
                      className="py-3 px-4 w-100 mt-2"
                      loading={loading}
                      icon={Send}
                    >
                      Submit Inquiry
                    </Button>
                  </form>
                </div>
              </div>

              {/* Right Column: Information & Working Hours */}
              <div className="col-lg-5">
                <div className="card-custom p-4 p-md-5 bg-navy text-white h-100">
                  <h4 className="font-heading fw-bold text-white mb-4">Contact Information</h4>

                  <div className="d-flex gap-3 mb-4">
                    <MapPin size={24} className="text-lime flex-shrink-0 mt-1" />
                    <div>
                      <div className="fw-bold text-white">Main Complex Address</div>
                      <div className="text-light small">
                        Olympic Boulevard, Athletic District, Sports City, SC 40291
                      </div>
                    </div>
                  </div>

                  <div className="d-flex gap-3 mb-4">
                    <Phone size={24} className="text-lime flex-shrink-0 mt-1" />
                    <div>
                      <div className="fw-bold text-white">Direct Telephone</div>
                      <div className="text-light small">+1 (800) 555-ELITE / +1 (555) 019-2831</div>
                    </div>
                  </div>

                  <div className="d-flex gap-3 mb-4">
                    <Mail size={24} className="text-lime flex-shrink-0 mt-1" />
                    <div>
                      <div className="fw-bold text-white">Email Address</div>
                      <div className="text-light small">concierge@sportclub.local</div>
                    </div>
                  </div>

                  <div className="d-flex gap-3 mb-4">
                    <Clock size={24} className="text-orange flex-shrink-0 mt-1" />
                    <div>
                      <div className="fw-bold text-white">Facility Operating Hours</div>
                      <div className="text-light small">
                        Monday – Friday: 05:00 AM – 11:00 PM<br />
                        Saturday – Sunday: 06:00 AM – 10:30 PM
                      </div>
                    </div>
                  </div>

                  {/* Location Preview Card */}
                  <div className="mt-auto pt-3 border-top border-secondary">
                    <div className="card-custom bg-navy-card border-secondary p-3 text-center">
                      <span className="text-lime small fw-bold">Visitor Parking Available</span>
                      <p className="text-muted small mb-0 mt-1">200+ reserved bays for club members and visitors with EV charging.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
};

export default Contact;
