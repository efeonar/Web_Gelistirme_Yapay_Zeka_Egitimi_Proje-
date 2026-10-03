import { useState, useEffect } from 'react';
import TodoList from '../Components/TodoList';

export default function TodoPage() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [input, setInput] = useState('');
  const [priority, setPriority] = useState('Normal'); // Varsayılan değer değişti
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [filter, setFilter] = useState('Tümü');
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setTodos([...todos, { 
      id: Date.now(), text: input, priority, startTime, endTime, isCompleted: false 
    }]);
    setInput(''); setStartTime(''); setEndTime(''); setPriority('Normal');
  };

  const toggleComplete = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
    ));
  };

  const editTodo = (id, newText, newStart, newEnd) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, text: newText, startTime: newStart, endTime: newEnd } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
    setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
  };

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) setSelectedIds(selectedIds.filter(sId => sId !== id));
    else setSelectedIds([...selectedIds, id]);
  };

  const toggleSelectAll = (filteredList) => {
    if (selectedIds.length === filteredList.length && filteredList.length > 0) setSelectedIds([]);
    else setSelectedIds(filteredList.map(t => t.id));
  };

  const deleteSelected = () => {
    setTodos(todos.filter(todo => !selectedIds.includes(todo.id)));
    setSelectedIds([]);
  };
  
  const completeSelected = () => {
    setTodos(todos.map(todo => selectedIds.includes(todo.id) ? { ...todo, isCompleted: true } : todo));
    setSelectedIds([]);
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'Aktif') return !todo.isCompleted;
    if (filter === 'Tamamlanan') return todo.isCompleted;
    return true;
  });

  return (
    <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8 mb-10 mt-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">İş Takip Paneli</h1>
        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
          {todos.filter(t => !t.isCompleted).length} Bekleyen
        </span>
      </div>
      
      <form onSubmit={addTodo} className="flex flex-col gap-3 mb-8 bg-slate-50 p-5 rounded-xl border border-slate-100">
        <div className="flex gap-3">
          <input 
            type="text" value={input} onChange={(e) => setInput(e.target.value)}
            placeholder="Yeni görev ne?..." 
            className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <select 
            value={priority} onChange={(e) => setPriority(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-600"
          >
            <option value="Acelesi Yok">Acelesi Yok</option>
            <option value="Normal">Normal</option>
            <option value="Çok Acil">Çok Acil</option>
          </select>
        </div>
        
        <div className="flex gap-3 items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-500">Saat Aralığı:</span>
            <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700" />
            <span className="text-slate-400">-</span>
            <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700" />
          </div>
          <button type="submit" className="bg-blue-600 text-white font-semibold px-8 py-2.5 rounded-xl hover:bg-blue-700 shadow-md transition-all">Ekle</button>
        </div>
      </form>

      <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4 min-h-[40px]">
        <div className="flex gap-2">
          {['Tümü', 'Aktif', 'Tamamlanan'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === f ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>{f}</button>
          ))}
        </div>
        {selectedIds.length > 0 && (
          <div className="flex gap-2 animate-fade-in">
            <button onClick={completeSelected} className="text-sm bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-lg font-bold">Seçilenleri Tamamla</button>
            <button onClick={deleteSelected} className="text-sm bg-red-100 text-red-800 px-3 py-1.5 rounded-lg font-bold">Seçilenleri Sil ({selectedIds.length})</button>
          </div>
        )}
      </div>

      <TodoList 
        todos={filteredTodos} toggleComplete={toggleComplete} deleteTodo={deleteTodo}
        editTodo={editTodo} 
        selectedIds={selectedIds} toggleSelect={toggleSelect} toggleSelectAll={() => toggleSelectAll(filteredTodos)}
      />
    </div>
  );
}