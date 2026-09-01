import React from 'react';
import {
  Scale,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Users,
  Building,
  Activity,
  ArrowRight
} from 'lucide-react';
import { CityData, WardImpactProfile } from '../../types';

interface AuthorityComparePlansProps {
  city: CityData;
  wardProfiles: WardImpactProfile[];
  onNavigate?: (tab: string) => void;
}

export const AuthorityComparePlans: React.FC<AuthorityComparePlansProps> = ({
  city,
  wardProfiles,
  onNavigate
}) => {
  const plans = [
    {
      id: 'plan_no_action',
      title: 'Plan A: No Action (Status Quo)',
      tag: 'Baseline / Inaction',
      tagColor: 'bg-red-100 text-red-800 border-red-200',
      description: 'Zero additional municipal intervention. Regular work schedules and unassisted public exposure.',
      peopleProtected: '0',
      hospitalSurge: '+68% Surge Expected',
      hospitalSurgeColor: 'text-red-600',
      riskReduction: '0%',
      budgetCost: '₹0 (Direct) / Heavy Healthcare Cost',
      staffRequired: 'None',
      pros: ['No municipal setup required'],
      cons: ['Severe heat stroke casualties likely', 'Hospital wards overwhelmed', 'Economic loss from worker disability']
    },
    {
      id: 'plan_recommended',
      title: 'Plan B: Recommended Response',
      tag: 'Highest Cost-Benefit Ratio',
      tagColor: 'bg-blue-100 text-blue-800 border-blue-200 font-bold',
      highlighted: true,
      description: 'Open key cooling shelters in top 4 wards, enforce 11:30 AM–4:30 PM outdoor work pause, and dispatch ASHA checks.',
      peopleProtected: '46,500 Vulnerable Citizens',
      hospitalSurge: '-44% Hospital Influx',
      hospitalSurgeColor: 'text-emerald-600 font-bold',
      riskReduction: '44% Risk Lowered',
      budgetCost: '₹3.8 Lakhs / Day (Moderate)',
      staffRequired: '120 Ward Volunteers & ASHA Workers',
      pros: ['Immediate reduction in acute worker collapse', 'Protects 70%+ of at-risk seniors', 'Fast 2-hour deployment'],
      cons: ['Requires coordination with construction contractors']
    },
    {
      id: 'plan_full_hap',
      title: 'Plan C: Full Heat Action Plan',
      tag: 'Maximum Protection',
      tagColor: 'bg-purple-100 text-purple-800 border-purple-200',
      description: 'Comprehensive citywide deployment: 24/7 cooling centers, misting tankers, cool roof wash, emergency hospital reserves, and SMS broadcasting.',
      peopleProtected: '78,000+ Citizens',
      hospitalSurge: '-62% Hospital Influx',
      hospitalSurgeColor: 'text-emerald-600 font-bold',
      riskReduction: '62% Risk Lowered',
      budgetCost: '₹9.4 Lakhs / Day',
      staffRequired: '340 Inter-departmental Personnel',
      pros: ['Near-complete coverage of informal settlements', 'Significant ambient temperature suppression along major transit routes'],
      cons: ['High logistical coordination across 6 government departments']
    }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
              <Scale className="w-3.5 h-3.5" />
              Strategic Decision Matrix
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              Compare Response Plans for {city.name}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Evaluate expected public health outcomes and resource requirements before issuing municipal orders.
            </p>
          </div>
        </div>
      </div>

      {/* Plans Comparison 3-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {plans.map((p) => (
          <div
            key={p.id}
            className={`rounded-2xl p-6 sm:p-7 transition-all flex flex-col justify-between space-y-5 ${
              p.highlighted
                ? 'bg-white border-2 border-blue-500 shadow-md ring-4 ring-blue-500/10'
                : 'bg-white border border-slate-200 shadow-sm'
            }`}
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${p.tagColor}`}>
                  {p.tag}
                </span>
                <h2 className="text-lg font-bold text-slate-900">{p.title}</h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {p.description}
                </p>
              </div>

              {/* Key Impact Stats */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="bg-slate-50 p-3 rounded-xl space-y-0.5 border border-slate-100">
                  <div className="text-[11px] text-slate-500 font-medium">People Protected</div>
                  <div className="text-sm font-bold text-slate-900">{p.peopleProtected}</div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl space-y-0.5 border border-slate-100">
                  <div className="text-[11px] text-slate-500 font-medium">Hospital ER Impact</div>
                  <div className={`text-sm font-bold ${p.hospitalSurgeColor}`}>{p.hospitalSurge}</div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl space-y-0.5 border border-slate-100">
                  <div className="text-[11px] text-slate-500 font-medium">Estimated Daily Cost</div>
                  <div className="text-sm font-bold text-slate-900">{p.budgetCost}</div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl space-y-0.5 border border-slate-100">
                  <div className="text-[11px] text-slate-500 font-medium">Staff Mobilization</div>
                  <div className="text-sm font-bold text-slate-900">{p.staffRequired}</div>
                </div>
              </div>

              {/* Pros / Cons list */}
              <div className="space-y-2 pt-2 text-xs">
                <div className="font-bold text-slate-700">Advantages & Trade-offs:</div>
                <ul className="space-y-1 text-slate-600">
                  {p.pros.map((pro, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>{pro}</span>
                    </li>
                  ))}
                  {p.cons.map((con, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 text-rose-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5"></span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {p.highlighted && onNavigate && (
              <button
                onClick={() => onNavigate('plan')}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm cursor-pointer mt-4"
              >
                Adopt Recommended Plan
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
