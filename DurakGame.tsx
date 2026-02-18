
import React, { useState, useEffect, useCallback } from 'react';

type Suit = '♠' | '♣' | '♥' | '♦';
type Rank = '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';
type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

const RANK_VALUE: Record<Rank, number> = {
  '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14
};

interface Card {
  id: string;
  suit: Suit;
  rank: Rank;
}

const suits: Suit[] = ['♠', '♣', '♥', '♦'];
const ranks: Rank[] = ['6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

const createDeck = (): Card[] => {
  const deck: Card[] = [];
  suits.forEach(suit => {
    ranks.forEach(rank => {
      deck.push({ id: `${rank}${suit}`, suit, rank });
    });
  });
  // Fisher-Yates shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
};

export const DurakGame: React.FC = () => {
  const [deck, setDeck] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [botHand, setBotHand] = useState<Card[]>([]);
  const [table, setTable] = useState<Card[]>([]);
  const [trump, setTrump] = useState<Card | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [attacker, setAttacker] = useState<'player' | 'bot'>('player');
  const [status, setStatus] = useState<string>('BOOTING...');
  const [isBotThinking, setIsBotThinking] = useState(false);
  const [discardPileCount, setDiscardPileCount] = useState(0);

  const initGame = useCallback(() => {
    if (!difficulty) return;
    const fullDeck = createDeck();
    
    // In this implementation, the last card in the deck array is the trump visible at the bottom
    const trumpCard = fullDeck[0]; 
    const initialDeck = [...fullDeck];

    const initialP = initialDeck.splice(initialDeck.length - 6, 6);
    const initialB = initialDeck.splice(initialDeck.length - 6, 6);
    
    setTrump(trumpCard);
    setPlayerHand(initialP);
    setBotHand(initialB);
    setDeck(initialDeck);
    setTable([]);
    setDiscardPileCount(0);
    setAttacker('player');
    setStatus('YOUR_ATTACK');
  }, [difficulty]);

  useEffect(() => {
    if (difficulty) initGame();
  }, [difficulty, initGame]);

  const refillHands = (currentDeck: Card[], pHand: Card[], bHand: Card[]) => {
    const workingDeck = [...currentDeck];
    const workingP = [...pHand];
    const workingB = [...bHand];

    // Priority to refill the attacker first
    if (attacker === 'player') {
      while (workingP.length < 6 && workingDeck.length > 0) workingP.push(workingDeck.pop()!);
      while (workingB.length < 6 && workingDeck.length > 0) workingB.push(workingDeck.pop()!);
    } else {
      while (workingB.length < 6 && workingDeck.length > 0) workingB.push(workingDeck.pop()!);
      while (workingP.length < 6 && workingDeck.length > 0) workingP.push(workingDeck.pop()!);
    }

    return { updatedDeck: workingDeck, updatedP: workingP, updatedB: workingB };
  };

  const endTurn = (taker: 'player' | 'bot' | null) => {
    let newP = [...playerHand];
    let newB = [...botHand];
    let nextAttacker: 'player' | 'bot' = attacker;

    if (taker === 'player') {
      // Player takes all cards from table
      newP = [...newP, ...table];
      // User request: After taking, swap roles so player attacks next
      nextAttacker = 'player';
      setStatus('YOU_TOOK. YOUR_ATTACK_PHASE');
    } else if (taker === 'bot') {
      // Bot takes cards
      newB = [...newB, ...table];
      nextAttacker = 'bot';
      setStatus('BOT_TOOK. BOT_ATTACK_PHASE');
    } else {
      // Successful defense - discard to pile
      setDiscardPileCount(prev => prev + table.length);
      // Normal role swap: defender becomes attacker
      nextAttacker = attacker === 'player' ? 'bot' : 'player';
      setStatus(nextAttacker === 'player' ? 'BITA! YOUR_ATTACK' : 'BITA! BOT_ATTACKS');
    }

    // Refill hands from deck
    const { updatedDeck, updatedP, updatedB } = refillHands(deck, newP, newB);
    
    setTable([]);
    setDeck(updatedDeck);
    setPlayerHand(updatedP);
    setBotHand(updatedB);
    setAttacker(nextAttacker);
  };

  const canBeat = (attack: Card, defense: Card) => {
    if (!trump) return false;
    if (attack.suit === defense.suit) return RANK_VALUE[defense.rank] > RANK_VALUE[attack.rank];
    return defense.suit === trump.suit; // Trump beats non-trump of any rank
  };

  const botLogic = useCallback(() => {
    if (isBotThinking || status.includes('WIN') || status.includes('LOSS')) return;

    if (attacker === 'bot' && table.length % 2 === 0) {
      // Bot Attacks
      setIsBotThinking(true);
      setTimeout(() => {
        let attackIdx = -1;
        if (table.length === 0) {
          // Attack with lowest value card (save trumps)
          let minVal = 1000;
          botHand.forEach((c, i) => {
            let v = RANK_VALUE[c.rank] + (c.suit === trump?.suit ? 50 : 0);
            if (v < minVal) { minVal = v; attackIdx = i; }
          });
        } else {
          // Add cards matching ranks on table
          const ranksOnTable = new Set(table.map(c => c.rank));
          botHand.forEach((c, i) => {
            if (ranksOnTable.has(c.rank)) {
              // Prefer adding non-trumps
              if (c.suit !== trump?.suit) attackIdx = i;
              else if (attackIdx === -1) attackIdx = i;
            }
          });
        }

        if (attackIdx !== -1) {
          const card = botHand[attackIdx];
          setTable(prev => [...prev, card]);
          setBotHand(prev => prev.filter((_, i) => i !== attackIdx));
          setStatus('BOT_ATTACKS! DEFEND_OR_TAKE');
        } else {
          // Bot cannot or chooses not to add more cards
          endTurn(null);
        }
        setIsBotThinking(false);
      }, 1000);
    } else if (attacker === 'player' && table.length % 2 !== 0) {
      // Bot Defends
      setIsBotThinking(true);
      setTimeout(() => {
        const attackCard = table[table.length - 1];
        let defIdx = -1;
        let minDefVal = 1000;

        botHand.forEach((c, i) => {
          if (canBeat(attackCard, c)) {
            let v = RANK_VALUE[c.rank] + (c.suit === trump?.suit ? 100 : 0);
            if (v < minDefVal) { minDefVal = v; defIdx = i; }
          }
        });

        if (defIdx !== -1) {
          const card = botHand[defIdx];
          setTable(prev => [...prev, card]);
          setBotHand(prev => prev.filter((_, i) => i !== defIdx));
          setStatus('BOT_DEFENDED. ADD_MORE?');
        } else {
          // Bot takes cards
          endTurn('bot');
        }
        setIsBotThinking(false);
      }, 1000);
    }
  }, [attacker, table, botHand, trump, deck, isBotThinking, status]);

  useEffect(() => {
    if (difficulty) {
      botLogic();
    }
  }, [attacker, table.length, difficulty, botLogic]);

  // Check Win/Loss
  useEffect(() => {
    if (deck.length === 0) {
      if (playerHand.length === 0 && botHand.length === 0) setStatus('DRAW.EXE');
      else if (playerHand.length === 0) setStatus('SYSTEM_VICTORY: YOU_WIN');
      else if (botHand.length === 0) setStatus('SYSTEM_FAILURE: YOU_LOSE');
    }
  }, [playerHand.length, botHand.length, deck.length]);

  const handlePlayerCardClick = (idx: number) => {
    if (isBotThinking || status.includes('WIN') || status.includes('LOSS')) return;
    const card = playerHand[idx];

    if (attacker === 'player') {
      // Player is attacking
      if (table.length % 2 !== 0) return; // Wait for bot defense
      // If table has cards, rank must match
      if (table.length > 0 && !table.some(c => c.rank === card.rank)) {
        setStatus('RANK_MISMATCH: CHOOSE_OTHER');
        return;
      }
      
      setTable(prev => [...prev, card]);
      setPlayerHand(prev => prev.filter((_, i) => i !== idx));
      setStatus('ATTACK_LOGGED. WAITING_FOR_DEFENSE...');
    } else {
      // Player is defending
      if (table.length % 2 === 0) return; // Nothing to beat right now
      const lastAttack = table[table.length - 1];
      if (canBeat(lastAttack, card)) {
        setTable(prev => [...prev, card]);
        setPlayerHand(prev => prev.filter((_, i) => i !== idx));
        setStatus('DEFENSE_ACCEPTED. BOT_CALCULATING...');
      } else {
        setStatus('CANNOT_BEAT_WITH_THIS');
      }
    }
  };

  const handleFinishAction = () => {
    if (isBotThinking) return;
    if (attacker === 'player') {
      // Bita/Finish attack
      if (table.length === 0 || table.length % 2 !== 0) return;
      endTurn(null);
    } else {
      // Take cards
      if (table.length === 0) return;
      endTurn('player');
    }
  };

  if (!difficulty) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-[#004d40] font-mono p-4">
        <div className="win-border bg-black text-green-500 p-4 w-full text-center mb-6 shadow-2xl">
          <h2 className="text-xl font-black italic animate-pulse tracking-tighter">DURAK_ONLINE_XP_v3.0</h2>
          <p className="text-[9px] opacity-50">SHUFFLING_CRYPTO_DECK...</p>
        </div>
        <div className="flex flex-col gap-3 w-48">
          {(['EASY', 'MEDIUM', 'HARD'] as Difficulty[]).map(d => (
            <button key={d} onClick={() => setDifficulty(d)} className="win-border bg-gray-300 py-2 font-bold hover:bg-white active:win-border-inset text-blue-900 uppercase">
              {d}_MODE
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#004d40] p-2 font-mono select-none overflow-hidden relative border-black">
      {/* Header Info */}
      <div className="flex justify-between items-center text-[8px] text-white/50 px-2 uppercase mb-1">
        <span>DECK: {deck.length}</span>
        <span>TRUMP: {trump?.suit}</span>
        <span>DISCARDED: {discardPileCount}</span>
      </div>

      {/* Bot Hand (Hidden) */}
      <div className="flex justify-center gap-1 mb-2">
        {botHand.map((_, i) => (
          <div key={i} className="w-7 h-11 bg-blue-900 win-border rounded-sm shadow-md flex items-center justify-center border-white/20">
            <div className="w-4 h-4 rounded-full border border-white/10 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        ))}
        <div className="ml-2 text-[8px] text-white flex flex-col justify-center font-bold">
          <span className="text-blue-400">CPU_BOT</span>
          <span className="opacity-70">CARDS: {botHand.length}</span>
        </div>
      </div>

      {/* Table Area */}
      <div className="flex-1 win-border-inset bg-[#00332a] m-1 p-3 flex items-center justify-center gap-2 flex-wrap content-center relative overflow-hidden">
        {table.length === 0 && (
          <div className="text-white/5 text-[10px] uppercase text-center flex flex-col items-center gap-1">
            <div className="animate-pulse">{attacker === 'player' ? 'AWAITING_INPUT' : 'CPU_PHASE_ACTIVE'}</div>
            <div className="text-[6px]">{attacker === 'player' ? 'SELECT_CARD_TO_STRIKE' : 'SCANNING_WEAKNESSES...'}</div>
          </div>
        )}
        {table.map((card, i) => (
          <div key={card.id} className={`w-10 h-16 bg-white win-border rounded-sm flex flex-col items-center justify-center text-xs shadow-2xl relative transition-all duration-300 ${i % 2 === 1 ? '-ml-5 mt-3 z-10 animate-in slide-in-from-top-2' : 'z-0 animate-in zoom-in-50'}`}>
            <span className={`font-bold ${card.suit === '♥' || card.suit === '♦' ? 'text-red-600' : 'text-black'}`}>{card.rank}</span>
            <span className={`text-sm ${card.suit === '♥' || card.suit === '♦' ? 'text-red-600' : 'text-black'}`}>{card.suit}</span>
          </div>
        ))}
      </div>

      {/* Game Status & Controls */}
      <div className="flex justify-between items-center py-1.5 px-2 bg-black/40 win-border border-gray-600 mb-1">
        <div className="flex items-center gap-2">
          {trump && (
            <div className="relative group">
              <div className="w-7 h-11 bg-white win-border rounded-sm flex flex-col items-center justify-center text-[10px] scale-90 shadow-lg">
                <span className={trump.suit === '♥' || trump.suit === '♦' ? 'text-red-600' : 'text-black'}>{trump.rank}</span>
                <span className={trump.suit === '♥' || trump.suit === '♦' ? 'text-red-600' : 'text-black'}>{trump.suit}</span>
              </div>
              <div className="absolute -top-3 left-0 text-[6px] text-white/50 font-bold">KOZIRI</div>
            </div>
          )}
        </div>
        
        <div className="flex-1 px-3">
          <div className="text-[9px] text-yellow-400 font-bold bg-blue-900/30 px-2 py-1 border border-blue-800/50 truncate uppercase text-center shadow-inner tracking-tight">
            {status}
          </div>
        </div>

        <button 
          onClick={handleFinishAction}
          disabled={isBotThinking || (attacker === 'player' && (table.length === 0 || table.length % 2 !== 0)) || (attacker === 'bot' && table.length === 0)}
          className="win-border bg-gray-300 px-4 py-1.5 text-[9px] font-bold uppercase active:win-border-inset disabled:opacity-30 transition-all text-blue-900"
        >
          {attacker === 'player' ? 'BITA' : 'TAKE'}
        </button>
      </div>

      {/* Player Hand */}
      <div className="flex justify-center gap-1.5 overflow-x-auto p-1 h-20 items-end no-scrollbar bg-black/10 rounded-t-lg">
        {playerHand.map((card, i) => {
          const isPlayable = !isBotThinking && (attacker === 'player' 
            ? (table.length % 2 === 0 && (table.length === 0 || table.some(c => c.rank === card.rank)))
            : (table.length % 2 !== 0 && canBeat(table[table.length - 1], card)));

          return (
            <button 
              key={card.id} 
              onClick={() => handlePlayerCardClick(i)} 
              disabled={isBotThinking || !isPlayable}
              className={`w-11 h-16 bg-white win-border rounded-sm flex flex-col items-center justify-center text-sm hover:-translate-y-3 transition-all shadow-xl shrink-0 active:win-border-inset relative group ${!isPlayable ? 'opacity-30 grayscale' : 'opacity-100 ring-2 ring-blue-500/50'}`}
            >
              <span className={`font-black ${card.suit === '♥' || card.suit === '♦' ? 'text-red-600' : 'text-black'}`}>{card.rank}</span>
              <span className={`text-lg leading-none ${card.suit === '♥' || card.suit === '♦' ? 'text-red-600' : 'text-black'}`}>{card.suit}</span>
              {card.suit === trump?.suit && (
                <div className="absolute top-0 right-0 w-2 h-2 bg-yellow-400 shadow-[0_0_5px_rgba(234,179,8,0.8)] rounded-bl-sm"></div>
              )}
            </button>
          );
        })}
      </div>

      {/* Visual footer decoration */}
      <div className="mt-1 h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
    </div>
  );
};
