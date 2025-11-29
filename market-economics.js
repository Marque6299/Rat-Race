// Market Economics System - Supply and Demand
const marketEconomics = {
    // Market conditions per asset
    marketConditions: {},
    
    // Supply and demand factors
    factors: {
        supply: {},  // How much is available
        demand: {},  // How much is wanted
        volume: {},  // Trading volume
        volatility: {} // Price volatility
    },
    
    // Economic indicators
    indicators: {
        inflation: 0.02,      // 2% base inflation
        interestRate: 0.05,    // 5% base interest rate
        economicGrowth: 0.03,  // 3% base growth
        marketSentiment: 0.5   // 0-1, neutral
    },
    
    // News effects (accumulated)
    newsEffects: {
        priceModifiers: {},    // Temporary price changes
        volumeModifiers: {},   // Trading volume changes
        sentimentModifiers: {} // Market sentiment changes
    }
};

// Make functions globally available
window.initializeMarketConditions = initializeMarketConditions;
window.updateSupplyAndDemand = updateSupplyAndDemand;
window.calculatePriceWithSupplyDemand = calculatePriceWithSupplyDemand;
window.applyTradingImpact = applyTradingImpact;
window.applyNewsToMarket = applyNewsToMarket;
window.getMarketConditionSummary = getMarketConditionSummary;

// Initialize market conditions for all assets
function initializeMarketConditions() {
    Object.keys(marketAssets).forEach(marketType => {
        marketAssets[marketType].forEach(asset => {
            const key = `${marketType}_${asset.symbol}`;
            
            marketEconomics.marketConditions[key] = {
                supply: 0.5 + Math.random() * 0.5,  // 0.5-1.0
                demand: 0.5 + Math.random() * 0.5,  // 0.5-1.0
                volume: 0.5 + Math.random() * 0.5,  // 0.5-1.0
                volatility: getMarketVolatility(marketType),
                basePrice: asset.basePrice,
                lastPrice: asset.basePrice
            };
            
            marketEconomics.factors.supply[key] = 1.0;
            marketEconomics.factors.demand[key] = 1.0;
            marketEconomics.factors.volume[key] = 1.0;
            marketEconomics.factors.volatility[key] = getMarketVolatility(marketType);
        });
    });
}

// Calculate supply and demand impact on price
function calculatePriceWithSupplyDemand(marketType, symbol, basePrice) {
    const key = `${marketType}_${symbol}`;
    const condition = marketEconomics.marketConditions[key];
    if (!condition) return basePrice;
    
    // Supply and demand ratio (demand/supply)
    // If demand > supply, price goes up
    // If supply > demand, price goes down
    const supplyDemandRatio = condition.demand / (condition.supply || 0.1);
    
    // Base price adjustment
    let priceMultiplier = 1.0;
    
    // Supply/demand effect (can cause 50% increase or decrease)
    priceMultiplier *= (0.5 + supplyDemandRatio * 0.5);
    
    // Volume effect (high volume = more stable prices, low volume = more volatile)
    const volumeEffect = condition.volume;
    priceMultiplier *= (0.9 + volumeEffect * 0.2);
    
    // Volatility effect (random within volatility range)
    const volatility = condition.volatility;
    const randomVolatility = 1 + (Math.random() - 0.5) * volatility * 2;
    priceMultiplier *= randomVolatility;
    
    // News effects
    const newsModifier = marketEconomics.newsEffects.priceModifiers[key] || 1.0;
    priceMultiplier *= newsModifier;
    
    // Economic indicators
    const inflationEffect = 1 + marketEconomics.indicators.inflation;
    const sentimentEffect = 0.8 + marketEconomics.indicators.marketSentiment * 0.4;
    priceMultiplier *= inflationEffect * sentimentEffect;
    
    return basePrice * priceMultiplier;
}

// Update supply and demand each turn
function updateSupplyAndDemand() {
    Object.keys(marketEconomics.marketConditions).forEach(key => {
        const condition = marketEconomics.marketConditions[key];
        
        // Supply changes (random walk with slight mean reversion)
        const supplyChange = (Math.random() - 0.5) * 0.1;
        condition.supply = Math.max(0.1, Math.min(2.0, condition.supply + supplyChange));
        
        // Demand changes (influenced by market sentiment and news)
        const demandChange = (Math.random() - 0.5) * 0.1 + 
                           (marketEconomics.indicators.marketSentiment - 0.5) * 0.05;
        condition.demand = Math.max(0.1, Math.min(2.0, condition.demand + demandChange));
        
        // Volume changes (influenced by volatility and news)
        const volumeChange = (Math.random() - 0.5) * 0.1;
        condition.volume = Math.max(0.1, Math.min(2.0, condition.volume + volumeChange));
        
        // Volatility can change based on market conditions
        if (Math.random() < 0.1) { // 10% chance to change volatility
            const volChange = (Math.random() - 0.5) * 0.02;
            condition.volatility = Math.max(0.01, Math.min(0.2, condition.volatility + volChange));
        }
    });
    
    // Update economic indicators
    updateEconomicIndicators();
}

