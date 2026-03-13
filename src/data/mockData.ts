export type JobStatus = 'open' | 'in_progress' | 'verifying' | 'completed' | 'disputed' | 'failed';
export type JobType = 'ai' | 'render' | 'data' | 'research' | 'gpu' | 'cpu';
export type VerificationMode = 'dual-run' | 'challenger' | 'sample' | 'reputation';

export interface Job {
  id: string;
  title: string;
  type: JobType;
  status: JobStatus;
  budget: number; // in sats
  buyer: string;
  worker?: string;
  runtime: string;
  deadline: string;
  verificationMode: VerificationMode;
  proofHash?: string;
  escrowTx?: string;
  payoutTx?: string;
  description: string;
  computeClass: 'cpu' | 'gpu';
  created: string;
}

export interface Worker {
  id: string;
  address: string;
  alias: string;
  hardware: string;
  hardwareClass: 'cpu' | 'gpu';
  uptime: number;
  completionRate: number;
  reputation: number;
  earnings: number; // sats
  activeJobs: number;
  totalJobs: number;
  avgResponseTime: string;
  status: 'online' | 'busy' | 'offline';
  joinedDate: string;
}

export const mockJobs: Job[] = [
  {
    id: 'JOB-001',
    title: 'BERT embeddings for 10k text samples',
    type: 'ai',
    status: 'open',
    budget: 420000,
    buyer: 'bc1p7q8r9s0t1u2v3w4x5y6z7a8b9c0d',
    runtime: '~12 min',
    deadline: '2026-03-14',
    verificationMode: 'dual-run',
    description: 'Run BERT-base embeddings over 10,000 text samples. Output as .npy file.',
    computeClass: 'gpu',
    created: '2026-03-12T10:22:00Z',
  },
  {
    id: 'JOB-002',
    title: 'Render 240 animation frames (4K)',
    type: 'render',
    status: 'in_progress',
    budget: 890000,
    buyer: 'bc1pa1b2c3d4e5f6g7h8i9j0k1l2m3n4',
    worker: 'bc1px9y8z7a6b5c4d3e2f1g0h9i8j7k6',
    runtime: '~45 min',
    deadline: '2026-03-13',
    verificationMode: 'sample',
    proofHash: '0x3a7f9b2c1d4e5f6a7b8c9d0e1f2a3b4c',
    description: 'Blender scene render, 240 frames at 4K. Provided .blend file via IPFS CID.',
    computeClass: 'gpu',
    created: '2026-03-12T08:15:00Z',
  },
  {
    id: 'JOB-003',
    title: 'ETL pipeline: 50GB CSV normalization',
    type: 'data',
    status: 'verifying',
    budget: 310000,
    buyer: 'bc1pb2c3d4e5f6g7h8i9j0k1l2m3n4o5',
    worker: 'bc1py8z7a6b5c4d3e2f1g0h9i8j7k6l5',
    runtime: '~8 min',
    deadline: '2026-03-12',
    verificationMode: 'challenger',
    proofHash: '0x9d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a',
    description: 'Normalize and deduplicate 50GB CSV dataset. Schema provided.',
    computeClass: 'cpu',
    created: '2026-03-11T22:40:00Z',
  },
  {
    id: 'JOB-004',
    title: 'Image classification batch (ResNet-50)',
    type: 'ai',
    status: 'completed',
    budget: 185000,
    buyer: 'bc1pc3d4e5f6g7h8i9j0k1l2m3n4o5p6',
    worker: 'bc1pz7a6b5c4d3e2f1g0h9i8j7k6l5m4',
    runtime: '~6 min',
    deadline: '2026-03-11',
    verificationMode: 'dual-run',
    proofHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d',
    payoutTx: 'abc123def456',
    description: '5,000 images classified via ResNet-50. Output JSON with label + confidence.',
    computeClass: 'gpu',
    created: '2026-03-11T14:00:00Z',
  },
  {
    id: 'JOB-005',
    title: 'Backtesting pipeline: 5yr BTC OHLCV data',
    type: 'research',
    status: 'open',
    budget: 75000,
    buyer: 'bc1pd4e5f6g7h8i9j0k1l2m3n4o5p6q7',
    runtime: '~3 min',
    deadline: '2026-03-15',
    verificationMode: 'reputation',
    description: 'Run momentum strategy backtest over 5 years of 1-min BTC/USD OHLCV data.',
    computeClass: 'cpu',
    created: '2026-03-12T11:00:00Z',
  },
  {
    id: 'JOB-006',
    title: 'Video transcoding: 4 clips to H.265',
    type: 'render',
    status: 'open',
    budget: 550000,
    buyer: 'bc1pe5f6g7h8i9j0k1l2m3n4o5p6q7r8',
    runtime: '~30 min',
    deadline: '2026-03-14',
    verificationMode: 'sample',
    description: 'Transcode 4x 1080p clips to H.265 at target bitrate. Output via IPFS pin.',
    computeClass: 'gpu',
    created: '2026-03-12T09:45:00Z',
  },
  {
    id: 'JOB-007',
    title: 'LLM token scoring batch (1k prompts)',
    type: 'ai',
    status: 'disputed',
    budget: 290000,
    buyer: 'bc1pf6g7h8i9j0k1l2m3n4o5p6q7r8s9',
    worker: 'bc1pw6v5u4t3s2r1q0p9o8n7m6l5k4j3',
    runtime: '~10 min',
    deadline: '2026-03-12',
    verificationMode: 'dual-run',
    proofHash: '0x5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c',
    description: 'Score 1k prompts with a 7B parameter model. Output log-probs as JSON.',
    computeClass: 'gpu',
    created: '2026-03-11T18:30:00Z',
  },
];

