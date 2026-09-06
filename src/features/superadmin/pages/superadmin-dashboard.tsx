import { Building2 } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

const ORG_STATS = [
  { name: 'Approved', value: 45, color: '#10b981' },
  { name: 'Pending', value: 25, color: '#B8862C' },
  { name: 'Rejected', value: 10, color: '#ef4444' },
]

export default function SuperAdminDashboard() {
  const totalApplied = ORG_STATS.reduce((acc, curr) => acc + curr.value, 0)

  return (
    <div className="flex flex-col flex-1 p-6 lg:p-8 max-w-[1600px] mx-auto w-full gap-6">
      {/* Dashboard Content Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        
        {/* Organizations Chart Card */}
        <div className="col-span-1 bg-white rounded-2xl p-6 shadow-sm border border-[var(--border)] flex flex-col justify-between min-h-[340px]">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-[var(--navy)] flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[var(--gold)]" />
                Organizations
              </h2>
              <p className="text-xs text-[var(--text-secondary)] mt-1">Status distribution</p>
            </div>
            
            <div className="text-right">
              <p className="text-2xl font-bold text-[var(--navy)] leading-none">{totalApplied}</p>
              <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mt-1">Total</p>
            </div>
          </div>

          <div className="h-[200px] w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ORG_STATS}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {ORG_STATS.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '8px', 
                    border: '1px solid var(--border)',
                    boxShadow: '0 4px 12px rgba(16,42,67,0.08)',
                    fontWeight: 500,
                    fontSize: '12px'
                  }}
                  itemStyle={{ color: 'var(--navy)' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={24}
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ paddingTop: '10px', fontSize: '12px', fontWeight: 500, color: 'var(--navy)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
