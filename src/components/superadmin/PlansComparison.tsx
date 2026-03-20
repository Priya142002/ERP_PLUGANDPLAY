import { Check, X, Star } from "lucide-react";
import { SUBSCRIPTION_PLANS } from "../../config/plans";

export function PlansComparison() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {SUBSCRIPTION_PLANS.map((plan) => (
        <div
          key={plan.id}
          className={`relative rounded-2xl border p-6 ${
            plan.popular ? 'ring-2 ring-offset-2' : ''
          }`}
          style={{
            backgroundColor: "var(--sa-card)",
            borderColor: plan.popular ? plan.color : "var(--sa-border)",
            ...(plan.popular && { '--tw-ring-color': plan.color } as any)
          }}
        >
          {plan.popular && (
            <div
              className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1"
              style={{ backgroundColor: plan.color }}
            >
              <Star className="h-3 w-3 fill-current" />
              Most Popular
            </div>
          )}

          <div className="text-center mb-6">
            <h3 className="text-xl font-bold mb-2" style={{ color: plan.color }}>
              {plan.name}
            </h3>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-4xl font-bold" style={{ color: "var(--sa-text-primary)" }}>
                ${plan.price}
              </span>
              <span className="text-sm" style={{ color: "var(--sa-text-secondary)" }}>
                /{plan.billingPeriod}
              </span>
            </div>
            <div className="mt-2 text-sm" style={{ color: "var(--sa-text-secondary)" }}>
              {plan.seats === 'unlimited' ? 'Unlimited users' : `Up to ${plan.seats} users`}
            </div>
            <div className="text-sm" style={{ color: "var(--sa-text-secondary)" }}>
              {plan.storage} storage
            </div>
          </div>

          <div className="space-y-3 mb-6">
            {plan.features.map((feature, index) => (
              <div key={index} className="flex items-start gap-2">
                {feature.included ? (
                  <Check className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: "var(--sa-success)" }} />
                ) : (
                  <X className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: "var(--sa-text-secondary)" }} />
                )}
                <span
                  className="text-sm"
                  style={{
                    color: feature.included ? "var(--sa-text-primary)" : "var(--sa-text-secondary)",
                    textDecoration: feature.included ? 'none' : 'line-through'
                  }}
                >
                  {feature.name}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t" style={{ borderColor: "var(--sa-border)" }}>
            <p className="text-xs font-medium mb-2" style={{ color: "var(--sa-text-secondary)" }}>
              Included Modules ({plan.modules.length})
            </p>
            <div className="flex flex-wrap gap-1">
              {plan.modules.slice(0, 3).map((module, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-1 rounded-full"
                  style={{
                    backgroundColor: `color-mix(in srgb, ${plan.color}, transparent 90%)`,
                    color: plan.color
                  }}
                >
                  {module.split(' ')[0]}
                </span>
              ))}
              {plan.modules.length > 3 && (
                <span
                  className="text-xs px-2 py-1 rounded-full"
                  style={{
                    backgroundColor: "var(--sa-hover)",
                    color: "var(--sa-text-secondary)"
                  }}
                >
                  +{plan.modules.length - 3} more
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PlansComparison;
