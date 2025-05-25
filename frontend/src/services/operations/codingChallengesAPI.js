import { apiConnector } from "../apiConnector";

const BASE_URL = "http://localhost:8080/api";

export const codingChallengesEndpoints = {
  GET_ALL_CHALLENGES: BASE_URL + "/problems",
  GET_CHALLENGE_DETAILS: BASE_URL + "/problems",
  SUBMIT_SOLUTION: BASE_URL + "/submissions/submit",
  GET_ALL_SUBMISSIONS: BASE_URL + "/submissions",
};

export const getAllChallenges = async () => {
  try {
    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    
    const response = await apiConnector(
      "GET", 
      codingChallengesEndpoints.GET_ALL_CHALLENGES,
      null,
      headers
    );
    
    console.log("API Response:", response);
    if (!response.data) {
      throw new Error("No data received from server");
    }
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error("GET_ALL_CHALLENGES API ERROR............", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch challenges"
    };
  }
};

export const getChallengeDetails = async (challengeId) => {
  try {
    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await apiConnector(
      "GET",
      `${codingChallengesEndpoints.GET_CHALLENGE_DETAILS}/${challengeId}`,
      null,
      headers
    );
    
    console.log("Challenge Details Response:", response);
    if (!response.data) {
      throw new Error("No data received from server");
    }
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error("GET_CHALLENGE_DETAILS API ERROR............", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch problem details"
    };
  }
};

export const submitSolution = async (challengeId, data) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return {
        success: false,
        message: "Please login to submit your solution"
      };
    }

    const response = await apiConnector(
      "POST",
      `${codingChallengesEndpoints.SUBMIT_SOLUTION}/${challengeId}?language=${data.language}`,
      { sourceCode: data.sourceCode },
      {
        Authorization: `Bearer ${token}`
      }
    );
    
    console.log("Submit Solution Response:", response);
    if (!response.data) {
      throw new Error("No data received from server");
    }
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error("SUBMIT_SOLUTION API ERROR............", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to submit solution"
    };
  }
};

export const getAllSubmissions = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No token found for submissions");
      return {
        success: false,
        message: "Please login to view submissions"
      };
    }

    console.log("Fetching submissions with token:", token);
    const response = await apiConnector(
      "GET",
      codingChallengesEndpoints.GET_ALL_SUBMISSIONS,
      null,
      {
        Authorization: `Bearer ${token}`
      }
    );
    
    console.log("Raw Submissions Response:", response);
    
    if (!response || !response.data) {
      console.error("Invalid response format:", response);
      throw new Error("Invalid response from server");
    }

    // Transform the data if needed
    const submissions = Array.isArray(response.data) ? response.data : response.data.submissions || [];
    console.log("Processed submissions:", submissions);

    return {
      success: true,
      data: submissions
    };
  } catch (error) {
    console.error("GET_ALL_SUBMISSIONS API ERROR:", error);
    console.error("Error details:", {
      message: error.message,
      response: error.response,
      status: error.response?.status
    });
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch submissions"
    };
  }
};