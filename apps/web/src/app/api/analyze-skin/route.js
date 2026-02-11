import { auth } from "@/auth";
import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    console.log("[Analyze Skin] Starting analysis...");
    const body = await request.json();
    const { imageUri, bodyPart = "face" } = body;

    console.log(
      "[Analyze Skin] Image URI received:",
      imageUri ? `${imageUri.substring(0, 50)}...` : "none",
    );
    console.log("[Analyze Skin] Body part:", bodyPart);

    if (!imageUri) {
      console.error("[Analyze Skin] No image URI provided");
      return Response.json({ error: "Image URI is required" }, { status: 400 });
    }

    // Ensure we have a proper base64 data URL
    let base64Image = imageUri;
    if (!imageUri.startsWith("data:image")) {
      console.log(
        "[Analyze Skin] Image doesn't start with data:image, converting...",
      );
      base64Image = `data:image/jpeg;base64,${imageUri}`;
    }

    // Customize prompt based on body part
    const bodyPartPrompts = {
      face: `Look at this facial selfie and analyze the facial skin's cosmetic appearance. Focus on complexion, pores, texture, and tone on the face.`,
      hand: `Look at this image of a hand and analyze the hand skin's appearance. Focus on texture, age spots, dryness, veins visibility, and overall skin condition of the hand. Note any signs of sun damage, roughness, or moisture levels.`,
      arm: `Look at this image of an arm and analyze the arm skin's appearance. Focus on texture, tone evenness, any visible concerns like keratosis pilaris (bumpy texture), dryness, sun damage, or discoloration. Assess overall skin smoothness and health.`,
    };

    const bodyPartFocus = bodyPartPrompts[bodyPart] || bodyPartPrompts.face;

    console.log("[Analyze Skin] Calling Google Gemini API...");

    // Analyze the image using Google Gemini 2.5 Flash with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.error("[Analyze Skin] Gemini API timeout after 55 seconds");
      controller.abort();
    }, 55000); // 55 second timeout

    const analysisResponse = await fetch(
      `/integrations/google-gemini-2-5-flash/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `You are a friendly beauty and skincare advisor helping someone choose skincare products. You're NOT providing medical diagnosis - just cosmetic beauty and dermatological observations for their shopping.

${bodyPartFocus}

IMPORTANT: Respond with ONLY a valid JSON object. Do not include any text before or after the JSON. Do not use markdown code blocks. Start your response with { and end with }.

Return this exact JSON structure:

{
  "healthScore": 85,
  "skinType": "combination/dry/oily/normal",
  "conditions": [
    {
      "name": "Observed cosmetic concern (like 'age spots', 'dry patches', 'uneven texture', 'keratosis pilaris', etc.)",
      "severity": "mild/moderate/significant",
      "location": "specific area",
      "description": "What you visually notice"
    }
  ],
  "poreAnalysis": {
    "size": "small/medium/large",
    "visibility": "minimal/moderate/noticeable",
    "concernAreas": ["areas if any"]
  },
  "texture": {
    "quality": "smooth/rough/bumpy/textured/combination",
    "concerns": ["any texture observations like roughness, bumps, fine lines, etc."]
  },
  "summary": "Your skin looks beautiful! Here are some product ideas to enhance your natural appearance.",
  "recommendations": {
    "productTypes": [
      {
        "type": "Moisturizing Hand Cream" (or appropriate product type),
        "ingredients": ["Urea", "Glycerin"],
        "examples": ["Eucerin Advanced Repair Hand Cream"],
        "reason": "To address the specific concern"
      }
    ],
    "morningRoutine": [
      {
        "step": 1,
        "product": "Product type",
        "instructions": "How to apply"
      }
    ],
    "nightRoutine": [
      {
        "step": 1,
        "product": "Product type",
        "instructions": "How to apply"
      }
    ],
    "dailyTips": [
      "Apply SPF to protect from sun damage",
      "Moisturize regularly",
      "Relevant care tips"
    ]
  }
}

Remember: Return ONLY the JSON object. No text before or after. This is purely for shopping guidance and beauty enhancement.`,
            },
            {
              role: "user",
              content: base64Image,
            },
          ],
        }),
        signal: controller.signal,
      },
    );

    clearTimeout(timeoutId);
    console.log(
      "[Analyze Skin] Gemini response status:",
      analysisResponse.status,
    );

    if (!analysisResponse.ok) {
      const errorText = await analysisResponse.text();
      console.error("[Analyze Skin] Gemini API error:", errorText);
      console.error("[Analyze Skin] Full error response:", {
        status: analysisResponse.status,
        statusText: analysisResponse.statusText,
        body: errorText,
      });
      return Response.json(
        { error: "Failed to analyze image", details: errorText },
        { status: 500 },
      );
    }

    const analysisData = await analysisResponse.json();
    console.log("[Analyze Skin] Analysis data received:", analysisData);
    const content = analysisData.choices[0].message.content;

    // Parse the JSON response from GPT-4 Vision
    let skinAnalysis;
    try {
      console.log("[Analyze Skin] Parsing response...");
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        skinAnalysis = JSON.parse(jsonMatch[0]);
        console.log("[Analyze Skin] Successfully parsed JSON response");
      } else {
        console.warn(
          "[Analyze Skin] No JSON found in response, using fallback",
        );
        // If no JSON found, create a structured response from the text
        skinAnalysis = {
          healthScore: 75,
          skinType: "combination",
          summary: content,
          conditions: [],
          poreAnalysis: {
            size: "medium",
            visibility: "moderate",
            concernAreas: [],
          },
          texture: {
            quality: "Analysis completed",
            concerns: [],
          },
          recommendations: {
            productTypes: [],
            morningRoutine: [],
            nightRoutine: [],
            dailyTips: [],
          },
        };
      }
    } catch (parseError) {
      console.error(
        "[Analyze Skin] Error parsing GPT-4 Vision response:",
        parseError,
      );
      // Fallback response
      skinAnalysis = {
        healthScore: 75,
        skinType: "combination",
        summary: content,
        conditions: [],
        poreAnalysis: {
          size: "medium",
          visibility: "moderate",
          concernAreas: [],
        },
        texture: {
          quality: "Analysis completed",
          concerns: [],
        },
        recommendations: {
          productTypes: [],
          morningRoutine: [],
          nightRoutine: [],
          dailyTips: [],
        },
      };
    }

    console.log("[Analyze Skin] Analysis complete, returning results");

    // Fetch real product recommendations
    console.log("[Analyze Skin] Fetching real products...");
    const enrichedProductTypes = [];

    if (skinAnalysis.recommendations?.productTypes) {
      for (const productType of skinAnalysis.recommendations.productTypes) {
        try {
          // Search for products based on the product type and key ingredients
          const searchQuery = `${productType.type} ${productType.ingredients?.[0] || ""} skincare`;
          console.log(`[Analyze Skin] Searching for: ${searchQuery}`);

          const productSearchResponse = await fetch(
            `/integrations/product-search/search?q=${encodeURIComponent(searchQuery)}&product_condition=NEW&min_rating=4&page=1`,
            { method: "GET" },
          );

          if (productSearchResponse.ok) {
            const productData = await productSearchResponse.json();

            // Check if data exists and is an array
            const dataArray = Array.isArray(productData.data)
              ? productData.data
              : Array.isArray(productData)
                ? productData
                : [];

            const products = dataArray.slice(0, 3).map((product) => ({
              id: product.product_id,
              title: product.product_title,
              image: product.product_photos?.[0] || null,
              price: product.offer?.price || "N/A",
              store: product.offer?.store_name || "Various stores",
              rating: product.product_rating || null,
              reviewCount: product.product_num_reviews || 0,
              url: product.offer?.offer_page_url || product.product_page_url,
              shipping: product.offer?.shipping || null,
            }));

            enrichedProductTypes.push({
              ...productType,
              products,
            });
            console.log(
              `[Analyze Skin] Found ${products.length} products for ${productType.type}`,
            );
          } else {
            console.warn(
              `[Analyze Skin] Failed to fetch products for ${productType.type}`,
            );
            enrichedProductTypes.push({
              ...productType,
              products: [],
            });
          }
        } catch (error) {
          console.error(
            `[Analyze Skin] Error fetching products for ${productType.type}:`,
            error,
          );
          enrichedProductTypes.push({
            ...productType,
            products: [],
          });
        }
      }

      // Replace product types with enriched versions
      skinAnalysis.recommendations.productTypes = enrichedProductTypes;
    }

    console.log("[Analyze Skin] Products enriched, returning final results");

    // Save the scan to the database if user is authenticated
    try {
      const session = await auth();
      if (session?.user?.id) {
        console.log(
          "[Analyze Skin] Saving scan to database for user:",
          session.user.id,
        );

        await sql`
          INSERT INTO skin_scans (
            user_id, photo_url, skin_type, texture_analysis, 
            concerns, recommendations, confidence_score
          ) VALUES (
            ${session.user.id}, 
            ${imageUri.substring(0, 200)}, 
            ${skinAnalysis.skinType || null}, 
            ${JSON.stringify(skinAnalysis.texture || {})}, 
            ${JSON.stringify(skinAnalysis.conditions || [])}, 
            ${JSON.stringify(skinAnalysis.recommendations || {})},
            ${skinAnalysis.healthScore || null}
          )
        `;

        console.log("[Analyze Skin] Scan saved to database successfully");
      } else {
        console.log(
          "[Analyze Skin] No authenticated user, skipping database save",
        );
      }
    } catch (dbError) {
      console.error("[Analyze Skin] Error saving to database:", dbError);
      // Continue anyway - don't fail the request if DB save fails
    }

    return Response.json({
      success: true,
      analysis: skinAnalysis,
      rawResponse: content,
    });
  } catch (error) {
    console.error("[Analyze Skin] Error analyzing skin:", error);
    console.error("[Analyze Skin] Error stack:", error.stack);
    return Response.json(
      { error: "An error occurred during analysis", details: error.message },
      { status: 500 },
    );
  }
}
