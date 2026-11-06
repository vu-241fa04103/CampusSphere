// Comprehensive 24 University Departments, Specializations, and 4-Year Curricula

export const UNIVERSAL_DEPARTMENTS = [
  'Computer Science and Engineering (CSE)',
  'Advanced Computer Science Engineering',
  'Electronics and Communication Engineering (ECE)',
  'Electrical and Electronics Engineering (EEE)',
  'Information Technology & Computer Applications',
  'Mechanical Engineering',
  'Civil Engineering',
  'Chemical Engineering',
  'Textile Technology',
  'Robotics & Automation',
  'Biotechnology',
  'Bioinformatics',
  'Biomedical Engineering',
  'Pharmaceutical Sciences (Pharmacy)',
  'Agricultural Engineering',
  'Agricultural & Horticultural Sciences',
  'Food Technology',
  'Management Studies (BBA / MBA)',
  'Law (B.A. LL.B / BBA LL.B)',
  'Chemistry',
  'Physics',
  'Mathematics',
  'English',
  'Social Sciences & Humanities'
];

export const DEPARTMENT_SPECIALIZATIONS = {
  // 1. CSE
  'Computer Science and Engineering (CSE)': [
    'AI & Machine Learning (AI&ML)',
    'Cyber Security & Digital Forensics',
    'Data Science & Big Data Analytics',
    'Computer Science & Business Systems (CSBS)',
    'Cloud Computing & DevOps'
  ],
  'Computer Science': [
    'AI & Machine Learning (AI&ML)',
    'Cyber Security & Digital Forensics',
    'Data Science & Big Data Analytics',
    'Computer Science & Business Systems (CSBS)'
  ],

  // 2. Advanced CSE
  'Advanced Computer Science Engineering': [
    'Distributed & Parallel Cloud Systems',
    'Quantum Computing & Cryptography',
    'High Performance Computing (HPC)',
    'Advanced Compiler & Systems Design',
    'Edge AI & Autonomous Systems'
  ],

  // 3. ECE
  'Electronics and Communication Engineering (ECE)': [
    'VLSI Design & Nanotechnology',
    'Embedded Systems & Internet of Things (IoT)',
    '5G/6G Wireless Communication',
    'Digital Signal & Image Processing',
    'Robotics & Industrial Automation'
  ],
  'Electronics & Comm': [
    'VLSI Design & Nanotechnology',
    'Embedded Systems & Internet of Things (IoT)',
    '5G/6G Wireless Communication'
  ],

  // 4. EEE
  'Electrical and Electronics Engineering (EEE)': [
    'Smart Grids & Power Systems',
    'Electric Vehicles (EV) & Motor Drives',
    'Renewable Energy & Solar PV Systems',
    'Power Electronics & Micro-Inverters',
    'Control Systems & Substation Automation'
  ],
  'Electrical & Electronics': [
    'Smart Grids & Power Systems',
    'Electric Vehicles (EV) & Motor Drives',
    'Renewable Energy & Solar PV Systems'
  ],

  // 5. IT & Computer Applications
  'Information Technology & Computer Applications': [
    'Full-Stack Web & Enterprise Systems',
    'Cloud Architecture (AWS / Azure)',
    'DevOps & Microservices Pipelines',
    'Mobile Application Development',
    'Cyber Threat Intelligence'
  ],
  'Information Tech': [
    'Full-Stack Web & Enterprise Systems',
    'Cloud Architecture (AWS / Azure)',
    'DevOps & Microservices Pipelines'
  ],

  // 6. Mechanical
  'Mechanical Engineering': [
    'Thermal Engineering & Heat Exchangers',
    'Automotive & EV Powertrain Design',
    'CAD/CAM & Additive Manufacturing (3D Printing)',
    'Robotics & Industrial Mechatronics',
    'Aerospace Systems & Computational Fluid Dynamics (CFD)'
  ],
  'Mechanical': [
    'Thermal Engineering & Heat Exchangers',
    'Automotive & EV Powertrain Design',
    'CAD/CAM & Additive Manufacturing'
  ],

  // 7. Civil
  'Civil Engineering': [
    'Structural Engineering & Bridge Design',
    'Environmental Engineering & Wastewater Treatment',
    'Geotechnical Engineering & Deep Foundations',
    'Transportation & Highway Engineering',
    'Smart Cities & Building Information Modeling (BIM)'
  ],
  'Civil': [
    'Structural Engineering & Bridge Design',
    'Environmental Engineering & Wastewater Treatment',
    'Smart Cities & BIM'
  ],

  // 8. Chemical
  'Chemical Engineering': [
    'Petrochemical & Petroleum Refining',
    'Reaction Engineering & Heterogeneous Catalysis',
    'Polymer Science & Nanomaterials',
    'Process Safety & Plant Economics',
    'Biochemical & Fermentation Processes'
  ],

  // 9. Textile Technology
  'Textile Technology': [
    'Fiber Science & Synthetic Polymers',
    'Yarn Manufacturing & Modern Spinning',
    'Fabric Weaving, Knitting & CAD Jacquard',
    'Textile Chemical Processing & Dyeing',
    'Technical & Medical Textiles'
  ],

  // 10. Robotics & Automation
  'Robotics & Automation': [
    'Industrial Manipulators & Kinematics',
    'Autonomous Mobile Robots (AMR & AGV)',
    'Computer Vision & Robot Navigation (SLAM)',
    'PLC, SCADA & Industrial Drives',
    'Aerial Drones & Unmanned Systems'
  ],

  // 11. Biotechnology
  'Biotechnology': [
    'Genetic Engineering & Recombinant DNA Tech',
    'Bioprocess & Industrial Fermentation',
    'Molecular Biology & Gene Diagnostics',
    'Immunology & Vaccine Development',
    'Environmental & Marine Biotechnology'
  ],

  // 12. Bioinformatics
  'Bioinformatics': [
    'Computational Genomics & Transcriptomics',
    'Structural Bioinformatics & Molecular Docking',
    'Next-Generation Sequencing (NGS) Pipeline Design',
    'Python & R for Biostatistics',
    'Proteomics & Machine Learning in Drug Discovery'
  ],

  // 13. Biomedical Engineering
  'Biomedical Engineering': [
    'Medical Imaging (MRI, CT, Ultrasound)',
    'Bio-Instrumentation & Physiological Sensors',
    'Biomaterials, Tissue Scaffolds & Implants',
    'Prosthetics, Orthotics & Rehabilitation Robotics',
    'Clinical Hospital Equipment Engineering'
  ],

  // 14. Pharmacy
  'Pharmaceutical Sciences (Pharmacy)': [
    'Pharmaceutics & Novel Drug Delivery Systems',
    'Pharmacology & Clinical Toxicology',
    'Medicinal Chemistry & Drug Synthesis',
    'Pharmacognosy & Phytopharmaceuticals',
    'Quality Assurance & Regulatory Affairs'
  ],

  // 15. Agricultural Engineering
  'Agricultural Engineering': [
    'Farm Machinery, Tractors & Precision Farming',
    'Soil & Water Conservation Engineering',
    'Drip, Sprinkler & Micro-Irrigation Systems',
    'Post-Harvest Technology & Storage Silos',
    'Renewable Energy in Agriculture'
  ],

  // 16. Agricultural & Horticultural Sciences
  'Agricultural & Horticultural Sciences': [
    'Agronomy & Organic Farming Systems',
    'Fruit, Vegetable & Floriculture Science',
    'Genetics & Plant Breeding',
    'Soil Chemistry, Fertility & Nutrient Management',
    'Plant Pathology & Integrated Pest Management (IPM)'
  ],

  // 17. Food Technology
  'Food Technology': [
    'Food Processing, Thermal Preservation & Canning',
    'Dairy, Meat, Poultry & Fish Technology',
    'Food Quality Assurance, HACCP & FSSAI Standards',
    'Nutraceuticals & Functional Food Formulation',
    'Food Packaging & Shelf-Life Engineering'
  ],

  // 18. Management Studies
  'Management Studies (BBA / MBA)': [
    'Financial Management & Investment Banking',
    'Marketing Management & Digital Brand Strategy',
    'Human Resource Management (HRM) & People Analytics',
    'Operations, Logistics & Supply Chain Management',
    'Business Analytics & Data-Driven Decision Making'
  ],

  // 19. Law
  'Law (B.A. LL.B / BBA LL.B)': [
    'Constitutional & Administrative Law of India',
    'Corporate Law, Mergers & Securities Regulation',
    'Criminal Law, Criminology & Evidence Procedure',
    'Intellectual Property Rights (IPR & Patents)',
    'Cyber Law, Privacy & International Arbitration'
  ],

  // 20. Chemistry
  'Chemistry': [
    'Synthetic Organic Chemistry & Reaction Mechanisms',
    'Inorganic Coordination Chemistry & Bioinorganic',
    'Quantum Chemistry, Spectroscopy & Thermodynamics',
    'Analytical Chemistry & Chromatographic Techniques',
    'Polymer & Materials Chemistry'
  ],

  // 21. Physics
  'Physics': [
    'Quantum Mechanics & Atomic/Molecular Physics',
    'Condensed Matter Physics & Superconductivity',
    'Electrodynamics, Lasers & Photonics',
    'Nuclear, Particle & High Energy Physics',
    'Computational Physics & Astrophysics'
  ],

  // 22. Mathematics
  'Mathematics': [
    'Real & Complex Analysis with Topology',
    'Abstract Algebra, Group Theory & Ring Theory',
    'Ordinary & Partial Differential Equations',
    'Operations Research, Optimization & Linear Programming',
    'Probability Theory & Mathematical Statistics'
  ],

  // 23. English
  'English': [
    'British, American & Postcolonial Literature',
    'Linguistics, Phonetics & English Language Teaching (ELT)',
    'Critical Theory, Structuralism & Cultural Studies',
    'Creative Writing & Professional Technical Communication',
    'World Literatures & Translation Studies'
  ],

  // 24. Social Sciences & Humanities
  'Social Sciences & Humanities': [
    'Sociology & Social Stratification Studies',
    'Micro & Macro Economic Policy Analysis',
    'Political Science, Governance & Public Administration',
    'Psychology, Cognitive Behavior & Counseling',
    'History, Heritage & International Relations'
  ]
};

