import { useState } from 'react';

export default function TodoList({ todos, toggleComplete, deleteTodo, editTodo, selectedIds, toggleSelect, toggleSelectAll }) {
  
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editStart, setEditStart] = useState("");
  const [editEnd, setEditEnd] = useState("");

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'Yüksek': return 'bg-red-100 text-red-700 border-red-200';
      case 'Orta': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Düşük': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const startEditing = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
    setEditStart(todo.startTime || "");
    setEditEnd(todo.endTime || "");
  };

  const saveEdit = (id) => {
    if(editText.trim()) editTodo(id, editText, editStart, editEnd);
    setEditingId(null);
  };

  if (todos.length === 0) return (
    <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-300">
      <p className="text-slate-400 font-medium">Bu kategoride görev bulunmuyor.</p>
    </div>
  );

  const allSelected = todos.length > 0 && selectedIds.length === todos.length;

  return (
    <div className="space-y-3">
      <div className="flex items-center px-4 py-2 bg-slate-50 rounded-lg border border-slate-200 mb-4">
        <input type="checkbox" checked={allSelected} onChange={toggleSelectAll} className="w-4 h-4 text-blue-600 rounded border-slate-300 cursor-pointer mr-3"/>
        <span className="text-sm font-semibold text-slate-600">{allSelected ? 'Tüm Seçimleri Kaldır' : 'Tümünü Seç'}</span>
      </div>

      <ul className="space-y-3">
        {todos.map(todo => (
          <li key={todo.id} className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${todo.isCompleted ? 'bg-slate-50 border-slate-200 opacity-60' : selectedIds.includes(todo.id) ? 'bg-blue-50 border-blue-300 shadow-sm' : 'bg-white border-slate-200 shadow-sm hover:border-blue-300'}`}>
            <div className="flex items-center gap-4 flex-1">
              <input type="checkbox" checked={selectedIds.includes(todo.id)} onChange={() => toggleSelect(todo.id)} className="w-5 h-5 text-blue-600 rounded border-slate-300 cursor-pointer"/>
              <button onClick={() => toggleComplete(todo.id)} className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${todo.isCompleted ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 hover:border-emerald-500'}`}>
                {todo.isCompleted && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
              </button>

              <div className="flex flex-col flex-1 w-full">
                {editingId === todo.id ? (
                  <div className="flex flex-col gap-2 mr-4">
                    <input 
                      type="text" value={editText} onChange={(e) => setEditText(e.target.value)} 
                      onKeyDown={(e) => e.key === 'Enter' && saveEdit(todo.id)}
                      autoFocus className="font-medium text-lg border-b-2 border-blue-500 focus:outline-none bg-transparent"
                    />
                    <div className="flex items-center gap-2">
                      <input type="time" value={editStart} onChange={(e) => setEditStart(e.target.value)} className="bg-white border border-slate-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-700" />
                      <span className="text-slate-400 text-sm">-</span>
                      <input type="time" value={editEnd} onChange={(e) => setEditEnd(e.target.value)} className="bg-white border border-slate-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-700" />
                      <button onClick={() => saveEdit(todo.id)} className="ml-2 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-md text-sm font-bold transition">Kaydet</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <span className={`font-medium text-lg transition-all ${todo.isCompleted ? 'line-through text-slate-400' : 'text-slate-800'}`}>{todo.text}</span>
                    {(todo.startTime || todo.endTime) && (
                      <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 mt-1">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {todo.startTime || '--:--'} ile {todo.endTime || '--:--'} arası
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getPriorityColor(todo.priority)}`}>{todo.priority}</span>
              
              <button onClick={() => startEditing(todo)} className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors" title="Görevi Düzenle">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.379-8.379-2.828-2.828z" /></svg>
              </button>
              
              <button onClick={() => deleteTodo(todo.id)} className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors" title="Görevi Sil">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}