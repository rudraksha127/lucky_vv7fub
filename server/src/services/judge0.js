import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config()

const JUDGE0_URL = process.env.JUDGE0_URL
const JUDGE0_AUTH_TOKEN = process.env.JUDGE0_AUTH_TOKEN

const LANGUAGE_IDS = {
  cpp: 54,
  java: 62,
  python: 71,
  javascript: 63,
}

export const submitCode = async (code, language, testCases) => {
  const languageId = LANGUAGE_IDS[language]
  if (!languageId) throw new Error(`Unsupported language: ${language}`)

  const results = []
  
  // If no JUDGE0_URL is configured, use a mock for local dev
  if (!JUDGE0_URL) {
    for (const tc of testCases) {
      // Simulate network delay
      await new Promise(r => setTimeout(r, 300))
      
      // Basic mock check: if code includes a simplistic string like "return []" it might fail, 
      // but let's just make it pass for testing purposes unless it's completely empty.
      const isError = code.trim().length === 0;
      
      results.push({
        passed: !isError,
        input: tc.input,
        expected: tc.output,
        got: isError ? 'Error: Empty code' : tc.output,
        runtime: Math.random() * 5 + 1, // 1-6 ms
        memory: Math.random() * 1000 + 2000, // 2000-3000 KB
        status: isError ? 'Compilation Error' : 'Accepted',
      })
    }
    return results
  }

  for (const tc of testCases) {
    try {
      const { data } = await axios.post(
        `${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`,
        {
          source_code: code,
          language_id: languageId,
          stdin: tc.input,
          expected_output: tc.output,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            ...(JUDGE0_AUTH_TOKEN ? { 'X-Auth-Token': JUDGE0_AUTH_TOKEN } : {}),
          },
          timeout: 10000,
        }
      )

      const passed = data.status?.id === 3 // Accepted
      results.push({
        passed,
        input: tc.input,
        expected: tc.output,
        got: data.stdout?.trim() || data.stderr?.trim() || '',
        runtime: parseFloat(data.time) * 1000 || 0, // ms
        memory: data.memory || 0, // KB
        status: data.status?.description || 'Unknown',
      })
    } catch (err) {
      results.push({
        passed: false,
        input: tc.input,
        expected: tc.output,
        got: '',
        runtime: 0,
        memory: 0,
        status: 'Error',
      })
    }
  }
  return results
}
