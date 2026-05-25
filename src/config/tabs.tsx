/**
 * ─────────────────────────────────────────────────────────────
 *  STOCKIQ — TAB CONFIGURATION
 *
 *  Edit this file to:
 *    • Rename a tab  →  change `label`
 *    • Change icon   →  swap the <Icon /> component
 *    • Change group  →  'Research' | 'Portfolio' | or any new string
 *    • Reorder tabs  →  move the object up/down in the array
 *    • Hide a tab    →  set  hidden: true
 *    • Add a tab     →  add a new object + wire it in App.tsx TAB_MAP
 *
 *  Tab IDs must match the keys in TAB_MAP in src/App.tsx
 * ─────────────────────────────────────────────────────────────
 */

import React from 'react';
import AutoGraphIcon            from '@mui/icons-material/AutoGraph';
import BarChartIcon             from '@mui/icons-material/BarChart';
import TrendingUpIcon           from '@mui/icons-material/TrendingUp';
import WorkspacePremiumIcon     from '@mui/icons-material/WorkspacePremium';
import PsychologyIcon           from '@mui/icons-material/Psychology';
import DiamondIcon              from '@mui/icons-material/Diamond';
import CurrencyBitcoinIcon      from '@mui/icons-material/CurrencyBitcoin';
import FilterAltIcon            from '@mui/icons-material/FilterAlt';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import StarBorderIcon           from '@mui/icons-material/StarBorder';
import PieChartIcon             from '@mui/icons-material/PieChart';
import MonetizationOnIcon       from '@mui/icons-material/MonetizationOn';

export interface TabConfig {
  id: string;           // must match key in App.tsx TAB_MAP
  label: string;        // shown in sidebar
  description: string;  // tooltip / help text
  icon: React.ReactNode;
  group: string;        // sidebar section header
  hidden?: boolean;     // set true to hide without deleting
}

export const TAB_CONFIG: TabConfig[] = [

  // ── Research ──────────────────────────────────────────────────────────────
  {
    id: 'mag7',
    label: 'Magnificent 7',
    description: 'Real-time quotes for AAPL, MSFT, NVDA, GOOGL, AMZN, META, TSLA — the seven largest US companies by market cap.',
    icon: <AutoGraphIcon fontSize="small" />,
    group: 'Research',
  },
  {
    id: 'sp100',
    label: 'S&P 100 Movers',
    description: 'Top gainers and losers from the S&P 100, sorted by absolute % move. Includes a heatmap.',
    icon: <BarChartIcon fontSize="small" />,
    group: 'Research',
  },
  {
    id: 'sp500value',
    label: 'S&P 500 Value',
    description: 'S&P 500 stocks screened for low P/E, low P/B, and high dividend yield. Classic value investing screen.',
    icon: <TrendingUpIcon fontSize="small" />,
    group: 'Research',
  },
  {
    id: 'buffett',
    label: 'Buffett Portfolio',
    description: "Berkshire Hathaway's top holdings with live prices, allocation chart, and key Buffett criteria.",
    icon: <WorkspacePremiumIcon fontSize="small" />,
    group: 'Research',
  },
  {
    id: 'ai',
    label: 'AI Stocks & ETFs',
    description: 'Stocks and ETFs with primary AI/semiconductor exposure — NVDA, AMD, PLTR, ARM and AI-focused ETFs.',
    icon: <PsychologyIcon fontSize="small" />,
    group: 'Research',
  },
  {
    id: 'metals',
    label: 'Metals ETFs',
    description: 'Gold, silver and copper ETFs — physical and futures-backed. Live NAV and expense ratios.',
    icon: <DiamondIcon fontSize="small" />,
    group: 'Research',
  },
  {
    id: 'dividendetfs',
    label: 'Dividend ETFs',
    description: 'Top 10 best dividend ETFs ranked by yield — SCHD, VYM, JEPI, JEPQ and more. Includes yield, expense ratio, AUM, payout frequency and strategy.',
    icon: <MonetizationOnIcon fontSize="small" />,
    group: 'Research',
  },
  {
    id: 'crypto',
    label: 'Crypto Top 5',
    description: 'Live prices for BTC, ETH, SOL, XRP, ADA. Updates every 30 seconds.',
    icon: <CurrencyBitcoinIcon fontSize="small" />,
    group: 'Research',
  },
  {
    id: 'screener',
    label: 'Screener',
    description: 'Custom stock screener across 65+ symbols. Filter by price, % change, P/E, beta, market cap, sector.',
    icon: <FilterAltIcon fontSize="small" />,
    group: 'Research',
  },

  // ── Portfolio ─────────────────────────────────────────────────────────────
  {
    id: 'portfolio',
    label: 'My Portfolio',
    description: 'Track holdings with live P&L, cost basis, unrealized gains/losses. Add, edit, delete holdings. Export to CSV.',
    icon: <AccountBalanceWalletIcon fontSize="small" />,
    group: 'Portfolio',
  },
  {
    id: 'watchlist',
    label: 'Watchlist',
    description: 'Monitor any symbol with live prices. Set price alerts. Multiple watchlists supported.',
    icon: <StarBorderIcon fontSize="small" />,
    group: 'Portfolio',
  },
  {
    id: 'allocation',
    label: 'Allocation',
    description: 'Portfolio breakdown by sector and asset type. Pie charts and weight bars from your live portfolio.',
    icon: <PieChartIcon fontSize="small" />,
    group: 'Portfolio',
  },

];

export const VISIBLE_TABS = TAB_CONFIG.filter(t => !t.hidden);
export const TAB_BY_ID    = Object.fromEntries(TAB_CONFIG.map(t => [t.id, t]));
