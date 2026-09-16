import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/passwords";
import { saveUpload } from "@/lib/uploads";

export const runtime = "nodejs"; // needed for sharp

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Expected multipart/form-data" },
        { status: 400 }
      );
    }

    const form = await req.formData();

    const fullName = (form.get("fullName") as string | null)?.trim();
    const email = (form.get("email") as string | null)?.trim().toLowerCase();
    const phone = (form.get("phone") as string | null)?.trim();
    const region = (form.get("region") as string | null)?.trim();
    const town = (form.get("town") as string | null)?.trim();
    const farmingType = (form.get("farmingType") as string | null)?.trim();
    const farmSize = (form.get("farmSize") as string | null)?.trim() || null;
    const password = form.get("password") as string | null;
    const confirmPassword = form.get("confirmPassword") as string | null;
    const iotInterest = form.get("iotInterest") === "true";
    const terms = form.get("terms") === "true";

    // ---- Validation ----
    const missing: string[] = [];
    if (!fullName) missing.push("fullName");
    if (!email) missing.push("email");
    if (!phone) missing.push("phone");
    if (!region) missing.push("region");
    if (!town) missing.push("town");
    if (!farmingType) missing.push("farmingType");
    if (!password) missing.push("password");

    if (missing.length) {
      return NextResponse.json(
        { error: `Missing required fields: ${missing.join(", ")}` },
        { status: 400 }
      );
    }

    if (password!.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }
    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match." },
        { status: 400 }
      );
    }
    if (!terms) {
      return NextResponse.json(
        { error: "You must accept the Terms & Conditions." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email!)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // ---- Duplicate check ----
    const existing = await (prisma as any).user.findUnique({
      where: { email: email! },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Email already exists. Please login instead." },
        { status: 409 }
      );
    }

    // ---- File uploads ----
    const profilePhoto = form.get("profilePhoto") as File | null;
    const idFront = form.get("idFront") as File | null;
    const idBack = form.get("idBack") as File | null;
    const farmProof = form.get("farmProof") as File | null;

    if (!profilePhoto || profilePhoto.size === 0) {
      return NextResponse.json(
        { error: "Profile photo is required." },
        { status: 400 }
      );
    }
    if (!idFront || idFront.size === 0) {
      return NextResponse.json(
        { error: "National ID front is required." },
        { status: 400 }
      );
    }
    if (!idBack || idBack.size === 0) {
      return NextResponse.json(
        { error: "National ID back is required." },
        { status: 400 }
      );
    }

    let photoUrl: string;
    let idFrontUrl: string;
    let idBackUrl: string;
    let farmProofUrl: string | null = null;

    try {
      photoUrl = (await saveUpload(profilePhoto, "profiles")).url;
      idFrontUrl = (await saveUpload(idFront, "ids")).url;
      idBackUrl = (await saveUpload(idBack, "ids")).url;
      if (farmProof && farmProof.size > 0) {
        farmProofUrl = (await saveUpload(farmProof, "farm-proofs")).url;
      }
    } catch (uploadErr) {
      console.error("Upload failed:", uploadErr);
      return NextResponse.json(
        { error: "File upload failed. Check file type and size." },
        { status: 400 }
      );
    }

    // ---- Create user + farmer in one transaction ----
    const passwordHash = await hashPassword(password!);

    const user = await (prisma as any).user.create({
      data: {
        email: email!,
        passwordHash,
        name: fullName,
        phone,
        role: "FARMER",
        region,
        town,
        photoUrl,
        iotInterest,
        emailVerified: false,
        verified: false,
        farmer: {
          create: {
            farmingType,
            farmSize,
            idFrontUrl,
            idBackUrl,
            farmProofUrl,
          },
        },
      },
      include: { farmer: true },
    });

    return NextResponse.json(
      {
        message: "Account created successfully!",
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            photoUrl: user.photoUrl,
            region: user.region,
            town: user.town,
            iotInterest: user.iotInterest,
          },
          farmer: user.farmer,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Farmer register error:", err);
    return NextResponse.json(
      { error: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}