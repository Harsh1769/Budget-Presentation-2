import { GoogleGenAI } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

let ai: GoogleGenAI | null = null;

// Only initialize AI if API key exists
if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export async function getBudgetHighlights() {
  const prompt = `
    Generate a detailed summary of the India Union Budget 2026-27. 
    Include:
    1. Key allocations for Agriculture, Education, and Infrastructure.
    2. Fiscal Deficit target for 2026-27.
    3. 'Rupee Comes From' and 'Rupee Goes To' data percentages.
    4. Major tax slab changes in the New Tax Regime.
    5. Vision for 'Viksit Bharat @ 2047'.
    
    Format the response strictly as a JSON object with matching keys.
  `;

  const fallbackData = {
    agriculture: "₹1.62 Lakh Crore for Digital Public Infrastructure",
    education: "₹1.39 Lakh Crore with focus on Skill India 2.0",
    infrastructure: "₹12.2 Lakh Crore (Capex increase of 11%)",
    fiscalDeficit: "4.2%",
    rupeeComesFrom: [
      { name: "Income Tax", value: 19 },
      { name: "GST", value: 18 },
      { name: "Corporation Tax", value: 17 },
      { name: "Borrowings", value: 27 },
      { name: "Excise Duty", value: 5 },
      { name: "Customs", value: 4 },
      { name: "Non-Tax Receipts", value: 9 },
      { name: "Non-Debt Capital", value: 1 }
    ],
    rupeeGoesTo: [
      { name: "Interest Payments", value: 20 },
      { name: "States' Share", value: 20 },
      { name: "Central Sector Schemes", value: 16 },
      { name: "Centrally Sponsored Schemes", value: 8 },
      { name: "Defense", value: 8 },
      { name: "Subsidies", value: 6 },
      { name: "Finance Commission", value: 9 },
      { name: "Pensions", value: 4 },
      { name: "Other Expenditure", value: 9 }
    ],
    taxSlabs: "Standard deduction increased to ₹75,000. Tax-free income up to ₹12 Lakhs.",
    viksitBharat: "Focus on 4 pillars: Poor, Women, Youth, and Farmers (Gyan) for a developed India by 2047."
  };

  // If no API key → return fallback safely
  if (!ai) {
    console.warn("No Gemini API key found. Using fallback data.");
    return fallbackData;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const result = JSON.parse(response.text || "{}");
    return { ...fallbackData, ...result };

  } catch (error) {
    console.error("Error fetching budget data:", error);
    return fallbackData;
  }
}