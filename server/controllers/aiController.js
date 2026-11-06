// Knowledge base & intelligent response engine across ALL Engineering Departments
const ACADEMIC_KNOWLEDGE_BASE = [
  // 1. Computer Science
  {
    keywords: ['quicksort', 'quick sort', 'partition', 'divide and conquer'],
    response: `**QuickSort Algorithm (Divide and Conquer - Computer Science)**:
1. **Pivot Selection**: Choose an element as pivot (e.g., last element, median-of-three).
2. **Partitioning**: Rearrange elements so that elements smaller than pivot are on the left, and elements greater are on the right.
3. **Recursion**: Recursively apply to the sub-arrays.
- **Time Complexity**: Average $O(n \\log n)$, Worst case $O(n^2)$ (when already sorted and bad pivot).
- **Space Complexity**: $O(\\log n)$ stack space.
- *Tip for Exams*: Always write the partition subroutine algorithm and show the dry run on an array like [10, 80, 30, 90, 40, 50, 70].`
  },
  {
    keywords: ['dbms', 'normalization', '1nf', '2nf', '3nf', 'bcnf'],
    response: `**Database Normalization Stages (DBMS - Computer Science / IT)**:
- **1NF**: Eliminate repeating groups; ensure atomic (indivisible) attribute values.
- **2NF**: Be in 1NF + eliminate partial dependencies (all non-key attributes fully functionally dependent on primary key).
- **3NF**: Be in 2NF + eliminate transitive dependencies ($X \\to Y$ and $Y \\to Z$ where $X$ is primary key).
- **BCNF (Boyce-Codd)**: For every functional dependency $X \\to Y$, $X$ must be a super key.`
  },

  // 2. Biotechnology
  {
    keywords: ['dna replication', 'dna', 'polymerase', 'helicase', 'lagging strand', 'okazaki'],
    response: `**DNA Replication (Biotechnology / Molecular Biology)**:
- **Key Enzymes**:
  1. *Helicase*: Unwinds double helix at replication fork.
  2. *Single-Strand Binding Proteins (SSBs)*: Stabilize unwound single strands.
  3. *Primase*: Synthesizes short RNA primers.
  4. *DNA Polymerase III*: Adds nucleotides in 5' to 3' direction.
  5. *DNA Polymerase I*: Removes RNA primers & replaces with DNA.
  6. *DNA Ligase*: Joins Okazaki fragments on the lagging strand.
- *Leading Strand*: Continuous synthesis towards replication fork.
- *Lagging Strand*: Discontinuous synthesis producing Okazaki fragments away from fork.`
  },
  {
    keywords: ['pcr', 'polymerase chain reaction', 'denaturation', 'annealing', 'taq'],
    response: `**Polymerase Chain Reaction (PCR) - 3 Essential Steps (Biotechnology)**:
1. **Denaturation (94°C - 96°C)**: High temperature breaks hydrogen bonds between double-stranded DNA template, separating them into single strands (~30-60 secs).
2. **Annealing (50°C - 65°C)**: Temperature is lowered to allow forward and reverse primers to bind specifically to target flanking regions (~30 secs).
3. **Extension/Elongation (72°C)**: Heat-stable *Taq Polymerase* (from *Thermus aquaticus*) synthesizes new DNA strand from primers (~1 min per 1kb).
- *Exponential Amplification*: Yield after $n$ cycles is $2^n$ copies!`
  },

  // 3. AI & Data Science
  {
    keywords: ['gradient descent', 'learning rate', 'optimization', 'backpropagation'],
    response: `**Gradient Descent & Backpropagation (AI & Data Science)**:
- **Core Formula**: $w_{new} = w_{old} - \\alpha \\nabla L(w)$, where $\\alpha$ is the learning rate and $\\nabla L(w)$ is the gradient of the loss function.
- **Variants**:
  1. *Batch Gradient Descent*: Computes loss over the entire dataset (stable but slow for huge data).
  2. *Stochastic Gradient Descent (SGD)*: Updates parameters per single sample (noisy, escapes local minima).
  3. *Mini-Batch SGD (Adam/RMSProp)*: Best balance; uses batches of 32/64/128 samples with adaptive momentum.`
  },
  {
    keywords: ['transformer', 'self-attention', 'attention mechanism', 'bert', 'gpt'],
    response: `**Transformer Self-Attention Mechanism (AI & Data Science / IT)**:
- **Attention Formula**: $\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{Q K^T}{\\sqrt{d_k}}\\right) V$
- **Components**:
  - $Q$ (Query), $K$ (Key), $V$ (Value) projections generated via linear weights.
  - $\\sqrt{d_k}$ scaling prevents dot products from growing excessively large into regions of tiny gradients in softmax.
  - *Multi-Head Attention*: Allows attending to information from different representation subspaces simultaneously.`
  },

  // 4. Electronics & Communication
  {
    keywords: ['op-amp', 'operational amplifier', 'virtual ground', 'inverting', 'non-inverting'],
    response: `**Operational Amplifier (Op-Amp) Fundamentals (Electronics & Comm / EEE)**:
- **Golden Rules of Ideal Op-Amp**:
  1. Input impedance $R_{in} = \\infty$ $\\implies$ Input current $I_+ = I_- = 0$.
  2. Open-loop gain $A_{OL} = \\infty$ with negative feedback $\\implies$ Virtual Short ($V_+ \\approx V_-$).
  3. Output impedance $R_{out} = 0$.
- **Inverting Amplifier Gain**: $V_{out} = -\\frac{R_f}{R_{in}} V_{in}$.
- **Non-Inverting Amplifier Gain**: $V_{out} = \\left(1 + \\frac{R_f}{R_1}\\right) V_{in}$.`
  },
  {
    keywords: ['nyquist', 'sampling theorem', 'aliasing', 'sampling rate'],
    response: `**Nyquist-Shannon Sampling Theorem (Electronics & Comm)**:
- **Theorem Statement**: A continuous-time signal $x(t)$ bandlimited to maximum frequency $f_{max}$ can be completely and uniquely reconstructed from its samples if the sampling frequency satisfies:
  $$f_s \\ge 2 f_{max}$$
- **Nyquist Rate**: $2 f_{max}$.
- **Aliasing**: If $f_s < 2 f_{max}$, high-frequency spectral components fold into lower frequencies. Prevented by using an analog **anti-aliasing low-pass filter** before sampling.`
  },

  // 5. Electrical & Electronics
  {
    keywords: ['transformer', 'phasor', 'losses', 'hysteresis', 'eddy current', 'iron loss'],
    response: `**Transformer Losses & Efficiency (Electrical & Electronics Engineering)**:
- **Core / Iron Losses ($P_i$)**: Constant at all loads.
  1. *Hysteresis Loss*: $P_h = k_h B_{max}^{1.6} f V$ (reduced by using high-grade silicon steel).
  2. *Eddy Current Loss*: $P_e = k_e B_{max}^2 f^2 t^2 V$ (reduced by laminating the core).
- **Copper Losses ($P_{cu}$)**: Variable with load ($P_{cu} = I^2 R$).
- **Maximum Efficiency Condition**: Occurs when variable Copper Losses equal constant Core Losses ($P_{cu} = P_i$).`
  },

  // 6. Mechanical Engineering
  {
    keywords: ['carnot', 'second law of thermodynamics', 'heat engine', 'entropy'],
    response: `**Carnot Heat Engine & Maximum Thermal Efficiency (Mechanical Engineering)**:
- **Carnot Cycle 4 Reversible Processes**:
  1. Reversible Isothermal Expansion (at high temperature $T_H$).
  2. Reversible Adiabatic / Isentropic Expansion.
  3. Reversible Isothermal Compression (at heat sink $T_C$).
  4. Reversible Adiabatic / Isentropic Compression.
- **Maximum Thermal Efficiency**:
  $$\\eta_{Carnot} = 1 - \\frac{T_C}{T_H} = \\frac{T_H - T_C}{T_H}$$
  *(Temperatures must always be in absolute Kelvin!)*`
  },
  {
    keywords: ['stress strain', 'mohr circle', 'hooke', 'yield stress', 'tensile test'],
    response: `**Stress-Strain Diagram for Ductile Material / Mild Steel (Mechanical / Civil)**:
- **Salient Points on Curve**:
  1. *Proportional Limit (A)*: Hooke's Law strictly valid ($\\sigma = E \\cdot \\epsilon$).
  2. *Elastic Limit (B)*: Material returns to original dimensions upon load removal.
  3. *Upper & Lower Yield Points (C & D)*: Plastic deformation begins without load increase.
  4. *Ultimate Tensile Strength (UTS, E)*: Maximum nominal stress withstandable.
  5. *Fracture / Rupture Point (F)*: Necking occurs leading to cup-and-cone ductile fracture.`
  },

  // 7. Civil Engineering
  {
    keywords: ['bod', 'cod', 'biochemical oxygen demand', 'wastewater'],
    response: `**BOD vs. COD in Wastewater Analysis (Civil & Environmental Engineering)**:
- **Biochemical Oxygen Demand (BOD)**: Amount of dissolved oxygen required by aerobic microorganisms to biologically decompose biodegradable organic matter at 20°C over 5 days ($BOD_5$).
- **Chemical Oxygen Demand (COD)**: Amount of oxygen equivalent required to chemically oxidize all organic matter (both biodegradable AND non-biodegradable) using a strong chemical oxidant ($K_2Cr_2O_7$ in acidic medium).
- **Rule of Thumb**: $COD > BOD$ always. A $BOD/COD$ ratio $> 0.6$ indicates wastewater is readily amenable to biological treatment.`
  },
  {
    keywords: ['concrete slump', 'slump test', 'workability', 'water cement ratio'],
    response: `**Concrete Workability & Slump Cone Test (Civil Engineering)**:
- **Standard Apparatus (IS 7320)**: Metal mould in shape of frustum of cone (Top diameter: 10cm, Bottom: 20cm, Height: 30cm). Filled in 4 layers, each rodded 25 times.
- **Slump Types**:
  1. *True Slump*: Uniform subsidence, indicates cohesive, workable mix.
  2. *Shear Slump*: One half slips down, indicates harsh, non-cohesive mix.
  3. *Collapse Slump*: Very high water-cement ratio; mix flattens completely.
- *Abram's Water-Cement Law*: Strength depends primarily on water-cement ratio, provided mix is fully compacted.`
  },

  // 8. Chemical Engineering
  {
    keywords: ['distillation', 'mccabe thiele', 'reflux ratio', 'feed line', 'q line'],
    response: `**McCabe-Thiele Distillation Column Design (Chemical Engineering)**:
- **Assumptions**: Constant Molar Overflow (CMO), negligible heat losses, ideal solutions.
- **Key Equations**:
  1. *Rectifying Section Operating Line (ROL)*: $y = \\frac{R}{R+1} x + \\frac{x_D}{R+1}$.
  2. *Feed (q-line)*: $y = \\frac{q}{q-1} x - \\frac{z_F}{q-1}$, where $q$ is the thermal condition of feed ($q=1$ for saturated liquid).
  3. *Stripping Section Operating Line (SOL)*: Passes through intersection of ROL & q-line and $(x_B, x_B)$.
- **Minimum Reflux Ratio ($R_{min}$)**: Operating line intersects equilibrium curve at pinch point, requiring infinite theoretical stages.`
  }
];

