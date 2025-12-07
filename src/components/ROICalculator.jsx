import React, { useState, useEffect } from 'react';
import { Info, TrendingUp, Server, Activity, Zap, DollarSign, HelpCircle, AlertCircle, CheckCircle2, Code2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ROICalculator = () => {
  const { theme } = useTheme();
  // --- STATE: INPUTS (Defaults based on Solveeit Case Study) ---
  const [traffic, setTraffic] = useState({
    monthlyConversations: 10000,
    msgsPerConvo: 6,
    tokensPerMsg: 650, // Input + Output combined
  });

  const [costs, setCosts] = useState({
    costPerMillionTokens: 0.40, // Calculated from PDF ($2.34 / 5.85M tokens)
  });

  const [monetization, setMonetization] = useState({
    adType: 'CPM', // 'CPM' or 'CPC'
    adFrequency: 10, // Ad shown every X messages
    fillRate: 92, // %
    cpmPrice: 5.00,
    cpcPrice: 1.00,
    ctr: 1.7, // %
  });

  // --- STATE: OUTPUTS ---
  const [results, setResults] = useState({
    // Monthly totals
    totalMessages: 0,
    totalTokens: 0,
    inferenceCost: 0,
    totalAdSlots: 0,
    adsServed: 0,
    cpmRevenue: 0,
    cpcRevenue: 0,
    totalRevenue: 0,
    netProfit: 0,
    roi: 0,
    // Per conversation metrics
    perConvoMessages: 0,
    perConvoTokens: 0,
    perConvoInferenceCost: 0,
    perConvoAdSlots: 0,
    perConvoAdsServed: 0,
    perConvoRevenue: 0,
    perConvoNetProfit: 0,
  });

  // --- CALCULATION ENGINE ---
  useEffect(() => {
    // 1. Scale Metrics (Monthly)
    const totalMessages = traffic.monthlyConversations * traffic.msgsPerConvo;
    const totalTokens = totalMessages * traffic.tokensPerMsg;

    // 2. Cost Calculation
    // (Total Tokens / 1M) * Cost per 1M
    const inferenceCost = (totalTokens / 1000000) * costs.costPerMillionTokens;

    // 3. Ad Inventory Calculation
    // Calculate potential ad slots: Messages / Frequency
    const potentialAdSlots = totalMessages / monetization.adFrequency;
    const adsServed = potentialAdSlots * (monetization.fillRate / 100);

    // 4. Revenue Calculation
    // Based on selected ad type
    let revFromCPM = 0;
    let revFromCPC = 0;
    
    if (monetization.adType === 'CPM') {
      // CPM Revenue: (Ads / 1000) * CPM Price
      revFromCPM = (adsServed / 1000) * monetization.cpmPrice;
    } else {
      // CPC Revenue: Ads * CTR * CPC Price
      revFromCPC = adsServed * (monetization.ctr / 100) * monetization.cpcPrice;
    }

    const totalRevenue = revFromCPM + revFromCPC;
    const netProfit = totalRevenue - inferenceCost;

    // ROI = (Net Profit / Cost) * 100
    const roi = inferenceCost > 0 ? (netProfit / inferenceCost) * 100 : 0;

    // 5. Per Conversation Metrics
    const perConvoMessages = traffic.msgsPerConvo;
    const perConvoTokens = traffic.msgsPerConvo * traffic.tokensPerMsg;
    const perConvoInferenceCost = (perConvoTokens / 1000000) * costs.costPerMillionTokens;
    const perConvoAdSlots = traffic.msgsPerConvo / monetization.adFrequency;
    const perConvoAdsServed = perConvoAdSlots * (monetization.fillRate / 100);
    
    // Per conversation revenue
    let perConvoRevFromCPM = 0;
    let perConvoRevFromCPC = 0;
    
    if (monetization.adType === 'CPM') {
      perConvoRevFromCPM = (perConvoAdsServed / 1000) * monetization.cpmPrice;
    } else {
      perConvoRevFromCPC = perConvoAdsServed * (monetization.ctr / 100) * monetization.cpcPrice;
    }
    
    const perConvoRevenue = perConvoRevFromCPM + perConvoRevFromCPC;
    const perConvoNetProfit = perConvoRevenue - perConvoInferenceCost;

    setResults({
      totalMessages,
      totalTokens,
      inferenceCost,
      totalAdSlots: potentialAdSlots,
      adsServed,
      cpmRevenue: revFromCPM,
      cpcRevenue: revFromCPC,
      totalRevenue,
      netProfit,
      roi,
      perConvoMessages,
      perConvoTokens,
      perConvoInferenceCost,
      perConvoAdSlots,
      perConvoAdsServed,
      perConvoRevenue,
      perConvoNetProfit,
    });
  }, [traffic, costs, monetization]);

  // --- FORMATTERS ---
  const fmtCurrency = (val) => new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 4
  }).format(val);
  
  const fmtNum = (val) => new Intl.NumberFormat('en-US', { 
    notation: "compact", 
    maximumFractionDigits: 1 
  }).format(val);
  
  const fmtNumExact = (val) => new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2
  }).format(val);

  // Format tokens with K notation (e.g., 6.5k, 10k, 1.2M)
  const fmtTokens = (val) => {
    if (val >= 1000000) {
      return (val / 1000000).toFixed(1) + 'M';
    } else if (val >= 1000) {
      return (val / 1000).toFixed(1) + 'k';
    }
    return val.toLocaleString('en-US');
  };

  // Format numbers with commas
  const fmtNumWithCommas = (val) => {
    return val.toLocaleString('en-US', {
      maximumFractionDigits: 2
    });
  };

  return (
    <div className={`w-full max-w-7xl mx-auto bg-white text-gray-900 transition-all duration-300 ${
      theme === 'apple' ? 'font-sans' : 'font-sans'
    }`}>
      
      {/* Header Section */}
      <div className={`px-4 sm:px-6 md:px-8 transition-all duration-300 ${
        theme === 'apple' 
          ? 'pt-12 sm:pt-16 md:pt-20 pb-8 sm:pb-12' 
          : 'pt-6 sm:pt-8 pb-4 sm:pb-6'
      }`}>
        <div className={`flex items-center gap-3 mb-2 ${
          theme === 'apple' ? 'mb-4' : 'mb-2'
        }`}>
          <h1 className={`font-bold transition-all duration-300 ${
            theme === 'apple'
              ? 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-gray-900 tracking-tight'
              : 'text-2xl sm:text-3xl md:text-4xl bg-gradient-to-r from-purple-600 via-purple-500 to-blue-600 bg-clip-text text-transparent'
          }`}>
            Earnings Calculator
          </h1>
          {theme !== 'apple' && (
            <span className="text-purple-600 font-mono text-lg sm:text-xl md:text-2xl">&lt;/&gt;</span>
          )}
        </div>
        <p className={`transition-all duration-300 ${
          theme === 'apple'
            ? 'text-gray-600 text-lg sm:text-xl md:text-2xl leading-relaxed'
            : 'text-gray-600 text-sm sm:text-base'
        }`}>
          {theme === 'apple' ? (
            <>Estimate how native ads offset your AI inference costs</>
          ) : (
            <>
              Estimate how native ads offset your AI inference costs
              <span className="ml-2 text-xs text-gray-400 font-mono">// AI unit economics, at a glance</span>
            </>
          )}
        </p>
      </div>

      {/* HERO SECTION: Key Results First */}
      <div className={`px-4 sm:px-6 md:px-8 transition-all duration-300 ${
        theme === 'apple'
          ? 'mb-12 sm:mb-16 md:mb-20'
          : 'mb-6 sm:mb-8 sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-gray-100 lg:static lg:border-b-0'
      }`}>
        <div className={`transition-all duration-300 ${
          theme === 'apple'
            ? `rounded-3xl p-12 sm:p-16 md:p-20 border ${
                results.netProfit > 0
                  ? 'bg-gray-50 border-gray-100 shadow-sm'
                  : 'bg-gray-50 border-gray-100 shadow-sm'
              }`
            : `rounded-2xl p-6 sm:p-8 border-2 ${
                results.netProfit > 0 
                  ? 'bg-gradient-to-br from-purple-50 via-blue-50 to-purple-50 border-purple-200 shadow-lg shadow-purple-100/50' 
                  : 'bg-gradient-to-br from-red-50 via-orange-50 to-red-50 border-red-200 shadow-lg shadow-red-100/50'
              }`
        }`}>
          <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between transition-all duration-300 ${
            theme === 'apple' ? 'gap-8 sm:gap-12' : 'gap-4 sm:gap-6'
          }`}>
            <div className="flex-1">
              <div className={`flex items-center gap-2 transition-all duration-300 ${
                theme === 'apple' ? 'mb-6' : 'mb-3'
              }`}>
                {results.netProfit > 0 ? (
                  <>
                    <CheckCircle2 className={`transition-colors duration-300 ${
                      theme === 'apple' ? 'w-6 h-6 text-gray-900' : 'w-5 h-5 text-purple-600'
                    }`} />
                    <span className={`font-semibold transition-all duration-300 ${
                      theme === 'apple' 
                        ? 'text-base sm:text-lg text-gray-900' 
                        : 'text-sm text-purple-700'
                    }`}>
                      Profitable
                    </span>
                  </>
                ) : (
                  <>
                    <AlertCircle className={`transition-colors duration-300 ${
                      theme === 'apple' ? 'w-6 h-6 text-gray-900' : 'w-5 h-5 text-red-600'
                    }`} />
                    <span className={`font-semibold transition-all duration-300 ${
                      theme === 'apple' 
                        ? 'text-base sm:text-lg text-gray-900' 
                        : 'text-sm text-red-700'
                    }`}>
                      Not Profitable
                    </span>
                  </>
                )}
              </div>
              <div className={`font-bold tracking-tight transition-all duration-300 mb-2 ${
                theme === 'apple'
                  ? `text-6xl sm:text-7xl md:text-8xl lg:text-9xl ${
                      results.netProfit > 0 ? 'text-gray-900' : 'text-gray-900'
                    }`
                  : `text-4xl sm:text-5xl md:text-6xl lg:text-7xl ${
                      results.netProfit > 0 
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent' 
                        : 'text-red-600'
                    }`
              }`}>
                {fmtCurrency(results.netProfit)}
              </div>
              <p className={`transition-all duration-300 ${
                theme === 'apple'
                  ? 'text-gray-600 text-xl sm:text-2xl md:text-3xl mb-2'
                  : 'text-sm sm:text-base text-gray-600 mb-1'
              }`}>
                Net profit per month
              </p>
              {theme !== 'apple' && (
                <p className="text-xs text-gray-400 font-mono mb-4">// revenue - inferenceCost</p>
              )}
              
              {/* Quick Stats Row */}
              <div className={`grid grid-cols-2 sm:grid-cols-3 transition-all duration-300 pt-4 ${
                theme === 'apple'
                  ? 'gap-6 sm:gap-8 border-t border-gray-200'
                  : 'gap-3 sm:gap-4 border-t border-gray-200/50'
              }`}>
                <div>
                  <p className={`transition-all duration-300 mb-1 ${
                    theme === 'apple' ? 'text-sm text-gray-600' : 'text-xs text-gray-500'
                  }`}>
                    ROI
                  </p>
                  <p className={`font-bold transition-all duration-300 ${
                    theme === 'apple'
                      ? `text-3xl sm:text-4xl ${
                          results.netProfit > 0 ? 'text-gray-900' : 'text-gray-900'
                        }`
                      : `text-xl sm:text-2xl ${
                          results.netProfit > 0 
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent' 
                            : 'text-red-600'
                        }`
                  }`}>
                    {results.roi > 0 ? '+' : ''}{results.roi.toFixed(0)}%
                  </p>
                </div>
                <div>
                  <p className={`transition-all duration-300 mb-1 ${
                    theme === 'apple' ? 'text-sm text-gray-600' : 'text-xs text-gray-500'
                  }`}>
                    Revenue
                  </p>
                  <p className={`font-bold text-gray-900 transition-all duration-300 ${
                    theme === 'apple' ? 'text-3xl sm:text-4xl' : 'text-xl sm:text-2xl'
                  }`}>
                    {fmtCurrency(results.totalRevenue)}
                  </p>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <p className={`transition-all duration-300 mb-1 ${
                    theme === 'apple' ? 'text-sm text-gray-600' : 'text-xs text-gray-500'
                  }`}>
                    Costs
                  </p>
                  <p className={`font-bold text-gray-900 transition-all duration-300 ${
                    theme === 'apple' ? 'text-3xl sm:text-4xl' : 'text-xl sm:text-2xl'
                  }`}>
                    {fmtCurrency(results.inferenceCost)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: Single Column on Mobile, Two Column on Desktop */}
      <div className={`px-4 sm:px-6 md:px-8 transition-all duration-300 ${
        theme === 'apple' ? 'pb-16 sm:pb-20' : 'pb-8 sm:pb-10'
      }`}>
        <div className={`grid grid-cols-1 lg:grid-cols-3 transition-all duration-300 ${
          theme === 'apple' ? 'gap-8 lg:gap-12' : 'gap-6 lg:gap-8'
        }`}>
          
          {/* LEFT: Inputs Section - Sticky on Desktop */}
          <div className={`lg:col-span-2 transition-all duration-300 ${
            theme === 'apple' ? 'space-y-8 sm:space-y-12' : 'space-y-4 sm:space-y-6'
          }`}>
          
            {/* Section 1: Traffic & Usage */}
            <div className={`bg-white rounded-xl border transition-all duration-300 ${
              theme === 'apple'
                ? 'border-gray-100 shadow-sm'
                : 'border-gray-200 shadow-sm'
            }`}>
              <div className={`px-4 sm:px-5 py-3 sm:py-4 border-b transition-all duration-300 ${
                theme === 'apple'
                  ? 'border-gray-100 bg-white'
                  : 'border-gray-100 bg-gray-50/50'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className={`transition-colors duration-300 ${
                      theme === 'apple' ? 'w-5 h-5 text-gray-900' : 'w-4 h-4 text-purple-600'
                    }`} />
                    <h3 className={`font-semibold text-gray-900 transition-all duration-300 ${
                      theme === 'apple' ? 'text-lg sm:text-xl' : 'text-sm sm:text-base'
                    }`}>
                      Traffic & Usage
                    </h3>
                  </div>
                  {theme !== 'apple' && (
                    <span className="text-xs text-gray-400 font-mono">const traffic</span>
                  )}
                </div>
              </div>
              
              <div className={`p-4 sm:p-5 transition-all duration-300 ${
                theme === 'apple' ? 'space-y-6 sm:space-y-8' : 'space-y-4'
              }`}>
              <InputGroup 
                theme={theme}
                label="Monthly Conversations" 
                tooltip="Total number of conversations your platform handles per month"
                value={traffic.monthlyConversations} 
                unit=""
                onChange={(v) => setTraffic({...traffic, monthlyConversations: v})}
                min={100} max={1000000} step={100}
                presetValues={[1000, 10000, 50000, 100000]}
              />
              <InputGroup 
                theme={theme}
                label="Messages per Conversation" 
                tooltip="Average number of messages exchanged in a single conversation"
                value={traffic.msgsPerConvo} 
                unit="msgs"
                onChange={(v) => setTraffic({...traffic, msgsPerConvo: v})}
                min={3} max={30} step={1}
                presetValues={[3, 6, 10, 15, 20]}
              />
              <InputGroup 
                theme={theme}
                label="Tokens per Message" 
                tooltip="Total tokens used per message (input + output). Typical range: 350-2000 tokens"
                value={traffic.tokensPerMsg} 
                unit="tokens"
                onChange={(v) => setTraffic({...traffic, tokensPerMsg: v})}
                min={200} max={3000} step={50}
                presetValues={[400, 650, 1000, 1500, 2000]}
              />
            </div>
          </div>

            {/* Section 2: Costs */}
            <div className={`bg-white rounded-xl border transition-all duration-300 ${
              theme === 'apple'
                ? 'border-gray-100 shadow-sm'
                : 'border-gray-200 shadow-sm'
            }`}>
              <div className={`px-4 sm:px-5 py-3 sm:py-4 border-b transition-all duration-300 ${
                theme === 'apple'
                  ? 'border-gray-100 bg-white'
                  : 'border-gray-100 bg-gray-50/50'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Server className={`transition-colors duration-300 ${
                      theme === 'apple' ? 'w-5 h-5 text-gray-900' : 'w-4 h-4 text-purple-600'
                    }`} />
                    <h3 className={`font-semibold text-gray-900 transition-all duration-300 ${
                      theme === 'apple' ? 'text-lg sm:text-xl' : 'text-sm sm:text-base'
                    }`}>
                      AI Model Costs
                    </h3>
                  </div>
                  {theme !== 'apple' && (
                    <span className="text-xs text-gray-400 font-mono">const costs</span>
                  )}
                </div>
              </div>
              <div className={`p-4 sm:p-5 transition-all duration-300 ${
                theme === 'apple' ? 'space-y-6' : ''
              }`}>
                <InputGroup 
                  theme={theme}
                  label="Cost per 1M Tokens" 
                  tooltip="Your LLM provider's pricing. GPT-4: ~$30-60, Claude: ~$15-75, Llama/Open Source: $0.20-$5"
                  value={costs.costPerMillionTokens} 
                  unit="$"
                  isCurrency
                  onChange={(v) => setCosts({...costs, costPerMillionTokens: v})}
                  min={0.20} max={100.00} step={0.10}
                  presetValues={[0.40, 1.00, 5.00, 15.00, 30.00, 60.00]}
                />
              </div>
            </div>

            {/* Section 3: Ad Configuration */}
            <div className={`bg-white rounded-xl border transition-all duration-300 ${
              theme === 'apple'
                ? 'border-gray-100 shadow-sm'
                : 'border-gray-200 shadow-sm'
            }`}>
              <div className={`px-4 sm:px-5 py-3 sm:py-4 border-b transition-all duration-300 ${
                theme === 'apple'
                  ? 'border-gray-100 bg-white'
                  : 'border-gray-100 bg-gray-50/50'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className={`transition-colors duration-300 ${
                      theme === 'apple' ? 'w-5 h-5 text-gray-900' : 'w-4 h-4 text-purple-600'
                    }`} />
                    <h3 className={`font-semibold text-gray-900 transition-all duration-300 ${
                      theme === 'apple' ? 'text-lg sm:text-xl' : 'text-sm sm:text-base'
                    }`}>
                      Ad Settings
                    </h3>
                  </div>
                  {theme !== 'apple' && (
                    <span className="text-xs text-gray-400 font-mono">const ads</span>
                  )}
                </div>
              </div>
              
              <div className={`p-4 sm:p-5 transition-all duration-300 ${
                theme === 'apple' ? 'space-y-6 sm:space-y-8' : 'space-y-4'
              }`}>
                <InputGroup 
                  theme={theme}
                  label="Show Ad Every X Messages" 
                  tooltip="How often ads appear. Lower = more ads but potentially worse UX"
                  value={monetization.adFrequency} 
                  unit="msgs"
                  onChange={(v) => setMonetization({...monetization, adFrequency: v})}
                  min={3} max={20} step={1}
                  presetValues={[5, 10, 15, 20]}
                />
                <InputGroup 
                  theme={theme}
                  label="Fill Rate" 
                  tooltip="Percentage of ad slots that get filled with actual ads (demand availability)"
                  value={monetization.fillRate} 
                  unit="%"
                  onChange={(v) => setMonetization({...monetization, fillRate: v})}
                  min={50} max={100} step={1}
                  presetValues={[70, 85, 92, 95, 98]}
                />

                {/* Ad Type Selector */}
                <div className={`pt-2 border-t transition-all duration-300 ${
                  theme === 'apple' ? 'border-gray-200 pt-6' : 'border-gray-100 pt-2'
                }`}>
                  <label className={`mb-3 block flex items-center gap-1 transition-all duration-300 ${
                    theme === 'apple' ? 'text-sm text-gray-900' : 'text-xs text-gray-600'
                  }`}>
                    Ad Type
                    <HelpCircle className={`transition-all duration-300 ${
                      theme === 'apple' ? 'w-4 h-4' : 'w-3 h-3'
                    }`} />
                  </label>
                  <div className={`grid grid-cols-2 transition-all duration-300 ${
                    theme === 'apple' ? 'gap-4 mb-6' : 'gap-2 mb-4'
                  }`}>
                    <button
                      type="button"
                      onClick={() => setMonetization({...monetization, adType: 'CPM'})}
                      className={`px-4 py-3 rounded-lg border-2 transition-all font-medium transition-all duration-300 ${
                        theme === 'apple'
                          ? `text-base ${
                              monetization.adType === 'CPM'
                                ? 'bg-gray-900 border-gray-900 text-white'
                                : 'bg-white border-gray-200 text-gray-900 hover:border-gray-300'
                            }`
                          : `text-sm ${
                              monetization.adType === 'CPM'
                                ? 'bg-purple-50 border-purple-500 text-purple-700 shadow-sm'
                                : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                            }`
                      }`}
                    >
                      CPM
                      <span className={`block mt-1 font-normal transition-all duration-300 ${
                        theme === 'apple'
                          ? `text-sm ${
                              monetization.adType === 'CPM' ? 'text-gray-300' : 'text-gray-500'
                            }`
                          : 'text-xs text-gray-500'
                      }`}>
                        Cost per 1,000 views
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setMonetization({...monetization, adType: 'CPC'})}
                      className={`px-4 py-3 rounded-lg border-2 transition-all font-medium transition-all duration-300 ${
                        theme === 'apple'
                          ? `text-base ${
                              monetization.adType === 'CPC'
                                ? 'bg-gray-900 border-gray-900 text-white'
                                : 'bg-white border-gray-200 text-gray-900 hover:border-gray-300'
                            }`
                          : `text-sm ${
                              monetization.adType === 'CPC'
                                ? 'bg-purple-50 border-purple-500 text-purple-700 shadow-sm'
                                : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                            }`
                      }`}
                    >
                      CPC
                      <span className={`block mt-1 font-normal transition-all duration-300 ${
                        theme === 'apple'
                          ? `text-sm ${
                              monetization.adType === 'CPC' ? 'text-gray-300' : 'text-gray-500'
                            }`
                          : 'text-xs text-gray-500'
                      }`}>
                        Cost per click
                      </span>
                    </button>
                  </div>

                  {/* Conditional Fields Based on Ad Type */}
                  {monetization.adType === 'CPM' ? (
                    <InputGroup 
                      theme={theme}
                      label="CPM Rate (per 1,000 views)" 
                      tooltip="Revenue per 1,000 ad impressions. Typical range: $2-$15"
                      value={monetization.cpmPrice} 
                      unit="$"
                      isCurrency
                      onChange={(v) => setMonetization({...monetization, cpmPrice: v})}
                      min={0.50} max={50} step={0.50}
                      presetValues={[2.00, 5.00, 10.00, 15.00]}
                    />
                  ) : (
                    <>
                      <InputGroup 
                        theme={theme}
                        label="CPC Rate (per click)" 
                        tooltip="Revenue when a user clicks an ad. Typical range: $0.50-$3.00"
                        value={monetization.cpcPrice} 
                        unit="$"
                        isCurrency
                        onChange={(v) => setMonetization({...monetization, cpcPrice: v})}
                        min={0.10} max={10} step={0.10}
                        presetValues={[0.50, 1.00, 2.00, 3.00]}
                      />
                      <InputGroup 
                        theme={theme}
                        label="Click-Through Rate (CTR)" 
                        tooltip="Percentage of users who click on ads. Industry average: 0.5%-2%"
                        value={monetization.ctr} 
                        unit="%"
                        onChange={(v) => setMonetization({...monetization, ctr: v})}
                        min={0.1} max={5.0} step={0.1}
                        presetValues={[0.5, 1.0, 1.7, 2.5, 3.5]}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Results Sidebar - Sticky on Desktop */}
          <div className="lg:col-span-1">
            <div className={`lg:sticky lg:top-6 transition-all duration-300 ${
              theme === 'apple' ? 'space-y-8 sm:space-y-10' : 'space-y-4 sm:space-y-6'
            }`}>
              
              {/* Visual Cost vs Revenue Bar */}
              <div className={`bg-white rounded-xl border transition-all duration-300 ${
                theme === 'apple'
                  ? 'border-gray-100 shadow-sm'
                  : 'border-gray-200 shadow-sm'
              }`}>
                <div className={`px-4 sm:px-5 py-3 border-b transition-all duration-300 ${
                  theme === 'apple'
                    ? 'border-gray-100 bg-white'
                    : 'border-gray-100 bg-gray-50/50'
                }`}>
                  <h4 className={`font-semibold text-gray-900 transition-all duration-300 ${
                    theme === 'apple' ? 'text-base sm:text-lg' : 'text-sm'
                  }`}>
                    Cost vs Revenue
                  </h4>
                </div>
                <div className={`p-4 sm:p-5 transition-all duration-300 ${
                  theme === 'apple' ? 'space-y-4' : 'space-y-3'
                }`}>
                  <div>
                    <div className={`flex justify-between mb-1 transition-all duration-300 ${
                      theme === 'apple' ? 'text-sm text-gray-600' : 'text-xs text-gray-600'
                    }`}>
                      <span>AI Costs</span>
                      <span className={`font-semibold transition-all duration-300 ${
                        theme === 'apple' ? 'text-base' : ''
                      }`}>
                        {fmtCurrency(results.inferenceCost)}
                      </span>
                    </div>
                    <div className={`w-full bg-gray-200 rounded-full overflow-hidden transition-all duration-300 ${
                      theme === 'apple' ? 'h-3' : 'h-2.5'
                    }`}>
                      <div 
                        className={`h-full transition-all duration-300 ${
                          theme === 'apple' ? 'bg-gray-900' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(100, (results.inferenceCost / Math.max(results.totalRevenue, results.inferenceCost)) * 100)}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className={`flex justify-between mb-1 transition-all duration-300 ${
                      theme === 'apple' ? 'text-sm text-gray-600' : 'text-xs text-gray-600'
                    }`}>
                      <span>Ad Revenue</span>
                      <span className={`font-semibold transition-all duration-300 ${
                        theme === 'apple' ? 'text-base' : ''
                      }`}>
                        {fmtCurrency(results.totalRevenue)}
                      </span>
                    </div>
                    <div className={`w-full bg-gray-200 rounded-full overflow-hidden transition-all duration-300 ${
                      theme === 'apple' ? 'h-3' : 'h-2.5'
                    }`}>
                      <div 
                        className={`h-full transition-all duration-300 ${
                          theme === 'apple' 
                            ? 'bg-gray-600' 
                            : 'bg-gradient-to-r from-purple-500 to-blue-500'
                        }`}
                        style={{ width: `${Math.min(100, (results.totalRevenue / Math.max(results.totalRevenue, results.inferenceCost)) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Per Conversation Metrics */}
              <div className={`bg-white rounded-xl border transition-all duration-300 ${
                theme === 'apple'
                  ? 'border-gray-100 shadow-sm'
                  : 'border-gray-200 shadow-sm'
              }`}>
                <div className={`px-4 sm:px-5 py-3 border-b transition-all duration-300 ${
                  theme === 'apple'
                    ? 'border-gray-100 bg-white'
                    : 'border-gray-100 bg-gray-50/50'
                }`}>
                  <h4 className={`font-semibold text-gray-900 flex items-center gap-2 transition-all duration-300 ${
                    theme === 'apple' ? 'text-base sm:text-lg' : 'text-sm'
                  }`}>
                    <DollarSign className={`transition-colors duration-300 ${
                      theme === 'apple' ? 'w-4 h-4 text-gray-900' : 'w-3 h-3 text-purple-600'
                    }`} />
                    Per Conversation
                  </h4>
                </div>
                
                <div className={`p-4 sm:p-5 transition-all duration-300 ${
                  theme === 'apple' ? 'space-y-4' : 'space-y-3'
                }`}>
                  <div className={`grid grid-cols-2 transition-all duration-300 ${
                    theme === 'apple' ? 'gap-4' : 'gap-2'
                  }`}>
                    <div className={`rounded-lg p-2.5 border transition-all duration-300 ${
                      theme === 'apple'
                        ? 'bg-white border-gray-200 p-4'
                        : 'bg-gray-50 border-gray-100'
                    }`}>
                      <p className={`mb-1 transition-all duration-300 ${
                        theme === 'apple' ? 'text-sm text-gray-600' : 'text-xs text-gray-500'
                      }`}>
                        Messages
                      </p>
                      <p className={`font-bold text-gray-900 transition-all duration-300 ${
                        theme === 'apple' 
                          ? 'text-lg font-sans' 
                          : 'text-sm font-mono'
                      }`}>
                        {fmtNumWithCommas(results.perConvoMessages)}
                      </p>
                    </div>
                    <div className={`rounded-lg p-2.5 border transition-all duration-300 ${
                      theme === 'apple'
                        ? 'bg-white border-gray-200 p-4'
                        : 'bg-gray-50 border-gray-100'
                    }`}>
                      <p className={`mb-1 transition-all duration-300 ${
                        theme === 'apple' ? 'text-sm text-gray-600' : 'text-xs text-gray-500'
                      }`}>
                        Tokens
                      </p>
                      <p className={`font-bold text-gray-900 transition-all duration-300 ${
                        theme === 'apple' 
                          ? 'text-lg font-sans' 
                          : 'text-sm font-mono'
                      }`}>
                        {fmtTokens(results.perConvoTokens)}
                      </p>
                    </div>
                  </div>
                  
                  <div className={`pt-2 border-t transition-all duration-300 ${
                    theme === 'apple' ? 'border-gray-200 pt-4' : 'border-gray-100 pt-2'
                  }`}>
                    <div className={`flex justify-between items-center transition-all duration-300 ${
                      theme === 'apple' ? 'py-2' : 'py-1.5'
                    }`}>
                      <span className={`transition-all duration-300 ${
                        theme === 'apple' ? 'text-sm text-gray-600' : 'text-xs text-gray-600'
                      }`}>
                        Cost
                      </span>
                      <span className={`font-semibold text-gray-900 transition-all duration-300 ${
                        theme === 'apple' ? 'text-base font-sans' : 'text-sm font-mono'
                      }`}>
                        {fmtCurrency(results.perConvoInferenceCost)}
                      </span>
                    </div>
                    <div className={`flex justify-between items-center transition-all duration-300 ${
                      theme === 'apple' ? 'py-2' : 'py-1.5'
                    }`}>
                      <span className={`transition-all duration-300 ${
                        theme === 'apple' ? 'text-sm text-gray-600' : 'text-xs text-gray-600'
                      }`}>
                        Revenue
                      </span>
                      <span className={`font-semibold transition-all duration-300 ${
                        theme === 'apple'
                          ? 'text-base font-sans text-gray-900'
                          : 'text-sm font-mono bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent'
                      }`}>
                        {fmtCurrency(results.perConvoRevenue)}
                      </span>
                    </div>
                    <div className={`flex justify-between items-center pt-2 border-t transition-all duration-300 ${
                      theme === 'apple' ? 'border-gray-200 py-2' : 'border-gray-100 py-1.5'
                    }`}>
                      <span className={`font-medium text-gray-900 transition-all duration-300 ${
                        theme === 'apple' ? 'text-sm' : 'text-xs'
                      }`}>
                        Net Profit
                      </span>
                      <span className={`font-bold transition-all duration-300 ${
                        theme === 'apple'
                          ? `text-base font-sans ${
                              results.perConvoNetProfit > 0 ? 'text-gray-900' : 'text-gray-900'
                            }`
                          : `text-sm font-mono ${
                              results.perConvoNetProfit > 0 
                                ? 'bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent' 
                                : 'text-red-600'
                            }`
                      }`}>
                        {fmtCurrency(results.perConvoNetProfit)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contextual Insight */}
              <div className={`p-4 rounded-xl border flex gap-2 transition-all duration-300 ${
                theme === 'apple'
                  ? `text-sm ${
                      results.netProfit > 0 
                        ? 'bg-gray-50 border-gray-200 text-gray-900' 
                        : 'bg-gray-50 border-gray-200 text-gray-900'
                    }`
                  : `text-xs ${
                      results.netProfit > 0 
                        ? 'bg-purple-50 border-purple-200 text-purple-900' 
                        : 'bg-amber-50 border-amber-200 text-amber-900'
                    }`
              }`}>
                {results.netProfit > 0 ? (
                  <CheckCircle2 className={`flex-shrink-0 mt-0.5 transition-colors duration-300 ${
                    theme === 'apple' 
                      ? 'w-5 h-5 text-gray-900' 
                      : 'w-4 h-4 text-purple-600'
                  }`} />
                ) : (
                  <AlertCircle className={`flex-shrink-0 mt-0.5 transition-colors duration-300 ${
                    theme === 'apple' 
                      ? 'w-5 h-5 text-gray-900' 
                      : 'w-4 h-4 text-amber-600'
                  }`} />
                )}
                <div className="leading-relaxed">
                  <span className="font-semibold">Tip:</span> {results.netProfit > 0 
                    ? "Your unit economics are sustainable!" 
                    : "Try increasing fill rate or CPM to improve profitability."}
                </div>
              </div>

              {/* Developer Footer Note */}
              {theme !== 'apple' && (
                <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-xs text-gray-500 font-mono">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-3 h-3 text-purple-600" />
                    <span>// Real-time calculations • API-ready metrics</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- SUBCOMPONENTS ---

const InputGroup = ({ label, value, onChange, min, max, step = 1, unit, isCurrency, tooltip, presetValues, theme }) => {
  const [inputValue, setInputValue] = useState(value.toString());
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    const numValue = parseFloat(newValue);
    if (!isNaN(numValue) && numValue >= min && numValue <= max) {
      onChange(numValue);
    }
  };

  const handleInputBlur = () => {
    const numValue = parseFloat(inputValue);
    if (isNaN(numValue) || numValue < min) {
      setInputValue(min.toString());
      onChange(min);
    } else if (numValue > max) {
      setInputValue(max.toString());
      onChange(max);
    } else {
      onChange(numValue);
    }
  };

  return (
    <div className={`flex flex-col transition-all duration-300 ${
      theme === 'apple' ? 'gap-4' : 'gap-2'
    }`}>
      <div className={`flex justify-between items-center transition-all duration-300 ${
        theme === 'apple' ? 'mb-2' : 'mb-1'
      }`}>
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <span className={`truncate transition-all duration-300 ${
            theme === 'apple' ? 'text-base text-gray-900' : 'text-xs text-gray-600'
          }`}>
            {label}
          </span>
          {tooltip && (
            <div className="relative flex-shrink-0">
              <HelpCircle 
                className={`cursor-help transition-colors touch-manipulation ${
                  theme === 'apple'
                    ? 'w-4 h-4 text-gray-400 hover:text-gray-900'
                    : 'w-3.5 h-3.5 text-gray-400 hover:text-purple-600'
                }`}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onTouchStart={() => setShowTooltip(!showTooltip)}
              />
              {showTooltip && (
                <div className={`absolute left-0 bottom-full mb-2 w-56 sm:w-64 p-2 rounded-lg shadow-xl border z-50 transition-all duration-300 ${
                  theme === 'apple'
                    ? 'bg-white text-gray-900 border-gray-200 text-sm'
                    : 'bg-gray-900 text-xs text-white border-gray-700'
                }`}>
                  {tooltip}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <input
            type="number"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            min={min}
            max={max}
            step={step}
            className={`px-2 bg-white border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent touch-manipulation transition-all duration-300 ${
              theme === 'apple'
                ? 'w-24 sm:w-28 py-2 border-gray-300 text-base font-sans focus:ring-gray-900'
                : 'w-20 sm:w-24 py-1.5 sm:py-1 border-gray-300 text-sm font-mono focus:ring-purple-500'
            }`}
          />
          {!isCurrency && unit && (
            <span className={`hidden sm:inline transition-all duration-300 ${
              theme === 'apple' ? 'text-sm text-gray-600' : 'text-xs text-gray-500'
            }`}>
              {unit}
            </span>
          )}
        </div>
      </div>
      
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => {
          const newValue = parseFloat(e.target.value);
          onChange(newValue);
          setInputValue(newValue.toString());
        }}
        className={`w-full bg-gray-200 rounded-lg appearance-none cursor-pointer transition-all touch-manipulation ${
          theme === 'apple'
            ? 'h-2 accent-gray-900 hover:accent-gray-700'
            : 'h-2.5 sm:h-2 accent-purple-600 hover:accent-purple-700'
        }`}
        style={{ WebkitTapHighlightColor: 'transparent' }}
      />
      
      {presetValues && presetValues.length > 0 && (
        <div className={`flex flex-wrap transition-all duration-300 mt-2 ${
          theme === 'apple' ? 'gap-3' : 'gap-1.5 sm:gap-2'
        }`}>
          {presetValues.map((preset) => (
            <button
              key={preset}
              onClick={() => {
                onChange(preset);
                setInputValue(preset.toString());
              }}
              className={`rounded-lg border transition-all touch-manipulation ${
                theme === 'apple'
                  ? `px-4 py-2 text-sm min-h-[40px] ${
                      Math.abs(value - preset) < step / 2
                        ? 'bg-gray-900 border-gray-900 text-white'
                        : 'bg-white border-gray-300 text-gray-900 hover:border-gray-400'
                    }`
                  : `px-2.5 sm:px-2 py-1.5 sm:py-0.5 text-xs min-h-[32px] sm:min-h-0 ${
                      Math.abs(value - preset) < step / 2
                        ? 'bg-purple-100 border-purple-500 text-purple-700'
                        : 'bg-white border-gray-300 text-gray-600 hover:border-purple-500 hover:text-purple-600 active:bg-purple-50'
                    }`
              }`}
            >
              {isCurrency ? `$${preset}` : preset}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const ResultRow = ({ label, value, highlight, subtext, icon, positive }) => (
  <div className="flex justify-between items-center py-1">
    <div className="flex items-center gap-2">
      {icon && <span className="text-gray-400">{icon}</span>}
      <span className={`text-xs ${highlight ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>{label}</span>
      {subtext && <p className="text-xs text-gray-500 mt-0.5">{subtext}</p>}
    </div>
    <span className={`font-mono text-right ${
      highlight 
        ? positive !== undefined 
          ? positive 
            ? 'bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent font-bold text-base' 
            : 'text-red-600 font-bold text-base'
          : 'bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent font-bold text-base'
        : 'text-gray-700 text-sm'
    }`}>
      {value}
    </span>
  </div>
);

export default ROICalculator;
