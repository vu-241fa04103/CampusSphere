const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Resource = require('../models/Resource');
const Mentorship = require('../models/Mentorship');
const Doubt = require('../models/Doubt');
const Notice = require('../models/Notice');
const Quiz = require('../models/Quiz');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/campussphere';
    console.log(`Connecting to MongoDB at: ${mongoUri}`);
    await mongoose.connect(mongoUri);

    console.log('Clearing existing CampusSphere collections...');
    await User.deleteMany();
    await Resource.deleteMany();
    await Mentorship.deleteMany();
    await Doubt.deleteMany();
    await Notice.deleteMany();
    await Quiz.deleteMany();

    console.log('Seeding specialized users across ALL 9 Engineering Departments...');

    // 1. CSE
    const cseFaculty = await User.create({
      name: 'Dr. K. Srinivas Rao (Professor)',
      email: 'lecturer@campussphere.edu',
      password: 'faculty123',
      regNo: 'FAC-CSE-012',
      department: 'Computer Science',
      specialization: 'Cloud & Systems Architecture',
      year: 'Faculty',
      role: 'lecturer',
      bio: 'Head of Department & Professor in Computer Science. Recommends textbook readings, syllabus guides, and official previous question papers.',
      skills: ['Operating Systems', 'System Architecture', 'Curriculum Design'],
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150'
    });
    const cseSenior = await User.create({
      name: 'Ananya Verma (4th Year CSE)',
      email: 'senior23@campussphere.edu',
      password: 'password123',
      regNo: '231FA04019',
      department: 'Computer Science',
      specialization: 'Full-Stack Web Dev',
      year: '4th Year',
      role: 'mentor',
      bio: 'Senior 4th Year CSE Mentor (231FA0 Series). Actively sharing previous year papers and interview notes with juniors.',
      skills: ['Full Stack MERN', 'System Design', 'Previous Year QPs'],
      availability: 'Mon & Thu 6:00 PM - 8:00 PM',
      rating: 5.0,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
    });
    const cseStudent = await User.create({
      name: 'Rohan Sharma (3rd Year CSE)',
      email: 'student24@campussphere.edu',
      password: 'password123',
      regNo: '241FA04103',
      department: 'Computer Science',
      specialization: 'Cloud & Systems Architecture',
      year: '3rd Year',
      role: 'student',
      bio: '3rd Year CSE Student (241FA0 Series). Specializing in Cloud & Systems Architecture.',
      skills: ['React.js', 'Node.js', 'Data Structures', 'Python'],
      avatar: 'https://images.unsplash.com/photo-1535713875000-0e785bb7f6a7?w=150'
    });

    // 2. BIOTECHNOLOGY
    const btFaculty = await User.create({
      name: 'Dr. Meenakshi Sundaram (Assoc. Prof)',
      email: 'btfaculty@campussphere.edu',
      password: 'faculty123',
      regNo: 'FAC-BT-008',
      department: 'Biotechnology',
      specialization: 'Genetic Engineering & rDNA',
      year: 'Faculty',
      role: 'lecturer',
      bio: 'Associate Professor, Department of Biotechnology. Lead researcher in Recombinant DNA Technology and Bioinformatics analysis.',
      skills: ['Genetic Engineering', 'Bioinformatics', 'Bioprocess Engineering'],
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
    });
    const btSenior = await User.create({
      name: 'Siddharth Nair (4th Year BT)',
      email: 'btsenior23@campussphere.edu',
      password: 'password123',
      regNo: '231FA08012',
      department: 'Biotechnology',
      specialization: 'Bioinformatics & Computational Biology',
      year: '4th Year',
      role: 'mentor',
      bio: 'Senior 4th Year Biotech Mentor (231FA0 Series). Guiding juniors in lab manuals, molecular biology protocols, and gate biotech preparation.',
      skills: ['Bioinformatics Pipelines', 'PCR Protocols', 'Genetic Engineering QPs'],
      availability: 'Tue & Fri 5:00 PM - 7:00 PM',
      rating: 4.9,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
    });
    const btStudent = await User.create({
      name: 'Divya Reddy (3rd Year BT)',
      email: 'btstudent24@campussphere.edu',
      password: 'password123',
      regNo: '241FA08044',
      department: 'Biotechnology',
      specialization: 'Genetic Engineering & rDNA',
      year: '3rd Year',
      role: 'student',
      bio: '3rd Year Biotechnology Student (241FA0 Series). Studying Immunology, Recombinant DNA Tech, and Bioprocess Engineering.',
      skills: ['DNA Extraction', 'Cell Culture', 'Python for Bioinformatics'],
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150'
    });

    // 3. AI & DATA SCIENCE
    const aiFaculty = await User.create({
      name: 'Dr. Rajesh Khanna (Professor AI)',
      email: 'aifaculty@campussphere.edu',
      password: 'faculty123',
      regNo: 'FAC-AI-005',
      department: 'AI & Data Science',
      specialization: 'Deep Learning & NLP',
      year: 'Faculty',
      role: 'lecturer',
      bio: 'Professor in AI & Data Science. Expert in Transformer Architectures, Computer Vision, and Deep Neural Networks.',
      skills: ['Deep Learning', 'PyTorch', 'Large Language Models'],
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
    });
    const aiSenior = await User.create({
      name: 'Aditya Sen (4th Year AI)',
      email: 'aisenior23@campussphere.edu',
      password: 'password123',
      regNo: '231FA12015',
      department: 'AI & Data Science',
      specialization: 'Big Data Engineering & MLOps',
      year: '4th Year',
      role: 'mentor',
      bio: 'Senior 4th Year AI Mentor. Passionate about Kaggle competitions, MLOps deployment, and neural networks.',
      skills: ['TensorFlow', 'XGBoost', 'MLflow', 'HuggingFace'],
      availability: 'Wed & Sat 6:00 PM - 8:00 PM',
      rating: 5.0,
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150'
    });
    const aiStudent = await User.create({
      name: 'Sneha Roy (3rd Year AI)',
      email: 'aistudent24@campussphere.edu',
      password: 'password123',
      regNo: '241FA12030',
      department: 'AI & Data Science',
      specialization: 'Deep Learning & NLP',
      year: '3rd Year',
      role: 'student',
      bio: '3rd Year AI & DS Student. Researching Natural Language Processing and Computer Vision models.',
      skills: ['Python', 'Pandas', 'Scikit-Learn', 'PyTorch'],
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
    });

    // 4. ELECTRONICS & COMMUNICATION
    const eceFaculty = await User.create({
      name: 'Dr. V. Ramanathan (Professor ECE)',
      email: 'ecefaculty@campussphere.edu',
      password: 'faculty123',
      regNo: 'FAC-EC-014',
      department: 'Electronics & Comm',
      specialization: 'VLSI & Chip Design',
      year: 'Faculty',
      role: 'lecturer',
      bio: 'Head of Electronics & Communication. Specialist in CMOS VLSI Design, Verilog synthesis, and Wireless Communications.',
      skills: ['VLSI Design', 'Verilog HDL', 'Embedded C', '5G Communications'],
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
    });
    const eceSenior = await User.create({
      name: 'Kavya Iyer (4th Year ECE)',
      email: 'ecesenior23@campussphere.edu',
      password: 'password123',
      regNo: '231FA05022',
      department: 'Electronics & Comm',
      specialization: 'Embedded Systems & IoT',
      year: '4th Year',
      role: 'mentor',
      bio: 'Senior 4th Year ECE Mentor. Placed at Texas Instruments. Helping juniors with FPGA lab manuals and digital circuit design.',
      skills: ['FPGA Design', 'Cadence Virtuoso', 'Embedded Systems'],
      availability: 'Mon & Fri 5:00 PM - 7:00 PM',
      rating: 4.9,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'
    });
    const eceStudent = await User.create({
      name: 'Arjun Menon (3rd Year ECE)',
      email: 'ecestudent24@campussphere.edu',
      password: 'password123',
      regNo: '241FA05060',
      department: 'Electronics & Comm',
      specialization: 'VLSI & Chip Design',
      year: '3rd Year',
      role: 'student',
      bio: '3rd Year ECE Student focusing on CMOS circuits, Digital Communication, and Microcontrollers.',
      skills: ['Verilog', 'MATLAB', 'Signals & Systems'],
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150'
    });

    // 5. MECHANICAL ENGINEERING
    const mechFaculty = await User.create({
      name: 'Dr. Anand Kulkarni (Professor MECH)',
      email: 'mechfaculty@campussphere.edu',
      password: 'faculty123',
      regNo: 'FAC-ME-009',
      department: 'Mechanical',
      specialization: 'Thermal & Fluid Engineering',
      year: 'Faculty',
      role: 'lecturer',
      bio: 'Professor in Mechanical Engineering. Researching Fluid Dynamics, Heat Exchanger optimization, and CFD simulations.',
      skills: ['Thermodynamics', 'Fluid Mechanics', 'ANSYS Fluent', 'Heat Transfer'],
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150'
    });
    const mechSenior = await User.create({
      name: 'Pranav Deshmukh (4th Year MECH)',
      email: 'mechsenior23@campussphere.edu',
      password: 'password123',
      regNo: '231FA02010',
      department: 'Mechanical',
      specialization: 'Automotive & EV Powertrains',
      year: '4th Year',
      role: 'mentor',
      bio: 'Senior 4th Year Mechanical Mentor. Captain of Formula Student Racing Team. Mentoring in CAD/CAM and Strength of Materials.',
      skills: ['SolidWorks', 'FEA Analysis', 'Manufacturing Processes'],
      availability: 'Tue & Thu 6:00 PM - 8:00 PM',
      rating: 4.9,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
    });
    const mechStudent = await User.create({
      name: 'Tarun Gupta (3rd Year MECH)',
      email: 'mechstudent24@campussphere.edu',
      password: 'password123',
      regNo: '241FA02045',
      department: 'Mechanical',
      specialization: 'Thermal & Fluid Engineering',
      year: '3rd Year',
      role: 'student',
      bio: '3rd Year Mechanical Student studying Fluid Dynamics, Heat Transfer, and Turbo-machinery.',
      skills: ['AutoCAD', 'Thermodynamics', 'Material Science'],
      avatar: 'https://images.unsplash.com/photo-1535713875000-0e785bb7f6a7?w=150'
    });

    // 6. CIVIL ENGINEERING
    const civilFaculty = await User.create({
      name: 'Dr. Sunita Murthy (Professor CIVIL)',
      email: 'civilfaculty@campussphere.edu',
      password: 'faculty123',
      regNo: 'FAC-CE-011',
      department: 'Civil',
      specialization: 'Structural Engineering & Bridges',
      year: 'Faculty',
      role: 'lecturer',
      bio: 'Professor in Civil Engineering. Expert in Reinforced Concrete Design (RCC), Earthquake Engineering, and Soil Mechanics.',
      skills: ['RCC Design', 'Structural Analysis', 'STAAD Pro', 'Geotechnical Engg'],
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
    });
    const civilSenior = await User.create({
      name: 'Harish Kumar (4th Year CIVIL)',
      email: 'civilsenior23@campussphere.edu',
      password: 'password123',
      regNo: '231FA01008',
      department: 'Civil',
      specialization: 'Smart Cities & BIM Construction',
      year: '4th Year',
      role: 'mentor',
      bio: 'Senior 4th Year Civil Mentor. Sharing solved past exam papers for RCC, Structural Analysis, and Surveying.',
      skills: ['STAAD Pro', 'AutoCAD Civil 3D', 'Surveying Techniques'],
      availability: 'Wed & Fri 5:00 PM - 7:00 PM',
      rating: 4.8,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
    });
    const civilStudent = await User.create({
      name: 'Pooja Hegde (3rd Year CIVIL)',
      email: 'civilstudent24@campussphere.edu',
      password: 'password123',
      regNo: '241FA01032',
      department: 'Civil',
      specialization: 'Structural Engineering & Bridges',
      year: '3rd Year',
      role: 'student',
      bio: '3rd Year Civil Student studying RCC Structures, Soil Mechanics, and Environmental Engineering.',
      skills: ['Surveying', 'Concrete Technology', 'Structural Analysis'],
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150'
    });

    // 7. ELECTRICAL & ELECTRONICS
    const eeeFaculty = await User.create({
      name: 'Dr. S. Balaji (Professor EEE)',
      email: 'eeefaculty@campussphere.edu',
      password: 'faculty123',
      regNo: 'FAC-EE-007',
      department: 'Electrical & Electronics',
      specialization: 'Power Electronics & Inverters',
      year: 'Faculty',
      role: 'lecturer',
      bio: 'Professor in EEE. Leading research in Power Systems, Renewable Microgrids, and EV Inverter drives.',
      skills: ['Power Electronics', 'Electrical Machines', 'MATLAB Simulink'],
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
    });
    const eeeSenior = await User.create({
      name: 'Vikram Das (4th Year EEE)',
      email: 'eeesenior23@campussphere.edu',
      password: 'password123',
      regNo: '231FA06018',
      department: 'Electrical & Electronics',
      specialization: 'Electric Vehicles & Drives',
      year: '4th Year',
      role: 'mentor',
      bio: 'Senior 4th Year EEE Mentor. Helping juniors in transformer phasor derivations and power converter circuit analysis.',
      skills: ['Power Converter Design', 'Simulink', 'EV Battery Systems'],
      availability: 'Mon & Thu 5:00 PM - 7:00 PM',
      rating: 4.9,
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150'
    });
    const eeeStudent = await User.create({
      name: 'Varun Teja (3rd Year EEE)',
      email: 'eeestudent24@campussphere.edu',
      password: 'password123',
      regNo: '241FA06042',
      department: 'Electrical & Electronics',
      specialization: 'Power Electronics & Inverters',
      year: '3rd Year',
      role: 'student',
      bio: '3rd Year EEE Student studying Power Systems, Control Engineering, and Thyristor Inverters.',
      skills: ['Circuit Analysis', 'Control Systems', 'Machines Lab'],
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150'
    });

    // 8. INFORMATION TECHNOLOGY
    const itFaculty = await User.create({
      name: 'Dr. N. Chandrasekhar (Professor IT)',
      email: 'itfaculty@campussphere.edu',
      password: 'faculty123',
      regNo: 'FAC-IT-016',
      department: 'Information Tech',
      specialization: 'Enterprise Cloud & AWS/Azure',
      year: 'Faculty',
      role: 'lecturer',
      bio: 'Professor in Information Technology. Specialist in Cloud Virtualization, Network Security, and DevOps Pipelines.',
      skills: ['AWS Cloud', 'Network Security', 'Microservices'],
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150'
    });
    const itSenior = await User.create({
      name: 'Tanvi Joshi (4th Year IT)',
      email: 'itsenior23@campussphere.edu',
      password: 'password123',
      regNo: '231FA11014',
      department: 'Information Tech',
      specialization: 'DevOps, CI/CD & Microservices',
      year: '4th Year',
      role: 'mentor',
      bio: 'Senior 4th Year IT Mentor. Placed at Amazon. Sharing Docker cheat sheets, Java full-stack notes, and previous year papers.',
      skills: ['Docker & Kubernetes', 'Java Spring Boot', 'AWS Solutions'],
      availability: 'Tue & Sat 6:00 PM - 8:00 PM',
      rating: 5.0,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
    });
    const itStudent = await User.create({
      name: 'Kunal Kapoor (3rd Year IT)',
      email: 'itstudent24@campussphere.edu',
      password: 'password123',
      regNo: '241FA11050',
      department: 'Information Tech',
      specialization: 'Enterprise Cloud & AWS/Azure',
      year: '3rd Year',
      role: 'student',
      bio: '3rd Year IT Student learning Cloud Architecture, DevOps Pipelines, and Cryptography.',
      skills: ['Java', 'React', 'Docker', 'Network Security'],
      avatar: 'https://images.unsplash.com/photo-1535713875000-0e785bb7f6a7?w=150'
    });

    // 9. CHEMICAL ENGINEERING
    const chemFaculty = await User.create({
      name: 'Dr. G. Venkat Rao (Professor CHEM)',
      email: 'chemfaculty@campussphere.edu',
      password: 'faculty123',
      regNo: 'FAC-CH-003',
      department: 'Chemical Engineering',
      specialization: 'Reaction Engineering & Catalyst Design',
      year: 'Faculty',
      role: 'lecturer',
      bio: 'Professor in Chemical Engineering. Researching Mass Transfer Distillation, Heterogeneous Catalysis, and Plant Safety.',
      skills: ['Mass Transfer', 'Reactor Engineering (CRE)', 'Process Simulation'],
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
    });
    const chemSenior = await User.create({
      name: 'Manish Pandey (4th Year CHEM)',
      email: 'chemsenior23@campussphere.edu',
      password: 'password123',
      regNo: '231FA09005',
      department: 'Chemical Engineering',
      specialization: 'Petrochemical & Refining Processes',
      year: '4th Year',
      role: 'mentor',
      bio: 'Senior 4th Year Chemical Engineering Mentor. Assisting juniors in McCabe-Thiele stage stepping and stoichiometry calculations.',
      skills: ['Aspen Plus', 'Distillation Columns', 'CSTR Sizing'],
      availability: 'Mon & Wed 5:00 PM - 7:00 PM',
      rating: 4.8,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
    });
    const chemStudent = await User.create({
      name: 'Swati Mishra (3rd Year CHEM)',
      email: 'chemstudent24@campussphere.edu',
      password: 'password123',
      regNo: '241FA09028',
      department: 'Chemical Engineering',
      specialization: 'Reaction Engineering & Catalyst Design',
      year: '3rd Year',
      role: 'student',
      bio: '3rd Year Chemical Engineering Student studying Distillation, Reactor Kinetics, and Heat Exchanger Design.',
      skills: ['Mass Transfer', 'Thermodynamics', 'Process Calculations'],
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150'
    });

    console.log('Seeding categorized academic materials across all departments...');
    await Resource.insertMany([
      // CSE
      {
        title: 'Computer Networks (OSI & TCP/IP) Lecture Notes & Packet Traces',
        description: 'Complete Unit 1-5 handwritten notes covering Framing, Subnetting, Bellman-Ford, Dijkstra, and Transport layer protocols.',
        subject: 'Computer Networks',
        department: 'Computer Science',
        semester: 5,
        targetYear: 3,
        resourceType: 'Lecture Notes',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        tags: ['Networks', 'OSI', 'Subnetting'],
        uploadedBy: cseSenior._id,
        uploaderName: cseSenior.name,
        uploaderRole: 'mentor',
        downloadsCount: 340
      },
      // Biotechnology
      {
        title: 'Recombinant DNA Technology & Vector Design Master Notes',
        description: 'Comprehensive notes covering Plasmid vectors (pUC19, pBR322), restriction endonucleases, cDNA library construction, and PCR cycles.',
        subject: 'Genetic Engineering',
        department: 'Biotechnology',
        semester: 5,
        targetYear: 3,
        resourceType: 'Lecture Notes',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        tags: ['GeneticEngineering', 'Plasmids', 'rDNA'],
        uploadedBy: btSenior._id,
        uploaderName: btSenior.name,
        uploaderRole: 'mentor',
        downloadsCount: 285
      },
      // AI & Data Science
      {
        title: 'Deep Learning & Transformer Architectures Lecture Slides (PPT)',
        description: 'Detailed visual deck on Backpropagation derivations, ResNet skip connections, and Multi-Head Attention mechanisms.',
        subject: 'Deep Learning',
        department: 'AI & Data Science',
        semester: 5,
        targetYear: 3,
        resourceType: 'Presentation / PPT',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        tags: ['DeepLearning', 'Transformers', 'PyTorch'],
        uploadedBy: aiSenior._id,
        uploaderName: aiSenior.name,
        uploaderRole: 'mentor',
        downloadsCount: 420
      },
      // ECE
      {
        title: 'CMOS VLSI Design Solved University End-Sem Question Papers',
        description: 'Past 4 years papers with solved stick diagrams, CMOS inverter VTC derivations, and Verilog testbenches.',
        subject: 'VLSI Design',
        department: 'Electronics & Comm',
        semester: 5,
        targetYear: 3,
        resourceType: 'Question Paper',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        tags: ['VLSI', 'CMOS', 'Verilog'],
        uploadedBy: eceSenior._id,
        uploaderName: eceSenior.name,
        uploaderRole: 'mentor',
        downloadsCount: 310
      },
      // EEE
      {
        title: 'Power Systems Transmission Lines & Sag Calculation Notes',
        description: 'Handwritten notes on ABCD parameters for medium and long lines, Ferranti effect, and insulator string efficiency.',
        subject: 'Power Systems',
        department: 'Electrical & Electronics',
        semester: 5,
        targetYear: 3,
        resourceType: 'Lecture Notes',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        tags: ['PowerSystems', 'Transmission', 'ABCDParameters'],
        uploadedBy: eeeSenior._id,
        uploaderName: eeeSenior.name,
        uploaderRole: 'mentor',
        downloadsCount: 260
      },
      // Mechanical
      {
        title: 'Fluid Mechanics & Turbomachinery Solved Question Papers',
        description: 'Detailed derivations for Bernoullis equation, velocity triangles for Pelton wheel and Francis turbine, and head loss.',
        subject: 'Fluid Mechanics',
        department: 'Mechanical',
        semester: 5,
        targetYear: 3,
        resourceType: 'Question Paper',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        tags: ['FluidMechanics', 'Turbines', 'Bernoulli'],
        uploadedBy: mechSenior._id,
        uploaderName: mechSenior.name,
        uploaderRole: 'mentor',
        downloadsCount: 380
      },
      // Civil
      {
        title: 'Design of Reinforced Concrete Structures (RCC) Codebook Guide & Notes',
        description: 'Step-by-step design steps for singly reinforced beams, two-way slabs, and short columns with IS 456 clauses.',
        subject: 'RCC Structures',
        department: 'Civil',
        semester: 5,
        targetYear: 3,
        resourceType: 'Lecture Notes',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        tags: ['RCC', 'IS456', 'Structures'],
        uploadedBy: civilSenior._id,
        uploaderName: civilSenior.name,
        uploaderRole: 'mentor',
        downloadsCount: 345
      },
      // Information Tech
      {
        title: 'Cloud Computing & Docker Containerization Practical Lab Manual',
        description: 'Comprehensive manual with Dockerfile examples, multi-stage builds, and Kubernetes pod deployment manifests.',
        subject: 'Cloud Computing',
        department: 'Information Tech',
        semester: 5,
        targetYear: 3,
        resourceType: 'Lab Manual',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        tags: ['Cloud', 'Docker', 'Kubernetes'],
        uploadedBy: itFaculty._id,
        uploaderName: itFaculty.name,
        uploaderRole: 'lecturer',
        isFacultyVerified: true,
        downloadsCount: 290
      },
      // Chemical Engineering
      {
        title: 'Mass Transfer Distillation & McCabe-Thiele Method Reference PDF',
        description: 'Hand-drawn stage stepping diagrams, q-line equations for varying feed thermal conditions, and minimum reflux ratio.',
        subject: 'Mass Transfer',
        department: 'Chemical Engineering',
        semester: 5,
        targetYear: 3,
        resourceType: 'Important PDF',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        tags: ['MassTransfer', 'Distillation', 'McCabeThiele'],
        uploadedBy: chemSenior._id,
        uploaderName: chemSenior.name,
        uploaderRole: 'mentor',
        downloadsCount: 215
      }
    ]);

    console.log('Seeding exam notifications and notices across all departments...');
    await Notice.insertMany([
      {
        title: 'Mid-Term University Examination Schedule - November 2026',
        content: 'Mid-term examinations for B.Tech Semester 3 and Semester 5 across ALL engineering departments commence from November 18, 2026. Hall tickets available on portal.',
        type: 'Exam Notification',
        department: 'All',
        targetYear: 'All',
        postedBy: cseFaculty._id,
        authorName: cseFaculty.name,
        isPinned: true
      },
      {
        title: 'Computer Science: Computer Networks & Cloud Lab External Timetable',
        content: 'External practical exams for 3rd Year CSE batches will be conducted in Systems Lab 4 on November 24 and 25.',
        type: 'Lab Timetable',
        department: 'Computer Science',
        targetYear: '3rd Year',
        postedBy: cseFaculty._id,
        authorName: cseFaculty.name,
        isPinned: true
      },
      {
        title: 'Biotechnology: Genetic Engineering & Bioprocess Viva Schedule',
        content: 'Practical viva examinations for Recombinant DNA Tech and Bioprocess Fermentation will be conducted in Biotech Lab Block 2 on November 26, 2026.',
        type: 'Lab Timetable',
        department: 'Biotechnology',
        targetYear: '3rd Year',
        postedBy: btFaculty._id,
        authorName: btFaculty.name,
        isPinned: true
      },
      {
        title: 'AI & Data Science: Deep Learning GPU Lab Evaluation',
        content: 'Final model presentations on PyTorch Transformer networks will be evaluated in AI Centre of Excellence on November 27, 2026.',
        type: 'Academic Notice',
        department: 'AI & Data Science',
        targetYear: '3rd Year',
        postedBy: aiFaculty._id,
        authorName: aiFaculty.name,
        isPinned: true
      },
      {
        title: 'Electronics & Comm: CMOS VLSI Cadence Lab Practical Schedule',
        content: 'External laboratory exams for VLSI Chip Design will take place in VLSI CAD Lab on November 28, 2026.',
        type: 'Lab Timetable',
        department: 'Electronics & Comm',
        targetYear: '3rd Year',
        postedBy: eceFaculty._id,
        authorName: eceFaculty.name,
        isPinned: true
      },
      {
        title: 'Mechanical: Fluid Machinery & Thermal Engineering Lab Schedule',
        content: 'Turbine performance trials and refrigeration test rig practical exams are scheduled for November 29 in Heat Engines Lab.',
        type: 'Lab Timetable',
        department: 'Mechanical',
        targetYear: '3rd Year',
        postedBy: mechFaculty._id,
        authorName: mechFaculty.name,
        isPinned: true
      },
      {
        title: 'Civil: Concrete Technology & Soil Mechanics Lab Schedule',
        content: 'Compression testing of concrete cubes and triaxial soil shear testing practicals will be held in Geotech Lab on November 30.',
        type: 'Lab Timetable',
        department: 'Civil',
        targetYear: '3rd Year',
        postedBy: civilFaculty._id,
        authorName: civilFaculty.name,
        isPinned: true
      }
    ]);

    console.log('Seeding academic quizzes conducted by faculty across departments...');
    await Quiz.insertMany([
      {
        title: 'Computer Networks: Transport Layer & TCP/IP Rapid Quiz',
        description: 'Test your understanding of 3-way handshake, TCP congestion control, sliding window protocol, and UDP headers.',
        department: 'Computer Science',
        subject: 'Computer Networks',
        targetYear: '3rd Year',
        duration: 15,
        createdBy: cseFaculty._id,
        creatorName: cseFaculty.name,
        isActive: true,
        questions: [
          {
            question: 'Which TCP flag is used to initiate a connection in the 3-way handshake?',
            options: ['ACK', 'SYN', 'FIN', 'RST'],
            correctIndex: 1,
            explanation: 'The SYN (Synchronize) packet is sent first by the client to establish a TCP session.'
          },
          {
            question: 'What is the default size of an IPv4 minimum header without options?',
            options: ['16 bytes', '20 bytes', '32 bytes', '64 bytes'],
            correctIndex: 1,
            explanation: 'The standard IPv4 header is 20 bytes long when no optional fields are present.'
          }
        ]
      },
      {
        title: 'Biotechnology: Genetic Engineering & PCR Mastery Quiz',
        description: 'Test your grasp of restriction enzymes, plasmid vectors, PCR cycles, and recombinant DNA screening methods.',
        department: 'Biotechnology',
        subject: 'Genetic Engineering',
        targetYear: '3rd Year',
        duration: 15,
        createdBy: btFaculty._id,
        creatorName: btFaculty.name,
        isActive: true,
        questions: [
          {
            question: 'Which enzyme is responsible for joining the phosphodiester backbone of DNA fragments?',
            options: ['DNA Polymerase', 'DNA Ligase', 'Restriction Endonuclease', 'Helicase'],
            correctIndex: 1,
            explanation: 'DNA Ligase catalyzes covalent phosphodiester bond formation between 3-hydroxyl and 5-phosphate terminals.'
          },
          {
            question: 'What is the typical annealing temperature range during PCR amplification?',
            options: ['94°C - 98°C', '50°C - 65°C', '72°C - 75°C', '37°C - 42°C'],
            correctIndex: 1,
            explanation: 'Annealing occurs between 50°C and 65°C depending on the melting temperature (Tm) of primers.'
          }
        ]
      },
      {
        title: 'AI & Data Science: Deep Learning & Neural Networks Quiz',
        description: 'Test your concepts of backpropagation, activation functions, CNN convolutions, and learning rates.',
        department: 'AI & Data Science',
        subject: 'Deep Learning',
        targetYear: '3rd Year',
        duration: 15,
        createdBy: aiFaculty._id,
        creatorName: aiFaculty.name,
        isActive: true,
        questions: [
          {
            question: 'Which activation function suffers from vanishing gradient problem for large positive inputs?',
            options: ['ReLU', 'Sigmoid', 'Leaky ReLU', 'GELU'],
            correctIndex: 1,
            explanation: 'Sigmoid saturates at 1 for large positive inputs, causing its derivative to approach zero.'
          },
          {
            question: 'What technique randomly deactivates neurons during training to prevent overfitting?',
            options: ['Batch Normalization', 'Dropout', 'Weight Decay', 'Gradient Clipping'],
            correctIndex: 1,
            explanation: 'Dropout sets random neuron activations to zero during training with probability p.'
          }
        ]
      },
      {
        title: 'Mechanical Engineering: Thermodynamics & Carnot Cycle Quiz',
        description: 'Assess your understanding of Carnot engine thermal efficiency, entropy, and steady flow energy equations.',
        department: 'Mechanical',
        subject: 'Thermodynamics',
        targetYear: '3rd Year',
        duration: 15,
        createdBy: mechFaculty._id,
        creatorName: mechFaculty.name,
        isActive: true,
        questions: [
          {
            question: 'What is the theoretical thermal efficiency of a Carnot engine operating between 600K and 300K?',
            options: ['25%', '50%', '75%', '100%'],
            correctIndex: 1,
            explanation: 'Efficiency = 1 - (Tc / Th) = 1 - (300 / 600) = 0.50 or 50%.'
          },
          {
            question: 'For a reversible adiabatic process, what happens to the entropy of the system?',
            options: ['Increases', 'Decreases', 'Remains Constant (Isentropic)', 'Becomes Zero'],
            correctIndex: 2,
            explanation: 'Reversible adiabatic implies dQ = 0, so dS = dQ/T = 0, hence entropy is constant.'
          }
        ]
      },
      {
        title: 'Civil Engineering: RCC Design & IS 456 Fundamentals Quiz',
        description: 'Test your understanding of neutral axis depth, moment of resistance, and concrete characteristic strength.',
        department: 'Civil',
        subject: 'RCC Structures',
        targetYear: '3rd Year',
        duration: 15,
        createdBy: civilFaculty._id,
        creatorName: civilFaculty.name,
        isActive: true,
        questions: [
          {
            question: 'What is the partial safety factor for concrete in the Limit State Method according to IS 456?',
            options: ['1.15', '1.50', '2.00', '1.00'],
            correctIndex: 1,
            explanation: 'IS 456 specifies a partial safety factor of 1.5 for concrete and 1.15 for steel.'
          },
          {
            question: 'Under balanced failure of an RCC beam, which happens simultaneously?',
            options: ['Steel yields and concrete reaches ultimate strain', 'Concrete crushes before steel yields', 'Steel breaks before concrete cracks', 'Only shear failure occurs'],
            correctIndex: 0,
            explanation: 'In a balanced section, concrete reaches maximum compressive strain 0.0035 exactly when steel reaches yield strain.'
          }
        ]
      }
    ]);

    console.log('Seeding targeted student doubts across departments...');
    // Doubt 1: CSE -> Mentors
    await Doubt.create({
      title: 'How to calculate Subnet Mask and valid host range for /27 CIDR block?',
      description: 'Given IP 192.168.10.45/27, how do I calculate the network ID, broadcast address, and usable host IPs? Asking CSE seniors!',
      subject: 'Computer Networks',
      department: 'Computer Science',
      targetRole: 'mentor',
      tags: ['Subnetting', 'CIDR', 'Networks'],
      askedBy: cseStudent._id,
      authorName: cseStudent.name,
      isResolved: true,
      answers: [
        {
          answeredBy: cseSenior._id,
          responderName: cseSenior.name,
          responderRole: 'mentor',
          text: 'Quick trick for /27: 32 - 27 = 5 host bits. Total IPs = 2^5 = 32 per block. Subnet mask = 256 - 32 = 255.255.255.224. Network ID = 192.168.10.32, Broadcast = 192.168.10.63. Usable hosts: .33 to .62!',
          upvotes: [cseStudent._id],
          createdAt: new Date()
        }
      ]
    });

    // Doubt 2: Biotechnology -> Faculty
    await Doubt.create({
      title: 'Clarification regarding Taq Polymerase error rates in fidelity PCR',
      description: 'Dear Professor, does Taq Polymerase possess 3 to 5 exonuclease proofreading activity, or should we use Pfu polymerase for high-fidelity cloning?',
      subject: 'Genetic Engineering',
      department: 'Biotechnology',
      targetRole: 'faculty',
      targetFaculty: btFaculty._id,
      tags: ['TaqPolymerase', 'Pfu', 'PCR'],
      askedBy: btStudent._id,
      authorName: btStudent.name,
      isResolved: true,
      answers: [
        {
          answeredBy: btFaculty._id,
          responderName: btFaculty.name,
          responderRole: 'lecturer',
          text: 'Taq polymerase lacks 3 to 5 proofreading activity. For recombinant cloning, Pfu polymerase (from Pyrococcus furiosus) or Phusion must be used because they possess proofreading activity, giving over 50x higher fidelity!',
          upvotes: [btStudent._id, btSenior._id],
          createdAt: new Date()
        }
      ]
    });

    // Doubt 3: AI & Data Science -> Faculty
    await Doubt.create({
      title: 'Difference between L1 (Lasso) and L2 (Ridge) regularization in sparsity',
      description: 'Why does L1 regularization drive weights strictly to zero producing sparse feature selection, whereas L2 only shrinks them asymptotically?',
      subject: 'Deep Learning',
      department: 'AI & Data Science',
      targetRole: 'faculty',
      targetFaculty: aiFaculty._id,
      tags: ['Regularization', 'Lasso', 'Ridge'],
      askedBy: aiStudent._id,
      authorName: aiStudent.name,
      isResolved: true,
      answers: [
        {
          answeredBy: aiFaculty._id,
          responderName: aiFaculty.name,
          responderRole: 'lecturer',
          text: 'L1 penalty corresponds to a diamond-shaped constraint region in parameter space whose sharp corners lie exactly on the coordinate axes. The elliptical contours of the cost function are mathematically far more likely to intersect these axis corners, setting coefficients to exact zero!',
          upvotes: [aiStudent._id, aiSenior._id],
          createdAt: new Date()
        }
      ]
    });

    // Doubt 4: Mechanical -> Mentors
    await Doubt.create({
      title: 'Derivation of Log Mean Temperature Difference (LMTD) for Counter Flow',
      description: 'Seniors, how do we write the differential heat transfer equation dq = U (Th - Tc) dA and integrate it between state 1 and state 2?',
      subject: 'Fluid Mechanics',
      department: 'Mechanical',
      targetRole: 'mentor',
      tags: ['HeatTransfer', 'LMTD', 'HeatExchangers'],
      askedBy: mechStudent._id,
      authorName: mechStudent.name,
      isResolved: true,
      answers: [
        {
          answeredBy: mechSenior._id,
          responderName: mechSenior.name,
          responderRole: 'mentor',
          text: 'Define Delta T = Th - Tc. Differentiating gives d(Delta T) = dTh - dTc. From heat balance, dTh = -dq / (mh Cph) and dTc = -dq / (mc Cpc). Substitute dq = U dA Delta T and integrate from 1 to 2 to get Delta T_m = (Delta T_1 - Delta T_2) / ln(Delta T_1 / Delta T_2)!',
          upvotes: [mechStudent._id],
          createdAt: new Date()
        }
      ]
    });

    console.log('✅ CampusSphere Database successfully seeded across ALL 9 DEPARTMENTS:');
    console.log('   - 9 Faculty Members (CSE, BT, AI&DS, ECE, EEE, MECH, CIVIL, IT, CHEM)');
    console.log('   - 9 Senior Mentors with Junior-only rules');
    console.log('   - 9 Students with personalized department & specialization tracks');
    console.log('   - Comprehensive Resources, Quizzes, Exam Notifications, and Doubt Routing!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
