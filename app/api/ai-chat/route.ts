import { NextResponse } from "next/server";

// Advanced System Prompt - Now more flexible
const SYSTEM_PROMPT = `You are AGRINOVA AI, an advanced agricultural expert assistant for farmers in Cameroon and Africa.

You are knowledgeable about ALL agricultural topics including:
- Crop farming (all crops grown in Cameroon and Africa)
- Livestock and poultry farming
- Soil science and management
- Pest and disease identification and control
- Farming best practices and innovative techniques
- Agricultural technology and IoT solutions
- Weather, climate patterns, and their impact on farming
- Market trends and pricing for agricultural products
- Farm management, planning, and business
- Agricultural inputs (seeds, fertilizers, pesticides, feed)
- Irrigation and water management systems
- Post-harvest handling, storage, and processing
- Agricultural economics and policy
- Climate change adaptation strategies
- Sustainable and organic farming
- Agroforestry and conservation agriculture
- Agricultural research and innovation
- Successful farmers and agronomists in Africa
- Agricultural education and training
- Farming equipment and machinery

RESPONSE GUIDELINES:
- Provide comprehensive, detailed answers (200-500+ words)
- Include specific numbers, rates, and practical examples
- Reference Cameroon and African conditions
- Structure responses with clear sections
- Give actionable recommendations
- Include success stories and examples when relevant
- Be encouraging and supportive
- Acknowledge regional differences (North vs South, dry vs wet areas)

If you don't know specific local details, provide general agricultural knowledge and suggest consulting local experts.

Always respond in clear, simple language that farmers can understand.`;

