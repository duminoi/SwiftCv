import { useCVStore } from '../store/useCVStore';
import { createCheckoutSession } from '../services/api';
import { Icon } from '../components/Icon';

export default function Pricing() {
  const { userTier, usageCount } = useCVStore();

  const handleUpgrade = async (tier: string) => {
    const priceIds: Record<string, string> = { pro: 'price_pro', business: 'price_business', lifetime: 'price_lifetime' };
    const priceId = priceIds[tier];
    if (!priceId) return;
    try {
      const result = await createCheckoutSession(priceId);
      if (result.url) window.location.href = result.url;
    } catch { }
  };

  const tiers = [
    { id: 'free', name: 'Free', price: '$0', description: 'Get started with basic features', features: ['1 CV', '5 AI analyses/month', '2 templates', 'PDF with watermark'] },
    { id: 'pro', name: 'Pro', price: '$7.99', period: '/month', description: 'For serious job seekers', features: ['Unlimited CVs', 'Unlimited AI analyses', 'All 6 templates', 'Clean PDF export', 'JD Matching', 'JSON export', 'Priority support'], popular: true },
    { id: 'business', name: 'Business', price: '$14.99', period: '/month', description: 'For professionals & teams', features: ['Everything in Pro', '16 templates total', 'Premium AI models', 'Cover letter builder', 'Team sharing'], popular: false },
    { id: 'lifetime', name: 'Lifetime', price: '$129', period: ' once', description: 'Pay once, own forever', features: ['Everything in Pro', 'All future updates', 'Lifetime access', 'All 16 templates'], popular: false },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
        <div>
          <h2 className="font-bold text-xl text-on-surface mb-2">Upgrade Your Plan</h2>
          <p className="text-sm text-on-surface-muted">Choose the plan that fits your needs.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6 bg-white p-4 rounded-xl border border-surface-border">
          <div className="flex items-center gap-2 text-sm">
            <Icon name="bar_chart" className="text-[18px] text-primary" />
            <span className="text-on-surface-muted">AI Usage:</span>
            <span className="font-bold text-on-surface">{usageCount} calls</span>
            <span className="text-on-surface-muted">/ month</span>
          </div>
          <div className="flex-1 h-2 bg-surface-border rounded-full w-full sm:max-w-[200px]">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${Math.min((usageCount / 5) * 100, 100)}%` }}></div>
          </div>
          {userTier === 'free' && usageCount >= 5 && (
            <button onClick={() => window.location.href = '/pricing'} className="text-xs text-primary font-medium hover:underline">Upgrade to continue</button>
          )}
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {tiers.map(tier => {
            const isCurrent = userTier === tier.id;
            return (
              <div key={tier.id} className={`relative rounded-2xl overflow-hidden ${tier.popular ? 'ring-2 ring-primary ring-offset-2 ring-offset-surface bg-gradient-to-b from-primary/5 to-transparent' : 'bg-white border border-surface-border'}`}>
                {tier.popular && <div className="bg-primary text-white text-[10px] font-bold text-center py-1.5 uppercase tracking-widest">Most Popular</div>}
                <div className="p-6 space-y-5">
                  <div>
                    <h3 className="font-medium text-base text-on-surface">{tier.name}</h3>
                    <div className="mt-3 flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-on-surface">{tier.price}</span>
                      {tier.period && <span className="text-sm text-on-surface-muted">{tier.period}</span>}
                    </div>
                    <p className="text-xs text-on-surface-muted mt-2">{tier.description}</p>
                  </div>
                  <ul className="space-y-3">
                    {tier.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-on-surface">
                        <Icon name="check_circle" className="text-[16px] text-[#14B8A6] shrink-0 mt-0.5" /> {f}
                      </li>
                    ))}
                  </ul>
                  {isCurrent ? (
                    <div className="w-full py-3 rounded-xl bg-surface-border text-on-surface-muted text-sm font-semibold text-center">Current Plan</div>
                  ) : tier.id === 'free' ? (
                    <div className="text-xs text-on-surface-muted text-center py-3 font-medium">Always free</div>
                  ) : (
                    <button onClick={() => handleUpgrade(tier.id)} className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${tier.popular ? 'bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20' : 'border-2 border-primary text-primary hover:bg-primary/5'}`}>
                      {userTier === 'free' ? 'Upgrade' : 'Switch Plan'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
