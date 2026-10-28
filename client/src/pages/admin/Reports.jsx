import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  FileBarChart,
  Download,
  Calendar,
  Users,
  Trophy,
  BookmarkCheck,
  CreditCard,
  CalendarDays
} from 'lucide-react';
import AdminHeader from '../../components/layout/AdminHeader';
import Button from '../../components/common/Button';
import FormInput from '../../components/forms/FormInput';
import { reportService } from '../../services/reportService';

const Reports = () => {
  const { onToggleMobile } = useOutletContext();
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [downloading, setDownloading] = useState('');

  const handleExport = async (reportType, exportFn) => {
    setDownloading(reportType);
    try {
      await exportFn(dateRange);
      toast.success(`${reportType} CSV export generated and downloaded!`);
    } catch (err) {
      toast.error(`Failed to export ${reportType}`);
    } finally {
      setDownloading('');
    }
  };

  const reportModules = [
    {
      id: 'members',
      title: 'Member Registrations Report',
      description: 'Comprehensive roster of registered members with contact details, status, and join date.',
      icon: Users,
      color: 'text-primary',
      bg: 'bg-blue-subtle',
      action: () => handleExport('Member Registrations', reportService.exportMembersCSV)
    },
    {
      id: 'bookings',
      title: 'Facility & Court Bookings Report',
      description: 'All past and upcoming court reservation logs, facilities used, times, fees, and approval status.',
      icon: BookmarkCheck,
      color: 'text-success',
      bg: 'bg-lime-subtle',
      action: () => handleExport('Bookings', reportService.exportBookingsCSV)
    },
    {
      id: 'payments',
      title: 'Revenue & Payments Ledger',
      description: 'Audited ledger of all financial settlements, transaction reference codes, methods, and amounts.',
      icon: CreditCard,
      color: 'text-orange',
      bg: 'bg-orange-subtle',
      action: () => handleExport('Payments Ledger', reportService.exportPaymentsCSV)
    },
    {
      id: 'sports',
      title: 'Sports Program Participation Report',
      description: 'Breakdown of bookings and tournament entries grouped by sports discipline.',
      icon: Trophy,
      color: 'text-purple',
      bg: 'bg-light',
      action: () => handleExport('Sports Participation', reportService.exportSportsCSV)
    }
  ];

  return (
    <>
      <AdminHeader title="Executive Reports & Export" breadcrumb="Reports" onToggleMobile={onToggleMobile} />

      <div className="dashboard-content">
        <div className="mb-4">
          <h4 className="font-heading fw-bold text-navy mb-1">Club Intelligence & Data Export</h4>
          <span className="text-muted small">
            Generate and export CSV reports directly from the active MongoDB database with date-range filters
          </span>
        </div>

        {/* Date Filter Bar */}
        <div className="card-custom p-4 mb-4 bg-white">
          <h6 className="font-heading fw-bold text-navy mb-3 d-flex align-items-center gap-2">
            <Calendar size={18} className="text-lime" /> Optional Date Range Filter
          </h6>
          <div className="row g-3 align-items-end">
            <div className="col-md-4">
              <FormInput
                label="Start Date"
                name="startDate"
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              />
            </div>
            <div className="col-md-4">
              <FormInput
                label="End Date"
                name="endDate"
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              />
            </div>
            <div className="col-md-4 mb-3">
              <button
                className="btn btn-outline-secondary w-100 py-2"
                onClick={() => setDateRange({ startDate: '', endDate: '' })}
              >
                Clear Date Filter
              </button>
            </div>
          </div>
        </div>

        {/* Report Cards Grid */}
        <div className="row g-4">
          {reportModules.map((mod) => {
            const Icon = mod.icon;
            return (
              <div key={mod.id} className="col-lg-6">
                <div className="card-custom p-4 h-100 d-flex flex-column justify-content-between">
                  <div className="d-flex align-items-start gap-3 mb-3">
                    <div className={`p-3 rounded-3 ${mod.bg} ${mod.color} flex-shrink-0`}>
                      <Icon size={28} />
                    </div>
                    <div>
                      <h5 className="font-heading fw-bold text-navy mb-1">{mod.title}</h5>
                      <p className="text-muted small mb-0">{mod.description}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-top mt-auto d-flex justify-content-between align-items-center">
                    <span className="badge bg-light text-navy border">CSV Spreadsheet Format</span>
                    <Button
                      variant="lime"
                      size="sm"
                      icon={Download}
                      loading={downloading === mod.title}
                      onClick={mod.action}
                    >
                      Export CSV
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Reports;
