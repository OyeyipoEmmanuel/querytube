type RefineResponse = {
  refined_query: string;
  ai_summary: string;
};

function parseRefineResponse(raw: string): RefineResponse | null {
  try {
    return JSON.parse(raw) as RefineResponse;
  } catch {
    const start = raw.indexOf('{');
    const end = raw.lastIndexOf('}');
    if (start !== -1 && end !== -1 && end > start) {
      try {
        return JSON.parse(raw.slice(start, end + 1)) as RefineResponse;
      } catch {
        return null;
      }
    }
    return null;
  }
}

export async function refineQueryWithGemini(params: {
  userQuery: string;
}): Promise<{ refinedQuery: string; aiSummary: string }> {
  const { userQuery } = params;
  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_API_KEY) {
    throw new Error('Missing GROQ_API_KEY');
  }
  const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

  const systemInstruction =
    'You are an expert YouTube search prompt optimizer. ' +
    'Convert a user intent into a high-signal YouTube search query that will return helpful beginner-friendly videos. ' +
    'Return ONLY JSON matching the provided schema. ' +
    'Avoid clickbait. Prefer "beginner", "roadmap", "for beginners", and "step by step" when appropriate.';

  const userPrompt =
    `User intent:\n${userQuery}\n\n` +
    'JSON schema:\n' +
    '{ "refined_query": string, "ai_summary": string }\n\n' +
    'Rules:\n' +
    '- refined_query must be <= 80 characters when possible\n' +
    '- ai_summary should be 1 short sentence explaining why these results match the user intent\n';

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      temperature: 0.2,
      messages: [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: userPrompt },
      ],
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`Groq API error (${response.status}): ${body || response.statusText}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const rawText = data.choices?.[0]?.message?.content || '';
  const parsed = parseRefineResponse(rawText);

  const refinedQuery = parsed?.refined_query?.trim() || userQuery.trim();
  const aiSummary = parsed?.ai_summary?.trim() || 'Top picks based on your learning intent.';
  console.log('[groq-refine]', {
    input: userQuery,
    model: GROQ_MODEL,
    refinedQuery,
    aiSummary,
  });
  return { refinedQuery, aiSummary };
}

