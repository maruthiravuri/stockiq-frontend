import React, { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import { Box, Typography, Chip } from '@mui/material';
import { Stock } from '../../types';
import { fmtPrice, fmtLargeNum, fmtVolume } from '../../utils/format';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

interface Props {
  data: Stock[];
  title: string;
  subtitle?: string;
  showValueCols?: boolean;
  height?: number;
}

const ChangeRenderer = (params: any) => {
  const val = params.value ?? 0;
  const isUp = val >= 0;
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', color: isUp ? '#00D4AA' : '#FF4D6A' }}>
      {isUp ? <ArrowDropUpIcon sx={{ fontSize: 16 }} /> : <ArrowDropDownIcon sx={{ fontSize: 16 }} />}
      <span style={{ fontWeight: 600 }}>{Math.abs(val).toFixed(2)}%</span>
    </Box>
  );
};

const SymbolRenderer = (params: any) => (
  <Box>
    <Typography variant="body2" sx={{ fontWeight: 700, color: '#00D4AA', lineHeight: 1.2, fontSize: '0.8rem' }}>
      {params.data?.symbol}
    </Typography>
    <Typography variant="caption" sx={{ color: '#8B93A5', fontSize: '0.65rem', display: 'block' }}>
      {params.data?.name}
    </Typography>
  </Box>
);

const AgStockTable: React.FC<Props> = ({ data, title, subtitle, showValueCols = false, height = 500 }) => {
  const columnDefs = useMemo(() => {
    const base: any[] = [
      { field: 'symbol', headerName: 'Symbol', width: 160, pinned: 'left', cellRenderer: SymbolRenderer, sortable: true, filter: 'agTextColumnFilter' },
      { field: 'price', headerName: 'Price', width: 110, sortable: true,
        valueFormatter: (p: any) => fmtPrice(p.value), cellStyle: { fontWeight: 600 } },
      { field: 'change', headerName: 'Change', width: 110, sortable: true,
        valueFormatter: (p: any) => p.value >= 0 ? `+$${p.value.toFixed(2)}` : `-$${Math.abs(p.value).toFixed(2)}`,
        cellClass: (p: any) => p.value >= 0 ? 'ag-cell-positive' : 'ag-cell-negative' },
      { field: 'changePercent', headerName: '% Change', width: 120, sortable: true, cellRenderer: ChangeRenderer, sort: 'desc' },
      { field: 'volume', headerName: 'Volume', width: 110, sortable: true,
        valueFormatter: (p: any) => fmtVolume(p.value), cellStyle: { color: '#8B93A5' } },
      { field: 'marketCap', headerName: 'Mkt Cap', width: 120, sortable: true,
        valueFormatter: (p: any) => fmtLargeNum(p.value), cellStyle: { color: '#8B93A5' } },
    ];
    if (showValueCols) {
      base.push(
        { field: 'peRatio', headerName: 'P/E', width: 80, sortable: true, valueFormatter: (p: any) => p.value ? p.value.toFixed(1) : '—' },
        { field: 'pbRatio', headerName: 'P/B', width: 80, sortable: true, valueFormatter: (p: any) => p.value ? p.value.toFixed(1) : '—' },
        { field: 'dividendYield', headerName: 'Div Yield', width: 100, sortable: true,
          valueFormatter: (p: any) => p.value ? `${p.value.toFixed(2)}%` : '—',
          cellClass: (p: any) => (p.value ?? 0) > 3 ? 'ag-cell-positive' : '' }
      );
    }
    return base;
  }, [showValueCols]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {title && (
        <Box sx={{ p: 2, pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>{title}</Typography>
            {subtitle && <Typography variant="caption" color="text.secondary">{subtitle}</Typography>}
          </Box>
          <Chip label={`${data.length} securities`} size="small" variant="outlined" sx={{ borderColor: 'divider', fontSize: '0.7rem' }} />
        </Box>
      )}
      <Box sx={{ flex: 1, minHeight: height }}>
        <style>{`
          .ag-cell-positive { color: #00D4AA !important; }
          .ag-cell-negative { color: #FF4D6A !important; }
          .ag-theme-balham {
            --ag-background-color: transparent;
            --ag-odd-row-background-color: rgba(255,255,255,0.02);
            --ag-header-background-color: #0D1321;
            --ag-header-foreground-color: #8B93A5;
            --ag-border-color: rgba(255,255,255,0.06);
            --ag-row-hover-color: rgba(255,255,255,0.04);
            --ag-foreground-color: #E8EAF0;
            --ag-font-size: 12px;
            --ag-font-family: "IBM Plex Mono", monospace;
          }
        `}</style>
        <div className="ag-theme-balham" style={{ height, width: '100%' }}>
          <AgGridReact
            rowData={data}
            columnDefs={columnDefs}
            defaultColDef={{ resizable: true }}
            animateRows
            pagination
            paginationPageSize={50}
            rowHeight={44}
            headerHeight={36}
          />
        </div>
      </Box>
    </Box>
  );
};

export default AgStockTable;