// Comprehensive Knowledge Base with Detailed Answers
const knowledgeBase: Record<string, (query: string) => string> = {
  "maize": (q) => `🌽 **MAIZE PRODUCTION GUIDE FOR CAMEROON**

**📅 Optimal Planting Times:**
- First season: March-April
- Second season: August-September
- Avoid planting during peak rainy season (July-August)

**🌱 Seed Selection & Treatment:**
- Use improved varieties: CMS 8704, CMS 9015, TZSR-W
- Treat seeds with fungicide before planting
- Use 20-25 kg of seeds per hectare
- Seed rate: 2-3 seeds per hole, thin to 1 plant later

**🌿 Spacing & Planting:**
- Row spacing: 75-80cm
- Plant spacing: 25-30cm
- Plant population: 53,000-55,000 plants/ha
- Planting depth: 3-5cm
- Plant in straight lines for easy weeding

**🧪 Fertilizer Recommendations (per hectare):**
- At planting: 200-300kg NPK 15-15-15
- At 4-6 weeks: 100-150kg Urea (top dressing)
- For low fertility soils: Add 50kg DAP
- Apply fertilizer 5-10cm away from plant

**🐛 Common Pests & Control:**
1. **Stem Borers**: Use neem extract (1:20 ratio), or recommended insecticides
2. **Fall Armyworm**: Monitor weekly, use biological control (Bacillus thuringiensis)
3. **Maize Streak Virus**: Plant resistant varieties, control leafhoppers
4. **Smut Disease**: Remove and destroy infected plants

**💧 Water Management:**
- Critical periods: Tasseling and grain filling
- Water requirement: 400-600mm per season
- Irrigate if rainfall is insufficient
- Avoid waterlogging

**🌾 Harvesting & Post-Harvest:**
- Harvest when husks turn yellow-brown (30-35% moisture)
- Dry to 12-13% moisture for storage
- Store in clean, dry containers
- Use hermetic storage (PICS bags) to prevent weevils

**📊 Expected Yields:**
- Traditional farming: 1.5-2.5 tons/ha
- Good management: 3-4 tons/ha
- Excellent management: 5-6 tons/ha

**⚠️ Common Mistakes to Avoid:**
- Planting too late
- Not using improved varieties
- Applying fertilizer incorrectly
- Harvesting too early
- Poor storage practices

**💡 Tip**: Rotate maize with legumes (beans, groundnuts) to maintain soil fertility.`,

  "cassava": (q) => `🌿 **CASSAVA PRODUCTION GUIDE FOR CAMEROON**

**📅 Best Planting Periods:**
- March-May (main season)
- August-September (second season)
- Plant at start of rainy season for best results

**🌱 Variety Selection:**
- Improved varieties: TMS 30572, TMS 4(2)1425, TMS 96/1414
- Consider local varieties adapted to your area
- Choose disease-resistant varieties

**🌿 Propagation:**
- Use 25-30cm stem cuttings
- Select stems from mature plants (8-12 months old)
- Cuttings should have 5-7 nodes
- Plant at 45° angle for better rooting

**🌾 Spacing & Planting:**
- Spacing: 50-60cm x 80-100cm
- Plant population: 10,000-12,000 plants/ha
- Intercrop with maize or groundnuts for better land use

**🧪 Fertilizer Application:**
- At planting: 100-150kg/ha NPK 15-15-15
- For poor soils: Add 50kg/ha DAP
- Apply fertilizer in a band 10cm from the plant
- Avoid direct contact with cuttings

**🐛 Pests & Diseases:**
1. **Cassava Mosaic Disease**: Plant resistant varieties, roque infected plants
2. **Cassava Mealybug**: Use biological control (Anagyrus lopezi)
3. **Cassava Green Mite**: Use predatory mites
4. **Whitefly**: Control with neem extract

**⏰ Harvesting:**
- Early varieties: 8-10 months
- Medium varieties: 10-14 months
- Late varieties: 14-18 months
- Best quality at 12-18 months
- Harvest when leaves start yellowing

**📊 Expected Yields:**
- Traditional: 10-15 tons/ha
- Improved varieties with good management: 20-30 tons/ha
- Excellent management: 35-40 tons/ha

**💡 Post-Harvest Tips:**
- Process within 2-3 days of harvest
- Can be stored in the ground for up to 24 months
- Process into gari, flour, or starch for longer shelf life
- Proper processing reduces cyanide content`,

  "climate": (q) => `🌤️ **CLIMATE AND FARMING IN CAMEROON**

**Climate Zones of Cameroon:**

**1. Coastal Zone (South, Littoral, Southwest)**
- Rainfall: 2000-4000mm annually
- Temperature: 24-28°C
- Main crops: Cocoa, oil palm, rubber, plantains, cassava
- Challenges: High humidity, soil leaching

**2. Forest Zone (East, Centre, South)**
- Rainfall: 1500-2500mm annually
- Temperature: 22-27°C
- Main crops: Cocoa, coffee, cassava, maize, groundnuts
- Challenges: Soil acidity, weed pressure

**3. Highland Zone (West, Northwest)**
- Rainfall: 1500-2500mm annually
- Temperature: 15-24°C
- Main crops: Coffee, tea, Irish potatoes, vegetables, maize
- Challenges: Soil erosion, landslides

**4. Northern Zone (North, Far North)**
- Rainfall: 400-1000mm annually
- Temperature: 25-40°C
- Main crops: Cotton, groundnuts, sorghum, millet, maize
- Challenges: Drought, desertification

**5. Extreme North (Far North, Adamawa)**
- Rainfall: <400mm annually
- Temperature: 25-42°C
- Main crops: Sorghum, millet, cowpeas, sesame
- Challenges: Severe drought, water scarcity

**Climate Change Impacts:**
- Unpredictable rainfall patterns
- Rising temperatures
- Increased pest outbreaks
- Soil degradation
- Water scarcity

**Adaptation Strategies:**
- Use climate-resilient crop varieties
- Implement water conservation
- Practice agroforestry
- Adopt conservation agriculture
- Diversify crops and livestock
- Use climate-smart farming techniques

**Current Weather:**
- For specific weather in your area, check the weather widget on the farmer dashboard.
- If you need specific climate data, I can help with general patterns.`,

  "farmer": (q) => `👨‍🌾 **SUCCESSFUL FARMERS AND AGRONOMISTS IN CAMEROON**

**Notable Agricultural Leaders:**

**1. Zachary T. (Farmer, Bamenda)**
- Known for: Organic vegetable farming
- Success story: Built a thriving vegetable business with 2 hectares
- Method: Uses drip irrigation and organic fertilizers
- Crops: Cabbage, tomatoes, peppers, carrots

**2. Marie-Claire N. (Agronomist, Yaoundé)**
- Expertise: Soil science and crop management
- Works with: Cassava and maize farmers
- Known for: Helping farmers increase yields by 40%
- Focus: Soil testing and fertilizer recommendations

**3. Paul Atanga (Farmer, Nkongsamba)**
- Known for: Cocoa farming and processing
- Success: Built a cocoa processing business
- Method: Uses sustainable practices
- Exports: Processed cocoa to Europe

**4. Jean-Pierre M. (Agronomist, Garoua)**
- Expertise: Crop rotation and soil conservation
- Works with: Cotton and groundnut farmers
- Known for: Teaching farmers sustainable practices
- Focus: Combating desertification

**Farming Success Tips:**
- Diversify crops to reduce risk
- Practice crop rotation
- Use improved varieties
- Test soil regularly
- Join farmer cooperatives
- Attend agricultural training
- Use modern farming techniques

**Where to Find Agricultural Experts:**
1. IRAD (Institute of Agricultural Research for Development)
2. MINADER (Ministry of Agriculture)
3. Local farmer cooperatives
4. Agricultural extension agents
5. Universities and agricultural colleges

**💡 Tip:** Connect with successful farmers in your area to learn best practices.`,

  "agronomist": (q) => `🧑‍🌾 **AGRICULTURAL EXPERTS IN CAMEROON**

**How Agronomists Can Help You:**

**1. Soil Analysis:**
- Test soil pH, nutrients, and fertility
- Recommend fertilizers and soil amendments
- Help improve soil health

**2. Crop Management:**
- Select appropriate crop varieties
- Advise on planting techniques
- Optimize spacing and planting dates
- Improve yields

**3. Pest and Disease Management:**
- Identify pests and diseases
- Recommend appropriate treatments
- Develop pest prevention strategies

**4. Farm Planning:**
- Design farm layout
- Plan crop rotations
- Develop sustainable farming systems
- Optimize resource use

**5. Business Support:**
- Help with farm business planning
- Advise on marketing and sales
- Improve farm profitability

**Where to Find Agronomists:**
1. **IRAD** - Institute of Agricultural Research for Development
2. **MINADER** - Ministry of Agriculture and Rural Development
3. **Farmer Cooperatives** - Local farmer organizations
4. **Agricultural Universities** - Universities of Dschang, Ngaoundéré
5. **Private Agronomists** - Consultancy services

**Cost of Consultation:**
- Government agronomist: Free (extension services)
- Private agronomist: 25,000-100,000 CFA per visit
- Soil testing: 10,000-25,000 CFA

**💡 How to Prepare for a Consultation:**
- Know your farm size and crops
- Have soil test results ready
- Bring photos of crop problems
- Ask specific questions
- Take notes during the consultation`,

  "weather": (q) => `🌤️ **WEATHER AND AGRICULTURE IN CAMEROON**

**Current Weather Widget:**
Check the weather widget on your dashboard for real-time weather in your area.

**Agricultural Weather Patterns:**

**Rainy Seasons:**
- First season: March-June
- Second season: August-November
- Dry seasons: November-February (long dry), June-August (short dry)

**Impact on Crops:**
- **Maize**: Needs rainfall during flowering and grain filling
- **Cassava**: Grows well in rainy season, can survive dry periods
- **Tomatoes**: Best in dry season with irrigation
- **Cocoa**: Needs consistent rainfall throughout the year

**Weather Forecasting:**
- Use the weather widget on your dashboard
- Check reliable weather apps (OpenWeather, Weather.com)
- Follow local weather forecasts

**🌧️ Signs of Rain:**
- Cloud formation (cumulonimbus clouds)
- Dropping atmospheric pressure
- Rising humidity
- Wind direction changes
- Cooling temperatures

**Protecting Crops from Weather:**
- Use windbreaks (trees, hedges)
- Install shade nets for sensitive crops
- Use mulch to retain soil moisture
- Build drainage systems
- Use crop covers for frost protection

**🌡️ Climate Advisory:**
- For specific weather advice, ask about:
  - "What's the weather outlook for planting?"
  - "When should I harvest my crop?"
  - "How much rainfall is expected this season?"

**💡 Tip:** Monitor weather patterns regularly and plan your farming activities accordingly.`,

  "help": (q) => `🌾 **AGRINOVA AI - COMPLETE AGRICULTURAL GUIDE**

I'm your comprehensive agricultural assistant. Here's everything I can help you with:

**🌱 Crops (All Types):**
- Maize, cassava, tomatoes, cocoa, coffee, plantains
- Rice, sorghum, millet, groundnuts, cowpeas
- Irish potatoes, sweet potatoes, yams, cassava
- Fruits: mangoes, bananas, oranges, pineapples
- Vegetables: onions, cabbage, peppers, carrots

**🐄 Livestock:**
- Cattle, goats, sheep, pigs, poultry
- Rabbits, guinea pigs, fish farming
- Housing, feeding, breeding, health

**🧪 Soil Science:**
- Soil types and characteristics
- Soil testing and interpretation
- Fertilizer recommendations
- Soil pH management
- Soil conservation and erosion control

**🐛 Pest & Disease Control:**
- Pest identification and management
- Biological control methods
- Chemical control guidelines
- Integrated Pest Management (IPM)

**💧 Water Management:**
- Irrigation systems (drip, sprinkler, surface)
- Rainwater harvesting
- Water conservation techniques
- Drainage and flood management

**🌤️ Climate & Weather:**
- Climate zones of Cameroon
- Weather patterns and forecasting
- Climate change adaptation
- Seasonal planting calendars

**📊 Farm Business:**
- Farm planning and management
- Cost analysis and budgeting
- Marketing agricultural products
- Farm profitability and growth
- Agribusiness opportunities

**🌿 Sustainable Agriculture:**
- Organic farming practices
- Agroforestry and conservation
- Crop rotation and intercropping
- Sustainable farming systems

**👨‍🌾 Agricultural Community:**
- Successful farmers and agronomists
- Farmer cooperatives
- Agricultural training programs
- Government support programs

**❓ How to Ask Questions:**
- Be specific: "How do I control fall armyworm?"
- Include details: "I'm in Centre Region, growing tomatoes"
- Ask for clarification: "What do you mean by pH?"
- Upload photos: Show plant problems

**📷 I can analyze:**
- Photos of crop problems
- Pest and disease images
- Soil conditions

**What would you like to learn about farming today?**`
};

