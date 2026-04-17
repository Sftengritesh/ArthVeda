import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { toast } from "react-toastify";

import Card from "../components/Card";
import Table from "../components/Table";

const COLORS = ["#1EE09A", "#38bdf8", "#f472b6", "#a78bfa", "#fbbf24", "#f87171", "#818cf8", "#fb923c"];

export default function Dashboard() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [userName, setUserName] = useState("User");
  const [transactions, setTransactions] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  
  // Filtering states
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/transactions');
      setTransactions(res.data.data);
      buildChart(res.data.data);
      buildCategoryChart(res.data.data);
      buildTrendChart(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.name) {
      setUserName(user.name.split(" ")[0]);
    }
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Weekly spending bar chart
  function buildChart(data) {
    const daily = {};
    data.forEach((tx) => {
      const date = new Date(tx.date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      });
      if (!daily[date]) {
         daily[date] = { name: date, income: 0, expense: 0 };
      }
      if (tx.type === 'income') {
         daily[date].income += tx.amount;
      } else {
         daily[date].expense += Math.abs(tx.amount);
      }
    });
    const result = Object.values(daily);
    setChartData(result.slice(-7));
  }

  // Category-wise pie chart (expenses only)
  function buildCategoryChart(data) {
    const catMap = {};
    data
      .filter(tx => tx.type === 'expense')
      .forEach(tx => {
        const cat = tx.category || 'Other';
        catMap[cat] = (catMap[cat] || 0) + Math.abs(tx.amount);
      });
    const result = Object.entries(catMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
    setCategoryData(result);
  }

  // Monthly spending trend (area chart)
  function buildTrendChart(data) {
    const monthly = {};
    data.forEach(tx => {
      const key = new Date(tx.date).toLocaleDateString("en-IN", {
        month: "short",
        year: "2-digit",
      });
      if (!monthly[key]) {
        monthly[key] = { name: key, income: 0, expense: 0 };
      }
      if (tx.type === 'income') {
        monthly[key].income += tx.amount;
      } else {
        monthly[key].expense += Math.abs(tx.amount);
      }
    });
    // Sort chronologically
    const result = Object.values(monthly).reverse();
    setTrendData(result.slice(-6));
  }

  const handleDelete = async (id) => {
    if(!window.confirm("Delete this transaction?")) return;
    try {
      await api.delete(`/api/transactions/${id}`);
      toast.success("Transaction deleted");
      fetchTransactions();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete transaction");
    }
  };

  // Safe data filtering
  const filteredTransactions = transactions.filter((tx) => {
    const txDate = new Date(tx.date);
    const inCategory = filterCategory ? tx.category.toLowerCase().includes(filterCategory.toLowerCase()) : true;
    const afterStart = filterStartDate ? txDate >= new Date(filterStartDate) : true;
    const beforeEnd = filterEndDate ? txDate <= new Date(filterEndDate) : true;
    return inCategory && afterStart && beforeEnd;
  });

  const balance = filteredTransactions.reduce((sum, tx) => Object.is(tx.type, 'income') ? sum + tx.amount : sum - Math.abs(tx.amount), 0);
  const income = filteredTransactions.filter((tx) => tx.type === "income").reduce((sum, tx) => sum + tx.amount, 0);
  const expense = filteredTransactions.filter((tx) => tx.type === "expense").reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

  const tableData = filteredTransactions.slice(0, 5).map((tx) => ({
    title: tx.title,
    category: tx.category,
    type: tx.type === 'income' ? <span style={{ color: 'var(--success)' }}>Income</span> : <span style={{ color: 'var(--danger)' }}>Expense</span>,
    amount: <span style={{ color: tx.type === 'income' ? 'var(--success)' : 'var(--danger)' }}> {tx.type === 'income' ? '+' : '-'}₹{Math.abs(tx.amount).toFixed(2)} </span>,
    date: new Date(tx.date).toLocaleDateString(),
    actions: (
      <button onClick={() => handleDelete(tx._id)} className="p-1 transition-colors" style={{ color: 'var(--danger)' }}>
        <span className="material-symbols-outlined text-sm">delete</span>
      </button>
    )
  }));

  const columns = [
    { header: "Title", accessor: "title" },
    { header: "Category", accessor: "category" },
    { header: "Type", accessor: "type" },
    { header: "Amount", accessor: "amount" },
    { header: "Date", accessor: "date" },
    { header: "", accessor: "actions" }
  ];

  // Theme-aware chart colors
  const isDark = theme === 'dark';
  const gridColor = isDark ? '#2f3340' : '#e2e8f0';
  const axisColor = isDark ? '#9ca3af' : '#64748b';
  const tooltipBg = isDark ? '#171920' : '#ffffff';
  const tooltipBorder = isDark ? '1px solid #252833' : '1px solid #e2e8f0';
  const tooltipText = isDark ? '#f8fafc' : '#1e293b';
  const cursorFill = isDark ? '#1c1f26' : '#f1f5f9';

  // Custom tooltip for pie chart
  const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg px-3 py-2 text-sm" style={{ backgroundColor: tooltipBg, border: tooltipBorder }}>
          <p className="font-medium" style={{ color: tooltipText }}>{payload[0].name}</p>
          <p style={{ color: axisColor }}>₹{payload[0].value.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
     return <div className="p-6 text-center min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 mx-auto" style={{ borderColor: 'var(--accent)' }}></div>
     </div>
  }

  return (
    <div className="p-6 space-y-8">

      {/* HEADER */}
      <h1 className="text-3xl font-bold" style={{ color: 'var(--text-heading)' }}>
        Welcome, {userName} 👋
      </h1>

      {/* FILTERING ROW */}
      <div
        className="flex flex-col md:flex-row gap-4 items-center p-4 rounded-2xl"
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-primary)',
        }}
      >
        <div className="flex-1 w-full">
           <label className="text-xs block mb-1" style={{ color: 'var(--text-muted)' }}>Search Category</label>
           <input 
             type="text" 
             placeholder="e.g. Food, Salary..." 
             value={filterCategory} 
             onChange={e => setFilterCategory(e.target.value)} 
             className="w-full rounded-xl px-3 py-2 outline-none transition-all"
             style={{
               backgroundColor: 'var(--bg-input)',
               border: '1px solid var(--border-input)',
               color: 'var(--text-primary)',
             }}
           />
        </div>
        <div className="flex-1 w-full">
           <label className="text-xs block mb-1" style={{ color: 'var(--text-muted)' }}>Start Date</label>
           <input 
             type="date" 
             value={filterStartDate} 
             onChange={e => setFilterStartDate(e.target.value)} 
             className="w-full rounded-xl px-3 py-2 outline-none transition-all"
             style={{
               backgroundColor: 'var(--bg-input)',
               border: '1px solid var(--border-input)',
               color: 'var(--text-primary)',
               colorScheme: 'var(--color-scheme)',
             }}
           />
        </div>
        <div className="flex-1 w-full">
           <label className="text-xs block mb-1" style={{ color: 'var(--text-muted)' }}>End Date</label>
           <input 
             type="date" 
             value={filterEndDate} 
             onChange={e => setFilterEndDate(e.target.value)} 
             className="w-full rounded-xl px-3 py-2 outline-none transition-all"
             style={{
               backgroundColor: 'var(--bg-input)',
               border: '1px solid var(--border-input)',
               color: 'var(--text-primary)',
               colorScheme: 'var(--color-scheme)',
             }}
           />
        </div>
        <button
          onClick={() => {setFilterCategory(''); setFilterStartDate(''); setFilterEndDate('');}}
          className="md:mt-5 px-4 py-2 rounded-xl transition-all w-full md:w-auto font-medium"
          style={{
            backgroundColor: 'var(--bg-surface-raised)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-primary)',
          }}
        >
          Clear
        </button>
      </div>

      {/* STAT CARDS */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-6">
          <p style={{ color: 'var(--text-muted)' }}>Balance</p>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-heading)' }}>₹{balance.toFixed(2)}</h2>
        </Card>

        <Card className="p-6">
          <p style={{ color: 'var(--text-muted)' }}>Income</p>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--success)' }}>₹{income.toFixed(2)}</h2>
        </Card>

        <Card className="p-6">
          <p style={{ color: 'var(--text-muted)' }}>Expenses</p>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--danger)' }}>₹{expense.toFixed(2)}</h2>
        </Card>
      </div>

      {/* CHART ROW 1 — Bar + Pie side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Weekly Spending Bar Chart */}
        <Card className="p-6">
          <h2 className="font-bold mb-4" style={{ color: 'var(--text-heading)' }}>Weekly Spending</h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis dataKey="name" stroke={axisColor} />
                <YAxis stroke={axisColor} />
                <Tooltip cursor={{fill: cursorFill}} contentStyle={{ backgroundColor: tooltipBg, border: tooltipBorder, borderRadius: '8px', color: tooltipText }} />
                <Bar dataKey="income" fill="#1EE09A" radius={[4, 4, 0, 0]} name="Income" />
                <Bar dataKey="expense" fill="#f87171" radius={[4, 4, 0, 0]} name="Expense" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center" style={{ color: 'var(--text-muted)' }}>
              No spending data found.
            </div>
          )}
        </Card>

        {/* Category Breakdown Pie Chart */}
        <Card className="p-6">
          <h2 className="font-bold mb-4" style={{ color: 'var(--text-heading)' }}>Expense by Category</h2>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  formatter={(value) => <span style={{ color: axisColor, fontSize: '0.875rem' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center" style={{ color: 'var(--text-muted)' }}>
              No expense categories found.
            </div>
          )}
        </Card>
      </div>

      {/* CHART ROW 2 — Monthly Trend (full width) */}
      <Card className="p-6">
        <h2 className="font-bold mb-4" style={{ color: 'var(--text-heading)' }}>Monthly Trend</h2>
        {trendData.length > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1EE09A" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#1EE09A" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f87171" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
              <XAxis dataKey="name" stroke={axisColor} />
              <YAxis stroke={axisColor} />
              <Tooltip contentStyle={{ backgroundColor: tooltipBg, border: tooltipBorder, borderRadius: '8px', color: tooltipText }} />
              <Area type="monotone" dataKey="income" stroke="#1EE09A" fill="url(#incomeGrad)" strokeWidth={2} name="Income" />
              <Area type="monotone" dataKey="expense" stroke="#f87171" fill="url(#expenseGrad)" strokeWidth={2} name="Expense" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[280px] flex items-center justify-center" style={{ color: 'var(--text-muted)' }}>
            Not enough data for monthly trends.
          </div>
        )}
      </Card>

      {/* TABLE */}
      <Card className="p-6">
        <h2 className="mb-4 font-bold" style={{ color: 'var(--text-heading)' }}>Recent Transactions</h2>
        {filteredTransactions.length > 0 ? (
            <Table columns={columns} data={tableData} />
        ) : (
           <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No transactions match your filters.</p>
        )}
      </Card>

    </div>
  );
}