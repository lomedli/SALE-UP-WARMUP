import React, { useState, useEffect, useMemo } from 'react';
import { UsersDB, UserProgress, ViewState } from './types';
import { WARMUP_PLAN } from './constants';
import { Button } from './components/Button';
import { TimelineItem } from './components/TimelineItem';
import { Check, ChevronRight, LogOut, Trophy } from 'lucide-react';

// Helper to get DB from local storage
const getDB = (): UsersDB => {
  const stored = localStorage.getItem('saleup_db');
  return stored ? JSON.parse(stored) : {};
};

// Helper to save DB
const saveDB = (db: UsersDB) => {
  localStorage.setItem('saleup_db', JSON.stringify(db));
};

export default function App() {
  const [view, setView] = useState<ViewState>(ViewState.LOGIN);
  const [currentUser, setCurrentUser] = useState<UserProgress | null>(null);
  const [loginError, setLoginError] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const [completedTasksInDay, setCompletedTasksInDay] = useState<string[]>([]);
  const [viewingDayId, setViewingDayId] = useState<number>(1);
  const [isLoginMode, setIsLoginMode] = useState(false);

  // --- Login/Auth Logic ---
  const handleAuthSubmit = () => {
    const name = usernameInput.trim();
    if (!name) return;
    const db = getDB();

    if (isLoginMode) {
        // Login Mode
        if (db[name]) {
            setCurrentUser(db[name]);
            if (db[name].completedDays.length >= 10) {
                setView(ViewState.COMPLETION);
            } else {
                setView(ViewState.DASHBOARD);
            }
        } else {
            setLoginError("משתמש לא נמצא");
        }
    } else {
        // Register Mode
        if (db[name]) {
            setLoginError("שם המשתמש תפוס");
        } else {
            const newUser: UserProgress = {
                username: name,
                completedDays: [],
                currentDay: 1,
                startDate: new Date().toISOString(),
                lastActiveDate: new Date().toISOString()
            };
            db[name] = newUser;
            saveDB(db);
            setCurrentUser(newUser);
            setView(ViewState.DASHBOARD);
        }
    }
  };

  // --- Task Logic ---
  // Use viewingDayId to determine which day config to show
  const currentDayConfig = useMemo(() => 
    WARMUP_PLAN.find(d => d.id === viewingDayId), 
    [viewingDayId]
  );

  const handleTaskToggle = (taskId: string) => {
    if (completedTasksInDay.includes(taskId)) {
      setCompletedTasksInDay(prev => prev.filter(id => id !== taskId));
    } else {
      setCompletedTasksInDay(prev => [...prev, taskId]);
    }
  };

  const handleDayCompletion = () => {
    if (!currentUser) return;
    
    // Only allow completion if we are working on the current active day
    if (viewingDayId !== currentUser.currentDay) {
        setView(ViewState.DASHBOARD);
        return;
    }

    const db = getDB();
    // Create a clean copy of the user object with a new array for completedDays
    const updatedUser: UserProgress = { 
        ...currentUser,
        completedDays: [...currentUser.completedDays]
    };
    
    // Add current day to completed if not already
    if (!updatedUser.completedDays.includes(updatedUser.currentDay)) {
        updatedUser.completedDays.push(updatedUser.currentDay);
    }
    
    // Move to next day if available
    if (updatedUser.currentDay < 10) {
        updatedUser.currentDay += 1;
    }
    
    // Save
    db[updatedUser.username] = updatedUser;
    saveDB(db);
    setCurrentUser(updatedUser);
    
    // Reset local task state
    setCompletedTasksInDay([]);
    
    // Check if finished all 10 days
    if (updatedUser.completedDays.length === 10) {
        setView(ViewState.COMPLETION);
    } else {
        setView(ViewState.DASHBOARD);
    }
  };

  // --- Renders ---

  if (view === ViewState.LOGIN) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
          <h1 className="text-2xl font-bold text-center text-slate-800 mb-2">
            {isLoginMode ? 'התחברות' : 'יצירת חשבון חדש'}
          </h1>
          <p className="text-center text-slate-500 mb-8">
            {isLoginMode 
                ? 'ברוכים השבים! הכניסו את שם המשתמש שלכם.' 
                : 'התחילו את תהליך החימום שלכם עוד היום.'}
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">שם משתמש</label>
              <input 
                type="text" 
                value={usernameInput}
                onChange={(e) => {
                    setUsernameInput(e.target.value);
                    setLoginError('');
                }}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 outline-none transition-all"
                placeholder="לדוגמה: israel_cohen"
              />
              {loginError && (
                <p className="text-red-500 text-sm mt-2">{loginError}</p>
              )}
            </div>
            
            <Button fullWidth onClick={handleAuthSubmit}>
              {isLoginMode ? 'המשך' : 'צור חשבון'}
            </Button>
            
            <div className="text-center mt-4">
                <button 
                    onClick={() => {
                        setIsLoginMode(!isLoginMode);
                        setLoginError('');
                        setUsernameInput('');
                    }}
                    className="text-brand-teal text-sm hover:underline"
                >
                    {isLoginMode ? 'אין לך חשבון? הירשם כאן' : 'יש לך חשבון? התחבר כאן'}
                </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === ViewState.COMPLETION) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 relative overflow-hidden">
        {/* Confetti-like background elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-brand-teal/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-brand-sky/10 rounded-full blur-xl animate-pulse delay-700"></div>

        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 text-center relative z-10">
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <Trophy size={48} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">כל הכבוד!</h1>
          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            המספר שלך מחומם ומוכן לחיבור לבוט SaleUp 🎉
          </p>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 mb-8">
            <p className="text-sm text-slate-500">
              סיימת בהצלחה את כל 10 הימים של תוכנית החימום.
            </p>
          </div>
          <Button fullWidth onClick={() => setView(ViewState.DASHBOARD)}>
            חזור למסך הראשי
          </Button>
        </div>
      </div>
    );
  }

  if (view === ViewState.DAY_DETAIL && currentDayConfig) {
    const allChecked = currentDayConfig.tasks.every(t => completedTasksInDay.includes(t.id));
    // Determine if this is a historical view (viewing a past day)
    const isHistoryView = currentUser ? viewingDayId < currentUser.currentDay : false;
    const isCompletedView = currentUser?.completedDays.includes(viewingDayId);
    
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <div className="bg-white shadow-sm p-4 flex items-center sticky top-0 z-20">
           <button 
             onClick={() => setView(ViewState.DASHBOARD)} 
             className="p-2 hover:bg-slate-100 rounded-full mr-2 text-slate-600"
           >
             <ChevronRight />
           </button>
           <h2 className="font-bold text-lg">{currentDayConfig.title}</h2>
        </div>

        <div className="flex-1 p-6 max-w-2xl mx-auto w-full">
          <div className="bg-gradient-to-br from-brand-teal to-brand-sky text-white p-6 rounded-2xl shadow-lg mb-8">
            <h1 className="text-2xl font-bold mb-2">{currentDayConfig.title}</h1>
            <p className="opacity-90">{currentDayConfig.description}</p>
            <div className="mt-4 flex items-center gap-2 text-sm bg-white/20 w-fit px-3 py-1 rounded-full">
                <span>רמת פעילות:</span>
                <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className={`w-2 h-2 rounded-full ${i < (currentDayConfig.intensity / 20) ? 'bg-white' : 'bg-white/30'}`} />
                    ))}
                </div>
            </div>
          </div>

          <h3 className="font-bold text-slate-800 mb-4 text-lg">רשימת משימות להיום</h3>
          
          <div className="space-y-3">
            {currentDayConfig.tasks.map(task => (
              <div 
                key={task.id}
                onClick={() => handleTaskToggle(task.id)}
                className={`flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
                  ${completedTasksInDay.includes(task.id) 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-white border-slate-100 hover:border-brand-teal/30'}
                `}
              >
                <div className={`w-6 h-6 rounded border-2 flex items-center justify-center mt-0.5 ml-4 transition-colors
                   ${completedTasksInDay.includes(task.id)
                     ? 'bg-green-500 border-green-500 text-white'
                     : 'border-slate-300 bg-white'}
                `}>
                  {completedTasksInDay.includes(task.id) && <Check size={14} />}
                </div>
                <span className={`flex-1 leading-relaxed ${completedTasksInDay.includes(task.id) ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                  {task.text}
                </span>
              </div>
            ))}
          </div>

          {/* Modal / Success State when all checked */}
          {allChecked && (
            <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center p-4 z-50 animate-in fade-in duration-300">
               <div className="bg-white rounded-3xl p-8 w-full max-w-sm text-center animate-in slide-in-from-bottom-10 duration-300">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check size={32} />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-slate-900">
                    {isCompletedView ? 'יום זה הושלם כבר' : 'היום הושלם בהצלחה! 🎉'}
                  </h3>
                  <p className="text-slate-500 mb-6">
                    {isCompletedView 
                        ? 'כל המשימות ביום זה כבר סומנו בעבר.' 
                        : 'סיימת את כל המשימות להיום. המספר שלך מתחמם מצוין.'}
                  </p>
                  
                  {isHistoryView || isCompletedView ? (
                      <Button fullWidth onClick={() => setView(ViewState.DASHBOARD)}>
                        חזור ללוח הבקרה
                      </Button>
                  ) : (
                      <Button fullWidth onClick={handleDayCompletion}>
                        {currentDayConfig.id === 10 ? 'סיים תהליך' : 'המשך ליום הבא'}
                      </Button>
                  )}
               </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // DASHBOARD VIEW
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-md mx-auto px-6 py-4 flex justify-between items-center">
           <div className="text-sm font-bold text-brand-teal">SALE UP WARMUP</div>
           <button 
            onClick={() => setView(ViewState.LOGIN)}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-md mx-auto p-6">
        {/* User Welcome */}
        <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">
                שלום, {currentUser?.username} 👋
            </h1>
            <p className="text-slate-500">
                התקדמות: {currentUser?.completedDays.length} מתוך 10 ימים
            </p>
            
            <div className="w-full bg-slate-200 rounded-full h-2.5 mt-4">
                <div 
                    className="bg-brand-teal h-2.5 rounded-full transition-all duration-500" 
                    style={{ width: `${((currentUser?.completedDays.length || 0) / 10) * 100}%` }}
                ></div>
            </div>
        </div>

        {/* Vertical Timeline */}
        <div className="relative pb-10">
          {WARMUP_PLAN.map((day, index) => {
            let status: 'locked' | 'open' | 'completed' = 'locked';
            if (currentUser?.completedDays.includes(day.id)) {
                status = 'completed';
            } else if (currentUser?.currentDay === day.id) {
                status = 'open';
            }

            return (
              <TimelineItem 
                key={day.id}
                day={day}
                status={status}
                onClick={() => {
                    if (status !== 'locked') {
                        setViewingDayId(day.id);
                        // If day is completed, we show all tasks as checked
                        if (status === 'completed') {
                            setCompletedTasksInDay(day.tasks.map(t => t.id));
                        } else {
                            // If it's the current day, reset (or load if we had persistence for partial)
                            setCompletedTasksInDay([]);
                        }
                        setView(ViewState.DAY_DETAIL);
                    }
                }}
                isLast={index === WARMUP_PLAN.length - 1}
              />
            );
          })}
        </div>
      </main>
    </div>
  );
}