function getKnowledgeBaseResponse(message: string): string {
  const lower = message.toLowerCase();
  
  // Check for specific keywords
  for (const [key, responseFn] of Object.entries(knowledgeBase)) {
    if (lower.includes(key)) {
      return responseFn(message);
    }
  }
  
  // Default comprehensive response
  return `🌾 **AGRINOVA AI - Agricultural Assistant**

I'm here to help you with all aspects of agriculture in Cameroon and Africa.

**📚 I can help with:**

🌱 **All Crops**: Maize, cassava, tomatoes, cocoa, coffee, plantains, rice, sorghum, millet, groundnuts, fruits, vegetables, and more

🐄 **Livestock**: Cattle, goats, poultry, pigs, sheep, rabbits, fish farming

🧪 **Soil**: Testing, fertilizers, pH management, organic matter, conservation

🐛 **Pests**: Identification, organic and chemical control, IPM strategies

💧 **Water**: Irrigation systems, rainwater harvesting, conservation techniques

🌤️ **Climate**: Weather patterns, climate change adaptation, seasonal planning

📊 **Business**: Farm planning, marketing, profitability, agribusiness

👨‍🌾 **Community**: Successful farmers, agronomists, cooperatives, training

🌿 **Sustainability**: Organic farming, agroforestry, conservation agriculture

**❓ How to Ask:**
- "How do I plant [crop] in Cameroon?"
- "What pests affect [crop] and how do I control them?"
- "What fertilizer should I use for [crop]?"
- "How do I start [type of farming]?"
- "Tell me about [agricultural topic]"

**📷 Upload photos** for diagnosis
**🎙️ Record voice** for quick questions

**What would you like to learn about farming today?** 🌾`;
}

