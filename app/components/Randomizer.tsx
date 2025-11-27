"use client"
import { useState } from 'react';
import { Shuffle, Users, FileText, Plus, X } from 'lucide-react';

export default function Randomizer() {
//   const [teams, setTeams] = useState(['Team Alpha', 'Team Beta', 'Team Gamma']);
//   const [situations, setSituations] = useState([
//     {
//       situation: 'Company A - Tech Startup',
//       questions: [
//         'How would you approach their go-to-market strategy?',
//         'What metrics would you prioritize?',
//         'How would you scale their engineering team?'
//       ]
//     },
//     {
//       situation: 'Company B - Retail Chain',
//       questions: [
//         'How would you improve customer retention?',
//         'What digital transformation initiatives would you recommend?',
//         'How would you optimize their supply chain?'
//       ]
//     }
//   ]);
  
//   const [newTeam, setNewTeam] = useState<any>('');
//   const [newSituation, setNewSituation] = useState('');
//   const [newQuestion, setNewQuestion] = useState('');
//   const [tempQuestions, setTempQuestions] = useState<any>([]);
  
//   const [result, setResult] = useState(null);
//   const [isAnimating, setIsAnimating] = useState(false);

//   const addTeam = () => {
//     if (newTeam.trim()) {
//       setTeams([...teams, newTeam.trim()]);
//       setNewTeam('');
//     }
//   };

//   const removeTeam = (index:any) => {
//     setTeams(teams.filter((_, i) => i !== index));
//   };


//   const randomize = () => {
//     if (teams.length === 0 || situations.length === 0) return;
    
//     setIsAnimating(true);
    
//     setTimeout(() => {
//       const randomTeam = teams[Math.floor(Math.random() * teams.length)];
//       const randomSituation = situations[Math.floor(Math.random() * situations.length)];
      
//       setResult({
//         team: randomTeam,
//         situation: randomSituation
//       });
//       setIsAnimating(false);
//     }, 500);
//   };

  return (
    <div className="min-h-screen  p-4 rounded">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Team & Situation Randomizer
        </h1>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Teams Section */}
          <div className="bg-black rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-800">Teams</h2>
            </div>
            
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={""}
                onChange={(e) => console.log('change')}
                onKeyPress={(e) => e.key === 'Enter' && console.log("we will register")}
                placeholder="Enter team name"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={()=>{console.log('add team')}}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                <Plus size={20} />
              </button>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {/* {teams.map((team, index) => (
                <div key={index} className="flex items-center justify-between bg-blue-50 px-4 py-2 rounded-lg">
                  <span className="text-gray-700">{team}</span>
                  <button
                    onClick={() => removeTeam(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))} */}

              here we will render each team
            </div>
          </div>

          {/* Situations Section */}
          <div className="bg-black rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="text-indigo-600" />
              <h2 className="text-2xl font-semibold text-gray-800">Situations</h2>
            </div>
            
            <div className="mb-4">
              <input
                type="text"
                value={""}
                onChange={(e) => console.log("on situation change")}
                placeholder="Enter situation name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-2"
              />
              
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={""}
                  onChange={(e) => console.log("change")}
                  onKeyPress={(e) => e.key === 'Enter' && console.log('hello from questions')}
                  placeholder="Add a question"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={()=>{console.log("add new question")}}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  <Plus size={20} />
                </button>
              </div>

              {/* {tempQuestions.length > 0 && (
                <div className="space-y-1 mb-2 max-h-32 overflow-y-auto">
                  {tempQuestions.map((q, index) => (
                    <div key={index} className="flex items-center justify-between bg-indigo-50 px-3 py-1 rounded text-sm">
                      <span className="text-gray-700">{q}</span>
                      <button onClick={() => removeQuestion(index)} className="text-red-500">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )} */}
              {/* we must render questions here */}

              <button
                onClick={()=>{console.log('add new situation')
                }}
                // disabled={!newSituation.trim() || tempQuestions.length === 0}
                className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Add Situation
              </button>
            </div>

            <div className="space-y-3 max-h-48 overflow-y-auto">
                {/* render the situation */}
              {/* {situations.map((sit, index) => (
                <div key={index} className="bg-indigo-50 px-4 py-3 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-800">{sit.situation}</span>
                    <button
                      onClick={() => removeSituation(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={18} />
                    </button>
                  </div>
                  <div className="text-sm text-gray-600">
                    {sit.questions.length} question(s)
                  </div>
                </div>
              ))} */}
            </div>
          </div>
        </div>

        {/* Randomize Button */}
        <div className="text-center mb-8">
          <button
            onClick={()=>console.log("by clicking we will randomize the situations ")}
            // disabled={teams.length === 0 || situations.length === 0}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-lg text-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center gap-3 mx-auto"
          >
            {/* <Shuffle size={24} className={isAnimating ? 'animate-spin' : ''} /> */}
            Randomize
          </button>
        </div>

        {/* Result Section */}
        {/* {result && (
          <div className="bg-white rounded-lg shadow-2xl p-8 border-4 border-indigo-500">
            <h3 className="text-3xl font-bold text-center text-gray-800 mb-6">Result</h3>
            
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Users className="text-blue-600" />
                <h4 className="text-xl font-semibold text-gray-700">Selected Team:</h4>
              </div>
              <p className="text-2xl font-bold text-blue-600 ml-8">{result.team}</p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="text-indigo-600" />
                <h4 className="text-xl font-semibold text-gray-700">Situation:</h4>
              </div>
              <p className="text-2xl font-bold text-indigo-600 ml-8 mb-4">{result.situation.situation}</p>
              
              <div className="ml-8">
                <h5 className="text-lg font-semibold text-gray-700 mb-2">Questions:</h5>
                <ul className="space-y-2">
                  {result.situation.questions.map((q, index) => (
                    <li key={index} className="flex gap-2">
                      <span className="text-indigo-600 font-semibold">{index + 1}.</span>
                      <span className="text-gray-700">{q}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
}