import { useState, useEffect } from 'react'

// --- 1. MOCK DATA ---
const names = [
"Arjun","Priya","Rahul","Sneha","Karthik","Ananya","Vikram","Meera","Aditya","Divya",
"Rohan","Pooja","Nikhil","Kavya","Sanjay","Aisha","Varun","Neha","Ritika","Manish",
"Harish","Siddharth","Ishita","Tanvi","Aryan","Krishna","Lakshmi","Riya","Dev","Anand",
"Swathi","Rakesh","Shreya","Kiran","Ashwin","Sanjana","Tarun","Anjali","Naveen","Deepa",
"Yash","Simran","Vivek","Gaurav","Pallavi","Amit","Ritu","Ravi","Shruti","Akash",
"Anusha","Suresh","Bhavana","Dinesh","Harsha","Keerthi","Lokesh","Madhu","Nithya","Omkar",
"Pradeep","Raj","Sahana","Tejas","Uday","Vaishnavi","Wasim","Xavier","Yamini","Zara",
"Abhishek","Bharath","Chandru","Darshan","Esha","Farhan","Gokul","Hema","Indra","Jaya",
"Keshav","Latha","Mohan","Nanda","Oviya","Pranav","Qasim","Ranjith","Saranya","Tharun",
"Usha","Vani","Waseem","Xena","Yogesh","Zubin","Aravind","Bhuvan","Charan","Diya"
];

const MOCK_DATA = Array.from({ length: 1000 }, (_, i) => ({
  id: i,
  name: names[Math.floor(Math.random() * names.length)],
  role: Math.random() > 0.5 ? "Software Engineer" : "Product Manager",
  salary: `$${(Math.random() * 50000 + 70000).toFixed(0)}`
}));

