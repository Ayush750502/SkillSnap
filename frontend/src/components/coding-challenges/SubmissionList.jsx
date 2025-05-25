import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllSubmissions } from '../../services/operations/codingChallengesAPI';

function SubmissionList() {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        console.log("Starting to fetch submissions...");
        const result = await getAllSubmissions();
        console.log("Submissions API result:", result);
        
        if (result.success && Array.isArray(result.data)) {
          console.log("Setting submissions:", result.data);
          setSubmissions(result.data);
        } else {
          console.error("Failed to fetch submissions:", result.message);
          setError(result.message || 'Failed to fetch submissions');
          setSubmissions([]);
        }
      } catch (err) {
        console.error('Error in fetchSubmissions:', err);
        setError('Failed to fetch submissions. Please try again later.');
        setSubmissions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  const getStatusStyle = (status) => {
    console.log("Status received:", status);
    console.log("Status type:", typeof status);
    console.log("Status uppercase:", status?.toUpperCase());
    console.log("Is accepted?", status?.toUpperCase() === "ACCEPTED");
    
    if (!status) return 'bg-gray-500/20 text-gray-500 border border-gray-500';
    
    const upperStatus = status.toUpperCase();
    console.log("Upper status:", upperStatus);
    
    if (upperStatus === "ACCEPTED") {
      return 'bg-[#00FF00]/20 text-[#00FF00] border border-[#00FF00]';
    }
    return 'bg-[#FF0000]/20 text-[#FF0000] border border-[#FF0000]';
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch (error) {
      console.error('Error formatting date:', dateString, error);
      return 'Invalid Date';
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-8 flex justify-center items-center min-h-[400px]">
        <div className="spinner"></div>
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
        <h2 className="text-3xl font-bold text-richblack-5 mb-8">
          Your Submissions
        </h2>

        {error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        ) : submissions.length === 0 ? (
          <div className="bg-richblack-800 rounded-lg p-8 text-center">
            <p className="text-richblack-100 text-lg">No submissions yet.</p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 bg-yellow-50 text-black px-6 py-2 rounded-md font-semibold hover:scale-95 transition-transform"
            >
              Try Some Problems
            </button>
          </div>
        ) : (
          <div className="bg-richblack-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-richblack-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-richblack-5">Problem</th>
                    <th className="px-6 py-4 text-left text-richblack-5">Language</th>
                    <th className="px-6 py-4 text-left text-richblack-5">Status</th>
                    <th className="px-6 py-4 text-left text-richblack-5">Submitted At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-richblack-700">
                  {submissions.map((submission, index) => {
                    console.log("Rendering submission:", submission);
                    return (
                    <tr key={submission.id || index} className="hover:bg-richblack-700">
                      <td className="px-6 py-4">
                        <button
                          onClick={() => navigate(`/coding-challenges/${submission.problemId}`)}
                          className="text-blue-500 hover:text-blue-400"
                        >
                          {submission.problemTitle || 'Unknown Problem'}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full bg-richblack-700 text-richblack-5 text-sm">
                          {submission.language || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full ${getStatusStyle(submission.status)} text-sm font-medium`}>
                          {submission.status || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-richblack-100">
                        {formatDate(submission.submittedAt)}
                      </td>
                    </tr>
                  )})}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SubmissionList; 