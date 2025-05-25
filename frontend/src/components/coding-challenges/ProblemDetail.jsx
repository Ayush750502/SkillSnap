import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { getChallengeDetails, submitSolution } from '../../services/operations/codingChallengesAPI';

function ProblemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [code, setCode] = useState('// Write your solution here\n');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        console.log("Fetching problem details for ID:", id);
        const result = await getChallengeDetails(id);
        console.log("Problem details result:", result);
        
        if (result.success && result.data) {
          console.log("Setting problem data:", result.data);
          setProblem(result.data);
        } else {
          console.error("Failed to fetch problem:", result.message);
          setError(result.message || 'Failed to fetch problem details');
        }
      } catch (err) {
        console.error('Error fetching problem:', err);
        setError('Failed to fetch problem details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProblem();
    } else {
      setError('Invalid problem ID');
      setLoading(false);
    }
  }, [id]);

  const handleSubmit = async () => {
    if (!code.trim()) {
      setError('Please write some code before submitting');
      return;
    }

    try {
      setSubmitting(true);
      setOutput('');
      setError('');
      setSuccess('');
      
      console.log("Submitting solution:", { id, language, code });
      const result = await submitSolution(id, {
        sourceCode: code,
        language: language
      });
      console.log("Submission result:", result);

      if (result.success) {
        setSuccess('Solution submitted successfully!');
        setOutput(result.data?.result || 'Submission successful!');
      } else {
        setError(result.message || 'Failed to submit solution');
      }
    } catch (error) {
      console.error('Error submitting solution:', error);
      setError('Error submitting solution. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-8 flex justify-center items-center min-h-[400px]">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">Problem not found.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Navigation Header */}
      <div className="bg-richblack-800 py-4 px-4 mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-richblack-5">
            SkillSnap
          </h1>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/')}
              className="text-richblack-5 hover:text-yellow-50 transition-colors"
            >
              Problems
            </button>
            <button
              onClick={() => navigate('/submissions')}
              className="text-richblack-5 hover:text-yellow-50 transition-colors"
            >
              Submissions
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-8">
        <div className="bg-richblack-800 rounded-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-richblack-5 mb-2">
            {problem.title}
          </h1>
          <p className="text-richblack-100 mb-6">
            {problem.description}
          </p>
          {problem.examples && problem.examples.length > 0 && (
            <>
              <h2 className="text-xl font-semibold text-richblack-5 mb-4">
                Examples:
              </h2>
              {problem.examples.map((example, index) => (
                <div key={index} className="mb-4 bg-richblack-900 p-4 rounded-lg">
                  <p className="text-richblack-100"><span className="font-medium">Input:</span> {example.input}</p>
                  <p className="text-richblack-100"><span className="font-medium">Output:</span> {example.output}</p>
                  {example.explanation && (
                    <p className="text-richblack-100"><span className="font-medium">Explanation:</span> {example.explanation}</p>
                  )}
                </div>
              ))}
            </>
          )}
        </div>

        <div className="bg-richblack-800 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-richblack-5">
              Solution
            </h2>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-richblack-900 text-richblack-5 px-4 py-2 rounded-lg"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
            </select>
          </div>
          
          <div className="mb-4">
            <Editor
              height="400px"
              defaultLanguage={language}
              value={code}
              onChange={setCode}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
              }}
              className="rounded-lg overflow-hidden"
            />
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4">
              {success}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={submitting || !code.trim()}
            className={`bg-yellow-50 text-black px-6 py-2 rounded-md font-semibold transition-all duration-200 ${
              submitting || !code.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:scale-95'
            }`}
          >
            {submitting ? 'Submitting...' : 'Submit Solution'}
          </button>

          {output && (
            <div className="mt-6">
              <div className="h-px bg-richblack-700 my-4" />
              <h2 className="text-xl font-semibold text-richblack-5 mb-4">
                Output:
              </h2>
              <div className="w-full min-h-[100px] bg-richblack-900 p-4 rounded-lg text-richblack-100">
                {output}
              </div>
            </div>
          )}

          {problem.sampleSolution && (
            <div className="mt-6">
              <div className="h-px bg-richblack-700 my-4" />
              <h2 className="text-xl font-semibold text-richblack-5 mb-4">
                Sample Solution:
              </h2>
              <div className="w-full bg-richblack-900 p-4 rounded-lg text-richblack-100">
                <pre>
                  <code>{problem.sampleSolution}</code>
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProblemDetail; 