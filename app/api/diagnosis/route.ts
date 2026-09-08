import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { saveUpload, UploadError } from "@/lib/uploads";

export async function POST(request: Request) {
  const session = await getSession();

  if (!session || session.role !== "FARMER") {
    return NextResponse.json(
      { error: "Only farmer accounts can request a diagnosis." },
      { status: 403 }
    );
  }

  const formData = await request.formData();
  const cropName = formData.get("cropName");
  const description = formData.get("description");
  const image = formData.get("image");
  const voiceNote = formData.get("voiceNote"); // ✅ New: voice note file

  if (
    typeof cropName !== "string" ||
    !cropName.trim() ||
    typeof description !== "string" ||
    !description.trim()
  ) {
    return NextResponse.json(
      { error: "Please tell us the crop and describe the issue." },
      { status: 400 }
    );
  }

  let imageUrl: string | undefined;
  let voiceNoteUrl: string | undefined;

  // Handle image upload
  if (image instanceof File && image.size > 0) {
    try {
      imageUrl = await saveUpload(image, "diagnosis");
    } catch (uploadError) {
      if (uploadError instanceof UploadError) {
        return NextResponse.json({ error: uploadError.message }, { status: 400 });
      }
      throw uploadError;
    }
  }

  // ✅ Handle voice note upload
  if (voiceNote instanceof File && voiceNote.size > 0) {
    try {
      voiceNoteUrl = await saveUpload(voiceNote, "voice-notes");
    } catch (uploadError) {
      if (uploadError instanceof UploadError) {
        return NextResponse.json({ error: uploadError.message }, { status: 400 });
      }
      throw uploadError;
    }
  }

  // Create diagnosis
  const diagnosis = await prisma.diagnosis.create({
    data: {
      cropName: cropName.trim(),
      description: description.trim(),
      imageUrl,
      voiceNoteUrl, // ✅ Store voice note URL
      farmerId: session.userId,
    },
  });

  // --- AI Diagnosis (Optional) ---
  let aiSuggestion: string | null = null;
  
  if (process.env.CLAUDE_API_KEY) {
    try {
      // Build prompt with voice note info
      let prompt = `A farmer in Cameroon needs help with their ${cropName.trim()} crop.\n\n`;
      prompt += `Farmer's description: "${description.trim()}"\n\n`;
      if (voiceNoteUrl) {
        prompt += `The farmer also recorded a voice note explaining the issue. (Voice note available at: ${voiceNoteUrl})\n\n`;
      }
      prompt += `Please provide agricultural advice for this farmer.`;

      // Call AI API (simplified)
      // ... Claude API call here

    } catch (error) {
      console.error("AI diagnosis failed:", error);
    }
  }

  return NextResponse.json(
    { 
      success: true, 
      diagnosis,
      aiSuggestion: aiSuggestion || undefined
    }, 
    { status: 201 }
  );
}

// GET method (unchanged)
export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }

  if (session.role === "FARMER") {
    const diagnoses = await prisma.diagnosis.findMany({
      where: { farmerId: session.userId },
      orderBy: { createdAt: "desc" },
      include: { agronomist: { select: { name: true } } },
    });
    return NextResponse.json({ diagnoses });
  }

  if (session.role === "AGRONOMIST") {
    const diagnoses = await prisma.diagnosis.findMany({
      where: {
        OR: [{ agronomistId: session.userId }, { status: "PENDING" }],
      },
      orderBy: { createdAt: "desc" },
      include: { farmer: { select: { name: true, town: true, region: true } } },
    });
    return NextResponse.json({ diagnoses });
  }

  return NextResponse.json({ error: "Not authorized." }, { status: 403 });
}