// Helper: Normalize department name to curriculum key
export const normalizeDept = (deptName) => {
  if (!deptName) return 'Computer Science and Engineering (CSE)';
  if (DEPARTMENT_CURRICULUM[deptName]) return deptName;
  if (deptName.includes('Computer Science') || deptName === 'CSE') return 'Computer Science and Engineering (CSE)';
  if (deptName.includes('Bio') && deptName.includes('tech')) return 'Biotechnology';
  if (deptName.includes('Electronics') && deptName.includes('Comm')) return 'Electronics and Communication Engineering (ECE)';
  if (deptName.includes('Electrical')) return 'Electrical and Electronics Engineering (EEE)';
  if (deptName.includes('Information')) return 'Information Technology & Computer Applications';
  if (deptName.includes('Mechanical')) return 'Mechanical Engineering';
  if (deptName.includes('Civil')) return 'Civil Engineering';
  if (deptName.includes('Chemical')) return 'Chemical Engineering';
  return 'Computer Science and Engineering (CSE)';
};

export const DEPARTMENT_CURRICULUM = {
  // 1. CSE
  'Computer Science and Engineering (CSE)': {
    '1st Year': [
      {
        code: 'CSE101',
        name: 'Problem Solving & Programming in C',
        credits: 4,
        description: 'Memory allocation, pointer arithmetic, recursion, and file handling.',
        modules: ['C Basics & Flow Control', 'Arrays & Strings', 'Functions & Recursion', 'Pointers & Dynamic Memory', 'Structures & File I/O'],
        studyTips: 'Practice daily dry-runs on pointer arithmetic and recursion trees.'
      },
      {
        code: 'CSE102',
        name: 'Discrete Mathematical Structures',
        credits: 4,
        description: 'Set theory, propositional logic, graph theory, combinatorics, and recurrence relations.',
        modules: ['Logic & Proofs', 'Sets, Relations & Functions', 'Combinatorics & Pigeonhole', 'Recurrence Relations', 'Graph Theory Basics'],
        studyTips: 'Master mathematical induction and solving homogeneous recurrence relations.'
      }
    ],
    '2nd Year': [
      {
        code: 'CSE201',
        name: 'Data Structures and Algorithms',
        credits: 4,
        description: 'Stacks, queues, BST, balanced AVL trees, heaps, graph traversals, and dynamic programming.',
        modules: ['Linear Structures', 'Trees & BST', 'AVL & B-Trees', 'Graph Algorithms (BFS/DFS/Dijkstra)', 'Greedy & Dynamic Programming'],
        studyTips: 'Implement every data structure from scratch in C++ or Java.'
      },
      {
        code: 'CSE202',
        name: 'Database Management Systems (DBMS)',
        credits: 4,
        description: 'Relational algebra, SQL queries, BCNF normalization, and ACID transaction concurrency.',
        modules: ['ER Modeling', 'Advanced SQL & Joins', 'Normalization (1NF-BCNF)', 'ACID & Transactions', 'Concurrency & Deadlocks'],
        studyTips: 'Practice functional dependency closure and finding all candidate keys.'
      }
    ],
    '3rd Year': [
      {
        code: 'CSE301',
        name: 'Operating Systems & System Architecture',
        credits: 4,
        description: 'CPU scheduling, Bankers algorithm, paging, virtual memory, and Unix shell internals.',
        modules: ['Processes & Threads', 'CPU Scheduling Algorithms', 'Deadlocks & Bankers Algorithm', 'Virtual Memory & Paging', 'File Systems & Storage'],
        studyTips: 'Solve previous 5 years numericals on Round Robin, Bankers, and LRU page replacement.'
      },
      {
        code: 'CSE302',
        name: 'Computer Networks (OSI & TCP/IP)',
        credits: 4,
        description: 'CIDR subnetting, sliding window protocols, routing algorithms (OSPF, BGP), and transport layer.',
        modules: ['Data Link Framing & ARQ', 'CIDR IP Subnetting', 'Routing Algorithms (Dijkstra/Distance Vector)', 'TCP Handshake & Congestion Control', 'Application Layer (DNS/HTTP)'],
        studyTips: 'Practice calculating subnet IDs and usable host IPs for /24 to /30 blocks.'
      }
    ],
    '4th Year': [
      {
        code: 'CSE401',
        name: 'Cloud Virtualization & Distributed Systems',
        credits: 4,
        description: 'Microservices, Docker, Kubernetes, RPC, consensus protocols (Raft/Paxos).',
        modules: ['Distributed Architectures', 'Vector Clocks & Synchronization', 'Raft Consensus Protocol', 'Docker & Kubernetes', 'Big Data MapReduce'],
        studyTips: 'Build a containerized multi-tier microservice architecture.'
      },
      {
        code: 'CSE402',
        name: 'High-Scalability System Design',
        credits: 4,
        description: 'Load balancers, Redis caching, DB sharding, rate limiting, and CAP theorem.',
        modules: ['Horizontal vs Vertical Scaling', 'Caching & Eviction Policies', 'Database Sharding & Replication', 'Message Queues (Kafka/RabbitMQ)', 'Capacity Estimations'],
        studyTips: 'Draw clean architecture diagrams with estimated latency and throughput values.'
      }
    ]
  },

  // 2. Advanced CSE
  'Advanced Computer Science Engineering': {
    '3rd Year': [
      {
        code: 'ACSE301',
        name: 'High Performance & Parallel Computing',
        credits: 4,
        description: 'CUDA GPU programming, MPI, OpenMP multi-threading, and hardware acceleration.',
        modules: ['Parallel Architectures & Amdahls Law', 'OpenMP Shared Memory', 'MPI Message Passing Interface', 'CUDA Kernel Programming', 'Cache Coherence Protocols'],
        studyTips: 'Profile GPU memory bandwidth and optimize shared memory bank conflicts in CUDA.'
      },
      {
        code: 'ACSE302',
        name: 'Quantum Computing & Algorithms',
        credits: 4,
        description: 'Qubits, quantum gates, superposition, entanglement, Shors and Grovers algorithms.',
        modules: ['Quantum State Vectors & Qubits', 'Quantum Logic Gates (Hadamard/CNOT)', 'Quantum Teleportation & Bell States', 'Grovers Search Algorithm', 'Shors Factoring Algorithm'],
        studyTips: 'Multiply 2x2 unitary matrices to verify quantum circuit transformations.'
      }
    ]
  },

  // 3. ECE
  'Electronics and Communication Engineering (ECE)': {
    '3rd Year': [
      {
        code: 'ECE301',
        name: 'CMOS VLSI Circuit Design',
        credits: 4,
        description: 'MOSFET physics, CMOS inverter VTC, stick diagrams, propagation delay, and Verilog HDL.',
        modules: ['MOS Transistor Theory', 'CMOS Inverter Characteristics', 'Dynamic & Ratioed Logic', 'Verilog Synthesis & Testbenches', 'FPGA Prototyping'],
        studyTips: 'Calculate Logical Effort and path delay through cascaded CMOS logic gates.'
      },
      {
        code: 'ECE302',
        name: 'Digital Communication Systems',
        credits: 4,
        description: 'Sampling, PCM, QPSK, QAM modulations, matched filtering, and Shannon channel capacity.',
        modules: ['Sampling & Quantization Noise', 'Pulse Code Modulation (PCM)', 'Bandpass Modulation (BPSK/QPSK/QAM)', 'Matched Filters & BER Analysis', 'Information Theory & Entropy'],
        studyTips: 'Draw constellation diagrams and derive bit error probability under AWGN.'
      }
    ]
  },

  // 4. EEE
  'Electrical and Electronics Engineering (EEE)': {
    '3rd Year': [
      {
        code: 'EEE301',
        name: 'Power Transmission & Substation Engineering',
        credits: 4,
        description: 'ABCD parameters, Ferranti effect, corona losses, insulator strings, and sag calculations.',
        modules: ['Line Parameters Calculation', 'Performance of Transmission Lines', 'Ferranti Effect & Surge Impedance', 'Insulators & String Efficiency', 'Corona Phenomenon & Cables'],
        studyTips: 'Calculate ABCD parameters and voltage regulation for medium lines using nominal-pi method.'
      },
      {
        code: 'EEE302',
        name: 'Power Electronics & Inverter Drives',
        credits: 4,
        description: 'SCR, IGBT, DC-DC buck/boost converters, single/three-phase PWM inverters, and motor drives.',
        modules: ['Power Semiconductor Switches', 'Phase Controlled Rectifiers', 'DC-DC Buck & Boost Regulators', 'PWM Inverters (VSI/CSI)', 'Variable Frequency AC Drives'],
        studyTips: 'Derive average output voltage formulas for single-phase and 3-phase converters.'
      }
    ]
  },

  // 5. IT
  'Information Technology & Computer Applications': {
    '3rd Year': [
      {
        code: 'IT301',
        name: 'Enterprise Cloud Architecture & DevOps',
        credits: 4,
        description: 'AWS core infrastructure, Docker containerization, Kubernetes orchestration, CI/CD pipelines.',
        modules: ['Cloud Models & AWS VPC', 'Docker Container Packaging', 'Kubernetes Deployments & Services', 'CI/CD with GitHub Actions', 'Infrastructure as Code (Terraform)'],
        studyTips: 'Write a multi-stage Dockerfile and automate pipeline tests on git push.'
      },
      {
        code: 'IT302',
        name: 'Information & Network Security',
        credits: 4,
        description: 'Symmetric & Asymmetric cryptography (AES/RSA), digital signatures, firewalls, and penetration testing.',
        modules: ['Classical & Modern Cryptography', 'RSA Public Key Algorithm', 'Hash Functions & Digital Signatures', 'Web Security (OWASP Top 10)', 'Firewalls & Intrusion Detection'],
        studyTips: 'Demonstrate RSA key derivation with coprime numbers and modular inverse.'
      }
    ]
  },

  // 6. Mechanical
  'Mechanical Engineering': {
    '3rd Year': [
      {
        code: 'ME301',
        name: 'Fluid Mechanics & Turbomachinery',
        credits: 4,
        description: 'Bernoulli equation, boundary layer theory, Pelton wheel, Francis and Kaplan turbines.',
        modules: ['Fluid Statics & Buoyancy', 'Bernoullis Theorem & Applications', 'Flow in Pipes & Darcy Equation', 'Pelton Wheel & Velocity Triangles', 'Francis & Kaplan Reaction Turbines'],
        studyTips: 'Draw complete velocity triangles at inlet and outlet for turbine blades.'
      },
      {
        code: 'ME302',
        name: 'Heat and Mass Transfer',
        credits: 4,
        description: '1D conduction, extended surfaces (fins), convection correlations, radiation, and heat exchangers.',
        modules: ['Fouriers Law & Thermal Resistance', 'Heat Dissipation from Fins', 'Forced & Free Convection', 'Radiation Heat Exchange & View Factors', 'LMTD & NTU Heat Exchanger Analysis'],
        studyTips: 'Master the Log Mean Temperature Difference (LMTD) method for counter-flow heat exchangers.'
      }
    ]
  },

  // 7. Civil
  'Civil Engineering': {
    '3rd Year': [
      {
        code: 'CE301',
        name: 'Design of Reinforced Concrete Structures (RCC)',
        credits: 4,
        description: 'IS 456 Limit State Method, singly/doubly reinforced beams, one-way/two-way slabs, short columns.',
        modules: ['Limit State Philosophy & Stress Block', 'Flexural Design of Beams', 'Shear, Torsion & Development Length', 'One-Way & Two-Way Slabs', 'Axially Loaded Short Columns'],
        studyTips: 'Master moment of resistance limiting formula $M_{u,lim} = 0.36 f_{ck} b x_{u,max} (d - 0.42 x_{u,max})$.'
      },
      {
        code: 'CE302',
        name: 'Geotechnical Soil Mechanics & Foundations',
        credits: 4,
        description: 'Phase diagrams, Darcys permeability, compaction, Terzaghi shear strength, shallow footings.',
        modules: ['Soil Properties & Phase Relations', 'Permeability & Seepage Pressure', '1D Consolidation Theory', 'Mohr-Coulomb Shear Strength', 'Terzaghis Bearing Capacity of Footings'],
        studyTips: 'Calculate void ratio, porosity, and degree of saturation from phase diagram formulas.'
      }
    ]
  },

  // 8. Chemical
  'Chemical Engineering': {
    '3rd Year': [
      {
        code: 'CH301',
        name: 'Mass Transfer Operations & Distillation',
        credits: 4,
        description: 'Ficks law of diffusion, gas absorption, McCabe-Thiele distillation stages, and packed towers.',
        modules: ['Molecular Diffusion in Fluids', 'Interphase Mass Transfer Theories', 'Gas Absorption & HTU/NTU', 'McCabe-Thiele Distillation Method', 'Minimum Reflux & Fenske Equation'],
        studyTips: 'Draw McCabe-Thiele stage stepping between equilibrium curve and operating lines.'
      },
      {
        code: 'CH302',
        name: 'Chemical Reaction Engineering (CRE)',
        credits: 4,
        description: 'Reaction kinetics, design equations for batch reactors, CSTR, PFR, and reactors in series.',
        modules: ['Rate Laws & Temperature Dependence', 'Batch Reactor Performance', 'Continuous Stirred Tank Reactors (CSTR)', 'Plug Flow Reactors (PFR)', 'Multiple Reactor Configurations'],
        studyTips: 'Derive performance equations for CSTR ($V/F_{A0} = X_A / (-r_A)$) and PFR.'
      }
    ]
  },

  // 9. Textile Technology
  'Textile Technology': {
    '3rd Year': [
      {
        code: 'TT301',
        name: 'Yarn Manufacturing & Modern Spinning',
        credits: 4,
        description: 'Blowroom cleaning, carding kinematics, drawframes, ring spinning, and rotor spinning systems.',
        modules: ['Opening & Cleaning in Blowroom', 'Carding Engine & Drafting Actions', 'Combing & Drawframe Doubling', 'Ring Spinning Frame Mechanisms', 'Rotor & Air-Jet Modern Spinning'],
        studyTips: 'Calculate draft and twist factors in ring spinning systems.'
      },
      {
        code: 'TT302',
        name: 'Textile Chemical Processing & Dyeing',
        credits: 4,
        description: 'Scouring, bleaching, mercerization, reactive dyes, disperse dyeing, and effluent management.',
        modules: ['Pre-treatment (Desizing, Scouring)', 'Bleaching with Hydrogen Peroxide', 'Mercerization of Cotton Fabrics', 'Dyeing with Reactive & Disperse Dyes', 'Textile Printing & Finishing Techniques'],
        studyTips: 'Memorize the chemical mechanism of reactive dye fixation on cellulosic fibers.'
      }
    ]
  },

  // 10. Robotics & Automation
  'Robotics & Automation': {
    '3rd Year': [
      {
        code: 'RA301',
        name: 'Robot Kinematics & Manipulator Dynamics',
        credits: 4,
        description: 'Denavit-Hartenberg (DH) parameters, forward & inverse kinematics, Jacobian matrices, trajectory planning.',
        modules: ['Spatial Transformations & Rotations', 'DH Parameter Formulation', 'Forward & Inverse Kinematics', 'Jacobian Velocity Analysis & Singularities', 'Euler-Lagrange Dynamic Modeling'],
        studyTips: 'Construct 4x4 DH transformation matrices and verify joint rotation frames.'
      },
      {
        code: 'RA302',
        name: 'PLC, SCADA & Industrial Automation',
        credits: 4,
        description: 'Ladder logic programming, timers/counters, SCADA HMIs, industrial fieldbus, servo motor control.',
        modules: ['PLC Architecture & Hardware', 'Ladder Diagram (LD) Programming', 'Timers, Counters & Arithmetic Blocks', 'SCADA Interfacing & Alarm Handling', 'Servo Drives & Motion Controllers'],
        studyTips: 'Practice drawing ladder logic rungs for conveyor sorting and motor start-stop seal-in circuits.'
      }
    ]
  },

  // 11. Biotechnology
  'Biotechnology': {
    '3rd Year': [
      {
        code: 'BT301',
        name: 'Genetic Engineering & Recombinant DNA',
        credits: 4,
        description: 'Restriction enzymes, plasmid cloning vectors (pUC19), cDNA libraries, PCR amplification, and CRISPR.',
        modules: ['Restriction Endonucleases & Ligases', 'Cloning Vectors (Plasmids/Phages/YAC)', 'PCR Cycles & Real-Time qPCR', 'Selection & Screening (Blue-White)', 'CRISPR-Cas9 Gene Editing'],
        studyTips: 'Draw pBR322 genetic maps with antibiotic resistance markers and origin of replication.'
      },
      {
        code: 'BT302',
        name: 'Bioprocess Engineering & Fermentation',
        credits: 4,
        description: 'Bioreactor design, Monod growth kinetics, Chemostats, volumetric oxygen mass transfer (KLa).',
        modules: ['Bioreactor Types & Aeration', 'Monod Microbial Growth Kinetics', 'Continuous Culture (Chemostats)', 'KLa Determination Methods', 'Downstream Separation & Purification'],
        studyTips: 'Master Monod equation calculations and mass balance around a chemostat at steady state.'
      }
    ]
  },

  // 12. Bioinformatics
  'Bioinformatics': {
    '3rd Year': [
      {
        code: 'BI301',
        name: 'Biological Sequence Analysis & BLAST',
        credits: 4,
        description: 'Pairwise alignment (Needleman-Wunsch, Smith-Waterman), BLAST heuristics, and scoring matrices.',
        modules: ['Biological Data Formats (FASTA/GenBank)', 'Needleman-Wunsch Global Alignment', 'Smith-Waterman Local Alignment', 'BLAST Algorithm & E-Value Interpretation', 'PAM & BLOSUM62 Scoring Matrices'],
        studyTips: 'Fill 2D dynamic programming matrices by hand with match/mismatch/gap penalties.'
      },
      {
        code: 'BI302',
        name: 'Structural Bioinformatics & Molecular Docking',
        credits: 4,
        description: 'PDB structure parsing, Ramachandran plot analysis, protein secondary structure prediction, AutoDock.',
        modules: ['PDB Format & 3D Molecular Coordinates', 'Ramachandran Plot Phi-Psi Angles', 'Homology Modeling Pipelines', 'Protein-Ligand Molecular Docking (AutoDock)', 'Pharmacophore Modeling & Virtual Screening'],
        studyTips: 'Inspect allowable regions on Ramachandran plots for alpha-helices and beta-sheets.'
      }
    ]
  },

  // 13. Biomedical Engineering
  'Biomedical Engineering': {
    '3rd Year': [
      {
        code: 'BME301',
        name: 'Medical Imaging Systems (MRI, CT, Ultrasound)',
        credits: 4,
        description: 'X-ray physics, Computed Tomography (CT) reconstruction, MRI magnetic resonance, and Doppler ultrasound.',
        modules: ['X-Ray Generation & Attenuation', 'CT Reconstruction & Radon Transform', 'MRI Physics & RF Pulse Sequences', 'Ultrasound Transducers & Doppler Effect', 'Nuclear Medicine (PET & SPECT)'],
        studyTips: 'Understand filtered back-projection algorithm and T1/T2 relaxation times in MRI.'
      },
      {
        code: 'BME302',
        name: 'Bio-Signal Processing & ECG Analysis',
        credits: 4,
        description: 'Bio-potential electrodes, ECG P-Q-R-S-T complexes, EEG brain rhythms, EMG muscle signals, and digital filters.',
        modules: ['Bio-Potential Origin & Resting Potential', 'ECG Lead Systems & Waveforms', 'EEG Rhythms (Alpha/Beta/Delta)', 'EMG Surface Electrodes', 'Digital Notch & Bandpass Filtering of Bio-signals'],
        studyTips: 'Identify P wave (atrial depolarization), QRS (ventricular depolarization), and T wave.'
      }
    ]
  },

  // 14. Pharmacy
  'Pharmaceutical Sciences (Pharmacy)': {
    '3rd Year': [
      {
        code: 'PH301',
        name: 'Pharmaceutics & Dosage Form Technology',
        credits: 4,
        description: 'Preformulation testing, solid dosage forms (tablets, capsules), liquid orals, parentals, sustained release.',
        modules: ['Preformulation Parameters & Solubility', 'Tablet Manufacturing & Coating Defects', 'Hard & Soft Gelatin Capsules', 'Sterile Parenteral Formulations', 'Controlled & Sustained Drug Delivery'],
        studyTips: 'Memorize tablet compression defects: capping, lamination, picking, sticking, and mottling.'
      },
      {
        code: 'PH302',
        name: 'Pharmacology & Mechanism of Drug Action',
        credits: 4,
        description: 'Pharmacokinetics (ADME), receptor pharmacodynamics, autonomic nervous system pharmacology, cardiovascular drugs.',
        modules: ['ADME Pharmacokinetics & Half-Life', 'Receptor Theory & Dose-Response Curves', 'Cholinergic & Adrenergic Drugs', 'Antihypertensive & Antiarrhythmic Agents', 'Antibiotics & Antimicrobial Resistance'],
        studyTips: 'Draw log dose-response curves showing changes in potency ($EC_{50}$) vs efficacy ($E_{max}$).'
      }
    ]
  },

  // 15. Agricultural Engineering
  'Agricultural Engineering': {
    '3rd Year': [
      {
        code: 'AGE301',
        name: 'Farm Power, Machinery & Tractor Systems',
        credits: 4,
        description: 'IC engines for tractors, transmission, hitch systems, primary/secondary tillage implements, seed drills.',
        modules: ['Tractor Engine Systems & Governor', 'Power Transmission & PTO Operations', 'Tillage Implements (Moldboard & Disc Ploughs)', 'Sowing, Planting & Harvesting Machines', 'Tractor Stability & Drawbar Performance'],
        studyTips: 'Calculate drawbar power, wheel slip percentage, and field capacity of implements.'
      },
      {
        code: 'AGE302',
        name: 'Soil & Water Conservation Engineering',
        credits: 4,
        description: 'Soil erosion mechanics, Universal Soil Loss Equation (USLE), contour bunding, check dams, and runoff hydrology.',
        modules: ['Water & Wind Erosion Mechanisms', 'Universal Soil Loss Equation (USLE)', 'Contour Bunds, Terraces & Graded Bunds', 'Gully Control & Check Dam Design', 'Rainwater Harvesting & Watershed Management'],
        studyTips: 'Apply Rational Method formula $Q = C I A / 360$ for peak runoff estimation.'
      }
    ]
  },

  // 16. Agricultural & Horticultural Sciences
  'Agricultural & Horticultural Sciences': {
    '3rd Year': [
      {
        code: 'AGS301',
        name: 'Principles of Agronomy & Crop Production',
        credits: 4,
        description: 'Agro-climatic zones, cropping systems, weed management, irrigation scheduling, organic farming.',
        modules: ['Agro-Climatic Classification of Crops', 'Tillage & Seed Bed Preparation', 'Cropping Systems (Intercropping/Relay)', 'Weed Biology & Herbicide Selectivity', 'Organic Agriculture & Biofertilizers'],
        studyTips: 'Calculate crop water requirement and irrigation water use efficiency (WUE).'
      },
      {
        code: 'AGS302',
        name: 'Fundamentals of Horticulture & Plant Breeding',
        credits: 4,
        description: 'Orchard establishment, pruning, grafting, asexual propagation, heterosis, and hybrid seed production.',
        modules: ['Classification of Horticultural Crops', 'Plant Propagation (Budding/Grafting/Layering)', 'Orchard Planning & Canopy Management', 'Mendelian Genetics & Heterosis Breeding', 'Hybrid Seed Production in Field Crops'],
        studyTips: 'Practice drawing scion and rootstock graft union cambium alignment.'
      }
    ]
  },

  // 17. Food Technology
  'Food Technology': {
    '3rd Year': [
      {
        code: 'FT301',
        name: 'Food Processing & Thermal Preservation',
        credits: 4,
        description: 'Pasteurization, sterilization (D-value, z-value, F-value), dehydration, freezing, and canning technology.',
        modules: ['Thermal Inactivation Kinetics of Microbes', 'D-Value, z-Value & $F_0$ Thermal Lethality', 'Canning Operations & Retort Processing', 'Freezing & Freeze-Drying (Lyophilization)', 'Extrusion Technology in Snack Foods'],
        studyTips: 'Calculate required process time using $F_0 = D_{121} (\\log N_0 - \\log N)$.'
      },
      {
        code: 'FT302',
        name: 'Food Quality Assurance & HACCP Standards',
        credits: 4,
        description: 'Food safety systems, HACCP principles, FSSAI regulations, sensory evaluation, food adulteration testing.',
        modules: ['Quality Attributes of Foods', 'Seven Principles of HACCP System', 'Critical Control Points (CCPs) Identification', 'FSSAI Standards & Food Laws', 'Sensory Evaluation Testing Panels'],
        studyTips: 'Identify CCPs for pasteurized milk processing line.'
      }
    ]
  },

  // 18. Management Studies (BBA/MBA)
  'Management Studies (BBA / MBA)': {
    '3rd Year': [
      {
        code: 'MGT301',
        name: 'Financial Management & Corporate Valuation',
        credits: 4,
        description: 'Time value of money, Capital budgeting (NPV, IRR), Weighted Average Cost of Capital (WACC), Capital structure.',
        modules: ['Time Value of Money (Compounding/Discounting)', 'Capital Budgeting Techniques (NPV vs IRR)', 'Cost of Capital & WACC Formulation', 'Capital Structure Theories (MM Theory)', 'Working Capital Management & Cash Flow'],
        studyTips: 'Calculate project NPV and explain conflict resolution between NPV and IRR.'
      },
      {
        code: 'MGT302',
        name: 'Marketing Management & Strategic Brand Positioning',
        credits: 4,
        description: 'STP framework (Segmentation, Targeting, Positioning), Marketing 4Ps, consumer behavior, brand equity.',
        modules: ['Marketing Environment & Market Research', 'Market Segmentation & Target Audience', 'Product Life Cycle (PLC) Strategies', 'Pricing Tactics & Distribution Channels', 'Integrated Marketing Communications (IMC)'],
        studyTips: 'Analyze real-world brand case studies using Porter 5 Forces and SWOT matrices.'
      }
    ]
  },

  // 19. Law
  'Law (B.A. LL.B / BBA LL.B)': {
    '3rd Year': [
      {
        code: 'LAW301',
        name: 'Constitutional Law of India - I & II',
        credits: 4,
        description: 'Preamble, Fundamental Rights (Articles 14, 19, 21), Directive Principles, Writs, Basic Structure Doctrine.',
        modules: ['Preamble & Salient Features of Constitution', 'Fundamental Rights (Articles 14-18 Equality)', 'Right to Life & Personal Liberty (Article 21)', 'Writ Jurisdiction (Habeas Corpus, Mandamus, Certiorari)', 'Basic Structure Doctrine (Kesavananda Bharati)'],
        studyTips: 'Memorize landmark Supreme Court rulings: Kesavananda Bharati, Maneka Gandhi, and Puttaswamy.'
      },
      {
        code: 'LAW302',
        name: 'Law of Contracts & Specific Relief',
        credits: 4,
        description: 'Offer, acceptance, consideration, void agreements, breach of contract, damages, and specific performance.',
        modules: ['Formation of Contract (Offer & Acceptance)', 'Lawful Consideration & Free Consent', 'Void & Voidable Agreements (Sections 23-30)', 'Discharge of Contract & Anticipatory Breach', 'Remedies for Breach of Contract & Damages'],
        studyTips: 'Cite the rule in Hadley v. Baxendale regarding remoteness of damages.'
      }
    ]
  },

  // 20. Chemistry
  'Chemistry': {
    '3rd Year': [
      {
        code: 'CHM301',
        name: 'Synthetic Organic Chemistry & Spectroscopy',
        credits: 4,
        description: 'Named reactions (Wittig, Aldol, Michael), organic synthesis, and UV-Vis, IR, and 1H-NMR spectroscopy.',
        modules: ['Enolate Chemistry & Condensations', 'Organometallic Reagents in Synthesis (Grignard/Organolithium)', 'Infrared Spectroscopy Functional Groups', '1H & 13C NMR Chemical Shifts and Splitting', 'Mass Spectrometry Fragmentation Patterns'],
        studyTips: 'Predict NMR multiplet splitting patterns using the $n+1$ rule and coupling constants (J).'
      },
      {
        code: 'CHM302',
        name: 'Inorganic Coordination Chemistry & Ligand Field Theory',
        credits: 4,
        description: 'Crystal Field Theory, crystal field splitting (Delta_o / Delta_t), Jahn-Teller effect, magnetic moments.',
        modules: ['Werner Coordination Theory', 'Valence Bond Theory of Complexes', 'Crystal Field Theory (Octahedral & Tetrahedral)', 'Jahn-Teller Distortion in Cu(II)', 'Electronic Spectra & Orgel Diagrams'],
        studyTips: 'Calculate Crystal Field Stabilization Energy (CFSE) for high-spin and low-spin $d^4$ to $d^7$ ions.'
      }
    ]
  },

  // 21. Physics
  'Physics': {
    '3rd Year': [
      {
        code: 'PHY301',
        name: 'Quantum Mechanics & Wave Equations',
        credits: 4,
        description: 'Schrodinger equation, particle in a 1D box, harmonic oscillator, hydrogen atom wavefunctions.',
        modules: ['Wave-Particle Duality & De Broglie Waves', 'Time-Dependent & Time-Independent Schrodinger Equations', 'Particle in 1D & 3D Infinite Potential Well', 'Quantum Harmonic Oscillator Energy States', 'Hydrogen Atom Angular Momentum & Orbitals'],
        studyTips: 'Verify wavefunction normalization $\\int |\\psi|^2 dx = 1$ and compute expectation values $\\langle x \\rangle$.'
      },
      {
        code: 'PHY302',
        name: 'Solid State Physics & Semiconductor Devices',
        credits: 4,
        description: 'Crystal lattices, X-ray diffraction (Braggs law), free electron theory, and band theory of solids.',
        modules: ['Crystal Systems, Miller Indices & Bravais Lattices', 'Braggs Law of X-Ray Diffraction', 'Drude-Lorentz Free Electron Model', 'Kronig-Penney Model & Energy Bands', 'Intrinsic & Extrinsic Semiconductor Carrier Densities'],
        studyTips: 'Derive interplanar spacing formula $d_{hkl} = a / \\sqrt{h^2 + k^2 + l^2}$ for cubic systems.'
      }
    ]
  },

  // 22. Mathematics
  'Mathematics': {
    '3rd Year': [
      {
        code: 'MTH301',
        name: 'Abstract Algebra & Group Theory',
        credits: 4,
        description: 'Groups, subgroups, cyclic groups, Lagranges theorem, normal subgroups, quotient groups, and homomorphisms.',
        modules: ['Definition of Groups & Basic Properties', 'Subgroups & Cyclic Generators', 'Lagranges Theorem on Cosets', 'Normal Subgroups & Quotient Groups', 'First Isomorphism Theorem'],
        studyTips: 'Memorize proofs of Lagranges theorem and Cayleys representation theorem.'
      },
      {
        code: 'MTH302',
        name: 'Real Analysis & Metric Spaces',
        credits: 4,
        description: 'Sequences, Cauchy criterion, Bolzano-Weierstrass theorem, Riemann integration, uniform convergence.',
        modules: ['Completeness Property of Reals', 'Sequences & Series of Real Numbers', 'Topology of Metric Spaces (Open/Closed sets)', 'Riemann Integral & Fundamental Theorem of Calculus', 'Sequences of Functions & Uniform Convergence'],
        studyTips: 'Write rigorous $\\epsilon$-$\\delta$ proofs for continuity and Cauchy sequences.'
      }
    ]
  },

  // 23. English
  'English': {
    '3rd Year': [
      {
        code: 'ENG301',
        name: 'Modern Literary Theory & Criticism',
        credits: 4,
        description: 'Structuralism, Post-structuralism, Deconstruction, Marxist literary theory, and Feminism.',
        modules: ['Classical & Romantic Literary Criticism', 'Russian Formalism & New Criticism', 'Structuralism (Saussure & Barthes)', 'Deconstruction (Derrida Différance)', 'Postcolonialism (Edward Said Orientalism)'],
        studyTips: 'Apply postcolonial theory to analyze cultural representation and hegemony in literary texts.'
      },
      {
        code: 'ENG302',
        name: 'Linguistics, Phonetics & Applied Syntax',
        credits: 4,
        description: 'Articulatory phonetics, IPA transcription, morphology, syntax trees (Chomsky Generative Grammar).',
        modules: ['Organs of Speech & Articulatory Phonetics', 'International Phonetic Alphabet (IPA) Transcription', 'Morphology & Morpheme Analysis', 'Phrase Structure Rules & Syntax Trees', 'Semantics & Pragmatics in Discourse'],
        studyTips: 'Practice phonemic transcription of English RP vowels, diphthongs, and consonant clusters.'
      }
    ]
  },

  // 24. Social Sciences & Humanities
  'Social Sciences & Humanities': {
    '3rd Year': [
      {
        code: 'SSH301',
        name: 'Sociology of Development & Social Stratification',
        credits: 4,
        description: 'Social class, caste, gender stratification, theories of modernization, globalization, and social change.',
        modules: ['Theories of Social Stratification (Marx & Weber)', 'Caste, Class & Gender Intersections in India', 'Modernization vs Dependency Theories', 'Globalization & Cultural Transformation', 'Social Movements & Collective Action'],
        studyTips: 'Contrast Marxian conflict perspective with Weberian multidimensional view of class, status, and party.'
      },
      {
        code: 'SSH302',
        name: 'Public Policy, Governance & International Relations',
        credits: 4,
        description: 'Public policy making, bureaucracy, democratic decentralization (Panchayati Raj), and foreign policy.',
        modules: ['Public Policy Formulation & Implementation', 'Bureaucracy & Good Governance Models', 'Decentralized Governance (73rd/74th Amendments)', 'Theories of International Relations (Realism/Liberalism)', 'India Foreign Policy & Global Geopolitics'],
        studyTips: 'Analyze policy case studies examining policy implementation deficits and institutional checks.'
      }
    ]
  }
};