// @desc    Ask Academic Chatbot
// @route   POST /api/ai/ask
// @access  Private
exports.askChatbot = async (req, res, next) => {
  try {
    const { question, department, subject } = req.body;

    if (!question || question.trim() === '') {
      return res.status(400).json({ success: false, message: 'Please provide a question' });
    }

    const lowerQ = question.toLowerCase();

    // Check knowledge base
    let matched = ACADEMIC_KNOWLEDGE_BASE.find(item =>
      item.keywords.some(kw => lowerQ.includes(kw))
    );

    let answer = '';

    if (matched) {
      answer = matched.response;
    } else {
      // Intelligent academic synthesized response tailored to the student's branch
      answer = `### Academic Guidance for ${subject || department || 'Your Course'}

Regarding your query: **"${question}"**

1. **Foundational Principles (${department || 'Core Engineering'})**:
   To master this topic, review the core theoretical definitions, governing mathematical or chemical equations, and input/output parameters outlined in your university syllabus.

2. **Exam Preparation Strategy**:
   - Reference the **Study Plans** tab for this subject to check specific module coverage.
   - Practice writing step-by-step derivations, schematic diagrams, and circuit/process flowcharts.
   - Cross-check standard university previous question papers.

3. **Get Direct Help on CampusSphere**:
   - Click **"Ask a Doubt"** in your portal header.
   - Route this doubt directly to your **${department || 'Department'} Senior Mentors** or **Subject Faculty** for a personalized solution!`;
    }

    res.json({
      success: true,
      question,
      answer,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};
