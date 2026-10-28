const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Sport = require('../models/Sport');
const Coach = require('../models/Coach');
const Facility = require('../models/Facility');
const MembershipPlan = require('../models/MembershipPlan');
const Membership = require('../models/Membership');
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const Payment = require('../models/Payment');
const Announcement = require('../models/Announcement');
const Notification = require('../models/Notification');

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/elite_sports_club';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB:', mongoUri);

    // ==========================================
    // 1. DEFAULT USERS (ADMIN & MEMBER)
    // ==========================================
    console.log('[Seed] Checking default admin and member accounts...');

    let admin = await User.findOne({ email: 'admin@sportclub.local' });
    if (!admin) {
      admin = await User.create({
        name: 'System Administrator',
        email: 'admin@sportclub.local',
        phone: '+1 (555) 019-2831',
        password: 'Admin@12345',
        role: 'admin',
        status: 'active',
        bio: 'Chief Athletics Director & Club General Manager at Elite Sports Club.',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
      });
      console.log('✓ Created Default Admin: admin@sportclub.local / Admin@12345');
    } else {
      console.log('✓ Default Admin already exists, preserved.');
    }

    let member = await User.findOne({ email: 'member@sportclub.local' });
    if (!member) {
      member = await User.create({
        name: 'Demo Member',
        email: 'member@sportclub.local',
        phone: '+1 (555) 482-9102',
        password: 'Member@12345',
        role: 'member',
        status: 'active',
        bio: 'Passionate tennis & football enthusiast pursuing high athletic performance.',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80'
      });
      console.log('✓ Created Default Member: member@sportclub.local / Member@12345');
    } else {
      console.log('✓ Default Member already exists, preserved.');
    }

    // Additional sample members for rich dashboard statistics
    const sampleMembersData = [
      { name: 'Sarah Jenkins', email: 'sarah.j@example.com', phone: '+1 555-111-2222' },
      { name: 'Marcus Vance', email: 'marcus.v@example.com', phone: '+1 555-222-3333' },
      { name: 'Elena Rostova', email: 'elena.r@example.com', phone: '+1 555-333-4444' },
      { name: 'David Kim', email: 'david.k@example.com', phone: '+1 555-444-5555' },
      { name: 'Chloe Bennett', email: 'chloe.b@example.com', phone: '+1 555-555-6666' }
    ];

    for (const sm of sampleMembersData) {
      const exists = await User.findOne({ email: sm.email });
      if (!exists) {
        await User.create({
          name: sm.name,
          email: sm.email,
          phone: sm.phone,
          password: 'Member@12345',
          role: 'member',
          status: 'active',
          bio: 'Club regular member active in outdoor events.'
        });
      }
    }

    // ==========================================
    // 2. COACHES
    // ==========================================
    console.log('[Seed] Seeding coaches...');
    const coachSeedData = [
      {
        name: 'Coach Michael Vance',
        email: 'michael.vance@sportclub.local',
        phone: '+1 555-901-1122',
        specialization: 'High Performance Cricket & Football',
        experience: 12,
        bio: 'Former national level coach specializing in physical conditioning, strategic play, and athletic leadership.',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
        rating: 4.9,
        certifications: ['ICC Level 3 Certified', 'UEFA B License', 'Advanced Sports Nutrition'],
        status: 'active'
      },
      {
        name: 'Coach Serena Wallace',
        email: 'serena.wallace@sportclub.local',
        phone: '+1 555-901-3344',
        specialization: 'Pro Tennis & Badminton Head Coach',
        experience: 10,
        bio: 'Ex-WTA circuit player dedicated to stroke mechanics, footwork agility, and competitive match strategy.',
        photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
        rating: 4.95,
        certifications: ['USPTA Elite Professional', 'BWF Level 2 Coach'],
        status: 'active'
      },
      {
        name: 'Coach Marcus Sterling',
        email: 'marcus.sterling@sportclub.local',
        phone: '+1 555-901-5566',
        specialization: 'Basketball & Volleyball Conditioning',
        experience: 8,
        bio: 'Specialist in vertical jump biomechanics, team defense systems, and fast-break basketball execution.',
        photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
        rating: 4.85,
        certifications: ['FIBA Certified Coach', 'CSCS Strength Specialist'],
        status: 'active'
      },
      {
        name: 'Coach Ryan Phelps',
        email: 'ryan.phelps@sportclub.local',
        phone: '+1 555-901-7788',
        specialization: 'Aquatic Endurance & Olympic Swimming',
        experience: 9,
        bio: 'Passionate swimming mentor focusing on aerodynamic stroke efficiency, breath control, and competition stamina.',
        photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80',
        rating: 4.9,
        certifications: ['ASCA Level 4 Swimming Coach', 'Red Cross WSI Master'],
        status: 'active'
      },
      {
        name: 'Coach Jessica Ramirez',
        email: 'jessica.ramirez@sportclub.local',
        phone: '+1 555-901-9900',
        specialization: 'Strength Training, HIIT & Functional Fitness',
        experience: 7,
        bio: 'Cross-functional fitness trainer dedicated to muscle hypertrophy, injury rehabilitation, and cardiovascular stamina.',
        photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
        rating: 4.88,
        certifications: ['NASM Master Trainer', 'CrossFit Level 2', 'Kettlebell Specialist'],
        status: 'active'
      }
    ];

    const seededCoaches = [];
    for (const cData of coachSeedData) {
      let coach = await Coach.findOne({ email: cData.email });
      if (!coach) {
        coach = await Coach.create(cData);
      }
      seededCoaches.push(coach);
    }
    console.log(`✓ ${seededCoaches.length} Coaches verified.`);

    // ==========================================
    // 3. FACILITIES
    // ==========================================
    console.log('[Seed] Seeding facilities...');
    const facilitySeedData = [
      {
        name: 'Premier Cricket Oval',
        description: 'International-standard natural turf pitch with floodlights, digital scoreboard, and player pavilion.',
        courtNumber: 'Oval Main',
        capacity: 22,
        openingHours: { start: '06:00', end: '22:00' },
        availabilityStatus: 'available',
        sportName: 'Cricket',
        image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'FIFA Standard Turf Arena',
        description: 'Grade-A 4G synthetic turf with shock pad underlay, professional night lighting, and regulation goalposts.',
        courtNumber: 'Field A',
        capacity: 22,
        openingHours: { start: '06:00', end: '23:00' },
        availabilityStatus: 'available',
        sportName: 'Football',
        image: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Indoor Hardwood Basketball Court',
        description: 'NBA regulation polished maple court with breakaway rims, electronic shot clocks, and acoustic dampening.',
        courtNumber: 'Court 1',
        capacity: 15,
        openingHours: { start: '06:00', end: '22:00' },
        availabilityStatus: 'available',
        sportName: 'Basketball',
        image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Pro Badminton Arena',
        description: 'BWF certified anti-glare shock-absorbing synthetic green mats with overhead diffused LED illumination.',
        courtNumber: 'Hall Court 1',
        capacity: 6,
        openingHours: { start: '06:00', end: '22:00' },
        availabilityStatus: 'available',
        sportName: 'Badminton',
        image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Championship Clay Tennis Court',
        description: 'Premium Roland Garros style crushed brick clay surface with moisture-retention system and player benches.',
        courtNumber: 'Centre Court',
        capacity: 4,
        openingHours: { start: '06:00', end: '21:00' },
        availabilityStatus: 'available',
        sportName: 'Tennis',
        image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Beach Volleyball Sand Court',
        description: 'Washed silica sand court with adjustable Olympic net height, perimeter netting, and rinse-off stations.',
        courtNumber: 'Court Beach 1',
        capacity: 12,
        openingHours: { start: '07:00', end: '20:00' },
        availabilityStatus: 'available',
        sportName: 'Volleyball',
        image: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Olympic Aquatic Center',
        description: '50-meter temperature-controlled 8-lane competition swimming pool with diving blocks and electronic touchpads.',
        courtNumber: 'Pool Deck A',
        capacity: 30,
        openingHours: { start: '06:00', end: '21:00' },
        availabilityStatus: 'available',
        sportName: 'Swimming',
        image: 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'High-Performance Fitness Hub',
        description: 'Over 8,000 sq ft equipped with Hammer Strength, Eleiko Olympic lifting platforms, cardio theater, and recovery zone.',
        courtNumber: 'Gym Floor 1',
        capacity: 50,
        openingHours: { start: '05:00', end: '23:00' },
        availabilityStatus: 'available',
        sportName: 'Gym and Fitness',
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80'
      }
    ];

    const seededFacilities = [];
    for (const fData of facilitySeedData) {
      let facility = await Facility.findOne({ name: fData.name });
      if (!facility) {
        facility = await Facility.create(fData);
      }
      seededFacilities.push(facility);
    }
    console.log(`✓ ${seededFacilities.length} Facilities verified.`);

    // ==========================================
    // 4. SPORTS CATALOGUE
    // ==========================================
    console.log('[Seed] Seeding sports catalogue...');
    const sportsSeedData = [
      {
        name: 'Cricket',
        category: 'Outdoor',
        description: 'Experience professional cricket with turf pitch conditions, bowling machines, batting cages, and elite match play under floodlights.',
        image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=900&q=80',
        price: 35,
        capacity: 22,
        facilities: [seededFacilities[0]._id],
        coaches: [seededCoaches[0]._id],
        rules: [
          'Full protective equipment (helmet, pads, gloves) required on turf wickets.',
          'Rubber-soled or molded cricket spikes only.',
          'Punctuality is mandatory; bookings release after 15 minutes of no-show.'
        ],
        amenities: ['Bowling Machine', 'Leather & Synthetic Balls', 'Player Dugouts', 'Digital Scoreboard'],
        status: 'active'
      },
      {
        name: 'Football',
        category: 'Outdoor',
        description: 'Play on our all-weather FIFA-certified 4G turf arena. Ideal for 7v7, 11v11, academy training, and competitive leagues.',
        image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=900&q=80',
        price: 45,
        capacity: 22,
        facilities: [seededFacilities[1]._id],
        coaches: [seededCoaches[0]._id],
        rules: [
          'Turf shoes (TF) or firm ground cleats (FG) permitted; no metal studs.',
          'Shin guards are compulsory for competitive matches.',
          'Respect fair play and match referees at all times.'
        ],
        amenities: ['Floodlights', 'Regulation Goalposts', 'Match Balls & Bibs', 'Dressing Rooms'],
        status: 'active'
      },
      {
        name: 'Basketball',
        category: 'Indoor',
        description: 'Enjoy climate-controlled indoor basketball on spring-loaded hardwood maple courts with glass backboards and scoreboard.',
        image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=900&q=80',
        price: 30,
        capacity: 15,
        facilities: [seededFacilities[2]._id],
        coaches: [seededCoaches[2]._id],
        rules: [
          'Non-marking indoor basketball shoes only.',
          'No food or sugary drinks inside the court area.',
          'Hanging on rims is strictly prohibited except during live gameplay.'
        ],
        amenities: ['Air Conditioned', 'Spalding Official Balls', 'Electronic Shot Clocks', 'Bleacher Seating'],
        status: 'active'
      },
      {
        name: 'Badminton',
        category: 'Racket',
        description: 'Fast-paced indoor badminton on international BWF approved synthetic mats with anti-glare illumination and high clearance ceiling.',
        image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=900&q=80',
        price: 20,
        capacity: 6,
        facilities: [seededFacilities[3]._id],
        coaches: [seededCoaches[1]._id],
        rules: [
          'Strictly non-marking gum-sole shoes only.',
          'Singles or doubles play permitted within booked time slot.',
          'Bring your own rackets or rent premium Yonex sets at reception.'
        ],
        amenities: ['Yonex Rackets for Rent', 'Feather & Nylon Shuttles', 'Air Conditioned Court', 'Locker Access'],
        status: 'active'
      },
      {
        name: 'Tennis',
        category: 'Racket',
        description: 'Master your serve and volley on championship red clay and synthetic hard courts featuring ball machines and stringing services.',
        image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=900&q=80',
        price: 35,
        capacity: 4,
        facilities: [seededFacilities[4]._id],
        coaches: [seededCoaches[1]._id],
        rules: [
          'Herringbone clay-court shoes required on clay courts.',
          'Sweep and drag the clay court with the brush after your session.',
          'Quiet sportsmanship during ongoing rallies on adjacent courts.'
        ],
        amenities: ['Spinfire Ball Machine', 'Wilson US Open Balls', 'Racket Stringing Service', 'Court Lights'],
        status: 'active'
      },
      {
        name: 'Volleyball',
        category: 'Outdoor',
        description: 'Beach volleyball sand court with deep filtered silica sand and Olympic-spec net systems for casual and tournament play.',
        image: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=900&q=80',
        price: 25,
        capacity: 12,
        facilities: [seededFacilities[5]._id],
        coaches: [seededCoaches[2]._id],
        rules: [
          'Barefoot or beach sand socks recommended.',
          'Rinse sand at designated foot stations before entering club building.',
          'Maintain clean court perimeter free of personal belongings.'
        ],
        amenities: ['Mikasa Beach Balls', 'Wash Stations', 'Sun Shade Canopies', 'Boundary Antennas'],
        status: 'active'
      },
      {
        name: 'Swimming',
        category: 'Aquatic',
        description: 'Olympic-sized 50m heated pool with advanced ozonation filtration, dedicated lap swimming lanes, and certified lifeguards on duty.',
        image: 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?auto=format&fit=crop&w=900&q=80',
        price: 20,
        capacity: 30,
        facilities: [seededFacilities[6]._id],
        coaches: [seededCoaches[3]._id],
        rules: [
          'Swimming cap and appropriate swimwear required for all swimmers.',
          'Shower thoroughly before entering the pool.',
          'No diving in shallow zones (marked with safety lines).'
        ],
        amenities: ['Heated Water 27°C', 'Steam & Sauna Rooms', 'Kickboards & Pull Buoys', 'Lifeguard on Duty'],
        status: 'active'
      },
      {
        name: 'Gym and Fitness',
        category: 'Fitness',
        description: 'Cutting-edge functional strength center with free weights, cardio machines, HIIT turf zone, and dedicated recovery suites.',
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=80',
        price: 15,
        capacity: 50,
        facilities: [seededFacilities[7]._id],
        coaches: [seededCoaches[4]._id],
        rules: [
          'Wipe down equipment after each use with provided sanitizers.',
          'Re-rack all dumbbells, barbells, and weight plates properly.',
          'Closed-toe athletic shoes and clean workout apparel mandatory.'
        ],
        amenities: ['Eleiko Barbells', 'Peloton Bikes', 'Towel Service', 'Protein Shake Bar'],
        status: 'active'
      }
    ];

    const seededSports = [];
    for (const sData of sportsSeedData) {
      let sport = await Sport.findOne({ name: sData.name });
      if (!sport) {
        sport = await Sport.create(sData);
      } else {
        // Update facilities and coaches links if missing
        sport.facilities = sData.facilities;
        sport.coaches = sData.coaches;
        await sport.save();
      }
      seededSports.push(sport);
    }
    console.log(`✓ ${seededSports.length} Sports verified.`);

    // ==========================================
    // 5. MEMBERSHIP PLANS
    // ==========================================
    console.log('[Seed] Seeding membership plans...');
    const planSeedData = [
      {
        name: 'Monthly Starter',
        tagline: 'Great flexibility for active individuals',
        durationMonths: 1,
        price: 49,
        benefits: [
          'Access to all general gym & fitness facilities',
          '2 complimentary court bookings per month',
          'Free locker and shower access',
          'Discounted guest passes (10% off)'
        ],
        badge: 'Flexible',
        isPopular: false,
        status: 'active'
      },
      {
        name: 'Quarterly Pro',
        tagline: 'Ideal for consistent sports progression',
        durationMonths: 3,
        price: 129,
        benefits: [
          'Full gym & Olympic pool access',
          '8 court / turf bookings per month',
          '1 private coaching assessment session',
          '15% discount on club tournament entries',
          'Access to recovery sauna & steam rooms'
        ],
        badge: 'Recommended',
        isPopular: true,
        status: 'active'
      },
      {
        name: 'Half-Yearly Elite',
        tagline: 'Serious training package for competitors',
        durationMonths: 6,
        price: 239,
        benefits: [
          'Unlimited gym & swimming pool access',
          '18 court bookings per month',
          '3 complimentary coach sessions',
          'Priority booking window 7 days in advance',
          'Exclusive club jersey and sports kitbag',
          'Free sports nutrition consult'
        ],
        badge: 'Value Choice',
        isPopular: false,
        status: 'active'
      },
      {
        name: 'Annual Champion',
        tagline: 'Ultimate VIP membership for premier athletes',
        durationMonths: 12,
        price: 429,
        benefits: [
          'All-inclusive 365-day VIP access',
          'Unlimited court bookings during off-peak and peak',
          '6 one-on-one coaching masterclasses',
          'Complimentary registration in all club tournaments',
          'Reserved parking bay & VIP lounge access',
          'Full family guest privileges (4 passes/month)'
        ],
        badge: 'VIP All-Access',
        isPopular: false,
        status: 'active'
      }
    ];

    const seededPlans = [];
    for (const pData of planSeedData) {
      let plan = await MembershipPlan.findOne({ name: pData.name });
      if (!plan) {
        plan = await MembershipPlan.create(pData);
      }
      seededPlans.push(plan);
    }
    console.log(`✓ ${seededPlans.length} Membership Plans verified.`);

    // ==========================================
    // 6. DEFAULT MEMBER'S ACTIVE MEMBERSHIP
    // ==========================================
    console.log('[Seed] Checking default member active membership...');
    let existingMembership = await Membership.findOne({ user: member._id, status: 'active' });
    if (!existingMembership) {
      const annualPlan = seededPlans[1]; // Quarterly Pro
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 3);

      const paymentRef = `PAY-MEM-SEED-${Date.now()}`;
      await Membership.create({
        user: member._id,
        plan: annualPlan._id,
        planName: annualPlan.name,
        startDate,
        endDate,
        pricePaid: annualPlan.price,
        status: 'active',
        paymentReference: paymentRef
      });

      // Record corresponding payment
      await Payment.create({
        paymentReference: paymentRef,
        member: member._id,
        amount: annualPlan.price,
        currency: 'USD',
        paymentMethod: 'Credit Card (Demo)',
        type: 'membership',
        relatedId: annualPlan._id,
        description: `${annualPlan.name} Membership (3 months)`,
        status: 'completed',
        isDemo: true
      });

      console.log('✓ Created active Quarterly Pro membership for Demo Member');
    }

    // ==========================================
    // 7. TOURNAMENTS & EVENTS
    // ==========================================
    console.log('[Seed] Seeding upcoming & past events...');
    const now = new Date();
    const eventSeedData = [
      {
        title: 'Elite Club Open Tennis Championship 2026',
        description: 'Singles and Doubles tournament featuring our championship red clay court. Open to intermediate and advanced members with professional line umpires.',
        sport: seededSports[4]._id, // Tennis
        venue: 'Centre Court & Court 2',
        eventDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000), // in 14 days
        startTime: '09:00',
        endTime: '18:00',
        registrationDeadline: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
        capacity: 32,
        prizePool: '$2,500 + Winner Silver Cup',
        registrationFee: 25,
        image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=900&q=80',
        status: 'upcoming',
        participants: [
          { user: member._id, registeredAt: new Date(), status: 'registered' }
        ]
      },
      {
        title: 'Metropolitan 7v7 Football League Cup',
        description: 'Competitive 16-team weekend tournament on our floodlit FIFA-standard artificial turf. Trophies, medals, and scout appearances.',
        sport: seededSports[1]._id, // Football
        venue: 'FIFA Standard Turf Arena',
        eventDate: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000), // in 21 days
        startTime: '16:00',
        endTime: '22:00',
        registrationDeadline: new Date(now.getTime() + 18 * 24 * 60 * 60 * 1000),
        capacity: 16,
        prizePool: '$3,000 + Champions Shield',
        registrationFee: 50,
        image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=900&q=80',
        status: 'upcoming',
        participants: []
      },
      {
        title: 'All-State Badminton Masters Cup',
        description: 'Fast-paced weekend tournament on international green mats. Categories include Men singles, Women singles, and Mixed doubles.',
        sport: seededSports[3]._id, // Badminton
        venue: 'Pro Badminton Arena',
        eventDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
        startTime: '10:00',
        endTime: '19:00',
        registrationDeadline: new Date(now.getTime() + 25 * 24 * 60 * 60 * 1000),
        capacity: 24,
        prizePool: '$1,500 + Yonex Pro Kits',
        registrationFee: 20,
        image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=900&q=80',
        status: 'upcoming',
        participants: []
      },
      {
        title: 'Spring Aquatic Sprint Meet',
        description: '50m and 100m freestyle, backstroke, and butterfly sprint events in our heated Olympic pool with precision electronic timing pads.',
        sport: seededSports[6]._id, // Swimming
        venue: 'Olympic Aquatic Center',
        eventDate: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000),
        startTime: '08:30',
        endTime: '14:00',
        registrationDeadline: new Date(now.getTime() + 40 * 24 * 60 * 60 * 1000),
        capacity: 40,
        prizePool: '$1,200 + Gold Medals',
        registrationFee: 15,
        image: 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?auto=format&fit=crop&w=900&q=80',
        status: 'upcoming',
        participants: []
      }
    ];

    for (const eData of eventSeedData) {
      const exists = await Event.findOne({ title: eData.title });
      if (!exists) {
        await Event.create(eData);
      }
    }
    console.log('✓ Tournaments verified.');

    // ==========================================
    // 8. SAMPLE BOOKINGS & PAYMENTS
    // ==========================================
    console.log('[Seed] Seeding sample bookings...');
    const bookingCount = await Booking.countDocuments();
    if (bookingCount === 0) {
      // Create a confirmed booking for Demo Member tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      await Booking.create({
        member: member._id,
        sport: seededSports[4]._id, // Tennis
        facility: seededFacilities[4]._id, // Centre Court
        date: tomorrow,
        startTime: '10:00',
        endTime: '11:00',
        price: 35,
        notes: 'Pre-tournament practice session with demo balls.',
        status: 'confirmed'
      });

      // Another booking in 3 days
      const threeDaysLater = new Date();
      threeDaysLater.setDate(threeDaysLater.getDate() + 3);
      await Booking.create({
        member: member._id,
        sport: seededSports[1]._id, // Football
        facility: seededFacilities[1]._id, // Turf
        date: threeDaysLater,
        startTime: '17:00',
        endTime: '18:00',
        price: 45,
        notes: 'Evening friendly match with club friends.',
        status: 'pending'
      });

      console.log('✓ Sample bookings created for Demo Member.');
    }

    // ==========================================
    // 9. ANNOUNCEMENTS
    // ==========================================
    console.log('[Seed] Seeding club announcements...');
    const announcementSeedData = [
      {
        title: 'Olympic Swimming Pool Annual Maintenance Complete',
        message: 'We are pleased to announce that scheduled ozonation filter upgrades and deep-cleaning on the Olympic pool deck have concluded. Normal operating hours resume today!',
        audience: 'all',
        priority: 'medium',
        status: 'published',
        createdBy: admin._id
      },
      {
        title: 'New Strength & Cardio Machines Installed in Gym Floor 1',
        message: '10 brand-new Hammer Strength iso-lateral machines and Peloton commercial indoor bikes have arrived at High-Performance Fitness Hub. Book a free orientation with Coach Jessica!',
        audience: 'members',
        priority: 'high',
        status: 'published',
        createdBy: admin._id
      },
      {
        title: 'Registration Open: Elite Open Tennis Championship 2026',
        message: 'Members can now reserve their tournament bracket in the Open Tennis Championship. Limited to 32 players; registration closes in 10 days.',
        audience: 'all',
        priority: 'high',
        status: 'published',
        createdBy: admin._id
      }
    ];

    for (const aData of announcementSeedData) {
      const exists = await Announcement.findOne({ title: aData.title });
      if (!exists) {
        await Announcement.create(aData);
      }
    }
    console.log('✓ Announcements verified.');

    // ==========================================
    // 10. NOTIFICATIONS FOR DEMO MEMBER
    // ==========================================
    console.log('[Seed] Seeding sample notifications...');
    const notifCount = await Notification.countDocuments({ user: member._id });
    if (notifCount === 0) {
      await Notification.create([
        {
          user: member._id,
          title: 'Welcome to Elite Sports Club',
          message: 'Your account is active! Explore sports, reserve facilities, and sign up for upcoming tournaments.',
          type: 'system',
          isRead: false,
          link: '/member/dashboard'
        },
        {
          user: member._id,
          title: 'Membership Activated: Quarterly Pro',
          message: 'Your Quarterly Pro membership is active with full access to courts, gym, and Olympic pool.',
          type: 'membership',
          isRead: false,
          link: '/member/membership'
        },
        {
          user: member._id,
          title: 'Tennis Court Booking Confirmed',
          message: 'Your session on Centre Court for tomorrow 10:00 - 11:00 AM has been confirmed.',
          type: 'booking',
          isRead: true,
          link: '/member/my-bookings'
        }
      ]);
      console.log('✓ Demo member notifications created.');
    }

    console.log('\n======================================================');
    console.log('🎉 ELITE SPORTS CLUB DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('======================================================');
    console.log('ADMIN LOGIN:');
    console.log('  Email:    admin@sportclub.local');
    console.log('  Password: Admin@12345');
    console.log('------------------------------------------------------');
    console.log('MEMBER LOGIN:');
    console.log('  Email:    member@sportclub.local');
    console.log('  Password: Member@12345');
    console.log('======================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedDatabase();
