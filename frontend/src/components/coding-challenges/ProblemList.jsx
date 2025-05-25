import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllChallenges } from '../../services/operations/codingChallengesAPI';

function ProblemList() {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const result = await getAllChallenges();
        console.log("Problems result:", result);
        
        if (result.success) {
          setProblems(result.data);
        } else {
          setError(result.message);
        }
      } catch (err) {
        console.error('Error fetching problems:', err);
        setError('Failed to fetch coding challenges. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  const handleProblemClick = (id) => {
    navigate(`/coding-challenges/${id}`);
  };

  const handleSubmissionsClick = () => {
    navigate('/submissions');
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'text-green-500';
      case 'medium':
        return 'text-yellow-500';
      case 'hard':
        return 'text-red-500';
      default:
        return 'text-gray-500';
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
              onClick={handleSubmissionsClick}
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
          Coding Problems
        </h2>
        {problems.length === 0 ? (
          <p className="text-richblack-100">No coding problems available at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {problems.map((problem) => (
              <div
                key={problem.id}
                className="bg-richblack-800 rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer"
                onClick={() => handleProblemClick(problem.id)}
              >
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-richblack-5 mb-2">
                    {problem.title}
                  </h2>
                  <p className={`${getDifficultyColor(problem.difficulty)} font-medium mb-2`}>
                    {problem.difficulty}
                  </p>
                  <p className="text-richblack-100 line-clamp-2">
                    {problem.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProblemList; 