import React, { useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import Button from "../components/Button";

export default function Add() {
  const [form, setForm] = useState({
    title: "",
    amount: "0.00",
    category: "Dining",
    type: "expense",
    date: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);

  const categories = [
    { id: 'Fuel', icon: 'local_gas_station' },
    { id: 'Dining', icon: 'restaurant' },
    { id: 'Travel', icon: 'flight' },
    { id: 'Offices', icon: 'domain' },
    { id: 'Other', icon: 'more_horiz' },
  ];

  const frequentMerchants = [
    { name: 'Starbucks', icon: 'local_cafe' },
    { name: 'Uber', icon: 'directions_car' },
    { name: 'AWS', icon: 'cloud' },
    { name: 'Amazon', icon: 'shopping_bag' },
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCategorySelect = (cat) => {
    setForm({ ...form, category: cat });
  };

  const handleMerchantSelect = (merchant) => {
    setForm({ ...form, title: merchant });
  };

  const handleAmountChange = (e) => {
    // Basic number handling for the large input
    const val = e.target.value;
    if (val === "" || /^\d*\.?\d*$/.test(val)) {
      setForm({ ...form, amount: val });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.amount || parseFloat(form.amount) === 0) {
      toast.error("Please provide a valid merchant and amount.");
      return;
    }
    
    setLoading(true);
    try {
      await api.post("/api/transactions", { ...form, amount: parseFloat(form.amount) });
      toast.success("Transaction Added 🚀"); 
      setForm({ title: "", amount: "0.00", category: "Dining", type: "expense", date: new Date().toISOString().split('T')[0] });
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong ❌"); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--text-heading)' }}>New Transaction</h1>
          <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>Add details for your upcoming financial audit.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Main Form Area */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Amount Box */}
          <div
            className="rounded-3xl p-8 flex flex-col items-center justify-center relative shadow-lg"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-primary)',
            }}
          >
            <span className="text-xs font-bold uppercase tracking-widest mb-6" style={{ color: 'var(--text-muted)' }}>Total Transaction Amount</span>
            <div className="flex items-center" style={{ color: 'var(--accent)' }}>
              <span className="text-5xl font-bold mr-4">₹</span>
              <input
                type="text"
                value={form.amount}
                onChange={handleAmountChange}
                className="bg-transparent text-8xl font-black tracking-tighter outline-none w-[350px] text-center"
                placeholder="0.00"
                style={{ color: 'var(--accent)' }}
              />
            </div>
            {/* Background decorative icon */}
            <span
              className="material-symbols-outlined absolute right-8 top-1/2 -translate-y-1/2 text-[150px] pointer-events-none"
              style={{ color: 'var(--border-primary)', opacity: 0.2 }}
            >
              payments
            </span>
          </div>

          {/* Details Form Box */}
          <div
            className="rounded-3xl p-8 shadow-lg"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-primary)',
            }}
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold block ml-1" style={{ color: 'var(--text-muted)' }}>Merchant Name</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'var(--text-muted)' }}>storefront</span>
                    <input
                      type="text"
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      placeholder="Select Merchant"
                      className="w-full rounded-xl py-4 pl-12 pr-4 outline-none transition-all font-medium"
                      style={{
                        backgroundColor: 'var(--bg-surface)',
                        border: '1px solid var(--border-primary)',
                        color: 'var(--text-primary)',
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold block ml-1" style={{ color: 'var(--text-muted)' }}>Transaction Date</label>
                  <div className="relative">
                     <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'var(--text-muted)' }}>calendar_month</span>
                     <input
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={handleChange}
                      style={{
                        backgroundColor: 'var(--bg-surface)',
                        border: '1px solid var(--border-primary)',
                        color: 'var(--text-primary)',
                        colorScheme: 'var(--color-scheme)',
                      }}
                      className="w-full rounded-xl py-4 pl-12 pr-4 outline-none transition-all font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                 <label className="text-xs font-bold block ml-1" style={{ color: 'var(--text-muted)' }}>Expense Category</label>
                 <div className="flex flex-wrap gap-4">
                   {categories.map((cat) => (
                     <button
                       key={cat.id}
                       type="button"
                       onClick={() => handleCategorySelect(cat.id)}
                       className="flex flex-col items-center justify-center w-24 py-4 rounded-2xl transition-all"
                       style={{
                         backgroundColor: form.category === cat.id ? 'var(--accent-subtle)' : 'var(--bg-surface)',
                         border: `1px solid ${form.category === cat.id ? 'var(--accent)' : 'var(--border-primary)'}`,
                         color: form.category === cat.id ? 'var(--accent)' : 'var(--text-muted)',
                       }}
                     >
                       <span className="material-symbols-outlined mb-2">{cat.icon}</span>
                       <span className="text-xs font-bold">{cat.id}</span>
                     </button>
                   ))}
                 </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold block ml-1" style={{ color: 'var(--text-muted)' }}>Internal Note (Optional)</label>
                <textarea
                  rows="3"
                  placeholder="Describe the business purpose..."
                  className="w-full rounded-2xl p-4 outline-none transition-all resize-none"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-primary)',
                    color: 'var(--text-primary)',
                  }}
                ></textarea>
              </div>

               <div className="pt-4 flex justify-end gap-4 items-center">
                 {/* Type Switcher */}
                 <div
                   className="mr-auto flex items-center rounded-xl p-1"
                   style={{
                     backgroundColor: 'var(--bg-surface)',
                     border: '1px solid var(--border-primary)',
                   }}
                 >
                    <button
                      type="button"
                      onClick={() => setForm({...form, type: 'expense'})}
                      className="px-4 py-2 rounded-lg text-xs font-bold transition-all"
                      style={{
                        backgroundColor: form.type === 'expense' ? 'var(--bg-surface-raised)' : 'transparent',
                        color: form.type === 'expense' ? 'var(--text-heading)' : 'var(--text-muted)',
                      }}
                    >
                      Expense
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm({...form, type: 'income'})}
                      className="px-4 py-2 rounded-lg text-xs font-bold transition-all"
                      style={{
                        backgroundColor: form.type === 'income' ? 'var(--accent-subtle)' : 'transparent',
                        color: form.type === 'income' ? 'var(--accent)' : 'var(--text-muted)',
                      }}
                    >
                      Income
                    </button>
                 </div>

                 <button type="button" className="px-8 py-4 rounded-xl font-bold transition" style={{ backgroundColor: 'var(--bg-surface-raised)', color: 'var(--text-heading)' }}>
                   Save Draft
                 </button>
                 <button
                   type="submit"
                   disabled={loading}
                   className="px-8 py-4 rounded-xl font-extrabold transition"
                   style={{
                     backgroundColor: 'var(--accent)',
                     color: 'white',
                     boxShadow: '0 0 20px rgba(52,211,153,0.25)',
                   }}
                 >
                   {loading ? "Adding..." : "Add"}
                 </button>
               </div>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: Scanners & Policy */}
        <div className="lg:col-span-1 space-y-6">
          
          <div
            className="rounded-3xl p-6 shadow-lg"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-primary)',
            }}
          >
             <div className="flex items-center gap-2 mb-2">
               <span className="material-symbols-outlined text-xl" style={{ color: 'var(--accent)' }}>verified_user</span>
               <h3 className="font-bold text-lg" style={{ color: 'var(--text-heading)' }}>Smart Scan</h3>
             </div>
             <p className="text-xs mb-6" style={{ color: 'var(--text-muted)' }}>AI-powered receipt recognition</p>

             <div
               className="border-2 border-dashed rounded-2xl relative h-48 flex flex-col items-center justify-center group cursor-pointer transition-all overflow-hidden"
               style={{
                 borderColor: 'var(--border-secondary)',
                 backgroundColor: 'var(--bg-surface)',
               }}
             >
                <span className="material-symbols-outlined text-4xl mb-2 group-hover:scale-110 transition-transform" style={{ color: 'var(--accent)' }}>add_a_photo</span>
                <span className="font-bold text-sm" style={{ color: 'var(--text-heading)' }}>Upload Receipt</span>
                <span className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>PNG, JPG or PDF up to 10MB</span>
             </div>

             <div className="flex gap-3 mt-6 items-start">
               <span className="material-symbols-outlined text-sm mt-0.5" style={{ color: 'var(--info)' }}>info</span>
               <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                 Receipt scanning extracts merchant, date, and tax details automatically with <span className="font-bold" style={{ color: 'var(--text-heading)' }}>99.4%</span> accuracy.
               </p>
             </div>
          </div>



          <div
            className="rounded-3xl p-6 shadow-lg"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-primary)',
            }}
          >
            <h3 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>Frequent Merchants</h3>
            <div className="grid grid-cols-2 gap-3">
              {frequentMerchants.map((m) => (
                 <button 
                   key={m.name}
                   type="button"
                   onClick={() => handleMerchantSelect(m.name)}
                   className="flex items-center gap-3 p-3 rounded-xl transition-colors"
                   style={{
                     backgroundColor: 'var(--bg-surface)',
                     border: '1px solid var(--border-primary)',
                     color: 'var(--text-muted)',
                   }}
                 >
                    <span className="material-symbols-outlined text-sm">{m.icon}</span>
                    <span className="font-bold text-xs" style={{ color: 'var(--text-heading)' }}>{m.name}</span>
                 </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
