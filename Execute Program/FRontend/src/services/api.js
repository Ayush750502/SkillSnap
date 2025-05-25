import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = {
  // Problems
  getAllProblems: () => axios.get(`${API_BASE_URL}/problems`),
  getProblemById: (id) => axios.get(`${API_BASE_URL}/problems/${id}`),
  createProblem: (problem) => axios.post(`${API_BASE_URL}/problems`, problem),
  updateProblem: (id, problem) => axios.put(`${API_BASE_URL}/problems/${id}`, problem),
  deleteProblem: (id) => axios.delete(`${API_BASE_URL}/problems/${id}`),

  // Submissions
  submitSolution: (problemId, language, sourceCode) => 
    axios.post(`${API_BASE_URL}/submissions/submit/${problemId}?language=${language}`, { sourceCode }),
  getSubmissionsByProblem: (problemId) => 
    axios.get(`${API_BASE_URL}/submissions/problem/${problemId}`),
  getAllSubmissions: () => axios.get(`${API_BASE_URL}/submissions`)
};

export default api; 