export const mockWorkers: Worker[] = [
  {
    id: 'WRK-001',
    address: 'bc1px9y8z7a6b5c4d3e2f1g0h9i8j7k6',
    alias: 'node-alpha',
    hardware: 'RTX 4090 × 2, 128GB RAM',
    hardwareClass: 'gpu',
    uptime: 99.2,
    completionRate: 98.7,
    reputation: 972,
    earnings: 14820000,
    activeJobs: 2,
    totalJobs: 312,
    avgResponseTime: '18s',
    status: 'busy',
    joinedDate: '2025-11-02',
  },
  {
    id: 'WRK-002',
    address: 'bc1py8z7a6b5c4d3e2f1g0h9i8j7k6l5',
    alias: 'hashframe',
    hardware: 'A100 × 1, 64GB RAM',
    hardwareClass: 'gpu',
    uptime: 97.8,
    completionRate: 99.1,
    reputation: 988,
    earnings: 22150000,
    activeJobs: 1,
    totalJobs: 445,
    avgResponseTime: '12s',
    status: 'busy',
    joinedDate: '2025-10-15',
  },
  {
    id: 'WRK-003',
    address: 'bc1pz7a6b5c4d3e2f1g0h9i8j7k6l5m4',
    alias: 'satoshi-compute',
    hardware: 'Threadripper 7970X, 256GB RAM',
    hardwareClass: 'cpu',
    uptime: 99.9,
    completionRate: 97.4,
    reputation: 944,
    earnings: 8670000,
    activeJobs: 0,
    totalJobs: 198,
    avgResponseTime: '22s',
    status: 'online',
    joinedDate: '2025-12-01',
  },
  {
    id: 'WRK-004',
    address: 'bc1pw6v5u4t3s2r1q0p9o8n7m6l5k4j3',
    alias: 'blockworker-7',
    hardware: 'RTX 3090 × 4, 64GB RAM',
    hardwareClass: 'gpu',
    uptime: 94.5,
    completionRate: 91.2,
    reputation: 712,
    earnings: 5490000,
    activeJobs: 1,
    totalJobs: 89,
    avgResponseTime: '45s',
    status: 'busy',
    joinedDate: '2026-01-10',
  },
  {
    id: 'WRK-005',
    address: 'bc1pv5u4t3s2r1q0p9o8n7m6l5k4j3i2',
    alias: 'genesis-grid',
    hardware: 'H100 × 2, 512GB RAM',
    hardwareClass: 'gpu',
    uptime: 99.5,
    completionRate: 99.8,
    reputation: 1000,
    earnings: 41200000,
    activeJobs: 0,
    totalJobs: 827,
    avgResponseTime: '8s',
    status: 'online',
    joinedDate: '2025-09-20',
  },
];

export const networkStats = {
  totalJobsSubmitted: 4827,
  btcPaidToWorkers: 12.47,
  activeNodes: 128,
  successRate: 97.3,
  medianCompletionTime: '14 min',
  totalComputeHours: 19440,
  openJobs: 34,
  disputeRate: 1.2,
  avgJobPrice: 0.00041,
};

export const recentPayouts = [
  { worker: 'node-alpha', amount: 420000, job: 'BERT embeddings', time: '2 min ago' },
  { worker: 'genesis-grid', amount: 890000, job: '4K render batch', time: '8 min ago' },
  { worker: 'hashframe', amount: 185000, job: 'ResNet-50 batch', time: '15 min ago' },
  { worker: 'satoshi-compute', amount: 310000, job: 'ETL pipeline', time: '22 min ago' },
  { worker: 'genesis-grid', amount: 75000, job: 'BTC backtest', time: '34 min ago' },
];