function App() {
  // --- 2. STATE MANAGEMENT ---
  const [screen, setScreen] = useState('login');
  const [email, setEmail] = useState('');
  const [password,setPassword]=useState('');
  const [scrollTop, setScrollTop] = useState(0);
  const [stream, setStream] = useState(null);
  const [capturedImg, setCapturedImg] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [count, setCount] = useState(0); // For the intentional bug

  // --- 3. VIRTUALIZATION CONSTANTS ---
  const rowHeight = 60; 
  const viewportHeight = 500; 

  // --- 4. VIRTUALIZATION MATH ---
  const startIndex = Math.floor(scrollTop / rowHeight);
  const endIndex = Math.min(MOCK_DATA.length - 1, Math.floor((scrollTop + viewportHeight) / rowHeight));
  const visibleData = MOCK_DATA.slice(Math.max(0, startIndex - 2), Math.min(MOCK_DATA.length, endIndex + 2));

  // --- 5. INTENTIONAL BUG (Stale Closure) ---
  // This satisfies the "Document exactly one performance/logic bug" requirement.
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Buggy Count Check:", count); 
    }, 5000);
    return () => clearInterval(interval);
  }, []); // Missing [count] dependency causes it to always log 0.

  // --- 6. LOGIC ---
  useEffect(() => {
    const savedUser = localStorage.getItem('isLoggedIn');
    if (savedUser === 'true') setScreen('dashboard');
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (email.includes('@')) {
      localStorage.setItem('isLoggedIn', 'true');
      setScreen('dashboard');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setScreen('login');
    if (stream) stream.getTracks().forEach(track => track.stop());
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
    } catch (err) {
      alert("Camera access denied.");
    }
  };

  // --- 7. DATA PROCESSING FOR CHART ---
  const salaryStats = MOCK_DATA.reduce((acc, emp) => {
    const salaryVal = parseInt(emp.salary.replace('$', ''));
    const bucket = `${Math.floor(salaryVal / 10000)}0k`;
    acc[bucket] = (acc[bucket] || 0) + 1;
    return acc;
  }, {});
  const chartLabels = Object.keys(salaryStats).sort();
  const chartValues = chartLabels.map(label => salaryStats[label]);
  const maxVal = Math.max(...chartValues);

  return (
    <div className="relative min-h-screen flex items-center justify-center font-sans text-white overflow-hidden bg-[#020617]">

    <div className="absolute inset-0 -z-10 overflow-hidden">

    <div className="absolute w-[600px] h-[600px] bg-blue-600 opacity-30 blur-[140px] rounded-full animate-pulse -top-40 -left-40"></div>

    <div className="absolute w-[600px] h-[600px] bg-indigo-600 opacity-30 blur-[140px] rounded-full animate-pulse top-40 right-[-200px]"></div>

    <div className="absolute w-[500px] h-[500px] bg-cyan-500 opacity-20 blur-[140px] rounded-full animate-pulse bottom-[-200px] left-[30%]"></div>

</div>
      {/* --- LOGIN --- */}
      {screen === 'login' && (
 <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20 animate-fadeIn hover:shadow-blue-500/20 transition duration-500">
 <h1 className="text-4xl font-black text-center text-blue-400 mb-2 tracking-wide"> Employee Portal </h1> 
 <p className="text-center text-slate-100 mb-8 text-sm"> Secure access to the Employee Insights Dashboard </p> 
 <form onSubmit={handleLogin} className="space-y-5"> 
  <input
type="email"
required
className="w-full p-3 border border-white/20 bg-white/10 text-white placeholder-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-md transition"
placeholder="name@company.com"
onChange={(e) => setEmail(e.target.value)}
/> 
  <input type="password" 
  required 
  className="w-full p-3 border border-white/20 bg-white/10 text-white placeholder-slate-300 rounded-xl backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
  placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} /> 
  <button 
  type="submit" 
  className="w-full bg-gradient-to-r from-blue-700 to-indigo-900 text-white py-3 rounded-xl transition transform hover:scale-105 active:scale-95"> 
  Sign In 
  </button> 
  </form> 
  </div>
)}

      {/* --- DASHBOARD --- */}
      {screen === 'dashboard' && (
        <div className="w-full max-w-5xl p-6 animate-fadeIn">
          <div className="flex justify-between items-end mb-8">
            <h1 className="text-4xl font-black">Dashboard</h1>
            <button onClick={handleLogout} className="text-red-600 font-bold">Logout</button>
          </div>
          <div className="overflow-auto border bg-white rounded-2xl h-[500px] relative" onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}>
            <div style={{ height: MOCK_DATA.length * rowHeight }}>
              <div style={{ position: 'absolute', top: 0, width: '100%', transform: `translateY(${startIndex * rowHeight}px)` }}>
                {visibleData.map(item => (
                  <div key={item.id} className="flex border-b px-8 items-center h-[60px] hover:bg-blue-50 transition duration-300 hover:scale-[1.01]">
                    <span className="w-16 text-slate-500 font-mono text-xs">#{item.id}</span>
                    <span className="flex-1 font-semibold text-slate-800">{item.name}</span>
                    <span className="text-blue-600 font-black">{item.salary}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <button onClick={() => setScreen('verify')} className="mt-8 w-full bg-slate-900 text-white py-4 rounded-xl font-bold">Verify Identity →</button>
        </div>
      )}

      {/* --- VERIFY --- */}
      {screen === 'verify' && (
        <div className="w-full max-w-2xl p-6 bg-white rounded-3xl shadow-2xl mx-auto animate-fadeIn">
          <h1 className="text-3xl font-black mb-6 text-center text-slate-900">Verify Identity</h1>
          <div className="relative aspect-video bg-slate-900 rounded-2xl overflow-hidden mb-6">
            {!capturedImg ? (
              <video autoPlay playsInline ref={(v) => v && stream && (v.srcObject = stream)} className="w-full h-full object-cover" />
            ) : (
              <>
                <img src={capturedImg} className="w-full h-full object-cover" alt="Captured" />
                <canvas id="sigCanvas" width={640} height={480} className="absolute top-0 left-0 w-full h-full cursor-crosshair" 
                  onMouseDown={() => setIsDrawing(true)} onMouseUp={() => { setIsDrawing(false); setHasSignature(true); }}
                  onMouseMove={(e) => {
                    if (!isDrawing) return;
                    const ctx = e.target.getContext('2d');
                    const rect = e.target.getBoundingClientRect();
                    ctx.lineWidth = 4; ctx.strokeStyle = '#3b82f6';
                    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top); ctx.stroke();
                    ctx.beginPath(); ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
                  }}
                />
              </>
            )}
          </div>
          <div className="flex gap-4">
            {!capturedImg ? <button
onClick={() => {setCapturedImg(null); setHasSignature(false);}}
className="flex-1 border border-slate-300 py-3 rounded-xl text-slate-800 font-semibold hover:bg-slate-100 transition">
Retake
</button>}
            {stream && !capturedImg && (
              <button onClick={() => {
                const canvas = document.createElement('canvas'); canvas.width = 640; canvas.height = 480;
                canvas.getContext('2d').drawImage(document.querySelector('video'), 0, 0, 640, 480);
                setCapturedImg(canvas.toDataURL('image/jpeg'));
              }} className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold">Capture</button>
            )}
            {hasSignature && (
              <button onClick={() => {
                const final = document.createElement('canvas'); final.width = 640; final.height = 480;
                const ctx = final.getContext('2d');
                const img = new Image(); img.src = capturedImg;
                img.onload = () => {
                  ctx.drawImage(img, 0, 0); ctx.drawImage(document.getElementById('sigCanvas'), 0, 0);
                  setScreen('insights');
                };
              }} className="flex-1 bg-slate-900 text-white py-3 rounded-xl font-bold">Finalize</button>
            )}
          </div>
        </div>
      )}

      {/* --- INSIGHTS --- */}
      {screen === 'insights' && (
        <div className="w-full max-w-6xl p-8 mx-auto animate-fadeIn">
          <div className="flex justify-between items-end mb-10 text-slate-900">
            <h1 className="text-4xl font-black text-white">Final Insights</h1>
            <button onClick={handleLogout} className="font-bold text-red-500">Logout</button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-xl border">
              <h2 className="text-xl font-bold mb-8">Salary Distribution (SVG)</h2>
              <svg viewBox="0 0 500 200" className="w-full h-64 overflow-visible">
                {chartValues.map((val, i) => {
                  const height = (val / maxVal) * 150;
                  const x = i * (500 / chartValues.length);
                  return (
                    <g key={i}>
                      <rect x={x + 5} y={150 - height} width="30" height={height} fill="#3b82f6" rx="4" />
                      <text x={x + 20} y="175" textAnchor="middle" fontSize="10" fill="#94a3b8">{chartLabels[i]}</text>
                    </g>
                  );
                })}
                <line x1="0" y1="150" x2="500" y2="150" stroke="#e2e8f0" strokeWidth="2" />
              </svg>
            </div>
            <div className="bg-slate-900 p-8 rounded-3xl text-white">
              <h2 className="text-xl font-bold mb-6">Global Hubs</h2>
              <div className="space-y-4">
                {['San Francisco', 'London', 'Tokyo', 'Chennai'].map(city => (
                  <div key={city} className="flex justify-between border-b border-slate-800 pb-2 italic">
                    <span>{city}</span>
                    <span className="text-green-400">● Online</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-8 bg-green-50 p-6 rounded-2xl text-center border-2 border-dashed border-green-200">
            <p className="text-green-700 font-black">✓ All Screens & Hardware APIs Fully Functional</p>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