export async function POST(request: Request) {
  try {
    // Parse the request
    let message = "";
    let conversationHistory: any[] = [];
    let files: any[] = [];

    const contentType = request.headers.get("content-type") || "";
    
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      message = (formData.get("message") as string) || "";
      const historyStr = (formData.get("conversationHistory") as string) || "[]";
      conversationHistory = JSON.parse(historyStr);
      const fileEntries = formData.getAll("files");
      files = fileEntries.map((file: any) => ({
        name: file.name || "unnamed",
        type: file.type || "application/octet-stream",
        size: file.size || 0,
      }));
    } else {
      const body = await request.json();
      message = body.message || "";
      conversationHistory = body.conversationHistory || [];
      files = body.files || [];
    }

    if (!message && files.length === 0) {
      return NextResponse.json({
        response: "🌾 **AGRINOVA AI - Agricultural Assistant**\n\nPlease ask me a question about agriculture or upload files for analysis.",
        mode: "Knowledge Base",
        model: "AGRINOVA KB"
      });
    }

    // Only block completely unrelated topics (very strict)
    const offTopicKeywords = [
      'medical diagnosis', 'doctor advice', 'hospital treatment', 'medicine prescription',
      'legal advice', 'court case', 'lawsuit', 'criminal', 
      'finance investment', 'stock market', 'crypto trading', 'bitcoin investment',
      'relationship advice', 'dating tips', 'marriage counseling'
    ];

    const isOffTopic = offTopicKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    );

    if (isOffTopic) {
      return NextResponse.json({
        response: "🌾 **AGRINOVA AI - Agricultural Assistant**\n\nI specialize in agriculture, but I can help with a wide range of agricultural topics!\n\n**I can help with:**\n🌱 Crops (all types)\n🐄 Livestock\n🧪 Soil science\n🐛 Pest control\n💧 Water management\n🌤️ Climate & weather\n📊 Farm business\n👨‍🌾 Agricultural community\n🌿 Sustainable farming\n\n**What would you like to know about agriculture?** I'm happy to discuss farming, crops, livestock, weather, successful farmers, agronomists, and anything else related to agriculture! 🌾",
        mode: "Knowledge Base",
        model: "AGRINOVA KB"
      });
    }

    let response = "";
    let usedAI = false;
    let model = "AGRINOVA Knowledge Base";

    // Try OpenRouter AI with DeepSeek
    if (process.env.OPENROUTER_API_KEY) {
      try {
        const aiMessages = [
          { role: "system", content: SYSTEM_PROMPT },
          ...conversationHistory.slice(-15),
          { role: "user", content: message + (files.length > 0 ? `\n\nFiles uploaded: ${files.map(f => f.name).join(", ")}` : "") }
        ];

        const aiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "deepseek/deepseek-chat-v3-0324:free",
            messages: aiMessages,
            max_tokens: 1500,
            temperature: 0.7,
          }),
          signal: AbortSignal.timeout(15000),
        });

        if (aiResponse.ok) {
          const data = await aiResponse.json();
          response = data.choices?.[0]?.message?.content || "";
          if (response && response.length > 20) {
            usedAI = true;
            model = "DeepSeek AI";
          }
        }
      } catch (error) {
        console.error("AI Error:", error);
      }
    }

    // Fallback to enhanced knowledge base
    if (!response) {
      response = getKnowledgeBaseResponse(message);
      
      // Add file context if files were uploaded
      if (files.length > 0) {
        response += `\n\n📎 **Files Uploaded:** ${files.map(f => f.name).join(", ")}\n\nI've noted your uploaded files. Feel free to ask specific questions about them or provide more details about what you need help with.`;
      }
      
      model = "AGRINOVA Knowledge Base";
    }

    return NextResponse.json({
      response: response,
      mode: usedAI ? "AI" : "Knowledge Base",
      model: model,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json({
      response: `🌾 **AGRINOVA AI - Agricultural Assistant**

I'm here to help with all your agricultural questions!

**🌱 I can help with:**
- Crops: Maize, cassava, tomatoes, cocoa, coffee, rice, vegetables, fruits
- Livestock: Cattle, goats, poultry, pigs, sheep, fish farming
- Soil: Testing, fertilizers, pH management, conservation
- Pests: Identification, organic and chemical control
- Water: Irrigation, rainwater harvesting, conservation
- Climate: Weather patterns, climate change, seasonal planning
- Business: Farm planning, marketing, profitability
- Community: Successful farmers, agronomists, cooperatives

**❓ Ask me anything about agriculture in Cameroon and Africa!**

Please try again or ask a specific question. I'm here to help! 🌾`,
      mode: "Knowledge Base",
      model: "Fallback",
    });
  }
}