// Update economic indicators
function updateEconomicIndicators() {
    // Inflation changes slightly
    marketEconomics.indicators.inflation += (Math.random() - 0.5) * 0.005;
    marketEconomics.indicators.inflation = Math.max(0, Math.min(0.1, marketEconomics.indicators.inflation));
    
    // Interest rate follows inflation
    marketEconomics.indicators.interestRate = marketEconomics.indicators.inflation + 0.03 + (Math.random() - 0.5) * 0.01;
    marketEconomics.indicators.interestRate = Math.max(0.01, Math.min(0.15, marketEconomics.indicators.interestRate));
    
    // Economic growth
    marketEconomics.indicators.economicGrowth += (Math.random() - 0.5) * 0.01;
    marketEconomics.indicators.economicGrowth = Math.max(-0.05, Math.min(0.1, marketEconomics.indicators.economicGrowth));
    
    // Market sentiment (influenced by news and events)
    const sentimentChange = (Math.random() - 0.5) * 0.1;
    marketEconomics.indicators.marketSentiment = Math.max(0, Math.min(1, 
        marketEconomics.indicators.marketSentiment + sentimentChange));
}

// Apply trading impact on supply/demand
function applyTradingImpact(marketType, symbol, quantity, isBuy) {
    const key = `${marketType}_${symbol}`;
    const condition = marketEconomics.marketConditions[key];
    if (!condition) return;
    
    // Buying increases demand, selling increases supply
    const impact = Math.min(0.1, quantity / 1000); // Normalize impact
    
    if (isBuy) {
        condition.demand += impact;
        condition.supply = Math.max(0.1, condition.supply - impact * 0.5);
    } else {
        condition.supply += impact;
        condition.demand = Math.max(0.1, condition.demand - impact * 0.5);
    }
    
    // Update volume
    condition.volume += impact * 0.5;
    condition.volume = Math.min(2.0, condition.volume);
}

// Apply news effect to market
function applyNewsToMarket(news) {
    if (!news.marketEffects) return;
    
    news.marketEffects.forEach(effect => {
        const { type, assetType, symbol, modifier, duration } = effect;
        const key = symbol ? `${assetType}_${symbol}` : assetType;
        
        if (type === 'price') {
            if (!marketEconomics.newsEffects.priceModifiers[key]) {
                marketEconomics.newsEffects.priceModifiers[key] = 1.0;
            }
            marketEconomics.newsEffects.priceModifiers[key] *= modifier;
            
            // Set expiration
            if (duration) {
                setTimeout(() => {
                    marketEconomics.newsEffects.priceModifiers[key] /= modifier;
                    if (marketEconomics.newsEffects.priceModifiers[key] === 1.0) {
                        delete marketEconomics.newsEffects.priceModifiers[key];
                    }
                }, duration * 1000); // duration in seconds
            }
        } else if (type === 'volume') {
            const condition = marketEconomics.marketConditions[key];
            if (condition) {
                condition.volume *= modifier;
                condition.volume = Math.min(2.0, condition.volume);
            }
        } else if (type === 'sentiment') {
            marketEconomics.indicators.marketSentiment = Math.max(0, Math.min(1,
                marketEconomics.indicators.marketSentiment + modifier));
        }
    });
}

// Get market condition summary
function getMarketConditionSummary() {
    return {
        inflation: (marketEconomics.indicators.inflation * 100).toFixed(2) + '%',
        interestRate: (marketEconomics.indicators.interestRate * 100).toFixed(2) + '%',
        economicGrowth: (marketEconomics.indicators.economicGrowth * 100).toFixed(2) + '%',
        marketSentiment: getSentimentLabel(marketEconomics.indicators.marketSentiment),
        sentimentValue: marketEconomics.indicators.marketSentiment
    };
}

function getSentimentLabel(sentiment) {
    if (sentiment >= 0.8) return 'Very Bullish';
    if (sentiment >= 0.6) return 'Bullish';
    if (sentiment >= 0.4) return 'Neutral';
    if (sentiment >= 0.2) return 'Bearish';
    return 'Very Bearish';
}

