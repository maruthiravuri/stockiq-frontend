import { useEffect, useRef, useCallback, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const WS_URL = process.env.REACT_APP_WS_URL || 'http://localhost:8082/ws/quotes';

interface QuoteUpdate {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: string;
}

interface UseWebSocketReturn {
  connected: boolean;
  subscribe: (symbols: string[]) => void;
  quotes: Record<string, QuoteUpdate>;
}

export const useMarketWebSocket = (): UseWebSocketReturn => {
  const clientRef = useRef<Client | null>(null);
  const [connected, setConnected] = useState(false);
  const [quotes, setQuotes] = useState<Record<string, QuoteUpdate>>({});
  const subscribedSymbols = useRef<string[]>([]);

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      reconnectDelay: 5000,
      onConnect: () => {
        setConnected(true);
        // Subscribe to default symbols on connect
        const defaults = ['AAPL', 'MSFT', 'NVDA', 'GOOGL', 'AMZN', 'META', 'TSLA', 'VOO', 'GLD'];
        defaults.forEach(symbol => {
          client.subscribe(`/topic/quotes/${symbol}`, msg => {
            try {
              const q: QuoteUpdate = JSON.parse(msg.body);
              setQuotes(prev => ({ ...prev, [q.symbol]: q }));
            } catch (e) {
              // ignore parse errors
            }
          });
        });
      },
      onDisconnect: () => setConnected(false),
      onStompError: frame => {
        console.warn('STOMP error, will retry:', frame.headers?.message);
        setConnected(false);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, []);

  const subscribe = useCallback((symbols: string[]) => {
    if (!clientRef.current?.connected) return;
    const newSymbols = symbols.filter(s => !subscribedSymbols.current.includes(s));
    newSymbols.forEach(symbol => {
      clientRef.current!.subscribe(`/topic/quotes/${symbol}`, msg => {
        try {
          const q: QuoteUpdate = JSON.parse(msg.body);
          setQuotes(prev => ({ ...prev, [q.symbol]: q }));
        } catch (e) { /* ignore */ }
      });
    });
    subscribedSymbols.current = [...subscribedSymbols.current, ...newSymbols];
    if (newSymbols.length > 0) {
      clientRef.current.publish({
        destination: '/app/subscribe',
        body: JSON.stringify(newSymbols),
      });
    }
  }, []);

  return { connected, subscribe, quotes };
};
