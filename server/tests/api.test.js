const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Sport = require('../models/Sport');
const Facility = require('../models/Facility');
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const MembershipPlan = require('../models/MembershipPlan');

let adminToken = '';
let memberToken = '';
let testMemberId = '';
let testSportId = '';
let testFacilityId = '';
let testPlanId = '';
let testEventId = '';

beforeAll(async () => {
  // Connect to test database or local db
  const testUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/elite_sports_club_test';
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(testUri);
  }

  // Ensure test admin exists
  await User.deleteOne({ email: 'testadmin@sportclub.local' });
  const adminUser = await User.create({
    name: 'Test Administrator',
    email: 'testadmin@sportclub.local',
    phone: '+1 555-000-1111',
    password: 'Admin@12345',
    role: 'admin',
    status: 'active'
  });

  // Login as admin to get token
  const adminRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'testadmin@sportclub.local', password: 'Admin@12345' });
  adminToken = adminRes.body.token;

  // Ensure test member exists
  await User.deleteOne({ email: 'testmember@sportclub.local' });
  const memberUser = await User.create({
    name: 'Test Member',
    email: 'testmember@sportclub.local',
    phone: '+1 555-000-2222',
    password: 'Member@12345',
    role: 'member',
    status: 'active'
  });
  testMemberId = memberUser._id;

  const memberRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'testmember@sportclub.local', password: 'Member@12345' });
  memberToken = memberRes.body.token;

  // Setup test sport & facility
  let sport = await Sport.findOne({ name: 'Test Squash' });
  if (!sport) {
    sport = await Sport.create({
      name: 'Test Squash',
      category: 'Indoor',
      description: 'Dynamic indoor squash court',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48',
      price: 25,
      capacity: 4
    });
  }
  testSportId = sport._id;

  let facility = await Facility.findOne({ name: 'Test Squash Court 1' });
  if (!facility) {
    facility = await Facility.create({
      name: 'Test Squash Court 1',
      description: 'Glass-backed test court',
      capacity: 4,
      courtNumber: 'Court SQ-1',
      sport: testSportId
    });
  }
  testFacilityId = facility._id;

  let plan = await MembershipPlan.findOne({ name: 'Test Silver Plan' });
  if (!plan) {
    plan = await MembershipPlan.create({
      name: 'Test Silver Plan',
      durationMonths: 1,
      price: 39,
      benefits: ['Free locker access']
    });
  }
  testPlanId = plan._id;

  let event = await Event.findOne({ title: 'Test Squash Open' });
  if (!event) {
    event = await Event.create({
      title: 'Test Squash Open',
      description: 'Open tournament',
      sport: testSportId,
      venue: 'Main Squash Hall',
      eventDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      startTime: '09:00',
      endTime: '17:00',
      registrationDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      capacity: 2
    });
  }
  testEventId = event._id;
});

afterAll(async () => {
  // Cleanup test artifacts
  await User.deleteMany({ email: { $in: ['testadmin@sportclub.local', 'testmember@sportclub.local', 'newduplicate@test.com'] } });
  await Sport.deleteOne({ name: 'Test Squash' });
  await Facility.deleteOne({ name: 'Test Squash Court 1' });
  await MembershipPlan.deleteOne({ name: 'Test Silver Plan' });
  await Event.deleteOne({ title: 'Test Squash Open' });
  await Booking.deleteMany({ sport: testSportId });
  await mongoose.connection.close();
});

describe('1. Health Check & Public Endpoints', () => {
  it('GET /api/health should return status healthy', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('healthy');
  });

  it('GET /api/sports should return sports array', async () => {
    const res = await request(app).get('/api/sports');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.sports)).toBe(true);
  });
});

describe('2. Authentication & Authorization Security', () => {
  it('should register a new member successfully', async () => {
    await User.deleteOne({ email: 'newduplicate@test.com' });
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'New Test User',
        email: 'newduplicate@test.com',
        phone: '+1 555-999-8888',
        password: 'Password@123',
        confirmPassword: 'Password@123'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.user.role).toBe('member');
  });

  it('should reject duplicate email registration', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Duplicate Guy',
        email: 'newduplicate@test.com',
        phone: '+1 555-999-8888',
        password: 'Password@123',
        confirmPassword: 'Password@123'
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should reject login with wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'testmember@sportclub.local',
        password: 'WrongPassword999'
      });
    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should prevent member from accessing admin-only routes', async () => {
    const res = await request(app)
      .get('/api/members')
      .set('Authorization', `Bearer ${memberToken}`);
    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('should allow admin to access admin-only routes', async () => {
    const res = await request(app)
      .get('/api/members')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe('3. Booking Management & Conflict Prevention', () => {
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 5);

  it('should allow member to book an available slot', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${memberToken}`)
      .send({
        sport: testSportId,
        facility: testFacilityId,
        date: targetDate.toISOString(),
        startTime: '14:00',
        endTime: '15:00',
        notes: 'Test booking slot'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.booking.status).toBe('confirmed');
  });

  it('should REJECT overlapping booking for the same facility and date', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${memberToken}`)
      .send({
        sport: testSportId,
        facility: testFacilityId,
        date: targetDate.toISOString(),
        startTime: '14:30', // Overlaps 14:00 - 15:00
        endTime: '15:30',
        notes: 'Overlapping request'
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Conflict detected');
  });
});

describe('4. Event Registration Constraints', () => {
  it('should allow member to register for an upcoming event', async () => {
    const res = await request(app)
      .post(`/api/events/${testEventId}/register`)
      .set('Authorization', `Bearer ${memberToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should REJECT duplicate event registration by same member', async () => {
    const res = await request(app)
      .post(`/api/events/${testEventId}/register`)
      .set('Authorization', `Bearer ${memberToken}`);
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain('already registered');
  });
});

describe('5. Membership Checkout & Server-Side Price Verification', () => {
  it('should verify plan and activate membership calculating price server-side', async () => {
    const res = await request(app)
      .post('/api/memberships/checkout')
      .set('Authorization', `Bearer ${memberToken}`)
      .send({
        planId: testPlanId,
        paymentMethod: 'Credit Card (Demo)',
        amount: 1 // Malicious client attempt to pay $1 instead of plan price ($39)
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    // Server must use real plan price ($39) regardless of client payload
    expect(res.body.membership.pricePaid).toBe(39);
    expect(res.body.payment.amount).toBe(39);
  });
});
